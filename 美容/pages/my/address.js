// pages/my/address.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[
        ],
    },
    getAddress(){
        let uid = wx.getStorageSync('uid')
        let that = this
        wx.chooseAddress({
            success (res) {
              let data = {
                address:res.detailInfo,
                is_default:0,
                name:res.userName,
                tel:res.telNumber,
                sheng:res.provinceName,
                city:res.cityName,
                qv:res.countyName,
                uid
              }
              api.getAPI('address/add_adds',data).then( res => {
                console.log(res)
                if(res.data.status == 1){
                  wx.showToast({
                    title: '获取成功',
                  })
                  setTimeout(() => {
                      that.onShow()
                  }, 1000);
                }
              })
            }
          })
    },
    click(e){
        let uid = wx.getStorageSync('uid')
        let {id} = e.currentTarget.dataset
        api.getAPI('address/set_default',{uid,addr_id:id}).then(res => {
            if(res.data.status == 1){
                wx.showToast({
                  title: '设置成功',
                })
                this.setData({
                    list:this.data.list.map((i) => {
                        i.is_default = 0
                        if(i.id == id){
                            i.is_default = 1
                        }
                        return i
                    })
                })
            }
        })
        
    },
    del(e){
        let uid = wx.getStorageSync('uid')
        let {id} = e.currentTarget.dataset
        api.getAPI('address/del_adds',{uid,id_arr:id}).then(res => {
            if(res.data.status == 1){
                wx.showToast({
                  title: '删除成功',
                  mask:true,
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
        
    },
    bj(e){
        let {id} = e.currentTarget.dataset
        console.log(id)
        wx.navigateTo({
          url: `/pages/my/add_address?id=${id}`,
        })
    },
    add(){
        wx.navigateTo({
          url: '/pages/my/add_address',
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
        api.getAPI('address/index',{uid:wx.getStorageSync('uid')}).then(res => {
            if(res.data.status == 1){
                this.setData({
                    list:res.data.adds
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