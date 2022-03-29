// pages/index/release.js
const api = require('../../api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: '',
        array:[],
        tab:0,
        controlled: true,
        items: [{
                name: '1',
                value: '预约商品 （到店扫码消费）'
            },
            {
                name: '0',
                value: '实物商品 （寄送物流商品）',
                checked: 'true'
            },
        ],
        photo_x: [],
        photo_string: [],
        content_photo: [],
        is_shiwu: 0,
        pid: ''
    },
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value,
            tab:1
        })
    },
    change(e) {
        let that = this
        let {
            url,
            status
        } = e.detail.file
        console.log(url)
        if (status == 'uploading') {
            wx.showLoading({
                title: '上传中...',
            })
            wx.uploadFile({
                url: 'https://meifa.rs1818.cn/index.php/api/Adminshop/photo_add',
                filePath: url,
                name: 'files',
                success(res) {
                    let data = JSON.parse(res.data)
                    that.setData({
                        photo_x: [{
                            id: 0,
                            url: `https://meifa.rs1818.cn/Data/${data.photo_arr}`
                        }]
                    })
                    wx.showToast({
                        title: '上传成功',
                    })
                }
            })
        }
    },
    change1(e) {
        let that = this
        let {
            url,
            status
        } = e.detail.file
        console.log(e)
        if (status == 'uploading') {
            console.log(url)
            wx.showLoading({
                title: '上传中...',
            })
            wx.uploadFile({
                url: 'https://meifa.rs1818.cn/index.php/api/Adminshop/photo_add',
                filePath: url,
                name: 'files',
                success(res) {
                    let data = JSON.parse(res.data)
                    that.setData({
                        photo_string: [...that.data.photo_string, {
                            id: 0,
                            url: `https://meifa.rs1818.cn/Data/${data.photo_arr}`
                        }]
                    })
                    console.log(data)
                    wx.showToast({
                        title: '上传成功',
                    })
                }
            })
        }
    },
    change2(e) {
        let that = this
        let {
            url,
            status
        } = e.detail.file
        console.log(e)
        if (status == 'uploading') {
            console.log(url)
            wx.showLoading({
                title: '上传中...',
            })
            wx.uploadFile({
                url: 'https://meifa.rs1818.cn/index.php/api/Adminshop/photo_add',
                filePath: url,
                name: 'files',
                success(res) {
                    let data = JSON.parse(res.data)
                    that.setData({
                        content_photo: [...that.data.content_photo, {
                            id: 0,
                            url: `https://meifa.rs1818.cn/Data/${data.photo_arr}`
                        }]
                    })
                    console.log(data)
                    wx.showToast({
                        title: '上传成功',
                    })
                }
            })
        }
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
    },
    submit(e) { //提交
        let shop_id = wx.getStorageSync('id')
        let {
            type
        } = e.detail.target.dataset
        let {
            photo_x,
            photo_string,
            content_photo,
            is_shiwu,
            pid,
            index,
            array,tab
        } = this.data
        let {
            name,
            pro_number,
            price,
            yuanjia,
            content
        } = e.detail.value
        let arr = ''
        let arr1 = ''
        let arr2 = ''
        photo_x.map(i => {
            arr = `${arr},${i.url.slice(29)}`
        })
        photo_string.map(i => {
            arr1 = `${arr1},${i.url.slice(29)}`
        })
        content_photo.map(i => {
            arr2 = `${arr2},${i.url.slice(29)}`
        })
        let cid = ''
        let cateid = ''
        array.map((i,ind) => {
            if(ind== index){
                cid = i.tid
                cateid = i.id
            }
        })
        let data = {
            pid,
            shop_id,
            name,
            pro_number,
            cid,
            cateid,
            price,
            yuanjia,
            content,
            is_shiwu,
            photo_x: arr.slice(1),
            photo_string: arr1.slice(1),
            content_photo: arr2.slice(1),
            is_cangku: type
        }
        console.log(data)
        if (data.name == '') {
            wx.showToast({
                title: '请输入商品名称',
                icon: 'none'
            })
        } else if (data.pro_number == '') {
            wx.showToast({
                title: '请输入商品货号',
                icon: 'none'
            })
        } else if (tab == 0) {
            wx.showToast({
                title: '请选择商品分类',
                icon: 'none'
            })
        } else if (data.price == '') {
            wx.showToast({
                title: '请输入价格',
                icon: 'none'
            })
        } else if (data.yuanjia == '') {
            wx.showToast({
                title: '请输入市场价',
                icon: 'none'
            })
        } else if (Number(data.price) > Number(data.yuanjia)) {
            wx.showToast({
                title: '价格不能大于市场价',
                icon: 'none'
            })
        } else if (data.photo_x.length == 0) {
            wx.showToast({
                title: '请上传主图',
                icon: 'none'
            })
        } else if (data.photo_string.length == 0) {
            wx.showToast({
                title: '请上传轮播图',
                icon: 'none'
            })
        } else if (data.content_photo.length == 0) {
            wx.showToast({
                title: '请上传商品详情图',
                icon: 'none'
            })
        } else if (data.content == '') {
            wx.showToast({
                title: '请输入货品描述',
                icon: 'none'
            })
        } else {
            api.getAPI('Adminshop/product_add', data).then(res => {
                console.log(res)
                if (res.data.status == 1) {
                    wx.showToast({
                        title: '成功',
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 0,
                        })
                    }, 1000);
                }
            })
        }
    },
    remove() {
        this.setData({
            photo_x: []
        })
    },
    onRemove(e) {
        let url = e.detail.file.url
        this.setData({
            photo_string: this.data.photo_string.filter(i => i.url != url)
        })
    },
    remove1(e) {
        let url = e.detail.file.url
        this.setData({
            content_photo: this.data.content_photo.filter(i => i.url != url)
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let shop_id = wx.getStorageSync('id')
        let {
            id
        } = options
        api.getAPI('Adminshop/cate_list', {
            shop_id
        }).then(res => {
            console.log(res)
            this.setData({
                array:res.data.list
            })
        })
        console.log(id)
        if (options.id) {
            console.log(id)
            wx.setNavigationBarTitle({
                title: '编辑'
            })
            this.setData({
                pid: id
            })
            api.getAPI('Adminshop/product_info', {
                shop_id,
                pid: id
            }).then(res => {
                console.log(res)
                let arr = []
                res.data.info.img_arr.map((i, ind) => {
                    arr = [...arr, {
                        url: i,
                        id: ind
                    }]
                })
                let arr1 = []
                let arr2 = []
                arr1 = res.data.info.content_photo.split(',')
                arr1.map((i, ind) => {
                    if (ind == 0) {
                        arr2 = [...arr2, {
                            url: i,
                            id: ind
                        }]
                    } else {
                        arr2 = [...arr2, {
                            url: `https://meifa.rs1818.cn/Data/${i}`,
                            id: ind
                        }]
                    }
                })
                let {cid,cateid} = res.data.info
                this.setData({
                    info: res.data.info,
                    photo_x: [{
                        uid: 0,
                        url: res.data.info.photo_x
                    }],
                    photo_string: arr,
                    content_photo: arr2,
                })
                let array = this.data.array
                let index = ''
                array.map((i,ind) => {
                    if(i.tid == cid && i.id == cateid){
                        index = ind
                    }
                })
                if(index != ''){
                    this.setData({
                        tab:1,
                        index
                    })
                }
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})