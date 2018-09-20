const uploadImage = require('../../../../../utils/UploadAliyun.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        setcover: "/images/setcover.png",
        disabled: true,
        plain: false,
        loading: false,
        coverimg: "",
        isset: true,
        iscover: false,
        uploadimgfile: "",
        joinAudit: false, //是否需要审核
        namevalue: "", //名称
        introvalue: "", //简介
        joinMode: 0,
        pay: '',
        token: '',
        url: '',
        circleid: "",
        setMonthPay: '',
        monthPay: '',
        setQuarterlyPay: '',
        quarterlyPay: '',
        setHalfYearPay: '',
        halfYearPay: '',
        setYearPay: '',
        yearPay: '',
        setForeverPay: '',
        foreverPay: '',
        clicktag:0// 防止频繁点击
    },
    //点击设置封面
    setimgurlTap: function () {
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var filePath = res.tempFilePaths[0];
                console.log(filePath.replace('http://tmp/', ''));
                wx.showLoading({
                    title: '封面上传中',
                });
                uploadImage(filePath, "User/Images/",
                    function (res) {
                        that.setData({
                            uploadimgfile: "/User/Images/" + filePath.replace('wxfile://', ''),
                            isset: false,
                            iscover: true
                        })
                        wx.hideLoading();
                        if (that.data.namevalue != "" && that.data.introvalue != "" && that.data.coverimg != "") {
                            that.setData({
                                disabled: false
                            })
                        } else {
                            that.setData({
                                disabled: true
                            })
                        }
                        console.log("上传成功")
                        //todo 做任何你想做的事
                    },
                    function (res) {
                        console.log("上传失败")
                        //todo 做任何你想做的事
                    })
                that.setData({
                    coverimg: filePath
                })
            }
        })
    },
    //输入名称获取输入框内容
    namebtnTap: function (e) {
        this.setData({
            namevalue: e.detail.value
        })
        if (this.data.namevalue != "" && this.data.introvalue != "" && this.data.coverimg != "") {
            this.setData({
                disabled: false
            })
        } else {
            this.setData({
                disabled: true
            })
        }
    },
    introbtnTap: function (e) {
        this.setData({
            introvalue: e.detail.value
        })
        if (this.data.namevalue != "" && this.data.introvalue != "" && this.data.coverimg != "") {
            this.setData({
                disabled: false
            })
        } else {
            this.setData({
                disabled: true
            })
        }
    },
    switchChange: function (e) {
        console.log(e)
        this.setData({
            joinAudit: e.detail.value
        })
    },
    submitTap: function () {
        var that = this;
        var name = that.data.namevalue;
        var intro = that.data.introvalue;
        var coverPicture = that.data.uploadimgfile;
        var joinAudit = that.data.joinAudit;
        var joinMode = that.data.joinMode;
        var circleid = that.data.circleid;
        var setMonthPay = that.data.setMonthPay;
        var monthPay = that.data.monthPay;
        var setQuarterlyPay = that.data.setQuarterlyPay;
        var quarterlyPay = that.data.quarterlyPay;
        var setHalfYearPay = that.data.setHalfYearPay;
        var halfYearPay = that.data.halfYearPay;
        var setYearPay = that.data.setYearPay;
        var yearPay = that.data.yearPay;
        var setForeverPay = that.data.setForeverPay;
        var foreverPay = that.data.foreverPay;
        var clicktag = that.data.clicktag;
        if (clicktag == 0) {
            that.setData({
                clicktag:1
            })
            if (that.data.pay == "false") {
                //创建免费圈子
                wx.request({
                    url: that.data.url + "/api/services/app/circle/CreateFreeCircle",
                    method: "post",
                    header: {
                        'Authorization': 'Bearer ' + that.data.token,
                        "Content-Type": "application/json"
                    },
                    data: {
                        name: name,
                        intro: intro,
                        coverPicture: coverPicture,
                        joinAudit: joinAudit,
                        joinMode: 0
                    },
                    success: function (res) {
                        if (res.data.success == true) {
                            wx.showToast({
                                title: '创建成功',
                                icon: 'none',
                                success: function () {
                                    wx.switchTab({
                                        url: '/pages/index/index',
                                        success: function (e) {
                                            var page = getCurrentPages().pop();
                                            if (page == undefined || page == null) return;
                                            page.onLoad();
                                            setTimeout(function () {
                                                that.setData({
                                                    clicktag: 0
                                                })
                                            }, 5000);
                                        }
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
                    }
                })
            } else {
                var data = {
                    name: name,
                    intro: intro,
                    coverPicture: coverPicture,
                    joinAudit: joinAudit,
                    joinMode: 1,
                };
                if (setMonthPay == 'true') {
                    data.setMonthPay = setMonthPay;
                    data.monthPay = monthPay;
                }
                if (setQuarterlyPay == 'true') {
                    data.setQuarterlyPay = setQuarterlyPay;
                    data.quarterlyPay = quarterlyPay;
                }
                if (setHalfYearPay == 'true') {
                    data.setHalfYearPay = setHalfYearPay;
                    data.halfYearPay = halfYearPay;
                }
                if (setYearPay == 'true') {
                    data.setYearPay = setYearPay;
                    data.yearPay = yearPay;
                }
                if (setForeverPay == 'true') {
                    data.setForeverPay = setForeverPay;
                    data.foreverPay = foreverPay;
                }
                // 创建付费圈子
                wx.request({
                    url: that.data.url + "/api/services/app/circle/CreatePayCircle",
                    method: "post",
                    header: {
                        'Authorization': 'Bearer ' + that.data.token,
                    },
                    data: data,
                    success: function (res) {
                        console.log(res)
                        if (res.data.success == true) {
                            wx.showToast({
                                title: '发表成功',
                                icon: 'none',
                                success: function () {
                                    wx.switchTab({
                                        url: '/pages/index/index',
                                        success: function (e) {
                                            var page = getCurrentPages().pop();
                                            if (page == undefined || page == null) return;
                                            page.onLoad();
                                            setTimeout(function () {
                                                that.setData({
                                                    clicktag: 0
                                                })
                                            }, 5000);
                                            
                                        }
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
                    }
                })
            }
            
        }else{
            wx.showToast({
                title:'点击过于频繁',
                icon:'none'
            })
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url'),
            pay: options.pay,
            setMonthPay: options.setMonthPay || null,
            monthPay: options.monthPay || null,
            setQuarterlyPay: options.setQuarterlyPay || null,
            quarterlyPay: options.quarterlyPay || null,
            setHalfYearPay: options.setHalfYearPay || null,
            halfYearPay: options.halfYearPay || null,
            setYearPay: options.setYearPay || null,
            yearPay: options.yearPay || null,
            setForeverPay: options.setForeverPay || null,
            foreverPay: options.foreverPay || null
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