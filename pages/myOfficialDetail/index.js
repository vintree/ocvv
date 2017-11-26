//index.js
//获取应用实例
var app = getApp()
const { request, uploadFile } = require('../../lib/request')

let isRequest = false
let lockRequest = false
Page({
	data: {
		officialInfo: {},
		urlParams: {}
	},
	onPullDownRefresh: function() {
		if(isRequest) return
		if(!lockRequest) {
			lockRequest = true
			this.requestRule({
				wxScrollType: 'top'
			})
		}
	},
	requestRule: function(options = {}) {
		const { wxScrollType } = options
		if(!this.data.isFinish || wxScrollType === 'top') {
			isRequest = true
			request({
				key: 'officialGetOfficialDetail',
				data: {
					officialId: this.data.urlParams.officialId
				},
				success: (res) => {
					wx.hideLoading()
					if(res.code === 200) {
						if(wxScrollType === 'top') {
							wx.stopPullDownRefresh()
							wx.showToast({
								title: '刷新成功',
								icon: 'success',
								duration: 1200
							})
						}
						setTimeout(() => {
							isRequest = false
							this.setData({
								officialInfo: res.data.officialInfo,
							})
							lockRequest = false
						})
					}
				}
			})
		}
	},
	uploadPic: function() {
		wx.chooseImage({
			count: 1,
			sizeType: ['compressed'],
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
						wx.switchTab({
							url: '../my/index',
							success: (e) => {
								// tab切换刷新
								let page = getCurrentPages().pop();  
								if (page == undefined || page == null) return;  
								page.onLoad();  
							}
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
		this.requestRule()
		// request({
		// 	key: 'officialGetOfficialDetail',
		// 	data: {
		// 		officialId: req.officialId
		// 	},
		// 	isLogin: true,
		// 	success: (res) => {
		// 		if(res.code === 200) {
		// 			this.setData({
		// 				officialInfo: res.data.officialInfo
		// 			})
		// 		}
		// 	}
		// })
	}
})
