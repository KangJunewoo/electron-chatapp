'use strict';

function LeaveRoomDialog(document){
  if(!(this instanceof LeaveRoomDialog)){
    throw new Error('must be created with new keyword');
  }
  const Button=require('./Button');
  this.view=document.getElementById('leaveRoomDialogWrapper');
  this.confirmButton=new Button(document.getElementById('leaveConfirmbutton'));
  this.cancelButton=new Button(document.getElementById('leaveCancelbutton'));
}

LeaveRoomDialog.prototype.show=function(){
  this.view.classList.toggle("show");
  return Promise.resolve();
};
module.exports=LeaveRoomDialog;