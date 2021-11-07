var socket = io();

var button = document.getElementById('button');

let rcUID;
let rcUID2;
var name;
var isconnected1 = false;
var isconnected2 = false;

var slider2 = document.getElementById("slider2");
var slider1 = document.getElementById("slider1");
var speed = 0x64;
var speed1 = 0x64;
var speed2 = 0x64;

let activeCube = 0;

let char; //0: move -- 1: sound -- 2: light -- 3:position


 const CUBE_ID_ARRAY = [ 0, 1, 2 ];
 const SUPPORT_CUBE_NUM = CUBE_ID_ARRAY.length;

 // Global Variables.
 const gCubes = [ undefined, undefined, undefined ];





   const SERVICE_UUID              = '10b20100-5b3b-4571-9508-cf3efcd7bbae';
   const MOVE_CHARCTERISTICS_UUID = '10b20102-5b3b-4571-9508-cf3efcd7bbae';
   const SOUND_CHARCTERISTICS_UUID = '10b20104-5b3b-4571-9508-cf3efcd7bbae';
   const LIGHT_CHARCTERISTICS_UUID = '10b20103-5b3b-4571-9508-cf3efcd7bbae';
   const POSITION_CHARACTERISTICS_UUID = '10b20101-5b3b-4571-9508-cf3efcd7bbae';


   const connectNewCube = () => {

       const cube = {
           device:undefined,
           sever:undefined,
           service:undefined,
           soundChar:undefined,
           moveChar:undefined,
           lightChar:undefined,
           posChar: undefined

       };

       // Scan only toio Core Cubes
       const options = {
           filters: [
               { services: [ SERVICE_UUID ] },
           ],
       }

       navigator.bluetooth.requestDevice( options ).then( device => {
           cube.device = device;
           if( cube === gCubes[0] ){
               turnOnLightCian( cube );
               const cubeID = 1;
               changeConnectCubeButtonStatus( cubeID, undefined, true );
           }else if( cube === gCubes[1] ){
               //turnOnLightGreen( cube );
               //spinCube( cube );
               const cubeID = 2;
               changeConnectCubeButtonStatus( cubeID, undefined, true );
           }
           changeConnectCubeButtonStatus( undefined, cube, false );
           return device.gatt.connect();
       }).then( server => {
           cube.server = server;
           return server.getPrimaryService( SERVICE_UUID );
       }).then(service => {
           cube.service = service;
           return cube.service.getCharacteristic( MOVE_CHARCTERISTICS_UUID );
       }).then( characteristic => {
           cube.moveChar = characteristic;
           return cube.service.getCharacteristic( SOUND_CHARCTERISTICS_UUID );
       }).then( characteristic => {
           cube.soundChar = characteristic;
           return cube.service.getCharacteristic( LIGHT_CHARCTERISTICS_UUID );
       }).then( characteristic => {
           cube.lightChar = characteristic;
           if( cube === gCubes[0] ){
             turnOnLightCian( cube );
             spinCube( cube );
             enableCube(0);
             // enableMoveButtons();
           }else if( cube === gCubes[1] ){

             turnOnLightRed( cube );
             spinCube( cube );
             enableCube(1);

           }else{
             turnOnLightRed( cube );
           }
       });

       return cube;
   }



   // Cube Commands
   // -- Light Commands
   const turnOffLight = ( cube ) => {

       const CMD_TURN_OFF = 0x01;
       const buf = new Uint8Array([ CMD_TURN_OFF ]);
       if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
           cube.lightChar.writeValue( buf );
       }

   }


   const turnOnLightGreen = ( cube ) => {

       // Green light
       const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF]);
       if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
           cube.lightChar.writeValue( buf );
           console.log('green');
       }

   }

   const turnOnLightCian = ( cube ) => {

       // Cian light
     const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF ]);
       if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
           cube.lightChar.writeValue( buf );
           console.log('cyan');

       }

   }

   const turnOnLightRed = ( cube ) => {

       // Red light
       const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0xFF, 0x00, 0x00 ]);
       if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
           cube.lightChar.writeValue( buf );
       }

   }


   const spinCube = ( cube ) => {

       // Green light
       const buf = new Uint8Array([ 0x02, 0x01, 0x01, 0x64, 0x02, 0x02, 0x14, 0x64 ]);
       if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
           cube.moveChar.writeValue( buf );
           console.log('spin');
       }

   }

   const changeButtonStatus = ( btID, enabled ) => {
       document.getElementById( btID ).disabled = !enabled;
   }




   const changeConnectCubeButtonStatus = ( idButton, cube, enabled ) => {

       if( idButton ){
           changeButtonStatus( 'btConnectCube' + ( idButton + 1 ), enabled );
       }else{
           if( gCubes[0] === cube ){
               changeButtonStatus( 'btConnectCube1', enabled );
               socket.emit('bt', name, 0);
           }else if( gCubes[1] === cube ){
               changeButtonStatus( 'btConnectCube2', enabled );
               socket.emit('bt', name, 1);
           }else{
               changeButtonStatus( 'btConnectCube3', enabled );
           }
       }

   }


   function enableCube(cubeno) {
     if(cubeno == 0){
       console.log('enable cube 1');
       document.getElementById('mycube1').classList.toggle('disabled');
     }else if(cubeno == 1){
       console.log('enable cube 2');
       document.getElementById('mycube2').classList.toggle('disabled');
     }
   }



           socket.on('forward', (nCube, speed) => {
          const cube = gCubes[nCube];
           console.log('forward');

           if( cube !== undefined ){
           cubeMove( 1, nCube, speed);
           }


            });

            socket.on('back', (nCube, speed) => {
            const cube = gCubes[nCube];
            console.log('back');
            if( cube !== undefined ){
            cubeMove( 2, nCube, speed );
            }
             });

             socket.on('left', (nCube, speed) => {
             const cube = gCubes[nCube];
             console.log('left');
             if( cube !== undefined ){
             cubeMove( 3, nCube, speed );
             }

              });

              socket.on('right', (nCube, speed) => {
              const cube = gCubes[nCube];
              console.log('right');
              if( cube !== undefined ){
              cubeMove( 4, nCube , speed);
              }

               });

               socket.on('stop', (nCube, speed) => {
               const cube = gCubes[nCube];
               console.log('stop');
               if( cube !== undefined ){
               cubeStop( nCube );
               }

                });

                socket.on('charge', (nCube, speed) => {
                const cube = gCubes[nCube];
                console.log('charge');
                if( cube !== undefined ){
                cubeMove( 5, nCube , 0xFF);
                }

                 });



   const cubeMove = ( moveID, cubeno,speed ) => {
       const cube = gCubes[cubeno];
       var buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x64, 0x02, 0x01, 0x64]);
       // forward

       console.log(speed);
       if(moveID==1){
       buf = new Uint8Array([ 0x01, 0x01, 0x01, speed, 0x02, 0x01, speed]);
     }else if (moveID==2){
       buf = new Uint8Array([ 0x01, 0x01, 0x02, speed, 0x02, 0x02, speed]);
     }else if (moveID==3){
       buf = new Uint8Array([ 0x01, 0x01, 0x02, 0x14, 0x02, 0x01, speed]);
     }else if (moveID==4){
       buf = new Uint8Array([ 0x01, 0x01, 0x01, speed, 0x02, 0x02, 0x14]);
     }else if (moveID==5){
       buf = new Uint8Array([ 0x02, 0x01, 0x01, speed, 0x02, 0x01, speed, 0x50]);
     }
       if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
           cube.moveChar.writeValue( buf );
           console.log('move');
       }

   }

   const cubeStop = ( cubeno ) =>{
       const cube = gCubes[cubeno];
       const buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x00, 0x02, 0x01, 0x00]);
       if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
           setTimeout(() => {cube.moveChar.writeValue( buf )},100);
           console.log('stop');
       }
   }


