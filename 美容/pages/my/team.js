
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "team1": "team",
    "team2": "",
    list2count:0,//二级分销数量
    list1count:0,//一级分销数量
    list1:'',
    list2:'',
    list: '',
    'all': '4',
    'first': '2',
    'two': '1',
    'three': '1'

  },
 
  click1: function () {
    this.setData({
      "team1": "team",
      "team2": "",
      list: this.data.list1,
    })
  },
  click2: function () {
    this.setData({
      "team1": "",
      "team2": "team", 
      list: this.data.list2,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let uid = wx.getStorageSync('uid')
    wx.request({
      url: app.d.ceshiUrl + 'Fenxiao/team',
      method: 'post',
      data: {
        uid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        var status = res.data.status;
        if (status == 1) {
          var res = res.data;
          that.setData({
            list: res.list1,
            list1: res.list1,
            list2: res.list2,
            list1count: res.list1count,
            list2count: res.list2count,
          })

        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
    });

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