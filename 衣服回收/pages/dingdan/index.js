var app=getApp();
var is_submit=true;
const api = require('../../api.js')
Page({
    data: {
        page: 2,
        isStatus:0,
        tab:[ //分类
            {
                title:'所有记录',
                status:true,
                type:0
            },
            {
                title:'待完成',
                status:false,
                type:1
            },
            {
                title:'上门中',
                status:false,
                type:2
            },
            {
                title:'已完成',
                status:false,
                type:3
            },
      ], 
        list:[],
     
    },
    clickTab(e){
        let {type} = e.currentTarget.dataset
        let {tab,lists} = this.data
        this.setData({
            isStatus: type,
            page:2,
            tab:tab.map( i => {
                i.status = false
                if(i.type == type){
                    i.status = true
                }
                return i
            }),
            // showLists:lists.filter(i => type == 0 ? i.status == '未接单':type == 1 ? i.status == '已接单':type == 2 ? i.status == '已完成':type == 3 ? i.status == '已取消':'')
        })
      this.loadOrderList();
    },
    detail(e){ //点击列表跳转详情
      var oid = e.currentTarget.dataset.oid
       wx.navigateTo({
         url: './detail?id=' + oid,
       })
       
    },
    quxiao(e){ //取消订单
      wx.showLoading({
        title: '取消中',
      })
      var cindex = e.currentTarget.dataset.index
      var that = this;
      wx.request({
        url: app.d.hostUrl + '/Order/quxiao',
        method: 'post',
        data: {
          oid: e.currentTarget.dataset.oid,
          uid:  wx.getStorageSync('uid'),
         // order_type: that.data.isStatus,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideLoading()
          var status = res.data.status;
          if(status==1){
            wx.showToast({
              title: '取消成功',
              icon: "none",
              duration: 2000
            }); 
            that.data.list.splice(cindex, 1); //当减为0的时候删除该项内容  
            that.setData({
              list: that.data.list
            })    
          }else{
            wx.showToast({
              title: res.data.err,
              icon: "none",
              duration: 2000
            }); 
          }
         
        },
        fail: function () {
          wx.hideLoading()
          wx.showToast({
            title: '网络异常！',
            icon: "none",
            duration: 2000
          });
        },
     
      });
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
  //用户点单
  loadOrderList: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    console.log(that.data.isStatus)
   
    api.getAPI('order/index',{
      uid:  wx.getStorageSync('uid'),
      order_type: that.data.isStatus,
     }).then(res => {
        wx.hideLoading({
          success: (res) => {},
        })
        console.log(res.data)
        if (res.data.status == 1) {
          that.setData({
            list: res.data.ord,
         });
        } else {
          wx.showToast({
            title: res.data.err,
            icon: 'none'
          })
        }
      }) 
  },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      var that = this
      var uid= wx.getStorageSync('uid')
      if (!uid) {
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
      that.loadOrderList(); 
    },

  //下拉刷新菜单
  onReachBottom: function () {
    var that = this;
    if (!is_submit) return;
    is_submit = false
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.d.hostUrl + '/Order/get_more',
      method: 'post',
      data: {
        uid:  wx.getStorageSync('uid'),
        page: that.data.page,
        order_type: that.data.isStatus,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
       
        var data = res.data.ord;
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            list: that.data.list.concat(data),
            page: that.data.page + 1,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            icon:'none',
            duration: 2000
          });
        }
      },
      fail: function () {
       
        wx.showToast({
          title: '网络异常！',
          icon: 'none',
          duration: 2000
        });
      },
      complete: function () {
        wx.hideLoading();
        is_submit = true
      },
    });

  },

  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      return {
        title: "这个小程序很方便呦。。。",
        path: 'pages/index/index',
        success: function (res) {
          console.log(res, "转发成功")
        },
        fail: function (res) {
          console.log(res, "转发失败")
        }
      }
    }
})