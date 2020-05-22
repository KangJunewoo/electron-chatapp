module.exports=(decodedUser)=>{
  const User = require('../../../model/User');
  return User.findOne({_id:decodedUser.id}).populate('friends');
};