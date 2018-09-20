// pages/user/personalData/personalData.js
const uploadImage = require('../../../utils/UploadAliyun.js');
const request = require("../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        head: '',
        token: '',
        url: '',
        nickName: '',
        gender: '',
        sign: '',
        phone: ''
    },
    //修改头像
    reviseHeadImg: function (e) {
        var that = this;
        console.log(e)
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var filePath = res.tempFilePaths[0];
                console.log(filePath)
                var avatarUrl = 'https://media.bjser.com' + '/User/Images/' + filePath.replace('wxfile://', '');
                wx.request({
                    url: that.data.url + '/api/services/app/appUser/UpdateAvatarUrl?avatarUrl=' + avatarUrl + '',
                    method: 'put',
                    header: {
                        'Authorization': 'Bearer ' + that.data.token
                    },
                    success: function (res) {
                        console.log(res)
                        if (res.data.success == true) {
                            uploadImage(filePath, "User/Images/",
                                function (res) {
                                    console.log("上传成功")
                                    //todo 做任何你想做的事
                                },
                                function (res) {
                                    console.log("上传失败")
                                    //todo 做任何你想做的事
                                })
                            that.setData({
                                head: filePath
                            })
                        } else {
                            wx.showModal({
                                content: res.data.error.message,
                                confirmColor: "#077bfb",
                                showCancel: false
                            })
                        }
                    },
                })
            }
        })
    },
    //跳转修改性别界面
    modifySexTap: function () {
        var gender = this.data.gender;
        wx.navigateTo({
            url: '/pages/user/personalData/modifySex/modifySex?gender=' + gender + ''
        })
    },
    //跳转个人签名页面
    modifySignTap: function () {
        var sign = this.data.sign==null?'':this.data.sign;
        console.log(sign)
        wx.navigateTo({
            url: '/pages/user/personalData/modifySign/modifySign?sign=' + sign + ''
        })
    },
    //跳转更换手机页面
    changePhone: function () {
        var phone = this.data.phone;
        wx.navigateTo({
            url: '/pages/user/personalData/changePhoneNum/changePhoneNum?phone=' + phone + ''
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url'),
            head: options.head,
            nickName: options.nickName,
            gender: options.gender,
            sign: options.sign,
            phone: options.phone
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})