

(()=>{
  const electron = require('electron');
  
  /**
   * ipcRenderer는 일렉트론의 이벤트 처리 & 메세지 전송을 담당한다고 생각하면 됨.
   * HELLO가 뜨면, 메세지 출력.
   * 로그인 성공하면, 메세지 출력 알림창 띄우기
   * 뭐 이런식으로 쭉쭉.
   */
  const ipcRenderer = electron.ipcRenderer;
  // 소켓 연결되면 hello 이벤트 발생했었지.
  ipcRenderer.on('hello', (event, args)=>{
    console.log(event);
    console.log(event.sender);
    event.sender.send('destroyWaitDialog');
    console.log(event.sender);
    console.log('event send complete');
  });
})();