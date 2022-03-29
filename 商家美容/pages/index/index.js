Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  close(){
    
    wx.showModal({
      title:'退出账号',
      content:'确定退出账号吗？',
      confirmColor: '#23a070',
      success(){
        wx.clearStorageSync()
        wx.redirectTo({
          url: '/pages/login/index',
        })
      }
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取月 
    var m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日 
    var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let data = `${m}月${d}日`
    this.setData({
      date: data
    })
  },
  jump(e){
    let {type} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/index/${type}`,
    })
  },
  code(){
    wx.scanCode({
      success (res) {
        console.log(res)
        let {result} = res
        wx.setClipboardData({
          data: result,
          success (res) {
            wx.getClipboardData({
              success () {
                wx.showToast({
                  title: '成功!已粘贴到剪贴板',
                })
              }
            })
          }
        })
        
      },fail(){
        wx.showToast({
          title: '失败！请重试',
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
    let id = wx.getStorageSync('id')
    if(!id){
        wx.redirectTo({
            url: '/pages/login/index',
          })
    }
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