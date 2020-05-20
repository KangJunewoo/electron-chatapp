

module.exports = (socket, win, TokenManager, err)=>{
  console.log(`socket error is ${err}`);

  // 토큰매니저는 토큰 관련 기능들을 수행하나보다. 말그대로 토큰을 request하는 함수.
  const tokenRequest = ()=>{
    const token=TokenManager.getToken();
    const id = TokenManager.getId();
    return httpInstance.get('/users/token?id='+id,{headers:{'x-access-token':token}});
  };

  // 만료되면 tokenrefresh 시도. 성공하면 토큰 set&get, 실패하면 에러출력.
  if(err==='TokenRefresh'){
    tokenRequest()
      .then((response)=>{
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