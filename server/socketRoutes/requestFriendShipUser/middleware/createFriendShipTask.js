module.exports=(result)=>{
  return new Promise((resolve, reject)=>{
    if(!result.friend){
      return reject(new Error('user not found'));
    }
    result.friend.friendReceiveRequests.push(result.User._id);
    result.User.friendRequests.push(result.friend._id);
    result.updateTasks.push(result.friend.save());
    result.updateTasks.push(result.User.save());
    return resolve(result);
  })
};