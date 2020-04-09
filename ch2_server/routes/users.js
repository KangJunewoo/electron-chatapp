'use strict';
const express = require('express');
const router = express.Router();

router.post('/login', (req,res,next)=>{
  // object destructuring 문법.
  const {id, pw} = req.body;
  
  if(id !== 'hi'){
    const error = new Error('user not found');
    error.status(404);
    return next(error);
    
    // 아래 방법은 에러처리 미들웨어를 사용하지 않는 코드.
    // return res.status(404).json({msg:'user not found'});

  } else if(pw !== 'bye'){
    const error = new Error('invalid password');
    error.status(401);
    return next(error);
  }
  
  //무사히 넘어가면
  next();
})

router.post('/login', (req,res,next)=>{
  res.json({msg:'login success'});
});

//user 생성요청
router.post('/', (req,res,next)=>{
  /**
   * 아래처럼 쓰는게 주석의 정석인가보다~ 그냥 한 번 써봄.
   * user 생성요청
   * body : id, pw
   * method : post
   * content-type : x-www-urlencoded, application/json
   */
  /**
   TODO DB 모델갖고 실제 user 구현
   */
  const {id,pw}=req.body;

  if(id !== 'hi'){
    const error = new Error('bad request');
    error.status = 400;
    return next(error);
  } else if(pw !== 'bye'){
    const error = new Error('bad request');
    error.status = 400;
    return next(error);
  }
  //지금은 /에 대한 라우터 미들웨어를 두 번 사용했지만, 또 콜백함수 인자를 줘서 합칠수도있다.
  //}, (req,res,next)=>{res.json(req.CreatedUser);}도 가능. rout라는 string을 줘야 한다고 한다.
  
  const User={
    id:id,
    pw:pw,
  };
  req.CreatedUser = User;
  next();
});

router.post('/', (req,res,next)=>{
  res.json(req.CreatedUser);
})

module.exports = router;