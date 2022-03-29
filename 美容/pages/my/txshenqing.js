var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:app.d.img,

  },
  formSubmit: function (e) {
    var yhname = e.detail.value.yhname, yhtel = e.detail.value.yhtel, bank = e.detail.value.bank, yinhangka = e.detail.value.yinhangka, zhihang = e.detail.value.zhihang
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
   if(yhname==''){
     wx.showToast({
       title: '请填写姓名',
     })
     return false
   }else if (yhtel == '') {
      wx.showToast({
        title: '手机号不能为空',
      })
      return false
    }
    else if (yhtel.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(yhtel)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
   } else if (bank == '') {
     wx.showToast({
       title: '请输入银行名称',
       icon: 'succes',
       duration: 1000,
       mask: true
     })
     return false
   } else if (yinhangka == '') {
      wx.showToast({
        title: '请输入银行账号',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
     return false
   } else if (zhihang == '') {
     wx.showToast({
       title: '请输入支行名称',
       icon: 'succes',
       duration: 1000,
       mask: true
     })
     return false
   } else{ //提交
     var that = this;
     wx.request({
       url: app.d.ceshiUrl + '/Api/Fenxiao/bank',
       method: 'post',
       data: {
         uid: app.d.userId,
         yinhangka: yinhangka,
         yhname:yhname,
         yhtel:yhtel,
         bank:bank,
         zhihang: zhihang,
       },
       header: {
         'Content-Type': 'application/x-www-form-urlencoded'
       },
       success: function (res) {
         console.log(res)
         var status = res.data.status;
         if (status == 1) {
          wx.navigateTo({
            url: '../fenxiao/tx',
          })
         } else {
           wx.showToast({
             title: res.data.err,
             duration: 2000
           });
         }
       },
     });
     
       


    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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