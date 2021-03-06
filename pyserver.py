from flask import Flask,send_from_directory,render_template,session,redirect,url_for
import os
from flask import request,jsonify
import re
from flask_sqlalchemy import SQLAlchemy
import sys
import json
import time
from flask_socketio import send, emit,SocketIO,socketio,disconnect
from pyfcm import FCMNotification

###########################################################
###########TODO:pip install eventlet while using heroku
###############:pip install gunicorn.......
###########TODO:add ip address while deploying ###############################################################################################>>>>>>>
######################################################

app=Flask(__name__)

#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://kfwdmchtrvjutr:e16f5ad955062bec12c557a3da5c04e9ab20cbd74df8f867092f2737ffe6de8c@ec2-54-235-104-136.compute-1.amazonaws.com:5432/d5qk9k31qkg616'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL","error")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
db=SQLAlchemy(app)
socketio=SocketIO(app)


push_service = FCMNotification(api_key="AAAALb0py6M:APA91bEOOXI7rph7KXP4VhjYe_xApxZzmnjkX2a-3R3OxvhlZQXQx7w8YS6JK6KrRIiK6wXX5GzdCHlH9KRyir5tPnfQp_Ni0Hp6Oolnushxlb9bgTDq4vofY2LhpActkAqf_SdYS7_2")


slnoforcommt=0

class filestore(db.Model):
    __tablename__="filestore"
    slno=db.Column('slno', db.Integer,autoincrement=True,primary_key=True)
    userid = db.Column('userid',db.Integer)
    naof=db.Column("comm",db.String(20))
    etime = db.Column("etime",db.Integer)
    def __init__(self,userid,naof):
        self.userid=userid
        self.naof=naof
        self.etime=int(time.time())

class stattable(db.Model):
    __tablename__="stattable"
    slno = db.Column('slno', db.Integer,autoincrement=True,primary_key=True)
    comm=db.Column("comm",db.String(100))
    etime = db.Column("etime",db.Integer)

    def __init__(self,comm,etime):
        self.comm=comm
        self.etime=etime

class userlogins(db.Model):
   __tablename__="userlogins"
   slno = db.Column('slno', db.Integer,autoincrement=True)
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

class key_pair(db.Model):
    __tablename__="keypair"
    key=db.Column("key",db.String(300),primary_key=True)
    value=db.Column("value",db.String(300))
    def __init__(self,key,value):
        self.key=key
        self.value=value

@socketio.on("connect")
def main_conn():
    userid=request.args.get("userid")
    user=userlogins.query.filter_by(userid=int(userid)).first()
    print("socket connected user:",user)
    if userid=="111":
        print("Bitdroid initiated..........")
    elif user==None:
        disconnect()
    elif user.logined==True and int(time.time())-user.rtime < 15:
          print("user connected socketio")
    else:
        disconnect()
        
    

@socketio.on("connected")
def conn(msg):
    print("connected")
    socketio.emit("update")
    etime=int(time.time())
    users=userlogins.query.filter(userlogins.rtime >= etime-8).all()
    rmsg={}
    rmsg["length_json"]=len(users)
    for u in range(len(users)):
        rmsg[u]={"userid":users[u].userid,"userplace":users[u].userplace}
    socketio.emit("online_check",rmsg,broadcast=True)

@socketio.on('disconnect')
def test_disconnect():
    etime=int(time.time())
    add_stat("A user disconnects")
    users=userlogins.query.filter(userlogins.rtime >= etime-8).all()
    rmsg={}
    rmsg["length_json"]=len(users)
    for u in range(len(users)):
        rmsg[u]={"userid":users[u].userid,"userplace":users[u].userplace}
    socketio.emit("online_check",rmsg,broadcast=True)
    print('user disconected')

    
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
          add_stat(str(userid)+" in inner")
          return send_from_directory(app.root_path,"innerpanel.html",cache_timeout=0)
    else:
        return redirect(url_for("home"))



@app.route("/chkonline",methods=["POST"])
def checkonline():
    content=request.get_json()
    return checkonlinemain(content)



def checkonlinemain(content):
    if "userid" in content.keys():
        if content["userid"]=="111":
            print("Android setup connected")
            return "111:t,"
        user=userlogins.query.filter_by(userid=content["userid"]).first()
        if user ==None:
            return "n"
        elif user.userplace=="bitpc":
            return str(user.userid)+":t,"
        elif user.userplace=="bitdroid":
            return str(user.userid)+":t,"
        elif user.logined==True and int(time.time())-user.rtime < 15:
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
            return rdata[:-1]
   
  

