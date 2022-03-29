const api = require('../../api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location_x:0,
    location_y:0,
    text: "1.【评分标准】页可以查看不同年龄段的评分标准，通过首页选择对应的性别、类别和年龄。",
    animation: null,
    timer: null,
    duration: 0,
    textWidth: 0,
    wrapWidth: 0,
    banner: ['', '', '', ''],
    arr: ["zs", "ls", "ss"],
    array: ['请选择'],
    index: 0,
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
      },
      {
        title: '医生',
        url: '',
        msg: '名医大咖',
        type: false
      },
    ],
    goods:[],
    mrs:[]
  },
  top(e){
    console.log(e)
    let {action,id,type} = e.currentTarget.dataset
    if(type == 'shop'){
      wx.navigateTo({
        url: `./business?shopid=${id}`,
      })
    }
  },
  shop(e){
    console.log(e)
    let {shopid} = e.currentTarget.dataset
    wx.navigateTo({
      url: `./business?shopid=${shopid}`,
    })
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  banner() {
    wx.navigateTo({
      url: '/pages/index/gold',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  onShareAppMessage: function () {

  }
})