


var socket = io.connect('https://' + document.domain + ':' + location.port,{query:"userid="+localStorage["userid"]});
    socket.on('connect', function() {
        socket.emit('connected', {data:localStorage["userid"]});
        socket.on("disconnect",function(){
            document.location.reload();
        });
    });
let online_data={"bitpc":[],"bitdroid":[],"bitconv":[]};

socket.on("updatestat",function(arg){
       if(arg==undefined||arg==null){
               
       }
       else{
           let slist=document.getElementById("scrview").getElementsByTagName("li");
           for(i=4;i>0;i--){
               slist[i].innerHTML=slist[i-1].innerHTML;
           }
           slist[0].innerText="("+arg["etime"]+") "+arg["comm"];
       }
       
});

socket.on("online_check",function(rmsg){
        online_data={"bitpc":[],"bitdroid":[],"bitconv":[]};
        for(i=0;i<rmsg["length_json"];i++){
			    online_data[rmsg[i]["userplace"]].push(rmsg[i]["userid"]);
        }
        if(online_data["bitpc"].length==0){
              document.getElementById("bitpc").style.backgroundColor="red";
        }
        else{
            document.getElementById("bitpc").style.backgroundColor="green";
        }
        if(online_data["bitdroid"].length==0){
            document.getElementById("bitdroid").style.backgroundColor="red";
        }
        else{
            document.getElementById("bitdroid").style.backgroundColor="green";
        }
        if(online_data["bitconv"].length==0){
        document.getElementById("bitconv").style.backgroundColor="red";
        }
        else{
            document.getElementById("bitconv").style.backgroundColor="green";
        }

});

socket.on("update",updatecommh);
function updatecommh(arg){
    if(arg===undefined || arg===null){
    var xmlh=new XMLHttpRequest();
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
                  makelink(cel2);
                  
               }
           }
    }
    xmlh.open("GET","/gmsgs/"+localStorage["userid"]+"/5");
    xmlh.send(null);
    }
    else{
        resp=arg;
        let table=document.getElementById("thist");
        for(i=4;i>0;i--){
            row=table.getElementsByTagName("tr")[i];
            row.getElementsByTagName("td")[0].innerHTML=table.getElementsByTagName("tr")[i-1].getElementsByTagName("td")[0].innerHTML;
            row.getElementsByTagName("td")[1].innerHTML=table.getElementsByTagName("tr")[i-1].getElementsByTagName("td")[1].innerHTML;
            
         }
        row=table.getElementsByTagName("tr")[0];
        cel1=row.getElementsByTagName("td")[0];
        cel2=row.getElementsByTagName("td")[1];
        cel1.innerHTML=resp["userid"]+"<br>"+resp["userplace"]+"<br>"+resp["etime"]+","+resp["slno"];
        cel2.innerText=resp["comm"];
        makelink(cel2);
    }

}

socket.on("fsend",function(arg){
     //##TODO::::WEBRTC
})


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

function makelink(node){
   if(typeof node == "object"){
    var replacedText, replacePattern1, replacePattern2, replacePattern3;
    inputText=node.innerHTML;
    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    node.innerHTML = replacedText;
   }
   else if(typeof node == "string"){
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = node.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
   }
   };


function onbutt(eleb){
    eleb=eleb.id;
    alertstr="";
    for(i=0;i<online_data[eleb].length;i++)
       alertstr=alertstr+online_data[eleb][i]+"\n";
    alertify.alert(alertstr);
}


/*
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
*/
/*
function sendfile(file,name,io){
    url="https://script.google.com/macros/s/AKfycbwWejRn9Lxl94GunRX_nVJZUhTHtbEye6VvqvghnD_ffJsEf5Y/exec"
    params={
        filename:"error",
        type:"Default"
    }
    var fr=new FileReader();
    fr.onload =function(e){
        params.file=e.target.result.replace(/^.*,/, '');
        params.type=e.type;
        params.filename=name;
        var html='<form method="post" action="'+url+'" id="postjump'+io+'"'+' style="display: none;" target="formDestination">';
        Object.keys(params).forEach(function (key){
            html+='<input type="hidden" name="'+key+'" value="'+params[key]+'" >';
        });
        html+="</form>";
        $("body").append(html);
        $("#postjump"+io).submit();
        $("#postjump"+io).remove();
    }
    fr.readAsDataURL(file);
}*/

function sendfile(ffile,name,io){
    var fr=new FileReader();
    fr.onload =function(e){
    $.ajax({
      type:"POST",
      url:"https://script.google.com/macros/s/AKfycbwWejRn9Lxl94GunRX_nVJZUhTHtbEye6VvqvghnD_ffJsEf5Y/exec",
      data:{file:e.target.result.replace(/^.*,/, ''),filename:name,type:e.type,del:true},    
      success:function(res){console.log("done")},
      async:false
    });
    }
    fr.readAsDataURL(ffile);
}

function sendmsg(){
    msg=document.getElementById("cominput").value;
    ffors=document.getElementById("filebase");
    if(msg=="" && ffors.files.length==0){
        return;
    }
    else if(msg!="" && ffors.files.length==0){
        eetime=Math.floor((new Date()).getTime() / 1000);
        socket.emit('msend', {"userid":localStorage["userid"],"userplace":"bitconv","msg":msg,"etime":eetime});       
        document.getElementById("cominput").value="";
    }
    else{
        eetime=Math.floor((new Date()).getTime() / 1000);
		/*
        for(i=0;i<ffors.files.length;i++){
           fname=eetime+"("+i+")";
           sendfile(ffors.files[i],fname,i);
           //console.log("helllo");
           //alert("i");
           socket.emit("fsend",{"userid":localStorage["userid"],"naof":fname});
        }
        */


        socket.emit('msend', {"userid":localStorage["userid"],"userplace":"bitconv","msg":msg,"etime":eetime,"filesl":ffors.files.length});       
        document.getElementById("cominput").value="";
		//ffors.value=""
    }    
}