module.exports = (socket, win, TokenManager)=>{
  const token = TokenManager.getToken();
  const id= TokenManager.getId();
  socket.io.opts.query = {id:id, token:token};
  socket.io.opts.transports = ['websocket'];
}