let prevtab = document.getElementsByClassName("activetab")[0].id;
   function setActive(e){
     console.log('clicked');

     document.getElementsByClassName("activetab")[0].classList.toggle("inactivetab");
     document.getElementsByClassName("activetab")[0].classList.toggle("activetab");


     e.target.classList.toggle("activetab");
     e.target.classList.toggle('inactivetab');

      activeCube = e.target.id;
      console.log(activeCube);
     if(activeCube == 'mycube1'){
       activeCube = 0;
       console.log(activeCube);
     }else if(activeCube == 'mycube2'){
       activeCube = 1;
     }else{
       activeCube = 2;
       console.log(activeCube);
       socket.emit('rem');

       document.getElementById('remoteconnect').classList.toggle('inactive');
       document.getElementById('remoteconnect').classList.toggle('active');

     }

     // console.log("previous meal: " + prevmeal);
     // prevmeal.classList.toggle('active');


   }


function movingForward(){
     console.log('moving forward');
     if (rcUID !== undefined && activeCube==2){
       console.log(rcUID);
       socket.emit('remote', 0, rcUID, 0, speed1);
     }else{
      const cube = gCubes[activeCube];
       if( cube !== undefined  && activeCube == 0){
         console.log('local movement');
       cubeMove( 1 ,0 , speed1);
     }else if(cube !== undefined && activeCube == 1){
       console.log('local movement');
       cubeMove(1,1,speed1);
     }
     }

   };

 function movingBack(){
      if (rcUID !== undefined && activeCube==2){
        console.log(rcUID);
        socket.emit('remote', 2, rcUID, 0, speed1);
      }else{
       const cube = gCubes[activeCube];
        if( cube !== undefined  && activeCube == 0){
          console.log('local movement');
        cubeMove( 2 ,0 , speed1);
      }else if(cube !== undefined && activeCube == 1){
        console.log('local movement');
        cubeMove(2,1,speed1);
      }
      }

    };

