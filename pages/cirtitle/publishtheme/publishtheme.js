// pages/publishtheme/publishtheme.js
const uploadFile = require('../../../utils/UploadAliyun.js')
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        circleId: "", //圈子ID
        num: "", //判断创建付费或免费圈子
        isupload: true,
        token: '',
        url: '',
        isfreeviweimg: false, //判断上传图片显示上传图片
        isfreevideo: false, //判断上传视频显示上传视频
        isfreeaudio: false, //判断显示录音
        isfreetheme: false, //判断num为1显示免费发表主题
        ispaytheme: false, //判断num为2显示付费发表主题
        publishvalue: "",
        ispublishvalue: "", //判断输入框是否为空控制发送按钮的颜色
        uploadimgfile: [], //上传图片路径
        uploadimgarr: [],
        viewImgArr: [],
        upLoadVideo: [], //上传视频的详细数据,
        viewVideoUrl: "", //展示上传视频本地路径
        upLoadAudio: [], //上传音频详细数据
        upLoadAudioUrl: '', //音频本地路径
        payMoney: 1, //初始默认金额
        activeIndex: 1,
        infoValue: '',
        payThemeValue: '',
        isShowRecord: false, //是否显示录音窗口
        isShowPlay: true, //默认开始播放图片
        isShowStart: false, //播放图片
        isShowSuspend: false, //暂停图片
        isAgain: true,
        duration: '00:00',
        currentPosition: '00:00',
        timer: '',
        clicktag: 0 // 防止频繁点击
    },
    //判断输入框是否为空控制发送按钮的颜色
    inputTap: function (e) {
        if (this.data.num == 1) {
            if (e.detail.value != "") {
                this.setData({
                    ispublishvalue: "sendcolor",
                    publishvalue: e.detail.value
                })
            } else {
                this.setData({
                    ispublishvalue: ""
                })
            }
        }
    },
    //修改金额
    changeMoney: function (e) {
        this.setData({
            activeIndex: e.currentTarget.dataset.sum,
            payMoney: e.currentTarget.dataset.sum
        });

    },
    //获取输入框免费内容
    infoInput: function (e) {
        this.setData({
            infoValue: e.detail.value
        })
        if (this.data.infoValue != "" && this.data.payThemeValue != "") {
            this.setData({
                ispublishvalue: "sendcolor"
            })
        } else {
            this.setData({
                ispublishvalue: ""
            })
        }
    },
    //付费内容
    payThemeInput: function (e) {
        this.setData({
            payThemeValue: e.detail.value
        })
        if (this.data.infoValue != "" && this.data.payThemeValue != "") {
            this.setData({
                ispublishvalue: "sendcolor"
            })
        } else {
            this.setData({
                ispublishvalue: ""
            })
        }
    },
    //上传图片
    uploadimgTap: function () {
        var that = this;
        var pice = that.data.uploadimgarr;
        wx.chooseImage({
            count: 9 - pice.length, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var filePath = res.tempFilePaths;
                for (var i = 0; i < filePath.length; i++) {
                    var str = "/User/Images/" + filePath[i].replace('wxfile://', '');
                    that.data.uploadimgfile.push(str);
                    that.data.uploadimgarr.push(filePath[i]);
                    that.data.viewImgArr.push(filePath[i]);
                }
                that.setData({
                    uploadimgfile: that.data.uploadimgfile,
                    uploadimgarr: that.data.uploadimgarr,
                    isfreeviweimg: true,
                    isupload: false,
                })
                if (that.data.num == 1) {
                    if (that.data.uploadimgfile.length > 0) {
                        that.setData({
                            ispublishvalue: "sendcolor"
                        })
                    } else {
                        that.setData({
                            ispublishvalue: " "
                        })
                    }
                } else if (that.data.num == 2) {
                    if (that.data.uploadimgfile.length > 0 && that.data.infoValue != "") {
                        that.setData({
                            ispublishvalue: "sendcolor"
                        })
                    } else {
                        that.setData({
                            ispublishvalue: " "
                        })
                    }
                }
            }
        })
    },
    previewTap: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var urlarr = that.data.uploadimgarr;
        wx.previewImage({
            current: urlarr[index], // 当前显示图片的http链接
            urls: urlarr // 需要预览的图片http链接列表
        })
    },
    //取消返回上一页
    backTap: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //长按删除图片
    longimgTap: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        wx.showModal({
            content: '是否删除这张图片',
            success: function (res) {
                if (res.confirm) {
                    that.data.uploadimgarr.splice(index, 1);
                    that.data.uploadimgfile.splice(index, 1);
                    that.setData({
                        uploadimgarr: that.data.uploadimgarr,
                        uploadimgfile: that.data.uploadimgfile
                    })
                    if (that.data.uploadimgarr.length == 0) {
                        that.setData({
                            isupload: true
                        })
                    }
                }

            }
        })
    },
    //上传视频
    upLoadVideoTap: function (e) {
        var that = this
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
                console.log(res)
                that.setData({
                    upLoadVideo: [{
                        videoUrl: res.tempFilePath,
                        height: res.height,
                        width: res.width
                    }],
                    isfreevideo: true,
                    isupload: false,
                    viewVideoUrl: res.tempFilePath
                })
                if (that.data.num == 1) {
                    if (that.data.upLoadVideo.length > 0) {
                        that.setData({
                            ispublishvalue: "sendcolor"
                        })
                    } else {
                        that.setData({
                            ispublishvalue: " "
                        })
                    }
                } else if (that.data.num == 2) {
                    if (that.data.upLoadVideo.length > 0 && that.data.infoValue != "") {
                        that.setData({
                            ispublishvalue: "sendcolor"
                        })
                    } else {
                        that.setData({
                            ispublishvalue: " "
                        })
                    }
                }
            }
        })
    },
    //点击播放调转播放视频页面
    playVideoTap: function (e) {
        wx.navigateTo({
            url: '/pages/playvideo/playvideo?videosrc=' + e.currentTarget.dataset.src + ''
        });
    },
    //长按删除视频
    longVideoTap: function () {
        var that = this;
        wx.showModal({
            content: '是否删除视频',
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        upLoadVideo: [],
                        poster: ""
                    })
                    if (that.data.upLoadVideo.length == 0) {
                        that.setData({
                            isupload: true,
                            isfreevideo: false
                        })
                    }
                } else if (res.cancel) {

                }

            }
        })
    },
    upLoadImg: function (e) {
        var that = this;
        var imgarr = that.data.viewImgArr;
        if (imgarr.length == 0) {
            wx.navigateBack({
                delta: 1
            })
        } else {
            uploadFile(imgarr[0], "User/Images/",
                function (res) {
                    wx.hideLoading();

                    imgarr.shift();
                    that.setData({
                        viewImgArr: imgarr
                    })
                    that.upLoadImg();
                },
                function (res) {

                })
        }

    },
    sendTap: function () {
        var that = this;
        var clicktag = that.data.clicktag;
        if (clicktag == 0) {
            that.setData({
                clicktag:1
            })
            var id = that.data.circleId;
            var value = that.data.publishvalue;
            var info = that.data.infoValue;
            var payValue = that.data.payThemeValue;
            var payMoney = that.data.payMoney;
            var imgarr = that.data.viewImgArr;
            var imgfile = that.data.uploadimgfile;
            var audios = that.data.upLoadAudio;
            if (that.data.upLoadVideo.length > 0) {
                var videofile = [{
                    videoUrl: "/User/Videos/" + that.data.upLoadVideo[0].videoUrl.replace('wxfile://', ''),
                    width: that.data.upLoadVideo[0].width,
                    height: that.data.upLoadVideo[0].height
                }]
            } else {
                videofile = [];
            }
            console.log(videofile)
            var num = that.data.num;
            if (num == 1) {
                if (value != "" || imgfile.length > 0 || videofile.length > 0 || audios.length > 0) {
                    wx.request({
                        url: that.data.url + "/api/services/app/theme/CreateFreeTheme",
                        method: "post",
                        header: {
                            'Authorization': 'Bearer ' + that.data.token,
                            "Content-Type": "application/json"
                        },
                        data: {
                            circleId: id,
                            themeText: value,
                            images: imgfile,
                            audios: audios,
                            videos: videofile
                        },
                        success: function (res) {
                            console.log(res)
                            var type;
                            if (imgfile.length == 0 && videofile.length == 0 && audios.length == 0) {

                                type = 0;
                            }
                            if (imgfile != []) {
                                type = 1;

                            }
                            if (videofile.length > 0) {
                                type = 2;

                            }
                            if (audios.length > 0) {
                                type = 3;

                            }
                            switch (type) {
                                case 0:
                                    wx.navigateBack({
                                        delta: 1
                                    });
                                    that.setData({
                                        clicktag:0
                                    })
                                    break;
                                case 1:
                                    wx.showLoading({
                                        title: '上传中',
                                    })
                                    that.upLoadImg();
                                    that.setData({
                                        clicktag: 0
                                    })
                                    break;
                                case 2:
                                    wx.showLoading({
                                        title: '上传中',
                                    })

                                    uploadFile(that.data.upLoadVideo[0].videoUrl, "User/Videos/",
                                        function (res) {

                                            wx.hideLoading();
                                            wx.navigateBack({
                                                delta: 1
                                            });
                                            that.setData({
                                                clicktag: 0
                                            })
                                            console.log("上传成功")
                                            //todo 做任何你想做的事
                                        },
                                        function (res) {
                                            console.log("上传失败")
                                            //todo 做任何你想做的事
                                        })
                                    break;
                                case 3:
                                    wx.showLoading({
                                        title: '上传中',
                                    })
                                    uploadFile(that.data.upLoadAudioUrl, "User/Audios/",
                                        function (res) {
                                            wx.hideLoading();
                                            wx.navigateBack({
                                                delta: 1
                                            });
                                            that.setData({
                                                clicktag: 0
                                            })
                                            console.log("上传成功")
                                            //todo 做任何你想做的事
                                        },
                                        function (res) {
                                            console.log("上传失败")
                                            //todo 做任何你想做的事
                                        })
                                    break;
                            }
                        },
                    })
                } else {
                    wx.showModal({
                        confirmColor: "#077bfb",
                        content: '发布主题不能为空',
                        showCancel: false
                    })
                }
            } else if (num == 2) {
                if (info != "" || payValue != "" || imgfile.length > 0 || videofile.length > 0 || audios.length > 0) {
                    wx.request({
                        url: that.data.url + "/api/services/app/theme/CreatePayTheme",
                        method: "post",
                        header: {
                            'Authorization': 'Bearer ' + that.data.token,
                            "Content-Type": "application/json"
                        },
                        data: {
                            circleId: id,
                            themeText: payValue,
                            introduction: info,
                            payMoney: payMoney,
                            images: imgfile,
                            audios: audios,
                            videos: videofile
                        },
                        success: function (res) {
                            var type;
                            if (imgfile.length == 0 && videofile.length == 0 && audios.length == 0) {
                                type = 0;

                            }
                            if (imgfile != []) {
                                type = 1;

                            }
                            if (videofile.length > 0) {
                                type = 2;

                            }
                            if (audios.length > 0) {
                                type = 3;

                            }
                            switch (type) {
                                case 0:
                                    wx.navigateBack({
                                        delta: 1
                                    });
                                    that.setData({
                                        clicktag: 0
                                    })
                                    break;
                                case 1:
                                    wx.showLoading({
                                        title: '上传中',
                                    })
                                    that.upLoadImg();
                                    that.setData({
                                        clicktag: 0
                                    })
                                    break;
                                case 2:
                                    wx.showLoading({
                                        title: '上传中',
                                    })
                                    uploadFile(that.data.upLoadVideo[0].videoUrl, "User/Videos/",
                                        function (res) {
                                            wx.hideLoading();
                                            wx.navigateBack({
                                                delta: 1
                                            });
                                            that.setData({
                                                clicktag: 0
                                            })
                                            console.log("上传成功")
                                            //todo 做任何你想做的事
                                        },
                                        function (res) {
                                            console.log("上传失败")
                                            //todo 做任何你想做的事
                                        })
                                    break;
                                case 3:
                                    wx.showLoading({
                                        title: '上传中',
                                    })
                                    uploadFile(that.data.upLoadAudioUrl, "User/Audios/",
                                        function (res) {
                                            wx.hideLoading();
                                            wx.navigateBack({
                                                delta: 1
                                            });
                                            that.setData({
                                                clicktag: 0
                                            })
                                            console.log("上传成功")
                                            //todo 做任何你想做的事
                                        },
                                        function (res) {
                                            console.log("上传失败")
                                            //todo 做任何你想做的事
                                        })
                                    break;
                            }
                        },
                    })
                } else {
                    wx.showModal({
                        content: '发布主题不能为空',
                        confirmColor: "#077bfb",
                        showCancel: false
                    })
                }
            }
        }else{
            wx.showToast({
                title: '点击过于频繁',
                icon: 'none'
            })
        }

    },
    //点击弹出录音窗口
    upLoadVoiceTap: function (e) {
        this.setData({
            isShowRecord: true
        })
    },
    //关闭录音窗口
    hideRecordTap: function (e) {
        if (this.data.isShowRecord == true) {
            this.setData({
                isShowRecord: false,
                isShowPlay: true, //默认开始播放图片
                isShowStart: false, //播放图片
                isShowSuspend: false, //暂停图片
                isAgain: true,
                currentPosition: '00:00'
            })
        }
    },
    //点击空白处关闭录音窗口
    hideModalTap: function () {
        this.hideRecordTap();
    },
    //获取权限
    getRecord: function () {
        var that = this;
        wx.getSetting({
            success(res) {
                console.log(res.authSetting['scope.record'])
                if (res.authSetting['scope.record'] == false) {
                    console.log('走这了')
                    wx.openSetting({
                        success: (res) => {
                            if (res.authSetting['scope.record'] == true) {
                                const recorderManager = wx.getRecorderManager();
                                const options = {
                                    duration: 60000,
                                    sampleRate: 44100,
                                    numberOfChannels: 1,
                                    encodeBitRate: 192000,
                                    format: 'mp3',
                                    frameSize: 50
                                }
                                recorderManager.start(options);
                                var duration = that.data.duration;
                                duration = 0;
                                that.stotime(duration);
                                recorderManager.onStart(function (res) {
                                    let timer = setInterval(function () {
                                        duration++;
                                        that.setData({
                                            duration: that.stotime(duration)
                                        })
                                    }, 1000)
                                    that.setData({
                                        timer: timer
                                    })
                                })
                                that.setData({
                                    isShowPlay: false,
                                    isShowStart: true,
                                    isShowSuspend: false
                                })
                            }
                        }
                    })
                } else {
                    const recorderManager = wx.getRecorderManager();
                    const options = {
                        duration: 60000,
                        sampleRate: 44100,
                        numberOfChannels: 1,
                        encodeBitRate: 192000,
                        format: 'mp3',
                        frameSize: 50
                    }
                    recorderManager.start(options);
                    var duration = that.data.duration;
                    duration = 0;
                    that.stotime(duration);
                    recorderManager.onStart(function (res) {
                        let timer = setInterval(function () {
                            duration++;
                            that.setData({
                                duration: that.stotime(duration)
                            })
                        }, 1000)
                        that.setData({
                            timer: timer
                        })
                    })
                    that.setData({
                        isShowPlay: false,
                        isShowStart: true,
                        isShowSuspend: false
                    })
                }
            }
        })
    },
    //点击开始录音
    startVoiceTap: function (e) {
        var that = this;
        that.getRecord();
    },
    //停止录音
    stopVoiceTap: function (e) {
        var that = this;
        const recorderManager = wx.getRecorderManager();
        recorderManager.stop();
        recorderManager.onStop(function (res) {
            clearInterval(that.data.timer)
            that.setData({
                upLoadAudio: [{
                    audioUrl: "/User/Audios/" + res.tempFilePath.replace('wxfile://', ''),
                    duration: res.duration
                }],
                upLoadAudioUrl: res.tempFilePath
            })
        })
        this.setData({
            isShowPlay: false,
            isShowStart: false,
            isShowSuspend: true,
            isAgain: false
        })
    },
    //重新录音
    againTap: function () {
        this.setData({
            duration: '00:00'
        })
        this.startVoiceTap();
    },
    stotime: function (s) {
        let t = '';
        if (s > -1) {
            // let hour = Math.floor(s / 3600);
            let min = Math.floor(s / 60) % 60;
            let sec = s % 60;
            // if (hour < 10) {
            //   t = '0' + hour + ":";
            // } else {
            //   t = hour + ":";
            // }

            if (min < 10) {
                t += "0";
            }
            t += min + ":";
            if (sec < 10) {
                t += "0";
            }
            t += sec;
        }
        return t;
    },
    //完成在页面显示需要上传的音频
    sureAudioTap: function () {
        var that = this;
        if (this.data.isShowRecord == true) {
            this.setData({
                isShowRecord: false,
                isShowPlay: true, //默认开始播放图片
                isShowStart: false, //播放图片
                isShowSuspend: false, //暂停图片
                isAgain: true,
                isfreeaudio: true,
                isupload: false,
            })
        }
        if (that.data.num == 1) {
            if (that.data.upLoadAudio.length > 0) {
                that.setData({
                    ispublishvalue: "sendcolor"
                })
            } else {
                that.setData({
                    ispublishvalue: " "
                })
            }
        } else if (that.data.num == 2) {
            if (that.data.upLoadAudio.length > 0 && that.data.infoValue != "") {
                that.setData({
                    ispublishvalue: "sendcolor"
                })
            } else {
                that.setData({
                    ispublishvalue: " "
                })
            }
        }
    },
    //删除音频
    delAudio: function () {
        var that = this;
        wx.showModal({
            content: '是否删除音频',
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        upLoadAudio: [],
                        upLoadAudioUrl: '',
                        currentPosition: '00:00'
                    })
                    if (that.data.upLoadVideo.length == 0) {
                        that.setData({
                            isupload: true,
                            isfreeaudio: false
                        })
                    }
                } else if (res.cancel) {

                }

            }
        })
    },
    //播放音频，
    playaudio: function (e) {
        // var audio=e.currentTarget.dataset.audio;
        // var that=this;
        // var poster=wx.getStorageSync('_head');
        // var duration=that.data.duration;
        // var audioUrl=that.data.upLoadAudioUrl;
        // console.log(audioUrl)
        // var name=null;
        // wx.navigateTo({
        //   url:'/pages/music/music?poster='+poster+'&duration='+duration+'&audioUrl='+audioUrl+'&name='+name+''
        // })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.setNavigationBarTitle({
            title: this.options.name
        });
        that.setData({
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url')
        })
        //判断是否付费主题
        var num = this.options.num;
        if (num == 1) {
            that.setData({
                isfreetheme: true,
                circleId: that.options.id,
                num: num
            })
        } else if (num == 2) {
            that.setData({
                ispaytheme: true,
                circleId: that.options.id,
                num: num
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
            id: this.data.circleId
        });
        prevPage.onLoad();
        wx.hideLoading();
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