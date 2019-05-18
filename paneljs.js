function updateonline(){
    let xmlh=new XMLHttpRequest();
    xmlh.onreadystatechange=function(){
        if(this.readyState==4&& this.status==200){
            if(this.responseText=="f"){
                localStorage["userid"]="";
                alert("Login required.....");
                window.location.href=window.location.href.substring(0,window.location.href.indexOf("/"));
            }
        }
    }
    xmlh.open("GET","/usupd/bitconv/"+localStorage["userid"]);
    xmlh.send(null);
}
updateonline();
let upd=setInterval(updateonline,10000);

let video = document.getElementById("video");

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video:true}).then(function(stream){
        video.srcObject=stream;
        video.play();
    })
}

document.getElementById("userid").innerText="USER ID : "+localStorage["userid"];


