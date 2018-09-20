// pages/user/myRelease/myRelease.js
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
        name: '',
        head: '',
        themeArr: '',
        imgList: '',
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏
        searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    },
    getPublishList: function () {
        var that = this;
        //加载动态
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var url = that.data.url + '/api/services/app/theme/GetPublishList';
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
                        name: res.data.result.nickName,
                        head: res.data.result.avatarUrl,
                        themeArr: res.data.result.themeList
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
                wx.hideLoading();
            }
        })
    },
    //跳转至详情页面
    detailTap: function (e) {
        console.log(e)
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/themedetails/themedetails?id=" + id + ""
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url')
        });
        this.getPublishList();

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
        var pageidx = this.data.pageIndex;
        var that = this;
        pageidx++
        that.setData({
            searchLoading: true,
            pageIndex: pageidx
        })
        //上拉加载更多圈子主体详情列表
        wx.request({
            url: that.data.url + "/api/services/app/theme/GetPublishList",
            method: "post",
            data: {
                pageIndex: pageidx,
                pageSize: 10
            },
            header: {
                'Authorization': 'Bearer ' + that.data.token
            },
            success: function (res) {
                console.log(res)
                var arr = res.data.result.themeList;
                if (arr.length == 0) {
                    that.setData({
                        searchLoadingComplete: true,
                        searchLoading: false,
                        pageIndex: pageidx - 1
                    })
                } else {
                    for (var i = 0; i < arr.length; i++) {
                        that.data.themeArr.push(arr[i]);
                    }
                    that.setData({
                        themeArr: that.data.themeArr
                    });
                }
            },
            fail: function (err) {
                wx.showToast({
                    title: '服务器异常！',
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
                }, 2000)

            }
        });
    },

})