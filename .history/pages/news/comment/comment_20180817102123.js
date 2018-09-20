// pages/news/comment/comment.js
const uploadImage = require('../../../utils/UploadAliyun.js');
const request = require("../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: '',
        url: '',
        userId: '',
        commentArr: '',
        pageIndex: 1,
        pageSize: 10,
        searchLoading: true, //"上拉加载"的变量，默认false，隐藏
        searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
        isdiscombtn: false,
        catchtouchmove: false,
        commentimg: "/images/comment.png",
        themeidx: '',
        foruserid: '',
        replythemeid: '',
        forcomid: '',
        replyimgurl: "/images/comimg.png",
        replyvalue: '',
        uploadimgfile: '', //上传图片路径
        themeid: '',
        replayName: ''
    },
    getcommentList: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/notice/GetCommentList';
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
                    //判断themelist是否为空
                    if (res.data.result.themeCommentList == null || res.data.result.themeCommentList.length == 0) {
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
                        commentArr: res.data.result.themeCommentList
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
                setTimeout(function () {
                    wx.stopPullDownRefresh();
                }, 500)
            }
        })
    },
    //跳转详情
    detailimgTap: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/themedetails/themedetails?id=' + id + ''
        })
    },
    //点击评论icon弹出评论输入框
    commentTap: function (e) {
        console.log(e)
        var index = e.currentTarget.dataset.index;
        var isShow = e.currentTarget.dataset.com;
        var that = this;
        for (var i = 0; i < that.data.commentArr.length; i++) {
            if (isShow == false) {
                that.setData({
                    isdiscombtn: true,
                    catchtouchmove: true,
                    foruserid: e.currentTarget.dataset.foruserid,
                    replythemeid: e.currentTarget.dataset.themeid,
                    forcomid: e.currentTarget.dataset.forcomid,
                    themeindex: index,
                    replayName: e.currentTarget.dataset.name
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
        var isShow = that.data.isdiscombtn;
        var foruserid = that.data.foruserid;
        var themeid = that.data.replythemeid || that.data.themeid;
        var comtxt = that.data.replyvalue;
        var imgurl = that.data.uploadimgfile;
        var index = that.data.themeindex;
        var data;
        //评论没有图片时，参数不传
        if (imgurl == "") {
            data = {
                themeId: themeid,
                forUserId: foruserid,
                commentText: comtxt
            }
        }
        else {
            data = {
                themeId: themeid,
                forUserId: foruserid,
                commentText: comtxt,
                imageUrl: imgurl
            }
        }
        if (comtxt != "") {
            wx.request({
                url: that.data.url + "/api/services/app/themeAbout/AddComment",
                method: "post",
                data: {
                    themeId: themeid,
                    forUserId: foruserid,
                    commentText: comtxt,
                    imageUrl: imgurl
                },
                header: {
                    'Authorization': 'Bearer ' + that.data.token,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    console.log(res)
                    if (res.data.success == true) {
                        that.onLoad();
                    } else {
                        wx.showModal({
                            content: res.data.error.message,
                            showCancel: false,
                            confirmColor: "#077bfb",
                        })
                    }
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
            wx.showModal({
                content: '内容不能为空',
                confirmColor: "#077bfb",
                showCancel: false
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
            userId: wx.getStorageSync('_userid')
        })
        this.getcommentList();
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
        var pageidx = this.data.pageIndex;
        var that = this;
        pageidx++
        that.setData({
            searchLoading: false,
            pageIndex: pageidx
        })
        //上拉加载更多圈子主体详情列表
        wx.request({
            url: that.data.url + "/api/services/app/notice/GetCommentList",
            method: "post",
            data: {
                pageIndex: pageidx,
                pageSize: 10
            },
            header: {
                'Authorization': 'Bearer ' + that.data.token
            },
            success: function (res) {
                console.log(res)
                if (res.data.success == true) {
                    var arr = res.data.result.themeCommentList;
                    if (arr.length == 0) {
                        that.setData({
                            pageIndex: pageidx - 1
                        })
                    } else {
                        for (var i = 0; i < arr.length; i++) {
                            that.data.commentArr.push(arr[i]);
                        }
                        that.setData({
                            commentArr: that.data.commentArr
                        });
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
                    that.setData({
                        searchLoading: true
                    });
                }, 1000)
            }
        });
    },
})