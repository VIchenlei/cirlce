const request = require("../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: '',
        url: '',
        noticeList: '',
        emptytxt: "空空如也",
        emptyimg: "/images/empty.png",
    },
    getNoticeList: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/notice/GetNoticeList';
        var data = {};
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
                        noticeList: res.data.result.noticeList
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
    //根据type值跳转消息内容页面
    jumpRead: function (e) {
        var type = e.currentTarget.dataset.type;
        var name = e.currentTarget.dataset.name;
        var circleId = e.currentTarget.dataset.circleid;
        switch (type) {
            case 1:
                //跳转到赞列表页
                wx.navigateTo({
                    url: '/pages/news/praise/praise?&circleId=' + circleId +''
                })
                break;
            case 2:
                //跳转到评论列表页
                wx.navigateTo({
                    url: '/pages/news/comment/comment'
                })
                break;
            case 3:
                //跳转收支助手页面
                wx.navigateTo({
                    url: '/pages/news/moneyFlow/moneyFlow'
                })
                break;
            case 4:
                //跳转到代办小助手列表页
                wx.navigateTo({
                    url: '/pages/news/helper/helper'
                })
                break;
            case 5:
                //跳转到圈子消息列表页
                wx.navigateTo({
                    url: '/pages/news/message/message?name=' + name + '&circleId='+circleId+''
                })
                break;
            case 6:
                // 提示聊天去APP
                wx.showModal({
                    title: '请在APP内进行聊天',
                    content: '如果本机未安装APP,可以前往苹果App Store或安卓应用商店，搜索并安装“不叫事圈儿”，也可以复制链接在浏览器打开，快捷安装应用',
                    cancelText: '知道了',
                    confirmColor: "#077bfb",
                    confirmText: '复制链接',
                    cancelColor: "#077bfb",
                    success: function (res) {
                        if (res.confirm) {
                            wx.setClipboardData({
                                data: 'https://quanzi.bjser.com/download/index.html',
                                success: function (res) {
                                    wx.showToast({
                                        title: '复制成功',
                                        icon: 'none'
                                    })
                                }
                            })
                        } else if (res.cancel) {

                        }
                    }
                })
                break;
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
        this.getNoticeList();
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
        this.getNoticeList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
})