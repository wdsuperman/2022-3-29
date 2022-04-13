// pages/my/add_address.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        region: [],
        name:'',
        qv:'',
        city:'',
        sheng:'',
        tel:'',
        is_default:'',
        address:'',
        addr_id:''
    },
    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          region: e.detail.value
        })
      },
      submit(e){
        let uid = wx.getStorageSync('uid')
        let {addr_id} = this.data
        let{address,is_default,name,tel} = e.detail.value
        let sheng  = this.data.region[0]
        let city  = this.data.region[1]
        let qv  = this.data.region[2]
        if(is_default){
          is_default = 1
        }else{
          is_default = 0
        }
        let data = {
          address,is_default,name,tel,sheng,city,qv,uid
        }
        if(!sheng){
          wx.showToast({
            title: '请选择省份',
            icon:'none'
          })
        }else if(!city){
          wx.showToast({
            title: '请选择省份',
            icon:'none'
          })
        }else if(!qv){
          wx.showToast({
            title: '请选择省份',
            icon:'none'
          })
        }else if(!address){
          wx.showToast({
            title: '请填写详细地址',
            icon:'none'
          })
        }else if(!name){
          wx.showToast({
            title: '请填写联系人',
            icon:'none'
          })
        }else if(!tel){
          wx.showToast({
            title: '请填写联系电话',
            icon:'none'
          })
        }else if(!(/^1[34578]\d{9}$/.test(tel))){
          wx.showToast({
            title: '联系电话有误',
            icon:'none'
          })
        }else{
          console.log(data)
          data.addr_id = addr_id
          if(addr_id){
            api.getAPI('address/up_addr',data).then( res => {
              console.log(res)
              if(res.data.status == 1){
                wx.showToast({
                  title: '保存成功',
                })
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 0,
                  })
                }, 1000);
              }
            })
          }else{
            api.getAPI('address/add_adds',data).then( res => {
              console.log(res)
              if(res.data.status == 1){
                wx.showToast({
                  title: '保存成功',
                })
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 0,
                  })
                }, 1000);
              }
            })
          }
        }
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      if(options){
        wx.setNavigationBarTitle({
          title: '修改地址',
        })
        this.setData({
          addr_id:options.id
        })
        api.getAPI('address/details',{addr_id:options.id}).then(res => {
          if(res.data.status == 1){
            this.setData({
              address:res.data.address,
              is_default:res.data.is_default,
              name:res.data.name,
              tel:res.data.tel,
              region:[res.data.sheng,res.data.city,res.data.qv]
            })
          }
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