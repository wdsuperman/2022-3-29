const api = require('../../api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 200,
    value: [],
    list: [],
    type:'全部',
    type1:true, //true降序 false升序
    filter: [{
        name: '全部',
        type: true,
      },
      {
        name: '销量',
        type: false,

      },
      {
        name: '价格',
        type: false,
      },
    ]
  },
  productId(e) {
    let {
      productid
    } = e.currentTarget.dataset
    console.log(e)
    wx.navigateTo({
      url: '/pages/index/details?productId=' + productid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e)
    this.setData({
      index: e.detail.value
    })
    wx.setStorageSync('city', this.data.value[e.detail.value])
  },
  px(a,b) {
    return a.price - b.price
  },
  xl(a, b) {
    return a.xn_sales - b.xn_sales
  },
  changeFilter(e) {
    let {
      name
    } = e.currentTarget.dataset
    if(this.data.type == name){
      this.setData({
        type1:!this.data.type1
      })
    }else{
      this.setData({
        type1:true
      })
    }
    this.setData({
      filter: this.data.filter.map(i => {
        i.type = false
        if (i.name == name) {
          i.type = true
        }
        return i
      }),
      type:name
    })
    // if(this.data.type == '销量'){
    //     this.setData({
    //       list1:this.data.list1.reverse()
    //     })
    // }
    // if(this.data.type == '价格'){
    //   this.setData({
    //     list2:this.data.list2.reverse()
    //   })
    // }
  },
  submit(e) {
    let uid = wx.getStorageSync('uid')
    let city = wx.getStorageSync('city')
    let cityid = 0
    let productname = e.detail.value
    let type = '全部'
    this.data.filter.map(i => {
      if (i.type) {
        type = i.name
      }
    })
    if (city) {
      cityid = city.id
    }
    let data = {
      uid,
      cityid,
      productname
    }
    api.getAPI('shangchang/getCityProduct', data).then(res => {
      if (res.data.status == 0) {
        wx.showToast({
          title: res.data.err,
          icon: 'none'
        })
        this.setData({
          list:[],
          list1:[],
          list2:[],
        })
      } else {
        this.setData({
          list:res.data.product
        })
      }
    })
    api.getAPI('shangchang/getCityProduct', data).then(res => {
      if (res.data.status == 0) {

      } else {
        this.setData({
          list1:res.data.product.sort(this.xl),
        })
      }
    })
    api.getAPI('shangchang/getCityProduct', data).then(res => {
      if (res.data.status == 0) {

      } else {
        this.setData({
          list2:res.data.product.sort(this.px),
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