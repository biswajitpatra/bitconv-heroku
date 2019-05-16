const can = document.getElementById("canvas1");
const ctx = can.getContext("2d");
ctx.width = window.innerWidth;
ctx.height = window.innerHeight;
ctx.save();
let box = {
    x: ctx.width * 2 / 10,
    y: ctx.height / 4,
    xd: ctx.width * 6 / 10,
    yd: ctx.height *1.7/ 4 ,
    deviation:ctx.height/70
}
let wheels={
    top:ctx.width/5,
    bot:ctx.width*4/10
}
let prog_bars={
    loca:[box.y+box.yd + wheels.bot/2+(ctx.height-(box.y+box.yd + wheels.bot/2+7))/3,box.y+box.yd + wheels.bot/2+(ctx.height-(box.y+box.yd + wheels.bot/2+7))*(1.6)/3,box.y+box.yd + wheels.bot/2+(ctx.height-(box.y+box.yd + wheels.bot/2+7))*2.2/3],
    breadth:box.deviation*2,
    value:[0,0,0],
    tval:[0,0,0]
}
var chinese = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
chinese = chinese.split("");
var font_size = 30;
var columns = ctx.width/font_size; 
var drops = [];
for(var x = 0; x < columns; x++)
	drops[x] = 1; 
//let userid=localStorage["userid"]||"error";


let passw="";
let images={};
let grot=0.0174;
let blink="rgb(0,40,0)";
let login_text="LOGIN";



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


window.addEventListener("resize",function(){ 

    ctx.width = window.innerWidth;
    ctx.height = window.innerHeight;
    box = {
        x: ctx.width * 2 / 10,
        y: ctx.height / 4,
        xd: ctx.width * 6 / 10,
        yd: ctx.height *1.5/ 4 ,
        deviation:ctx.height/70
    }
    wheels={
        top:ctx.width/5,
        bot:ctx.width*4/10
    }
    prog_bars={
        loca:[box.y+box.yd + wheels.bot/2+(ctx.height-(box.y+box.yd + wheels.bot/2+7))/3,box.y+box.yd + wheels.bot/2+(ctx.height-(box.y+box.yd + wheels.bot/2+7))*(1.6)/3,box.y+box.yd + wheels.bot/2+(ctx.height-(box.y+box.yd + wheels.bot/2+7))*2.2/3],
        breadth:box.deviation*2,
        value:[0,0,0],
        tval:[0,0,0]
    }
    columns = ctx.width/font_size; 
    drops = [];
    for(x = 0; x < columns; x++)
        drops[x] = 1; 
    
    

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

},false);
function make_img(name, x, y, wid, hei,angle=0) {
    if(images[name]==undefined){
        images[name] = new Image();
        images[name].src = name;
        if (wid == 0) {
            wid = images[name].width;
         }
         if (hei == 0)
            hei = images[name].height;
        ctx.save();
        ctx.translate(x,y);
        ctx.rotate(angle);
        ctx.drawImage(images[name],  - wid/ 2,  - hei / 2, wid, hei);
        ctx.restore();
        

        
    }else{
        if (wid == 0) {
            wid = images[name].width;
         }
         if (hei == 0)
            hei = images[name].height;
        ctx.save();
        ctx.translate(x,y);
        ctx.rotate(angle);
        ctx.drawImage(images[name],  - wid/ 2,  - hei / 2, wid, hei);
        ctx.restore();
    }
    
      
}

function update(){

    if(grot==3.14){
        grot=0;
    }
    else
       grot+=0.0174;
    


    if(Math.random()>0.5){
        if(blink=="rgb(0,40,0)"){
            blink="rgb(245, 17, 17)";
        }
        else
          blink="rgb(0,40,0)";
    }
    

    login_text="LOGIN";
    for(i=0;i<5;i++){
         if(Math.random()>0.4){
            login_text = login_text.substr(0, i) + ' ' + login_text.substr(i + 1);
         }
    }
    
    for(i=0;i<3;i++){
         if(prog_bars.tval[i]==prog_bars.value[i]){
            prog_bars.tval[i]=Math.floor(Math.random()*100);
            //console.log(toString( prog_bars.tval[i]));        
        }
         else if (prog_bars.tval[i]>prog_bars.value[i]) {
             prog_bars.value[i]+=1;
         } else {
            prog_bars.value[i]-=1;
         }
    }
    
}

