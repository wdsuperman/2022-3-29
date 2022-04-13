// pages/category/index.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: [],
        list: [],
        page: 1,
        cateid: 0,
        scrollTop: 0
    },
    click(e) {
        let {
            id
        } = e.currentTarget.dataset
        console.log(id)
        let cateid = id
        this.setData({
            tab: this.data.tab.map((i, index) => {
                i.type = false
                if (i.id == id) {
                    i.type = true
                    cateid = i.id
                }
                return i
            }),
            list: [],
            cidlist: [],
            cateid,
            page: 1,
            scrollTop: 0
        })
        wx.setStorageSync('id', id)
        api.getAPI('Category/getcat', {
            cateid
        }).then(res => {
            console.log(res)
            if (res.data.status == 1) {
                this.setData({
                    list: res.data.pro,
                    
                })
                if(res.data.cidlist){
                    this.setData({
                        cidlist: res.data.cidlist.map(i => {
                            i.type = false
                            return i
                        })
                    })
                }
            } else {
                wx.showToast({
                    title: res.data.err,
                    icon: 'none'
                })
                this.setData({
                    list: [],
                    cidlist: []
                })
            }
        })
    },
    click1(e){
        let {cateid,cidlist} = this.data
        let {
            id
        } = e.currentTarget.dataset
        this.setData({
            cidlist:cidlist.map(i => {
                i.type = false
                if(i.id == id){
                    i.type = true
                }
                return i
            })
        })
        api.getAPI('Category/getcat', {
            cateid,
            c_id:id
        }).then(res => {
            console.log(res.data)
            if (res.data.status == 1) {
                this.setData({
                    list: res.data.pro,
                    c_id:id
                })
            } else {
                wx.showToast({
                    title: res.data.err,
                    icon: 'none'
                })
                this.setData({
                    list: []
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
    getMore() {
        this.setData({
            page: this.data.page + 1
        })
        let {
            cateid,
            page,
            c_id
        } = this.data
        console.log(page)
        api.getAPI('Category/getmore', {
            cateid,
            page,
            c_id
        }).then(res => {
            console.log(res)
            if (res.data.status == 1) {
                this.setData({
                    list: [...this.data.list, ...res.data.pro]
                })
            } else {
                wx.showToast({
                    title: res.data.err,
                    icon: 'none'
                })
            }
        })
    },
    scroll() {
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
        let cid = wx.getStorageSync('id')
        let cateid = 0
        if (cid) {
            cateid = cid
        }
        api.getAPI('Category/index').then(res => {
            console.log(res)
            this.setData({
                tab: res.data.list.map(i => {
                    i.type = false
                    if (i.id == cateid) {
                        i.type = true
                    }
                    return i
                }),
                cateid
            })
        })
        api.getAPI('Category/getcat', {
            cateid
        }).then(res => {
            console.log(res)
            if (res.data.status == 1) {
                this.setData({
                    list: res.data.pro,
                    // cidlist: res.data.cidlist.map(i => {
                    //     i.type = false
                    //     return i
                    // })
                })
                if(res.data.cidlist != ''){
                    this.setData({
                        cidlist: res.data.cidlist.map(i => {
                        i.type = false
                        return i
                        })
                    })
                }
            } else {
                wx.showToast({
                    title: res.data.err,
                    icon: 'none'
                })
                this.setData({
                    list: [],
                    cidlist: []
                })
            }
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