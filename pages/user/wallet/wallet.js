// pages/user/wallet/wallet.js
const request = require("../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: '',
        url: '',
        isLoad:false,//数据请求完成为true页面显示
        _canCashAmount:'',//可提现金额,
        _incomeAmount: '',//累积收入
    },
    getWalletInfo: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/appUser/GetWalletInfo';
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
                    that.setData({
                        _canCashAmount:res.data.result.canCashAmount,
                        _incomeAmount: res.data.result.incomeAmount
                    })
                } else {
                    wx.showModal({
                        content: res.data.error.message,
                        showCancel: false,
                        confirmColor:'#077bfb'
                    })
                }
            },
            fail: function () {

            },
            complete: function () {
                that.setData({
                    isLoad:true
                })
            }
        })
    },
    // 提现
    withdrawTap:function(){
        wx.showModal({
            title:'请在APP内进行提现',
            content: '如果本机未安装APP,可以前往苹果App Store或安卓应用商店，搜索并安装“不叫事圈儿”，也可以复制链接在浏览器打开，快捷安装应用',
            cancelText:'知道了',
            confirmColor: "#077bfb",
            confirmText:'复制链接',
            cancelColor: "#077bfb",
            success: function (res) {
                if (res.confirm) {
                    wx.setClipboardData({
                        data: 'https://quanzi.bjser.com/download/index.html',
                        success: function (res) {
                            wx.showToast({
                                title: '复制成功',
                                icon:'none'
                            })
                        }
                    })
                } else if (res.cancel) {

                }
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
        this.getWalletInfo();
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