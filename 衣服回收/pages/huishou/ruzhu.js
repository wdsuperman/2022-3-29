var app=getApp();
var is_submit=true;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        multiIndex: [0, 0],
        multiArray: [
            ['秦皇岛市'],
            ['海港区',  '开发区', '北戴河', '山海关', '抚宁', '卢龙', '青龙']
        ],
        pickerStatus: false, //区域获取状态
        img_arr: [],
        photo_arr: [],//上传后回调路径
        city: '',
        address: '',
        tel: '',
        sfz:'',
        zh_name: '',
        mima: '',
        img1: '',
        img: '',
      email:'',

    },
    submit(e) { //提交
        let {value} = e.detail
        let {img,img1} = this.data
        let {address,multiIndex,multiArray,pickerStatus} = this.data
        if(address){
            value.huishou = address
        }else{
            value.huishou = ''
        }
        value.img = img
        value.img1 = img1
        if(pickerStatus){
            value.quyu = multiArray[0][multiIndex[0]]+multiArray[1][multiIndex[1]]
        }else{
            value.quyu = ''
        }
        if(value.quyu == ''){
            wx.showToast({
                title: '请选择城市',
                icon:'none'
              })
        }else if(value.huishou == ''){
            wx.showToast({
                title: '请选择地址',
                icon:'none'
            })
        }else if(value.name == ''){
            wx.showToast({
                title: '请填写姓名',
                icon:'none'
            })
        }else if(!(/^1[3456789]\d{9}$/.test(value.tel))){
            wx.showToast({
                title: '手机号不正确',
                icon:'none'
            })
        }else if(!(/(^d{8}(0d|10|11|12)([0-2]d|30|31)d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/.test(value.idcard))){
            wx.showToast({
                title: '身份证号不正确',
                icon:'none'
            })
        }else if(value.zhanghao.length == 0){
            wx.showToast({
                title: '账号不能为空',
                icon:'none'
              })
        }else if(value.mima.length <6){
            wx.showToast({
              title: '密码不能小于6位',
              icon:'none'
            })
        } else if (value.email.length == 0) {
          wx.showToast({
            title: '邮箱不能为空',
            icon: 'none'
          })
        }else if(!value.img){
            wx.showToast({
              title: '请上传身份证正面',
              icon:'none'
            })
        }else if(!value.img1){
            wx.showToast({
                title: '请上传身份证反面',
                icon:'none'
              })
        }else{
          var imgs = img + ',' + img1;
          var img_arr = imgs.split(","); 
          this.setData({
            name: value.name,
            city: value.quyu,
            address: value.huishou,
            tel: value.tel,
            sfz: value.idcard,
            zh_name: value.zhanghao,
            mima: value.mima,
            img_arr: img_arr,
            email: value.email,
          })
          this.upload()
          
          if (!is_submit) return false
          is_submit = false 
      
        }
    },
  //图片上传
  upload: function (option) {
    if (option) {
      var i = option
    } else {
      var i = '0'
    }
    wx.showLoading({
      title: '上传身份信息中.',
    })
    var _this = this　　//坑1
    if (_this.data.img_arr.length == '') {
      wx.showToast({
        title: '请上传一张图片',
        icon: 'success',
        duration: 1500
      })
    }
    var img_arrs = _this.data.img_arr[i]
    if (img_arrs.indexOf("tmp") >= 0) {
      console.log(img_arrs)
      wx.uploadFile({
        url: app.d.hostUrl + '/Api/huishou/ruzhu_img', //接口地址
        filePath: _this.data.img_arr[i],
        name: 'files',
        formData: {},
        success: function (res) {
          console.log(res)
          var status = res.data.status

        },
        complete: function (res) {
          console.log(res)
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          jsonStr = jsonStr.replace(/\ufeff/g, "");
          var data = JSON.parse(jsonStr)
          i++
          _this.setData({
            photo_arr: _this.data.photo_arr.concat(data.photo_arr)
          })
          console.log(_this.data.photo_arr)
          if (i == _this.data.img_arr.length) {
            wx.hideLoading()
            _this.fromup();
          } else if (i < _this.data.img_arr.length) {//若图片还没有传完，则继续调用函数
            _this.upload(i)
          }
        }
      })
      this.setData({
        formdata: ''
      })
    } else {
      i++
      _this.setData({
        photo_arr: _this.data.photo_arr.concat(img_arrs)
      })
      if (i == _this.data.img_arr.length) {
        wx.hideLoading()
        _this.fromup();
      } else if (i < _this.data.img_arr.length) {//若图片还没有传完，则继续调用函数
        _this.upload(i)
      }
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
    console.log(that.data.photo_arr)
    console.log(that.data.photo_arr['0'])
    wx.request({
      url: app.d.hostUrl + '/Api/huishou/ruzhu_add',
      method: 'post',
      data: {
        uid: app.d.userId,
        name: that.data.name,
        tel: that.data.tel,
        sfz: that.data.sfz,
        city: that.data.city,
        address: that.data.address,
        zh_name: that.data.zh_name,
        mima:that.data.mima,
        photo_arr: that.data.photo_arr,
        email: that.data.email,
        sfz_z: that.data.photo_arr['0'],
        sfz_f: that.data.photo_arr['1'],
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      },
      success: function (res) {
        console.log(res)
        var status = res.data.status
        if (status == 1) {
          wx.showToast({
            title: '提交成功,等待审核',
            icon:'none',
            duration: 1500
          })
          setTimeout(function () {
            wx.redirectTo({
              url: './huishouyuan',
            })
          }, 1500)
        } else {
          wx.showToast({
            title: res.data.err,
            icon: 'none',
            duration: 1500
          })
        }
      },
      complete: function (e) {
        wx.hideLoading();
      }
    });
  },
    bindMultiPickerChange: function (e) { //时间选择
        this.setData({
            multiIndex: e.detail.value,
            pickerStatus: true
        })
    },
    address() { //回收地址
        let that = this
        wx.chooseLocation({
            success(e){
                that.setData({
                    address:e.name
                })
                console.log(e)
            },
            fail(e){
                wx.showToast({
                  title: '获取地址失败',
                  icon:'none'
                })
            }
        })
    },
    update(){ //上传图片 身份证正面
        let that = this
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album'],
          success (res) {
            // tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths
            that.setData({
              img:tempFilePaths[0]
            })
            console.log(that.data.img)
          }
        })
      },
      update1(){ //上传图片 身份证反
        let that = this
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album'],
          success (res) {
            // tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths
            that.setData({
              img1:tempFilePaths[0]
            })
            console.log(that.data.img1)
          }
        })
      },
      fd(){//放大
        let {img} = this.data
        wx.previewImage({
          current: img, // 当前显示图片的http链接
          urls: [img] // 需要预览的图片http链接列表
        })
      },
      fd1(){//放大
        let {img1} = this.data
        wx.previewImage({
          current: img1, // 当前显示图片的http链接
          urls: [img1] // 需要预览的图片http链接列表
        })
      },
      del(){ //删除图片
        this.setData({
          img:''
        })
      },
      del1(){ //删除图片
        this.setData({
          img1:''
        })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.showLoading({
        title: '查询中',
      })
      var that = this;
      wx.request({
        url: app.d.hostUrl + '/Api/huishou/ruzhu',
        method: 'post',
        data: {
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

          } else if (status == 2) {
            wx.showToast({
              title: res.data.err,
              icon: "none",
              duration: 1500
            });
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1500)

          } else if (status == 3) {
            wx.showToast({
              title: res.data.err,
              icon: "none",
              duration: 1500
            });
            var info=res.data.info
            that.setData({
              address: info.address,
              name: info.name,
              tel: info.tel,
              sfz: info.sfz,
              zh_name: info.zh_name,
              img: info.sfz_z,
              img1: info.sfz_f,
              multiIndex: info.multiIndex,
              pickerStatus:true,
              email:info.email,
            })

          } else if (status == 0) {
            wx.showToast({
              title: res.data.err,
              icon: "none",
              duration: 1500
            });
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1500)

          } else if (status == 4) {
            wx.showToast({
              title: res.data.err,
              icon: "none",
              duration: 1500
            });
            setTimeout(function () {
              wx.navigateBack({
                
              })
           
            }, 1500)

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