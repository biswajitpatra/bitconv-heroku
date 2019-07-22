
function command_executer(cmd){

    if(cmd=="")
      return;
    cmd=cmd.split("\n");
    if(cmd.length==1){
      

    } 
    else{
        cto=cmd[0];
        this.cont_exec=this.cont_exec||false;
        if((cto=="..." && this.cont_exec==true)||(cto.includes("{{"+localStorage["userid"]+"}}"))||(cto.includes("{{bitconv}}"))){
           if(cmd[cmd.length-1]!="...")
                this.cont_exec=false;
                         
        }
        

    }

}