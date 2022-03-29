var app = getApp();
const log = require('../../log.js');
Page({
  data: {
    url: app.d.img
  },

  //获取用户的openid
  getUserProfile() {
    var that = this;
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      lang: 'zh_CN',
      success: (e) => {
        console.log(e)
        wx.setStorage({
          data: e.userInfo,
          key: 'userInfo',
        })
        if (e) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.login({
            success: res => {
              console.log(res)
              wx.request({
                //后台接口地址
                url: app.d.hostUrl + 'Login/getsessionkey',
                data: {
                  code: res.code,
                  iv: e.iv,
                  encryptedData: e.encryptedData,
                },
                method: 'post',
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  console.log(res)
                  var data = res.data;
                  app.data['NickName'] = e.userInfo.nickName;
                  app.data['HeadUrl'] = e.userInfo.avatarUrl;
                  app.data['gender'] = e.userInfo.gender;
                  app.data['SESSION_KEY'] = data.session_key;
                  app.data['OPEN_ID'] = data.openid;
                  that.onLoginUser();
                  wx.setStorage({
                    key: 'OPEN_ID',
                    data: data.openid,
                  })

                  wx.setStorage({
                    key: 'session_key',
                    data: data.session_key,
                  })
                }
              })
            }
          })
        } else {
          wx.showToast({
            title: "为了您更好的体验,请先同意授权",
            icon: 'none',
            duration: 2000
          });
        }
      }
    })

  },
  onLoginUser: function () {
    var that = this;
    wx.showLoading({
      title: '授权中',
    })
    var user = app.data;
    wx.request({
      url: app.d.hostUrl + 'Login/authlogin',
      method: 'post',
      data: {
        SessionId: user.SESSION_KEY,
        gender: user.gender,
        NickName: user.NickName,
        HeadUrl: user.HeadUrl,
        openid: user.OPEN_ID,
        tel: app.data.tel
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading()
        var data = res.data.arr;
        var status = res.data.status;
        if (status != 1) {
          wx.showToast({
            title: res.data.err,
            icon: 'none',
            duration: 3000
          });
          return false;
        }
        app.data['id'] = res.data.arr.ID;
        app.data.nickName = res.data.arr.NickName;
        app.data.avatarUrl = res.data.arr.HeadUrl;
        var userId = data.ID;
        var oneuid = app.d.oneuid
        if (!userId) {
          wx.showToast({
            title: '登录失败！',
            icon: 'none',
            duration: 3000
          });
          return false;
        } else {
          wx.showToast({
            title: '登录成功！',
            icon: 'none',
            duration: 3000
          });
          wx.setStorage({
            key: 'uid',
            data: res.data.arr.ID,
          })
          
        }
        app.d.userId = userId;
        that.tjone(); //把推荐人ID插入
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:authlogin',
          duration: 2000
        });
      },
    });
  },
  //推荐人id ,没有插入1
  tjone: function () {
    var that = this
    console.log(123)
    var oneuid = app.d.oneuid
    if (oneuid == '') {
      oneuid = 1
    }
    console.log(oneuid);
    wx.showLoading({
      title: '授权中',
    })
    wx.request({
      url: app.d.hostUrl + 'fenxiao/index',
      method: 'post',
      data: {
        oneuid: oneuid,
        uid: app.d.userId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading()
        wx.navigateBack({

        })
        // var tel = res.data.tel  
        // if(tel){
        //   wx.navigateBack({})
        //   wx.setStorage({
        //     key: 'tel',
        //     data: tel,
        //   })
        // }else{
        //   wx.redirectTo({
        //     url: '/pages/login/tel'
        //   })
        // } 
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },


});