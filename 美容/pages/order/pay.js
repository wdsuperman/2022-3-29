var app = getApp();
// pages/order/downline.js
Page({
  data:{
    itemData:{},
    userId:0,
    paytype:'weixin',//0线下1微信
    remark:'',
    cartId:0,//购物车购买所选商品id
    proId:'',//直接购买商品id
    gid:'',
    addrId:0,//收货地址//测试--
    btnDisabled:false,
    productData:[],
    address:{},
    total:0,
    all_price:0,
    vprice:0,
    vid:0,
    addemt:1,
    vou:[],
    'or_bg': '../../images/or_no.png',
    'o': 'or',
    yhprice:'0',
    jf_price:'',//积分金额
    pro_jf:'',//抵扣积分
    num:'',//商品件数
    user_recharge:0,//账户可用金额
    zf_type:'',
    user: '',//会员详情
    xs_mima: 'none',
    order_id:'',
    order_sn:'',
    vou_price:0,//优惠券抵扣金额
  },

  or: function (e) {
    let  jf_price= e.currentTarget.dataset.jf_price;
    console.log(jf_price)
    this.setData({
      'or_bg': '../../images/or_yes.png',
      'o': 'orno',
      yhprice: '1',
      jf_price: jf_price,
    })
  },
  orno: function () {
    this.setData({
      'or_bg': '../../images/or_no.png',
      'o': 'or',
       yhprice: '0',
    })
  },
  onLoad:function(options){
    var value = wx.getStorageSync('OPEN_ID')
    var tel = wx.getStorageSync('tel')
    // if (!tel) {
    //   wx.showModal({
    //     content: '您未登录，无法获取该权限，请先登录',
    //     success: function (res) {
    //       if (res.cancel) {
    //         wx.redirectTo({
    //           url: 'user-address/user-address?cartId=' + cartId + "&url_title=" + url_title + "&info=" + info
    //         });
    //         //点击取消,默认隐藏弹框
    //       } else {
    //         wx.navigateTo({
    //           url: '../login/login'
    //         });
    //       }
    //     },
    //   })
    //   return false
    // }
    if (!value) {
      wx.showModal({
        content: '您未授权，无法获取该权限，请先授权',
        success: function (res) {
          if (res.cancel) {
            wx.redirectTo({
              url: 'user-address/user-address?cartId=' + cartId + "&url_title=" + url_title + "&info=" + info
            });
            //点击取消,默认隐藏弹框
          } else {
            wx.navigateTo({
              url: '../login/index'
            });
          }
        },
      })
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    var uid = app.d.userId;
    if (options.cartId){
      this.setData({
        cartId: options.cartId,
        userId: uid,
        url_title: 'cart',
      });
      wx.hideLoading()
      this.loadProductDetail();

    } else if (options.info){
      var aa = options.info.split(',')
      var pid = aa[0]
      var num = aa[1]
      var ggid = aa[2]
      this.setData({
        url_title:'zhijie',
        info: options.info,//从地址跳回使用
        proId:pid,
        num: num,
        gid: ggid,
        userId: uid
      });
      wx.hideLoading()
      this.zhijie();
    } 
  },

  //直接结算获取商品
  zhijie:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    
    
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/pay_product',
      method: 'post',
      data: {
        proid: that.data.proId,
        num: that.data.num,
        gid: that.data.gid,
        uid: that.data.userId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        wx.hideLoading()
        var adds = res.data.adds;
        if (adds) {
          var addrId = adds.id;
          that.setData({
            address: adds,
            addrId: addrId
          });
        }
        that.setData({
          addemt: res.data.addemt,
          productData: res.data.pro,
          total: res.data.price,
          all_price: res.data.price,
          yftype: res.data.yftype,
          vprice: res.data.price,
          pro_jf: res.data.pro_jf,

          num: res.data.num,
          vou: res.data.vou,
          user: res.data.user,
          user_recharge: res.data.user.recharge,
        });
     
      },
    });
  },

  //购物车结算
  loadProductDetail:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/buy_cart',
      method:'post',
      data: {
        cart_id: that.data.cartId,
        uid: that.data.userId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
      
        wx.hideLoading()
        var adds = res.data.adds;
        if (adds){
          var addrId = adds.id;
          that.setData({
            address: adds,
            addrId: addrId
          });
        }
        that.setData({
          addemt: res.data.addemt,
          productData:res.data.pro,
          total:res.data.price,
          all_price: res.data.price,
          vprice: res.data.price,
          yftype: res.data.yftype,
          vou: res.data.vou,
          pro_jf: res.data.pro_jf, 
          num:res.data.num,
          user: res.data.user,
          user_recharge: res.data.user.recharge,
        });
      },
    });
  },

  remarkInput:function(e){
    this.setData({
      remark: e.detail.value,
    })
  },

 //选择优惠券
  getvou:function(e){
    var vid = e.currentTarget.dataset.id;
    var price = e.currentTarget.dataset.price;
    var zprice = this.data.vprice;
    var cprice = parseFloat(zprice) - parseFloat(price);
    this.setData({
      total: cprice,
      vid: vid,
      vou_price:price,
      show_coupon_picker:false,
    })
  }, 

