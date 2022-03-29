//app.js
App({
  employIdCallback:1,
  data: {
    'OPEN_ID': null,
    'session_key': null,
    'sessionId': null,
    'NickName': null,
    'city': null,
    'HeadUrl': null,
    'id': '',
  },
  d: {
    // hostUrl: 'http://localhost/yifuhuishouxcx/index.php/Api',
    // img: 'http://localhost/yifuhuishouxcx/Data/images',
    hostUrl: 'https://sshs.rs1818.cn/index.php/Api',
    img: 'https://sshs.rs1818.cn/Data/images',
    userId: 1,
    oneuid: '',//推荐人id
    url_title: '',
    hd_id: '',
    address_xq:'',
    add_id:'',
  },
  onLaunch: function () {
    this.getUserInfo();
    this.autoUpdate();
  },
  getUserInfo: function (cb) {
    var that = this
    var uid = wx.getStorageSync('uid')
    if (uid) {
      that.onLoginUser();
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.request({
            url: that.d.hostUrl + '/Login/getsessionkey',
            method: 'post',
            data: {
              code: res.code,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (e) {
              // console.log(e)
              var openid = e.data.openid
         console.log(openid)
              if (openid) {
                wx.request({
                  url: that.d.hostUrl + '/Login/app_dl',
                  method: 'post',
                  data: {
                    openid: openid,
                  },
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    console.log(res)
                    var data = res.data.arr;
                    var status = res.data.status;
                    if (status != 1) {
                      wx.showToast({
                        title: res.data.err,
                        duration: 3000
                      });
                      return false;
                    }
                    that.data['id'] = data.ID;
                    that.data['NickName'] = data.NickName;
                    var userId = data.ID;
                    if (!userId) {
                      wx.showToast({
                        title: '登录失败！',
                        duration: 3000
                      });
                    }
                    wx.setStorage({
                      key: 'uid',
                      data: data.ID,
                    })
                    // wx.setStorage({
                    //   key: 'uid',
                    //   data: 503661,
                    // })
                    that.d.userId = userId;
                    that.d.jifen = data.jifen;
                    that.d.is_gz = data.is_gz;

                  },
                  fail: function (e) {
                    wx.showToast({
                      title: '网络异常！err:authlogin',
                      duration: 2000
                    });
                  },
                });
              } else {}
            },
          });
        }
      });
    }
  },
  //搜索用户
  onLoginUser: function () {
    
    var that = this;
    var uid = wx.getStorageSync('uid')
    wx.request({
      url: that.d.hostUrl + '/Login/usertel',
      method: 'post',
      data: {
        // openid: value,
        uid: uid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res)    
        var data = res.data.arr;
        var status = res.data.status;
        if (status != 1) {
          wx.showToast({
            title: res.data.err,
            duration: 3000
          });
          return false;
        }

        that.data['id'] = data.ID;

        var userId = data.ID;
        if (!userId) {
          wx.showToast({
            title: '登录失败！',
            duration: 3000
          });
        }
        // wx.setStorage({
        //   key: 'uid',
        //   data: 503661,
        // })
        that.d.userId = userId;
        //that.d.userId = 181;
        that.d.jifen = data.jifen;
        that.d.is_gz = data.is_gz;
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:authlogin',
          duration: 2000
        });
      },
    });

  },

  autoUpdate:function(){
    console.log(new Date())
    var self=this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //2. 小程序有新版本，则静默下载新版本，做好更新准备
          updateManager.onUpdateReady(function () {
            console.log(new Date())
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                } else if (res.cancel) {
                  //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  wx.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    success: function (res) {     
                      self.autoUpdate()
                      return;                 
                      //第二次提示后，强制更新                      
                      if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                      } else if (res.cancel) {
                        //重新回到版本更新提示
                        self.autoUpdate()
                      }
                    }
                  })
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})