exports.validateParameter =  (req,res,next)=>{
  // object destructuring 문법.
  const {id, pw} = req.body;
  
  if(!id){
    const error = new Error('bad request');
    error.status = 400;
    return next(error);
    
    // 아래 방법은 에러처리 미들웨어를 사용하지 않는 코드.
    // return res.status(404).json({msg:'user not found'});

  } else if(!pw){
    const error = new Error('bad request');
    error.status = 400;
    return next(error);
  }
  
  return next();
};

exports.comparePassword=(req,res,next)=>{
  const UserModel=require('../../../model/User');
  const bcrypt = require('bcrypt');
  const {id, pw} = req.body;
  const OnError=(error)=>{
    return next(error);
  }
  const comparePassword=(user)=>{
    if(!user){
      const error = new Error('user not found');
      error.status=404;
      return next(error);
    };
    req.SearchUser=user;
    return bcrypt.compare(pw, user.password);
  };
  const compareResultResponse = (isValid)=>{
    if(isValid){
      return next();
    }
    const error=new Error('invalid password');
    error.status=401;
    return next(error);
  };
  
  UserModel.findOne({id:id}).select({id:1,password:1,CreatedAt:1})
    .then(comparePassword)
    .then(compareResultResponse)
    .catch(OnError);
};

exports.createJsonWebToken = (req,res,next)=>{
  const jsonwebtoken = require('jsonwebtoken');
  const options = {
    algorithm:"HS256",
    expiresIn:"10000",
    issuer:"http://127.0.0.1",
  };
  const cert = "secret";
  const plainObject = req.SearchUser.toObject({getters:true});
  jsonwebtoken.sign(plainObject, cert, options, (err, token)=>{
    if(err){
      return next(err);
    }
    req.CreatedToken = token;
    return next();
  });
};

exports.updateUserWithToken = (req,res,next)=>{
  const OnError = (error)=>{
    return next(error);
  }

  const updateResultResponse = (updatedUser)=>{
    req.SearchUser = updatedUser;
    return next();
  }
  
  req.SearchUser.set({token:req.CreatedToken});
  req.SearchUser.save()
    .then(updateResultResponse)
    .catch(OnError)
};

exports.responseToUser = (req,res,next)=>{
  res.json({token:req.CreatedToken});
};