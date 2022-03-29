// pages/index/gold.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tc: false, //弹窗
        jinbi: 0,
        gold: [{
                type: true,
                price: 100,
                day: '周一',
                img: '/images/icon.png'
            },
            {
                type: false,
                price: 100,
                day: '周一',
                img: '/images/icon.png'
            },
            {
                type: false,
                price: 100,
                day: '周一',
                img: '/images/icon.png'
            },
            {
                type: false,
                price: 100,
                day: '周一',
                img: '/images/icon.png'
            },
            {
                type: false,
                price: 100,
                day: '周一',
                img: '/images/icon.png'
            },
            {
                type: false,
                price: 100,
                day: '周一',
                img: '/images/icon.png'
            },
            {
                type: false,
                price: 100,
                day: '周日',
                img: '/images/icon.png'
            },
        ],
        list: [{
                img: '',
                title: '标题标题标题标题标题标题标题标题标题标题',
                amount: 110,
                buy: 10
            },
            {
                img: '',
                title: '标题',
                amount: 110,
                buy: 10
            },
        ]
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
    close() {
        this.setData({
            tc: false
        })
        let that =this;
        that.onLoad()
    },
    open() {
        var uid = wx.getStorageSync('uid')
        api.getAPI('Jinbi/qd_click',{
            uid
        }).then(res => {
            console.log(res)
            if(res.data.status == 1){
                this.setData({
                    tc: true,
                })
            }else{
                wx.showToast({
                  title: res.data.err,
                  icon:'none'
                })
            }
        })
    },
    jb() {
        wx.navigateTo({
            url: '/pages/index/jbbi',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var uid = wx.getStorageSync('uid')
        if(!uid){
        wx.navigateTo({
            url: '/pages/login/index',
        })
        }
        api.getAPI('Jinbi/index', {
            uid
        }).then(res => {
            console.log(res.data)
            this.setData({
                jinbi: res.data.user.jinbi,
                qd: res.data.qd.map((i, ind) => {
                    i.img = '/images/icon.png'
                    i.price = 140
                    i.type = i.status
                    switch (ind) {
                        case 0:
                            i.day = '周一'
                            break;
                        case 1:
                            i.day = '周二'
                            break;
                        case 2:
                            i.day = '周三'
                            break;
                        case 3:
                            i.day = '周四'
                            break;
                        case 4:
                            i.day = '周五'
                            break;
                        case 5:
                            i.day = '周六'
                            break;
                        case 6:
                            i.day = '周日'
                            break;
                    }
                    return i
                }),
                product:res.data.product
                
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