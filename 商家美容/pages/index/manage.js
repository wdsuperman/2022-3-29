// pages/index/goods.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value:'',
        pages:0,
        // qRCodeMsg: ''
        tab:[
            {
                title:'预约单',
                type:true,
                value:1
            },
            {
                title:'实物单',
                type:false,
                value:2
            },
            {
                title:'已退货',
                type:false,
                value:3
            },
            {
                title:'已完成',
                type:false,
                value:4
            }
        ],
        ind:'',
        list:[
            {
                img:'',
                title:'标题',
                num:10,
                type:1, //预约状态,
                price:'20.2', //价格
                amount:'60' //门市价
            },
            {
                img:'',
                title:'标题',
                num:10,
                type:2, //预约状态,
                price:'20.2', //价格
                amount:'60' //门市价
            },
        ],
        showActionsheet: false,
        groups: [
            { text: '编辑', value: 1 },
            { text: '下架', value: 2 },
            { text: '删除', type: 'warn', value: 3 }
        ],
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
        let {ind,groups} = this.data
        groups.map(i => {
            if(i.value == value){
                console.log(i.text,ind)
            }
        })
    },
    more(e){
        let {ind} = e.currentTarget.dataset
        this.setData({
            showActionsheet: true,
            ind
        })
    },
    getData(){
        let type = this.data.tab.find(i => i.type == true).value
        let shop_id = wx.getStorageSync('id')
        let {pages,value} = this.data
        let data = {
            shop_id,
            keyword:value,
            type,
            pages
        }
        api.getAPI('Adminorder/index',data).then(res => {
            console.log(res)
            if(res.data.status){

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
            })
        })
        if(title == '实物单'){
            this.setData({
                groups:[
                    { text: '发货', value: 1 },
                    { text: '联系客户', value: 2 },
                    { text: '退货', type: 'warn', value: 3 }
                ]
            })
        }else if(title == '预约单'){
            this.setData({
                groups:[
                    { text: '查看', value: 1 },
                    { text: '扫码', value: 2 },
                    { text: '退货', type: 'warn', value: 3 }
                ]
            })
        }else if(title == '已退货'){
            this.setData({
                groups:[
                    { text: '查看', value: 1 },
                    { text: '删除', type: 'warn', value: 2 }
                ]
            })
        }else if(title == '已完成'){
            this.setData({
                groups:[
                    { text: '查看', value: 1 },
                    { text: '删除', type: 'warn', value: 2 }
                ]
            })
        }
        this.getData()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getData()
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