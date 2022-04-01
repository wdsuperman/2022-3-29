var app = getApp(); 
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const api = require('../../api.js')
var qqmapsdk;
Page({
  data: {
    fwList:[
      {
           title: '我的订单',
           img: '/images/index_3.png',
           name: '../dingdan/index',
           type: '',
           url:'1',
        },
        {
            title: '服务流程',
            img: '/images/index_4.png',
            name: './fulc',
            type: '',
            url: '1',
        },
        {
            title: '分类指南',
            img: '/images/index_5.png',
            name: './cate',
            type: '',
            url: '1',
        },
        {
            title: '合作咨询',
            img: '/images/index_6.png',
            name: './hezuo',
            type: '',
            url:"1",
        },
   ],
  },
  hs(){
    wx.switchTab({
      url: '/pages/index/xiadan',
    })
  },
  banner(){
    wx.navigateTo({
      url: '/pages/index/hezuo',
    })
  },
  //点击
  iconClick(e){
    let {type,name} = e.currentTarget.dataset
    if(type==1){ //
      wx.switchTab({
        url: name,
      })
    }else { //我的订单
      wx.navigateTo({
        url: name,
      })
      
    }
  },

  catchTouchMove(){},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that=this
    api.getAPI('index/index',{
     }).then(res => {
      
       console.log(res.data)
       if (res.data.status == 1) {
        that.setData({
          lunbo: res.data.lunbo,
          newOrders:res.data.newOrders
        });
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
    return {
      title: "有一家不错的小程序分享给您",
      path:`/pages/index/index` 
    }

  }
})