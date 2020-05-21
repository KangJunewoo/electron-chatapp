module.exports = (User, socket)=>{
  User.rooms.forEach((room)=>{
    socket.join(room._id);
  });
};