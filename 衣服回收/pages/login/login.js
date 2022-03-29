var app=getApp();
Page({

  data: {
   url:app.d.img,
  },
  formSubmit: function (e) {
    var tel = e.detail.value.tel, psw = e.detail.value.psw
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    if (tel == '') {
      wx.showToast({
        title: '手机号不能为空',
      })
      return false
    }
    else if (tel.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(tel)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else if (psw == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'succes',
        duration: 1000,
        mask: true
      })

      return false
    } else if (psw.length < 5) {
      wx.showToast({
        title: '输入6位以上密码',
        icon: 'succes',
        duration: 1000,
        mask: true
      })

      return false
    }else{
      var that = this;
      wx.request({
        url: app.d.ceshiUrl + '/Api/Login/dologin',
        method: 'post',
        data: {
          tel: tel,
          psw: psw,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          var status = res.data.status;
          var data = res.data.session
          if (status != 1) {
            wx.showToast({
              title: res.data.err,
              duration: 3000
            });
            return false;
          } 
          wx.showToast({
            title: '登入成功',
            duration: 3000
          });
          var openid = res.data.session.openid
          app.data.tel = tel
          console.log(app.data.tel)
          app.d.userId = data.ID
          console.log(app.d.userId)
          wx.setStorage({
            key: 'tel',
            data: tel,
          })
          if (openid){
            wx.setStorage({
              key: 'OPEN_ID',
              data: openid,
            })
            app.data['id'] = data.ID;
            app.data['NickName'] = data.LoginName;
            app.data['HeadUrl'] = data.photo;
            that.index();
          }else{
             
            that.loginindex();
          }
          
          /*else {
            wx.showToast({
              title: '登入成功',
              duration: 3000
            });
            //缓存手机号
            wx.setStorage({
              key: 'tel',
              data: tel,
            })
            app.data.tel=tel
            that.loginindex();
          }*/
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！err:authlogin',
            duration: 2000
          });
        },
      });
    }
  },
  //注册账户
  zhece: function () {
    wx.navigateTo({
      url: '../login/zhece',
    })
  },
  //忘记密码
  wangji:function(){
    wx.navigateTo({
      url: '../login/wangji',
    })

  },
  //跳转授权页面
  loginindex:function(){
   wx.navigateTo({
     url: '../login/index',
   })
 
  },
  //跳转首页
  index: function () {
    wx.switchTab({
      url: '../index/index',
    })
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


})