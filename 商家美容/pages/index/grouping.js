// pages/index/register.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    goods(e) {
        let {
            title,id
        } = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/index/goods1?title=${title}&id=${id}`,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = wx.getStorageSync('id')
        api.getAPI('Adminshop/category',{shop_id:id}).then(res => {
            console.log(res)
            this.setData({
                list:res.data.cate
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