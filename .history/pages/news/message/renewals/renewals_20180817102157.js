// pages/news/message/renewals/renewals.js
const request = require("../../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token:'',
        url:'',
        circleId:'',
        tollList: [] ,//包月  季度等s
        type:'',
        payMoney:'',
        name:'',
        disabled:true
    },
    // 保留2位小数，不足补0
    formatFloat: function (x) {
        var f = Number(x);
        if (isNaN(f))
            return false;
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 1) {
            s += '0';
        }
        return s;
    },
    getThemeList: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/theme/GetGuestView';
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
                if (res.data.success == true) {
                    var paySetInfo = res.data.result.paySetInfo;
                    var tollList = that.data.tollList;
                    if (paySetInfo.setMonthPay == true) {
                        tollList.push({
                            tollName: '包月',
                            tollNum: that.formatFloat(paySetInfo.monthPay),
                            type: 5
                        })
                    }
                    if (paySetInfo.setQuarterlyPay == true) {
                        tollList.push({
                            tollName: '季度',
                            tollNum: that.formatFloat(paySetInfo.quarterlyPay),
                            type: 6
                        })
                    }
                    if (paySetInfo.setHalfYearPay == true) {
                        tollList.push({
                            tollName: '半年',
                            tollNum: that.formatFloat(paySetInfo.halfYearPay),
                            type: 7
                        })
                    }
                    if (paySetInfo.setYearPay == true) {
                        tollList.push({
                            tollName: '一年',
                            tollNum: that.formatFloat(paySetInfo.yearPay),
                            type: 8
                        })
                    }
                    if (paySetInfo.setForeverPay == true) {
                        tollList.push({
                            tollName: '永久',
                            tollNum: that.formatFloat(paySetInfo.foreverPay),
                            type: 9
                        })
                    }

                    that.setData({
                        tollList: tollList,
                        name: res.data.result.circleInfo.name
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
    //选择续费服务
    selectToll:function(e){
        console.log(e)
        this.setData({
            type: e.currentTarget.dataset.type,
            payMoney: e.currentTarget.dataset.tollnum,
            disabled:false
        })
    },
    //确认续费
    surebtn:function(){
        var that = this;
        var type = that.data.type;
        var tollNum = that.data.payMoney;
        console.log(type);
        console.log(tollNum);

        wx.login({
            success: res => {
                wx.request({
                    url: that.data.url + '/api/Wxpay/GetOpenId?code=' + res.code + '',
                    method: "get",
                    header: {
                        'Authorization': 'Bearer ' + that.data.token
                    },
                    success: function (res) {
                        var openId = res.data;
                        var themeid = that.data.themeid;
                        var url = that.data.url + '/api/Wxpay/TradeCreateForWxOpen';
                        var data = {
                            payType: type,
                            circleId: that.data.circleId,
                            payMethod: 0,
                            payMoney: tollNum,
                            openId: openId,
                            isFollowPay:true
                        };
                        console.log(data)
                        var header = {
                            'Authorization': 'Bearer ' + that.data.token
                        };
                        request.POST({
                            url: url,
                            data: data,
                            header: header,
                            success: function (res) {
                                console.log(res)
                                if (res.statusCode == 200) {
                                    wx.requestPayment({
                                        'timeStamp': res.data.timestamp,
                                        'nonceStr': res.data.noncestr,
                                        'package': res.data.package,
                                        'signType': 'MD5',
                                        'paySign': res.data.sign,
                                        'success': function (res) {
                                            if (res.errMsg == 'requestPayment:ok') {
                                                wx.showToast({
                                                    title: '续订成功',
                                                    icon: 'none',
                                                    success: function () {
                                                        setTimeout(function(){
                                                            wx.navigateTo({
                                                                url: '/pages/news/message/message?circleId=' + that.data.circleId + '&name='+that.data.name+''
                                                            })
                                                        },2000)
                                                    }
                                                })
                                            }
                                        },
                                        'fail': function (res) {
                                            wx.showToast({
                                                title: '取消续订',
                                                icon: 'none',
                                                duration: 2000
                                            })
                                            that.setData({
                                                catchtouchmove: false,
                                                tollList: [],
                                                chooseSize: false
                                            })
                                        }
                                    })
                                } else {
                                    wx.showModal({
                                        content: '发起支付异常',
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
                    }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        var that=this;
        that.setData({
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url'),
            circleId: options.id,
        })
        that.getThemeList();
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