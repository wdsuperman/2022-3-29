// // pages/index/details.js
// Page({

//     /**
//      * 页面的初始数据
//      */
//     data: {

//     },

//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad: function (options) {

//     },

//     /**
//      * 生命周期函数--监听页面初次渲染完成
//      */
//     onReady: function () {

//     },

//     /**
//      * 生命周期函数--监听页面显示
//      */
//     onShow: function () {

//     },

//     /**
//      * 生命周期函数--监听页面隐藏
//      */
//     onHide: function () {

//     },

//     /**
//      * 生命周期函数--监听页面卸载
//      */
//     onUnload: function () {

//     },

//     /**
//      * 页面相关事件处理函数--监听用户下拉动作
//      */
//     onPullDownRefresh: function () {

//     },

//     /**
//      * 页面上拉触底事件的处理函数
//      */
//     onReachBottom: function () {

//     },

//     /**
//      * 用户点击右上角分享
//      */
//     onShareAppMessage: function () {

//     }
// })

const api = require('../../api.js')
var app = getApp();
Page({
  firstIndex: -1,
  data: {
    maskHidden: false,
    imagePath: '',
    fxphoto: '',
    path: '',
    bannerApp: true,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0, //tab切换  
    productId: 0,//产品id
    itemData: {},//产品详情
    bannerItem: [],//轮播图
    content:'',
    buynum: 1,//
    guigelist:'',//规格
    shop:'',//商户
    price:'',//价格
    num:'',//库存
    pinglun:'',//评论
    ggname:'',//规格名称
    shoucang:'0',//收藏图片显示
    user_dj:'0',
    // 产品图片轮播
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    'xuanze': 'none',
    'productCan': 'none',

  },

  showBuy: function () {
    this.setData({
      'xuanze': 'block'
    })
  },
  close_buy: function () {
    this.setData({
      'xuanze': 'none'
    })
  },
  productCanshu: function () {
    this.setData({
      'productCan': 'block'
    })
  },
  clickSure: function () {
    this.setData({
      'productCan': 'none'
    })
  },


 
  // 加减
  changeNum: function (e) {
    var that = this,paynum=that.data.itemData.paynum
    console.log(paynum)
    if (e.target.dataset.alphaBeta == 0) {
      if (this.data.buynum <= 1) {
        buynum: 1
      } else {
        let buynum= that.data.buynum - 1
        if(paynum!=0 ){
          if(buynum>paynum){
            wx.showToast({
              title: '商品限购'+paynum+'件',
              icon:'none',
              duration: 2000,
            });
          }else{
            this.setData({
              buynum: buynum
            })
          }
        }else{
          this.setData({
            buynum: buynum
          })
        }
      };
    } else {
      let buynum= that.data.buynum + 1
      if(paynum!=0){
        if(buynum>paynum){
          wx.showToast({
            title: '商品限购'+paynum+'件',
            icon:'none',
            duration: 2000,
          });
        }else{
          this.setData({
            buynum: buynum
          })
        } 
      }else{
        this.setData({
          buynum: buynum
        })
      }
      
    };
  },
  // 传值
  onLoad: function (option) {
    var that = this;
    let {productId} = option
    if(option.productId){
      productId = option.productId
    }
    that.setData({
      productId,
    });

    if(option.oneuid){
      app.d.oneuid = option.oneuid
    }
    that.loadProductDetail();
    var that = this
    var uid = wx.getStorageSync('uid')
    if(!uid){
      wx.showModal({
        title:'为了您更好的体验,请先同意授权',
        success(){
          wx.navigateTo({
            url: `/pages/login/index`,
          })
        }
      })
    }
  },
  // 商品详情数据获取
  loadProductDetail: function () {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + 'Product/index',
      method: 'post',
      data: {
        pro_id: that.data.productId,
        uid: app.d.userId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      },
      success: function (res) {
        //--init data 
        var status = res.data.status;
        console.log(res);
        if (status == 1) {
          var pro = res.data.pro;
          var shop = res.data.shop;
          var guigelist = res.data.guigelist;
          var content = pro.content.replace(/\<img/gi, '<img style="width: 100% ;max-width:100%;height:auto" ') //防止富文本图片过大
          var content = content.replace(/\<section/gi, '<p ') //防止富文本图片过大
          that.setData({
            itemData: pro,
            shop: shop,
            price: pro.price,
            content: content,
            num: pro.num,
            bannerItem: pro.img_arr,
            guigelist: guigelist,
            shoucang: pro.collect,
            pinglun: res.data.pinglun,
            user_dj: res.data.user_dj,
            ggid: '1',
          });
        } else {
          wx.showToast({
            title: res.data.err,
            icon:'none',
            duration: 2000,
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          icon:'none',
          duration: 2000,
        });
      },
    });
  },
  //规格选择
  ggtype:function(e){
    var ggid= e.currentTarget.dataset.ggid
    var price = e.currentTarget.dataset.ggprice
    var num = e.currentTarget.dataset.ggnum
    var ggname = e.currentTarget.dataset.ggname
    this.setData({
      ggid: ggid,
      price: price,
      num: num,
      ggname: ggname,
    })

  },
  //跳回主页
  home:function(){
    wx.switchTab({
      url: '../index/index',
    })
 
   },
   //进入店铺
  shop:function(e){
    var shopid = e.currentTarget.dataset.shopid
   wx.navigateTo({
     url: '../shop/index?shopId=' + shopid,
   })
  },
  //添加到收藏
  addFavorites: function (e) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + 'Product/col',
      method: 'post',
      data: {
        uid: app.d.userId,
        pid: that.data.productId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // //--init data        
        var data = res.data;
        if (data.status == 1) {
          var shoucang = res.data.shoucang;
          if (shoucang=='0'){
            wx.showToast({
              title: '取消收藏！',
              icon:'none',
              duration: 2000
            });
          }else{
            wx.showToast({
              title: '收藏成功！',
              icon:'none',
              duration: 2000
            });
          }
          that.setData({
            shoucang: data.shoucang

          })
        } else {
          wx.showToast({
            title: data.err,
            icon:'none',
            duration: 2000
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          icon:'none',
          duration: 2000
        });
      }
    });
  },

  addShopCart: function (e) { //添加到购物车
    var that = this;
    if (that.data.itemData.is_hy=='0'){
      var tishi="购买"
    }else{
      var tishi = "兑换"
    }
    console.log(tishi)
    if (that.data.itemData.permission!='0'){//判断购买等级
      if (that.data.user_dj < that.data.itemData.permission) {
        wx.showModal({
          title: '',
          content: '本产品‘' + that.data.itemData.permission_name + '’才能' + tishi +'，您的等级不足，是否购买相应等级！',
          success: function (res) {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {
              wx.navigateTo({
                url: '../user/huiyuan',
              })
            }
          },
        })
        return false; 
      } 
    }
    if (!that.data.ggid){
      wx.showToast({
        title: '请选择规格',
        icon: 'success',
        duration: 2000
      });
      return false;
    };
    wx.request({
      url: app.d.ceshiUrl + 'Shopping/add',
      method: 'post',
      data: {
        uid: app.d.userId,
        pid: that.data.productId,
        num: that.data.buynum,
        ggid:that.data.ggid,
        price: that.data.price,
        shopid: that.data.shop.id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
      console.log(res);  
        var data = res.data;
        if (data.status == 1) {
          var ptype = e.currentTarget.dataset.type;
          if (ptype == 'buynow') {
            wx.redirectTo({
              url: '../order/pay?cartId=' + data.cart_id
            });
            return;
          } else {
            wx.showToast({
              title: '加入购物车成功',
              icon: 'success',
              duration: 2000
            });
            that.setData({
              xuanze: 'none'
            })
          }
        } else {
          wx.showToast({
            title: data.err,
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
  },
  //立即购买
  newpay:function(){
    var that = this;
    if (that.data.itemData.is_hy == '0') {
      var tishi = "购买"
    } else {
      var tishi = "兑换"
    }
    if (that.data.itemData.permission != '0') {//判断购买等级
      if (that.data.user_dj < that.data.itemData.permission) {
        wx.showModal({
          title: '',
          content: '本产品‘' + that.data.itemData.permission_name + '’才能' + tishi+'，您的等级不足，是否购买相应等级！',
          success: function (res) {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {
              wx.navigateTo({
                url: '../user/huiyuan',
              })
            }
          },
        })
        return false;
      }
    }
    if (!this.data.ggid) {
      wx.showToast({
        title: '请选择规格',
        icon: 'success',
        duration: 2000
      });
      return false;
    };
    var num = this.data.buynum
    var pid = this.data.productId
    var ggid = this.data.ggid
    
    var info = pid + ',' + num + ',' + ggid;
    wx.redirectTo({
      url: '../order/pay?info=' + info
    });
  },
  huiyuan:function(){
    wx.navigateTo({
      url: '../user/huiyuan',
    })
  },
  /**转发*/
  onShareAppMessage: function (e) {
    var uid = wx.getStorageSync('uid')
    var pid = this.data.productId
    var info = pid + ',' + uid;
    let userinfo = wx.getStorageSync('userInfo')
    var title = '好友' + userinfo.nickName + ',分享给您“' + this.data.itemData.name+'”'
    return {
      title: title,
      path: '/pages/index/details?oneuid=' + uid + '&productId=' + pid,
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },

  bindChange: function (e) {//滑动切换tab 
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  initNavHeight: function () {////获取系统信息
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  bannerClosed: function () {
    this.setData({
      bannerApp: false,
    })
  },
  swichNav: function (e) {//点击tab切换
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //跳转评论页面
  pinglun:function(e){
   var uid=app.d.userId
    if (uid==1){
     wx.showModal({
       title: '',
       content: '登入后才可留言。是否确认登录',
       success: function (res) {
         if (res.cancel) {
           //点击取消,默认隐藏弹框
         } else {
            wx.navigateTo({
              url: '../login/login',
            })
         }
       },
     })
     }
   var pid=e.currentTarget.dataset.pid
   wx.navigateTo({
     url: '../product/pinglun?pid='+pid,
   })
  },
//助学红包免费 
hongbao:function(){
  //购买等级是否符合
  var that = this;
  if (that.data.itemData.permission != '0') {//判断购买等级
    if (that.data.user_dj < that.data.itemData.permission) {
      wx.showModal({
        title: '',
        content: '本产品‘' + that.data.itemData.permission_name + '’才能兑换，您的等级不足，是否购买相应等级！',
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            wx.navigateTo({
              url: '../user/huiyuan',
            })
          }
        },
      })
      return false;
    }
  }
  var uid = app.d.userId
  var tel = wx.getStorageSync('tel')
  var value = wx.getStorageSync('OPEN_ID')
  if (tel == '') {
    wx.showModal({
      title: '提示',
      content: '购买之前请先注册',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login'
          })
        }
      }
    })
  } else if (value == '') {
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
  var pid = that.data.productId
  wx.showModal({
    content: '您将用店铺红包购买商品',
    success: function (res) {
      if (res.cancel) {
        //点击取消,默认隐藏弹框
      } else {
        
        wx.showToast({
          title: '请稍等',
          icon: 'loading',
          duration: 2000
        })
        wx.request({
          url: app.d.ceshiUrl + 'Payment/hongbaopay',
          method: 'post',
          data: {
            uid: app.d.userId,
            pid: pid,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/xiangqing?orderid=' + res.data.arr.order_id,
                });
              }, 2500);
            } else {
              wx.showToast({
                title: res.data.err,
                duration: 2000
              });
            }
          },
        });
       
      }
    },
  })

},
//免费商品
mianfei:function(){
  var that = this;
  var tel = wx.getStorageSync('tel')
  var value = wx.getStorageSync('OPEN_ID')
  if (tel == '') {
    wx.showModal({
      title: '提示',
      content: '购买之前请先注册',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login'
          })
        }
      }
    })
  } else if (value == '') {
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
  var pid = that.data.productId
  if (that.data.itemData.permission != '0') {//判断购买等级
    if (that.data.user_dj < that.data.itemData.permission) {
      wx.showModal({
        title: '',
        content: '本产品‘' + that.data.itemData.permission_name + '’才能兑换，您的等级不足，是否购买相应等级！',
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            wx.navigateTo({
              url: '../user/huiyuan',
            })
          }
        },
      })
      return false;
    }
  }
  wx.showModal({
    content: '是否确定购买这堂免费课程',
    success: function (res) {
      if (res.cancel) {
        //点击取消,默认隐藏弹框
      } else {
        wx.showToast({
          title: '请稍等',
          icon: 'loading',
          duration: 2000
        })
        wx.request({
          url: app.d.ceshiUrl + 'Payment/payfree',
          method: 'post',
          data: {
            uid: app.d.userId,
            pid: pid,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan',
                });
              }, 2500);
            } else {
              wx.showToast({
                title: res.data.err,
                duration: 2000
              });
            }
          },
        });

      }
    },
  })

},

  //*********************************** */
  //分享朋友圈
  //************************************ */
  // getSharePoster: function () {
  //   app.d.url_title = 'detail';
  //   app.d.tp_id = this.data.tp_id;
  //   app.d.brand_id = this.data.brand_id;
  //   app.d.pm = this.data.pm;
  //   this.setData({ showVideo: false })
  //   this.selectComponent('#getPoster').getAvaterInfo()
  // },
  // myEventListener: function (e) {
  //   this.setData({ showVideo: true })
  // },

  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#fff")
    context.fillRect(0, 0, 375, 667)

    var path = this.data.path;//产品图

    // context.drawImage(path, 56, 56, 262, 349);
    context.drawImage(path, 0, 0, 375, 400);
    var path5 = this.data.fxphoto;//二维码
    //绘制左下角文字
    context.setFontSize(18);
    context.setFillStyle('#333');
    context.setTextAlign('left');
   //文字换行  
    var text = this.data.itemData.name ;//这是要绘制的文本
    var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    for (var a = 0; a < chr.length; a++) {
      if (context.measureText(temp).width < 250) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp);

    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (context.measureText(test).width < 170) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
      context.fillText(row[b], 15, 480 + b * 30, 200);
    }

    // context.fillText(this.data.itemData.name, 15, 480);
    context.stroke();
    context.setFontSize(20);
    context.setFillStyle('#FF0000');
    context.setTextAlign('left');
    context.fillText("￥",15, 440);
    context.stroke();
    context.setFontSize(30);
    context.setFillStyle('#FF0000');
    context.setTextAlign('left');
    context.fillText(this.data.price, 30, 440);
    context.stroke();

    //绘制左下角文字
    context.setFontSize(14);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("—长按识别小程序—", 240, 560);
    context.stroke();
    // context.setFontSize(14);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("跟我一起来购买吧~~", 70, 580);
    // context.stroke();

    //绘制右下角小程序二维码
    context.drawImage(path5, 250, 430, 100, 100);

    context.draw();
    //将生成好的图片保存到本地
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '海报已保存到相册',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function (e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    let pro_id =this.data.productId
    let uid =wx.getStorageSync('uid')
    api.getAPI('product/fxproduct',{pro_id,uid}).then(res => {
      console.log(res)
      wx.showToast({
        title: '海报生成中...',
        icon: 'loading',
        duration: 2000
      });
      wx.downloadFile({
        url: that.data.bannerItem[0], //产品图
        success: function (res) {
          console.log(res.tempFilePath)
          console.log(11)
          if (res.statusCode === 200) {
            that.setData({
              path: res.tempFilePath
            })
          } else {
            wx.showToast({
              title: '背景下载失败！',
              icon: 'none',
              duration: 2000,
              success: function () {
                that.setData({
                  path: '',
                })
              }
            })
          }
        }
      })
      wx.downloadFile({
        url: res.data.fximg,
        success: function (e) {
        console.log(e.tempFilePath)
        console.log(111)
        if (e.statusCode === 200) {
          that.setData({
             fxphoto: e.tempFilePath
           })
                // var codeSrc = e.tempFilePath;
                // that.sharePosteCanvas(productSrc, codeSrc, imgInfo);
              } else {
                console.log(222)
                wx.showToast({
                  title: '二维码下载失败！',
                  icon: 'none',
                  duration: 2000,
                  success: function () {
                    that.setData({
                      fxphoto: e.tempFilePath
                    })
                  }
                })
              }
            }
          })
          setTimeout(function () {
            wx.hideToast()
            that.createNewImg();
            that.setData({
              maskHidden: true
            });
          }, 1000)
    })
    
    

    //产品图下载
    
  },
  //关闭海报
  closePoste() {
    this.setData({
      maskHidden: false
    });
  }
});
