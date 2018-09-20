const uploadImage = require('../../../../utils/UploadAliyun.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        setcover: "/images/setcover.png",
        switchcheck: "",
        disabled: true,
        plain: false,
        loading: false,
        coverimg: "",
        isset: true,
        iscover: false,
        uploadimgfile: "",
        joinAudit: "", //是否需要审核
        namevalue: "", //名称
        introvalue: "", //简介
        joinMode: 0,
        token: "",
        url: "",
        circleid: "",
        intro: ""
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
                        });
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
        if (that.data.editInfo == true) {
            // console.log('修改')
            wx.request({
                url: that.data.url + "/api/services/app/circle/EditCircleInfo",
                method: "post",
                header: {
                    'Authorization': 'Bearer ' + that.data.token,
                    "Content-Type": "application/json"
                },
                data: {
                    circleId: circleid,
                    name: name,
                    intro: intro,
                    coverPicture: coverPicture,
                    joinAudit: joinAudit
                },
                success: function (res) {
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


                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            isset: false,
            iscover: true,
            coverimg: options.coverimg,
            uploadimgfile: options.coverimg.replace('https://media.bjser.com', ''),
            namevalue: options.name,
            introvalue: options.intro,
            switchcheck: options.joinAudit,
            editInfo: options.editInfo,
            circleid: options.circleid,
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url'),
        })
        if (this.data.switchcheck == "true") {
            this.setData({
                joinAudit: true
            })
        } else if (this.data.switchcheck == "false") {
            this.setData({
                joinAudit: false
            })
        }
        if (options.name != "" && options.coverimg != "" && options.intro != "") {
            this.setData({
                disabled: false
            })
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
            name: this.data.namevalue,
            intro: this.data.introvalue,
            coverimg: this.data.coverimg,
            joinAudit: this.data.joinAudit
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

})