//微信支付
  createProductOrderByWX:function(e){
    var zf_type= e.currentTarget.dataset.type
    this.setData({ zf_type:zf_type})
    var tel = wx.getStorageSync('tel')
    var value = wx.getStorageSync('OPEN_ID')
    // if (tel==''){
    //   wx.showModal({
    //     title: '提示',
    //     content: '购买之前请先注册',
    //     success: function (res) {
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '../login/login'
    //         })
    //       }
    //     }
    //   })
    // } else 
    if (value==''){
      wx.showModal({
        title: '提示',
        content: '购买之前请先授权',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/index'
            })
          }
        }
      })
    }

    if (this.data.addemt!=0){
      wx.showToast({
        title: '收货地址不能为空',
        icon:'none',
        duration: 1500
      });
      return false
    }
    this.setData({
      paytype: 'weixin',
    });

  if(this.data.all_price<300){
    wx.showToast({
      title: '金额未达到300，无法购买',
      icon:'none',
      duration: 1500
    });
    return false
  } 
  if(this.data.proId){//直接购买
    this.pay_now();
  } else if (this.data.cartId){//购物车购买
    this.createProductOrder();
  }
  },
  //直接确认订单
  pay_now: function () {
    this.setData({
      btnDisabled: false,
    })
    console.log(this.data.jf_price)
    //创建订单
    var that = this;
    console.log(that.data.total)
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/pay_now',
      method: 'post',
      data: {
        uid: that.data.userId,
        num: that.data.num,
        yftype: that.data.yftype,
        proid: that.data.proId,
        type: that.data.paytype,
        aid: that.data.addrId,//地址的id
        vid:that.data.vid,
        remark: that.data.remark,//用户备注
        price: that.data.total,//总价
        gid: that.data.gid,//规格ID
        yh: that.data.yhprice,//是否使用红包
        jf_price: that.data.jf_price,//积分抵扣金额
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
       console.log(res)
  
        var data = res.data;
        if (data.status == 1) {
          if (data.arr.pay_type == 'weixin') {
            //微信支付
            if (that.data.zf_type =='yue'){
              wx.showModal({
                title: '',
                content: '您将用余额进行支付',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.zf_yue(data.arr)
                  } else {
                    console.log('用户点击取消')
                  }

                }
              })
            }else{
              that.wxpay(data.arr);
            }
          }
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2500
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },


  //购物车确认订单
  createProductOrder:function(){
    this.setData({
      btnDisabled:false,
    })
    //创建订单
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/payment',
      method:'post',
      data: {
        uid: that.data.userId,       
        cart_id: that.data.cartId,
        yftype: that.data.yftype,
        proid: that.data.proId,
        type:that.data.paytype,
        aid: that.data.addrId,//地址的id
        remark: that.data.remark,//用户备注
        price: that.data.total,//总价
        vid: that.data.vid,//优惠券ID
        yh: that.data.yhprice,//是否使用红包
        jf_price: that.data.jf_price,//积分抵扣金额
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        var data = res.data;
        if(data.status == 1){
          if(data.arr.pay_type == 'weixin'){
            //微信支付
            if (that.data.zf_type == 'yue') {
              wx.showModal({
                title: '',
                content: '您将用余额进行支付',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.zf_yue(data.arr)
                  } 
                }
              })
            } else {
              that.wxpay(data.arr);
            }
          }
        }else{
          wx.showToast({
            title: res.data.err,
            duration:2500
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },
  
  //调起微信支付
  wxpay: function(order){
    wx.showToast({
      title: "请稍等!",
      duration: 2000,
    });
      wx.request({
        url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
        data: {
          order_id:order.order_id,
          order_sn:order.order_sn,
          uid:this.data.userId,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Content-Type':  'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){
          console.log(res);
          if(res.data.status==1){
            var order=res.data.arr;
            var appid = order.appId
            if (appid=='') {
              wx.showToast({
                title: '支付失败',
                duration: 3000
              })
            }
            wx.requestPayment({
              timeStamp: order.timeStamp,
              nonceStr: order.nonceStr,
              package: order.package,
              signType: 'MD5',
              paySign: order.paySign,
              success: function(res){
                wx.showToast({
                  title:"支付成功!",
                  duration:2000,
                });
                setTimeout(function(){
                  wx.navigateTo({
                    url: '../user/dingdan',
                  });
                },2500);
              
              },
              fail: function(res) {
                wx.showToast({
                  title: '网络异常！err1:createProductOrder',
                  duration:3000
                })
              }
            })
          }
        },
        fail: function() {
          wx.showToast({
            title: '网络异常！err2:wxpay',
            duration: 2000
          });
        }
      })
  },

    //调起余额支付
    // zf_yue: function(order) {
    //   //支付密码打开
    //   this.setData({
    //     xs_mima: '',
    //     order_id:order.order_id,
    //     order_sn:order.order_sn,
    //   })
    // },  
  //关闭支付密码
  hidden: function () {
    this.setData({
      xs_mima: 'none',
    })
  },
  zf_yue: function (order) {
    var that=this;
    wx.request({
            url: app.d.ceshiUrl + '/Api/Payment/zf_yue',
            data: {
              order_id: order.order_id,
              order_sn: order.order_sn,
              uid: that.data.userId,
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }, // 设置请求的 header
            success: function (res) {
              console.log(res);
              if (res.data.status == 1) {
                wx.showToast({
                  title: '支付成功',
                  info: 'none',
                  duration: 1500
                })
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../user/dingdan',
                  });
                }, 1500);
              }else{
                wx.showToast({
                  title: res.data.err,
                  info:'none',
                  duration: 2000
                });
                setTimeout(function () {
                  if (res.data.err =='限购一次！'){
                    wx.navigateBack({})
                  }
                }, 1500);
              }
            },
            fail: function () {
              wx.showToast({
                title: '网络异常！err2:wxpay',
                info: 'none',
                duration: 2000
              });
            }
          }) 
  },
  //账户余额支付
  // yue_pay:function(e){
  //   var password = e.detail.value.password
  //   if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(password) == false) {
  //     wx.showModal({
  //       content: '密码由数字和字母组成',
  //     })
  //     return false
  //   }
  //   wx.showToast({
  //     title: "请稍等!",
  //     icon:'loading',
  //     duration: 2000,
  //   });
  //   var that=this
  //   wx.request({
  //     url: app.d.ceshiUrl + '/Api/User/txmoney_psw',
  //     method: 'post',
  //     data: {
  //       uid: app.d.userId,
  //       password: password
  //     },
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function (res) {
  //       var status = res.data.status;
  //       if (status == 1) {
  //         wx.request({
  //           url: app.d.ceshiUrl + '/Api/Payment/zf_yue',
  //           data: {
  //             order_id: that.data.order_id,
  //             order_sn: that.data.order_sn,
  //             uid: that.data.userId,
  //           },
  //           method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  //           header: {
  //             'Content-Type': 'application/x-www-form-urlencoded'
  //           }, // 设置请求的 header
  //           success: function (res) {
  //             console.log(res);
  //             if (res.data.status == 1) {
  //               wx.showToast({
  //                 title: '支付成功',
  //                 duration: 3000
  //               })
  //               setTimeout(function () {
  //                 wx.navigateTo({
  //                   url: '../user/dingdan',
  //                 });
  //               }, 2500);
  //             }
  //           },
  //           fail: function () {
  //             wx.showToast({
  //               title: '网络异常！err2:wxpay',
  //               duration: 2000
  //             });
  //           }
  //         }) 
  //       }else{
  //         wx.showToast({
  //           title: res.data.err,
  //           duration: 2000
  //         });
  //       }
  //     }
  //   });
  // },
  // 打开优惠券列表
  showCouponPicker:function(e){
    this.setData({
      show_coupon_picker: true
    })
  },
  // 选择地址
  goToAddress:function(e){
    wx.navigateTo({
      url: '../address/user-address/user-address?cartId='+this.data.cartId+'&url_title='+this.data.url_title+'&info='+this.data.info
    })
  },

});   