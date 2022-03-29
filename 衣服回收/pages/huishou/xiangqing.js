var app=getApp();
Page({

    data: {
      info:'',
      oid:'',
        star:[true,true,true,false,false] //亮的星星
    },
    tel(e){ //一键呼出
        wx.makePhoneCall({
          phoneNumber: this.data.info.tel,
        })
    },
    daohang(e){ //到这去
      var that = this, latitude = that.data.info.latitude, longitude = that.data.info.longitude
      console.log(that.data.info.latitude)
        wx.getLocation({
          type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success: function (res) {
              console.log(res)
              wx.openLocation({
                latitude: Number(latitude),//纬度
                  longitude: Number(longitude),//经度
                name: that.data.info.address,
                address: that.data.info.full_address,
                success: function (r) {
                  console.log(r)
                }
              })
            }
          })
    },
    quxiao(e){ //接受订单
      wx.showLoading({
        title: '接单中',
      })
      var that = this;
      wx.request({
        url: app.d.hostUrl + '/Api/huishou/jiedan',
        method: 'post',
        data: {
          oid:that.data.oid,
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
              title: '接单成功',
              icon: "none",
              duration: 2000
            });
            var ins_st = 'info.status', ins_de = 'info.desc'
            that.setData({
              [ins_st]: 1,
              [ins_de]: '已接单',
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
    over(e){ //完成订单
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定完成订单，此操作不能撤销',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.d.hostUrl + '/Api/huishou/wancheng',
              method: 'post',
              data: {
                oid: that.data.oid,
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
                  var ins_st = 'info.status', ins_de = 'info.desc'
                  that.setData({
                    [ins_st]: 2,
                    [ins_de]: '已完成',
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.showLoading({
        title: '查询中',
      })
      console.log(options)
      var that = this;
      wx.request({
        url: app.d.hostUrl + '/Api/huishou/dateil',
        method: 'post',
        data: {
          oid: options.oid,
          uid: app.d.userId,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideLoading()
          console.log(res)
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              info: res.data.info,
              oid: options.oid,
              pj:res.data.pj,
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

})