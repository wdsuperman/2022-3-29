// pages/my/index.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[
            {
                title:'我的订单',
                icon:'/images/03.png',
                url:'./dingdan',
            },
            {
                title:'我的分享',
                icon:'/images/04.png',
                url:'./team', 
            },
            {
                title:'二维码',
                icon:'/images/05.png',
                url:'./erweima',
            },
            {
                title:'在线客服',
                icon:'/images/06.png',
                url:'',
            },
            {
                title:'我的收藏',
                icon:'/images/07.png',
                url:'./shoucang',
            },
            {
                title:'优惠券',
                icon:'/images/08.png',
                url:'./user-yhq',
            }
            // {
            //     title:'领券中心',
            //     icon:'/images/09.png',
            //     url:'./user-lingqu',
            // },
            // {
            //     title:'店铺管理',
            //     icon:'',
            //     url:'',
            // },
        ]
    },
    xieyi(){
        wx.navigateTo({
          url: '/pages/my/xieyi',
        })
      },
    jump(e){
        console.log(e)
        let {url} = e.currentTarget.dataset
        wx.navigateTo({
          url,
        })
    },
    yuechongzhi(){
        wx.navigateTo({
          url: './yuechongzhi',
        })
    },
    ysjb(){
        wx.navigateTo({
          url: './ysjb',
        })
    },
    yuetx(){
        wx.navigateTo({
          url: './yuetx',
        })
    },
    tx(){
        wx.navigateTo({
          url: './tx',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let info = wx.getStorageSync('userInfo')
        this.setData({
            url:info.avatarUrl,
            name:info.nickName
        })
        console.log(info)
        let uid = wx.getStorageSync('uid')
        api.getAPI('user/userlist',{uid}).then(res => {
            console.log(res.data)
            this.setData({
                res:res.data.res,
                jifen:res.data.jifen
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
        var uid = wx.getStorageSync('uid')
        if(!uid){
          wx.navigateTo({
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