@app.route("/inner/usupd/<userplace>/<int:userid>")
@app.route("/usupd/<userplace>/<int:userid>")
def userupdate(userplace,userid):
    user=userlogins.query.filter_by(userid=int(userid)).first()
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
    if content["userplace"]=="bitpc":
        idtem=int(time.time())
        useradd(content["userplace"],idtem)
        print("new user with id:"+str(idtem))
        return str(idtem)
    elif content["userplace"]=="bitdroid":
        idtem=int(time.time())
        useradd(content["userplace"],idtem)
        print("new user with id:"+str(idtem))
        return str(idtem)
    elif content['passkey'].find("1234")!=-1 and content["userplace"]=="bitconv":
        idtem=int(time.time())
        useradd(content["userplace"],idtem)
        print("new user with id:"+str(idtem))
        return str(idtem)
    else:
        return "false"

@app.route("/favicon.ico")
def logo():
    return send_from_directory(app.root_path,"favicon.ico",cache_timeout=0)



@socketio.on("msend")
def msgsendersock(json):
  global slnoforcommt
  if "t" in checkonlinemain(json):
    db.session.add(commdb(json["userid"],json["userplace"],json["msg"][:100],json["etime"],""))
    db.session.commit()
    print("MSg:"+json["msg"],"\nfrom user"+json["userid"])
    
    if(slnoforcommt==0):
         mesgs=commdb.query.order_by(commdb.etime.desc()).first()
         slnoforcommt=mesgs.slno
    else:
        slnoforcommt+=1     
    rmsg={"slno":slnoforcommt,"userid":json["userid"],"userplace":json["userplace"],"comm":json["msg"],"etime":json["etime"]}
    if "filesl" in json:
        urmsg=rmsg.split("\n")[0]
        if urmsg=='':
            socketio.emit("fsend")
        #TODO:webrtc...........and socketio
    socketio.emit('update',rmsg, broadcast=True)
    send_android({"type":"update","slno":slnoforcommt,"userid":json["userid"],"userplace":json["userplace"],"comm":json["msg"],"etime":json["etime"]})

@app.route("/msend",methods=["POST"])
def msgsender():
  content=request.get_json()
  if "t" in checkonlinemain(content):
    db.session.add(commdb(content["userid"],content["userplace"],content["msg"][:100],content["etime"],""))
    db.session.commit()
    print("MSg:"+content["msg"],"\nfrom user"+content["userid"])
    return "t"
  else:
    return "f"  


@app.route("/gmsgs/<userid>/<int:numb>")    
def getmsg(userid,numb):
  if "t" in checkonlinemain({"userid":userid}):
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
  else:
      return 404


@app.teardown_appcontext
def shutdown_session(exception=None):
        db.session.remove()


@app.errorhandler(404)
def not_found(error):
    return "You have gone the wrong way.......Sry.......", 404

def useradd(userplace,time):
    ip=""
    #if not request.headers.getlist("X-Forwarded-For"):
    #    ip = request.remote_addr
    #else:
    #    ip = request.headers.getlist("X-Forwarded-For")[0]
    db.session.add(userlogins(time,userplace,time,True,ip))
    db.session.commit()
    add_stat("new user added id:"+str(time)+" and ip:"+str(ip))
    print("user added from ip:" +ip)


def add_stat(comm):
    etime=int(time.time())
    db.session.add(stattable(comm,etime))
    db.session.commit()
    socketio.emit("updatestat",{"comm":comm,"etime":etime},broadcast=True)
    send_android({"type":"updatestat","comm":comm,"etime":etime})

######for android
@app.route("/andupd",methods=["POST"])
def andupdate():
    token=request.form["token"]
    anduser=key_pair.query.filter_by(key="andtoken").first()
    if anduser==None:
        db.session.add(key_pair("andtoken",token))
        db.session.commit()
    else:
        anduser.value=token
        db.session.commit()
    return 200

def send_android(js_send):
    anduser=key_pair.query.filter_by(key="andtoken").first()
    if anduser==None:
        print("No user registered")
        return
    result = push_service.notify_single_device(registration_id=anduser.value, data_message=js_send)
    print(result)


        






if __name__ == '__main__':
   #print("done")
   app.secret_key=os.urandom(12)
   #print("done2")
   #db.create_all()
   socketio.run(app)
   #app.run(debug = True)
