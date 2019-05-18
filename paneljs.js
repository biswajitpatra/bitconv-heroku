function updateonline(){
    let xmlh=new XMLHttpRequest();
    xmlh.onreadystatechange=function(){
        if(this.readyState==4&& this.status==200){
            if(this.responseText=="f"){
                localStorage["userid"]="invalid";
                alert("Login required.....");
                window.location.href=window.location.href.substring(0,window.location.href.indexOf("/"));
                clearInterval(upd);
            }
        }
    }
    if(localStorage["userid"]==undefined ||localStorage["userid"]==""){
        temp=window.location.href.split("/");
        localStorage["userid"]=temp[temp.length-1];
    }
    xmlh.open("GET","/usupd/bitconv/"+localStorage["userid"]);
    xmlh.send(null);


    xmlh=new XMLHttpRequest();
    xmlh.onreadystatechange=function(){
           let table=document.getElementById("thist");
           if(this.readyState==4 && this.status==200){
               resp=JSON.parse(this.responseText);
               for(i=resp["num_of_res"]-1;i>=0;i--){
                  eresp=resp[i];
                  row=table.getElementsByTagName("tr")[i];
                  cel1=row.getElementsByTagName("td")[0];
                  cel2=row.getElementsByTagName("td")[1];
                  cel1.innerHTML=eresp["userid"]+"<br>"+eresp["userplace"]+"<br>"+eresp["etime"]+","+eresp["slno"];
                  cel2.innerText=eresp["comm"];
                  cel2.style.height=cel1.style.height;


               }
           }
    }
    xmlh.open("GET","/gmsgs/"+localStorage["userid"]+"/5");
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





function sendmsg(){
    msg=document.getElementById("cominput").value;
    if(msg==""){
        return;
    }
    else{
        let xmlh=new XMLHttpRequest();
        xmlh.open("POST","/msend",true);
        xmlh.setRequestHeader("Content-Type","application/json");
        xmlh.send(JSON.stringify({"userid":localStorage["userid"],"userplace":"bitconv","msg":msg,"etime":Math.floor((new Date()).getTime() / 1000)}));
        document.getElementById("cominput").value="";
    }
}
