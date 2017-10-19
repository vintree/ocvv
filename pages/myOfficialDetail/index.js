//index.js
//获取应用实例
var app = getApp()
const { request, uploadFile } = require('../../lib/request')

Page({
	data: {
		officialInfo: {},
		urlParams: {}
	},
	uploadPic: function() {
		wx.chooseImage({
			count: 1,
			success: (res) => {
				const tempFilePaths = res.tempFilePaths
				uploadFile({
					key: 'officialUploadOfficialPic',
					data: {
						officialId: this.data.urlParams.officialId
					},
					filePath: tempFilePaths[0],
					isLogin: true,
					success: (res) => {
						if(res.code === 200) {
							const officialInfo = this.data.officialInfo
							officialInfo.officialPicUrl = res.data.officialPicUrl
							this.setData({
								officialInfo
							})
						}
					}
				})
			}
		})
	},
	handleMap: function() {
		wx.chooseLocation({
			success: (req) => {
				const officialInfo = this.data.officialInfo
				officialInfo.officialLat = req.latitude
				officialInfo.officialLog = req.longitude
				officialInfo.officialAddress = req.address
				this.setData({
					officialInfo: officialInfo
				})
			}
		})
	},
	formSubmit: function(e) {
		wx.showLoading({
			title: '加载更多...',
			mask: true
		})
		request({
			key: 'officialSetOfficialInfo',
			data: {
				...this.data.officialInfo,
				...e.detail.value
			},
			isLogin: true,
			success: (res) => {
				if(res.code === 200) {
					wx.hideLoading()
					if(res.data.success) {
						wx.showToast({
							title: '更新成功',
							icon: 'success',
							duration: 1200,
							mask: true
						})
					}
				} else {
					wx.hideLoading()
				}
			},
			fail: () => {
				wx.hideLoading()
			}
		})
	},
	onLoad: function (req) {
		this.setData({
			urlParams: req
		})
		request({
			key: 'officialGetOfficialDetail',
			data: {
				officialId: req.officialId
			},
			isLogin: true,
			success: (res) => {
				if(res.code === 200) {
					this.setData({
						officialInfo: res.data.officialInfo
					})
				}
			}
		})
	}
})
