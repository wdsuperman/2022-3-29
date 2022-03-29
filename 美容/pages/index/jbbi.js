// pages/my/ysjb.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        jinbi:0,
        list:[],
        page:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let uid = wx.getStorageSync('uid')
        console.log(uid)
        api.getAPI('Jinbi/xq',{uid}).then(res => {
            console.log(res.data)
            this.setData({
                jinbi:res.data.user.jinbi,
                list:res.data.list
            })
        })
    },
    getMore(){
        let uid = wx.getStorageSync('uid')
        this.setData({
            page:this.data.page + 1
        })
        let page = this.data.page

        api.getAPI('Jinbi/xq_more',{uid,page}).then(res => {
            console.log(res.data)
            if(res.data.status == 1){
                this.setData({
                    list:[...this.data.list,...res.data.user.jinbi],
                })
            }else{
                wx.showToast({
                  title: res.data.err,
                  icon:'none'
                })
            }
        })
    },
    scroll(){
        this.getMore()
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