var app = getApp(); 
var is_submit=true;
const api = require('../../api.js')
Page({
    data: {
        address_xq:'您还没添加地址，点击添加',
        multiIndex: [0, 0],
        multiArray: [['2021-06-14', '2021-06-15'], ['10:00', '10:30', '11:00', '11:30', '12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00']],
        pickerStatus:false,
        fw_tc:true,
        array: [
          {
            title: '5-10kg',
            title1: '约8-20件',
            status: true
          },
          {
            title: '10-20kg',
            title1: '约20-40件',
            status: false
          },
          {
            title: '20-30kg',
            title1: '约40-60件',
            status: false
          },
          {
            title: '30kg以上',
            title1: '约60件',
            status: false
          }
        ],
        tanchuang: false, //弹窗
        bztanchuang: false, //备注弹窗
        content:'',
        add_id:0,
        brand_id:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       
    },
    closeTanchuang(e) { //关闭弹窗
      let { type } = e.currentTarget.dataset
      if(type==1){//上门范围弹窗 
        this.setData({
          tanchuang: false
        })  
      }else if(type==2){ //备注弹窗
        this.setData({
          bztanchuang: false
        })  
      }
    },
    click(e){
      let { type } = e.currentTarget.dataset
      if(type==1){//上门范围弹窗 
        this.setData({
          tanchuang: true
        })  
      }else if(type==2){ //备注弹窗
        this.setData({
          bztanchuang: true
        })  
      }else if(type==3){ //跳转地址
         wx.navigateTo({
           url: '../my/dizhi',
         })
      }
    },
    // 选择类别
    changeBrand(e){
      let { id } = e.currentTarget.dataset
      this.setData({
        list: this.data.list.map(i => {
          i.status = false
          if (id == i.id) {
            i.status = true
          }
          return i
        }),
        brand_id:id
      })
    },
    bindTextAreaBlur: function(e){
      console.log(e)
      this.setData({
        content:e.detail.value,
        // ceshidd:e.detail.value.input
       })
   },
    // 点击选择公斤数
    changeKg(e) { 
      let { title } = e.currentTarget.dataset
      this.setData({
        array: this.data.array.map(i => {
          i.status = false
          if (title == i.title) {
            i.status = true
          }
          return i
        })
      })
    },
    //时间选择
    bindMultiPickerChange: function (e) { 
        this.setData({
          multiIndex: e.detail.value,
          pickerStatus:true
        })
      },
    // 提交
    submit(){
      let { array, multiIndex, multiArray, pickerStatus, content, add_id, address_xq ,brand_id} = this.data
      if(!add_id){
        wx.showToast({
          title: '请选择回收地址',
          icon:'none',
          duration: 2000
        });
        return false;
      }
      if(pickerStatus){
        var times = multiArray[0][multiIndex[0]] +' '+ multiArray[1][multiIndex[1]]
      }else{
       var  times ='尽快上门'
      }
      let weight = array.find(i => i.status == true).title
      if (!is_submit) return false;
      is_submit = false
      let that = this
      api.getAPI('index/yuyue_add',{  
        uid: wx.getStorageSync('uid'),
        times,
        add_id,
        weight,
        content,
        brand_id,
        address_xq,
      }).then(res => {
          console.log(res)
          wx.hideLoading()
          var status = res.data.status
         if(status==1){
           wx.showToast({
             title: '预约成功！',
             icon: 'none',
             duration: 2000
           });
           setTimeout(function () {
             is_submit = true
             wx.navigateTo({
              url: '../dingdan/index',
             })
           }, 2000)
         } else {
           is_submit = true
           wx.showToast({
             title: res.data.err,
             icon: 'none',
             duration: 2000
           });
         }
      });
    } , 
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      var that=this
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
      wx.showLoading({
            title: '加载中',
      })
      api.getAPI('index/cate',{
             uid
            }).then(res => {
              wx.hideLoading({
                success: (res) => {},
              })
             
              if (res.data.status == 1) {
                console.log(res.data)
                that.setData({
                  list: res.data.list,
                  multiArray: res.data.time,
                  smfw:res.data.smfw,
               
                  brand_id: res.data.list[0].id
                })
                if(!app.d.add_id){
                  that.setData({
                    address_xq:res.data.address.address_xq,
                    add_id:res.data.address.id,
                  }) 
                }else{
                  that.setData({
                    address_xq:app.d.address_xq,
                    add_id:app.d.add_id,
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

 
})