

function RefreshTokenDialog(document){
  if(!(this instanceof RefreshTokenDialog)){
    throw new Error('must be created with new keyword');
  }
  this.view=document.getElementById('refreshTokenDialogWrapper');
}

RefreshTokenDialog.prototype.show=function(){
  this.view.classList.toggle('show');
};

module.exports=RefreshTokenDialog;