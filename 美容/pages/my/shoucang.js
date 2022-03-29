var app = getApp();
// pages/user/shoucang.js
Page({
  data: {
    page: 1,
    productData: [],
    url:app.d.img
  },
  onLoad: function (options) {

  },
  onShow: function () {
    // 页面显示
    this.loadProductData();
  },
  removeFavorites: function (e) {
    var that = this;
    var ccId = e.currentTarget.dataset.favid;
    console.log(ccId)
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function (res) {

        res.confirm && wx.request({
          url: app.d.hostUrl + 'user/collection_qu',
          method: 'post',
          data: {
            id: ccId,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var data = res.errMsg;
            console.log(data);
            //todo
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            });
            if (data == 'request:ok') {
              that.data.productData.length = 0;
              that.loadProductData();
            }
          },
        });

      }

    });
  },
  loadProductData: function () {
    var that = this;
    console.log(this.data);
    wx.request({
      url: app.d.hostUrl + 'User/collection',
      method: 'post',
      data: {
        id: app.d.userId,
        pageindex: that.data.page,
        pagesize: 100,
      },

      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res); console.log(123);
        //--init data
        var data = res.data.sc_list;
       // that.initProductData(data);

        that.setData({
          productData: that.data.productData.concat(data),
        });
        //endInitData
      },
    });
  },
  initProductData: function (data) {
    for (var i = 0; i < data.length; i++) {
      console.log(data);
      var item = data[i];

      item.ProductName = item.pro_name;
      item.Price = item.price_yh;
      item.ImgUrl = item.photo;
      item.ccid = item.id;

    }
  },

  //跳转到商品详情
  product:function(e){
    var productid = e.currentTarget.dataset.productid;
    wx.redirectTo({
      url: '../product/detail?productId=' + productid,
    })

  },
});
