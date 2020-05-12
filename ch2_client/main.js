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
    protocol:'file'
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
    protocol:'file:'
  }));

  modal.on('ready-to-show', ()=>{
    modal.show();
  });

  modal.on('closed', ()=>{
    modal = null;
  });
};

const destroySignUpModal = (event, message)=>{
  console.log('merong');
  modal.close();
};

// 일렉트론 앱 구동 전 준비사항들.
// 옵션세팅, 창띄우기, 보여질url, 개발자도구, ready-to-show에서 show 넘어가기, 닫히면 종료하기
app.on('ready', displayLoginWindow);

ipcMain.on('displaySignUpModal', displaySignUpModal);
ipcMain.on('destroySignUpModal', destroySignUpModal);

// signInRequest 이벤트를 감지했다면 실행될 콜백함수.
// 소켓을 만들어 url과 옵션(토큰포함)을 넣고,
// 핸들러 추가한다음에,
// signinrequest-success 이벤트를 아까 요청한 응답과 함께 쏴준...는듯? 에러처리도 들어가있고.
ipcMain.on('signInRequest', (event,message)=>{
  // 백으로 post요청을 보내면 response가 돌아오겠지.
  httpInstance.post('/users/login', message)
    .then((response)=>{
      // promise는 추후에 계속 이야기해준다고 한다.
      const socketURL = 'ws://127.0.0.1:3000';
      const socketOptions={
        transports:['websocket'],
        forceNew:true,
        query:{
          token:response.data.token
        }
      };
      // createSocket, addHandlers 둘 다 service에서 정의한 함수! 별 건 없다.
      socket=SocketService.createSocket(io,socketURL,socketOptions);
      SocketService.addHandlers(socket,win,handler_manager);
      event.sender.send('signInRequest-Success', response);
    })
    .catch((error)=>{
      const result={
        status:error.response.status,
        statusText:error.response.statusText
      }
      event.sender.send('signInRequest-Failed', result);
    })
});

app.on('window-all-closed', ()=>{
  app.quit();
});
app.on('activate', ()=>{
  app.quit();
});

