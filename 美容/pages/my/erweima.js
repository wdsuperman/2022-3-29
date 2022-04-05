var app = getApp();
Page({
  data: {
    fxphoto: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let uid= wx.getStorageSync('uid')
    wx.request({
      url: app.d.ceshiUrl + 'Fenxiao/getwxaqrcode',
      method: 'post',
      data: {
        uid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        var status = res.data.status;
        if (status == 1) {
          var res = res.data;
          that.setData({
            fxphoto: res.fxphoto,
            'eqma': 'block'
          })

        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
    });

  },
  baocun: function () {
    wx.getImageInfo({
      src: this.data.fxphoto,
      success: function (sres) {
        console.log(sres.path);
        wx.saveImageToPhotosAlbum({
          filePath: sres.path,
          success: function (fres) {
            wx.showToast({
              title: '保存成功',
            })
          }
        })
      }
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

  /*** 用户点击右上角分享 */
  onShareAppMessage: function (e) {
    let userinfo = wx.getStorageSync('userInfo')
    var uid = wx.getStorageSync('uid')
    var title = '好友' + userinfo.nickName + '邀请您加入'
    return {
      title: title,
      imageUrl: 'http://meifa.rs1818.cn/Data/images/fenxiang.jpg',
      path: '/pages/index/index?oneuid=' + uid,
      success: function (res) {},
      fail: function (res) {}
    }
  },
})