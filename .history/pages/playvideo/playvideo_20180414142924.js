// pages/playvideo/playvideo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videosrc: "",
        id: "",
        url: wx.getStorageSync('url'),
    },
    //暂停播放，退出全屏
    changevideo: function (e) {
        if (e.detail.fullScreen == false) {
            this.videoContext.pause();

        }
    },
    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function (options) {
        console.log(options)
        this.setData({
            videosrc: options.videosrc,
            id: options.id
        });
        this.videoContext = wx.createVideoContext('' + this.data.id + '');

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