
function getAPI(url, data) {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    return new Promise(function (resolve, reject) {
        wx.request({
             url:'https://meifa.rs1818.cn/index.php/api/' + url,
            //  url:'https://localhost/ege/index.php/api/' + url,
            method: 'post',
            data,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                resolve(res);
            },
            fail: () => {
                reject("系统异常，请重试！")
            },
            complete(){
                wx.hideLoading({})
            }
        })
    })
}
module.exports = {
    getAPI
}