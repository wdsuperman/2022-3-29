var app = getApp();
Page({
  data: {
    url: app.d.img,
    numbers: '',
    url_type: ','
  },
  onLoad: function (options) {
  },
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请授权，这样可以更好的为您服务',
        success: function (res) {
          if (res.cancel) {
            wx.switchTab({
              url: '../index/index',
            })
          } else {
            //点击确定
            wx.redirectTo({
              url: '../login/index',
            })
          }
        }
      })
    } else {
      var that = this;
      that.log()
      wx.checkSession({
        success() {
          console.log(' session_key 未过期，并且在本生命周期一直有效')
          // session_key 未过期，并且在本生命周期一直有效
        },
        fail() {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '您的信息已过期，需要重新执行登录流程',
            success: function (res) {
              if (res.cancel) {
                wx.switchTab({
                  url: '../index/index',
                })
              } else {
                //点击确定
                wx.redirectTo({
                  url: '../login/index',
                })
              }
            }
          })
          console.log('session_key 已经失效，需要重新执行登录流程')

        }
      })
      wx.login({
        success: function (res) {
          if (res.code) {
            var session_key = wx.getStorageSync('session_key')
            console.log(session_key)
           // var session_key = app.data.session_key
            wx.request({
              url: app.d.ceshiUrl + '/Api/Login/getphone',
              data: {
                session_key: session_key, //全局变量中的 sessionKey
                encryptedData: e.detail.encryptedData,  //包括敏感数据在内的完整用户信息的加密数据
                iv: e.detail.iv
              },
              method: 'post',
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log(res)
                wx.setStorage({
                  key: 'tel',
                  data: res.data.phoneNumber,
                })
                that.setData({
                  numbers: res.data.phoneNumber,
                })
                that.phone()
              }

            })
          }
        }
      })
    }
  },
  phone: function () {
    var that = this
    wx.request({
      url: app.d.ceshiUrl + '/Api/Login/tel',
      data: {
        tel: that.data.numbers,
        uid: app.d.userId,
      },
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.index()
      }
    })
  },
  log: function () {
    wx.showToast({
      title: '请稍等',
      duration: 2000
    });
  },
  index: function () {
    wx.navigateBack({})
  
  },
})