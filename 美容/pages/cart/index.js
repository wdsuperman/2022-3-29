// // pages/cart/index.js
// Page({

//     /**
//      * 页面的初始数据
//      */
//     data: {
//         list:[
//             {
//                 name:'店铺名',
//                 logo:'',
//                 id:1,
//                 goods:[
//                     {
//                         num:1,
//                         price:1.1,
//                         title:'标题',
//                         img:'',
//                         jf:20,
//                         type:false,
//                         pid:1,
//                         amount:1.1
//                     },
//                     {
//                         num:1,
//                         price:2.2,
//                         title:'标题',
//                         img:'',
//                         jf:20,
//                         type:false,
//                         pid:2,
//                         amount:2.2,
//                     }
//                 ]
//             },
//             {
//                 name:'店铺名',
//                 logo:'',
//                 id:2,
//                 goods:[
//                     {
//                         num:1,
//                         price:9.9,
//                         title:'标题',
//                         img:'',
//                         jf:20,
//                         type:true,
//                         pid:3,
//                         amount:9.9,
//                     }
//                 ]
//             },
//         ],
//         price:0, //总价
//         all:false,//全选
//     },
//     calculation(){ //计算总价
//         let p = 0
//         this.data.list.map(i => {
//                 i.goods.map(t=> {
//                     if(t.type){
//                         p = p+ (t.num * t.price)
//                     }
//                 })
//         })
//         this.setData({
//             price:p.toFixed(1)
//         })
//     },
//     reduce(e){ //减
//         let {id,pid} = e.currentTarget.dataset
//         this.setData({
//             list:this.data.list.map(i => {
//                 if(i.id == id){
//                     i.goods.map(t => {
//                         if(t.pid == pid){
//                             if(t.num > 1){
//                                 t.num = t.num - 1
//                                 t.amount = (t.num * t.price).toFixed(1)
//                             }
//                         }
//                     })
//                 }
//                 return i
//             })
//         })
//         this.calculation()
//     },
//     slice(e){ //选择
//         let {id,pid} = e.currentTarget.dataset
//         this.setData({
//             list:this.data.list.map(i => {
//                 if(i.id == id){
//                     i.goods.map(t => {
//                         if(t.pid == pid){
//                             t.type = !t.type
//                         }
//                     })
//                 }
//                 return i
//             })
//         })
//         let arr = []
//         let all = []
//         let t= false
//         this.data.list.map(i => {
//             i.goods.map(t =>{
//                 arr = [...arr,t.type]
//             })
//         })
//         all = arr.filter(i=>i == false)
//         console.log(all.length == 0)
//         if(all.length == 0){
//             t = true
//         }else{
//             t = false
//         }
//         console.log(t)
//         this.setData({
//             all:t
//         })
//         this.calculation()
//     },
//     add(e){ //加
//         let {id,pid} = e.currentTarget.dataset
//         this.setData({
//             list:this.data.list.map(i => {
//                 if(i.id == id){
//                     i.goods.map(t => {
//                         if(t.pid == pid){
//                             t.num = t.num + 1
//                             t.amount = (t.num * t.price).toFixed(1)
//                         }
//                     })
//                 }
                
//                 return i
//             })
            
//         })
//         this.calculation()
//     },
//     allChange(){
        
//         let {all} = this.data
//         if(all){
//             this.setData({
//                 list:this.data.list.map(i => {
//                         i.goods.map(t => {
//                             t.type = false
//                         })
//                     return i
//                 }),
//                 all:false
//             })
//         }else{
//             this.setData({
//                 list:this.data.list.map(i => {
//                         i.goods.map(t => {
//                             t.type = true
//                         })
//                     return i
//                 }),
//                 all:true
//             })
//         }
//         this.calculation()
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
//         this.calculation()
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
var app = getApp();
// pages/cart/cart.js
Page({
  data:{
    shop:'',
    productData:'',
    page:1,
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    total: 0,
    carts: []
  },
//跳转到商家页面
shopping:function(e){
var shopid= e.currentTarget.dataset.shopid
  wx.navigateTo({
    url: '../shop/index?shopId=' + shopid,
  })
},
//跳转到产品
  product:function(e){
    var productid = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '../product/detail?productId=' + productid,
    })
  },
