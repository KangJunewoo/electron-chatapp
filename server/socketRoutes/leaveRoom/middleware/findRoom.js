module.exports=(decodedUser, message)=>{
  const Room = require('../../../model/Room');
  return new Promise((resolve,reject)=>{
    Room.findOne({_id:message._id})
      .then((room)=>{
        return resolve({user:decodedUser, room:room});
      })
      .catch((error)=>{
        return reject(error);
      })
  })
}