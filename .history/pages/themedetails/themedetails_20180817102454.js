// pages/themedetails/themedetails.js
const uploadImage = require('../../utils/UploadAliyun.js');
const request = require("../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isshow: false,
        details: "",
        cirinfo: "",
        dropdown: "/images/drop-down.png",
        payimg: "/images/pay.png",
        ispraiseimg: "/images/collect-sel.png",
        collectimg: "/images/collect.png",
        commentimg: "/images/comment.png",
        collectshow: "/images/bluestar.png",
        isshare: false,
        themeid: "",
        isCanDelete: "", //判断能否删除主题
        token: '',
        userId: '',
        url: '',
        isdiscombtn: false,
        catchtouchmove: false,
        replyimgurl: "/images/comimg.png",
        foruserid: "",
        replythemeid: "",
        forcomid: "",
        delorcom: false,
        prviewimglist: [],
        uploadimgfile: "", //上传图片路径
        isCollect: '', //判断是否收藏
        id: '',
        pauseStatus: true,
        listShow: false,
        timer: '',
        currentPosition: 0,
        duration: 0,
        poster: '',
        name: '',
        audioUrl: '',
        isAudio: false,
        playIngTxt: '', //正在播放
        isreward: false, //是否显示打赏框
        rewardNum: '', //打赏随机金额
        isRewardDisaled: true, //禁止输入
        rewardfocus: false,
        moneysymbol: '￥', //金钱符号
        clicktag: 0 // 防止频繁点击
    },
    //点赞取消点赞
    praiseTap: function (e) {
        var themeId = e.currentTarget.dataset.praid;
        var that = this;
        wx.request({
            url: that.data.url + "/api/services/app/themeAbout/Praise?themeId=" + themeId + "",
            method: "post",
            header: {
                'Authorization': 'Bearer ' + that.data.token
            },
            success: function (res) {
                var isexit = false;
                //点赞
                if (res.data.result.value == true) {
                    for (var i = 0; i < that.data.details.praiseList.length; i++) {
                        if (that.data.currentid == that.data.details.praiseList[i].userId) {
                            isexit = true;
                        }
                    }
                    if (isexit == false) {
                        var data = {
                            userId: res.data.result.userId,
                            nickName: res.data.result.userName,
                            value: res.data.result.value
                        }

                        that.data.details.praiseList.push(data);
                        that.data.details.isPraise = true;
                        that.setData({
                            details: that.data.details
                        });
                    }
                }

                //取消点赞
                if (res.data.result.value == false) {
                    for (var i = 0; i < that.data.details.praiseList.length; i++) {
                        if (that.data.currentid == that.data.details.praiseList[i].userId) {
                            that.data.details.praiseList.splice(i, 1);
                            that.data.details.isPraise = false;
                            that.setData({
                                details: that.data.details
                            });
                            break;
                        }
                    }

                }

            }
        });
    },
    //详情图片预览
    detailimgTap: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var curimg = e.currentTarget.dataset.src[index];
        wx.previewImage({
            current: curimg,
            urls: e.currentTarget.dataset.src
        });
    },
    //点击播放按钮跳转视频播放页面
    jumpvideo: function (e) {
        var that = this;
        var videosrc = e.currentTarget.dataset.src;
        var id = e.currentTarget.dataset.video;
        wx.navigateTo({
            url: "/pages/playvideo/playvideo?videosrc=" + videosrc + "&id=" + id + ""
        })
    },
    //播放音频，
    playaudio: function (e) {
        var audio = e.currentTarget.dataset.audio;
        var that = this;
        var poster = e.currentTarget.dataset.head;
        var duration = audio.formatDuration;
        var audioUrl = audio.audioUrl;
        var name = e.currentTarget.dataset.name;
        this.setData({
            duration: duration,
            poster: poster,
            name: name,
            audioUrl: audioUrl,
            isAudio: true,
            playIngTxt: '',
            pauseStatus: true,
            currentPosition: 0
        })
        wx.stopBackgroundAudio();
    },
    bindTapPlay: function () {
        console.log('bindTapPlay')
        console.log(this.data.pauseStatus)
        if (this.data.pauseStatus === true) {
            this.play()
            this.setData({
                pauseStatus: false,
                playIngTxt: '正在播放'
            })
        } else {
            wx.pauseBackgroundAudio()
            this.setData({
                pauseStatus: true,
                playIngTxt: '已暂停播放'
            })
        }
    },
    play() {
        var that = this;
        wx.playBackgroundAudio({
            dataUrl: that.data.audioUrl,
            title: that.data.name,
            coverImgUrl: that.data.poster
        })
        let timer = setInterval(function () {
            that.setDuration(that)
        }, 1000)
        this.setData({
            timer: timer
        })
    },
    setDuration(that) {
        wx.getBackgroundAudioPlayerState({
            success: function (res) {
                let {
                    status,
                    duration,
                    currentPosition
                } = res
                if (status === 1 || status === 0) {
                    that.setData({
                        currentPosition: that.stotime(currentPosition),
                        duration: that.stotime(duration),
                        sliderValue: Math.floor(currentPosition * 100 / duration),
                    })
                }
            }
        })
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
    offAudioTap: function () {
        this.setData({
            isAudio: false,
            playIngTxt: '',
            pauseStatus: true,
            currentPosition: 0
        })
        wx.stopBackgroundAudio();
    },
    //点击dropdown从底部弹出分享框
    sharelinkTap: function (e) {
        var that = this;
        if (that.data.isshare == false) {
            var url = that.data.url + '/api/services/app/theme/IsFavorited?themeId=' + e.currentTarget.dataset.themeid + '';
            var data = {};
            var header = {
                'Authorization': 'Bearer ' + that.data.token
            };
            request.POST({
                url: url,
                data: data,
                header: header,
                success: function (res) {
                    console.log(res)
                    if (res.data.success == true) {
                        that.setData({
                            isshare: true,
                            themeid: e.currentTarget.dataset.themeid,
                            isCanDelete: e.currentTarget.dataset.del,
                            isCollect: res.data.result,
                            catchtouchmove: true
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

        }
    },
    //点击取消关闭底部弹出分享框
    coloesharelinkTap: function (e) {
        if (this.data.isshare == true) {
            this.setData({
                isshare: false,
                catchtouchmove: false
            })
        }
    },
    //点击收藏某一条主题动态
    collectTap: function () {
        var that = this;
        var themeid = that.data.themeid;
        wx.request({
            url: that.data.url + "/api/services/app/theme/Favorite?themeId=" + themeid + "",
            method: "post",
            header: {
                'Authorization': 'Bearer ' + that.data.token,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res)
                if (res.data.success == true) {
                    if (res.data.result) {
                        wx.showToast({
                            title: '收藏成功',
                            icon: 'none',
                            duration: 2000
                        });
                        that.setData({
                            isshare: false
                        })
                    } else {
                        wx.showToast({
                            title: '取消收藏',
                            icon: 'none',
                            duration: 2000
                        });
                        that.setData({
                            isshare: false
                        })
                    }

                } else {
                    wx.showModal({
                        content: res.data.error.message,
                        confirmColor: "#077bfb",
                        showCancel: false
                    })
                }
            },
            fail: function (err) {
                wx.showToast({
                    title: '收藏失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        })
    },
    //删除主题动态
    delthemeTap: function () {
        var that = this;
        var themeid = that.data.themeid; //需要删除的主题ID
        if (that.data.isCanDelete == true) {
            wx.request({
                url: that.data.url + "/api/services/app/theme/DeleteTheme?themeId=" + themeid + "",
                method: "delete",
                header: {
                    'Authorization': 'Bearer ' + that.data.token,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    if (res.statusCode == 500) {
                        wx.showToast({
                            title: '没有权限删除主题',
                            icon: 'none',
                            duration: 2000
                        })
                    } else {
                        wx.showToast({
                            title: '删除成功',
                            icon: 'none',
                            duration: 2000
                        });
                    }

                }
            })
        }
    },
    //点击评论icon弹出评论输入框
    commentTap: function (e) {
        console.log(e)
        var isShow = e.currentTarget.dataset.com;
        var that = this;
        if (isShow == false) {
            that.setData({
                isdiscombtn: true,
                catchtouchmove: true,
                foruserid: e.currentTarget.dataset.foruserid,
                replythemeid: e.currentTarget.dataset.themeid,
                forcomid: e.currentTarget.dataset.forcomid
            });
        }
    },
    //点击空白地方关闭输入框
    blankTap: function (e) {
        var isShow = e.currentTarget.dataset.com;
        var that = this;
        if (isShow == true) {
            that.setData({
                isdiscombtn: false,
                catchtouchmove: false,
                replyimgurl: "/images/comimg.png",
                replyvalue: ""
            });
        }
    },
    //失去焦点获取评论框内容
    bulrtap: function (e) {
        this.setData({
            replyvalue: e.detail.value
        })
    },
    //评论发表图片
    replyimgurlTap: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var filePath = res.tempFilePaths[0];
                console.log(filePath.replace('http://tmp/', ''))
                uploadImage(filePath, "User/Images/",
                    function (res) {
                        that.setData({
                            uploadimgfile: "/User/Images/" + filePath.replace('wxfile://', '')
                        })
                        console.log("上传成功")
                        //todo 做任何你想做的事
                    },
                    function (res) {
                        console.log("上传失败")
                        //todo 做任何你想做的事
                    })
                that.setData({
                    replyimgurl: filePath
                })
            }
        })

    },
    //点击发送评论
    sendTap: function (e) {
        var that = this;
        var clicktag = that.data.clicktag;
        if (clicktag==0) {
            that.setData({
                clicktag:1
            });
            var isShow = that.data.isdiscombtn;
            var foruserid = that.data.foruserid;
            var themeid = that.data.replythemeid || that.data.themeid;
            var comtxt = that.data.replyvalue;
            var imgurl = that.data.uploadimgfile;
            var data;
            //评论没有图片时，参数不传
            if (imgurl == "") {
                data = {
                    themeId: themeid,
                    forUserId: foruserid,
                    commentText: comtxt
                }
            } else {
                data = {
                    themeId: themeid,
                    forUserId: foruserid,
                    commentText: comtxt,
                    imageUrl: imgurl
                }
            }
            if (that.data.currentid != foruserid) {
                wx.request({
                    url: that.data.url + "/api/services/app/themeAbout/AddComment",
                    method: "post",
                    data: data,
                    header: {
                        'Authorization': 'Bearer ' + that.data.token,
                        "Content-Type": "application/json"
                    },
                    success: function (res) {
                        console.log(res)
                        var data = res.data.result;
                        that.data.details.commentList.push(data);
                        that.setData({
                            details: that.data.details,
                            clicktag:0
                        });
                    },
                    fail: function (err) {

                    },
                    complete: function () {
                        if (isShow == true) {
                            that.setData({
                                isdiscombtn: false,
                                catchtouchmove: false,
                                replyimgurl: "/images/comimg.png",
                                replyvalue: ""
                            });
                        }
                    }
                })
            } else {
                wx.showToast({
                    title: '请回复别人',
                    icon: 'none',
                    duration: 2000
                })
            }
        }else{
            wx.showToast({
                title: '点击过于频繁',
                icon: 'none'
            })
        }

    },
    //删除 、回复评论
    delorcomTap: function (e) {
        console.log(e)
        var that = this;
        that.setData({
            delorcom: true,
            commentId: e.currentTarget.dataset.comid,
            themeid: e.currentTarget.dataset.themeid,
            foruserid: e.currentTarget.dataset.foruserid,
            commentUserId: e.currentTarget.dataset.foruserid
        });

    },
    //点击回复弹出输入框
    delcomreplyTap: function () {
        var that = this;
        if (that.data.isdiscombtn == false) {
            that.setData({
                isdiscombtn: true,
                delorcom: false
            })
        }
    },
    //点击删除评论、回复内容
    delcomdelTap: function () {
        var that = this;
        var id = that.data.commentId;
        if (that.data.currentid == that.data.commentUserId) {
            wx.request({
                url: that.data.url + "/api/services/app/themeAbout/DeleteComment?CommentId=" + that.data.commentId + "",
                data: {
                    CommentId: that.data.commentId
                },
                method: "delete",
                header: {
                    'Authorization': 'Bearer ' + that.data.token,
                    "Content-Type": "application/json"
                },
                success: function (res) {
                    console.log(res)
                    if (res.data.success == true) {
                        for (var i = 0; i < that.data.details.commentList.length; i++) {
                            if (id == that.data.details.commentList[i].id) {
                                that.data.details.commentList.splice(i, 1);
                                i--;
                            }
                        }
                        that.setData({
                            delorcom: false,
                            details: that.data.details
                        })
                        wx.showToast({
                            title: '删除成功',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                },
                fail: function (err) {

                }
            })
        } else {
            wx.showToast({
                title: '无权限删除评论信息',
                icon: 'none',
                duration: 2000
            })
        }
    },
    //点击空白关闭删除、回复框
    closedelrepTap: function () {
        var that = this;
        if (that.data.delorcom == true) {
            that.setData({
                delorcom: false
            })
        }
    },
    //预览图片
    prviewTap: function (e) {
        var that = this;
        var curimg = e.currentTarget.dataset.prviewimg;
        that.data.prviewimglist.push(curimg);
        wx.previewImage({
            current: curimg,
            urls: that.data.prviewimglist
        });
    },
    //跳转到圈子
    jumpcirTap: function () {
        wx.redirectTo({
            url: "/pages/cirtitle/cirtitle?id=" + this.data.cirinfo.circleId + ""
        })
    },
    getThemeDetail: function () {
        var that = this;
        //加载动态
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var id = that.data.id;
        var url = that.data.url + '/api/services/app/theme/GetThemeDetail?themeId=' + id + '';
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
                        details: res.data.result.themeList[0],
                        cirinfo: res.data.result
                    })
                    if (that.data.details.length != "") {
                        that.setData({
                            isshow: true
                        })
                    }
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
                wx.hideLoading();
            }
        })
    },
    //跳转个人中心
    personTap: function (e) {
        console.log(e)
        var userId = e.currentTarget.dataset.userid;
        var circleId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/personalSpace/personalSpace?userId=' + userId + '&circleId=' + circleId + ''
        })
    },
    //随机数
    getRandom: function (min, max) {
        var r = Math.random() * (max - min);
        var re = Math.round(r + min);
        re = Math.max(Math.min(re, max), min).toFixed(2)
        return re;
    },
    //点击金额图标弹出打赏框
    rewardTap: function (e) {
        var that = this;
        var rewardNum = (that.getRandom(1, 90) / 10 + Math.random()).toFixed(2);
        that.setData({
            isreward: true,
            catchtouchmove: true,
            rewardNum: rewardNum,
            themeid: e.currentTarget.dataset.themeid
        })

    },
    //清空打赏金额
    rewardOtherTap: function () {
        this.setData({
            rewardNum: '',
            moneysymbol: '',
            rewardfocus: true,
            isRewardDisaled: false
        })
    },
    //修改打赏金额
    rewardInput: function (e) {
        var rewardNum = e.detail.value.replace('￥', '');
        this.setData({
            rewardNum: rewardNum,
            moneysymbol: '￥'
        })
    },
    //支付打赏
    payRewardTap: function () {
        var that = this;
        var clicktag = that.data.clicktag;
        if (clicktag==0) {
            that.setData({
                clicktag:1
            });
            var rewardNum = that.data.rewardNum;
            if (rewardNum >= 0.1 && rewardNum <= 200) {
                wx.login({
                    success: res => {
                        wx.request({
                            url: that.data.url + '/api/Wxpay/GetOpenId?code=' + res.code + '',
                            method: "get",
                            header: {
                                'Authorization': 'Bearer ' + that.data.token
                            },
                            success: function (res) {
                                var openId = res.data;
                                var themeid = that.data.themeid;
                                var url = that.data.url + '/api/Wxpay/TradeCreateForWxOpen';
                                var data = {
                                    payType: 2,
                                    circleId: that.data.id,
                                    themeId: themeid,
                                    payMethod: 0,
                                    payMoney: rewardNum,
                                    openId: openId
                                };

                                var header = {
                                    'Authorization': 'Bearer ' + that.data.token
                                };
                                request.POST({
                                    url: url,
                                    data: data,
                                    header: header,
                                    success: function (res) {
                                        console.log(res)
                                        if (res.statusCode == 200) {
                                            wx.requestPayment({
                                                'timeStamp': res.data.timestamp,
                                                'nonceStr': res.data.noncestr,
                                                'package': res.data.package,
                                                'signType': 'MD5',
                                                'paySign': res.data.sign,
                                                'success': function (res) {
                                                    if (res.errMsg == 'requestPayment:ok') {
                                                        that.setData({
                                                            isreward: false,
                                                            catchtouchmove: false,
                                                            isRewardDisaled: true,
                                                            rewardfocus: false,
                                                            clicktag: 0
                                                        })
                                                    }
                                                },
                                                'fail': function (res) {
                                                    wx.showToast({
                                                        title: '取消打赏支付',
                                                        icon: 'none',
                                                        duration: 2000
                                                    })
                                                    that.setData({
                                                        isreward: false,
                                                        catchtouchmove: false,
                                                        isRewardDisaled: true,
                                                        rewardfocus: false,
                                                        clicktag: 0
                                                    })
                                                }
                                            })
                                        } else {
                                            wx.showModal({
                                                content: '发起支付异常',
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
                            }
                        })
                    }
                })
            } else {
                that.setData({
                    isreward: false,
                    catchtouchmove: false,
                    isRewardDisaled: true,
                    rewardfocus: false
                })
                wx.showToast({
                    title: '打赏金额超出范围',
                    icon: 'none',
                    duration: 2000
                })

            }
        }else{
            wx.showToast({
                title: '点击过于频繁',
                icon: 'none'
            })
        }

    },
    //点击空白处或关闭图标，关闭打赏框
    closeRewardTap: function () {
        this.setData({
            isreward: false,
            catchtouchmove: false,
            isRewardDisaled: true,
            rewardfocus: false
        })
    },
    //查看付费内容
    payCheckTap: function (e) {
        var that = this;
        wx.showModal({
            content: '是否付费查看？',
            confirmColor: "#077bfb",
            success: function (res) {
                if (res.confirm) {
                    wx.login({
                        success: res => {
                            wx.request({
                                url: that.data.url + '/api/Wxpay/GetOpenId?code=' + res.code + '',
                                method: "get",
                                header: {
                                    'Authorization': 'Bearer ' + that.data.token
                                },
                                success: function (res) {
                                    var openId = res.data;
                                    var themeid = e.currentTarget.dataset.themeid;
                                    var url = that.data.url + '/api/Wxpay/TradeCreateForWxOpen';
                                    console.log(that.data.id)
                                    console.log(themeid)
                                    console.log(openId)
                                    var data = {
                                        payType: 1,
                                        circleId: that.data.id,
                                        themeId: themeid,
                                        payMethod: 0,
                                        payMoney: e.currentTarget.dataset.money,
                                        openId: openId
                                    };
                                    var header = {
                                        'Authorization': 'Bearer ' + that.data.token
                                    };
                                    request.POST({
                                        url: url,
                                        data: data,
                                        header: header,
                                        success: function (res) {
                                            if (res.statusCode == 200) {
                                                wx.requestPayment({
                                                    'timeStamp': res.data.timestamp,
                                                    'nonceStr': res.data.noncestr,
                                                    'package': res.data.package,
                                                    'signType': 'MD5',
                                                    'paySign': res.data.sign,
                                                    'success': function (res) {
                                                        if (res.errMsg == 'requestPayment:ok') {
                                                            var imgBlurArr = that.data.details.images;
                                                            var imgArr = [];
                                                            if (that.data.details.images.length > 0) {
                                                                for (let i = 0; i < imageArr.length; i++) {
                                                                    imgArr.push(imgBlurArr[i].replace('!imgblur', ''));
                                                                }
                                                            }
                                                            that.data.details.isCanView = true;
                                                            that.data.details.images = imgArr;
                                                            that.setData({
                                                                details: that.data.details
                                                            })
                                                        }
                                                    },
                                                    'fail': function (res) {
                                                        wx.showToast({
                                                            title: '取消打赏支付',
                                                            icon: 'none',
                                                            duration: 2000
                                                        })
                                                    }
                                                })
                                            } else {
                                                wx.showModal({
                                                    content: '发起支付异常',
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
                                }
                            })
                        }
                    })
                } else if (res.cancel) {

                }
            }
        })
    },
    // 举报
    reportTap: function () {
        wx.navigateTo({
            url: '/pages/themedetails/report/report?themeid=' + this.data.themeid + ''
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
            currentid: wx.getStorageSync('_userid'),
            id: options.id
        })
        this.getThemeDetail();
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
})