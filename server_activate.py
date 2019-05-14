import os
import subprocess
import time
while(True):
     st=time.time()
     output=os.popen("ssh -R bitconv:80:localhost:5000 serveo.net").read()
     end=time.time()
     print("server stoped")
     if(end-st<60):
         print("Forceful stopping")
         break

input("COntinue::::exiting.......")
