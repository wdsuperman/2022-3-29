//app.js
const api = require('./api')
App({
  data: {
    'OPEN_ID': null,
    'session_key': null,
    'sessionId': null,
    'NickName': null,
    'city': null,
    'HeadUrl': null,
    'id': '',
    tel: null, //手机号
  },
  d: {
    hostUrl: 'https://meifa.rs1818.cn/index.php/api/',
    ceshiUrl: 'https://meifa.rs1818.cn/index.php/api/',
    img: 'https://dy.rs1818.com/Data/images',
    userId: 1,
    oneuid: '', //推荐人id
    onepid: '', //分享商品id
    jifen: 0,
    is_gz: 0, //权限1工作人员
    pt_id: 0, //拼团id
    yy_id: 0, //约片id，
    yy_uid: 0,
    pid: 0, //约片或者团购的电影id。

  },
  onLaunch: function () {
    // this.getUserInfo();
    // wx.setStorage({
    //   key:"uid",
    //   data:"500138"
    // })
    // this.overShare()
  },
  overShare: function () {
    //监听路由切换
    //间接实现全局设置分享内容
    let uid = wx.getStorageSync('uid')
    wx.onAppRoute(function (res) {
      //获取加载的页面
      let pages = getCurrentPages(),
        //获取当前页面的对象
        view = pages[pages.length - 1],
        data;
      if (view) {
        data = view.data;
        // console.log('是否重写分享方法', data.isOverShare);
        if (!data.isOverShare) {
          data.isOverShare = true;
          view.onShareAppMessage = function () {
            //你的分享配置
            return {
              title: '逗享平台',
              path: '/pages/index/index?oneuid=' + uid,
              imageUrl: 'http://meifa.rs1818.cn/Data/images/fenxiang.jpg',
            };
          }
        }
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    var uid = wx.getStorageSync('uid')
    if(!uid){
      wx.showModal({
        title:'为了您更好的体验,请先同意授权',
        success(){
          wx.navigateTo({
            url: '/pages/login/index',
          })
        }
      })
    }else{
      this.d.userId = uid
    }

    //调用登录接口
    // wx.login({
    //   success: function (res) {
    //     wx.request({
    //       url: that.d.hostUrl + 'Login/getsessionkey',
    //       method: 'post',
    //       data: {
    //         code: res.code,
    //       },
    //       header: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //       },
    //       success: function (e) {
    //         console.log(e)
    //         var openid = e.data.openid
    //         if (openid) {
    //           wx.request({
    //             url: that.d.hostUrl + 'Login/app_dl',
    //             method: 'post',
    //             data: {
    //               openid: openid,
    //             },
    //             header: {
    //               'Content-Type': 'application/x-www-form-urlencoded'
    //             },
    //             success: function (res) {
    //               console.log(res)
    //               var data = res.data.arr;
    //               var status = res.data.status;
    //               if (status != 1) {
    //                 wx.showToast({
    //                   title: res.data.err,
    //                   duration: 3000
    //                 });
    //                 return false;
    //               }
    //               that.data['id'] = data.ID;
    //               that.data['NickName'] = data.NickName;
    //               var userId = data.ID;
    //               if (!userId) {
    //                 wx.showToast({
    //                   title: '登录失败！',
    //                   duration: 3000
    //                 });
    //               }
    //               wx.setStorage({
    //                 key: 'uid',
    //                 data: data.ID,
    //               })
    //               that.d.userId = userId;
    //               that.d.jifen = data.jifen;
    //               that.d.is_gz = data.is_gz;

    //             },
    //             fail: function (e) {
    //               wx.showToast({
    //                 title: '网络异常！err:authlogin',
    //                 duration: 2000
    //               });
    //             },
    //           });
    //         }
    //       },
    //     });
    //   }
    // })
  },
  //搜索用户
  onLoginUser: function () {
    var that = this;
    var uid = wx.getStorageSync('uid')
    wx.request({
      url: that.d.hostUrl + 'Login/usertel',
      method: 'post',
      data: {
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

})