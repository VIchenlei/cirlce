// pages/news/moneyFlow/moneyFlow.js
const request = require("../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: '',
        url: '',
        pageIndex: 1,
        pageSize: 10,
        moneyFlowArr: '',
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏
    },
    getMoneyFlowList: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/notice/GetMoneyFlowList';
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
                        moneyFlowArr: res.data.result.moneyFlowList
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
    //跳转详情
    detailimgTap: function (e) {
        console.log(e)
        var themeId = e.currentTarget.dataset.themeid;
        var circleId = e.currentTarget.dataset.circleid;
        if (themeId != 0) {
            var id = themeId;
            wx.navigateTo({
                url: '/pages/themedetails/themedetails?id=' + id + ''
            })
        } else if (circleId != 0) {
            var id = circleId;
            wx.navigateTo({
                url: '/pages/cirtitle/cirtitle?id=' + id + ''
            })
        }

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
        this.getMoneyFlowList();
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
        var pageidx = this.data.pageIndex;
        var that = this;
        pageidx++
        that.setData({
            searchLoading: true,
            pageIndex: pageidx
        })
        //上拉加载更多收支列表
        wx.request({
            url: that.data.url + "/api/services/app/notice/GetMoneyFlowList",
            method: "post",
            data: {
                pageIndex: pageidx,
                pageSize: 10
            },
            header: {
                'Authorization': 'Bearer ' + that.data.token
            },
            success: function (res) {
                if (res.data.success == true) {
                    var arr = res.data.result.moneyFlowList;
                    if (arr.length == 0) {
                        that.setData({
                            searchLoadingComplete: true,
                            searchLoading: false,
                            pageIndex: pageidx - 1
                        })
                    } else {
                        for (var i = 0; i < arr.length; i++) {
                            that.data.moneyFlowArr.push(arr[i]);
                        }
                        that.setData({
                            moneyFlowArr: that.data.moneyFlowArr
                        });
                    }
                } else {
                    wx.showModal({
                        content: res.data.error.message,
                        confirmColor: "#077bfb",
                        showCancel: false
                    })
                }
            },
            fail: function (err) {
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: function () {
                that.setData({
                    searchLoading: false
                })
                setTimeout(function () {
                    that.setData({
                        searchLoadingComplete: false
                    })
                }, 1000)

            }
        });
    },
})