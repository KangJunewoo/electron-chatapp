'use strict';

function ListFriendRequestDialog(document){
  if(!(this instanceof ListFriendRequestDialog)){
    throw new Error('must be created with new keyword');
  }
  const Button=require('./Button');
  this.view=document.getElementById('listFriendRequestDialogWrapper');
  this.items=document.getElementById('friendRequestList');
  this.ItemFactory=undefined;
  this.CloseButton=new Button(document.getElementById('listFriendCloseButton'));
  this.eventListener = undefined;
}

ListFriendRequestDialog.prototype.show=function(){
  this.view.classList.toggle("show");
  return Promise.resolve();
};

ListFriendRequestDialog.prototype.dismiss=function(){
  this.view.classList.toggle('show');
}

ListFriendRequestDialog.prototype.setSelectListener=function(listener){
  if(this.eventListener){
    this.items.removeEventListener('click', this.eventListener);
  }
  this.items=listener;
  this.items.addEventListener('click', this.eventListener);
}
ListFriendRequestDialog.prototype.setCloseListener=function(listener){
  this.CloseButton.setEventListener(listener);
}
ListFriendRequestDialog.prototype.addItem=function(message){
  // TODO : addItem
}
ListFriendRequestDialog.prototype.removeAllItem=function(){
  // TODO : remove All Item
}
ListFriendRequestDialog.prototype.executeLoader=function(id){
  // TODO : execute Loader
}
ListFriendRequestDialog.prototype.removeItem=function(id){
  // TODO : remove item
}
module.exports=ListFriendRequestDialog;