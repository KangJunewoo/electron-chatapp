module.exports = (decodedUser, message)=>{
  const Room = require('../../../model/Room');
  const room = new Room({
    roomName:message.roomName
  });

  room.participants.push(decodedUser._id);
  return new Promise((resolve, reject)=>{
    room.save()
      .then((room)=>{
        return resolve({user:decodedUser, room:room});
      })
      .catch((error)=>{
        return reject(error);
      });
  })
}