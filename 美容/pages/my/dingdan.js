// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
// var common = require("../../utils/common.js");
Page({  
  data: {  
    winWidth: 0,  
    winHeight: 0,  
    // tab切换  
    currentTab: 0,  
    isStatus:'all',//10待付款，20待发货，30待收货 40、50已完成
    page:2,
    refundpage:0,
    orderList0:[],
    orderList1:[],
    orderList2:[],
    orderList3:[],
    orderList4:[],
    'click': 'clickthere',
    'click1': '',
    'click2': '',
    pl_pid:'',
    pl_oid:'',
    windowHeight:'',

  },  
  onLoad: function(options) {  
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 高度,宽度 单位为px
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    this.initSystemInfo();
  /*  this.setData({
    currentTab: parseInt(options.currentTab),
      isStatus:options.otype
    });*/

    if(this.data.currentTab == 4){
      this.loadReturnOrderList();
    }else{
      this.loadOrderList();
    }
  },  
  getOrderStatus:function(){
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ?2 :this.data.currentTab == 3 ? 3:0;
  },

  gwc:function(e){
  wx.showLoading({
    title: '加入中',
  })
    var orderId = e.currentTarget.dataset.orderid,that=this
    console.log(orderId)
    wx.request({
      url: app.d.ceshiUrl + 'Order/fh_gwc',
      method:'post',
      data: {
        order_id: orderId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
        var status = res.data.status;
        if(status == 1){
          wx.showToast({
            title: '操作成功,商品已重新加入购物车',
            icon:'none',
            duration: 2000
          });
          that.loadOrderList();
        }else{
          wx.showToast({
            title: res.data.err,
            icon:'none',
            duration: 2000,
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

//取消订单
removeOrder:function(e){
  var that = this;
  var orderId = e.currentTarget.dataset.orderid;
  console.log(e)
  console.log(orderId)
    wx.showModal({
      title: '提示',
      content: '你确定要取消订单吗？',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + 'Order/orders_edit',
          method:'post',
          data: {
            id: orderId,
            type:'cancel',
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            var status = res.data.status;
            if(status == 1){
              wx.showToast({
                title: '操作成功！',
                icon:'none',
                duration: 2000
              });
              that.loadOrderList();
            }else{
              wx.showToast({
                title: res.data.err,
                icon:'none',
                duration: 2000
              });
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });

      }
    });
  },

  //确认收货
recOrder:function(e){
    var that = this;
  var orderid = e.currentTarget.dataset.orderid;
  console.log(orderid)
    wx.showModal({
      title: '提示',
      content: '确认使用后将无法退款，请与商家沟通后确认！',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + 'Order/orders_edit',
          method:'post',
          data: {
            id: orderid,
            type:'receive',
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            var status = res.data.status;
            if(status == 1){
              wx.showToast({
                title: '操作成功！',
                icon:'none',
                duration: 2000
              });
              that.loadOrderList();
            }else{
              wx.showToast({
                title: res.data.err,
                icon:'none',
                duration: 2000
              });
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              icon:'none',
              duration: 2000
            });
          }
        });

      }
    });
  },
//用户点单
  loadOrderList: function(){
    console.log(this.data.currentTab)
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + 'Order/index',
      method:'post',
      data: {
        uid:app.d.userId,
        order_type:that.data.isStatus,
      //  page:that.data.page,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        console.log(res)
        var status = res.data.status;
        var list = res.data.ord;
        that.setData({
          orderList0: list,
        
        
        });
        /*switch(that.data.currentTab){
          case 0:
            that.setData({
              orderList0: list,
            });
            break;
          case 1:
            that.setData({
              orderList1: list,
            });
            break;  
          case 2:
            that.setData({
              orderList2: list,
            });
            break;
          case 3:
            that.setData({
              orderList3: list,
            });
            break;
          case 4:
            that.setData({
              orderList4: list,
            });
            break;  
        }*/
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          icon:'none',
          duration: 2000
        });
      }
    });
  },