function movingR(){
  let turnspeed = Math.floor(parseInt(speed1)*0.5);
  turnspeed = '0x' + turnspeed.toString(16);
     if (rcUID !== undefined && activeCube==2){
       console.log(rcUID);
       socket.emit('remote', 4, rcUID, 0, turnspeed);
     }else{
      const cube = gCubes[activeCube];
       if( cube !== undefined  && activeCube == 0){
         console.log('local movement');
       cubeMove( 4 ,0 , turnspeed);
     }else if(cube !== undefined && activeCube == 1){
       console.log('local movement');
       cubeMove(4,1,turnspeed);
     }
     }

   };

   function movingL(){
     let turnspeed = Math.floor(parseInt(speed1)*0.5);
     turnspeed = '0x' + turnspeed.toString(16);
        if (rcUID !== undefined && activeCube ==2){
          console.log(rcUID);
          socket.emit('remote', 3, rcUID, 0, turnspeed);
        }else{
         const cube = gCubes[activeCube];
          if( cube !== undefined  && activeCube == 0){
            console.log('local movement');
          cubeMove(3 ,0 , turnspeed);
        }else if(cube !== undefined && activeCube == 1){
          console.log('local movement');
          cubeMove(3,1,turnspeed);
        }
        }

      };

function stopping(){
  if (rcUID !== undefined && activeCube ==2){
     socket.emit('remote', 1, rcUID, 0, 0);
   }else{
     const cube = gCubes[activeCube];
     if( cube !== undefined && activeCube ==0){

     cubeStop( 0 );
   }else if( cube !== undefined && activeCube ==1){

        cubeStop( 1 );
        }
   }
 };

 function calculateSpeed(){
   speed1 = Math.floor(slideval*160);
   speed1 = '0x' + speed1.toString(16);
   console.log(speed1);
 }

 const moveJoystick = ( x, y, rem, speed) => {

   if(activeCube == 2 && rem == true){
     socket.emit('remotejoystick',  rcUID, 0, x,y, speed1);
     console.log('remote joystick control');
   }else{
     let cube = gCubes[activeCube];
     let maxspeed = speed1;
     if(speed ==undefined){
     maxspeed = speed1;
    }else{
      maxspeed = speed;
      console.log('speed' + speed);
    }
     if(rem!=true && activeCube ==2){

       cube = gCubes[0];

     }
     var buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x64, 0x02, 0x01, 0x64]);

     let stopmot = 0;

     console.log("x: "+x);
     console.log("y: "+y);
   //calculate whether the motor should go forward or backward.
   //motor speeds are encoded as -.5 to .5 so if it's over 0 then it should go forward.
     let m1fw;
     let m2fw;

     if(y<0){
       console.log("forward");
       m1fw = true;
       m2fw = true
     }else{
       console.log("backward")
       m1fw = false;
       m2fw = false
     }

     let motor1;
     let motor2;
     if(x>0 && Math.abs(y)>0.07){
       console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
         motor1 = Math.floor(Math.abs(y)*maxspeed);
         motor2 = Math.floor(motor1-Math.abs(motor1*x));
         //motor2 = Math.floor(motor1/Math.abs(x*maxspeed*.25));
         motor1 = motor1.toString(16);
         motor1 = "0x" + motor1;
         motor2 = motor2.toString(16);
         motor2 = "0x" + motor2;


     }else if(x==0 && Math.abs(y)>0.07){

   console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
         motor1 = Math.floor(Math.abs(y)*maxspeed);
     motor1 = motor1.toString(16);
     motor1 = "0x" + motor1;
     motor2 = motor1;
   }else if(x<=0 && Math.abs(y)>0.07){
     console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
       motor2 = Math.floor(Math.abs(y)*maxspeed);
       motor1 = Math.floor(motor2-Math.abs(motor2*x));
       //motor1 = Math.floor(motor2/Math.abs(x*maxspeed*.25));
       motor2 = motor2.toString(16);
       motor2 = "0x" + motor2;
       motor1 = motor1.toString(16);
       motor1 = "0x" + motor1;
     }else if(Math.abs(y)<=0.07 && x>0){
       console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
       motor1 = Math.floor(Math.abs(x)*maxspeed*0.2);
       motor2 = motor1;
       m2fw = false;
       m1fw = true;
     }else if(Math.abs(y)<=0.07 && x<=0){
       console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
       motor2 = Math.floor(Math.abs(x)*maxspeed*0.2);
       motor1 = motor2;
       m1fw = false;
       m2fw = true;
     }


     //write forward and backward values
     if(m1fw == true && m2fw==true){
      buf = new Uint8Array([ 0x01, 0x01, 0x01, motor1, 0x02, 0x01, motor2]);
     //buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x32, 0x01, 0x01, 0x32]);
     }else if(m1fw == false && m2fw==true){
      buf = new Uint8Array([ 0x01, 0x01, 0x02, motor1, 0x02, 0x01, motor2]);
     //buf = new Uint8Array([ 0x01, 0x01, 0x02, 0x96, 0x01, 0x01, 0x32]);
   }else if(m1fw == true && m2fw == false){
     buf = new Uint8Array([ 0x01, 0x01, 0x01, motor1, 0x02, 0x02, motor2]);
     //buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x96, 0x02, 0x01, 0x64]);

   }else{
      buf = new Uint8Array([ 0x01, 0x01, 0x02, motor1, 0x02, 0x02, motor2]);
       //  buf = new Uint8Array([ 0x01, 0x01, 0x02, 0x96, 0x02, 0x02, 0x64]);
   }

     if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
       console.log(buf);
         cube.moveChar.writeValue( buf );
         console.log('move');

     }
   }

 }

