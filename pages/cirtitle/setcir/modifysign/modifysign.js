// pages/cirtitle/setcir/modifysign/modifysign.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: "", //输入框内容
        disabled: false,
        token: "",
        ciruserid: "",
        url: "",
    },
    //输入框输入时获取输入内容
    btnvalue: function (e) {
        this.setData({
            value: e.detail.value
        })

    },
    //清空输入框内容
    clearTap: function () {
        this.setData({
            value: ""
        })
    },
    //修改名字发送到后台
    modsignTap: function () {
        var that = this;
        var value = that.data.value;
        var ciruserid = that.data.ciruserid;
        wx.request({
            url: that.data.url + "/api/services/app/circle/EditMyCircleSign",
            data: {
                sign: value,
                circleUserId: ciruserid
            },
            method: "post",
            header: {
                'Authorization': 'Bearer ' + that.data.token,
                "Content-Type": "application/json"
            },
            success: function (res) {
                console.log(res)
                if (res.statusCode == 200) {
                    wx.navigateBack({
                        delta: 1
                    })
                }
                if (res.statusCode == 500) {
                    wx.showToast({
                        title: '请重新登录',
                        icon:'none',
                        duration:2000
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            value: options.name,
            ciruserid: options.ciruserid,
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url')
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
            mySign: this.data.value
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
})