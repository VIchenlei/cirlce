// pages/cirtitle/setcir/circlemember/circlemember.js
const request = require("../../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: "",
        circleId: "",
        userId: "",
        url: "",
        id: "", //用户ID
        emptytxt: "空空如也",
        emptyimg: "/images/empty.png",
        mangeListArr: [], //圈主、管理员
        blackListArr: [], //黑名单集合
        memmberListArr: [], //成员集合
        isload: false, //进入页面隐藏布局，数据加载完毕显示
        chooseSize: false, //是否显示遮罩层
        animationData: {},
        role: "",
        setmembers: "",
        setOffMangeTxt: "",
        mangeOrMember: "",
        idx: "",
        index: "",
        pageIndex: 1,
        pageSize: 1500,
        allowPrivateChat: '',
        inputShowed: false,
        inputVal: "",
        isempty:''
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
        this.getMemberList();
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    // 根据关键字搜索
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value,
            mangeListArr: [], //圈主、管理员
            blackListArr: [], //黑名单集合
            memmberListArr: [] //成员集合

        });
        this.getMemberList();
    },
    //设置管理员权限
    // setMangeAuthorityTap: function (e) {
    //     var idx = e.currentTarget.dataset.idx;
    //     // 用that取代this，防止不必要的情况发生
    //     var that = this;
    //     // 创建一个动画实例
    //     var animation = wx.createAnimation({
    //         // 动画持续时间
    //         duration: 500,
    //         // 定义动画效果，当前是匀速
    //         timingFunction: 'linear'
    //     })
    //     // 将该变量赋值给当前动画
    //     that.animation = animation
    //     // 先在y轴偏移，然后用step()完成一个动画
    //     animation.translateY(400).step()
    //     // 用setData改变当前动画
    //     that.setData({
    //         // 通过export()方法导出数据
    //         animationData: animation.export(),
    //         // 改变view里面的Wx：if
    //         chooseSize: true,
    //         setmembers: that.data.mangeListArr[idx],
    //         setOffMangeTxt: "取消管理员",
    //         mangeOrMember: e.currentTarget.dataset.role,
    //         id: e.currentTarget.dataset.id,
    //         idx: idx
    //     })
    //     console.log(this.setmembers)
    //     // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    //     setTimeout(function () {
    //         animation.translateY(0).step()
    //         that.setData({
    //             animationData: animation.export()
    //         })
    //     }, 400)
    // },
    //设置成员权限
    setAuthorityTap: function (e) {
        // 用that取代this，防止不必要的情况发生
        var that = this;
        var index = e.currentTarget.dataset.index;
        var idx = e.currentTarget.dataset.idx;
        var role = that.data.role;
        if (e.currentTarget.dataset.role == 3) {
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
                setmembers: that.data.memmberListArr[idx].members[index],
                setOffMangeTxt: "设为管理员",
                mangeOrMember: e.currentTarget.dataset.role,
                id: e.currentTarget.dataset.id,
                idx:idx
            })
            // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
            setTimeout(function () {
                animation.translateY(0).step()
                that.setData({
                    animationData: animation.export()
                })
            }, 400)
        } else if (e.currentTarget.dataset.role == 2) {
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
                setmembers: that.data.memmberListArr[idx].members[index],
                setOffMangeTxt: "取消管理员",
                mangeOrMember: e.currentTarget.dataset.role,
                id: e.currentTarget.dataset.id
            })
            // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
            setTimeout(function () {
                animation.translateY(0).step()
                that.setData({
                    animationData: animation.export()
                })
            }, 400)
        }


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

        })
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export(),
                chooseSize: false
            })
        }, 400)
    },
    //圈主设置取消管理员
    SetAdminTap: function (e) {
        var that = this;
        var role = e.currentTarget.dataset.role;
        if (role == 3) {
            //圈主设置成员为管理员
            wx.request({
                url: that.data.url + "/api/services/app/circle/SetAdmin",
                method: "post",
                data: {
                    circleId: that.data.circleId,
                    userId: that.data.id,
                    role: 2
                },
                header: {
                    'Authorization': 'Bearer ' + that.data.token,
                    "Content-Type": "application/json"
                },
                success: function (res) {
                    if (res.data.success == true) {
                        wx.showLoading({
                            title: '加载中',
                        });
                        wx.request({
                            url: that.data.url + '/api/services/app/circle/GetMemberList',
                            data: {
                                circleId: that.data.circleId,
                                pageIndex: that.data.pageIndex,
                                pageSize: that.data.pageSize
                            },
                            method: "post",
                            header: {
                                'Authorization': 'Bearer ' + that.data.token
                            },
                            success: function (res) {
                                that.setData({
                                    memmberListArr: res.data.result.memberList,
                                    role: res.data.result.role,
                                    chooseSize: false
                                })

                            },
                            fail: function () {
                                wx.showToast({
                                    title: '服务器异常！',
                                    icon: 'none',
                                    duration: 2000
                                })
                            },
                            complete: function () {
                                setTimeout(function () {
                                    wx.hideLoading();
                                }, 500);
                                that.setData({
                                    isload: true
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
        } else if (role == 2) {
            //圈主取消管理员
            wx.request({
                url: that.data.url + "/api/services/app/circle/SetAdmin",
                method: "post",
                data: {
                    circleId: that.data.circleId,
                    userId: that.data.id,
                    role: 3
                },
                header: {
                    'Authorization': 'Bearer ' + that.data.token,
                    "Content-Type": "application/json"
                },
                success: function (res) {

                    if (res.data.success == true) {
                        wx.showLoading({
                            title: '加载中',
                        });
                        wx.request({
                            url: that.data.url + '/api/services/app/circle/GetMemberList',
                            data: {
                                circleId: that.data.circleId,
                                pageIndex: that.data.pageIndex,
                                pageSize: that.data.pageSize
                            },
                            method: "post",
                            header: {
                                'Authorization': 'Bearer ' + that.data.token
                            },
                            success: function (res) {
                                that.setData({
                                    memmberListArr: res.data.result.memberList,
                                    role: res.data.result.role,
                                    chooseSize: false
                                })

                            },
                            fail: function () {
                                wx.showToast({
                                    title: '服务器异常！',
                                    icon: 'none',
                                    duration: 2000
                                })
                            },
                            complete: function () {
                                setTimeout(function () {
                                    wx.hideLoading();
                                }, 500);
                                that.setData({
                                    isload: true
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
    },
    //移出圈子
    removeMemberTap: function (e) {
        var that = this;
        var role = e.currentTarget.dataset.role;
        var id = e.currentTarget.dataset.id;
        var idx = e.currentTarget.dataset.idx;
        console.log(idx)
        if (role == 3) {
            //移出成员
            wx.request({
                url: that.data.url + '/api/services/app/circle/RemoveMember',
                method: 'delete',
                data: {
                    circleId: that.data.circleId,
                    userId: id,
                    isBlack: false
                },
                header: {
                    'Authorization': 'Bearer ' + that.data.token,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    if (res.data.success == true) {
                        wx.showLoading({
                            title: '加载中',
                        });
                        wx.request({
                            url: that.data.url + '/api/services/app/circle/GetMemberList',
                            data: {
                                circleId: that.data.circleId,
                                pageIndex: that.data.pageIndex,
                                pageSize: that.data.pageSize
                            },
                            method: "post",
                            header: {
                                'Authorization': 'Bearer ' + that.data.token
                            },
                            success: function (res) {
                                that.setData({
                                    memmberListArr: res.data.result.memberList,
                                    role: res.data.result.role,
                                    chooseSize: false
                                })

                            },
                            fail: function () {
                                wx.showToast({
                                    title: '服务器异常！',
                                    icon: 'none',
                                    duration: 2000
                                })
                            },
                            complete: function () {
                                setTimeout(function () {
                                    wx.hideLoading();
                                }, 500);
                                that.setData({
                                    isload: true
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
        } else if (role == 2) {
            //移出管理员
            wx.request({
                url: that.data.url + '/api/services/app/circle/RemoveMember',
                method: 'delete',
                data: {
                    circleId: that.data.circleId,
                    userId: id,
                    isBlack: false
                },
                header: {
                    'Authorization': 'Bearer ' + that.data.token,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    if (res.data.success == true) {
                        wx.showLoading({
                            title: '加载中',
                        });
                        wx.request({
                            url: that.data.url + '/api/services/app/circle/GetMemberList',
                            data: {
                                circleId: that.data.circleId,
                                pageIndex: that.data.pageIndex,
                                pageSize: that.data.pageSize
                            },
                            method: "post",
                            header: {
                                'Authorization': 'Bearer ' + that.data.token
                            },
                            success: function (res) {
                                that.setData({
                                    memmberListArr: res.data.result.memberList,
                                    role: res.data.result.role,
                                    chooseSize: false
                                })

                            },
                            fail: function () {
                                wx.showToast({
                                    title: '服务器异常！',
                                    icon: 'none',
                                    duration: 2000
                                })
                            },
                            complete: function () {
                                setTimeout(function () {
                                    wx.hideLoading();
                                }, 500);
                                that.setData({
                                    isload: true
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

    },
    //移出圈子并加入黑名单
    removeMemberIsBackTap: function (e) {

        var that = this;
        var role = e.currentTarget.dataset.role;
        var id = e.currentTarget.dataset.id;
        var idx = e.currentTarget.dataset.idx;
        console.log(idx)
        if (role = 3) {
            //移出成员
            wx.request({
                url: that.data.url + '/api/services/app/circle/RemoveMember',
                method: 'delete',
                data: {
                    circleId: that.data.circleId,
                    userId: id,
                    isBlack: true
                },
                header: {
                    'Authorization': 'Bearer ' + that.data.token,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    if (res.data.success == true) {
                        wx.showLoading({
                            title: '加载中',
                        });
                        wx.request({
                            url: that.data.url + '/api/services/app/circle/GetMemberList',
                            data: {
                                circleId: that.data.circleId,
                                pageIndex: that.data.pageIndex,
                                pageSize: that.data.pageSize
                            },
                            method: "post",
                            header: {
                                'Authorization': 'Bearer ' + that.data.token
                            },
                            success: function (res) {
                                that.setData({
                                    memmberListArr: res.data.result.memberList,
                                    role: res.data.result.role,
                                    chooseSize: false
                                })

                            },
                            fail: function () {
                                wx.showToast({
                                    title: '服务器异常！',
                                    icon: 'none',
                                    duration: 2000
                                })
                            },
                            complete: function () {
                                setTimeout(function () {
                                    wx.hideLoading();
                                }, 500);
                                that.setData({
                                    isload: true
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
        } else if (role == 2) {
            //移出管理员
            wx.request({
                url: that.data.url + '/api/services/app/circle/RemoveMember',
                method: 'delete',
                data: {
                    circleId: that.data.circleId,
                    userId: id,
                    isBlack: true
                },
                header: {
                    'Authorization': 'Bearer ' + that.data.token,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    if (res.data.success == true) {
                        wx.showLoading({
                            title: '加载中',
                        });
                        wx.request({
                            url: that.data.url + '/api/services/app/circle/GetMemberList',
                            data: {
                                circleId: that.data.circleId,
                                pageIndex: that.data.pageIndex,
                                pageSize: that.data.pageSize
                            },
                            method: "post",
                            header: {
                                'Authorization': 'Bearer ' + that.data.token
                            },
                            success: function (res) {
                                that.setData({
                                    memmberListArr: res.data.result.memberList,
                                    role: res.data.result.role,
                                    chooseSize: false
                                })

                            },
                            fail: function () {
                                wx.showToast({
                                    title: '服务器异常！',
                                    icon: 'none',
                                    duration: 2000
                                })
                            },
                            complete: function () {
                                setTimeout(function () {
                                    wx.hideLoading();
                                }, 500);
                                that.setData({
                                    isload: true
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
    },
    //跳转到黑名单页面
    blackListTap: function (e) {
        var that = this;
        wx.navigateTo({
            url: '/pages/cirtitle/setcir/circlemember/blacklist/blacklist?circleId=' + that.data.circleId + ''
        })
    },
    //跳转个人中心
    personTap: function (e) {
        var userId = e.currentTarget.dataset.userid;
        var circleId = this.data.circleId;
        wx.navigateTo({
            url: '/pages/personalSpace/personalSpace?userId=' + userId + '&circleId=' + circleId + ''
        })
    },
    getMemberList: function () {
        var that = this;
        var circleId = that.data.circleId;
        var pageIndex = that.data.pageIndex;
        var pageSize = that.data.pageSize;
        var url = that.data.url + '/api/services/app/circle/GetMemberList';
        var data;
        if (that.data.inputVal == '') {
            data = {
                circleId: circleId,
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        } else {
            data = {
                circleId: circleId,
                keyword: that.data.inputVal,
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        }
        var header = {
            'Authorization': 'Bearer ' + that.data.token
        };
        request.POST({
            url: url,
            data: data,
            header: header,
            success: function (res) {
                if (res.data.success == true) {

                    if (res.data.result.memberList.length==0) {
                        that.setData({
                            isempty:true
                        })
                    }else{
                        that.setData({
                            memmberListArr: res.data.result.memberList,
                            role: res.data.result.role,
                            isload: true,
                            isempty: false
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
                wx.showToast({
                    title: '服务器异常！',
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
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url'),
            userId: wx.getStorageSync('_userid'),
            allowPrivateChat: options.allowPrivateChat
        })
        var that = this;
        this.setData({
            circleId: Number(options.circleid)
        })
        that.getMemberList();
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