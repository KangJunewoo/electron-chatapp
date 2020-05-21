(socket,next)=>{
  const User = require('../../model/User');
  const jsonwebtoken=require('jsonwebtoken');
  const token = socket.handshake.query.token;
  const cert = 'secret';
  console.log(`token is ${token}`);
  jsonwebtoken.verify(token,cert,(err,decodedUser)=>{
    if(err){     
      if(err.name==='TokenExpiredError'){
        socket.isExistNewToken=true;
        return next();
      } else{
        return next(new Error('unauthorized'));
      }
    }
    User.findOne({id:decodedUser.id})
      .then((user)=>{
        if(!user){
          return next(new Error('unauthorized'));
        }
        user.token===token?next():next(new Error('unauthorized'));
        return;
      })
      .catch((error)=>{
        return next(new Error('unauthorized'));
      });
  });
}