// pages/login/index.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    formSubmit(e){
       let {name,pwd} = e.detail.value
       console.log(name,pwd)
       if(name == ''){
           wx.showToast({
             title: '请输入商家账户',
             icon:'none'
           })
       }else if(pwd == ''){
           wx.showToast({
             title: '请输入密码',
             icon:'none'
           })
       }else{
           api.getAPI('Adminshop/denglu',{name,pwd}).then(res => {
               console.log(res)
               wx.showModal({
                 title:res.data
               })
               if(res.data.status == 0){
                   wx.showToast({
                     title: res.data.err,
                     icon:'none'
                   })
               }else{
                   wx.setStorageSync('id', res.data.shop.id)
                   wx.redirectTo({
                    url: '/pages/index/index',
                  })
               }
           })
       }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = wx.getStorageSync('id')
        if(id){
            wx.redirectTo({
                url: '../index/index',
              })
        }
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})