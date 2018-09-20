//index.js
const uploadImage = require('../../utils/UploadAliyun.js');
const request = require("../../utils/request.js");
//获取应用实例
const app = getApp()
Page({
    data: {
        navbar: ['圈子', '动态'],
        mangearr: [],
        memberarr: [],
        currentTab: 0,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        src: "/images/addimg.png",
        txt: "创建圈子",
        defaultimage: "/images/errimg.png",
        headimg: "/images/head.jpg",
        itemrgcont: "来场音乐会",
        itemusertxt: "年华匆匆似流水",
        emptytxt: "空空如也",
        emptyimg: "/images/empty.png",
        usercir: "圈主",
        dropdown: "/images/drop-down.png",
        datetxt: "1月11日",
        payimg: "/images/pay.png",
        collectimg: "/images/collect.png",
        ispraiseimg: "/images/collect-sel.png",
        commentimg: "/images/comment.png",
        fromtxt: "来场音乐会",
        collectshow: "/images/bluestar.png",
        contshow: "block",
        conthide: "none",
        token: '',
        url: '',
        mangedis: "",
        membdis: "",
        id: "",
        pageIndex: 1,
        trendarr: [],
        isempty: "",
        flod: "flod",
        isnoempty: "",
        is_ellipsis: true,
        isPack: "全文",
        userridarr: [],
        ismanage: "",
        ismember: "",
        isadd: false,
        currentid: "",
        isdiscombtn: false,
        catchtouchmove: false,
        replyvalue: "",
        replyimgurl: "/images/comimg.png",
        foruserid: "",
        replythemeid: "",
        forcomid: "",
        themeindex: "",
        delorcom: false,
        commentId: "",
        commentUserId: "",
        themeid: "",
        prviewimglist: [],
        poster: "/images/poster.png",
        isshowaudio: false, //显示音频播放组件
        isshare: false, //控制底部分享框是否弹出
        searchLoading: true, //"上拉加载"的变量，默认false，隐藏
        searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
        uploadimgfile: "", //上传图片路径
        isCanDelete: "", //判断能否删除主题
        isCollect: '', //判断是否收藏
        payCircleSurplusCount: '', //可发付费主题条数
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
        canIUse: '', //判断是否已经获取用户信息，
        clicktag: 0, // 防止频繁点击
        refresh: false //数据加载完成之后可以下拉刷新
    },
    //顶部导航切换
    navbarTap: function (e) {
        var that = this;
        this.setData({
            currentTab: e.currentTarget.dataset.idx,
        })
        if (e.currentTarget.dataset.idx == 0) {
            this.setData({
                contshow: "block",
                conthide: "none"
            })
            return;
        } else
        if (e.currentTarget.dataset.idx == 1) {
            this.setData({
                contshow: "none",
                conthide: "block",
                pageIndex: 1
            });
            //加载动态
            wx.showLoading({
                title: '加载中',
                mask: true
            });
            wx.request({
                url: that.data.url + "/api/services/app/theme/GetTrendList",
                data: {
                    pageIndex: 1,
                    pageSize: 10
                },
                method: "post",
                header: {
                    'Authorization': 'Bearer ' + that.data.token
                },
                success: function (res) {
                    //判断有无数据控制显示隐藏空白页
                    if (res.data.result.themeList == null || res.data.result.themeList.length == 0) {
                        that.setData({
                            isempty: "block",
                            isnoempty: "none"

                        });
                    } else {
                        that.setData({
                            isempty: "none",
                            isnoempty: "block",
                            trendarr: res.data.result.themeList
                        });
                    }
                    //循环thmemlist中的id添加到userridarr中，
                    for (var i = 0; i < that.data.trendarr.length; i++) {
                        that.data.userridarr.push(that.data.trendarr[i].id);
                    }
                    that.setData({
                        currentid: res.data.result.currentUserId
                    })
                },
                fail: function (err) {
                    wx.showToast({
                        title: '服务器异常',
                        icon: 'none',
                        duration: 2000
                    })
                },
                complete: function () {
                    setTimeout(function () {
                        wx.hideLoading();
                        wx.hideToast();
                    }, 500);
                }
            });
            return;
        }
    },
    //跳转个人中心
    personTap: function (e) {
        var userId = e.currentTarget.dataset.userid;
        var circleId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/personalSpace/personalSpace?userId=' + userId + '&circleId=' + circleId + ''
        })
    },
    //查看付费内容
    payCheckTap: function () {
        wx.showModal({
            content: '是否付费查看？',
            confirmColor: "#077bfb",
            success: function (res) {
                if (res.confirm) {

                } else if (res.cancel) {

                }
            }
        })
    },
    //文本折叠
    flodTap: function (e) {
        var that = this;
        var tag = e.currentTarget.dataset.hi;
        var index = e.currentTarget.dataset.num;
        that.data.trendarr[index].isExpandAllText = !that.data.trendarr[index].isExpandAllText;

        that.setData({
            trendarr: that.data.trendarr
        })
    },
    //点赞取消点赞
    praiseTap: function (e) {
        var themeId = e.currentTarget.dataset.praid;
        var index = e.currentTarget.dataset.index;
        var that = this;
        wx.request({
            url: that.data.url + "/api/services/app/themeAbout/Praise?themeId=" + themeId + "",
            method: "post",
            header: {
                'Authorization': 'Bearer ' + that.data.token
            },
            success: function (res) {
                var isexit = false;
                if (res.data.success == true) {
                    //点赞
                    if (res.data.result.value == true) {
                        for (var i = 0; i < that.data.trendarr[index].praiseList.length; i++) {
                            if (that.data.currentid == that.data.trendarr[index].praiseList[i].userId) {
                                isexit = true;
                            }
                        }
                        if (isexit == false) {
                            var data = {
                                userId: res.data.result.userId,
                                nickName: res.data.result.userName,
                                value: res.data.result.value
                            }

                            that.data.trendarr[index].praiseList.push(data);
                            that.data.trendarr[index].isPraise = true
                        }
                    }

                    //取消点赞
                    if (res.data.result.value == false) {
                        for (var i = 0; i < that.data.trendarr[index].praiseList.length; i++) {
                            if (that.data.currentid == that.data.trendarr[index].praiseList[i].userId) {
                                that.data.trendarr[index].praiseList.splice(i, 1);
                                that.data.trendarr[index].isPraise = false
                                break;
                            }
                        }

                    }
                    that.setData({
                        trendarr: that.data.trendarr
                    });
                } else {
                    wx.showModal({
                        content: res.data.error.message,
                        confirmColor: "#077bfb",
                        showCancel: false
                    })
                }
            }
        });
    },
    //点击评论icon弹出评论输入框
    commentTap: function (e) {
        var index = e.currentTarget.dataset.index;
        var isShow = e.currentTarget.dataset.com;
        var that = this;
        for (var i = 0; i < that.data.trendarr.length; i++) {
            if (isShow == false) {
                that.setData({
                    isdiscombtn: true,
                    catchtouchmove: true,
                    foruserid: e.currentTarget.dataset.foruserid,
                    replythemeid: e.currentTarget.dataset.themeid,
                    forcomid: e.currentTarget.dataset.forcomid,
                    themeindex: index
                });
            }
        }
    },
    //点击空白地方关闭输入框
    blankTap: function (e) {
        var index = e.currentTarget.dataset.index;
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
        if (clicktag == 0) {
            that.setData({
                clicktag: 1
            })
            var isShow = that.data.isdiscombtn;
            var foruserid = that.data.foruserid;
            var themeid = that.data.replythemeid || that.data.themeid;
            var comtxt = that.data.replyvalue;
            var imgurl = that.data.uploadimgfile;
            var index = that.data.themeindex;
            var data;
            if (imgurl != "" && comtxt!="") {
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
                            var data = res.data.result;
                            that.data.trendarr[index].commentList.push(data);
                            that.setData({
                                trendarr: that.data.trendarr,
                                clicktag: 0
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
                that.setData({
                    isdiscombtn: false,
                    catchtouchmove: false,
                    replyimgurl: "/images/comimg.png",
                    replyvalue: ""
                });
                wx.showToast({
                    title: '评论或回复内容不能为空',
                    icon: 'none',
                    duration: 2000
                })
            }
        } else {
            wx.showToast({
                title: '点击过于频繁',
                icon: 'none'
            })
        }

    },
    //删除 、回复评论
    delorcomTap: function (e) {
        var that = this;
        that.setData({
            // delorcom:true,
            commentId: e.currentTarget.dataset.comid,
            themeid: e.currentTarget.dataset.themeid,
            foruserid: e.currentTarget.dataset.foruserid,
            themeindex: e.currentTarget.dataset.index,
            commentUserId: e.currentTarget.dataset.foruserid
        });
        var list;
        if (that.data.currentid == that.data.commentUserId) {
            list = ['回复', '删除'];
            wx.showActionSheet({
                itemList: list,
                success: function (res) {
                    if (res.tapIndex == 0) {
                        if (that.data.isdiscombtn == false) {
                            that.setData({
                                isdiscombtn: true
                            })
                        }
                    } else if (res.tapIndex == 1) {
                        that.delcomdelTap();
                    }
                },
                fail: function (res) {

                }
            })
        } else {
            list = ['回复'];
            wx.showActionSheet({
                itemList: list,
                success: function (res) {
                    if (res.tapIndex == 0) {
                        if (that.data.isdiscombtn == false) {
                            that.setData({
                                isdiscombtn: true
                            })
                        }
                    }
                },
                fail: function (res) {

                }
            })
        }

    },
    //点击删除评论、回复内容
    delcomdelTap: function () {
        var that = this;
        var index = that.data.themeindex;
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
                    if (res.data.success == true) {
                        for (var i = 0; i < that.data.trendarr[index].commentList.length; i++) {
                            if (id == that.data.trendarr[index].commentList[i].id) {
                                that.data.trendarr[index].commentList.splice(i, 1);
                                i--;
                            }
                        }
                        that.setData({
                            delorcom: false,
                            trendarr: that.data.trendarr
                        })
                    } else {
                        wx.showModal({
                            content: res.data.error.message,
                            confirmColor: "#077bfb",
                            showCancel: false
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
                    "Content-Type": "application/json"
                },
                success: function (res) {
                    if (res.data.success == true) {
                        wx.showToast({
                            title: '删除成功',
                            icon: 'none'
                        });
                        for (var i = 0; i < that.data.trendarr.length; i++) {
                            if (that.data.trendarr[i].id == themeid) {
                                that.data.trendarr.splice(i, 1);
                                that.setData({
                                    isshare: false,
                                    trendarr: that.data.trendarr
                                });
                                break;
                            }
                        }
                    } else {
                        wx.showModal({
                            content: res.data.error.message,
                            confirmColor: "#077bfb",
                            showCancel: false,
                            success: function (res) {

                            }
                        })
                    }
                },
                complete: function () {
                    that.setData({
                        isshare: false
                    })
                }
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
    //video事件,点击播放进入全屏
    playvideo: function (e) {
        this.videoContext = wx.createVideoContext('ninevideo' + e.currentTarget.dataset.video + '');
        this.videoContext.requestFullScreen({
            direction: "horizontal"
        });
    },
    //暂停播放，退出全屏
    changevideo: function (e) {
        if (e.detail.fullScreen == false) {
            this.videoContext.pause();
            this.videoContext.exitFullScreen();
        }
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
    //详情图片预览
    detailimgTap: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.imgindex;
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
    //创建圈子
    addcircle: function () {
        var that = this;
        //判断如果是否可发付费主题
        wx.navigateTo({
            url: '/pages/selcir/selcir'
        })
    },
    //跳转圈子主题详情
    cirtitle: function (e) {
        this.setData({
            id: e.currentTarget.dataset.id
        })
        wx.navigateTo({
            url: "/pages/cirtitle/cirtitle?id=" + this.data.id + ""
        })
    },
    //跳转主题详情页面
    jumpDetailTap: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/themedetails/themedetails?id=" + id + ""
        })
    },
    //管理图片加载出错放默认图片
    mangeerrImg: function (e) {
        var that = this;
        var idx = e.currentTarget.dataset.errimg;
        for (var i = 0; i < that.data.mangearr.length; i++) {
            that.data.mangearr[idx].coverPicture = "/images/errimg.png";
        }
        that.setData({
            mangearr: that.data.mangearr
        });
    },
    //管理图片加载出错放默认图片
    membererrImg: function (e) {
        var that = this;
        var idx = e.currentTarget.dataset.errimg;
        for (var i = 0; i < that.data.memberarr.length; i++) {
            that.data.memberarr[idx].coverPicture = "/images/errimg.png";
        }
        that.setData({
            memberarr: that.data.memberarr
        });
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
            themeid: e.currentTarget.dataset.themeid,
            id: e.currentTarget.dataset.id
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
        if (clicktag == 0) {
            that.setData({
                clicktag: 1
            })
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
        } else {
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
                                    var data = {
                                        payType: 1,
                                        circleId: e.currentTarget.dataset.circleid,
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
                                                            var index = e.currentTarget.dataset.index;
                                                            var imgBlurArr = that.data.trendarr[index].images;
                                                            var imgArr = [];
                                                            if (that.data.trendarr[index].images.length > 0) {
                                                                for (let i = 0; i < imgBlurArr.length; i++) {
                                                                    imgArr.push(imgBlurArr[i].replace('!imgblur', ''));
                                                                }
                                                            }
                                                            that.data.trendarr[index].isCanView = true;
                                                            that.data.trendarr[index].images = imgArr;
                                                            that.setData({
                                                                trendarr: that.data.trendarr
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
    //点击收藏某一条主题动态
    collectTap: function () {
        var that = this;
        var themeid = that.data.themeid;
        wx.request({
            url: that.data.url + "/api/services/app/theme/Favorite?themeId=" + themeid + "",
            method: "post",
            header: {
                'Authorization': 'Bearer ' + that.data.token,
                "Content-Type": "application/json"
            },
            success: function (res) {
                if (res.data.success == true) {
                    if (res.data.result) {
                        wx.showToast({
                            title: '收藏成功',
                            icon: 'none'
                        });
                        that.setData({
                            isshare: false
                        })
                    } else {
                        wx.showToast({
                            title: '取消收藏',
                            icon: 'none'
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
    // 举报
    reportTap: function () {
        wx.navigateTo({
            url: '/pages/index/report/report?themeid=' + this.data.themeid + ''
        })
    },
    //登录
    login: function () {
        var that = this;
        var _code;
        // 登录
        wx.login({
            success: res => {
                _code = res.code
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                var _token;
                var _userid;
                var _head;
                var url = "https://quaner.bjser.com";
                wx.setStorageSync('url', url);
                // 获取用户信息
                wx.getSetting({
                    withCredentials: true,
                    success: res => {
                        if (res.authSetting['scope.userInfo'] == true) {
                            that.setData({
                                canIUse: false
                            });
                        } else {
                            that.setData({
                                canIUse: true
                            });

                        }
                        wx.getUserInfo({

                            success: res1 => {
                                _head = res1.userInfo.avatarUrl;
                                wx.setStorageSync('_head', _head);
                                wx.request({
                                    url: url + '/api/TokenAuth/CreateWxOpenTokenAsync',
                                    method: "post",
                                    data: {
                                        code: _code,
                                        encryptedData: res1.encryptedData,
                                        iv: res1.iv,
                                        rawData: res1.rawData,
                                        signature: res1.signature
                                    },
                                    header: {
                                        'content-type': 'application/json' // 默认值
                                    },
                                    success: function (res) {
                                        console.log(res)
                                        if (res.data.success == true) {
                                            _token = res.data.result.token;
                                            _userid = res.data.result.userId;
                                            wx.setStorageSync('_token', _token);
                                            wx.setStorageSync('_userid', _userid);
                                            that.setData({
                                                token: _token,
                                                url: url
                                            })
                                            //加载动态
                                            wx.showLoading({
                                                title: '加载中',
                                                mask: false
                                            });
                                            //进入小程序加载圈子列表
                                            wx.request({
                                                url: url + "/api/services/app/circle/GetCircleList",
                                                method: "get",
                                                header: {
                                                    'Authorization': 'Bearer ' + _token,
                                                    "Content-Type": "application/json"
                                                },
                                                success: function (res) {
                                                    if (res.data.success == true) {
                                                        if (res.data.result.manage == null || res.data.result.manage.length == 0) {
                                                            that.setData({
                                                                mangedis: "none",
                                                                ismanage: false
                                                            })
                                                        } else {
                                                            that.setData({
                                                                mangedis: "block",
                                                                mangearr: res.data.result.manage,
                                                                ismanage: true
                                                            })
                                                        }
                                                        if (res.data.result.manage == null || res.data.result.member.length == 0) {
                                                            that.setData({
                                                                membdis: "none",
                                                                ismember: false
                                                            })
                                                        } else {
                                                            that.setData({
                                                                membdis: "block",
                                                                memberarr: res.data.result.member,
                                                                ismember: true
                                                            })
                                                        };
                                                        if (res.data.success == false) {
                                                            wx.showToast({
                                                                title: res.data.error.message,
                                                                icon: 'none',
                                                                duration: 2000
                                                            })
                                                        }
                                                        that.setData({
                                                            payCircleSurplusCount: res.data.result.payCircleSurplusCount,
                                                            refresh: true
                                                        });
                                                        wx.showTabBar();
                                                        wx.stopPullDownRefresh();
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
                                                        title: '服务器异常',
                                                        icon: 'none',
                                                        duration: 2000
                                                    })
                                                },
                                                complete: function () {
                                                    setTimeout(function () {
                                                        wx.hideLoading();
                                                        wx.hideToast();
                                                    }, 500);
                                                    that.setData({
                                                        isadd: true
                                                    })
                                                }
                                            });
                                        } else {
                                            if (res.data.error.code == 410) {
                                                wx.navigateTo({
                                                    url: "/pages/index/givephonenum/givephonenum"
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
                                    complete: function () {

                                    }
                                })
                            }
                        })
                    }
                })
            }
        });
    },
    //点击获取用户信息之后
    bindGetUserInfo: function (e) {
        this.login();
    },
    onLoad: function () {
        var that = this;
        wx.hideTabBar();
        that.login();
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },

    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        var that = this;
        //刷新圈子列表
        if (that.data.refresh) {
            if (that.data.currentTab == 0) {
                wx.request({
                    url: that.data.url + "/api/services/app/circle/GetCircleList",
                    method: "get",
                    header: {
                        'Authorization': 'Bearer ' + that.data.token
                    },
                    success: function (res) {
                        if (res.data.result.manage == null || res.data.result.manage.length == 0) {
                            that.setData({
                                mangedis: "none",
                                ismanage: false
                            });
                        } else {
                            that.setData({
                                mangedis: "block",
                                mangearr: res.data.result.manage,
                                ismanage: true
                            })
                        }
                        if (res.data.result.manage == null || res.data.result.member.length == 0) {
                            that.setData({
                                membdis: "none",
                                ismember: false
                            })
                        } else {
                            that.setData({
                                membdis: "block",
                                memberarr: res.data.result.member,
                                ismember: true
                            })
                        };
                        if (res.data.success == false) {
                            wx.showToast({
                                title: res.data.error.message,
                                icon: 'none',
                                duration: 2000
                            })
                        }
                        wx.showToast({
                            title: '刷新成功',
                            icon: 'none',
                            duration: 2000
                        });
                    },
                    fail: function (err) {
                        wx.showToast({
                            title: '服务器异常',
                            icon: 'none',
                            duration: 2000
                        })
                    },
                    complete: function () {
                        setTimeout(function () {
                            wx.hideToast();
                        }, 500);
                        wx.stopPullDownRefresh();
                    }
                });
            } else if (that.data.currentTab == 1) {
                wx.request({
                    url: that.data.url + "/api/services/app/theme/GetTrendList",
                    data: {
                        pageIndex: 1,
                        pageSize: 10
                    },
                    method: "post",
                    header: {
                        'Authorization': 'Bearer ' + that.data.token
                    },
                    success: function (res) {
                        //判断有无数据控制显示隐藏空白页
                        if (res.data.result.themeList == null || res.data.result.themeList.length == 0) {
                            that.setData({
                                isempty: "block",
                                isnoempty: "none"

                            });
                        } else {
                            that.setData({
                                isempty: "none",
                                isnoempty: "block",
                                trendarr: res.data.result.themeList
                            });
                        }
                        //循环thmemlist中的id添加到userridarr中，
                        for (var i = 0; i < that.data.trendarr.length; i++) {
                            that.data.userridarr.push(that.data.trendarr[i].id);
                        }
                        that.setData({
                            currentid: res.data.result.currentUserId
                        });
                        wx.showToast({
                            title: '刷新成功',
                            icon: 'none',
                            duration: 2000
                        });
                    },
                    fail: function (err) {
                        wx.showToast({
                            title: '服务器异常',
                            icon: 'none',
                            duration: 2000
                        })
                    },
                    complete: function () {
                        setTimeout(function () {
                            wx.hideToast();
                        }, 500);
                        wx.stopPullDownRefresh();
                    }
                });
            }
        }


    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var that = this;
        var pageidx = that.data.pageIndex;
        if (that.data.currentTab == 1) {
            pageidx++;
            that.setData({
                searchLoading: false,
                pageIndex: pageidx
            })
            //上拉动态列表
            wx.request({
                url: that.data.url + "/api/services/app/theme/GetTrendList",
                data: {
                    pageIndex: pageidx,
                    pageSize: 10
                },
                method: "post",
                header: {
                    'Authorization': 'Bearer ' + that.data.token
                },
                success: function (res) {
                    var arr = res.data.result.themeList;
                    if (arr.length == 0) {
                        that.setData({
                            // searchLoadingComplete: true,
                            // searchLoading: false,
                            pageIndex: pageidx - 1
                        })
                    } else {
                        for (var i = 0; i < arr.length; i++) {
                            that.data.trendarr.push(arr[i]);
                        }
                        that.setData({
                            trendarr: that.data.trendarr
                        });
                    }
                },
                fail: function (err) {
                    wx.showToast({
                        title: '服务器异常',
                        icon: 'none',
                        duration: 2000
                    })
                },
                complete: function () {
                    setTimeout(function () {
                        that.setData({
                            searchLoading: true
                        })
                    }, 2000)
                }
            });
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '不叫事圈子',
            path: '/pages/index/index',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})