var app=getApp();
const api = require('../../api.js')
var is_submit=true;
Page({

    data: {
      address:'', //回收地址
      shengArr: [],//省级数组
      shengId:0,//省级id数组
      shiArr: [],//城市数组
      shiId: 0,//城市id数组
      quArr: [],//区数组
      quId: 0,//区id
      shengIndex: 0,
      shiIndex: 0,
      quIndex: 0,
      shengNull:null,
      shiNull:null,
      quNull:null,
    },
  
    submit(e) { //提交
        let {value} = e.detail
        let {shengId,shiId,quId,shiArr,quArr,shengArr,shengIndex,shiIndex,quIndex,add_id} = this.data
        console.log(app.d.userId)
        if(shengId == 0){
            wx.showToast({
                title: '请选择省份',
                icon:'none'
              })
              return false;
        }else if(shiId == 0){
            wx.showToast({
                title: '请选择城市',
                icon:'none'
            })
            return false;
          }else if(quId == 0){
            wx.showToast({
                title: '请选择地区',
                icon:'none'
            })    
            return false;
        }else if(value.address == ''){
            wx.showToast({
                title: '请填写详细地址',
                icon:'none'
            })
            return false;
        }else if(value.name == ''){
            wx.showToast({
                title: '请填写联系人',
                icon:'none'
            })
            return false;
        }else if(!(/^1[3456789]\d{9}$/.test(value.tel))){
            wx.showToast({
                title: '手机号不正确',
                icon:'none'
            })
            return false;
        }else{
          if(!is_submit) return false;
          is_submit=false;
          wx.showLoading({
            title: '添加中',
          })
          var that = this;
          api.getAPI('Address/address_add',{
            uid:wx.getStorageSync('uid'),
            add_id,
            shengId,
            shiId,
            quId,
            sheng:shengArr[shengIndex].name,
            shi:shiArr[shiIndex].name,
            qu:quArr[quIndex].name,
            name:value.name,
            tel:value.tel,
            is_default: value.switch,
            address: value.address,
           }).then(res => {
             wx.hideLoading({
               success: (res) => {},
             })
             is_submit=true
             console.log(res.data)
             if (res.data.status == 1) {
              wx.showToast({
                title: '保存成功！',
                icon:'none',
                duration: 2000
              });
              setTimeout(function(){
                wx.redirectTo({
                  url: './dizhi'
                });
              },2000)
             } else {
               wx.showToast({
                 title: res.data.err,
                 icon: 'none'
               })
             }
           })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if(options.id){
        wx.setNavigationBarTitle({
          title: '修改地址'
      })
        this.lond(options.id);
      }else{
        this.china_city(1);
      }
    },

    lond(id){
      wx.showLoading({
        title: '加载中',
      })
      var that = this;
      api.getAPI('Address/details',{
        add_id: id,
       }).then(res => {
         wx.hideLoading({
           success: (res) => {},
         })
         console.log(res.data)
         if (res.data.status == 1) {
          wx.hideLoading();
          var info = res.data.address;
          that.setData({
            add_id:id,
            name: info.name,
            tel: info.tel,
            address: info.address,
            switch: info.switch,
            shengId:info.sheng,
            shiId:info.city,
            quId:info.quyu,
            shengIndex:res.data.shengIndex,
            shengArr:res.data.shengArr,
            shiIndex:res.data.shiIndex,
            shiArr:res.data.shiArr,
            quIndex:res.data.quIndex,
            quArr:res.data.quArr,
            shiNull:true,
            quNull:true,
            shengNull:true,
          })
         } else {
           wx.showToast({
             title: res.data.err,
             icon: 'none'
           })
         }
       })
    },
    //获取省市县
    china_city(type){
      console.log(type)
      var that = this;
      wx.showLoading({
        title: '加载中',
      })
      let{shengId,shiId}=that.data
      api.getAPI('Address/china_city',{
        type,shengId,shiId

       }).then(res => {
         wx.hideLoading({
           success: (res) => {},
         })
         console.log(res.data)
         if (res.data.status == 1) {
          if(type==2){
            that.setData({
              shiArr:res.data.list,
            })
          }else if(type==3){
            that.setData({
              quArr:res.data.list,
            })
          }else{
            that.setData({
              shengArr:res.data.list,
            })
          }
         } else {
           wx.showToast({
             title: res.data.err,
             icon: 'none'
           })
         }
       })
    },
    
  bindPickerChangechina: function (e) {
    
    let {type}=e.currentTarget.dataset
    let {shengArr,shiArr,quArr}=this.data
    if(type==1){
      this.setData({
        shengIndex: e.detail.value,
        shengId:shengArr[e.detail.value].id,
        shiIndex:0,
        quIndex:0,
        shengNull:true,
        shiNull:false,
        quNull:false,
      });
    }else if(type==2){
      this.setData({
        shiIndex: e.detail.value,
        shiId:shiArr[e.detail.value].id,
        quIndex:0,
        shiNull:true,
        quNull:false,
      });
    }else{
      this.setData({
        quIndex: e.detail.value,
        quId:quArr[e.detail.value].id,
        quNull:true,
      });
    }
    if(type<3){
      type=Number(type)+Number(1);
      this.china_city(type);
    }

  },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      
    },

 
})