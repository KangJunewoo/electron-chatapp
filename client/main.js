
// 클라이언트가 돌아가는 메인 js코드

const electron = require('electron');
// app, BrowserWindow : 일렉트론 기본 내장 / ipcMain : 이벤트 처리 담당
const {app, BrowserWindow, ipcMain} = electron;
const url = require("url");
const path = require('path');
const io = require('socket.io-client');

/**
 * 프론트 - 백의 통신을 위한 axios 모듈
 * 아래에 백 url을 입력해 httpInstance로 통신.
 */
const axios = require('axios');
const httpInstance = axios.create({
  baseURL:'http://127.0.0.1:3000'
})

const SocketEvent = require('./handler_manager/event/SocketEvent'); //이벤트
const handler_manager = require('./handler_manager'); // 핸들러
const SocketService = require('./service/SocketService'); // 리스너
const TokenManager = require('./service/TokenManager'); // 토큰매니저
const tokenManager = new TokenManager();

let win; let socket; let modal; let waitDialog; let listener; let errorListener; let locale;

// 이벤트들.
// 1. 로그인창 띄우기 (초기화면)
const displayLoginWindow = (event, message)=>{
  // 1-1. 옵션 설정해 win창에 담고
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
  const options = {
    width:width,
    height:height,
    resizeable:false,
    fullscreenable:false,
    show:false,
    webPreferences:{
      affinity:true,
      nodeIntegration:true,
    }
  };
  win = new BrowserWindow(options);

  // 1-2. html파일 정해주고
  win.loadURL(url.format({
    pathname:path.join(__dirname, 'login.html'),
    protocol:'file',
    slashes:true,
  }));
  win.webContents.openDevTools();

  // 1-3. 준비완료될때 띄우고 닫았을때 종료해줌.
  win.once('ready-to-show', ()=>{
    console.log('ready-to-show');
    win.show();
  });
  win.on('closed',()=>{
    console.log('window closed');
    win=null;
    app.quit();
  });
};

// 2. 회원가입창 띄우기
const displaySignUpModal = (event, message)=>{
  // 구조는 위와 같다.
  win.webContents.send("hide-page");
  options={
    parent:win,
    modal:true,
    show:false,
    // require is not defined 삽질의 결과
    webPreferences:{
      nodeIntegration:true,
    },
  }
  modal = new BrowserWindow(options);

  modal.loadURL(url.format({
    pathname:path.join(__dirname, 'SignUpModal.html'),
    protocol:'file'
  }));

  modal.once('ready-to-show', ()=>{
    modal.show();
  });
  modal.on('closed', ()=>{
    modal = null;
  });
};

// 3. 회원가입창 닫기
const destroySignUpModal = (event, message)=>{
  win.webContents.send('hide-page');
  modal.close();
};

// 4. 회원가입 request 생성
const createSignUpRequest = (event, message)=>{
  // 드디어 백으로 요청을 보내는구나
  httpInstance.post('/users', message)
    .then((response)=>{
      event.sender.send('signUpRequest-Success', response.data);
    })
    .catch((error)=>{
      const result={
        status:error.response.status,
        statusText:error.response.statusText
      }
      event.sender.send('signUpRequest-Failed', result);
    })
};

// 5. 로딩창 띄우기
const displayWaitDialog = (event, message)=>{
  const options = {
    width:800,
    height:800,
    resizeable:false,
    fullscreenable:false,
    show:false,
    frame:false, // 위테두리 없음
    webPreferences:{
      affinity:true,
      nodeIntegration:true,
    }
  };
  waitDialog = new BrowserWindow(options);
  waitDialog.loadURL(url.format({
    pathname:path.join(__dirname, 'WaitDialog.html'),
    protocol:'file',
    slashes:true,
  }));

  waitDialog.once('ready-to-show', ()=>{
    win.hide();
    waitDialog.show();
    // 띄운 다음에 작업 ㄱㄱ
    const socketURL = 'ws://127.0.0.1:3000';
    const socketOptions={
      transports:['websocket'],
      forceNew:true,
      query:{
        id:tokenManager.getId(),
        // 이 부분을 asdf로 바꾸면 권한이 없다고 뜬다.
        token:message.data.token
      }
    };
    
    // 소켓 만들고, 토큰 설정하고, connect 핸들러로 리스너 만들고, 혹시모를 에러리스너도 만들고.
    socket=SocketService.createSocket(io,socketURL,socketOptions);
    tokenManager.setToken(message.data.token);
    listener = SocketService.addHandler(socket,waitDialog,handler_manager[SocketEvent.CONNECT]);
    errorListener = SocketService.addHandlerWithTokenManager(socket,waitDialog,handler_manager[SocketEvent.ERROR], tokenManager);
  });
  waitDialog.on('closed',()=>{
    waitDialog=null;
  });
};

