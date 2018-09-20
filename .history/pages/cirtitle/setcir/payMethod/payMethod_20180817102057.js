// pages/cirtitle/setcir/payMethod/payMethod.js
const request = require("../../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        circleId: '',
        token: '',
        url: '',
        disabled: false,
        checked0: false,
        checked1: false,
        checked2: false,
        checked3: false,
        checked4: false,
        value0: '',
        value1: '',
        value2: '',
        value3: '',
        value4: '',
    },
    switch1Change: function (e) {
        var val = e.currentTarget.dataset.val;
        if (val == 0) {
            this.setData({
                checked0: e.detail.value
            })
            if (this.data.checked0 == false && this.data.checked1 == false && this.data.checked2 == false && this.data.checked3 == false && this.data.checked4 == false) {
                this.setData({
                    checked0: !e.detail.value
                })
                wx.showModal({
                    content: '请至少选择一个',
                    confirmColor: "#077bfb",
                    showCancel: false
                })
            } else {
                this.setData({
                    disabled: false,
                    value0: ''
                })
            }
        }
        if (val == 1) {
            this.setData({
                checked1: e.detail.value
            })
            if (this.data.checked0 == false && this.data.checked1 == false && this.data.checked2 == false && this.data.checked3 == false && this.data.checked4 == false) {
                this.setData({
                    checked1: !e.detail.value
                })
                wx.showModal({
                    content: '请至少选择一个',
                    confirmColor: "#077bfb",
                    showCancel: false
                })
            } else {
                this.setData({
                    disabled: false,
                    value1: ''
                })
            }
        }
        if (val == 2) {
            this.setData({
                checked2: e.detail.value
            })
            if (this.data.checked0 == false && this.data.checked1 == false && this.data.checked2 == false && this.data.checked3 == false && this.data.checked4 == false) {
                this.setData({
                    checked2: !e.detail.value
                })
                wx.showModal({
                    content: '请至少选择一个',
                    confirmColor: "#077bfb",
                    showCancel: false
                })
            } else {
                this.setData({
                    disabled: false,
                    value2: ''
                })
            }
        }
        if (val == 3) {
            this.setData({
                checked3: e.detail.value
            })
            if (this.data.checked0 == false && this.data.checked1 == false && this.data.checked2 == false && this.data.checked3 == false && this.data.checked4 == false) {
                this.setData({
                    checked3: !e.detail.value
                })
                wx.showModal({
                    content: '请至少选择一个',
                    confirmColor: "#077bfb",
                    showCancel: false
                })
            } else {
                this.setData({
                    disabled: false,
                    value3: ''
                })
            }
        }
        if (val == 4) {
            this.setData({
                checked4: e.detail.value
            })
            if (this.data.checked0 == false && this.data.checked1 == false && this.data.checked2 == false && this.data.checked3 == false && this.data.checked4 == false) {
                this.setData({
                    checked4: !e.detail.value
                })
                wx.showModal({
                    content: '请至少选择一个',
                    confirmColor: "#077bfb",
                    showCancel: false
                })
            } else {
                this.setData({
                    disabled: false,
                    value4: ''
                })
            }
        }
    },
    inputVlaue: function (e) {
        var val = e.currentTarget.dataset.val;
        if (val == 0) {
            this.setData({
                value0: e.detail.value
            })
        }
        if (val == 1) {
            this.setData({
                value1: e.detail.value
            })
        }
        if (val == 2) {
            this.setData({
                value2: e.detail.value
            })
        }
        if (val == 3) {
            this.setData({
                value3: e.detail.value
            })
        }
        if (val == 4) {
            this.setData({
                value4: e.detail.value
            })
        }
    },
    payinfoTap: function () {
        var isJump = false;
        if (this.data.checked0 == true) {
            if (this.data.value0 == '' || this.data.value0 < 1 || this.data.value0 > 1000) {
                wx.showModal({
                    content: '「按月订阅」金额超出限制范围',
                    showCancel: false
                })
                isJump = false;
                return;
            } else {
                isJump = true;
            }
        }
        if (this.data.checked1 == true) {
            if (this.data.value1 == '' || this.data.value1 < 1 || this.data.value1 > 1500) {
                wx.showModal({
                    content: '「按季订阅」金额超出限制范围',
                    showCancel: false
                })
                isJump = false;
                return;
            } else {
                isJump = true;
            }
        }
        if (this.data.checked2 == true) {
            if (this.data.value2 == '' || this.data.value2 < 1 || this.data.value2 > 2000) {
                wx.showModal({
                    content: '「按半年订阅」金额超出限制范围',
                    showCancel: false
                })
                isJump = false;
                return;
            } else {
                isJump = true;
            }
        }
        if (this.data.checked3 == true) {
            if (this.data.value3 == '' || this.data.value3 < 1 || this.data.value3 > 2500) {
                wx.showModal({
                    content: '「按年订阅」金额超出限制范围',
                    showCancel: false
                })
                isJump = false;
                return;
            } else {
                isJump = true;
            }
        }
        if (this.data.checked4 == true) {
            if (this.data.value4 == '' || this.data.value4 < 1 || this.data.value4 > 3000) {
                wx.showModal({
                    content: '「按永久订阅」金额超出限制范围',
                    showCancel: false
                })
                isJump = false;
                return;
            } else {
                isJump = true;
            }
        }
        if (isJump == true) {
            var setMonthPay = this.data.checked0;
            var monthPay = this.data.value0;
            var setQuarterlyPay = this.data.checked1;
            var quarterlyPay = this.data.value1;
            var setHalfYearPay = this.data.checked2;
            var halfYearPay = this.data.value2;
            var setYearPay = this.data.checked3;
            var yearPay = this.data.value3;
            var setForeverPay = this.data.checked4;
            var foreverPay = this.data.value4;
            var that = this;
            var url = that.data.url + '/api/services/app/circle/CirclePaySet';
            var data = {
                circleId: that.data.circleId,
                setMonthPay: setMonthPay,
                monthPay: monthPay == "" ? 0 : monthPay,
                setQuarterlyPay: setQuarterlyPay,
                quarterlyPay: quarterlyPay == "" ? 0 : quarterlyPay,
                setHalfYearPay: setHalfYearPay,
                halfYearPay: halfYearPay == "" ? 0 : halfYearPay,
                setYearPay: setYearPay,
                yearPay: yearPay == "" ? 0 : yearPay,
                setForeverPay: setForeverPay,
                foreverPay: foreverPay == "" ? 0 : foreverPay
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
                        wx.navigateBack({
                            delta: 1
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
        }
    },
    //获取圈子付费信息
    getPayCirclePaySet: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/circle/GetPayCirclePaySet';
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
                        checked0: res.data.result.setMonthPay,
                        checked1: res.data.result.setQuarterlyPay,
                        checked2: res.data.result.setHalfYearPay,
                        checked3: res.data.result.setYearPay,
                        checked4: res.data.result.setForeverPay,
                        value0: res.data.result.monthPay,
                        value1: res.data.result.quarterlyPay,
                        value2: res.data.result.halfYearPay,
                        value3: res.data.result.yearPay,
                        value4: res.data.result.foreverPay
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url'),
            circleId: options.circleId
        })
        this.getPayCirclePaySet();
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
            id: this.data.circleId
        })
        prevPage.getSetcir();
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