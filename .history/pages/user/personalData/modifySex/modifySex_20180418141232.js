// pages/user/personalData/personalData/modifySex/modifySex.js
const request = require("../../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        radioItems: [{
                name: '男',
                value: '1'
            },
            {
                name: '女',
                value: '2'
            }
        ],
        value: '',
        disabled: ''
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
            radioItems: radioItems,
            disabled: false,
            value: e.detail.value
        });
    },
    //发送修改性别到后台
    modSexTap: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/appUser/UpdateGender?gender=' + that.data.value + '';
        var data = {};
        var header = {
            'Authorization': 'Bearer ' + that.data.token
        };
        request.PUT({
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
        if (options.gender > 0) {
            var radioItems = this.data.radioItems;
            for (var i = 0, len = radioItems.length; i < len; ++i) {
                if (radioItems[i].value == options.gender) {
                    radioItems[i].checked = radioItems[i].value;
                    this.setData({
                        radioItems: radioItems,
                        disabled: false,
                        value: options.gender
                    });
                }
            }
        } else {
            this.setData({
                disabled: true
            })
        }
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
            gender: this.data.value
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