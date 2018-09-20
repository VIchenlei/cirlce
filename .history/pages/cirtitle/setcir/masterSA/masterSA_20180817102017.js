// pages/cirtitle/setcir/masterSA/masterSA.js
const request = require("../../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        circleId: '',
        role: '',
        token: '',
        url: '',
        userId: '',
        isSetUpTheme: '', //圈主可修改发布主题权限
        isShowInvit: '', //管理不显示邀请榜权限
        isShareWx: '',
        isOpenMemberList: '',
        isInvit: '',
        isPrivateChat: '',
        isShowTen: '',
        publishPayThemePerson: '',
        publishThemePerson: ''
    },
    ShareWxChange: function (e) {
        var that = this;
        that.setData({
            isShareWx: e.detail.value
        })
        var value = {
            circleId: that.data.circleId,
            allowShareToWechat: that.data.isShareWx,
            openMemberList: that.data.isOpenMemberList,
            openInviteList: that.data.isInvit,
            allowPrivateChat: that.data.isPrivateChat,
            allowGuestScanTop10: that.data.isShowTen
        }
        if (that.data.role == 1) {
            that.ModifyPermissions(value);
        } else if (that.data.role == 2) {
            that.ModifyPermissions(value);
        }
    },
    OpenMemberListChange: function (e) {
        var that = this;
        that.setData({
            isOpenMemberList: e.detail.value
        })
        var value = {
            circleId: that.data.circleId,
            allowShareToWechat: that.data.isShareWx,
            openMemberList: that.data.isOpenMemberList,
            openInviteList: that.data.isInvit,
            allowPrivateChat: that.data.isPrivateChat,
            allowGuestScanTop10: that.data.isShowTen
        }
        if (that.data.role == 1) {
            that.ModifyPermissions(value);
        } else if (that.data.role == 2) {
            that.ModifyPermissions(value);
        }
    },
    InvitChange: function (e) {
        var that = this;
        that.setData({
            isInvit: e.detail.value
        })
        var value = {
            circleId: that.data.circleId,
            allowShareToWechat: that.data.isShareWx,
            openMemberList: that.data.isOpenMemberList,
            openInviteList: that.data.isInvit,
            allowPrivateChat: that.data.isPrivateChat,
            allowGuestScanTop10: that.data.isShowTen
        }
        if (that.data.role == 1) {
            that.ModifyPermissions(value);
        } else if (that.data.role == 2) {
            that.ModifyPermissions(value);
        }
    },
    PrivateChatChange: function (e) {
        var that = this;
        that.setData({
            isPrivateChat: e.detail.value
        })
        var value = {
            circleId: that.data.circleId,
            allowShareToWechat: that.data.isShareWx,
            openMemberList: that.data.isOpenMemberList,
            openInviteList: that.data.isInvit,
            allowPrivateChat: that.data.isPrivateChat,
            allowGuestScanTop10: that.data.isShowTen
        }
        if (that.data.role == 1) {
            that.ModifyPermissions(value);
        } else if (that.data.role == 2) {
            that.ModifyPermissions(value);
        }
    },
    ShowTenChange: function (e) {
        var that = this;
        that.setData({
            isShowTen: e.detail.value
        })
        var value = {
            circleId: that.data.circleId,
            allowShareToWechat: that.data.isShareWx,
            openMemberList: that.data.isOpenMemberList,
            openInviteList: that.data.isInvit,
            allowPrivateChat: that.data.isPrivateChat,
            allowGuestScanTop10: that.data.isShowTen
        }
        if (that.data.role == 1) {
            that.ModifyPermissions(value);
        } else if (that.data.role == 2) {
            that.ModifyPermissions(value);
        }
    },
    ModifyPermissions: function (value) {
        var that = this;
        var url = that.data.url + '/api/services/app/circle/EditMasterCirclePermissions';
        var data = value;
        var header = {
            'Authorization': 'Bearer ' + that.data.token
        };
        request.POST({
            url: url,
            data: data,
            header: header,
            success: function (res) {
                if (res.data.success == true) {

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
    //获取圈子信息
    getCircleInfo: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/circle/GetCircleInfo';
        var data = {
            circleId: that.data.circleId
        };
        var header = {
            'Authorization': 'Bearer ' + that.data.token
        };
        request.GET({
            url: url,
            data: data,
            header: header,
            success: function (res) {
                console.log(res)
                if (res.data.success == true) {
                    that.setData({
                        isShareWx: res.data.result.allowShareToWechat,
                        isOpenMemberList: res.data.result.openMemberList,
                        isInvit: res.data.result.openInviteList,
                        isPrivateChat: res.data.result.allowPrivateChat,
                        isShowTen: res.data.result.allowGuestScanTop10,
                        publishPayThemePerson: res.data.result.publishPayThemePerson,
                        publishThemePerson: res.data.result.publishThemePerson
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
            circleId: options.circleid,
            role: options.role
        })
        if (options.role > 1) {
            that.setData({
                isSetUpTheme: false
            })
        } else {
            that.setData({
                isSetUpTheme: true
            })
        }

        that.getCircleInfo();
    },
    //刷新请求
    refresh: function () {
        this.getCircleInfo();
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