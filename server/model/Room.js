let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let RoomSchema = new Schema({
  roomName:{type:String,required:true},
  participants:[{type:Schema.Types.ObjectId, ref:'User'}],
  messages:[{type:Schema.Types.ObjectId, ref:'Message'}],
  CreatedAt:{type:Date,default:Date.now},
  UpdatedAt:{type:Date,default:Date.now},
});

module.exports = mongoose.model('Room', RoomSchema);