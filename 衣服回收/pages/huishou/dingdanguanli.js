var app = getApp();
var is_submit = true;
Page({
  data: {
    page: 2,
    isStatus: 0,
    tab: [ //分类
      {
        title: '未接单',
        status: true,
        type: 0
      },
      {
        title: '已接单',
        status: false,
        type: 1
      },
      {
        title: '已完成',
        status: false,
        type: 2
      },
      {
        title: '已取消',
        status: false,
        type: 3
      },
    ],
    list: [],
  },
    clickTab(e){
        let {type} = e.currentTarget.dataset
        let {tab,lists} = this.data
        this.setData({
            isStatus: type,
            page: 2,
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
    share(e){ //完成订单
      var that=this;
      var cindex = e.currentTarget.dataset.index
      wx.showModal({
        title: '提示',
        content: '确定完成订单，此操作不能撤销',
        success (res) {
          if (res.confirm) {
            wx.request({
              url: app.d.hostUrl + '/Api/huishou/wancheng',
              method: 'post',
              data: {
                oid: e.currentTarget.dataset.oid,
                uid: app.d.userId,
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                wx.hideLoading()
                var status = res.data.status;
                if (status == 1) {
                  wx.showToast({
                    title: '订单已完成',
                    icon: "none",
                    duration: 2000
                  });
                  that.data.list.splice(cindex, 1); //当减为0的时候删除该项内容  
                  that.setData({
                    list: that.data.list
                  })
                } else {
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
          } else if (res.cancel) {
              console.log('取消')
          }
        }
      })
    },
    detail(e){ //点击列表跳转详情
        console.log('点击列表跳转详情')
        wx.navigateTo({
          url: './xiangqing?oid=' + e.currentTarget.dataset.oid,
        })
    },


    quxiao(e){ //接单
      wx.showLoading({
        title: '接单中',
      })
      var cindex = e.currentTarget.dataset.index
      var that = this;
      wx.request({
        url: app.d.hostUrl + '/Api/huishou/jiedan',
        method: 'post',
        data: {
          oid: e.currentTarget.dataset.oid,
          uid: app.d.userId,
          // order_type: that.data.isStatus,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideLoading()
          console.log(res)
          var status = res.data.status;
          if (status == 1) {
            wx.showToast({
              title: '接单成功',
              icon: "none",
              duration: 2000
            });
            that.data.list.splice(cindex, 1); //当减为0的时候删除该项内容  
            that.setData({
              list: that.data.list
            })
          } else {
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
    contact(e){ //跳转订单详情
        console.log('点击按钮跳转详情')
        wx.navigateTo({
          url: './xiangqing?oid='+ e.currentTarget.dataset.oid,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // let {lists} = this.data
        // this.setData({
        //     showLists:lists.filter( i => i.status =='未接单')
        // })
    },

  //用户点单
  loadOrderList: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/Api/Huishou/index',
      method: 'post',
      data: {
        uid: app.d.userId,
        order_type: that.data.isStatus,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        var status = res.data.status;
        that.setData({
          list: res.data.ord,
        });
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
      url: app.d.hostUrl + '/Api/Huishou/get_more',
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
            icon: 'none',
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
  onUnload: function () {
    wx.reLaunch({
      url: '../my/index',
    })
  },

})