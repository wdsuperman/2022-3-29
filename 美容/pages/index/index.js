const api = require('../../api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:{
      name:'请选择'
    },
    index:200,
    location_x:0,
    location_y:0,
    text: "1.【评分标准】页可以查看不同年龄段的评分标准，通过首页选择对应的性别、类别和年龄。",
    animation: null,
    timer: null,
    duration: 0,
    textWidth: 0,
    wrapWidth: 0,
    banner: ['', '', '', ''],
    tab: 0,
    tabs: [{
        img: '',
        title: '标题标题',
        url: ''
      },
      {
        img: '',
        title: '标题标题',
        url: ''
      },
      {
        img: '',
        title: '标题标题',
        url: ''
      },
      {
        img: '',
        title: '标题标题',
        url: ''
      },
      {
        img: '',
        title: '标题标题',
        url: ''
      },
    ],
    filter: [{
        title: '精选',
        url: '',
        msg: '猜你喜欢',
        type: true
      },
      {
        title: '美容',
        url: '',
        msg: '美容美发',
        type: false
      },
      {
        title: '机构',
        url: '',
        msg: '口碑精选',
        type: false
      },
      {
        title: '美容师',
        url: '',
        msg: '好评排行',
        type: false
      }
      // {
      //   title: '医生',
      //   url: '',
      //   msg: '名医大咖',
      //   type: false
      // },
    ],
    goods:[],
    mrs:[]
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e)
    this.setData({
      index: e.detail.value
    })
    wx.setStorageSync('city', this.data.value[e.detail.value])
  },
  search(e){
    let {type} = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/index/search?type=${type}`,
      })
  },
  top(e){
    console.log(e)
    let {action,id,type} = e.currentTarget.dataset
    if(type == 'shop'){
      wx.navigateTo({
        url: `./business?shopid=${id}`,
      })
    }else if(type == 'product'){
      wx.navigateTo({
        url: '/pages/index/details?productId=' + action,
      })
    }
  },
  shop(e){
    // console.log(e)
    // let {shopid} = e.currentTarget.dataset
    // wx.navigateTo({
    //   url: `./business?shopid=${shopid}`,
    // })
  },
  fenlei(e){
    let {id} = e.currentTarget.dataset
    wx.setStorageSync('id', id)
    wx.switchTab({
      url: `/pages/category/index`,
    })
  },
  productId(e){
    let {
      productid
    } = e.currentTarget.dataset
    console.log(e)
    wx.navigateTo({
      url: '/pages/index/details?productId=' + productid,
    })
  },
  changeFilter(e) {
    let {
      ind
    } = e.currentTarget.dataset
    this.setData({
      filter: this.data.filter.map((i, index) => {
        i.type = false
        if (index == ind) {
          i.type = true
        }
        return i
      }),
      tab: ind
    })
  },
  banner() {
    wx.navigateTo({
      url: '/pages/index/gold1',
    })
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
    console.log(options)
    if(options){
      app.d.oneuid = options.oneuid
    }
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.setStorageSync('location_x', longitude)
        wx.setStorageSync('location_y', latitude)
      }
     })
    let uid = wx.getStorageSync('uid')
    let location_x = wx.getStorageSync('location_x')
    let location_y = wx.getStorageSync('location_y')
    
    let date = {
      uid,
      location_x,
      location_y
    }
    api.getAPI('index/index',date).then(res => {
      console.log(res.data)
      let cate = res.data.cate.slice(0,5)
      this.setData({
        res:res.data
      })
      this.setData({
        banner:res.data.lunbo,
        text:res.data.xlb.service_wx,
        tabs:cate,
        goods:res.data.producr_red,
        mrs:res.data.mrs
      })
    })
    if(!uid){
      wx.showModal({
        title:'为了您更好的体验,请先同意授权',
        success(){
          wx.navigateTo({
            url: `/pages/login/index`,
          })
        }
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
    this.initAnimation(this.data.text)
    let city = wx.getStorageSync('city')
    if(city){
      this.setData({
        city
      })
    }
  },
  initAnimation(text) {
    let that = this
    this.data.duration = 15000
    this.data.animation = wx.createAnimation({
      duration: this.data.duration,
      timingFunction: 'linear'
    })
    let query = wx.createSelectorQuery()
    query.select('.content-box').boundingClientRect()
    query.select('#text').boundingClientRect()
    query.exec((rect) => {
      that.setData({
        wrapWidth: rect[0].width,
        textWidth: rect[1].width
      }, () => {
        this.startAnimation()
      })
    })
  },
  // 定时器动画
  startAnimation() {
    //reset
    // this.data.animation.option.transition.duration = 0
    const resetAnimation = this.data.animation.translateX(this.data.wrapWidth).step({
      duration: 0
    })
    this.setData({
      animationData: resetAnimation.export()
    })
    // this.data.animation.option.transition.duration = this.data.duration
    const animationData = this.data.animation.translateX(-this.data.textWidth).step({
      duration: this.data.duration
    })
    setTimeout(() => {
      this.setData({
        animationData: animationData.export()
      })
    }, 100)
    const timer = setTimeout(() => {
      this.startAnimation()
    }, this.data.duration)
    this.setData({
      timer
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.destroyTimer()
    this.setData({
      timer: null
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.destroyTimer()
    this.setData({
      timer: null
    })
  },
  destroyTimer() {
    if (this.data.timer) {
      clearTimeout(this.data.timer);
    }
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
  onShareAppMessage: function (e) {
    let userinfo = wx.getStorageSync('userInfo')
    var uid = wx.getStorageSync('uid')
    var title = '好友' + userinfo.nickName + '邀请您加入逗享'
    return {
      title: title,
      imageUrl: '',
      path: '/pages/index/index?oneuid=' + uid,
      success: function (res) {},
      fail: function (res) {}
    }
  },
})