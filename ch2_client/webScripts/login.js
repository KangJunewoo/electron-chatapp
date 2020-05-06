'use strict';

(()=>{
  const electron = require('electron');
  const ipcRenderer = electron.ipcRenderer;
  const SocketEvent = require('././handler_manager/event/SocketEvent');
  ipcRenderer.on(SocketEvent.HELLO, (event, message)=>{
    console.log(message);
  });
  const userIdInput = document.getElementById('user-id-input');
  const userPwInput = document.getElementById('user-pw-input');
  const signInButton = document.getElementById('button-SignIn');
  const signUpButton = document.getElementById('button-SignUp');

  signInButton.addEventListener('click', ()=>{
    console.log('click');
    const id = userIdInput.value;
    const pw = userPwInput.value;
    const parameter = {
      id:id,
      pw:pw
    };
    ipcRenderer.send('signInRequest', parameter);

  });
  ipcRenderer.on('signInRequest-Success', (event,message)=>{
    console.log(message);
    alert(message.statusText);
  });
  ipcRenderer.on('signInRequest-Failed', (event,message)=>{
    console.log(message);
    alert(message.statusText);
  });
  signUpButton.addEventListener('click', ()=>{
    console.log('click');
    const id = userIdInput.value;
    const password = userPasswordInput.value;
    const parameter = {
      id:id,
      pw:password
    };
    ipcRenderer.send('signUpRequest', parameter);

  });
  ipcRenderer.on('signUpRequest-Success', (event,message)=>{
    console.log(message);
    alert(message.statusText);
  });
  ipcRenderer.on('signUpRequest-Failed', (event,message)=>{
    console.log(message);
    alert(message.statusText);
  });
})();