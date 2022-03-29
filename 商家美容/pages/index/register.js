// pages/index/register.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },
    dj(){
        wx.navigateTo({
          url: './release',
        })
    },
    
    jump(e){
        console.log(e)
        let {type} = e.currentTarget.dataset
        let title = ''
        if(type == 0){
            title = '全部'
        }else if(type == 1){
            title = '在售'
        }else if(type == 2){
            title = '已售出'
        }else if(type == 3){
            title = '已下架'
        }
        wx.navigateTo({
          url: `./goods?title=${title}&type=${type}`,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        api.getAPI('Adminshop/product_guanli',{shop_id:id}).then(res => {
            console.log(res)
            this.setData({
                progsc:res.data.progsc.slice(0,5),
                progsc_num:res.data.progsc_num,
                prolist:res.data.prolist.slice(0,5),
                prolist_num:res.data.prolist_num,
                proxj:res.data.proxj.slice(0,5),
                proxj_num:res.data.proxj_num,
                prozs:res.data.prozs.slice(0,5),
                prozs_num:res.data.prozs_num,
            })
        })
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