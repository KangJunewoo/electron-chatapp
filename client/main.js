'use strict';
const electron = require('electron');
// 원래 electron은 app BrowserWindow만 있음. 이벤트를 쓰니 ipcMain도 추가된듯.
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

const handler_manager = require('./handler_manager');
const SocketService = require('./service/SocketService');

// 윈도우의 win과 소켓의 socket
let win;
let socket;
let modal;
let waitDialog;
let listener;
let errorListener;

const displayLoginWindow = (event, message)=>{
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
  win.loadURL(url.format({
    pathname:path.join(__dirname, 'login.html'),
    protocol:'file',
    slashes:true,
  }));
  win.webContents.openDevTools();
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

const displaySignUpModal = (event, message)=>{
  win.webContents.send("hide-page");
  modal = new BrowserWindow({
    parent:win,
    modal:true,
    show:false,
    /**
     * 분명 modal을 띄우고 cancel을 눌렀는데 닫혀지지가 않아서
     * 왜!!!!!! 를 외치며 코드를 뒤적인 결과 도저히 찾을 수 없어서
     * 개발자도구를 누르니 require is not defined라고 되어있어서
     * 혹시 이것때문인가..? 하고 구글링을 했는데
     * nodeIntegration 관련 내용이 나와서 아.. require은 노드 함수지 생각해서
     * 이 옵션을 하나 더 줬더니 정상작동한다 ㅜㅜㅜ
     * 강사는 이 옵션을 미리 줬던건가...???? 모르겠지만
     * 나름 의미있는 삽질이었다.
     */
    webPreferences:{ 
      nodeIntegration:true
    }
  });

  modal.loadURL(url.format({
    pathname:path.join(__dirname, 'SignUpModal.html'),
    protocol:'file'
  }));

  modal.on('ready-to-show', ()=>{
    modal.show();
  });

  modal.on('closed', ()=>{
    modal = null;
  });
};

const destroySignUpModal = (event, message)=>{
  win.webContents.send('hide-page');
  modal.close();
};

const createSignUpRequest = (event, message)=>{
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

const displayWaitDialog = (event, message)=>{
  const options = {
    width:800,
    height:800,
    resizeable:false,
    fullscreenable:false,
    show:false,
    // frameless window가 생성됨. 위테두리가 없어..
    frame:false,
    webPreferences:{
      affinity:true,
      nodeIntegration:true,
    }
  };
  waitDialog = new BrowserWindow(options);
  waitDialog.loadURL(url.format({
    pathname:path.join(__dirname, 'WaitDialog.html'),
    protocol:'file',
    // 이건 무엇인고..
    slashes:true,
  }));
  waitDialog.once('ready-to-show', ()=>{
    win.hide();
    waitDialog.show();
    const socketURL = 'ws://127.0.0.1:3000';
    const socketOptions={
      transports:['websocket'],
      forceNew:true,
      query:{
        // 이 부분을 asdf로 바꾸면 권한이 없다고 뜬다.
        token:message.data.token
      }
    };
    // createSocket, addHandlers 둘 다 service에서 정의한 함수! 별 건 없다.
    socket=SocketService.createSocket(io,socketURL,socketOptions);
    // 첫번째인 connect onconnect 리스너만. index.js에서 달아놓은 그거!!
    listener = SocketService.addHandler(socket,waitDialog,handler_manager[0]);
    errorListener = SocketService.addHandler(socket,waitDialog,handler_manager[1]);
  });
  waitDialog.on('closed',()=>{
    console.log('window closed');
    waitDialog=null;
  });
};

const destroyWaitDialog = (event, message)=>{
  socket.removeListener('connect', listener);
  socket.removeListener('error', errorListener);
  // win.loadFile(path.join(__dirname, 'main.html'));
  console.log(path.join(__dirname, 'main.html'));
  win.loadURL(url.format({
    pathname:path.join(__dirname, 'main.html'),
    protocol:'file',
    // 이건 무엇인고..
    slashes:true,
  }));
  // FIXME : 여기서 ready-to-show로 안넘어가는 문제가...
  // 야매로 해버리긴 했는데 이거 너무 찜찜하다.
  SocketService.addHandlers(socket,win,handler_manager);
  waitDialog.close();
  win.show();
  // win.on('ready-to-show', ()=>{
  //   // waitDialog.close();
  //   SocketService.addHandlers(socket,win,handler_manager);
  //   waitDialog.close();
  //   win.show();
  // });
};


// 일렉트론 앱 구동 전 준비사항들.
// 옵션세팅, 창띄우기, 보여질url, 개발자도구, ready-to-show에서 show 넘어가기, 닫히면 종료하기
app.on('ready', displayLoginWindow);
ipcMain.on('displayWaitDialog', displayWaitDialog);
ipcMain.on('destroyWaitDialog', destroyWaitDialog);
ipcMain.on('displaySignUpModal', displaySignUpModal);
ipcMain.on('destroySignUpModal', destroySignUpModal);
ipcMain.on('signUpRequest', createSignUpRequest);

// signInRequest 이벤트를 감지했다면 실행될 콜백함수.
// 소켓을 만들어 url과 옵션(토큰포함)을 넣고,
// 핸들러 추가한다음에,
// signinrequest-success 이벤트를 아까 요청한 응답과 함께 쏴준...는듯? 에러처리도 들어가있고.
ipcMain.on('signInRequest', (event,message)=>{
  // 백으로 post요청을 보내면 response가 돌아오겠지.
  httpInstance.post('/users/login', message)
    .then((response)=>{
       event.sender.send('signInRequest-Success', response);
    })
    .catch((error)=>{
      const result={
        status:error.response.status,
        statusText:error.response.statusText
      }
      event.sender.send('signInRequest-Failed', result);
    });
});

app.on('window-all-closed', ()=>{
  app.quit();
});
app.on('activate', ()=>{
  app.quit();
});