//跳转产品
product:function(e){
  var proid = e.currentTarget.dataset.pid;
  var that = this
  wx.navigateTo({
    url: '../product/detail?productId=' + proid,
  })
},
loadReturnOrderList:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + 'Order/order_refund',
      method:'post',
      data: {
        uid:app.d.userId,
        page:that.data.refundpage,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {     
        console.log(res)  
        var data = res.data.ord;
        var status = res.data.status;
        if(status==1){
          that.setData({
            orderList0: that.data.orderList4.concat(data),
          });
        }else{
          wx.showToast({
            title: res.data.err,
            icon:'none',
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          icon:'none',
          duration: 2000
        });
      }
    });
  },
  
  // returnProduct:function(){
  // },
  initSystemInfo:function(){
    var that = this;  
    wx.getSystemInfo( {
      success: function( res ) {  
        that.setData( {  
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight  
        });  
      }    
    });  
  },
  bindChange: function(e) {  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
  },
  //点击切换状态  
  swichNav: function(e) {  
    console.log(e)
    var that = this;  
    if( that.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else { 
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
        page: 2,
      });
      console.log(that.data.currentTab)
      //没有数据就进行加载
      switch(that.data.currentTab){
          case 0://全部
            that.loadOrderList();
            break;
          case 1://代付款
            that.loadOrderList();
            break;  
          case 2://待确定
            that.loadOrderList();
            break;
          case 3://已完成
             that.loadOrderList();
            break;
          case 4://退款
            that.loadReturnOrderList();
            break;
        }
    };
  },
  /**
   * 微信支付订单
   */
  // payOrderByWechat: function(event){
  //   var orderId = event.currentTarget.dataset.orderId;
  //   this.prePayWechatOrder(orderId);
  //   var successCallback = function(response){
  //     console.log(response);
  //   }
  //   common.doWechatPay("prepayId", successCallback);
  // },

  payOrderByWechat: function (e) {
    var order_id = e.currentTarget.dataset.orderid;
    var order_sn = e.currentTarget.dataset.ordersn;
    if(!order_sn){
      wx.showToast({
        title: "订单异常!",
        icon:'none',
        duration: 2000,
      });
      return false;
    }
    console.log(order_id);
   wx.showToast({
      title: "请稍等!",
      icon:'none',
      duration: 2000,
    });
    /**wx.navigateTo({
      url: '../user/pay?order_id='+ order_id ,
    })*/
   wx.request({
      url: app.d.ceshiUrl + 'Wxpay/wxpay',
      data: {
        order_id: order_id,
        order_sn: order_sn,
        uid: app.d.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                icon:'none',
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan?otype=deliver',
                });
              }, 3000);
            },
            fail: function (res) {
              wx.showToast({
                title: '支付失败',
                icon:'none',
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            icon:'none',
            duration: 2000
          });
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '支付失败' ,
          icon:'none',
          duration: 2000
        });
      }
    })
  },
  onUnload: function () {
    wx.reLaunch({
      url: '../user/user',
    })
  },
  //下拉刷新菜单
  bindDownLoad:function(){
    wx.showLoading({
      title: '正在加载',
    })

    var that = this;
    wx.request({
      url: app.d.ceshiUrl + 'Order/get_more',
      method: 'post',
      data: {
        uid: app.d.userId,
        page: that.data.page,
        order_type: that.data.isStatus,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        wx.hideLoading({
          success: (res) => {},
        })
        var data = res.data.ord;
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            orderList0: that.data.orderList0.concat(data),
            page: that.data.page+1,
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
        // fail
        wx.showToast({
          title: '网络异常！',
          icon:'none',
          duration: 2000
        });
      }
    });
    
  },
  //退款跳转
  tuikuan:function(e){
    var orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../user/tuihuo?orderId='+orderid,
    })

  },
  //订单详情页
  xiangqing:function(e){
    var orderid=e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../user/xiangqing?orderid=' + orderid,
    })
  },
  //评价
  pingjia:function(e){
   
    var pid = e.currentTarget.dataset.pid;
    var orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../product/pinglun?pid=' + pid + '&orderid=' + orderid,
    })


  },

  /**
   * 调用服务器微信统一下单接口创建一笔微信预订单
   */
//   prePayWechatOrder: function(orderId){
//     var uri = "/ztb/userZBT/GetWxOrder";
//     var method = "post";
//     var dataMap = {
//       SessionId: app.globalData.userInfo.sessionId,
//       OrderNo: orderId
//     }
//     console.log(dataMap);
//     var successCallback = function (response) {
//       console.log(response);
//     };
//     common.sentHttpRequestToServer(uri, dataMap, method, successCallback);
//   }
})