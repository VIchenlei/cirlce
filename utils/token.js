const token={
  gettoken:function(){
        var _token;
        wx.request({
          url: "https://quanzi.bjser.com/api/Account/Authenticate",
          method: "POST",
          data: {
            "usernameOrEmailAddress": "LC",
            "password": "880911"
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res)
            _token = res.data.result;
            wx.setStorage({
              key: "_token",
              data: _token,
              success: function (res) {
                console.log(res);
                console.log("存储成功");
                return _token;
              }
            })
          }
        });
      }
}
module.exports = token;