let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  id:{type:String, required:true},
  password:{type:String,required:true},
  token:String,
  agoToken:String,
  socketId:String,
  friends:[{type:Schema.Types.ObjectId, ref:'User'}],
  friendReceiveRequests:[{type:Schema.Types.ObjectId, ref:'User'}],
  friendRequests:[{type:Schema.Types.ObjectId, ref:'User'}],
  rooms:[{type:Schema.Types.ObjectId, ref:'Room'}],
  inviteRooms:[{type:Schema.Types.ObjectId, ref:'Room'}],
  CreatedAt:{type:Date,default:Date.now},
  UpdatedAt:{type:Date,default:Date.now},
});

module.exports = mongoose.model('User', UserSchema);