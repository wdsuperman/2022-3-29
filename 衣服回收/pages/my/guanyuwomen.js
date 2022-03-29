var app=getApp();
var is_submit=true;
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
     tel:' 15227266674',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        api.getAPI('index/web',{
            id:2
           }).then(res => {
              wx.hideLoading({
                success: (res) => {},
              })
              console.log(res.data)
              if (res.data.status == 1) {
                this.setData({
                  tel: res.data.info.content,
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
    phone(){
        wx.makePhoneCall({
            phoneNumber: this.data.tel,
          })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})