const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    avater: { // 图片
      type: String,
      value: ''
    },
    num: { // 价格
      type: String,
      value: ''
    },
    name: { // 名称
      type: String,
      value: ''
    },
    brand_name: { // 名称
      type: String,
      value: ''
    },
    codeimg: { // 二维码
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showpost: false,
    imgHeight: 0,
    productCode: "" //二维码
  },

  ready: function() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //下载产品图片
    getAvaterInfo: function() {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      that.setData({
        showpost: true
      })
        wx.downloadFile({
          url: app.d.img + '/fenxiang.jpg', //头像图片路径
          success: function(res) {
            console.log(res)
            wx.hideLoading();
            if (res.statusCode === 200) {
              var productSrc = res.tempFilePath;
              that.calculateImg(productSrc, function(data) {
                that.getQrCode(productSrc, data);
              })
            } else {
              wx.showToast({
                title: '背景下载失败！',
                icon: 'none',
                duration: 2000,
                success: function() {
                  var productSrc = "";
                  that.getQrCode(productSrc);
                }
              })
            }
          }
        })
    },

    //下载二维码
    getQrCode: function(productSrc, imgInfo = "") {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      var that = this;
      wx.request({
        url: app.d.ceshiUrl + '/Api/Fenxiao/getwxaqrcode',
        method: 'post',
        data: {
          uid: app.d.userId,
          tp_id: app.d.tp_id,
          brand_id: app.d.brand_id,
          pm: app.d.pm,
          url_title: app.d.url_title,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*'
        },
        success: function (res) {
          var status = res.data.status;
          console.log(res)
          if (status == 1) {
            wx.downloadFile({
              url: res.data.fxphoto,
              success: function (e) {
                console.log(e)
                wx.hideLoading();
                if (e.statusCode === 200) {
                  var codeSrc = e.tempFilePath;
                  that.sharePosteCanvas(productSrc, codeSrc, imgInfo);
                } else {
                  wx.showToast({
                    title: '二维码下载失败！',
                    icon: 'none',
                    duration: 2000,
                    success: function () {
                      var codeSrc = "";
                      that.sharePosteCanvas(productSrc, codeSrc, imgInfo);
                    }
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: res.data.err,
              duration: 2000,
            });
          }
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });
      
      
    },

    //canvas绘制分享海报
    sharePosteCanvas: function(avaterSrc, codeSrc, imgInfo) {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      })
      var that = this;
      const ctx = wx.createCanvasContext('myCanvas', that);
      var width = "";
      const query = wx.createSelectorQuery().in(this);
      query.select('#canvas-container').boundingClientRect(function(rect) {
        var height = rect.height;
        var right = rect.right;
        width = rect.width;
        var left = rect.left;
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, rect.width+50, height+300);

        //头像
        if (avaterSrc) {
          if (imgInfo) {
            var imgheght = parseFloat(imgInfo);
          }
          ctx.drawImage(avaterSrc, 0, 0, width, imgheght ? imgheght : width);
          ctx.setFontSize(14);
          ctx.setFillStyle('#fff');
          ctx.setTextAlign('left');
        }

        //活动名称
        if (that.data.brand_name) {
          const CONTENT_ROW_LENGTH = 30; // 正文 单行显示字符长度
          let [contentLeng, contentArray, contentRows] = that.textByteLength((that.data.brand_name).substr(0, 30), CONTENT_ROW_LENGTH);
          ctx.setTextAlign('left');
          ctx.setFillStyle('#000');
          ctx.setFontSize(16);
          let contentHh = 22 * 1;
          for (let m = 0; m < contentArray.length; m++) {
            ctx.fillText(contentArray[m], left + 5, imgheght - width*0.75+ contentHh * m);
          }
        }
        //编号
        if (that.data.num || that.data.num == 0) {
          ctx.setFontSize(18);
          ctx.setFillStyle('#fff');
          ctx.setTextAlign('content');
          var num = that.data.num;
          if (!isNaN(num)) {
            num = "参赛编号:" + that.data.num
          }
          ctx.fillText(num, left + 70, imgheght- width * 0.55); 
        }
        //名称
        if (that.data.name) {
          ctx.setFontSize(16);
          ctx.setFillStyle('#000');
          ctx.setTextAlign('content');
          num = "参赛人姓名:" + that.data.name
          ctx.fillText(num, left + 70, imgheght - width * 0.45); 
        }


        //  绘制二维码
        if (codeSrc) {
          ctx.drawImage(codeSrc, left + 90, imgheght - width * 0.4, width /4, width / 4)
          ctx.setFontSize(14);
          ctx.setFillStyle('#000');
        }
      }).exec()
      setTimeout(function() {
        ctx.draw();
        wx.hideLoading();
      }, 1000)

    },

    textByteLength(text, num) { // text为传入的文本  num为单行显示的字节长度
      let strLength = 0; // text byte length
      let rows = 1;
      let str = 0;
      let arr = [];
      for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
          strLength += 2;
          if (strLength > rows * num) {
            strLength++;
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        } else {
          strLength++;
          if (strLength > rows * num) {
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        }
      }
      arr.push(text.slice(str, text.length));
      return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
    },

    //点击保存到相册
    saveShareImg: function() {
      var that = this;
      wx.showLoading({
        title: '正在保存',
        mask: true,
      })
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function(res) {
            wx.hideLoading();
            var tempFilePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success(res) {
                wx.showModal({
                  content: '图片已保存到相册，赶紧晒一下吧~',
                  showCancel: false,
                  confirmText: '好的',
                  confirmColor: '#333',
                  success: function(res) {
                    that.closePoste();
                    if (res.confirm) {}
                  },
                  fail: function(res) {
                    console.log(res)
                  }
                })
              },
              fail: function(res) {
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          },
          fail: function(err) {
            console.log(err)
          }
        }, that);
      }, 1000);
    },
    //关闭海报
    closePoste: function() {
      this.setData({
        showpost: false
      })
      //detail对象，提供给事件监听函数
      this.triggerEvent('myevent', {
        showVideo: true
      })
    },

    //计算图片尺寸
    calculateImg: function(src, cb) {
      var that = this;
      wx.getImageInfo({
        src: src,
        success(res) {
          wx.getSystemInfo({
            success(res2) {
              var ratio = res.width / res.height;
              var imgHeight = (res2.windowWidth * 0.9 / ratio)-50;
              //-130
              that.setData({
                imgHeight: imgHeight
              })
              cb(imgHeight );
            }
          })
        }
      })
    }
  }
})