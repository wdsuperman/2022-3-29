const api = require('../../api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:200,
    value:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let city = wx.getStorageSync('city')
    api.getAPI('shangchang/getShopcity').then(res => {
        console.log(res)
        this.setData({
            value:res.data.city
        })
        if(city){
            res.data.city.map((i,x) => {
                if(i.id == city.id){
                    this.setData({
                        index:x
                    })
                }
            })
        }
    })
    
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e)
    this.setData({
      index: e.detail.value
    })
    wx.setStorageSync('city', this.data.value[e.detail.value])
  },
  submit(e){
    let uid = wx.getStorageSync('uid')
    let city = wx.getStorageSync('city')
    let cityid = 0
    let productname = e.detail.value
    if(city){
        cityid = city.id
    }
    let data = {
        uid,cityid,productname
    }
    api.getAPI('shangchang/getCityProduct',data).then(res => {
        console.log(res)
        if(res.status == 0){
            wx.showToast({
              title: res.err,
              icon:'none'
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})