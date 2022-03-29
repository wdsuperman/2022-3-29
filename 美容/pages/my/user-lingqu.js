var app=getApp();
Page({

    data: {
        list:[],
        page:2,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
          }) 
          var that = this;
          wx.request({
            url: app.d.ceshiUrl + 'Voucher/index',
            method: 'POST',
            data: {
                uid: app.d.userId,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.hideLoading()
              var status = res.data.status;
              if (status == 1) {
                console.log(res)
             
                that.setData({
                    list:res.data.vou
                })
              } else {
                wx.showToast({
                  title: res.data.err,
                  duration: 2000
                });
              }
            },
          });
      

    },
    receive(e){
        console.log(e)
       let id=e.currentTarget.dataset.id,index=e.currentTarget.dataset.index,that=this
        wx.showLoading({
          title: '领取中',
        }) 
   
        wx.request({
          url: app.d.ceshiUrl + 'Voucher/get_voucher',
          method: 'POST',
          data: {
              uid: app.d.userId,
              vid: id,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.hideLoading()
            var status = res.data.status;
            if (status == 1) {
              console.log(res)
              let temp = 'list[' + index +'].is_receive'
              that.setData({
                [temp] : 1  
              })
              wx.showToast({
                title: '领取成功',
                icon:'none',
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
        });
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})