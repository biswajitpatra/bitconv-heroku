from flask import Flask,send_from_directory,render_template,session,redirect,url_for
import os
from flask import request
import re
from flask_sqlalchemy import SQLAlchemy
import sys
import json
import time


app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://anexryhdcxxdgn:8192aad9befb811ce91a03600785af2711b14bb5721c1e3b402294d826d6b3ab@ec2-75-101-147-226.compute-1.amazonaws.com:5432/dr95m80gttmdo'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
db=SQLAlchemy(app)


class userlogins(db.Model):
   __tablename__="userlogins"
   slno = db.Column('slno', db.Integer,autoincrement=True)
   userid = db.Column('userid',db.Integer,primary_key=True)
   userplace = db.Column("userplace",db.String(10))
   rtime = db.Column("rtime",db.Integer) 
   logined = db.Column("logined",db.Boolean)

   def __init__(self,userid,userplace,rtime,logined):
    self.userid = userid
    self.userplace = userplace
    self.rtime = rtime
    self.logined = logined

@app.route("/<sender>/<message>")
def hello(sender,message):
    return sender

@app.route("/inner/path/<path:subpath>")
@app.route("/path/<path:subpath>")
def path_finder(subpath):
    return send_from_directory(app.root_path,subpath,cache_timeout=0)

@app.route("/verify/<userplace>/<passkey>")
def verify(userplace,passkey):
    print("verifiction started")
    if passkey.find("1234")!=-1 and userplace=="bitconv":
        idtem=int(time.time())
        useradd(userplace,idtem)
        print("new user with id:"+str(idtem))
        return str(idtem)
    else:
        return "false"   

@app.route("/inner/<int:userid>")
def inner(userid):
    user=userlogins.query.filter_by(userid=userid).first()
    print("Accessing user",user)
    if user==None:
        return redirect(url_for("home"))
    if user.logined==True and int(time.time())-user.rtime < 15:
          user.rtime=int(time.time())
          db.session.commit()
          return send_from_directory(app.root_path,"innerpanel.html",cache_timeout=0)
    else:
        return redirect(url_for("home"))
    '''
    if not session.get("logged_in",False):
        return redirect(url_for("home"))
    return "<<<<<<<<<<     TERMINAL UNDER CONSTRUCTION     >>>>>>>>>>>>>>>"
    '''

#userplaces are bitconv,bitdroid
#@app.route("/usadd/<userplace>/<int:time>")
def useradd(userplace,time):
    db.session.add(userlogins(time,userplace,time,True))
    db.session.commit()
    print("user added")

@app.route("/inner/usupd/<userplace>/<int:userid>")
@app.route("/usupd/<userplace>/<int:userid>")
def userupdate(userplace,userid):
    user=userlogins.query.filter_by(userid=userid).first()
    user.rtime=int(time.time())
    db.session.commit()
    print("user updated")
    return "true"
    
@app.route("/")
def home():
    print(request.user_agent)
    if(re.search("/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/",str(request.user_agent))):
        return send_from_directory(app.root_path,"mindex.html",cache_timeout=0)
    else:
         return send_from_directory(app.root_path,"cindex.html",cache_timeout=0)


@app.route("/favicon.ico")
def logo():
    return send_from_directory(app.root_path,"favicon.ico",cache_timeout=0)


if __name__ == '__main__':
   app.secret_key=os.urandom(12)
   #db.create_all()
   app.run(debug = True)
