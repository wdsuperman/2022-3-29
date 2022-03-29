// // pages/my/ysjb.js
// Page({

//     /**
//      * 页面的初始数据
//      */
//     data: {
//         list:[
//             {
//                 title:'标题',
//                 time:'10:11',
//                 amount:'+160.00'
//             },
//             {
//                 title:'标题',
//                 time:'10:11',
//                 amount:'+160.00'
//             },
//             { 
//                 title:'标题',
//                 time:'10:11',
//                 amount:'+160.00'
//             },
//             {
//                 title:'标题',
//                 time:'10:11',
//                 amount:'+160.00'
//             },
//         ]
//     },

//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad: function (options) {

//     },

//     /**
//      * 生命周期函数--监听页面初次渲染完成
//      */
//     onReady: function () {

//     },

//     /**
//      * 生命周期函数--监听页面显示
//      */
//     onShow: function () {

//     },

//     /**
//      * 生命周期函数--监听页面隐藏
//      */
//     onHide: function () {

//     },

//     /**
//      * 生命周期函数--监听页面卸载
//      */
//     onUnload: function () {

//     },

//     /**
//      * 页面相关事件处理函数--监听用户下拉动作
//      */
//     onPullDownRefresh: function () {

//     },

//     /**
//      * 页面上拉触底事件的处理函数
//      */
//     onReachBottom: function () {

//     },

//     /**
//      * 用户点击右上角分享
//      */
//     onShareAppMessage: function () {

//     }
// })
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'',
    user_fx:'',
    page: '2',
    windowHeight:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 高度,宽度 单位为px
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    wx.request({
      url: app.d.ceshiUrl + 'Fenxiao/yongjin',
      method: 'post',
      data: {
        uid: app.d.userId,
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
            user: res.user ,
            user_fx: res.user_fx,
          })
        } else {
          wx.showToast({
            title: '网络问题',
            duration: 2000
          });
        }
      },
    });
  },
  bindDownLoad: function () {
    wx.showToast({
      title: '正在加载',
      icon:'loading',
      duration: 2000
    });
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + 'Fenxiao/yongjin_more',
      method: 'post',
      data: {
        uid: app.d.userId,
        page: that.data.page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var user_fx = res.data.user_fx;
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            user_fx: that.data.user_fx.concat(user_fx),
            page: that.data.page + 1,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

  
})