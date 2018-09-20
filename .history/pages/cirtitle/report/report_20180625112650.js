// pages/cirtitle/report/report.js
const request = require("../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        reportItem: [{
                name: '色情低俗',
                value: 0
            },
            {
                name: '广告骚扰',
                value: 1
            },
            {
                name: '政治宗教',
                value: 2
            },
            {
                name: '虚假欺骗',
                value: 3
            },
            {
                name: '侵权(肖像、诽谤、抄袭、冒用)',
                value: 4
            },
            {
                name: '违禁内容',
                value: 5
            },
            {
                name: '其他',
                value: 6
            }
        ],
        token: '',
        url: '',
        select: 0,
        themeId: ''
    },
    reportTap: function (e) {
        var that = this;
        var value = e.currentTarget.dataset.value;
        console.log(value)
        switch (value) {
            case 0:
                that.setData({
                    select: value
                })
                break;
            case 1:
                that.setData({
                    select: value
                })
                break;
            case 2:
                that.setData({
                    select: value
                })
                break;
            case 3:
                that.setData({
                    select: value
                })
                break;
            case 4:
                that.setData({
                    select: value
                })
                break;
            case 5:
                that.setData({
                    select: value
                })
                break;
            case 6:
                wx.navigateTo({
                    url: '/pages/cirtitle/report/editreport/editreport?themeid='+that.data.themeId+'&select='+value+''
                })
                break;
        }
    },
    //提交举报内容
    submit: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/ThemeAbout/ReportAsync';
        var data = {
            themeId: that.data.themeId,
            violationType: that.data.select
        };
        var header = {
            'Authorization': 'Bearer ' + that.data.token
        };
        request.POST({
            url: url,
            data: data,
            header: header,
            success: function (res) {           
                if (res.data.success == true) {
                    wx.showToast({
                        title: '举报成功',
                        icon: 'none',
                        duration: 2000,
                        success:function(){
                            wx.navigateBack({
                                delta: 1
                            })
                        }
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
            themeId: options.themeid
        });
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
            isshare: false,
            catchtouchmove: false
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})