// pages/my/address.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[
            {
                name:'名',
                phone:'123123123',
                address:'省市区',
                detailed:'详细地址',
                type:true,
            },
            {
                name:'名',
                phone:'123123123',
                address:'省市区',
                detailed:'详细地址',
                type:false,
            },
            {
                name:'名',
                phone:'123123123',
                address:'省市区',
                detailed:'详细地址',
                type:false,
            },
        ],
    },
    getAddress(){
        wx.chooseAddress({
            success (res) {
              console.log(res.userName)
              console.log(res.postalCode)
              console.log(res.provinceName)
              console.log(res.cityName)
              console.log(res.countyName)
              console.log(res.detailInfo)
              console.log(res.nationalCode)
              console.log(res.telNumber)
            }
          })
    },
    click(e){
        let {ind} = e.currentTarget.dataset
        this.setData({
            list:this.data.list.map((i,index) => {
                i.type = false
                if(index == ind){
                    i.type = true
                }
                return i
            })
        })
    },
    del(e){
        console.log('删除')
    },
    bj(e){
        console.log('编辑')
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