const request = require("../../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        uploadimgfile: [],//上传图片路径
        uploadimgarr: [],
        viewImgArr: [],
        token: '',
        url: '',
        num: 0,//文字初始个数
        txtVlaue: '',
        themeId:'',
        select:''
    },
    //获取文本框value
    textInput: function (e) {
        var that = this;
        var txtVlaue = e.detail.value;
        that.setData({
            num: txtVlaue.length,
            txtVlaue: txtVlaue.length
        })
    },
    //提交意见反馈
    submit: function () {
        var that = this;
        var txtVlaue = that.data.txtVlaue;
        var data;
        data={
            themeId: that.data.themeId,
            violationType: that.data.select,
            describe: txtVlaue
        }
        var url = that.data.url + '/api/services/app/ThemeAbout/ReportAsync';
        var header = {
            'Authorization': 'Bearer ' + that.data.token
        };
        if (txtVlaue) {
            request.POST({
                url: url,
                data: data,
                header: header,
                success: function (res) {
                    console.log(res);
                    if (res.data.success == true) {
                        wx.showToast({
                            title: '举报成功',
                            icon: 'none',
                            duration: 2000,
                            success: function () {
                                wx.navigateBack({
                                    delta: 2
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
                complete: function () { }
            })
        } else {
            wx.showToast({
                title: '描述内容不能为空',
                icon: 'none',
                duration: 2000
            })
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url'),
            themeId:options.themeid,
            select:options.select
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