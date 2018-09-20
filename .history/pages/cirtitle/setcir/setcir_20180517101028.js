const uploadImage = require('../../../utils/UploadAliyun.js');
const request = require("../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        themeimg: "/images/head.jpg",
        setcirtitle: "来场音乐会",
        membernum: "2",
        themenum: "3",
        createtime: "2018-01-19",
        briefcont: "来玩吧",
        disabled: false,
        plain: false,
        loading: false,
        qrimg: "/images/qrcode.png",
        headimg: "/images/defaulthead.png",
        head: '',
        lfimg: "/images/lf-icon.png",
        username: "用户名",
        signaturenum: "11",
        cirmembernum: "2",
        token: "",
        url: "",
        id: "", //圈子id
        cirinfo: {}, //圈子信息
        isedit: false, //判断是否显示编辑资料
        ismember: false, //判断是否显示成员编辑资料
        isInvitation: false, //判断是否显示邀请榜
        isEntrymode: false, //判断是否显示加入方式
        isexamine: false, //判断是否显示审核
        isJurisdiction: false, //判断是否显示权限
        myNickName: "",
        mySign: "",
        editInfo: "",
        name: "",
        intro: "",
        coverimg: "",
        uploadimgfile: '',
        role: '',
        joinAudit: '',
        joinMode: '',
        isLoad: false
    },
    switchChange: function (e) {

    },
    changePayMethod: function (e) {
        var circleId = e.currentTarget.dataset.circleid;
        wx.navigateTo({
            url: '/pages/cirtitle/setcir/payMethod/payMethod?circleId=' + circleId + ''
        })
    },
    signoutcirTap: function () {
        var that = this;
        if (that.data.joinMode == '免费') {
            var contnet = '退出圈子后，你发布的内容仍然会在圈子中显示，除非你将其删除';
        } else {
            var contnet = '退出圈子后，再次加入圈子需要重新付费，确定要继续退出吗？';
        }
        wx.showModal({
            title: '确定要退出该圈子？',
            content: contnet,
            cancelText: '留下',
            confirmText: '退出',
            success: function (res) {
                if (res.confirm) {
                    var url = that.data.url + '/api/services/app/circle/QuitCircle?circleId=' + that.data.id + '';
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
                                wx.switchTab({
                                    url: '/pages/index/index',
                                    success: function (e) {
                                        var page = getCurrentPages().pop();
                                        if (page == undefined || page == null) return;
                                        page.onLoad();
                                    }
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


                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    share: function () {
        console.log('分享')
    },
    //跳转修改昵称界面
    modifynameTap: function () {

        var name = this.data.myNickName;
        console.log(name)
        var ciruserid = this.data.cirinfo.circleUserId;
        wx.navigateTo({
            url: '/pages/cirtitle/setcir/modifyname/modifyname?name=' + name + '&ciruserid=' + ciruserid + ''
        })
    },
    //跳转修改签名界面
    modifysignTap: function () {
        var sign = this.data.mySign;
        var ciruserid = this.data.cirinfo.circleUserId;
        console.log(this.data.cirinfo)
        wx.navigateTo({
            url: '/pages/cirtitle/setcir/modifysign/modifysign?name=' + sign + '&ciruserid=' + ciruserid + ''
        })
    },
    //跳转编辑资料页面
    editInfoTap: function (e) {
        var that = this;
        var name = that.data.name;
        var coverimg = that.data.coverimg;
        var intro = that.data.intro;
        var joinAudit = that.data.joinAudit;
        var editInfo = 1;
        var circleid = that.data.cirinfo.id;
        wx.navigateTo({
            url: '/pages/cirtitle/setcir/modifyinfo/modifyinfo?name=' + name + '&coverimg=' + coverimg + '&intro=' + intro + '&joinAudit=' + joinAudit + '&editInfo=' + editInfo + '&circleid=' + circleid + ''
        })
    },
    //跳转圈子成员页面
    memberTap: function () {
        var that = this;
        var circleid = that.data.cirinfo.id;
        var allowPrivateChat = that.data.cirinfo.allowPrivateChat;
        wx.navigateTo({
            url: '/pages/cirtitle/setcir/circlemember/circlemember?circleid=' + circleid + '&allowPrivateChat=' + allowPrivateChat + ''
        })
    },
    //修改本圈子头像
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
                wx.request({
                    url: that.data.url + '/api/services/app/circle/EditCircleMyAvatar',
                    data: {
                        avatarUrl: 'https://media.bjser.com' + '/User/Images/' + filePath.replace('wxfile://', ''),
                        circleUserId: e.currentTarget.dataset.userid
                    },
                    method: 'post',
                    header: {
                        'Authorization': 'Bearer ' + that.data.token
                    },
                    success: function (res) {
                        console.log(res)
                        if (res.data.success == true) {
                            uploadImage(filePath, "User/Images/",
                                function (res) {
                                    wx.showToast({
                                        title: '上传成功',
                                        icon: 'none'
                                    })
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
    //跳转邀请榜页面
    inviteTap: function (e) {
        var that = this;
        var circleid = that.data.cirinfo.id;
        wx.navigateTo({
            url: '/pages/cirtitle/setcir/invite/invite?circleid=' + circleid + ''
        })
    },
    //跳转成员加入审核页面
    joinAuditTap: function (e) {
        var that = this;
        var circleid = that.data.cirinfo.id;
        wx.navigateTo({
            url: '/pages/cirtitle/setcir/joinAudit/joinAudit?circleid=' + circleid + ''
        })
    },
    // joinModeTap:function(e){
    //   var that=this;
    //   var circleid=that.data.cirinfo.id;
    //   wx.navigateTo({
    //     url:'/pages/cirtitle/setcir/joinMode/joinMode?circleid='+circleid+''
    //   })
    // },
    //跳转圈主修改权限页面
    masterSATap: function (e) {
        var that = this;
        var circleid = that.data.cirinfo.id;
        var role = that.data.role;
        wx.navigateTo({
            url: '/pages/cirtitle/setcir/masterSA/masterSA?circleid=' + circleid + '&role=' + role + ''
        })
    },
    getSetcir: function () {
        var that = this;
        //获取圈子信息           
        wx.request({
            url: that.data.url + "/api/services/app/circle/GetCircleInfo?circleId=" + that.data.id + "",
            header: {
                'Authorization': 'Bearer ' + that.data.token
            },
            success: function (res) {
                that.setData({
                    cirinfo: res.data.result,
                    myNickName: res.data.result.myNickName,
                    mySign: res.data.result.mySign,
                    name: res.data.result.name,
                    intro: res.data.result.intro,
                    coverimg: res.data.result.coverPicture,
                    head: res.data.result.myAvatarUrl,
                    role: res.data.result.role,
                    joinAudit: res.data.result.joinAudit,
                    joinMode: res.data.result.joinMode,
                    isLoad: true
                })
                //判断圈主、管理员、成员
                if (that.data.cirinfo.role == 1) {
                    that.setData({
                        isedit: true, //判断是否显示编辑资料
                        ismember: true, //判断是否显示成员编辑资料
                        isInvitation: true, //判断是否显示邀请榜
                        isEntrymode: true, //判断是否显示加入方式
                        isexamine: true, //判断是否显示审核
                        isJurisdiction: true //判断是否显示权限
                    })
                } else if (that.data.cirinfo.role == 2) {
                    that.setData({
                        isedit: false, //判断是否显示编辑资料
                        ismember: res.data.result.openMemberList, //判断是否显示成员编辑资料
                        isInvitation: res.data.result.openInviteList, //判断是否显示邀请榜
                        isEntrymode: false, //判断是否显示加入方式
                        isexamine: true, //判断是否显示审核
                        isJurisdiction: true //判断是否显示权限
                    })
                } else if (that.data.cirinfo.role == 3) {
                    that.setData({
                        isedit: false, //判断是否显示编辑资料
                        ismember: res.data.result.openMemberList, //判断是否显示成员编辑资料
                        isInvitation: res.data.result.openInviteList, //判断是否显示邀请榜
                        isEntrymode: false, //判断是否显示加入方式
                        isexamine: false, //判断是否显示审核
                        isJurisdiction: false //判断是否显示权限
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
                wx.hideLoading();
                wx.hideToast();
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url'),
            id: options.id
        })
        //加载动态
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        this.getSetcir();
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
    onShareAppMessage: function (res) {
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