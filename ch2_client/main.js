'use strict';
const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const url = require("url");
const path = require('path');
const io = require('socket.io-client');
const axios = require('axios');
const httpInstance = axios.create({
  baseURL:'http://127.0.0.1:3000'
})

const handler_manager = require('./handler_manager');
const SocketService = require('./service/SocketService');

let win;
let socket;

app.on('ready', ()=>{
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
  })
});

ipcMain.on('signInRequest', (event,message)=>{
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

