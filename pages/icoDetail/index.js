//index.js
//获取应用实例
var app = getApp()
var WxParse = require('../../utils/wxParse/wxParse')
var {
	api
} = require('../../config/api.default')

Page({
	data: {
		motto: 'Hello World',
        userInfo: {},
        _icoDetail: {}
	},
    icoSite: function() {
        const icoSiteLink = this.data.ico.icoSiteLink		
		wx.setClipboardData({
			data: icoSiteLink,
			success: function(res) {
				wx.getClipboardData({
					success: function(res) {
						console.log(res.data) // data
					}
				})
				wx.showModal({
					title: '提示',
					content: '由于小程序限制，无法直接打开页面，已复制ICO官网地址，请使用手机浏览器访问！',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定')
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			}
		})
    },
	onLoad: function (option) {
		console.log('onLoad')
		const that = this
		//调用应用实例的方法获取全局数据
		app.getUserInfo(function (userInfo) {
			//更新数据
			that.setData({
				userInfo: userInfo
			})
		})
		wx.request({
			url: `${api.getIcoDetail}?icoId=${option.icoId}`,
			success: (data) => {
                const ico = data.data.data.ico
                const icoDetail = ico.icoDetail
                WxParse.wxParse('icoDetail', 'html', icoDetail, that, 5)
				that.setData({
                    ico: ico
				})
			}
		})
	}
})
