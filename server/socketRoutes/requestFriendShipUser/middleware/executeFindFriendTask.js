module.exports=(result)=>{
  return new Promise((resolve,reject)=>{
    result.Task
      .then((friend)=>{
        result.friend=friend;
        return resolve(result);
      })
      .catch((error)=>{
        return reject(error);
      });
  });
};