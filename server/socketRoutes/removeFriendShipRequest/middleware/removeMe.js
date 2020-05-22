module.exports=(updatedUser, message)=>{
  const User = require('../../../model/User');
  const query={
    _id:message._id
  };
  const update={
    $pull:{
      friends:updatedUser._id
    }
  };
  const options = {
    new:true
  };
  return User.findOneAndUpdate(query,update,options).exec();
};