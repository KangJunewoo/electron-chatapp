module.exports = (decodedUser, message)=>{
  const User = require('../../../model/User');
  return new Promise((resolve,reject)=>{
    User.findOne({id:MessageChannel.id})
      .then((user)=>{
        return resolve({targetUser:user, sender:decodedUser});
      })
      .catch((error)=>{
        return reject(error);
      });
  });
};