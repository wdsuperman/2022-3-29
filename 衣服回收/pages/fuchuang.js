// pages/fuchuang.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fromFather: {
      type: String,
      value: ""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
 
  },
  
  
  /**
   * 组件的方法列表
   */
  methods: {
  
    zuji() {
      let tel = wx.getStorageSync('tel')
      console.log(tel)
      var uid = app.d.userId
      console.log(uid)
      // if (uid == 1 || tel.length != 11) {
      //   wx.showModal({
      //     content: '为了更好服务权益，请您先授权相关信息',
      //     success: function (res) {
      //       if (res.cancel) {

      //       } else {
      //         wx.navigateTo({
      //           url: '../login/index',
      //         })
      //       }
      //     }
      //   })
      // } else {
      //   wx.navigateTo({
      //     url: `/pages/my/zuji`,
      //   })
      // }
      if (uid == 1) {
        wx.showModal({
          content: '为了更好服务权益，请您先授权相关信息',
          success: function (res) {
            if (res.cancel) {

            } else {
              wx.navigateTo({
                url: '../login/index',
              })
            }
          }
        })
      } else {
        wx.navigateTo({
          url: `/pages/my/zuji`,
        })
      }
    },
    shoucang() {
      let tel = wx.getStorageSync('tel')
      console.log(tel)
      var uid = app.d.userId
      console.log(uid)
      if (uid == 1) {
        wx.showModal({
          content: '为了更好服务权益，请您先授权相关信息',
          success: function (res) {
            if (res.cancel) {

            } else {
              wx.navigateTo({
                url: '../login/index',
              })
            }
          }
        })
      } else {
        wx.navigateTo({
          url: `/pages/my/shoucang`,
        })
      }
    },
  },
 
  
})