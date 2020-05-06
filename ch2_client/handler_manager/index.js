'use strict';

const SocketEvent = require('./event/SocketEvent');

module.exports=[
  {
    event:SocketEvent.CONNECT,
    handler:require('./handler/OnConnect'),
  },
  {
    event:SocketEvent.CONNECT_TIMEOUT,
    handler:require('./handler/OnConnectTimeout'),
  },
  {
    event:SocketEvent.DISCONNECT,
    handler:require('./handler/OnDisconnect'),
  },
  {
    event:SocketEvent.HELLO,
    handler:require('./handler/OnHello'),
  },
  {
    event:SocketEvent.PING,
    handler:require('./handler/OnPing'),
  },
  {
    event:SocketEvent.PONG,
    handler:require('./handler/OnPong'),
  },
  {
    event:SocketEvent.RECONNECT_ERROR,
    handler:require('./handler/OnReconnectError'),
  },
  {
    event:SocketEvent.RECONNECT_FAILED,
    handler:require('./handler/OnReconnectFailed'),
  },
  {
    event:SocketEvent.RECONNECTING,
    handler:require('./handler/OnReconnecting'),
  }
]