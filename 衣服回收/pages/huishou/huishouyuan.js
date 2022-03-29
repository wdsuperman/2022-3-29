var app=getApp();
Page({
    data: {

    },
    submit(e){
      // 账号密码都是1
       let{zhanghao,mima} = e.detail.value
      if (zhanghao == ''){
            wx.showToast({
              title: '请输入账户',
              icon:'none'
            })
      } else if (mima == ''){
            wx.showToast({
              title: '请输入密码',
                icon:'none'
              })
        }else{
          wx.showLoading({
            title: '登入中',
          })
          var that = this;
          wx.request({
            url: app.d.hostUrl + '/Api/huishou/login',
            method: 'post',
            data: {
              zh_name: zhanghao,
              mima: mima,
              uid: app.d.userId,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              wx.hideLoading()
              var status = res.data.status;
              if (status == 1) {
                wx.showToast({
                  title: '登录成功',
                  icon: "none",
                  duration: 2000
                });
                wx.setStorage({
                  key: 'is_sh',
                  data: '1',
                })
                wx.setStorage({
                  key: 'huishou_login',
                  data: '1',
                })
                wx.redirectTo({
                  url: './dingdanguanli',
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
        }
      
    },
    ruzhu(){
        // wx.showToast({
        //   title: '功能暂未开放',
        //   icon:'none'
        // })
        const that = this;
        wx.requestSubscribeMessage({
          tmplIds: ['OriYlnQpVuHtz1rxn4KmKIH69CB5rC0aliE4Ipv9KY4'],
          success(res) {
            if (res.errMsg === 'requestSubscribeMessage:ok') {
             
            }
          },
          fail(error) {
            console.log(error)
          }
        })
        wx.navigateTo({
          url: './ruzhu',
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
      if (wx.getStorageSync('is_sh') == 1) {
        var huishou_login = wx.getStorageSync('huishou_login')
        if (huishou_login == 1) {
          wx.redirectTo({
            url: './dingdanguanli',
          })
        }
      }
     
    },

   
 
})