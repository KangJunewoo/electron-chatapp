module.exports=(decodedUser)=>{
  const User = require('../../../model/User');
  return new Promise((resolve,reject)=>{
    User.findOne({_id:decodedUser._id})
      .then((user)=>{
        if(!user) return reject(new Error('user not found'));
        const result={
          User:user,
          friend:undefined,
          Task:undefined,
          updatetasks:[]
        };
        return resolve(result);
      })
      .catch((error)=>{
        return reject(error);
      })
  })
};