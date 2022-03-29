// pages/index/release.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        photo: '',
        number:'',
        name:'',
        intro:'',
        id:''
    },
    submit(e) { //提交
        console.log(e)
        let shop_id = wx.getStorageSync('id')
        let {
            photo,
            id
        } = this.data
        let {
            name,
            number,
            intro
        } = e.detail.value


        let data = {
            id,
            shop_id,
            name,
            number,
            intro,
            photo
        }
        if (data.name == '') {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none'
            })
        } else if (data.number == '') {
            wx.showToast({
                title: '请输入员工编号',
                icon: 'none'
            })
        } else if (data.photo == '') {
            wx.showToast({
                title: '请上传员工形象图',
                icon: 'none'
            })
        } else {
            api.getAPI('Adminshop/yuangong_info_add', data).then(res => {
                console.log(res)
                if(res.data.status == 1){
                    wx.showToast({
                      title: '成功',
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                          delta: 0,
                        })
                    }, 1000);
                }
            })
        }
    },
    success(e) {
        console.log(JSON.parse(e.detail.file.res.data))
        let res = JSON.parse(e.detail.file.res.data)
        this.setData({
            photo: res.photo_arr
        })
    },
    remove() {
        this.setData({
            photo: '',
            photo_x:[]
        })
    },
    change(e){
        console.log(e)
        if(e.detail.file.status == 'uploading'){
            this.setData({
                photo_x:e.detail.fileList
            })
        }
    },
    fail() {
        wx.showToast({
            title: '图片上传失败！',
            icon: 'none'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let shop_id = wx.getStorageSync('id')
        let {
            id
        } = options
        console.log(id)
        if (options.id) {
            this.setData({
                id
            })
            api.getAPI('Adminshop//yuangong_info', {
                shop_id,id
            }).then(res => {
                console.log(res)
                this.setData({
                    photo_x:[{url:res.data.info.photo}],
                    photo:res.data.info.photo.slice(28),
                    name:res.data.info.name,
                    intro:res.data.info.intro,
                    number:res.data.info.number,
                })
            })
        }
        
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