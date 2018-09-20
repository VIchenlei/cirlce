const request = require("../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        publishnum: "0",
        starnum: "0",
        qrimg: "/images/qr.png",
        qrtxt: "不叫事儿服务号",
        token: '',
        url: '',
        info: '',
        isLoad: '',
        jsonInfo: '',
        head: '',
        nickName: '',
        gender: '',
        sign: '',
        phone: ''
    },
    getUserInfo: function (e) {
        var that = this;
        var url = that.data.url + '/api/services/app/appUser/GetUserInfo';
        var data = {};
        var header = {
            'Authorization': 'Bearer ' + that.data.token
        };
        request.GET({
            url: url,
            data: data,
            header: header,
            success: function (res) {
                if (res.data.success == true) {
                    var jsonInfo = JSON.stringify(res.data.result);
                    that.setData({
                        head: res.data.result.avatarUrl,
                        isLoad: true,
                        nickName: res.data.result.nickName,
                        gender: res.data.result.gender,
                        sign: res.data.result.sign,
                        phone: res.data.result.phoneNumber,
                        info: res.data.result
                    })
                    wx.setNavigationBarTitle({
                        title: '' + res.data.result.nickName + ''
                    })
                } else {
                    wx.showModal({
                        content: res.data.error.message,
                        confirmColor: "#077bfb",
                        showCancel: false
                    })
                }
            },
            fail: function () {

            },
            complete: function () {}
        })
    },
    personaTap: function (e) {
        var sign = this.data.sign;
        var nickName = this.data.nickName;
        var gender = this.data.gender;
        var phone = this.data.phone;
        var head = this.data.head;
        wx.navigateTo({
            url: '/pages/user/personalData/personalData?head=' + head + '&nickName=' + nickName + '&gender=' + gender + '&sign=' + sign + '&phone=' + phone + ''
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
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
        this.getUserInfo();
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})