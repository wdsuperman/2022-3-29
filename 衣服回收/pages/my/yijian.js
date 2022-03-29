var app=getApp();
var is_submit = true;
Page({
  data: {
    array: ['界面问题', '下单问题', '合伙人问题', '其他问题'],
    index: 0,
    img:'',
    tel:'',
    yijian:'',
    photo_arr:'',
    type:'',
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  update() { //上传图片
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          img: tempFilePaths[0]
        })
        
      }
    })
  },
  fd() {//放大
    let { img } = this.data
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  del() { //删除图片
    this.setData({
      img: ''
    })
  },
  submit(e) { //上传
    let { index, array, img } = this.data
    let value = e.detail.value
    let type = array[index]
    value.type = type
    value.img = img
    if (!(/^1[3456789]\d{9}$/.test(value.tel))) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
    } else if (value.yijian==''){ 
      wx.showToast({
        title: '请填写意见',
        icon: 'none'
      })
    }else {
      if (!is_submit) return false
      is_submit = false
      this.setData({
        type: value.type ,
        tel: value.tel,
        yijian: value.yijian, 
      })

      if (value.img!=''){
        this.upload();
      
      }else{
        this.fromup();
      }
    
    }
  },
  
  //图片上传
  upload: function () {
    wx.showLoading({
      title: '上传图片中.',
    })
    var _this = this　　//坑1
    var img_arrs = _this.data.img
    if (img_arrs.indexOf("tmp") >= 0) {
      console.log(img_arrs)
      wx.uploadFile({
        url: app.d.hostUrl + '/Api/user/yj_photo', //接口地址
        filePath: _this.data.img,
        name: 'files',
        formData: {},
        success: function (res) {
   
          var status = res.data.status

        },
        complete: function (res) {
          console.log(res);
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          jsonStr = jsonStr.replace(/\ufeff/g, "");
          var data = JSON.parse(jsonStr)
          console.log(data);
          console.log(_this.data.photo_arr);
          _this.setData({
            photo_arr: data.photo_arr
          })
       
            wx.hideLoading()
            _this.fromup();
        }
      })
    }
  },
  // ********************************
  // 提交信息
  // ********************************
  fromup: function () {
    wx.showLoading({
      title: '上传中',
    })
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/Api/user/yj_add',
      method: 'post',
      data: {
        uid: app.d.userId,
        tel: that.data.tel,
        yijian: that.data.yijian,
        type: that.data.type,
        photo_arr: that.data.photo_arr,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      },
      success: function (res) {
        console.log(res)
        console.log(that.data.photo_arr)
        var status = res.data.status
        if (status == 1) {
          wx.showToast({
            title: '反馈成功',
            icon:'none',
            duration: 1500
          })
          wx.navigateBack({ })
        } else {
          wx.showToast({
            title : res.data.err,
            icon: 'none',
            duration: 1500
          })
        }
      },
      complete: function (e) {
        wx.hideLoading();
        is_submit = true;
      }
    });
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
    is_submit = true;
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