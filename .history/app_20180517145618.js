//app.js
App({
    onLaunch: function (options) {
        // 展示本地存储能力
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)
        // wx.removeStorageSync('logs')
        const updateManager = wx.getUpdateManager();

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })

        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })

        });

        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showToast({
                title:'下载失败',
                icon:'none'
            })
        });
        
    },
    globalData: {
        userInfo: null
    }
})