
module.exports = (socket,win,TokenManager)=>{
  const axios = require('axios');
  const httpInstance = axios.create({baseURL:'http://127.0.0.1:3000'});

  const tokenRequest = ()=>{
    const token=TokenManager.getToken();
    const id = TokenManager.getId();
    return httpInstance.get('/users/token?id='+id,{headers:{'x-access-token':token}});
  };
  win.webContents.send('tokenRefreshing');
  tokenRequest()
    .then((response)=>{
      TokenManager.setToken(response.data.token);
      socket.io.opts.query = {token:TokenManager.getToken()};
      win.webContents.send('tokenRefreshing-Success');
    })
    .catch((e)=>{
      win.webContents.send('tokenRefreshing-Failure');
    })
}