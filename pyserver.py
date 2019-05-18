from flask import Flask,send_from_directory,render_template,session,redirect,url_for
import os
from flask import request,jsonify
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
   #slno = db.Column('slno', db.Integer,autoincrement=True)
   ipadr=db.Column("ipadr",db.String(30))
   userid = db.Column('userid',db.Integer,primary_key=True)
   userplace = db.Column("userplace",db.String(10))
   rtime = db.Column("rtime",db.Integer) 
   logined = db.Column("logined",db.Boolean)

   def __init__(self,userid,userplace,rtime,logined,ipadr):
    self.userid = userid
    self.userplace = userplace
    self.rtime = rtime
    self.logined = logined
    self.ipadr=ipadr

class commdb(db.Model):
    __tablename__="commdb"
    slno = db.Column('slno', db.Integer,autoincrement=True,primary_key=True)
    userid=db.Column('userid',db.Integer)
    userplace = db.Column("userplace",db.String(10))
    comm=db.Column("comm",db.String(100))
    etime = db.Column("etime",db.Integer)
    seenid=db.Column("seenid",db.String(50))
    def __init__(self,userid,userplace,comm,etime,seenid):
       self.userid = userid
       self.userplace = userplace
       self.etime = etime
       self.comm=comm
       self.seenid=seenid


@app.route("/inner/path/<path:subpath>")
@app.route("/path/<path:subpath>")
def path_finder(subpath):
    return send_from_directory(app.root_path,subpath,cache_timeout=0)


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



@app.route("/chkonline",methods=["GET","POST"])
def checkonline():
    content=request.get_json()
    if "userid" in content.keys():
        user=userlogins.query.filter_by(userid=content["userid"]).first()
        if user ==None:
            return "n"
        if user.logined==True and int(time.time())-user.rtime < 15:
            return str(user.userid)+":t,"
        else:
            return str(user.userid)+":f,"
    else:
        user=userlogins.query.filter_by(userplace=content["userplace"])
        if user ==None:
            return "n"
        else:
            rdata=""
            for u in user:
                if u.logined==True and int(time.time())-u.rtime < 15:
                  rdata=rdata+ str(u.userid)+":t,"
                else:
                  rdata=rdata+ str(u.userid)+":f,"
            return rdata

  



@app.route("/inner/usupd/<userplace>/<int:userid>")
@app.route("/usupd/<userplace>/<int:userid>")
def userupdate(userplace,userid):
    user=userlogins.query.filter_by(userid=userid).first()
    if user==None:
        return "f"
    elif user.logined==True and int(time.time())-user.rtime < 15:
          user.rtime=int(time.time())
          db.session.commit()
          print("user updated")
          return "t"
    else:
        print("user late retreival")
        return "f"
    return "t"
    
@app.route("/",methods=["GET","POST"])
def home():
 if request.method=="GET":
    print(request.user_agent)
    if(re.search("/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/",str(request.user_agent))):
        return send_from_directory(app.root_path,"mindex.html",cache_timeout=0)
    else:
         return send_from_directory(app.root_path,"cindex.html",cache_timeout=0)
 else:
    print("verifiction started")
    content=request.get_json()
    if content['passkey'].find("1234")!=-1 and content["userplace"]=="bitconv":
        idtem=int(time.time())
        useradd(content["userplace"],idtem)
        print("new user with id:"+request.headers['X-Forwarded-For'])
        return str(idtem)
    else:
        return "false"

@app.route("/favicon.ico")
def logo():
    return send_from_directory(app.root_path,"favicon.ico",cache_timeout=0)



@app.errorhandler(404)
def not_found(error):
    return "You have gone the wrong way.......Sry.......", 404

def useradd(userplace,time):
    if not request.headers.getlist("X-Forwarded-For"):
        ip = request.remote_addr
    else:
        ip = request.headers.getlist("X-Forwarded-For")[0]
    db.session.add(userlogins(time,userplace,time,True,ip))
    db.session.commit()
    print("user added from ip:" +ip)

@app.route("/msend",methods=["POST"])
def msgsender():
    content=request.get_json()
    db.session.add(commdb(content["userid"],content["userplace"],content["msg"],content["etime"],""))
    db.session.commit()
    print("MSg:"+content["msg"],"\nfrom user"+content["userid"])
    return "t"

@app.route("/gmsgs/<userid>/<int:numb>")    
def getmsg(userid,numb):
    try:
       mesgs=commdb.query.order_by(commdb.etime.desc())[:int(numb)]
    except IndexError:
        mesgs=commdb.query.order_by(commdb.etime).all()  
    #print(mesgs)
    rmsg={}
    rmsg["num_of_res"]=len(mesgs)
    for m in range(len(mesgs)):
        rmsg[m]={"slno":mesgs[m].slno,"userid":mesgs[m].userid,"userplace":mesgs[m].userplace,"comm":mesgs[m].comm,"etime":mesgs[m].etime}
        #print(rmsg[m])
    return json.dumps(rmsg)

@app.teardown_appcontext
def shutdown_session(exception=None):
        db.session.remove()

if __name__ == '__main__':
   app.secret_key=os.urandom(12)
   #db.create_all()
   app.run(debug = True)
