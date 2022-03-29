
var app=getApp();
Page({
  data: {
    url:app.d.img,
    huiyuankayue:'',
    recharge:'',
    pid:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({//获取余额明细
      url: app.d.ceshiUrl + 'user/huiyuanyuechongzhi',
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
          that.setData({
            recharge: res.data.recharge,
            huiyuankayue: res.data.huiyuankayue,
          })
        }
      },
    });

  },
  hbid: function (e) {
    var pid = e.currentTarget.dataset.id
    this.setData({
      pid: pid

    })
  },
  
  //会员购买
  yuepay: function (e) {
    var that = this
    var pid = that.data.pid
    if (!pid){
      wx.showToast({
        title: '请选择购买类型',
        duration: 2000
      });
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + 'Payment/payyue',
      method: 'post',
      data: {
        uid: app.d.userId,
        pid: that.data.pid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        var status = res.data.status;
        if (status == 1) {
          that.wxpay(res.data.arr);
        } else {
          wx.showToast({
            title: '下单失败',
            duration: 2000
          });
        }
      },
    });
  },

  //调起微信支付
  wxpay: function (order) {
    wx.showToast({
      title: '请稍等',
      duration: 3000
    })
    wx.request({
      url: app.d.ceshiUrl + 'Wxpay/wxpay',
      data: {
        order_id: order.order_id,
        order_sn: order.order_sn,
        uid: this.data.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          console.log("123");
          console.log(order);
          var appid = order.appId
          if (!appid) {
            wx.showToast({
              title: '支付失败',
              duration: 3000
            })
          }
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan',
                });
              }, 2500);
            },
            fail: function (res) {
              wx.showToast({
                title: '支付失败',
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: '支付失败',
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！err:wxpay',
          duration: 2000
        });
      }
    })
  },

})