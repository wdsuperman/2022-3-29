var app=getApp();
var is_submit = true
const api = require('../../api.js')
Page({

    data: {
      cid:1,
        // index: 0,
      array: [
        {
          title: '5-25kg',
          status: true
        },
        {
          title: '25-50kg',
          status: false
        },
        {
          title: '50-100kg',
          status: false
        },
        {
          title: '100kg以上',
          status: false
        }
      ],
      // +++++++++
      wupin: [//物品列表
    
      ],
      arr: [],
      index: 0,
      cid:1,
      cname:'废纸',
        multiIndex: [0, 0],
        multiArray: [['2020-07-01', '2020-07-02'], ['10:00', '10:30', '11:00', '11:30', '12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00']],
        pickerStatus:false,
      //  cate:{},
        hs_address:'请选择地址',
        add_id:'',
    },
    bindPickerChange: function(e) { //重量选择
        this.setData({
          index: e.detail.value
        })
      },
      changePicker(){
        this.setData({
          pickerStatus:false
        })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      console.log(this.data.add_id)
      if (options.add_id){
        this.setData({
          add_id: options.add_id,
          hs_address: options.hs_address,
        })
      }
      if (options.cid) {
        this.setData({
          cid: options.cid,
        })
      }
      console.log(this.data.cid)
      var that = this
      var uid = app.d.userId
      if (uid == 1) {
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
        return false;
      }
     
      that.loadOrderStatus(); 

    },
  changeWupin(e) { //修改默认值
    let { wupin } = this.data
    let { cname } = wupin[e.detail.value]
    this.setData({
      index: e.detail.value,
      cname: cname,
    })
    let { id } = wupin[e.detail.value]
  },
  changeArr() { //选择列表
    let newArr = []
    let { wupin,cid } = this.data
    wupin.map((i, ind) => {
      if (i.id == cid) {
        this.setData({
          index: ind,
          cname: i.cname,
        })
      }
    })

    wupin.map(i => {
      newArr.push(i.cname)
    })
    this.setData({
      arr: newArr
    })
   
  },
    dizhi(){
      wx.navigateTo({
        url: '../my/dizhi',
      })
    },
    submit(){ //提交
 

      wx.showLoading({
        title: '提交中，请稍后',
      })
      let { array, multiIndex, multiArray, pickerStatus, dizhi, add_id, hs_address, cname } = this.data
      // let { index, array, multiIndex, multiArray, pickerStatus, add_id, hs_address} = this.data
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
      let kg = array.find(i => i.status == true).title
      if (!is_submit) return false;
      is_submit = false
      let that = this
      wx.request({
        url: app.d.hostUrl + '/Api/index/yuyue_add',
        method: 'post',
        data: {
          uid:app.d.userId,
          times: times,
          add_id: add_id,
          access: kg,
          cname:cname,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*'
        },
        success: function (res) {
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
             wx.switchTab({
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
        },
        complete: function () {
        
        }
      });
     

    },
  changeKg(e) { //点击选择公斤数
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
    bindMultiPickerChange: function (e) { //时间选择
      this.setData({
        multiIndex: e.detail.value,
        pickerStatus:true
      })
    },
 

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
   
    },
  // *****************************************
  //获取数据
  // *****************************************
  loadOrderStatus: function () {
    let that = this
    wx.request({
      url: app.d.hostUrl + '/Api/index/yuyue',
      method: 'post',
      data: {
        uid:app.d.userId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      },
      success: function (res) {
        console.log(res)
        
        var status = res.data.status
          that.setData({
            wupin: res.data.cate,
            multiArray: res.data.time,
            
          })
          if(that.data.add_id==''){
            that.setData({
              add_id: res.data.address.id,
              hs_address: res.data.address.hs_address,
            })
          }
          that.changeArr()
       }
    });

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

    
})