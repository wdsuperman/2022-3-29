var app=getApp();
Page({
  data: {
    cont:'',
    tishi:'',
    txed:'10',//提现最低额度
    'bank_name': '中国农业银行',
    'bank_car': '尾号6864储蓄卡',
    'shengyu': '0.00',
      money: '',
    xs_mima: 'none',
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + 'Fenxiao/txlist',
      method: 'post',
      data: {
        uid: app.d.userId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            cont:res.data.cont,
            txed: res.data.txed,
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
 //修改信息
  xiugai:function(){
    wx.navigateTo({
      url: './txshenqing',
    })
  },
  //
  money:function(e){
    var money= e.detail.value
    var kymoney = this.data.cont.yue
      if (money > kymoney){
        this.setData({
        tishi:1
        })
      }else{
        this.setData({
          tishi: '0'
        }) 
      }
  },
  /**提交 */
  formSubmit: function (e) {
    var kymoney = this.data.cont.yue
    var money = e.detail.value.money
    var txed = this.data.txed
    if (money==''){
      wx.showToast({
        title: '请填写提现金额',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    if(txed>=money){
      wx.showToast({
        title: '最少提取'+ txed+'元',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    if (money > kymoney) {
      wx.showToast({
        title: '请修改提现金额',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    //提交填写密码
    this.setData({
      xs_mima: '',
      money: e.detail.value.money
    })
  },

  //判断密码
  mima_tj: function (e) {
    var kymoney = this.data.cont.yue
    var money = this.data.money
    var txed = this.data.txed
    var password = e.detail.value.password
    if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(password) == false) {
      wx.showModal({
        content: '密码由数字和字母组成',
      })
      
      return false
    }
    wx.request({
      url: app.d.ceshiUrl + 'Fenxiao/money_psw',
      method: 'post',
      data: {
        uid: app.d.userId,
        password: password
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        var status = res.data.status;
        if (status == 1) {
          wx.request({
            url: app.d.ceshiUrl + 'Fenxiao/money',
            method: 'post',
            data: {
              uid: app.d.userId,
              money: money,
              kymoney: kymoney
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
          
              var status = res.data.status;
              if (status == 1) {
                wx.redirectTo({
                  url: '../fenxiao/txsuccess',
                })
                wx.showToast({
                  title: '申请提现成功',
                  duration: 2000
                });
              } else {
                wx.showToast({
                  title: res.data.err,
                  duration: 2000
                });
              }
            },
          });
        
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
    });
  },
  hidden: function () {
    this.setData({
      xs_mima: 'none',
    })
  },
  wangji: function () {
    wx.navigateTo({
      url: '../login/wangji',
    })
  }


})