const uploadImage = require('../../utils/UploadAliyun.js');
const request = require("../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        qrimg: "/images/qrcode.png",
        foucesimg: "/images/fouces.png",
        totalbs: "",
        coverPicture: "",
        headimg: "/images/head.jpg",
        itemrgcont: "",
        itemusertxt: "",
        emptytxt: "空空如也",
        emptyimg: "/images/empty.png",
        usercir: "",
        dropdown: "/images/drop-down.png",
        datetxt: "1月11日",
        payimg: "/images/pay.png",
        collectimg: "/images/collect.png",
        ispraiseimg: "/images/collect-sel.png",
        commentimg: "/images/comment.png",
        collectshow: "/images/bluestar.png",
        contshow: "block",
        conthide: "none",
        addthemeimg: "/images/addtheme.png",
        cirqr: "none",
        themebg: "/images/themeimg.png",
        defaultheadimg: "/images/defaulthead.png",
        themeqrimg: "",
        cirfollowTap: "none",
        catchtouchmove: false,
        serqrcodeimg: "/images/serqrcode.jpg",
        intro: "",
        id: "",
        token: "",
        url: "",
        foucedis: "",
        themeisn: "none",
        themeisb: "none",
        themearr: [],
        admincolor: "",
        flod: "flod",
        userridarr: [],
        praid: "",
        userId: '',
        isdel: true,
        direction: "horizontal",
        isdiscombtn: false,
        foruserid: "",
        replythemeid: "",
        replyvalue: "",
        replyimgurl: "/images/comimg.png",
        // delorcom:false,
        commentId: "",
        themeindex: "",
        prviewimglist: [],
        commentUserId: "",
        forcomid: "",
        poster: "/images/poster.png",
        isshowaudio: false,
        audiosrc: "",
        audioId: "",
        themeid: "",
        pageIndex: 1,
        isshare: false,
        searchLoading: true, //"上拉加载"的变量，默认false，隐藏
        searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
        createtheme: false, //控制发布选项框
        uploadimgfile: "", //上传图片路径
        isCanDelete: "", //判断能否删除主题
        cirheadinfo: "", //圈子头部信息
        isaddtheme: false, //判断不能发布免费
        ispublishPayThemePerson: '', //判断能否发付费主题
        ispublishThemePerson: '', //判断能否发免费主题
        isCollect: '', //判断是否收藏
        lazyload: true,
        itemList: ['免费主题', '付费主题'],
        replayName: '',
        isLoad: false,
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
        dragbottom: 130,
        dragright: 35,
        moneysymbol: '￥', //金钱符号
        scrolltop: 0,
        scrollTop: '', //控制是否显示回到顶部图标
        themeLength: '',
        clicktag: 0 // 防止频繁点击
    },
    scroll: function (e) {
        //判断能否发主题
        if (this.data.cirheadinfo.publishPayThemePerson == true || this.data.cirheadinfo.publishThemePerson == true) {
            if (e.detail.deltaY < 0) {
                this.setData({
                    isaddtheme: false
                })
            } else {
                this.setData({
                    isaddtheme: true
                })
            }
        } else {
            that.setData({
                isaddtheme: false
            })
        }
        //控制是否显示回到顶部图标
        this.setData({
            scrollTop: e.detail.scrollTop
        })

    },
    runtop: function (e) {
        console.log('1');
        this.setData({
            scrolltop: 0
        })
    },
    previewvideo: function () {
        wx.previewImage({
            current: 'https://media.bjser.com/User/Videos/1517914875866.mp4', // 当前显示图片的http链接
            urls: ["https://media.bjser.com/User/Videos/1517914875866.mp4"] // 需要预览的图片http链接列表
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    setcirTap: function () {
        var id = this.data.id;
        wx.navigateTo({
            url: "/pages/cirtitle/setcir/setcir?id=" + id + ""
        })
    },
    //文本折叠
    flodTap: function (e) {
        var that = this;
        var tag = e.currentTarget.dataset.hi;
        var index = e.currentTarget.dataset.num;
        that.data.themearr[index].isExpandAllText = !that.data.themearr[index].isExpandAllText;
        that.setData({
            themearr: that.data.themearr
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
                //点赞
                if (res.data.result.value == true) {
                    for (var i = 0; i < that.data.themearr[index].praiseList.length; i++) {
                        if (that.data.userId == that.data.themearr[index].praiseList[i].userId) {
                            isexit = true;
                        }
                    }
                    if (isexit == false) {
                        var data = {
                            userId: res.data.result.userId,
                            nickName: res.data.result.userName,
                            value: res.data.result.value
                        }

                        that.data.themearr[index].praiseList.push(data);
                        that.data.themearr[index].isPraise = true;
                        that.setData({
                            themearr: that.data.themearr
                        });
                    }
                }

                //取消点赞
                if (res.data.result.value == false) {
                    for (var i = 0; i < that.data.themearr[index].praiseList.length; i++) {
                        if (that.data.userId == that.data.themearr[index].praiseList[i].userId) {
                            that.data.themearr[index].praiseList.splice(i, 1);
                            that.data.themearr[index].isPraise = false;
                            that.setData({
                                themearr: that.data.themearr
                            });
                            break;
                        }
                    }

                }
            }
        });
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
            wx.pauseBackgroundAudio();
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
    //点击评论icon弹出评论输入框
    commentTap: function (e) {
        var index = e.currentTarget.dataset.index;
        var isShow = e.currentTarget.dataset.com;
        var that = this;
        for (var i = 0; i < that.data.themearr.length; i++) {
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
        if (clicktag==0) {
            that.setData({
                clicktag:1
            });
            var isShow = that.data.isdiscombtn;
            var foruserid = that.data.foruserid;
            var themeid = that.data.replythemeid || that.data.themeid;
            var comtxt = that.data.replyvalue;
            var imgurl = that.data.uploadimgfile;
            var index = that.data.themeindex;
            var data;
            if (comtxt != '' && imgurl!="") {
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
                if (that.data.userId != foruserid) {
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
                            that.data.themearr[index].commentList.push(data);
                            that.setData({
                                themearr: that.data.themearr
                            });
                            setTimeout(function () {
                                that.setData({
                                    clicktag: 0
                                })
                            }, 5000);
                        },
                        fail: function (err) {

                        },
                        complete: function () {
                            if (isShow == true) {
                                that.setData({
                                    isdiscombtn: false,
                                    catchtouchmove: false,
                                    replyimgurl: "/images/comimg.png",
                                    replyvalue: "",
                                    clicktag: 0
                                });
                            }
                        }
                    })
                } else {
                    that.setData({
                        isdiscombtn: false,
                        catchtouchmove: false,
                        replyimgurl: "/images/comimg.png",
                        replyvalue: "",
                        clicktag: 0
                    });
                    wx.showToast({
                        title: '请回复别人',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }else{

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
            // delorcom:true,
            commentId: e.currentTarget.dataset.comid,
            themeid: e.currentTarget.dataset.themeid,
            foruserid: e.currentTarget.dataset.foruserid,
            themeindex: e.currentTarget.dataset.index,
            commentUserId: e.currentTarget.dataset.foruserid,
            replayName: e.currentTarget.dataset.name
        });
        var list;
        if (that.data.userId == that.data.commentUserId) {
            list = ['删除'];
            wx.showActionSheet({
                itemList: list,
                success: function (res) {
                    if (res.tapIndex == 0) {
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
        if (that.data.userId == that.data.commentUserId) {
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
                        for (var i = 0; i < that.data.themearr[index].commentList.length; i++) {
                            if (id == that.data.themearr[index].commentList[i].id) {
                                that.data.themearr[index].commentList.splice(i, 1);
                                i--;
                            }
                        }
                        that.setData({
                            delorcom: false,
                            themearr: that.data.themearr
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
    // 举报主题

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
                console.log(res)
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
                    console.log(res)
                    if (res.data.success == true) {
                        wx.showToast({
                            title: '删除成功',
                            icon: 'none'
                        });
                        for (var i = 0; i < that.data.themearr.length; i++) {
                            if (that.data.themearr[i].id == themeid) {
                                that.data.themearr.splice(i, 1);
                                that.setData({
                                    isshare: false,
                                    themearr: that.data.themearr
                                });
                                break;
                            }
                        }
                    } else {
                        wx.showModal({
                            content: res.data.error.message,
                            confirmColor: "#077bfb",
                            showCancel: false
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

    // 举报
    reportTap: function () {
        wx.navigateTo({
            url: '/pages/cirtitle/report/report?themeid=' + this.data.themeid + ''
        })
    },
    //点击弹出发布主题选项框
    addthemeTap: function () {
        var that = this;
        var list;
        var PayThemePerson = that.data.ispublishPayThemePerson;
        var ThemePerson = that.data.ispublishThemePerson;
        if (PayThemePerson == true && ThemePerson == true) {
            list = ['免费主题', '付费主题'];
        }
        if (ThemePerson == true && PayThemePerson == false) {
            list = ['免费主题'];
        }
        console.log(that.data.ispublishPayThemePerson);
        console.log(that.data.ispublishThemePerson);

        wx.showActionSheet({
            itemList: list,
            success: function (res) {
                console.log(res.tapIndex)
                //0 发免费主题 1付费主题
                if (res.tapIndex == 0) {
                    var name = that.data.itemrgcont;
                    var id = that.data.id;
                    wx.navigateTo({
                        url: "/pages/cirtitle/publishtheme/publishtheme?name=" + name + "&num=1&id=" + id + ""
                    })
                } else if (res.tapIndex == 1) {
                    var name = that.data.itemrgcont;
                    var id = that.data.id;
                    wx.navigateTo({
                        url: "/pages/cirtitle/publishtheme/publishtheme?name=" + name + "&num=2&id=" + id + ""
                    })
                }
            },
            fail: function (res) {

            }
        })
    },

    //跳转主题详情页面
    jumpDetailTap: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/themedetails/themedetails?id=" + id + ""
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
                                                        });
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
                                                    });
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
    //跳转个人中心
    personTap: function (e) {
        var userId = e.currentTarget.dataset.userid;
        var circleId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/personalSpace/personalSpace?userId=' + userId + '&circleId=' + circleId + ''
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
                                                console.log(res)
                                                wx.requestPayment({
                                                    'timeStamp': res.data.timestamp,
                                                    'nonceStr': res.data.noncestr,
                                                    'package': res.data.package,
                                                    'signType': 'MD5',
                                                    'paySign': res.data.sign,
                                                    'success': function (res) {
                                                        if (res.errMsg == 'requestPayment:ok') {
                                                            var index = e.currentTarget.dataset.index;
                                                            var imgBlurArr = that.data.themearr[index].images;
                                                            var imgArr = [];
                                                            if (that.data.themearr[index].images.length > 0) {
                                                                for (let i = 0; i < imgBlurArr.length; i++) {
                                                                    imgArr.push(imgBlurArr[i].replace('!imgblur', ''));
                                                                }
                                                            }
                                                            that.data.themearr[index].isCanView = true;
                                                            that.data.themearr[index].images = imgArr;
                                                            that.setData({
                                                                themearr: that.data.themearr
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
    //复制链接分享到朋友圈

    onLoad: function (options) {
        this.setData({
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url'),
            userId: wx.getStorageSync('_userid')
        });
        //加载动态
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        this.setData({
            id: this.options.id
        });
        var pageidx = this.data.pageIndex;
        //圈子主体详情列表
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                console.log(res)
                that.setData({
                    screenHeight: res.windowHeight,
                    screenWidth: res.windowWidth,
                });
            }
        });
        wx.request({
            url: that.data.url + "/api/services/app/theme/GetThemeList",
            method: "post",
            data: {
                circleId: that.data.id,
                pageIndex: 1,
                pageSize: 10
            },
            header: {
                'Authorization': 'Bearer ' + that.data.token
            },
            success: function (res) {
                console.log(res)
                if (res.data.success == true) {
                    //判断themelist是否为空
                    if (res.data.result.themeList == null || res.data.result.themeList.length == 0) {
                        that.setData({
                            themeisn: "block",
                            themeisb: "none"
                        })
                    } else {
                        that.setData({
                            themeisn: "none",
                            themeisb: "block"
                        })
                    };

                    that.setData({
                        themearr: res.data.result.themeList,
                        isLoad: true,
                        themeLength: res.data.result.themeList.length
                    });

                    //循环thmemlist中的id添加到userridarr中，
                    for (var i = 0; i < that.data.themearr.length; i++) {
                        that.data.userridarr.push(that.data.themearr[i].id);
                    }
                    //判断圈主、管理员成员来显示服务号
                    if (res.data.result.circleInfo.role == 1) {
                        that.setData({
                            foucedis: "none",
                            admincolor: ""
                        });
                    } else {
                        that.setData({
                            foucedis: "block",
                            admincolor: "adminclor"
                        });
                    };
                    //判断能否发主题
                    if (res.data.result.circleInfo.publishPayThemePerson == true || res.data.result.circleInfo.publishThemePerson == true) {
                        that.setData({
                            isaddtheme: true
                        })
                    } else {
                        that.setData({
                            isaddtheme: false
                        })
                    }
                    //判断能否发付费主题
                    if (res.data.result.circleInfo.publishPayThemePerson == true) {
                        that.setData({
                            ispublishPayThemePerson: true
                        })
                    }
                    //判断能否发免费主题
                    if (res.data.result.circleInfo.publishThemePerson == true) {
                        that.setData({
                            ispublishThemePerson: true
                        })
                    }
                    //圈子头部信息
                    that.setData({
                        cirheadinfo: res.data.result.circleInfo,
                        coverPicture: res.data.result.circleInfo.coverPicture,
                        itemrgcont: res.data.result.circleInfo.name,
                        itemusertxt: res.data.result.circleInfo.masterNickName,
                        intro: res.data.result.circleInfo.intro,
                        role: res.data.result.circleInfo.role
                    });
                    //当前圈子主题名字
                    wx.setNavigationBarTitle({
                        title: res.data.result.circleInfo.name
                    });
                    //判断圈主是否点赞
                    if (res.data.success == false) {
                        wx.showToast({
                            title: res.data.error.message,
                            icon: 'none',
                            duration: 2000
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
                    title: '服务器异常',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: function () {
                setTimeout(function () {
                    wx.hideLoading();
                    wx.hideToast();
                }, 1000);

            }
        });
    },
    //分享
    share: function () {
        console.log(1)
    },
    //点击二维码图标弹出圈子二维码
    cirqrshowTap: function (e) {
        var that = this;
        var id = that.data.id;
        var userId = that.data.userId;
        var name = that.data.cirheadinfo.name;
        if (e.currentTarget.dataset.cir == "none") {
            this.setData({
                cirqr: "block",
                themeqrimg: that.data.url + "/api/QRCode/GetWxOpenCircleQRCode?path=pages/cirsharelist/cirsharelist?qr={userid:" + userId + ",cirid:" + id + "}"
            })
        } else {
            return;
        }
    },
    //点击屏幕任意地方隐藏圈子二维码
    cirqrhideTap: function (e) {
        if (e.currentTarget.dataset.cir == "block") {
            this.setData({
                cirqr: "none"
            })
        } else {
            return;
        }
    },
    //点击保存二维码
    dwloadQrcode: function () {

    },
    //跳转圈子服务号二维码
    cirfollowTap: function (e) {
        console.log(e);
        if (e.currentTarget.dataset.cirfo == "none") {
            this.setData({
                cirfollowTap: "block",
                catchtouchmove: true
            })
        } else {
            return;
        }
    },
    //关闭圈子服务号二维码
    clearTap: function (e) {
        console.log(e);
        if (e.currentTarget.dataset.cirfo == "block") {
            this.setData({
                cirfollowTap: "none",
                catchtouchmove: false
            })
        } else {
            return;
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

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        var that = this;
        wx.request({
            url: that.data.url + "/api/services/app/theme/GetThemeList",
            method: "post",
            data: {
                circleId: that.data.id,
                pageIndex: 1,
                pageSize: 10
            },
            header: {
                'Authorization': 'Bearer ' + that.data.token
            },
            success: function (res) {
                //判断themelist是否为空
                if (res.data.result.themeList == null || res.data.result.themeList.length == 0) {
                    that.setData({
                        themeisn: "block",
                        themeisb: "none"
                    })
                } else {
                    that.setData({
                        themeisn: "none",
                        themeisb: "block"
                    })
                };

                that.setData({
                    themearr: res.data.result.themeList,
                    userId: res.data.result.currentUserId
                });

                //循环thmemlist中的id添加到userridarr中，
                for (var i = 0; i < that.data.themearr.length; i++) {
                    that.data.userridarr.push(that.data.themearr[i].id);
                }
                //判断圈主、管理员成员来显示服务号
                if (res.data.result.circleInfo.role == 1) {
                    that.setData({
                        foucedis: "none",
                        admincolor: ""
                    });
                } else {
                    that.setData({
                        foucedis: "block",
                        admincolor: "adminclor"
                    });
                };
                //圈子头部信息
                that.setData({
                    coverPicture: res.data.result.circleInfo.coverPicture,
                    itemrgcont: res.data.result.circleInfo.name,
                    itemusertxt: res.data.result.circleInfo.masterNickName,
                    intro: res.data.result.circleInfo.intro
                });
                //当前圈子主题名字
                wx.setNavigationBarTitle({
                    title: res.data.result.circleInfo.name
                });
                //判断圈主是否点赞
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
                }, 1000);
                wx.stopPullDownRefresh();
            }
        });
    },
    loadmore: function () {
        var pageidx = this.data.pageIndex;
        var that = this;
        pageidx++
        that.setData({
            searchLoading: false,
            pageIndex: pageidx
        })
        //上拉加载更多圈子主体详情列表
        wx.request({
            url: that.data.url + "/api/services/app/theme/GetThemeList",
            method: "post",
            data: {
                circleId: that.data.id,
                pageIndex: pageidx,
                pageSize: 10
            },
            header: {
                'Authorization': 'Bearer ' + that.data.token
            },
            success: function (res) {
                console.log(res)
                var arr = res.data.result.themeList;
                if (arr.length == 0) {
                    that.setData({
                        // searchLoadingComplete: true,
                        // searchLoading: false,
                        pageIndex: pageidx - 1
                    })
                } else {
                    for (var i = 0; i < arr.length; i++) {
                        that.data.themearr.push(arr[i]);
                    }
                    that.setData({
                        themearr: that.data.themearr
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
                        // searchLoadingComplete: false
                        searchLoading:true
                    });
                }, 2000)

            }
        });
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function (e) {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        var that = this;
        var id = that.data.id;
        var userId = that.data.userId;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '不叫事圈子',
            path: "/pages/cirsharelist/cirsharelist?qr={userid:" + userId + ",cirid:" + id + "}",
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})