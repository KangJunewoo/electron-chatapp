module.exports = (result, message)=>{
  const Room = require('../../../model/Room');
  const Task = [];
  if(!result.targetUser) return Promise.reject(new Error('user not found'));
  const query = {
    _id:message.roomId
  };
  const update = {
    $push:{
      participants:result.targetUser._id,
    }
  }
  const options={
    new:true
  };
  result.targetUser.rooms.push(message.roomId);
  Task.push(result.targetUser.save());
  Task.push(Room.findOneAndUpdate(query,update,options).exec());
  return new Promise((resolve,reject)=>{
    // 전달된 iterable promise들을 전부 실행하고나서의 결과를 전달해줌.
    Promise.all(Task)
      .then((taskResults)=>{
        result.taskResults = taskResults;
        return resolve(result);
      })
      .catch((errors)=>{
        return reject(errors);
      });
  })
};