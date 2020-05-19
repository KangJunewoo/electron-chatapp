'use strict';

function ChatArea(document){
  if(!(this instanceof ChatArea)){
    throw new Error('must be created with new keyword');
  }
  const MessageList = require('./MessageList');
  const MessageInputView=require('./MessageInputView');
  this.MessageList=new MessageList(document);
  this.MessageInputView=new MessageInputView(document);

}
module.exports = ChatArea;