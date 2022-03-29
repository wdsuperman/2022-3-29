// page/index/goods.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value:'',
        page:0,
        // qRCodeMsg: ''
        tab:[
            {
                title:'在售',
                type:true,
                value:1
            },
            {
                title:'已出售',
                type:false,
                value:2
            },
            {
                title:'仓库',
                type:false,
                value:3
            },
            {
                title:'已下架',
                type:false,
                value:4
            }
        ],
        id:'',
        list:[],
        showActionsheet: false,
        groups: [
            { text: '编辑', value: 1 },
            { text: '下架', value: 2 },
            { text: '删除', type: 'warn', value: 3 }
        ],
        scrolltop:0
    },
    add(){
        wx.navigateTo({
          url: './release',
        })
    },
    close: function () {
        this.setData({
            showActionsheet: false
        })
    },
    btnClick(e) {
        this.close()
        let {value} = e.detail
        let {id,groups} = this.data
        
        groups.map(i => {
            if(i.value == value){
                console.log(i.text,id)
                if(i.text == '编辑'){
                    wx.navigateTo({
                      url: `./release?id=${id}`,
                    })
                }
            }
        })
        
    },
    more(e){
        let {id} = e.currentTarget.dataset
        this.setData({
            showActionsheet: true,
            id
        })
    },
    getData(){
        let type = this.data.tab.find(i => i.type == true).value
        let shop_id = wx.getStorageSync('id')
        let {page,value} = this.data
        let data = {
            shop_id,
            keyword:value,
            type,
            page
        }
        api.getAPI('Adminshop/product_guanli_info',data).then(res => {
            if(res.data.status == 1){
                this.setData({
                    list:res.data.list
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
        console.log(1)
        this.setData({
            page:this.data.page + 1
        })
        let type = this.data.tab.find(i => i.type == true).value
        let shop_id = wx.getStorageSync('id')
        let {page,value} = this.data
        let data = {
            shop_id,
            keyword:value,
            type,
            page
        }
        api.getAPI('Adminshop/product_guanli_info',data).then(res => {
            if(res.data.status == 1){
                this.setData({
                    list:[...this.data.list,...res.data.list]
                })
            }else{
                wx.showToast({
                  title: res.data.err,
                  icon:'none'
                })
            }
        })
    },
    inp(e){
        let {value} = e.detail
        this.setData({
            value
        })
        if(value.length == 0){
            this.getData()
        }
    },
    search(){
        this.getData()
    },
    changeTab(e){
        let {title} = e.currentTarget.dataset
        this.setData({
            tab:this.data.tab.map(i => {
                i.type = false
                if(i.title == title){
                    i.type = true
                }
                return i
            }),
            page:0,
        })
        this.getData()
        this.setData({
            scrolltop:0
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '商品管理详情'
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
        this.getData()
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