function initiate(){
    
    
}



function passkey(elem){
    if(elem=="X")
     passw=passw.substring(0,str.length-1);
    else{
       passw+=elem;
       let xmlHttp=new XMLHttpRequest();
       xmlHttp.onreadystatechange = function() { 
            if (this.readyState == 4 && this.status == 200)
                if(this.responseText!="false"){
                localStorage["userid"]=this.responseText;
                alert(this.responseText);
                window.location.href=window.location.href+"inner/"+localStorage["userid"];}
           }
       xmlHttp.open("GET","/verify/bitconv/"+passw,true);
       xmlHttp.send(null);         
    }   
}
function show() {

    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
	ctx.fillRect(0, 0, ctx.width, ctx.height);
	
	ctx.fillStyle = "#0F0"; //green text
	ctx.font = font_size + "px arial";
	for(var i = 0; i < drops.length; i++)
	{
		var text = chinese[Math.floor(Math.random()*chinese.length)];
		ctx.fillText(text, i*font_size, drops[i]*font_size);
		if(drops[i]*font_size > ctx.height && Math.random() > 0.975)
			drops[i] = 0;
		drops[i]++;
	}



    make_img("path/wheel.png", box.x, box.y, wheels.top,wheels.top,grot);
    make_img("path/wheel.png", box.x + box.xd, box.y + box.yd, wheels.bot, wheels.bot,grot);

    //ctx.fillStyle = "white";
    ctx.fillStyle = 'rgba(0,255,0,0.1)';
    //ctx.globalAlpha = 0.01;
    ctx.fillRect(box.x, box.y, box.xd, box.yd);
    //ctx.globalAlpha = 1.0;
    ctx.fillStyle = "#0F0";
    ctx.font = "bold 80px Courier";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.clearRect(ctx.width/2-0.5*3*80,box.y-25-85,2*0.5*3*80,85);
    //alert("done");
    //ctx.strokeStyle = "#FF0000";
    //ctx.strokeRect(ctx.width/2-0.5*3*80,box.y-25-85,2*0.5*3*80,85)
    ctx.fillText(login_text, ctx.width / 2, box.y-25);

    //ctx.strokeStyle="";
   //ctx.clearRect(ctx.width/2-0.5*3*80,box.y-25-85,2*0.5*3*80,85);
    //alert("created");
    //ctx.fillRect(20, 20, 100, 100);

    ctx.beginPath();
    ctx.moveTo(box.x, box.y);
    ctx.lineTo(box.x + box.xd + box.deviation, box.y - box.deviation);
    ctx.lineTo(box.x + box.xd, box.y + box.yd);
    ctx.lineTo(box.x + box.xd - box.deviation, box.y + box.deviation);
    ctx.fillStyle = blink;
    ctx.fill();
    ctx.stroke();
    ctx.moveTo(0, 0);

    ctx.beginPath();
    ctx.moveTo(box.x, box.y);
    ctx.lineTo(box.x - box.deviation, box.y + box.yd + box.deviation);
    ctx.lineTo(box.x + box.xd, box.y + box.yd);
    ctx.lineTo(box.x + box.deviation, box.y + box.yd - box.deviation);
    ctx.fillStyle = blink;
    ctx.fill();
    ctx.stroke();
    ctx.moveTo(0, 0);

    ctx.fillStyle="rgba(0,255,0,1)";
    for(i=0;i<3;i++){
        ctx.clearRect(box.x,prog_bars.loca[i],box.xd,prog_bars.breadth);
        ctx.fillRect(box.x,prog_bars.loca[i],prog_bars.value[i]*(box.xd)/100,prog_bars.breadth);
    }
      

   

}




function main() {
    update();
    show();
    requestAnimationFrame(main);
}

//let fps = 17;

initiate();
//let loop = setInterval(main, 1000 / fps);
window.onload=main;