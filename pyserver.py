from flask import Flask,send_from_directory,render_template
import os

app=Flask(__name__)


@app.route("/<sender>/<message>")
def hello(sender,message):
    return sender

@app.route("/path/<path:subpath>")
def path_finder(subpath):
    return send_from_directory(app.root_path,subpath)

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
    return send_from_directory(app.root_path,"index.html")

@app.route("/favicon.ico")
def logo():
    return send_from_directory(app.root_path,"favicon.ico")
app.run()
