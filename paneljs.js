function updateonline(){
    let xmlh=new XMLHttpRequest();
    xmlh.open("GET","/usupd/bitconv/"+localStorage["userid"]);
    xmlh.send(null);
}
let upd=setInterval(updateonline,10000);

let video = document.getElementById("video");

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video:true}).then(function(stream){
        video.srcObject=stream;
        video.play();
    })
}

document.getElementById("userid").innerText="USER ID : "+localStorage["userid"];


