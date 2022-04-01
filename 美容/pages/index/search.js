// pages/index/search.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        multiArray: [[], [], []],
        multiIndex: [0, 0, 0],
    },
    bindMultiPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          multiIndex: e.detail.value
        })
      },
      bindMultiPickerColumnChange: function (e) {
        var data = {
          multiArray: this.data.multiArray,
          multiIndex: this.data.multiIndex
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        console.log(data.multiIndex);
        let that = this
        api.getAPI('Search/index').then(r => {
            console.log(r)
            that.setData({
                multiArray:that.data.multiArray.map((i,ind) => {
                    if(ind == 0){
                        i = r.data.sheng
                    }
                    return i
                }),
                shengid:r.data.sheng[data.multiIndex[0]].id
            })
            api.getAPI('Search/city',{shengid:r.data.sheng[data.multiIndex[0]].id}).then(e => {
                console.log(e)
                that.setData({
                    multiArray:that.data.multiArray.map((i,ind) => {
                        if(ind == 1){
                            i = e.data.city
                        }
                        return i
                    }),
                    cityid:e.data.city[data.multiIndex[1]].id
                })
                api.getAPI('Search/area',{cityid:e.data.city[data.multiIndex[1]].id}).then(s => {
                    console.log(s)
                    that.setData({
                        multiArray:that.data.multiArray.map((i,ind) => {
                            if(ind == 2){
                                i = s.data.area
                            }
                            return i
                        }),
                        areaid:s.data.area[data.multiIndex[2]].id
                    })
                })
            })
        })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        let {type} = options
        console.log(type)
        api.getAPI('Search/index').then(r => {
            console.log(r)
            that.setData({
                multiArray:that.data.multiArray.map((i,ind) => {
                    if(ind == 0){
                        i = r.data.sheng
                    }
                    return i
                }),
                shengid:r.data.sheng[0].id
            })
            api.getAPI('Search/city',{shengid:r.data.sheng[0].id}).then(e => {
                console.log(e)
                that.setData({
                    multiArray:that.data.multiArray.map((i,ind) => {
                        if(ind == 1){
                            i = e.data.city
                        }
                        return i
                    }),
                    cityid:e.data.city[0].id
                })
                api.getAPI('Search/area',{cityid:e.data.city[0].id}).then(s => {
                    console.log(s)
                    that.setData({
                        multiArray:that.data.multiArray.map((i,ind) => {
                            if(ind == 2){
                                i = s.data.area
                            }
                            return i
                        }),
                        areaid:s.data.area[0].id
                    })
                })
            })
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})