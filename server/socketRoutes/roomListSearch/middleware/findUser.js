module.exports = (decodedUser)=>{
  const User = require('../../../model/User');
  return User.findOne({id:decodedUser.id}).populate('rooms');
}