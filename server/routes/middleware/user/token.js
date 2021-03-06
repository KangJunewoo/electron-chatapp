exports.validateParameter = (req,res,next)=>{
  const token = req.headers['x-access-token'];
  const id=req.query.id;
  if(!id){
    const error = new Error('bad request');
    error.status=400;
    return next(error);
  } else if(!token){
    const error = new Error('bad request');
    error.status=400;
    return next(error);
  }
  return next();
};

exports.verifyToken = (req,res,next)=>{
  const jsonwebtoken = require('jsonwebtoken');
  const token = req.headers['x-access-token'];
  const cert = 'secret';
  jsonwebtoken.verify(token,cert,(err,decodedUser)=>{
    if(err){
      if(err.name==='TokenExpiredError'){
        return next();
      } else{
        return next(new Error('Unauthorized'));
      }
    }
    res.json({token:token});
  });
};

exports.findUser = (req,res,next)=>{
  const User=require('../../../model/User');
  const id=req.query.id;
  const setUser=(user)=>{
    if(!user){
      const error=new Error('User Not Found');
      error.status=404;
      return next(error);
    }
    req.SearchUser = user;
    return next();
  }
  const OnError = (error)=>{
    return next(error);
  }
  User.findOne({id:id}).select({id:1,password:1,CreatedAt:1})
    .then(setUser)
    .catch(OnError)
};
exports.createToken = (req,res,next)=>{
  const jsonwebtoken=require('jsonwebtoken');
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
    req.refreshedToken = token;
    req.SearchUser.set({token:token});
    req.SearchUser.save()
      .then(()=>{
        return next();
      })
      .catch((error)=>{
        return next(error);
      });
  });
};

exports.responseToUser=(req,res,next)=>{
  res.json({token:req.refreshedToken});
}