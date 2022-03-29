var app=getApp();
Page({

    data: {
        star:[true,false,false,false,false],
        stars:[],
        oid:'',
        pingjia:'',
        but:true
    },
    star(e){ //点击星星
        let star = [false,false,false,false,false]
        let {index} = e.currentTarget.dataset
        for(let i =0; i <star.length;i++){
            console.log(i,index)
            if(i<index+1){
                star[i] = true
            }
        }
        this.setData({
            star
        })
    },
    submit(e){
        let { pingjia} = e.detail.value
        let star = this.data.star
        if(pingjia==''){
            wx.showToast({
              title: '请填写评价语',
              icon:'none'
            })
        }else{
          var str = star.join(',');
          wx.showLoading({
            title: '提交中',
          })
          var that = this;
          console.log(that.data.oid)
          wx.request({
            url: app.d.hostUrl + '/Api/ROrder/pingjia_add',
            method: 'post',
            data: {
              oid: that.data.oid,
              pingjia: pingjia,
              uid: app.d.userId,
              star: str,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.hideLoading()
              var status = res.data.status;
              if (status == 1) {
                wx.showToast({
                  title: '评价成功',
                  icon: "none",
                  duration: 1500
                });
                wx.navigateBack({})
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
                title: '网络异常1！',
                icon: "none",
                duration: 2000
              });
            },
          });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    
    onLoad: function (options) {
      wx.showLoading({
        title: '加载中',
      })
      console.log(options)
      var that = this;
      wx.request({
        url: app.d.hostUrl + '/Api/ROrder/pingjia',
        method: 'post',
        data: {
          oid: options.oid,
          uid: app.d.userId,
          // order_type: that.data.isStatus,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideLoading()
          var status = res.data.status;
          var but = res.data.but;
          if (status == 1) {
            if(!but){
              var stars = res.data.pj.star.split(',');
              console.log(stars)
              that.setData({
                stars: stars,
                pingjia: res.data.pj.text,
              })
            }
            that.setData({
              but: but,
              oid: options.oid,
              info:res.data.info,
             // star: res.data.pj.star,
           //   pingjia: res.data.pj.pingjia,
           //   but: res.data.but,
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