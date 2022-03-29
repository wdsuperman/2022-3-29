var app=getApp();
const api = require('../../api.js')
Page({
    data: {
      address:[],
    },
    add(e){ //添加跳转
      let{id}=e.currentTarget.dataset
      if(id){//编辑页面
        wx.navigateTo({
          url: './huishoudizhi?id=' + e.currentTarget.dataset.id,
        })
      }else{
        wx.navigateTo({
          url: './huishoudizhi',
        })
      }
    },
    qr(e){ 
      let{ id,address_xq}= e.currentTarget.dataset
      app.d.add_id=id;
      app.d.address_xq=address_xq;
      wx.switchTab({
        url: '../index/xiadan',
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
      wx.showLoading({
        title: '加载中',
      })
      var that = this;
      var uid= wx.getStorageSync('uid')
      if(!uid){
        wx.showModal({
          content: '为了更好服务权益，请您先授权相关信息',
          success: function (res) {
            if (res.cancel) {
              wx.switchTab({
                url: '../index/index'
              });
            } else {
              wx.navigateTo({
                url: '../login/index',
              })
            }
          }
        })

      }
      api.getAPI('Address/index',{
        uid
       }).then(res => {
         wx.hideLoading({
           success: (res) => {},
         })
         console.log(res.data)
         if (res.data.status == 1) {
          that.setData({
            address: res.data.list,
          })
         } else {
           wx.showToast({
             title: res.data.err,
             icon: 'none'
           })
         }
       })
    },
    //删除或者默认
    click(e){
      console.log(e)
      let{id,type,index,is_default}=e.currentTarget.dataset
      api.getAPI('Address/is_save',{
        id,type
       }).then(res => {
         wx.hideLoading({
           success: (res) => {},
         })
         console.log(res.data)
         if (res.data.status == 1) {
          if(type=='is_default'){
            console.log(is_default)
            if(is_default==1){
              is_default=0;
            }else{
              is_default=1;
            }
            console.log(is_default)
            var sv_default = "address["+index+"].is_default"
            this.setData({
              [sv_default]:is_default
            })
          }else{
            var address=this.data.address
            address.splice(index,1)
            this.setData({
              address:address
            })
            // for (var i = 0; i < array.length; i++) {
            //   if (array[i] == val) {
            //     array.splice(i, 1);
            //   }
            // }
          }
         } else {
           wx.showToast({
             title: res.data.err,
             icon: 'none'
           })
         }
       })
    },
})