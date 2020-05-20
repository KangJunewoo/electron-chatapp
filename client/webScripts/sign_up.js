

(()=>{
  const electron = require('electron');
  
  /**
   * ipcRenderer는 일렉트론의 이벤트 처리 & 메세지 전송을 담당한다고 생각하면 됨.
   * HELLO가 뜨면, 메세지 출력.
   * 로그인 성공하면, 메세지 출력 알림창 띄우기
   * 뭐 이런식으로 쭉쭉.
   */
  const ipcRenderer = electron.ipcRenderer;
  const SocketEvent = require('./handler_manager/event/SocketEvent');
  ipcRenderer.on(SocketEvent.HELLO, (event, message)=>{
    console.log(message);
  });

  // dom element 긁어와주고
  const userIdInput = document.getElementById('user-id-input');
  const userPwInput = document.getElementById('user-pw-input');
  const cancelButton = document.getElementById('button-Cancel');
  const signUpButton = document.getElementById('button-SignUp');

  // signin버튼 클릭하면 signInRequest 이벤트로 입력한 id비번 쏴준다!
  cancelButton.addEventListener('click', ()=>{
    console.log('merong');
    ipcRenderer.send('destroySignUpModal');

  });

  //사인업버튼 클릭하면 입력한 idpw를 signUpRequest로 쏴줌.
  signUpButton.addEventListener('click', ()=>{
    console.log('click');
    const id = userIdInput.value;
    const pw = userPwInput.value;
    const parameter = {
      id:id,
      pw:pw
    };
    ipcRenderer.send('signUpRequest', parameter);

  });
  ipcRenderer.on('signUpRequest-Success', (event,message)=>{
    console.log(message);
    alert('가입성공');
    ipcRenderer.send('destroySignUpModal');
  });
  ipcRenderer.on('signUpRequest-Failed', (event,message)=>{
    console.log(message);
    alert(message.statusText);
  });
})();