var app = getApp();
const log = require('../../log.js');
const api = require('../../api.js')
Page({
  data: {
    url: app.d.img,
    info:[],
  },

   //获取用户的openid
   getUserProfiles() {
    var that = this;
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (e) => {
        console.log(e)
        if (e) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.login({
              success: res => {
                console.log(res)
              api.getAPI('Login/getsessionkey', {
                  code: res.code,
                  iv: e.iv,
                  encryptedData: e.encryptedData,
              }).then(res => {
  
                wx.setStorageSync('name', e.userInfo.nickName)
                wx.setStorageSync('avatar', e.userInfo.avatarUrl)
                  var data = res.data;
                  data['NickName']= e.userInfo.nickName;
                  data['HeadUrl']= e.userInfo.avatarUrl;
                  data['gender']= e.userInfo.gender;
                  // app.data['NickName'] = e.userInfo.nickName;
                  // app.data['HeadUrl'] = e.userInfo.avatarUrl;
                  // app.data['gender'] = e.userInfo.gender;
                  app.data['SESSION_KEY'] = data.session_key;
                  app.data['OPEN_ID'] = data.openid;
                  console.log(data)
                  that.setData({
                      info:data
                  })
                  that.onLoginUser();
                  wx.setStorage({
                    key: 'OPEN_ID',
                    data: data.openid,
                  })
                  
                  wx.setStorage({
                    key: 'session_key',
                    data: data.session_key,
                  })
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
    var info=that.data.info
    console.log(info)
    api.getAPI('Login/authlogin', {
      SessionId: info.SESSION_KEY,
      gender: info.gender,
      NickName: info.NickName,
      HeadUrl: info.HeadUrl,
      openid: info.openid,
    }).then(res => {
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
        wx.navigateBack({

        })
        // that.tjone(); //把推荐人ID插入
      })
  },
  //推荐人id ,没有插入1
  // tjone: function () {
  //   var that = this
  //   console.log(123)
  //   var oneuid = app.d.oneuid
  //   if (oneuid == '') {
  //     oneuid = 1
  //   }
  //   console.log(oneuid);
  //   wx.showLoading({
  //     title: '授权中',
  //   })
  //   wx.request({
  //     url: app.d.hostUrl + '/fenxiao/index',
  //     method: 'post',
  //     data: {
  //       oneuid: oneuid,
  //       uid: app.d.userId
  //     },
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function (res) {
  //       console.log(res);
  //       wx.hideLoading()
  //       wx.navigateBack({

  //       })
  //       // var tel = res.data.tel  
  //       // if(tel){
  //       //   wx.navigateBack({})
  //       //   wx.setStorage({
  //       //     key: 'tel',
  //       //     data: tel,
  //       //   })
  //       // }else{
  //       //   wx.redirectTo({
  //       //     url: '/pages/login/tel'
  //       //   })
  //       // } 
  //     },
  //     fail: function (e) {
  //       wx.showToast({
  //         title: '网络异常！',
  //         duration: 2000
  //       });
  //     },
  //   })
  // },


});