'use strict';

function RoomMenuArea(document){
  if(!(this instanceof RoomMenuArea)){
    throw Error('must be created with new keyword');
  }
  const RoomMenu=require('./RoomMenu');
  this.MenuList = new RoomMenu(document);
}

module.exports = RoomMenuArea;