// pages/user/helpfeedback/helpfeedback.js
const uploadImage = require('../../../utils/UploadAliyun.js');
const request = require("../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        uploadimgfile: [],//上传图片路径
        uploadimgarr: [],
        viewImgArr: [],
        token: '',
        url: '',
        num:0,//文字初始个数
        txtVlaue:''
    },
    //获取文本框value
    textInput:function(e){
        var that=this;
        var txtVlaue=e.detail.value;
        that.setData({
            num: txtVlaue.length,
            txtVlaue: txtVlaue.length
        })
    },
    //上传图片
    uploadimgTap: function () {
        var that = this;
        var pice = that.data.uploadimgarr;
        wx.chooseImage({
            count: 3 - pice.length, // 默认9
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
    //上传图片
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
    //提交意见反馈
    submit:function(){
        var that=this;
        var imgurl = that.data.uploadimgfile;
        var txtVlaue=that.data.txtVlaue;
        var data;
        //反馈没有图片时，参数不传
        if (imgurl == "") {
            data = {
                content: txtVlaue
            }
        } else {
            data = {
                content: txtVlaue,
                imageList: imgurl
            }
        }
        var url = that.data.url + '/api/services/app/Feedback/InsertAsync';
        var header = {
            'Authorization': 'Bearer ' + that.data.token
        };
        if (txtVlaue){
            request.POST({
                url: url,
                data: data,
                header: header,
                success: function (res) {
                    console.log(res);
                    if (res.data.success == true) {
                        wx.showToast({
                            title: '提交成功',
                            icon: 'none',
                            duration: 2000,
                            success: function () {
                                wx.navigateBack({
                                    delta: 1
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
                },
                fail: function () {

                },
                complete: function () { }
            })
        }else{
            wx.showToast({
                title: '描述内容不能为空',
                icon: 'none',
                duration: 2000
            })
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this;
        that.setData({
            token: wx.getStorageSync('_token'),
            url: wx.getStorageSync('url')
        });
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