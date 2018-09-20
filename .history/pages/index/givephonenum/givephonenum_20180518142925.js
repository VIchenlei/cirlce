// pages/givephonenum/givephonenum.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        disabled: false,
        plain: false,
        loading: false,
        phoneValue: "",
        showModalStatus: false,
        focus: false,
        code: "",
        encryptedData: "",
        iv: "",
        rawData: "",
        signature: "",
        token:'',
        url:'',
        src: "",
        getmsgdisabled: false,
        imgcodevalue: "",
        currentTime: 60,
        time: '获取验证码', //倒计时 
        phoneplaceholder: "请输入常用手机号",
        numplaceholder: "请输入短信验证码",
        value: "",
        isphone: wx.getStorageSync('isphone'),
        id:'',
        inviteUserId:'',
        circleId:'',
        isAgree:true
    },

    //获取手机号码的value
    phonenumbtn: function (e) {
        this.setData({
            phoneValue: e.detail.value
        })
    },
    //点击获取验证码弹出图形验证码
    getimgcodebtn: function () {
        var that = this;
        // 正则匹配是否为正确的手机号码格式
        var re = /^1\d{10}$/;
        if (re.test(this.data.phoneValue)) {
            var value = that.data.imgcodevalue;
            var num = that.data.phoneValue;
            wx.request({
                url: that.data.url + "/api/services/app/msgCode/GetMsgCode",
                method: "post",
                data: {
                    imageCode: value,
                    phoneNumber: num,
                    msgType: 4
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: function (res) {
                    console.log(res)
                    if (res.data.success == true) {
                        var currentTime = that.data.currentTime
                        var interval = setInterval(function () {
                            currentTime--;
                            that.setData({
                                time: currentTime + '秒后重新获取',
                                getmsgdisabled: true,
                                showModalStatus: false,
                                imgcodevalue: ""
                            })
                            if (currentTime <= 0) {
                                clearInterval(interval)
                                that.setData({
                                    time: '获取验证码',
                                    currentTime: 60,
                                    getmsgdisabled: false
                                })
                            }
                        }, 1000)
                    } else {
                        if (res.data.error.code == 420) {
                            that.setData({
                                showModalStatus: true,
                                src: "https://quaner.bjser.com/api/ImageCode/GetImageCode?phoneNumber=" + that.data.phoneValue + ""
                            })
                        } else {
                            wx.showModal({
                                content: res.data.error.message,
                                confirmColor: "#077bfb",
                                showCancel: false
                            })
                        }
                    }
                },
                fail: function (err) {
                    console.log(err)
                }
            })
        } else {
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration: 2000
            })
        }

    },
    //点击更换图形验证码
    imgbtn: function () {
        var num = Math.random();
        this.setData({
            src: "https://quaner.bjser.com/api/ImageCode/GetImageCode?phoneNumber=" + this.data.phoneValue + "&num=" + num + "",
            imgcodevalue: ""
        })
        console.log(this.data.src)
    },
    //点击取消关闭弹出窗
    cancelbtn: function () {
        this.setData({
            showModalStatus: false,
            imgcodevalue: ""
        })
    },
    //获取图形验证码的value
    imgcodevaluebtn: function (e) {
        this.setData({
            imgcodevalue: e.detail.value
        })
    },
    //点击确定请求短信
    surebtn: function () {
        var that = this;
        var value = that.data.imgcodevalue;
        var num = that.data.phoneValue;
        if (value != "") {
            wx.request({
                url: that.data.url + "/api/services/app/msgCode/GetMsgCode",
                method: "post",
                data: {
                    imageCode: value,
                    phoneNumber: num,
                    msgType: 4
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: function (res) {
                    console.log(res)
                    if (res.data.success == true) {
                        var currentTime = that.data.currentTime
                        var interval = setInterval(function () {
                            currentTime--;
                            that.setData({
                                time: currentTime + '秒',
                                getmsgdisabled: true,
                                showModalStatus: false,
                                imgcodevalue: ""
                            })
                            if (currentTime <= 0) {
                                clearInterval(interval)
                                that.setData({
                                    time: '获取验证码',
                                    currentTime: 60,
                                    getmsgdisabled: false
                                })
                            }
                        }, 1000)
                    } else {

                    }
                },
                fail: function (err) {
                    console.log(err)
                }
            })
        } else {
            wx.showToast({
                title: '请输入正确的验证码',
                icon: 'none',
                duration: 2000
            })
        }
    },
    //获取短信验证码的value
    btnvalue: function (e) {
        console.log(e)
        this.setData({
            value: e.detail.value
        })
    },
    //点击绑定手机号码获取token
    bindphoneTap: function () {
        var that = this;
        if (that.data.isAgree == true) {
            if (that.data.value == '' || that.data.phoneValue == ''){
                wx.showToast({
                    title: '手机号码或验证码错误',
                    icon: 'none',
                    duration: 2000
                })
            }else{
                wx.request({
                    url: that.data.url + '/api/TokenAuth/CreateWxOpenTokenAsync',
                    method: "post",
                    data: {
                        code: that.data.code,
                        encryptedData: that.data.encryptedData,
                        iv: that.data.iv,
                        rawData: that.data.rawData,
                        signature: that.data.signature,
                        phoneNumber: that.data.phoneValue,
                        captcha: that.data.value
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                        console.log(res)
                        if (res.data.success == true) {
                            that.setData({
                                phoneValue: "",
                                value: ""
                            })
                            wx.showToast({
                                title: '成功',
                                icon: 'none'
                            })
                            if (that.data.id == 1011) {
                                var _token;
                                var _userid;
                                var _head;
                                var url = "https://quaner.bjser.com";
                                wx.setStorageSync('url', url);
                                _token = res.data.result.token;
                                _userid = res.data.result.userId;
                                wx.setStorageSync('_token', _token);
                                wx.setStorageSync('_userid', _userid);
                                var userid = that.data.inviteUserId;
                                var cirid = that.data.circleId;
                                wx.redirectTo({
                                    url: '/pages/cirsharelist/cirsharelist?userid=' + userid + '&cirid=' + cirid + ''
                                })
                            } else {
                                wx.switchTab({
                                    url: '/pages/index/index',
                                    success: function () {
                                        var page = getCurrentPages().shift();
                                        page.onLoad();
                                        app.onLaunch();
                                    }
                                })
                            }

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
                title: '请阅读并同意用户协议',
                icon: 'none',
                duration: 2000
            })
        }
        

    },
    powerDrawer: function (e) {
        var currentStatu = e.currentTarget.dataset.statu;
        this.util(currentStatu)
    },
    util: function (currentStatu) {
        /* 动画部分 */
        // 第1步：创建动画实例 
        var animation = wx.createAnimation({
            duration: 200, //动画时长 
            timingFunction: "linear", //线性 
            delay: 0 //0则不延迟 
        });

        // 第2步：这个动画实例赋给当前的动画实例 
        this.animation = animation;

        // 第3步：执行第一组动画 
        animation.opacity(0).rotateX(-100).step();

        // 第4步：导出动画对象赋给数据对象储存 
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画 
        setTimeout(function () {
            // 执行第二组动画 
            animation.opacity(1).rotateX(0).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
            this.setData({
                animationData: animation
            })

            //关闭 
            if (currentStatu == "close") {
                this.setData({
                    showModalStatus: false
                });
            }
        }.bind(this), 200)

        // 显示 
        if (currentStatu == "open") {
            this.setData({
                showModalStatus: true
            });
        }
    },
    //勾选用户协议否则不能绑定手机号码
    bindAgreeChange: function (e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        var that = this;
        if(options.id!=''){
            that.setData({
                url:'https://quaner.bjser.com',
                id: options.id,
                inviteUserId: options.inviteUserId,
                circleId: options.circleId
            })
        }else{
            that.setData({
                url: wx.getStorageSync('url'),
                id: options.id,
                inviteUserId: options.inviteUserId,
                circleId: options.circleId
            })
        }
        var _code;
        wx.login({
            success: res => {
                _code = res.code
                wx.getSetting({
                    withCredentials: true,
                    success: res => {
                        wx.getUserInfo({
                            success: res1 => {
                                console.log(res1)
                                that.setData({
                                    code: _code,
                                    encryptedData: res1.encryptedData,
                                    iv: res1.iv,
                                    rawData: res1.rawData,
                                    signature: res1.signature
                                })
                            }
                        })

                    }
                })
            }
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