'use strict';
// 1로 변경한거.

module.exports = (socket, win, TokenManager, err)=>{
  console.log(`socket error is ${err}`);

  const tokenRequest = ()=>{
    const token=TokenManager.getToken();
    const id = TokenManager.getId();
    return httpInstance.get('/users/token?id='+id,{headers:{'x-access-token':token}});
  };

  if(err==='TokenRefresh'){
    tokenRequest()
      .then((reponse)=>{
        TokenManager.setToken(response.data.token);
        socket.io.opts.query = {token:TokenManager.getToken()};
        win.webContents.send('tokenRefreshing-Success');
      })
      .catch((e)=>{
        win.webContents.send('tokenRefreshing-Failure');
      })
  } else{
    win.webContents.send('RedirectLoginPage');
  }
  
}