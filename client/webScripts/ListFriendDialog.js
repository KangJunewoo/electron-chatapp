'use strict';

function ListFriendDialog(document){
  if(!(this instanceof ListFriendDialog)){
    throw new Error('must be created with new keyword');
  }
  const Button=require('./Button');
  this.view=document.getElementById('listFriendDialogWrapper');
  this.items=document.getElementById('friendList');
  this.ItemFactory=undefined;
  this.CloseButton=new Button(document.getElementById('listCancelButton'));
  this.eventListener = undefined;
}

ListFriendDialog.prototype.show=function(){
  this.view.classList.toggle("show");
  return Promise.resolve();
};

ListFriendDialog.prototype.dismiss=function(){
  this.view.classList.toggle('show');
}

ListFriendDialog.prototype.setSelectListener=function(listener){
  if(this.eventListener){
    this.items.removeEventListener('click', this.eventListener);
  }
  this.items=listener;
  this.items.addEventListener('click', this.eventListener);
}
ListFriendDialog.prototype.setCloseListener=function(listener){
  this.CloseButton.setEventListener(listener);
}
ListFriendDialog.prototype.addItem=function(message){
  // TODO : addItem
}
ListFriendDialog.prototype.removeAllItem=function(){
  // TODO : remove All Item
}
ListFriendDialog.prototype.executeLoader=function(id){
  // TODO : execute Loader
}
ListFriendDialog.prototype.removeItem=function(id){
  // TODO : remove item
}
module.exports=ListFriendDialog;