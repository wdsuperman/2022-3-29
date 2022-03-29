var app = getApp(); 
var is_submit=true;
const api = require('../../api.js')
Page({
    data: {
      info:[],
      oid:'',

    },
  
    pingjia(){ //评价
      wx.navigateTo({
        url: './pingjia?oid='+this.data.oid,
      })  
    },
    phone(){
      wx.makePhoneCall({
        phoneNumber: this.data.info.phone,
      })
    },
    agin(){
        wx.switchTab({
          url: '../index/xiadan',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.showLoading({
        title: '查询中',
      })
      console.log(options)
      var that = this;
      wx.request({
        url: app.d.hostUrl + '/Order/dateil',
        method: 'post',
        data: {
          oid: options.id,
          uid: app.d.userId,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideLoading()
          console.log(res)
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              info: res.data.info,
              oid: options.id,
            })
           
          } else {
            wx.showToast({
              title: res.data.err,
              icon: "none",
              duration: 2000
            });
          }

        },
        fail: function () {
          wx.hideLoading()
          wx.showToast({
            title: '网络异常！',
            icon: "none",
            duration: 2000
          });
        },

      });

    },
  quxiao() { //取消订单
    wx.showLoading({
      title: '取消中',
    })
 
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/Order/quxiao',
      method: 'post',
      data: {
        oid: that.data.oid,
        uid: app.d.userId,
        // order_type: that.data.isStatus,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        var status = res.data.status;
        if (status == 1) {
          wx.showToast({
            title: '取消成功',
            icon: "none",
            duration: 2000
          });
          var ins_st = 'info.status', ins_de = 'info.desc'
          that.setData({
            [ins_st]: 3,
            [ins_de]: '取消',
          })
        } else {
          wx.showToast({
            title: res.data.err,
            icon: "none",
            duration: 2000
          });
        }

      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常！',
          icon: "none",
          duration: 2000
        });
      },

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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      return {
        title: "这个小程序很方便呦。。。",
        path: 'pages/index/index',
        success: function (res) {
          console.log(res, "转发成功")
        },
        fail: function (res) {
          console.log(res, "转发失败")
        }
      }

    }
})