module.exports=(socket, result)=>{
  socket.join(result.room._id);
  // TODO : resolve vs reject?
  return Promise.resolve(result);
};