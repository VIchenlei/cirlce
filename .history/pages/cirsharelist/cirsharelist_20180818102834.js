// pages/cirsharelist/cirsharelist.js
const request = require("../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        circleId: '',
        token: '',
        url: '',
        userId: '',
        circleInfo: '',
        paySetInfo: '',
        payimg: "/images/pay.png",
        collectimg: "/images/collect.png",
        ispraiseimg: "/images/collect-sel.png",
        commentimg: "/images/comment.png",
        emptyimg: "/images/empty.png",
        emptytxt: "空空如也",
        collectshow: "/images/bluestar.png",
        themeisn: "none",
        themeisb: "none",
        themearr: [],
        pageIndex: 1,
        lazyload: true,
        isSownCont: false, //加载完成之前隐藏页面
        disabled: '',
        btnTxt: '申请加入',
        joinMode: '',
        inviteUserId: '',
        userState: '',
        chooseSize: '',
        catchtouchmove: false,
        tollList: [] //包月  季度等
    },
    getThemeList: function () {
        var that = this;
        //加载动态
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var url = that.data.url + '/api/services/app/theme/GetGuestView';
        var data = {
            circleId: that.data.circleId
        };
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
                        circleInfo: res.data.result.circleInfo,
                        paySetInfo: res.data.result.paySetInfo,
                        isSownCont: true,
                        joinMode: res.data.result.joinMode,
                        userState: res.data.result.userState
                    });
                    wx.setNavigationBarTitle({
                        title: res.data.result.circleInfo.name
                    });
                    var userState = res.data.result.userState;
                    if (userState == 2) {
                        wx.navigateTo({
                            url: '/pages/cirtitle/cirtitle?id=' + that.data.circleId + ''
                        })
                        wx.showToast({
                            title: '已在该圈子内',
                            icon: 'none',
                            duration: 2000
                        })
                    } else if (userState == 0) {

                    } else if (userState == 1) {
                        that.setData({
                            disabled: true,
                            btnTxt: '等待审核'
                        })
                        wx.showModal({
                            content: '您的申请已提交成功，等待管理员审核',
                            confirmColor: "#077bfb",
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    wx.switchTab({
                                        url: '/pages/index/index',
                                        success: function (e) {
                                            var page = getCurrentPages().pop();
                                            if (page == undefined || page == null) return;
                                            page.onLoad();
                                        }
                                    })
                                }
                            }
                        })
                    } else if (userState == -1) {
                        that.setData({
                            disabled: true
                        })
                        wx.showModal({
                            content: '您已被加入该圈子黑名单列表中，暂时无法加入该圈子',
                            confirmColor: "#077bfb",
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    wx.switchTab({
                                        url: '/pages/index/index',
                                        success: function (e) {
                                            var page = getCurrentPages().pop();
                                            if (page == undefined || page == null) return;
                                            page.onLoad();
                                        }
                                    })
                                }
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
            },
            fail: function () {

            },
            complete: function () {
                wx.hideLoading();
            }
        })
    },
    //点击弹出申请加入圈子
    alertTap: function () {
        var that = this;
        wx.showToast({
            title: '请先加入圈子',
            icon: 'none',
            duration: 2000
        });
    },
    //申请加入免费
    InviteFun: function () {
        var that = this;
        var url = that.data.url + '/api/services/app/circle/Invite';
        var data = {
            circleId:that.data.circleId,
            userId: that.data.inviteUserId
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
                if (res.data.success == true) {
                    var type = res.data.result.state;
                    if (res.data.result.state == 1) {
                        that.setData({
                            disabled: true,
                            btnTxt: '等待审核'
                        })
                        wx.showModal({
                            content: '您的申请已提交成功，等待管理员审核',
                            confirmColor: "#077bfb",
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    wx.switchTab({
                                        url: '/pages/index/index',
                                        success: function (e) {
                                            var page = getCurrentPages().pop();
                                            if (page == undefined || page == null) return;
                                            page.onLoad();
                                        }
                                    })
                                }
                            }
                        })
                    } else if (res.data.result.state == 2) {
                        wx.navigateTo({
                            url: '/pages/cirtitle/cirtitle?id=' + that.data.circleId + ''
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
    //点击弹出弹出窗
    showModal: function (e) {
        // 用that取代this，防止不必要的情况发生
        var that = this;
        // 创建一个动画实例
        var animation = wx.createAnimation({
            // 动画持续时间
            duration: 500,
            // 定义动画效果，当前是匀速
            timingFunction: 'linear'
        })
        // 将该变量赋值给当前动画
        that.animation = animation
        // 先在y轴偏移，然后用step()完成一个动画
        animation.translateY(400).step()
        // 用setData改变当前动画
        that.setData({
            // 通过export()方法导出数据
            animationData: animation.export(),
            // 改变view里面的Wx：if
            chooseSize: true,
            catchtouchmove: true,
        })
        // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export()
            })
        }, 400)
    },
    //取消关闭设置权限弹出窗
    hideModal: function (e) {
        var that = this;
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(400).step()
        that.setData({
            animationData: animation.export()
        });
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export(),
                chooseSize: false,
                catchtouchmove: false,
                tollList: []
            })
        }, 400)
    },
    //申请加入付费
    InvitePayFun: function () {
        var that = this;
        that.showModal();
        var paySetInfo = that.data.paySetInfo;
        var tollList = that.data.tollList;
        if (paySetInfo.setMonthPay == true) {
            tollList.push({
                tollName: '包月',
                tollNum: that.formatFloat(paySetInfo.monthPay),
                type: 5
            })
        }
        if (paySetInfo.setQuarterlyPay == true) {
            tollList.push({
                tollName: '季度',
                tollNum: that.formatFloat(paySetInfo.quarterlyPay),
                type: 6
            })
        }
        if (paySetInfo.setHalfYearPay == true) {
            tollList.push({
                tollName: '半年',
                tollNum: that.formatFloat(paySetInfo.halfYearPay),
                type: 7
            })
        }
        if (paySetInfo.setYearPay == true) {
            tollList.push({
                tollName: '一年',
                tollNum: that.formatFloat(paySetInfo.yearPay),
                type: 8
            })
        }
        if (paySetInfo.setForeverPay == true) {
            tollList.push({
                tollName: '永久',
                tollNum: that.formatFloat(paySetInfo.foreverPay),
                type: 9
            })
        }

        that.setData({
            tollList: tollList
        })

    },
    //判断加入是付费还是免费
    surebtn: function () {
        if (this.data.joinMode == 0) {
            this.InviteFun();
        } else if (this.data.joinMode == 1) {
            this.InvitePayFun();
        }
    },
    // 保留2位小数，不足补0
    formatFloat: function (x) {
        var f = Number(x);
        if (isNaN(f))
            return false;
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 1) {
            s += '0';
        }
        return s;
    },
    //付费加入圈子
    payJoinTap: function (e) {
        console.log(e)
        var that = this;
        var joinAudit = that.data.circleInfo.joinAudit;
        var type = e.currentTarget.dataset.type;
        var tollNum = e.currentTarget.dataset.tollnum;
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
                            payType: type,
                            circleId: that.data.circleId,
                            payMethod: 0,
                            payMoney: tollNum,
                            openId: openId,
                            inviteUserId:that.data.inviteUserId,
                            isFollowPay: false
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
                                                    catchtouchmove: false,
                                                    tollList: [],
                                                    chooseSize: false
                                                })
                                                if (joinAudit) {
                                                    that.setData({
                                                        disabled: true,
                                                        btnTxt: '等待审核'
                                                    })
                                                } else {
                                                    wx.showToast({
                                                        title: '加入成功',
                                                        icon: 'none',
                                                        success: function () {
                                                            wx.navigateTo({
                                                                url: '/pages/cirtitle/cirtitle?id=' + that.data.circleId + ''
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        },
                                        'fail': function (res) {
                                            wx.showToast({
                                                title: '取消支付',
                                                icon: 'none',
                                                duration: 2000
                                            })
                                            that.setData({
                                                catchtouchmove: false,
                                                tollList: [],
                                                chooseSize: false
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
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        //获取邀请人的ID 和要加入圈子的ID
        // var qr = options.qr.replace("{", '').replace("}", '');
        // qr = qr.split(',');
        // var qruseridnum = qr[0].split(':')[1];
        // var qrciridnum = qr[1].split(':')[1];
        // var qrcode={
        //     userid: qruseridnum,
        //     cirid: qrciridnum
        // };
        // console.log(qrcode)
        var that = this;
        var token = wx.getStorageSync('_token');
        if (token == "") {
            var inviteUserId = qrcode.userid;
            var circleId = qrcode.cirid;
            var id;
            wx.navigateTo({
                url: '/pages/index/givephonenum/givephonenum?inviteUserId=' + inviteUserId + '&circleId=' + circleId+'&id=1011',
            })
        }else{
            that.setData({
                token: wx.getStorageSync('_token'),
                url: wx.getStorageSync('url'),
                userId: wx.getStorageSync('_userid'),
                circleId: 4,
                inviteUserId: 4
            })
            that.getThemeList();
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
    onUnload: function (options) {

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