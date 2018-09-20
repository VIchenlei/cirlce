// pages/user/wallet/detail/detail.js
const request = require("../../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: '',
        url: '',
        pageIndex: 1,
        pageSize: 10,
        emptytxt: "空空如也",
        emptyimg: "/images/empty.png",
        paymentDetailArr: [], //收支明细集合
    },
    //获取收支明细列表
    getPaymentDetail: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/appUser/GetPaymentDetail';
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
                        paymentDetailArr: res.data.result.paymentDetailList
                    })
                } else {
                    wx.showModal({
                        content: res.data.error.message,
                        showCancel: false,
                        confirmColor: '#077bfb'
                    })
                }
            },
            fail: function () {

            },
            complete: function () {
                that.setData({
                    isLoad: true
                })
            }
        })
    },
    //点击跳转收支详情
    // jumpDetailTap:function(e){
    //     console.log(e)
    //     var message = JSON.stringify(e.currentTarget.dataset.message);
    //     console.log(message)
    //     wx.navigateTo({
    //         url: '/pages/user/wallet/detail/detailMessage/detailMessage?message=' + message+''
    //     })
    // },
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
        this.getPaymentDetail();
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
            url: that.data.url + "/api/services/app/appUser/GetPaymentDetail",
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
                    var arr = res.data.result.paymentDetailList;
                    if (arr.length == 0) {
                        that.setData({
                            searchLoadingComplete: true,
                            searchLoading: false,
                            pageIndex: pageidx - 1
                        })
                    } else {
                        for (var i = 0; i < arr.length; i++) {
                            that.data.paymentDetailArr.push(arr[i]);
                        }
                        that.setData({
                            paymentDetailArr: that.data.paymentDetailArr
                        });
                    }
                } else {
                    wx.showModal({
                        content: res.data.error.message,
                        showCancel: false,
                        confirmColor: '#077bfb'
                    })
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
                }, 1000)

            }
        });
    },
})