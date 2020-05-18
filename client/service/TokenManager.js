'use strict';
function TokenManager(){
  if(!(this instanceof TokenManager)){
    throw new Error('Must be created with new key word');
  }

  let id;
  let refreshToken;
  this.setId = (userId)=>{
    id=userId;
  }
  this.getId = ()=>{
    return id;
  }
  this.getToken=()=>{
    return refreshToken;
  }
  this.setToken=(token)=>{
    refreshToken=token;
  }
}

module.exports=TokenManager;