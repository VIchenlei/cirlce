// pages/cirrule/pay/payinfo/payinfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        jewelimg: "/images/jewel.png",
        token: '',
        url: '',
        disabled: false,
        checked0: true,
        checked1: true,
        checked2: true,
        checked3: true,
        checked4: true,
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
            if (this.data.value0 == '') {
                wx.showModal({
                    content: '金额不能为空',
                    confirmColor: "#077bfb",
                    showCancel: false
                })
            } else {
                isJump = true;
            }
        } else if (this.data.checked1 == true) {
            if (this.data.value1 == '') {
                wx.showModal({
                    content: '金额不能为空',
                    confirmColor: "#077bfb",
                    showCancel: false
                })
            } else {
                isJump = true;
            }
        } else if (this.data.checked2 == true) {
            if (this.data.value2 == '') {
                wx.showModal({
                    content: '金额不能为空',
                    confirmColor: "#077bfb",
                    showCancel: false
                })
            } else {
                isJump = true;
            }
        } else if (this.data.checked3 == true) {
            if (this.data.value3 == '') {
                wx.showModal({
                    content: '金额不能为空',
                    confirmColor: "#077bfb",
                    showCancel: false
                })
            } else {
                isJump = true;
            }
        } else if (this.data.checked4 == true) {
            if (this.data.value4 == '') {
                wx.showModal({
                    content: '金额不能为空',
                    confirmColor: "#077bfb",
                    showCancel: false
                })
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
            wx.navigateTo({
                url: '/pages/selcir/cirrule/payinfo/perfectinfo/perfectinfo?setMonthPay=' + setMonthPay + '&monthPay=' + monthPay + '&setQuarterlyPay=' + setQuarterlyPay + '&quarterlyPay=' + quarterlyPay + '&setHalfYearPay=' + setHalfYearPay + '&halfYearPay=' + halfYearPay + '&setYearPay=' + setYearPay + '&yearPay=' + yearPay + '&setForeverPay=' + setForeverPay + '&foreverPay=' + foreverPay + '&pay=' + true + ''
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