function btCube(nCube, characteristic, rbuf){
  cube= gCubes[nCube];
  //0: move -- 1: sound -- 2: light -- 3:position

  if(cube != undefined){

  if(characteristic == 0){
    cube.moveChar.writeValue( buf );
  }else if(characteristic == 1){
    cube.soundChar.writeValue( buf );
  }else if(characteristic == 2){
    cube.lightChar.writeValue( buf );
  }else if(characteristic == 3){
    cube.posChar.writeValue( buf );
  }
}

 }



   const initialize = () => {

     // Event Listning for GUI buttons.
     for( let cubeId of CUBE_ID_ARRAY ){
         document.getElementById( 'btConnectCube' + ( cubeId + 1) ).addEventListener( 'click', async ev => {
           console.log('clicked to connect cube');
             if( cubeId === 0 ){
                 gCubes[0] = connectNewCube();
                 console.log('cube 0 connected (cyan)');
             }else if( cubeId === 1 ){
                 gCubes[1] = connectNewCube();
                 console.log('cube 1 connected (green)');
             }else{
                 gCubes[2] = connectNewCube();
                 console.log('cube 3 connected (red)');
             }

           });
       }


       document.getElementById( 'namesubmit' ).addEventListener( 'click', async ev=> {
         name = document.getElementById("name").value;
         console.log(userlist.findIndex(item => item.name ==name));
         console.log(name.length);
         if(name.length >=1 && userlist.findIndex(item => item.name ==name) == -1 && name != undefined && name != " "){
         socket.emit('namesubmit',  name);
         document.getElementById( 'name-form' ).style.display = 'none';
         document.getElementById( 'cube-connect' ).className = 'active';
          document.getElementById( 'connecttocube' ).innerHTML = 'Welcome, ' + name + "! Connect to Toio Core Cube to Begin.";
         return false;
       }else if(userlist.findIndex(item => item.name ==name) != -1){
         alert("This username has already been selected, please choose a unique name.");
       }else if(name.length<1){
         alert("This username is too short, please try again");
       }else{
         alert("Unkown Error! Please try again");
       }} );

       document.getElementById('next').addEventListener('click', async ev=>{
         document.getElementById('cube-connect').className = 'inactive';
         document.getElementById('cube-control').className = 'active';
       })

       document.getElementById('back').addEventListener('click', async ev=>{
         document.getElementById('cube-connect').className = 'active';
         document.getElementById('cube-control').className = 'inactive';
       })
       for(i=0;i<document.getElementsByClassName('tabitem').length;i++){
       document.getElementsByClassName('tabitem')[i].addEventListener('click', setActive, false);
     }

     document.getElementById('close').addEventListener('click', async ev=>{
       document.getElementById('remoteconnect').classList.toggle('inactive');
       document.getElementById('remoteconnect').classList.toggle('active');

     })


      document.getElementById( 'connect' ).addEventListener( 'click', async ev=> {
        if(isconnected1 != true){
        var user = document.getElementById("user").value;
        if(user!=undefined && user !=0){
        document.getElementById('connected1').style.visibility = 'visible';
        document.getElementById('rmt').innerHTML = "Connected to " + user;
        document.getElementById('cwith').innerHTML = "Connected to " + user + ". Do you want to disconnect?";
        document.getElementById('connect').innerHTML = "Disconnect";
        document.getElementById('user').style.visibility = 'hidden';
        document.getElementById('remoteconnect').classList.toggle('inactive');
        document.getElementById('remoteconnect').classList.toggle('active');
        socket.emit('user rc',  user)
        isconnected1 = true;
        return false;
      }
      }else{
        document.getElementById('connect').innerHTML = "Connect";
        document.getElementById('user').style.visibility = 'visible';
        document.getElementById('connected1').style.visibility = 'hidden';
        document.getElementById('rmt').innerHTML = "Remote Cube";
        document.getElementById('cwith').innerHTML = "Who Do You Want To Connect With?";
        isconnected1 = false;
        rcUID = undefined;
      }
      } )

      document.getElementById( 'connect2' ).addEventListener( 'click', async ev=> {
        //if the user is not connected to another user, then
        if(isconnected2 != true){
          var user = document.getElementById("user1").value;
            if(user != undefined && user !=0){
              document.getElementById('connected2').style.visibility = 'visible';
              document.getElementById('connected2').innerHTML = "Connected to " + user;
              //change second connect button to connected
              document.getElementById('connect2').innerHTML = "Disconnect";
              //hide the dropdown
              document.getElementById('user1').style.visibility = 'hidden';
              //send the websocket the identity of the user
              //user remote connect 2, user identity
              socket.emit('user rc 2',  user);
              console.log(user);
              console.log(user.length);
              isconnected2 = true;
        }
        }else{
            document.getElementById('connect2').innerHTML = "Connect";
            document.getElementById('user1').style.visibility = 'visible';
              document.getElementById('connected1').style.visibility = 'hidden';
            isconnected1 = false;
            rcUID2 = undefined;
        }
      } )


   }







   socket.on("connect", () => {
     console.log(socket.connected); // true
     socket.emit("handshake");
   });

   socket.on("ulist connect", (activeUsers) => {
     userlist = activeUsers;
     console.log(userlist);
     console.log(userlist.length);
   });



   socket.on('handshake', (activeUsers) =>{
     console.log(activeUsers);
     document.getElementById('user').length = 0;
     for(let i=0;i<activeUsers.length;  i++){
    if(activeUsers[i].name !== undefined && activeUsers[i].name != name){
    if(activeUsers[i].bt1 == true){
     console.log(i, " ", activeUsers[i].name);
     select = document.getElementById('user');
     var opt = document.createElement('option');
     opt.setAttribute('id', activeUsers[i].name);
     opt.value = activeUsers[i].name;
     opt.innerHTML = activeUsers[i].name;
     select.appendChild(opt);
   }
   // if(activeUsers[i].bt2 == true){
   //   console.log(activeUsers[i]);
   //   select = document.getElementById('user1');
   //   var opt1 = document.createElement('option');
   //   var un2 = activeUsers[i].name + " 2";
   //   opt1.setAttribute('id', un2);
   //   console.log(opt1.getAttribute('id'));
   //   opt1.setAttribute('id', un2);
   //   opt1.value = activeUsers[i].name + " 2";
   //   opt1.innerHTML = activeUsers[i].name + " 2";
   //   select.appendChild(opt1);
   // }
   }
   }

   })

    socket.on('user list', (activeUsers, newUser, cube) => {
      let usersList = activeUsers;
      if(name !== newUser.name){
        if(cube==0){
      select = document.getElementById('user');
      var opt = document.createElement('option');
      opt.setAttribute('id', newUser.name);
      opt.value = newUser.name;
      opt.innerHTML = newUser.name;
      select.appendChild(opt);
      console.log('adding cube 1');
    }
       else if(cube==1){
           select = document.getElementById('user1');
           var opt1 = document.createElement('option');
           var un2 = newUser.name + " 2";
           opt1.setAttribute('id', un2);
           console.log(opt1.getAttribute('id'));
           opt1.value = newUser.name;
           opt1.innerHTML = newUser.name;
           select.appendChild(opt1);
           console.log('adding cube 2');
         }
    }
   console.log(usersList, " ", newUser);


     });



     socket.on('user left', (userName) => {
    console.log(userName, " left the room");
    if(document.getElementById(userName) != null){
    var x = document.getElementById(userName);
    x.remove(x.selectedIndex);
  }
  var un2 = userName + " 2";
  if(document.getElementById(un2) != null){
    var y = document.getElementById(un2);
    console.log("remove " + y);
    y.remove(y.selectedIndex);
  }


      });

      socket.on('user rc', (userID) =>{
          rcUID = userID;
          if(socket.id == userID){
            rcUID = undefined;
          }
          console.log(rcUID);
      });

      socket.on('user rc 2', (userID2) =>{
          rcUID2 = userID2;
          if(socket.id == userID2){
            rcUID2 = undefined;
          }
          console.log(rcUID2);
      });

socket.on('joystick', (nCube, x, y,speed) =>{
  const cube = gCubes[nCube];
   console.log('forward');

   if( cube !== undefined ){
   moveJoystick(x,y,false,speed);
   }

});


socket.on('r', (nCube, characteristic, rbuf) = >{
  btCube(nCube, characteristic, rbuf);
});

   initialize();