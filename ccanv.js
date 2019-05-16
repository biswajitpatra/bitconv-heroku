const can = document.getElementById("canvas1");
const ctx = can.getContext("2d");
ctx.width = window.innerWidth;
ctx.height = window.innerHeight;

//let userid=localStorage["userid"]||"error";
//const inp= document.getElementById("pass");



let passkey="";
var chinese = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
chinese = chinese.split("");
var font_size = 30;
var columns = ctx.width/font_size; 
var drops = [];

for(var x = 0; x < columns; x++)
    drops[x] = 1; 



  /*  
window.onpaint=function(){
    if(userid=="error"){    
        let xmlHttp=new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            userid=xmlHttp.responseText;
        }
        xmlHttp.open("GET","/usadd/bitdroid/"+(new Date).getTime(),true);
        xmlHttp.send(null);
    }
    else{
        let xmlHttp=new XMLHttpRequest();

        // xmlHttp.onreadystatechange = function() { 
        //if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            //userid=xmlHttp.responseText;
        //}
        xmlHttp.open("GET","usupd/bitdroid/"+userid+"/"+(new Date).getTime(),true);
        xmlHttp.send(null);
    }
};*/
    
function changei(inp){
       inp.style.width=inp.value.length*48+'px';
       let xmlHttp = new XMLHttpRequest();
       xmlHttp.onreadystatechange = function() { 
        if (this.readyState == 4 && this.status == 200)
            if(this.responseText!="false"){
            localStorage["userid"]=this.responseText;
            alert(this.responseText);
            window.location.href=window.location.href+"inner/"+localStorage["userid"];}
       }
       xmlHttp.open("GET","/verify/bitconv/"+inp.value,true);
       xmlHttp.send(null);    

}
window.addEventListener("resize",function(){ 

        ctx.width = window.innerWidth;
        ctx.height = window.innerHeight;
        columns = ctx.width/font_size; 
        drops = [];
        for(x = 0; x < columns; x++)
            drops[x] = 1; 
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    },false);


function update(){
    
   




}
function show(){
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, ctx.width, ctx.height);
    
   ctx.fillStyle = "#0F0"; 
	ctx.font = font_size + "px arial";
	for(var i = 0; i < drops.length; i++)
	{
		var text = chinese[Math.floor(Math.random()*chinese.length)];
		ctx.fillText(text, i*font_size, drops[i]*font_size);
		if(drops[i]*font_size > ctx.height && Math.random() > 0.975)
			drops[i] = 0;
		drops[i]++;
	}
}


function main() {
    update();
    show();
    requestAnimationFrame(main);
}


window.onload=main;