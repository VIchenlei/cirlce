// pages/cirtitle/setcir/circlemember/blacklist/blacklist.js
const request = require("../../../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        circleId: '',
        token: '',
        url: '',
        userId: '',
        isempty: '', //黑名单为空则渲染
        iscontempty: '',
        blackListArr: '', //黑名单集合
        total: '', //黑名单总人数
        chooseSize: '',
        setmembers: '',
        idx: '',
        index: '',
        id: '', //用户ID
    },
    //点击弹出框，可移出黑名单
    setIsBlack: function (e) {
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
            setmembers: that.data.blackListArr[idx],
            id: e.currentTarget.dataset.id,
            idx: idx
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
    // 获取黑名单列表
    getBlackList: function () {
        var that = this;
        //加载动态
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var url = that.data.url + '/api/services/app/circle/GetBlackList';
        var data = {
            circleId: that.data.circleId
        };
        var header = {
            'Authorization': 'Bearer ' + that.data.token
        }
        request.GET({
            url: url,
            data: data,
            header: header,
            success: function (res) {
                if (res.data.success == true) {
                    if (res.data.result.blackList.length > 0) {
                        that.setData({
                            blackListArr: res.data.result.blackList,
                            isempty: false,
                            iscontempty: true,
                            total: res.data.result.blackList.length
                        })
                    } else {
                        that.setData({
                            blackListArr: res.data.result.blackList,
                            isempty: true,
                            iscontempty: false,
                            total: res.data.result.blackList.length
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
                setTimeout(function () {
                    wx.hideLoading();
                }, 500);
            }
        })
    },
    //移除黑名单成员
    removeBL: function (e) {
        var that = this;
        var url = that.data.url + '/api/services/app/circle/RemoveBlack';
        var data = {
            circleId: that.data.circleId,
            userId: e.currentTarget.dataset.id
        };
        var header = {
            'Authorization': 'Bearer ' + that.data.token,
            "Content-Type": "application/x-www-form-urlencoded"
        };
        request.DELETE({
            url: url,
            data: data,
            header: header,
            success: function (res) {
                if (res.data.success == true) {
                    that.getBlackList();
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
                that.setData({
                    chooseSize: false
                })
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
            circleId: options.circleId
        })
        that.getBlackList();
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