'use strict';

(()=>{
  const electron = require('electron');
  const ipcRenderer = electron.ipcRenderer;
  const SocketEvent = require('./../handler_manager/event/SocketEvent');
  ipcRenderer.on(SocketEvent.HELLO, (event, message)=>{
    console.log(message);
  })
})();