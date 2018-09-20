// pages/cirtitle/setcir/invite/invite.js
const request = require("../../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        circleId: '',
        token: '',
        url: '',
        userId: '',
        isempty: '',
        isinviteList: '',
        inviteArr: '',
        pageIndex: 1,
        pageSize: 1500,
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏
        searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    },
    //获取邀请榜
    getInvitList: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/circle/GetInviteList';
        var data = {
            circleId: that.data.circleId,
            pageIndex: that.data.pageIndex,
            pageSize: that.data.pageSize
        };
        var header = {
            'Authorization': 'Bearer ' + that.data.token
        };
        request.POST({
            url: url,
            data: data,
            header: header,
            success: function (res) {
                var arr = res.data.result.inviteUserList;
                if (res.data.success == true) {
                    if (arr.length > 0) {
                        that.setData({
                            isempty: false,
                            isinviteList: true,
                            inviteArr: res.data.result.inviteUserList
                        })
                    } else {
                        that.setData({
                            isempty: true,
                            isinviteList: false
                        })
                    }
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
            complete: function () {

            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url'),
            userId: wx.getStorageSync('_userid'),
            circleId: options.circleid
        })
        that.getInvitList();
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