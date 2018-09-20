// pages/cirtitle/setcir/masterSA/ModifyPS/ModifyPS.js
const request = require("../../../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        radioItems: [{
                name: '所有人',
                value: '3'
            },
            {
                name: '仅圈主',
                value: '1'
            },
            {
                name: '圈主和管理员',
                value: '2'
            }
        ],
        PayRadioItems: [{
                name: '所有人',
                value: '3'
            },
            {
                name: '仅圈主',
                value: '1'
            },
            {
                name: '圈主和管理员',
                value: '2'
            }
        ],
        token: '',
        url: '',
        userId: '',
        circleId: '',
        publishTheme: '',
        publishPayTheme: '',
        publishPayThemePerson: '',
        publishThemePerson: ''

    },
    editTheme: function (publishTheme, publishPayTheme) {
        var that = this;
        var url = that.data.url + '/api/services/app/circle/EditCirclePublishThemePermissions';
        var data = {
            circleId: that.data.circleId,
            publishThemePerson: publishTheme,
            publishPayThemePerson: publishPayTheme
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
                if (res.data.success == true) {} else {
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
    radioChange: function (e) {
        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }
        this.setData({
            radioItems: radioItems,
            publishTheme: e.detail.value
        });

        if (e.detail.value == 1) {
            var payRadioItems = this.data.PayRadioItems;
            for (var i = 0, len = payRadioItems.length; i < len; ++i) {
                payRadioItems[i].checked = payRadioItems[i].value == e.detail.value;
            }
            this.setData({
                PayRadioItems: payRadioItems,
                publishPayTheme: e.detail.value
            });

        }
        if (e.detail.value == 2) {
            var payRadioItems = this.data.PayRadioItems;
            for (var i = 0, len = payRadioItems.length; i < len; ++i) {
                payRadioItems[i].checked = payRadioItems[i].value == e.detail.value;
            }
            this.setData({
                PayRadioItems: payRadioItems,
                publishPayTheme: e.detail.value
            });
        }
        var publishTheme = e.detail.value;
        var publishPayTheme = this.data.publishPayTheme;
        this.editTheme(publishTheme, publishPayTheme);
    },
    PayRadioChange: function (e) {
        console.log('PayRadio发生change事件，携带value值为：', e.detail.value);

        var payRadioItems = this.data.PayRadioItems;
        for (var i = 0, len = payRadioItems.length; i < len; ++i) {
            payRadioItems[i].checked = payRadioItems[i].value == e.detail.value;
        }
        this.setData({
            PayRadioItems: payRadioItems,
            publishPayTheme: e.detail.value
        });
        var publishTheme = this.data.publishTheme;
        var publishPayTheme = e.detail.value;
        this.editTheme(publishTheme, publishPayTheme);
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
            circleId: options.circleId,
            publishPayThemePerson: options.publishPayThemePerson,
            publishThemePerson: options.publishThemePerson,
            publishTheme: options.publishThemePerson,
            publishPayTheme: options.publishPayThemePerson,
        })
        for (var i = 0; i < that.data.radioItems.length; i++) {
            if (that.data.radioItems[i].value == options.publishThemePerson) {
                that.data.radioItems[i].checked = true;
            }
        }
        for (var i = 0; i < that.data.PayRadioItems.length; i++) {
            if (that.data.PayRadioItems[i].value == options.publishPayThemePerson) {
                that.data.PayRadioItems[i].checked = true;
            }
            that.data.PayRadioItems[i].diabled = false;
        }
        that.setData({
            radioItems: that.data.radioItems,
            PayRadioItems: that.data.PayRadioItems
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
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.refresh();
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