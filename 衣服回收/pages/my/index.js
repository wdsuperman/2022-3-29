var app=getApp();
Page({
    data: {
        uid:'',
        btnLists:[
            {
                img:'/images/my_1.png',
                title:'历史订单',
                type:0
            },
            {
                img:'/images/my_2.png',
                title:'分类指南',
                type:1
            },
            {
                img:'/images/my_3.png',
                title:'关于我们',
                type:2
            },
            {
                img:'/images/my_4.png',
                title:'咨询合作',
                type:3
            },
            
        ]
    },
    xieyi(){
      wx.navigateTo({
        url: '/pages/my/xieyi',
      })
    },
    jump(e){
        let {type} = e.currentTarget.dataset
        switch(type){
            case 0 :
              
                wx.navigateTo({
                  url: '../dingdan/index',
                })
            break;
            case 1 :
                wx.navigateTo({
                  url: '../index/cate',
                })
            break;
            case 2 :
                wx.navigateTo({
                  url: './guanyuwomen',
                })
            break;
            case 3 :
                wx.navigateTo({
                  url: '../index/hezuo',
                })
            break;
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
     

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
      var that = this
      wx.getStorage({
        key: 'uid',
        success(res) {
           that.setData({
             uid:res.data
           })
        },
        fail() {
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
      })
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