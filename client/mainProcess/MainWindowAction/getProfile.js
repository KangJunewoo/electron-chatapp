module.exports=(MainEvent,TokenManager,event,message)=>{
  event.sender.send(MainEvent,TokenManager.getId());
};