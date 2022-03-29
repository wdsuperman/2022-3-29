// pages/index/business.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index:0,
        tab:[
            {
                type:true,
                title:'精选'
            },
            {
                type:false,
                title:'商品'
            },
            {
                type:false,
                title:'美容师'
            },
            {
                type:false,
                title:'更多推荐'
            }
        ],
        list:[
            {
                title:'标题标题标题标题标题',
                jf:'30',
                price:'100',
                img:'',
            },
            {
                title:'标题标题标题标题标题',
                jf:'30',
                price:'100',
                img:'',
            },
            {
                title:'标题标题标题标题标题',
                jf:'30',
                price:'100',
                img:'',
            }
        ],
        product_jx:[],
        product:[],
        mrs:[],
        product_more:[],
    },
    tab(e){
        console.log(e)
        let index = e.currentTarget.dataset.index
        this.setData({
            index,
            tab:this.data.tab.map((i,ind) => {
                i.type = false
                if(ind == index){
                    i.type = true
                }
                return i
            })
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let {shopid} = options
        api.getAPI('Shangjia/index',{shopid}).then(res => {
            if(res.data.status == 1){
                this.setData({
                    info:res.data.info,
                    product_jx:res.data.product_jx,
                    product:res.data.product,
                    mrs:res.data.mrs,
                    product_more:res.data.product_more,
                })
                wx.setNavigationBarTitle({
                  title: res.data.info.name,
                })
            }else{
                wx.showToast({
                  title: res.data.err,
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