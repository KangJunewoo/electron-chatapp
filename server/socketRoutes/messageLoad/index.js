module.exports=(socket, event)=>{
  const Verifier = require('../../util/Verifier');
  const JWTVerifier = new Verifier();
  const findRoom = require('./middleware/findRoom');
  const sendSuccessAck = require('./middleware/sendSuccessAck');
  const sendFailureAck = require('./middleware/sendFailureAck');

  socket.on(event, (message,ack)=>{
    JWTVerifier.verify(socket, message.token)
      .then(()=>{
        return findRoom(message);
      })
      .then((room)=>{
        return sendSuccessAck(room, message, ack);
      })
      .catch((error)=>{
        return sendFailureAck(error, message,ack);
      })
  })
}