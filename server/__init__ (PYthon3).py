from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, validators, SubmitField
from wtforms.validators import InputRequired, Email, Length, DataRequired, EqualTo
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from database_setup import Base, Conversations, User,Posts
from sqlalchemy import create_engine, asc
from sqlalchemy.orm import sessionmaker
from flask import session as Session
from flask_bootstrap import Bootstrap
from flask_cors import CORS, cross_origin
import pybase64
import hashlib
from Cryptodome.Cipher import AES
import uuid
import os
from Cryptodome.Random import get_random_bytes
from flask_wtf import Form
from datetime import datetime
from sqlalchemy import exc
import random
import urllib
import pyodbc
import sqlalchemy.dialects.mysql.pymysql
from pathlib import Path
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

from werkzeug.utils import secure_filename


UPLOAD_DIR: Path = Path(__file__).parent / 'uploads'
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mkv'}
app = Flask(__name__)
bootstrap = Bootstrap(app)
CORS(app)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['WTF_CSRF_ENABLED'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_DIR

engine = create_engine(
    "mysql+pymysql://admin:Passw0rd@localhost:3306/BlogDB?charset=utf8mb4")
DBSession = sessionmaker(bind=engine)
SQLALCHEMY_DATABASE_URI = engine
session = DBSession()
# session.close()
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
english_bot = ChatBot("Terminal" ,read_only=True, trainer='chatterbot.trainers.ChatterBotCorpusTrainer',
              storage_adapter='chatterbot.storage.SQLStorageAdapter',
              logic_adapters=[
                {
                'import_path': 'chatterbot.logic.BestMatch',
                'default_response': 'I am sorry, but I do not understand.',
                #'maximum_similarity_threshold': 0.75,
                # "import_path": "chatterbot.logic.BestMatch",
                "statement_comparison_function": "chatterbot.comparisons.levenshtein_distance",
                #"response_selection_method": "chatterbot.response_selection.get_first_response"
                },

                ],
                input_adapter="chatterbot.input.TerminalAdapter",
                output_adapter="chatterbot.output.TerminalAdapter",
                database_uri='mysql+pymysql://admin:Passw0rd@localhost:3306/BlogDB?charset=utf8mb4'
                )
trainer = ChatterBotCorpusTrainer(english_bot)
#trainer.train('chatterbot.corpus.english')#"chatterbot.corpus.custom.myown")
#english_bot = ['ch1', 'ch2', 'ch3']

BLOCK_SIZE = 16


def pad(data):
    length = BLOCK_SIZE - (len(data) % BLOCK_SIZE)
    return data + chr(length)*length


def unpad(data):
    return data[:-(data[-1])]


def decrypt(encrypted, key):
    encrypted = pybase64.b64decode(encrypted)
    IV = encrypted[:BLOCK_SIZE]
    aes = AES.new(key, AES.MODE_CBC, IV)
    return unpad(aes.decrypt(encrypted[BLOCK_SIZE:]))


@login_manager.user_loader
def load_user(user_id):
    return session.query(User).get(int(user_id))


@app.route("/login", methods=['POST'])
def login():
    key = b"1234567890123456"  # TODO change to something with more entropy
    rf = request.get_json()
    print(rf['LogInData'])
    dPass = str(decrypt(rf['LogInData']['password'], key), 'UTF-8')
    print(dPass)
    session = DBSession()
    try:
        user = session.query(User).filter_by(
            email=rf['LogInData']['email']).first()
        session.close()
    except UnboundLocalError:
        uData = {
            'uId': '', 'UName': '', 'UEmail': '', 'UPhone': '','Uimg':''
        }
        return jsonify({'Logged_in': 'Error', 'uData': uData})
    finally:
        if user:
            if user.Password == dPass:
                print('Logged_in')
                uData = {
                  'uId':user.public_id,  'UName': user.name, 'UEmail': user.email, 'UPhone': user.phone, 'Uimg':user.image_file
                }
                print((uData))
                return jsonify({'Logged_in': 'true', 'uData': uData})
            else:
                uData = {
                    'uId':'',  'UName': '', 'UEmail': '', 'UPhone': '','Uimg':''
                }
                return jsonify({'Logged_in': 'false', 'uData': uData})
        else:
            uData = {
                'UName': '', 'UEmail': '', 'UPhone': '','Uimg':''
            }
            return jsonify({'Logged_in': 'false', 'uData': uData})

    return jsonify({'Message': 'Server Error'})

@app.route("/chData", methods=['POST'])
def chData():
    rf = request.get_json()
    print(rf['cData']['id'])
    session = DBSession()
    userdata =session.query(User).filter(User.public_id==rf['cData']['id']).one()
    userdata.name=rf['cData']['UName']
    userdata.image_file=rf['cData']['Uimg']
    try:
        userdata.phone = rf['cData']['UPhone']
    except:
        print('server error')
        return jsonify({'DataUpdated': 'server error'})
    session.add(userdata)
    session.commit()
    session.close()
    print('Edited')
    return jsonify({'DataUpdated': 'User Data Updated'})

@app.route("/uProfile", methods=['POST'])
def uProfile():
    rf = request.get_json()
    print(rf)
    session = DBSession()
    userdata = session.query(User).filter(User.public_id == rf['uData']).one()
    session.close()
    uData={
        'uId':userdata.public_id,
        'UName':userdata.name,
        'UEmail':userdata.email,
        'UPhone':userdata.phone,
        'uImg':userdata.image_file
    }
    return jsonify(uData)


@app.route("/chPass", methods=['POST'])
def chPass():
    key = b"1234567890123456"  # TODO change to something with more entropy
    rf = request.get_json()
    print(rf)
    dpass = str(decrypt(rf['cData']['npass'], key), 'UTF-8')
    session = DBSession()
    userdata = session.query(User).filter(User.public_id == rf['cData']['id']).one()
    userdata.Password = dpass
    session.add(userdata)
    session.commit()
    session.close()
    print(dpass)

    return jsonify({'Message': 'User Data Updated'})

@app.route("/addPosts", methods=['POST'])
def addPosts():
    rf = request.get_json()
    session = DBSession()
    newPost = Posts(title=rf['PostData']['title'], content=rf['PostData']['content'], user_id=rf['PostData']['user_id'])
    session.add(newPost)
    session.commit()
    session.close()
    return  jsonify({'message':'Post Added Successfully'})


@app.route("/getPosts", methods=['GET'])
def getPosts():
    session = DBSession()
    allPosts = session.query(Posts.id,Posts.title,Posts.date_posted,Posts.content,User.name,Posts.user_id).filter(Posts.user_id==User.public_id)
    session.close()
    postsJson=[]
    count =0
    for post in allPosts:
        postsJson.append({
            'id':post.id,
            'title' :post.title,
       'date_posted':post.date_posted,
        'content':  post.content,
        'user_Name': post.name,
        'user_id': post.user_id

        })
    return  jsonify({'posts':postsJson})

@app.route("/register", methods=['POST'])
def register():
    key = b"1234567890123456"  # TODO change to something with more entropy
    rf = request.get_json()
    print(rf['RegData']['password'])

    dpass = str(decrypt(rf['RegData']['password'], key), 'UTF-8')
    print(dpass)
    session = DBSession()
    try:
        user = session.query(User).filter_by(
            email=rf['RegData']['email']).first()
        session.close()
    except UnboundLocalError:
        return jsonify({'Register': 'Please Check Your Inputs And Try Again'})

    finally:
        if not user:
            try:
                session = DBSession()
                newUser = User(public_id=str(uuid.uuid4(
                )), name=rf['RegData']['name'], email=rf['RegData']['email'], phone=rf['RegData']['phone'], Password=dpass)
                session.add(newUser)
                session.commit()
                session.close()
                return jsonify({'Register': 'Successfully'})
            except :
                return jsonify({'Register': 'Please Check Your Inputs And Try Again'})
        return jsonify({'Register': 'Email Already Registered'})
    return jsonify({'Message': 'Server Timed Out'})


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload_file', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            file = request.files['file']
            return jsonify({'error': 'Not Found'})
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return jsonify({'error': 'Not File Selected'})
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return jsonify({'Success': 'Uploaded'})

    return jsonify({'Upload': 'Extension Not Supported'})


@app.route("/SaveChat", methods=['POST'])  # dummy data
@login_required
def SaveChat():
    rf = request.form
    for key in rf.keys():
        data = key
    data = data.replace('"', '')
    arr = data.split(',')
    print(arr)
    ans = {
        'r1': arr[1],
        'r2': arr[2],
        'r3': arr[3],
    }
    session = DBSession()
    NewChat = Conversations(Question=arr[0], Answer=str(ans),
                            Rating=arr[4], User_ID=Session.get('user_id'))
    session.add(NewChat)
    session.commit()
    session.close()
    return jsonify({'Message': 'Successful'})


@app.route("/chat", methods=['POST'])
def Chathome():
    rf = request.get_json()
    print(rf['userData'])
    res = str(english_bot.get_response(rf['userData']))
    print(res)
    return jsonify({'botResponse': res})


@app.route('/', methods=['GET', 'POST'])
@app.route('/home', methods=['GET', 'POST'])  # NO Posts Yet
@login_required
def home():
    if Session.get('user_id') is None or not current_user.is_authenticated:
        return redirect(url_for('login'))
    else:
        Page = 'Home'
        session = DBSession()
        connUser = session.query(User).filter(
            User.id == Session.get('user_id')).one()
        session.close()
        return render_template('home.html', page=Page, title='Users', conn=connUser,)


@app.route('/changepwd', methods=['GET', 'POST'])
def editPasswordUser():
    if Session.get('user_id') is None:
        return redirect(url_for('login'))
    else:
        Page = 'changepwd'
        session = DBSession()
        connUser = session.query(User).filter(
            User.id == Session.get('user_id')).one()
        userdata = session.query(User).filter(User.id == connUser.id).one()
        session.close()
        if request.method == 'POST':
            if request.form['Password']:
                userdata.Password = request.form['Password']
                session = DBSession()
                session.add(userdata)
                session.commit()
                flash('User Password Successfully Edited')
                session.close()
                return redirect(url_for('home'))
        else:
            return render_template('editPassUser.html', conn=connUser, UserData=userdata, page=Page)


@app.route('/logout')
@login_required
def logout():
    Session['user_id'] = None
    session.close()
    logout_user()
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.secret_key = 'super_secret_key'
    app.debug = True
    app.run(host='127.0.0.1', port=5000)