// 6. 로딩창 닫기
const destroyWaitDialog = (event, message)=>{
  // 소켓에 달아놨던 두 리스너 없애고
  socket.removeListener('connect', listener);
  socket.removeListener('error', errorListener);
  win.webContents.clearHistory();
  win.resizable=true;
  win.fullScreenable=true;
  win.setMinimumSize(600,600);
  win.loadURL(url.format({
    pathname:path.join(__dirname, 'main.html'),
    protocol:'file',
    slashes:true,
  }));
  // FIXME : 여기서 ready-to-show로 안넘어가는 문제가...
  // 야매로 해버리긴 했는데 나중에 해결해보자. 깜빡임 발생하는거 말고는 큰 차이 없다.
  SocketService.addHandlers(socket,win,handler_manager);
  SocketService.addHandler(socket, win, handler_manager[SocketEvent.CONNECT]);
  SocketService.addHandlerWithTokenManager(socket,win,handler_manager[SocketEvent.RECONNECT_ATTEMPT],tokenManager);
  SocketService.addHandlerWithTokenManager(socket,win,handler_manager[SocketEvent.DISCONNECT],tokenManager);
  SocketService.addHandlerWithTokenManager(socket,win,handler_manager[SocketEvent.TOKENREFRESHREQUIRED],tokenManager);
  SocketService.addHandlerWithTokenManager(socket,win,handler_manager[SocketEvent.BROADCAST_MESSAGE],tokenManager);
  SocketService.addHandlerWithTokenManager(socket,win,handler_manager[SocketEvent.RECEIVE_INVITEUSER],tokenManager);
  SocketService.addHandlerWithTokenManager(socket, win, handler_manager[SocketEvent.ERROR], tokenManager);
  
  waitDialog.close();
  locale=app.getLocale();
  win.webContents.send('getProfile',{name:tokenManager.getId(),locale:locale});
  win.show();
  // win.once('ready-to-show', ()=>{
  //   SocketService.addHandlers(socket,win,handler_manager);
  //   SocketService.addHandler(socket, win, handler_manager[SocketEvent.CONNECT]);
  //   SocketService.addHandlerWithTokenManager(socket,win,handler_manager[SocketEvent.RECONNECT_ATTEMPT],tokenManager);
  //   SocketService.addHandlerWithTokenManager(socket,win,handler_manager[SocketEvent.DISCONNECT],tokenManager);
  //   SocketService.addHandlerWithTokenManager(socket,win,handler_manager[SocketEvent.TOKENREFRESHREQUIRED],tokenManager);
  //   SocketService.addHandlerWithTokenManager(socket,win,handler_manager[SocketEvent.BROADCAST_MESSAGE],tokenManager);
  //   SocketService.addHandlerWithTokenManager(socket,win,handler_manager[SocketEvent.RECEIVE_INVITEUSER],tokenManager);
  //   SocketService.addHandlerWithTokenManager(socket, win, handler_manager[SocketEvent.ERROR], tokenManager);
    
  //   waitDialog.close();
  //   locale=app.getLocale();
  //   win.webContents.send('getProfile',{name:tokenManager.getId(),locale:locale});
  //   win.show();
  // });
};

// 7. 로그인 요청
const signInRequest = (event, message)=>{
  httpInstance.post('/users/login', message)
    .then((response)=>{
      tokenManager.setId(message.id);
      event.sender.send('signInRequest-Success', response);
    })
    .catch((error)=>{
      const result={
        status:error.response.status,
        statusText:error.response.statusText
      }
      event.sender.send('signInRequest-Failed', result);
    });
}

// 앱이 준비되면 로그인화면 띄우고, 각 이벤트가 준비되면, 그에 맞는 리스너를 띄운다.
app.on('ready', displayLoginWindow);
ipcMain.on('displayWaitDialog', displayWaitDialog);
ipcMain.on('destroyWaitDialog', destroyWaitDialog);
ipcMain.on('displaySignUpModal', displaySignUpModal);
ipcMain.on('destroySignUpModal', destroySignUpModal);
ipcMain.on('signUpRequest', createSignUpRequest);
ipcMain.on('signInRequest', signInRequest);

app.on('window-all-closed', ()=>{
  app.quit();
});
app.on('activate', ()=>{
  app.quit();
});

