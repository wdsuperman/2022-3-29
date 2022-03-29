var app=getApp();
var is_submit=true;
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
     tel:' 15227266674',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        api.getAPI('index/web',{
            id:1
           }).then(res => {
              wx.hideLoading({
                success: (res) => {},
              })
              console.log(res.data)
              if (res.data.status == 1) {
                var content = res.data.info.content.replace(/\<img/gi, '< img style="width: 100% ;max-width:100%;height:auto" ') //防止富文本图片过大
                var content = content.replace(/\<section/gi, '<p ') //防止富文本图片过大
                this.setData({
                    content: content,
                })
              } else {
                wx.showToast({
                  title: res.data.err,
                  icon: 'none'
                })
              }
            })
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

})