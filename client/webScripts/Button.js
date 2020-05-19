'use strict';

function Button(element){
  // TODO  instanceof가 뭘까
  if(!(this instanceof Button)){
    throw Error('must be created with new keyboard');
  }
  this.view= element;
  this.eventListener=undefined;
}

Button.prototype.setEventListener=function(listener){
  if(this.eventListener){
    this.view.removeEventListener('click', this.eventListener);
  }
  this.eventListener=listener;
  this.view.addEventListener('click', this.eventListener);  
}

module.exports = Button;