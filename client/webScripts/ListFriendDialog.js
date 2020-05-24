

function ListFriendDialog(document){
  if(!(this instanceof ListFriendDialog)){
    throw new Error('must be created with new keyword');
  }
  const Button=require('./Button');
  const MessageItemFactoy=require('./MessageItemFactory');
  this.view=document.getElementById('listFriendDialogWrapper');
  this.items=document.getElementById('friendList');
  this.ItemFactory=new MessageItemFactoy(document);
  this.CloseButton=new Button(document.getElementById('listCancelButton'));
  this.eventListener = undefined;
}

ListFriendDialog.prototype.show=function(ipcRenderer){
  this.view.classList.toggle("show");
  const message = {};
  ipcRenderer.send('searchFriend', message);
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
  const messageItem = this.ItemFactory.createFriendItem(message);
  this.items.appendChild(messageItem);
}
ListFriendDialog.prototype.removeAllItem=function(){
  const items=this.items;
  return new Promise((resolve,reject)=>{
    if(!items) return reject();
    while(items.firstChild){
      items.removeChild(items.lastChild);
    }
    resolve();
  });
}
ListFriendDialog.prototype.executeLoader=function(id){
  const items=this.items;
  return new Promise((resolve,reject)=>{
    let isExecute=false;
    items.childNodes.forEach(function (element){
      if(element.id===id){
        isExecute=true;
        element.lastChild.classList.toggle('show');
      }
    });
    isExecute===true?resolve():reject();
  })
}
ListFriendDialog.prototype.removeItem=function(id){
  this.items.childNodes.forEach(function(element){
    if(element.id===id){
      element.remove();
    }
  }, this);
}
module.exports=ListFriendDialog;