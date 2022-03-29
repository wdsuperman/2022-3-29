var app=getApp();
Page({
    data: {
        offdate: [],
        nouse: [],
        used:[],
        list:[],
        status:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (t) {
       this.loadData(t);

    },
    loadData: function(t) {
        var that = this;
        wx.showLoading({
            title: "加载中"
        }), 
        wx.request({
        url: app.d.ceshiUrl + 'user/voucher',
        method: 'POST',
        data: {
            uid: app.d.userId,
        },
        header: {'Content-Type': 'application/x-www-form-urlencoded'},
        success: function (res) {
            wx.hideLoading({
              success: (res) => {},
            })
            console.log(res)
            var status = res.data.status;
            if (status == 1) {
            that.setData({
                list: res.data.nouses,
                offdate: res.data.offdates,
                nouse: res.data.nouses,
                used: res.data.useds,
            })

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
    fl:function(e){
        let type=e.currentTarget.dataset.type
        console.log(type)
        if(type=='0'){
          this.setData({
              list:this.data.nouse,
              status:type
          })
        }else if(type=='1'){
            this.setData({
                list:this.data.used,
                status:type
            })
        }else{
            this.setData({
                list:this.data.offdate,
                status:type
            })
        }

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

 
})