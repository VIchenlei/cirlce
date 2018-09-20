Page({

    /**
     * 页面的初始数据
     */
    data: {
        jewelimg: "/images/jewel.png",
        freeimg: "/images/free.png",
        jeweltxt: "付费圈子",
        freetxt: "免费圈子"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    //创建免费圈子
    cirrulefreeTap: function () {
        wx.navigateTo({
            url: "/pages/selcir/cirrule/cirrule?pay=" + false + ""
        })
    },
    //创建付费圈子
    cirrulepayTap: function () {
        wx.navigateTo({
            url: "/pages/selcir/cirrule/cirrule?pay=" + true + ""
        })
    },
    onLoad: function (options) {

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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})