bindMinus: function(e) {
  wx.showLoading({
    title: '修改中',
  })
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var spindex = parseInt(e.currentTarget.dataset.spindex);//父级的序列
   // var num = that.data.carts[index].num;
    var num = that.data.shop[spindex].slist[index].num;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num --;
    }
    console.log(num);
    var cart_id = e.currentTarget.dataset.cartid;
    wx.request({
      url: app.d.ceshiUrl + 'Shopping/up_cart',
      method:'post',
      data: {
        user_id: wx.getStorageSync('uid'),
        num:num,
        cart_id:cart_id
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
     success: function (res) {
       wx.hideLoading()
        var status = res.data.status;
        if(status==1){
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = num <= 1 ? 'disabled' : 'normal';
          // 购物车数据
        //  var carts = that.data.carts;
        //  carts[index].num = num;
          var shopslist = "shop[" + spindex + "].slist[" + index + "].num";

          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
          
          minusStatuses[index] = minusStatus;
      
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses,
            [shopslist]: num,
          });

          that.sum();
        }else{
          wx.showToast({
            title: res.data.err,
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
},

bindPlus: function(e) {
  wx.showLoading({
    title: '修改中',
  })
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var spindex = parseInt(e.currentTarget.dataset.spindex);//父级的序列
    //var num = that.data.carts[index].num;
    var num = that.data.shop[spindex].slist[index].num;
    // 自增
    num ++;
    var cart_id = e.currentTarget.dataset.cartid;
    wx.request({
      url: app.d.ceshiUrl + 'Shopping/up_cart',
      method:'post',
      data: {
        user_id: wx.getStorageSync('uid'),
        num:num,
        cart_id:cart_id
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        var status = res.data.status;
        if(status==1){
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = num <= 1 ? 'disabled' : 'normal';
          // 购物车数据
         // var carts = that.data.carts;
         // carts[index].num = num;shop[spindex].slist[index].num; 
          var shopslist = "shop[" + spindex + "].slist[" + index + "].num";
          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
        //  minusStatuses[index] = minusStatus;
           
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses,
            [shopslist]:num,
          });
      
          that.sum();
        }else{
          wx.showToast({
            title: res.data.err,
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
}, 
bindManual(e){
  wx.showLoading({
    title: '修改中',
  })
 console.log(e)
  var that = this;
  var index = parseInt(e.currentTarget.dataset.index);
  var spindex = parseInt(e.currentTarget.dataset.spindex);//父级的序列
  //var num = that.data.carts[index].num;
 // var num = that.data.shop[spindex].slist[index].num;
  // 自增

  var cart_id = e.currentTarget.dataset.cartid;
  var num = e.detail.value;
  wx.request({
    url: app.d.ceshiUrl + 'Shopping/up_cart',
    method: 'post',
    data: {
      user_id: wx.getStorageSync('uid'),
      num: num,
      cart_id: cart_id
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(res)
      wx.hideLoading()
      var status = res.data.status;
      if (status == 1) {
        // 只有大于一件的时候，才能normal状态，否则disable状态
        var minusStatus = num <= 1 ? 'disabled' : 'normal';
        // 购物车数据
        // var carts = that.data.carts;
        // carts[index].num = num;shop[spindex].slist[index].num; 
        var shopslist = "shop[" + spindex + "].slist[" + index + "].num";
        // 按钮可用状态
        var minusStatuses = that.data.minusStatuses;
        //  minusStatuses[index] = minusStatus;

        // 将数值与状态写回
        that.setData({
          minusStatuses: minusStatuses,
          [shopslist]: num,
        });
        that.sum();
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000
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
        icon: 'none',
        duration: 2000
      });
    }
  });

},


bindCheckbox: function(e) {
  /*绑定点击事件，将checkbox样式改变为选中与非选中*/
  //拿到下标值，以在carts作遍历指示用
  var index = parseInt(e.currentTarget.dataset.index);
  var spindex = parseInt(e.currentTarget.dataset.spindex);//父级序列
  //原始的icon状态
  var selected = this.data.shop[spindex].slist[index].selected;
  var shop = this.data.shop;
  // 对勾选状态取反
  shop[spindex].slist[index].selected = !selected;
  // 写回经点击修改后的数组
  this.setData({
    shop: shop
  });
  this.sum()
},
//全选
bindSelectAll: function() {
   // 环境中目前已选状态
   var selectedAllStatus = this.data.selectedAllStatus;
   // 取反操作
   selectedAllStatus = !selectedAllStatus;
   // 购物车数据，关键是处理selected值
   var shop = this.data.shop;
   // 遍历
  for (var i = 0; i < shop.length; i++) {
    var slist = shop[i].slist
    for (var t = 0; t < slist.length; t++) {
      slist[t].selected = selectedAllStatus;
    }
  }
   this.setData({
     selectedAllStatus: selectedAllStatus,
     shop: shop
   });
   this.sum()
 },
bindCheckout: function() {
   // 初始化toastStr字符串
   var toastStr = '';
   // 遍历取出已勾选的cid
   var shop = this.data.shop;
  for (var i = 0; i < shop.length; i++) {
    var slist = shop[i].slist
    console.log(slist)
    for (var t = 0; t < slist.length; t++) {
      if (slist[t].selected) {
        toastStr += slist[t].id;
        toastStr += ',';
      }
    }
  
   }
   console.log(toastStr);
   if (toastStr==''){
     wx.showToast({
       title: '请选择要结算的商品！',
       duration: 2000
     });
     return false;
   }
   //存回data
   wx.navigateTo({
     url: '../order/pay?cartId=' + toastStr,
   })
 },

 bindToastChange: function() {
   this.setData({
     toastHidden: true
   });
 },

sum: function() {
  var shop = this.data.shop;
  // 计算总金额
  var total = 0;
  for (var i = 0; i < shop.length; i++) {
    var slist = shop[i].slist
   for (var t = 0; t < slist.length; t++) {
      if (slist[t].selected) { 
        total += slist[t].num * slist[t].price; 
      }
    }
  }
    // 写回经点击修改后的数组
    this.setData({
      shop: shop,
      total: '¥ ' + total.toFixed(2)
    });
  },

onLoad:function(options){
    this.loadProductData();
    this.sum();
    
},

onShow:function(){
  this.loadProductData();
  var uid = wx.getStorageSync('uid')
    if(!uid){
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
},

removeShopCard:function(e){
    var that = this;
    var cardId = e.currentTarget.dataset.cartid;
    var indexs = e.currentTarget.dataset.indexs;


    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        wx.showLoading({
          title: '删除中',
        })
        res.confirm && wx.request({
          url: app.d.ceshiUrl + 'Shopping/delete',
          method:'post',
          data: {
            cart_id: cardId,
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.hideLoading()
            //--init data
            var data = res.data;
            if(data.status == 1){
              //that.data.productData.length =0;
              // that.data.shop[0].slist.splice(indexs, 1); //当减为0的时候删除该项内容  
              // that.setData({
              //   shop: that.data.shop[0].slist
              // }) 

              that.loadProductData();
            }else{
              wx.showToast({
                title: '操作失败！',
                duration: 2000
              });
            }
          },
        });
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

// 数据案例
  loadProductData:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + 'Shopping/index',
      method:'post',
      data: {
        user_id: wx.getStorageSync('uid')
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
       wx.hideLoading()
       console.log(res)
        var cart = res.data.cart;
        that.setData({
          carts:cart,
          shop: res.data.shop,
          productData: res.data.product,
        });
        //endInitData
      },
    });
  },

})