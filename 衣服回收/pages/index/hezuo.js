var app=getApp();
const api = require('../../api.js')
var is_submit=true;
Page({

    data: {
      address:'', //回收地址
      shengArr: [],//省级数组
      shengId:0,//省级id数组
      shiArr: [],//城市数组
      shiId: 0,//城市id数组
      quArr: [],//区数组
      quId: 0,//区id
      shengIndex: 0,
      shiIndex: 0,
      quIndex: 0,
      shengNull:null,
      shiNull:null,
      quNull:null,
      imgzheng:'',
      imgfan:'',
      img_arr:[],
      photo_arr:[],
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
 
    },
    zheng: function () {
        var that = this
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) { 
            that.setData({
              imgzheng: res.tempFilePaths,
            })
            console.log(that.data.imgzheng)
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
    //获取省市县
    china_city(type){
      console.log(type)
      var that = this;
      wx.showLoading({
        title: '加载中',
      })
      let{shengId,shiId}=that.data
      api.getAPI('Index/china_city',{
        type,shengId,shiId

       }).then(res => {
         wx.hideLoading({
           success: (res) => {},
         })
         console.log(res.data)
         if (res.data.status == 1) {
          if(type==2){
            that.setData({
              shiArr:res.data.list,
            })
          }else if(type==3){
            that.setData({
              quArr:res.data.list,
            })
          }else{
            that.setData({
              shengArr:res.data.list,
            })
          }
         } else {
           wx.showToast({
             title: res.data.err,
             icon: 'none'
           })
         }
       })
    },
    
  bindPickerChangechina: function (e) {
    
    let {type}=e.currentTarget.dataset
    let {shengArr,shiArr,quArr}=this.data
    if(type==1){
      this.setData({
        shengIndex: e.detail.value,
        shengId:shengArr[e.detail.value].id,
        shiIndex:0,
        quIndex:0,
        shengNull:true,
        shiNull:false,
        quNull:false,
      });
    }else if(type==2){
      this.setData({
        shiIndex: e.detail.value,
        shiId:shiArr[e.detail.value].id,
        quIndex:0,
        shiNull:true,
        quNull:false,
      });
    }else{
      this.setData({
        quIndex: e.detail.value,
        quId:quArr[e.detail.value].id,
        quNull:true,
      });
    }
    if(type<3){
      type=Number(type)+Number(1);
      this.china_city(type);
    }

  },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      var uid= wx.getStorageSync('uid')
        if (!uid) {
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
        this.china_city(1)
    },
   //*************************** */
  //提交
  // ******************************
  submit: function (e) {
    const idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    let {value} = e.detail
    let {shengId,shiId,quId,shiArr,quArr,shengArr,shengIndex,shiIndex,quIndex,imgzheng} = this.data
    console.log(app.d.userId)
    if(value.name == ''){
        wx.showToast({
            title: '请填写姓名',
            icon:'none'
        })
        return false;
    }else if(!(/^1[3456789]\d{9}$/.test(value.tel))){
        wx.showToast({
            title: '手机号不正确',
            icon:'none'
        })
        return false;
    }else if(!idcardReg.test(value.sfz)){
        wx.showToast({
            title: '身份证有误',
            icon:'none'
        })
        return false;    
    }else if(value.jm_name == ''){
        wx.showToast({
            title: '请填写加盟商名称',
            icon:'none'
        })
        return false;       
    }else if(shengId == 0){
        wx.showToast({
            title: '请选择省份',
            icon:'none'
          })
          return false;
    }else if(shiId == 0){
        wx.showToast({
            title: '请选择城市',
            icon:'none'
        })
        return false;
      }else if(quId == 0){
        wx.showToast({
            title: '请选择地区',
            icon:'none'
        })    
        return false;
    }
    if (!imgzheng){
      wx.showToast({
        title: '请上传身份证',
        icon:'none',
        duration: 2000
      });
      return false;
    }


    
    this.setData({
      name:value.name,
      tel:value.tel,
      sfz:value.sfz,
      jm_name:value.jm_name,
      img_arr: imgzheng,
    })
    this.upload()

    if (!is_submit) return false
    is_submit = false
  
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
        icon: 'none',
        duration: 1500
      })
    }
    var img_arrs = _this.data.img_arr[i]
    if (img_arrs.indexOf("tmp") >= 0) {
      console.log(img_arrs)
      wx.uploadFile({
        url: app.d.hostUrl + '/Index/sf_photo', //接口地址
        filePath: _this.data.img_arr[i],
        name: 'files',
        formData: {},
        success: function (res) {
          console.log(res)
          var status = res.data.status

        },
        complete: function (res) {
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          jsonStr = jsonStr.replace(/\ufeff/g, "");
          var data = JSON.parse(jsonStr)
          i++
          _this.setData({
           photo_arr: _this.data.photo_arr.concat(data.photo)
          
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
    let {name,tel,sfz,jm_name,photo_arr,shengId,shiId,quId}=that.data
    console.log(photo_arr)
    wx.request({
      url: app.d.hostUrl + '/index/yuyue',
      method: 'post',
      data: {
        uid: app.d.userId,
        name,
        tel,
        sfz,
        jm_name,
        shengId,
        shiId,
        quId,
        sfzphoto: photo_arr['0'],
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      },
      success: function (res) {
        console.log(res)

        var status = res.data.status
        if (status==1) {
          app.d.shenfenzheng = that.data.shenfenzheng
          wx.showToast({
            title: '提交成功',
            duration: 1500
          })
          wx.switchTab({
            url: './index',
          })
          
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 1500
          }) 
        }
      },
      complete:function(e){
        wx.hideLoading(); 
        is_submit=true;
      }
    });
  },

 
})