module.exports=(decodedUser)=>{
  const User= require('../../../model/User');
  return new Promise((resolve,reject)=>{
    User.findOne({_id:decodedUser._id}).populate('friendReceiveRequests')
      .then((user)=>{
        if(!user) return reject(new Error('user not found'));
        return resolve(user);
      })
      .catch((error)=>{
        return reject(error);
      })
  })
};