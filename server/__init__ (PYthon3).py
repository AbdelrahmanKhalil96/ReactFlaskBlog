from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, validators, SubmitField
from wtforms.validators import InputRequired, Email, Length, DataRequired, EqualTo
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from database_setup import Base, Conversations, User
from sqlalchemy import create_engine, asc
from sqlalchemy.orm import sessionmaker
from flask import session as Session
from flask_bootstrap import Bootstrap
from flask_cors import CORS, cross_origin
import pybase64
import hashlib
from Cryptodome.Cipher import AES
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


from werkzeug.utils import secure_filename


UPLOAD_DIR: Path = Path(__file__).parent / 'uploads'
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
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

english_bot = ['ch1', 'ch2', 'ch3']

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
    dPass=str(decrypt(rf['LogInData']['password'], key), 'UTF-8')
    print(dPass)
    session = DBSession()
    try:
        user = session.query(User).filter_by(
            email=rf['LogInData']['email']).first()
        session.close()
    except UnboundLocalError:
        uData = {
            'UName': '', 'UEmail': '', 'UPhone': ''
        }
        return jsonify({'Logged_in': 'Error','uData':uData})
    finally:
        if user:
            if user.Password == dPass:
                print('Logged_in')
                uData ={
                    'UName': user.name, 'UEmail': user.email, 'UPhone': user.phone
                }
                print((uData))
                return jsonify({'Logged_in': 'true','uData':uData})
            else:
                uData = {
                    'UName': '', 'UEmail': '', 'UPhone': ''
                }
                return jsonify({'Logged_in': 'false','uData':uData})
        else:
            uData = {
                'UName': '', 'UEmail': '', 'UPhone': ''
            }
            return jsonify({'Logged_in': 'false','uData':uData})

    return jsonify({'Message': 'Server Error'})



@app.route("/register", methods=['POST'])
def register():
    key = b"1234567890123456"  # TODO change to something with more entropy
    rf = request.get_json()
    print(rf['RegData']['password'])

    dpass=str(decrypt(rf['RegData']['password'],key),'UTF-8')
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
            session = DBSession()
            newUser = User(name=rf['RegData']['name'], email=rf['RegData']['email'],phone=rf['RegData']['phone'], Password=dpass)
            session.add(newUser)
            session.commit()
            session.close()
            return jsonify({'Register': 'Successfully'})
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
            return jsonify({'error':'Not Found'})
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return jsonify({'error':'Not File Selected'})
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return jsonify({'Success': 'Uploaded'})

    return jsonify({'Upload':'done'})

@app.route("/SaveChat", methods=['POST'])#dummy data
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


@app.route("/chat", methods=['GET', 'POST'])
@login_required
def Chathome():
    rf = request.form
    for key in rf.keys():
        data = key
    res = str(english_bot)
    return jsonify({'response': res})


@app.route('/', methods=['GET', 'POST'])
@app.route('/home', methods=['GET', 'POST'])#NO Posts Yet
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
