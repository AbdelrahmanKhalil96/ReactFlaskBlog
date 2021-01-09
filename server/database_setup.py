import os
import sys
from datetime import datetime
from sqlalchemy import Column, ForeignKey, Integer, String, TEXT, DATETIME, Boolean,LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from flask_login import LoginManager, UserMixin
import sqlalchemy
import pyodbc
import sqlalchemy.dialects.mysql.pymysql

Base = declarative_base()


class User(Base, UserMixin):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(250), nullable=False)
    public_id = Column(String(40), unique=True)
    email = Column(String(40), nullable=True)
    phone = Column(Integer, nullable=True)
    image_file = Column(String(250), nullable=False, default='https://i.imgur.com/fjYAIbl.png')
    #image_file = Column(LargeBinary(), nullable=False)
    Password = Column(String(250), nullable=False)
    IsAdmin = Column(Boolean, default=False)


class Conversations(Base):
    __tablename__ = 'conversations'

    id = Column(Integer, primary_key=True, autoincrement=True)
    Question = Column(String(400), nullable=True)
    Answer = Column(TEXT, nullable=True)
    Rating = Column(Integer, default=1, nullable=True)
    CreatedAt = Column(
        DATETIME, default=datetime.now().strftime('%Y-%m-%d-%H:%M:%S'))
    User_ID = Column(String(40), ForeignKey('user.public_id'))
    user = relationship(User)


class Posts(Base):
    __tablename__ = 'posts'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    date_posted = Column(DATETIME, nullable=False, default=datetime.utcnow)
    content = Column(TEXT, nullable=False)
    user_id = Column(String(40), ForeignKey('user.public_id'), nullable=False)
    user = relationship(User)
#engine = sqlalchemy.create_engine(
#    "mysql+mysqldb://admin:Passw0rd@localhost:3306/BlogDB?charset=utf8mb4")

#Base.metadata.create_all(engine)
#print('success')
