var app = getApp(); 
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      
    },
    click(){
       wx.navigateTo({
         url: './xiadan',
       })
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
  
      var uid= wx.getStorageSync('uid')
      if (!uid) {
        wx.showModal({
          content: '为了更好服务权益，请您先授权相关信息',
          success: function (res) {
            if (res.cancel) {
              wx.switchTab({
                url: '../index/index'
              });
            } else {
              wx.navigateTo({
                url: '../login/index',
              })
            }
          }
        })
        return false;
      }
      wx.showLoading({
        title: '加载中',
      })
      api.getAPI('index/cate',{
        uid:uid
       }).then(res => {
          wx.hideLoading({
            success: (res) => {},
          })
          console.log(res.data)
          if (res.data.status == 1) {
            this.setData({
              list: res.data.list,
            })
          } else {
            wx.showToast({
              title: res.data.err,
              icon: 'none'
            })
          }
        })
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})