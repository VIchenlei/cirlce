// pages/news/helper/helper.js
const request = require("../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoad: false,
        token: '',
        url: '',
        helperArr: '',
        pageIndex: 1,
        pageSize: 15000,
        circleId: ''
    },
    getHelperNoticeList: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/notice/GetHelperNoticeList';
        var data = {
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
                console.log(res)
                if (res.data.success == true) {
                    that.setData({
                        helperArr: res.data.result.helperList,
                        isLoad: true,
                        circleId: res
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
                setTimeout(function () {
                    wx.stopPullDownRefresh();
                }, 500)
            }
        })
    },
    //点击弹出弹出窗
    showModal: function (e) {
        console.log(e)
        var idx = e.currentTarget.dataset.idx;
        // 用that取代this，防止不必要的情况发生
        var that = this;
        // 创建一个动画实例
        var animation = wx.createAnimation({
            // 动画持续时间
            duration: 500,
            // 定义动画效果，当前是匀速
            timingFunction: 'linear'
        })
        // 将该变量赋值给当前动画
        that.animation = animation
        // 先在y轴偏移，然后用step()完成一个动画
        animation.translateY(400).step()
        // 用setData改变当前动画
        that.setData({
            // 通过export()方法导出数据
            animationData: animation.export(),
            // 改变view里面的Wx：if
            chooseSize: true,
            idx: idx,
            setmembers: that.data.helperArr[idx]
        })
        // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export()
            })
        }, 400)
    },
    //取消关闭设置权限弹出窗
    hideModal: function (e) {
        var that = this;
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(400).step()
        that.setData({
            animationData: animation.export()

        })
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export(),
                chooseSize: false
            })
        }, 400)
    },
    //同意加入申请
    agreeTap: function (e) {
        console.log(e)
        var that = this;
        var circleId = e.currentTarget.dataset.circleid;
        var userId = e.currentTarget.dataset.userid;
        var url = that.data.url + '/api/services/app/circle/AgreeRequest';
        var data = {
            circleId: circleId,
            userId: userId
        };
        var header = {
            'Authorization': 'Bearer ' + that.data.token
        };
        request.POST({
            url: url,
            data: data,
            header: header,
            success: function (res) {
                console.log(res)
                if (res.data.success == true) {
                    that.getHelperNoticeList();
                    that.setData({
                        chooseSize: false
                    })
                } else {
                    wx.showModal({
                        content: res.data.error.message,
                        confirmColor: "#077bfb",
                        showCancel: false
                    })
                    that.setData({
                        chooseSize: false
                    })
                }

            },
            fail: function () {

            },
            complete: function () {
                wx.hideLoading();
            }
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
        this.getHelperNoticeList();
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