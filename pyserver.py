from flask import Flask,send_from_directory,render_template
import os
from flask import request
import re
app=Flask(__name__)


@app.route("/<sender>/<message>")
def hello(sender,message):
    return sender

@app.route("/path/<path:subpath>")
def path_finder(subpath):
    return send_from_directory(app.root_path,subpath,cache_timeout=0)

@app.route("/verifybitconv/<passkey>")
def verify(passkey):
    if passkey.find("1234")!=-1:
        return "true"
    else:
       return "false"    
@app.route("/inner")
def inner():
    return "<<<<<<<<<<     TERMINAL UNDER CONSTRUCTION     >>>>>>>>>>>>>>>"

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
app.run()
