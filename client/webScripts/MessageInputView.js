'use strict';

function MessageInputView(document){
  if(!(this instanceof MessageInputView)){
    throw new Error('must be created with new keyword');
  }
  const Button=require('./Button');
  this.view=document.getElementById('chatAreaInputWrapper');
  this.textArea=document.getElementById('messageTextArea');
  this.sendButton=new Button(document.getElementById('sendMessageButton'));

}

MessageInputView.prototype.getMessage = function(){
  const text = this.textArea.value;
  return text;
};
MessageInputView.prototype.setSendEventListener=function(listener){
  this.sendButton.setEventListener(listener);
};
MessageInputView.prototype.keyDownEventHandler=function(event){
  // 한글합성자모같이 특별한 경우 229 반환. 처리하지 않으려고.
  if(event.keyCode===229){
    return;
  }
  switch(event.key){
  case 'Enter':
    event.shiftKey===true?this.onShiftEnter():this.onEnter(event);
    break;
  }
};
// 엔터누르면 줄바꿈 하지 않고 이벤트 발생시키겠다.
MessageInputView.prototype.onEnter=function(event){
  event.preventDefault();
  const clickEvent = new Event('click');
  this.sendButton.view.dispatchEvent(clickEvent);
};
MessageInputView.prototype.onShiftEnter=function(){

}
module.exports=MessageInputView;