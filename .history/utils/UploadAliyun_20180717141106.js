
const uploadFile = function (filePath, dir, successc, failc) {
    if (!filePath) {
        wx.showModal({
            title: '出现错误',
            content: '请重试',
            showCancel: false,
        })
        return;
    }  
    wx.request({
      url:"https://quaner.bjser.com/api/AliyunOSS/GenPostPolicy",
      header:{
        'Authorization':"Bearer "+wx.getStorageSync('_token')
      },
      success:function(res){
        wx.uploadFile({
          url: res.data.requestUri,
          filePath: filePath,
          name: 'file',//必须填file
          formData: {
            'key': dir + "${filename}",
            'policy': res.data.policy,
            'OSSAccessKeyId': res.data.accessKeyId,
            'signature': res.data.signature,
            'success_action_status': '200',
          },
          success: function (res) {
            console.log(filePath)
            if (res.statusCode != 200) {
              failc(new Error('上传错误:' + JSON.stringify(res)))
              return;
            }
            console.log('上传图片成功', res)
            successc(filePath)
          },
          fail: function (err) {
            err.wxaddinfo = res.data.requestUri;
            failc(err);
          },
        })
      }
    })
  
    
}


module.exports = uploadFile;