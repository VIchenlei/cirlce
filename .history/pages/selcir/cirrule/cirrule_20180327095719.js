var types = ['default', 'primary', 'warn']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lampimg:"/images/lamp.png",
    firtxt:"包含低俗、色情、暴力引诱等",
    sentxt:"敏感/违禁内容的圈子",
    tretxt:"将会被停封的圈子和账号",
    agreeimg:"/images/agree.png",
    // noagreeimg:"/images/noagree.png"
    disabled:false,
    plain: false,
    loading: false,
    url:wx.getStorageSync('url'),
    pay:""
  },
  readimgTap:function(e){
    if(e.target.dataset.imgsrc=="/images/agree.png"){
      this.setData({
        agreeimg:"/images/noagree.png",
        disabled:true
      })
    }else
    if(e.target.dataset.imgsrc=="/images/noagree.png"){
      this.setData({
        agreeimg:"/images/agree.png",
        disabled:false

      })
    }
  },
  //跳转到用户协议
  agreementTap:function(){
    wx.navigateTo({
      url:"/pages/selcir/cirrule/agreement/agreement"
    })
  },
  //跳转下一步
  nextTap:function(e){
    if(this.data.pay=="false"){
      wx.navigateTo({
        url:"/pages/selcir/cirrule/payinfo/perfectinfo/perfectinfo?pay="+false+""
      })
    }else
    if(this.data.pay=="true"){
      wx.navigateTo({
        url:"/pages/selcir/cirrule/payinfo/payinfo"
      })
    }
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pay:options.pay
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