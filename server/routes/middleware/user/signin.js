exports.createUser = (req,res,next)=>{
  const UserModel = require('../../../model/User');
  const bcrypt = require('bcrypt');

  const {id,pw}=req.body;

  if(!id){
    const error = new Error('bad request');
    error.status = 400;
    return next(error);
  } else if(!pw){
    const error = new Error('bad request');
    error.status = 400;
    return next(error);
  }
  
  const generateStrictPassword = (salt) =>{
    return bcrypt.hash(pw, salt);
  };
  const createUser = (strictPassword)=>{
    const User = new UserModel({
      id:id,
      password:strictPassword
    });
    req.CreatedUser=User;
    next();
  };
  const OnError = (error)=>{
    return next(error);
  }
  bcrypt.genSalt(13)
    .then(generateStrictPassword)
    .then(createUser)
    .catch(OnError);

};

exports.saveUser = (req,res,next)=>{
  const OnError = (error)=>{
    return next(error);
  }
  req.CreatedUser.save()
    .then((user)=>{
      req.CreatedUser=user;
      return next();
    })
    .catch(OnError)
};

exports.responseToUser=(req,res,next)=>{
  res.json(req.CreatedUser);
};