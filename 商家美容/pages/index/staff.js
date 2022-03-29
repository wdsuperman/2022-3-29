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
                title:'显示',
                type:true,
                value:0
            },
            {
                title:'隐藏',
                type:false,
                value:1
            }
        ],
        id:'',
        list:[],
        showActionsheet: false,
        groups: [
            { text: '编辑', value: 1 },
            { text: '隐藏', value: 2 },
            { text: '删除', type: 'warn', value: 3 }
        ],
        scrolltop:0
    },
    add(){
        wx.navigateTo({
          url: './add_staff',
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
        let shop_id = wx.getStorageSync('id')
        groups.map(i => {
            if(i.value == value){
                console.log(i.text,id)
                if(i.text == '编辑'){
                    wx.navigateTo({
                      url: `./add_staff?id=${id}`,
                    })
                }else if(i.text == '隐藏'){
                    api.getAPI('Adminshop/yuangong_list_save',{id,shop_id,type:1}).then(res => {
                        console.log(res)
                        if(res.data.status == 1){
                            wx.showToast({
                              title: '修改成功',
                            })
                            this.setData({
                                list:this.data.list.filter(i => i.id != id)
                            })
                        }else{
                            wx.showToast({
                              title: res.data.err,
                              icon:'none'
                            })
                        }
                    })
                }else if(i.text == '显示'){
                    api.getAPI('Adminshop/yuangong_list_save',{id,shop_id,type:0}).then(res => {
                        console.log(res)
                        if(res.data.status == 1){
                            wx.showToast({
                              title: '修改成功',
                            })
                            this.setData({
                                list:this.data.list.filter(i => i.id != id)
                            })
                        }else{
                            wx.showToast({
                              title: res.data.err,
                              icon:'none'
                            })
                        }
                    })
                }else if(i.text == '删除'){
                    api.getAPI('Adminshop/yuangong_list_save',{id,shop_id,type:2}).then(res => {
                        console.log(res)
                        if(res.data.status == 1){
                            wx.showToast({
                              title: '修改成功',
                            })
                            this.setData({
                                list:this.data.list.filter(i => i.id != id)
                            })
                        }else{
                            wx.showToast({
                              title: res.data.err,
                              icon:'none'
                            })
                        }
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
        api.getAPI('Adminshop/yuangong_list',data).then(res => {
            if(res.data.status == 1){
                this.setData({
                    list:res.data.list
                })
            }else{
                this.setData({
                    list:[]
                })
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
        api.getAPI('Adminshop/yuangong_list',data).then(res => {
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
        if(title == '显示'){
            this.setData({
                groups:[
                    { text: '编辑', value: 1 },
                    { text: '隐藏', value: 2 },
                    { text: '删除', type: 'warn', value: 3 }
                ]
            })
        }else{
            this.setData({
                groups:[
                    { text: '编辑', value: 1 },
                    { text: '显示', value: 2 },
                    { text: '删除', type: 'warn', value: 3 }
                ]
            })
        }
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
            title: '员工管理'
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