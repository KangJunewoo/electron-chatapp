'use strict';

function RoomArea(document){
  if(!(this instanceof RoomArea)){
    throw Error('must be created with new keyword');
  }
  const Button = require('./Button');
  const RoomList = require('./RoomList');
  const Profile = require('./Profile');
  this.RoomList=new RoomList(document);
  this.Profile=new Profile(document);
  this.FriendMenuButton=new Button(document.getElementById('openFriendMenuButton'));
  this.CreateRoomButton=new Button(document.getElementById('createRoomButton'));
}

module.exports=RoomArea;