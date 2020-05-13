'use strict';

exports.InitMongoDB=(env, mongoose)=>{
  if(env.VCAP_SERVICES){
    /**
     * Cloud환경
     */
  } else{
    /**
     * Local환경
     */
    const connectURL='mongodb+srv://admin:admin123@firstexample-l3dig.mongodb.net/test?retryWrites=true&w=majority'
    const options={
      connectTimeoutMS:4000,
      keepAlive:true,
      ha:true,
      /*
      강의에선 이렇게 했는데 경고뜨기 싫어서 아래옵션 두개 대신 적용함.
      괜찮겠지?
      autoReconnect:true,
      reconnectTries:30,
      */
      useNewUrlParser:true,
      useUnifiedTopology:true,
    }
    mongoose.connect(connectURL, options);
    const db = mongoose.connection;
    db.on('open', ()=>{
      console.log('connected');
    });
  }
};