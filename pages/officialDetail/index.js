//index.js
//获取应用实例
var app = getApp()
const { request, uploadFile } = require('../../lib/request')

Page({
	data: {
		officialInfo: {}
	},
	uploadPic: function() {
		wx.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			success: function(res) {
				const tempFilePaths = res.tempFilePaths
				uploadFile({
					key: 'officialUploadOfficialPic',
					data: {},
					filePath: tempFilePaths[0],
					isLogin: true,
					success: (res) => {
						console.log('res'. res);
					}
				})
			}
		})
	},
	handleMap: function() {
		wx.openLocation({
			latitude: Number(this.data.officialInfo.officialLat),
			longitude: Number(this.data.officialInfo.officialLog),
			address: this.data.officialInfo.officialAddress + this.data.officialInfo.officialDoorplate,
			scale: 28,
			success: (res) => {
				console.log('s', res);
			},
			fail: (res) => {
				console.log('f', res);
			}
		})
	},
	// formSubmit: function(e) {
	// 	request({
	// 		key: 'officialSetOfficialInfo',
	// 		data: {
	// 			...this.data.officialInfo,
	// 			...e.detail.value
	// 		},
	// 		isLogin: true,
	// 		success: (res) => {
	// 			if(res.code === 200) {
	// 				console.log('dadsddasds');
	// 				if(res.data.success) {
	// 					wx.showToast({
	// 						title: '更新成功',
	// 						icon: 'success',
	// 						duration: 1200
	// 					})
	// 				}
	// 			}
	// 		}
	// 	})
	// },
	onLoad: function (req) {
		wx.showLoading({
			title: '加载中...',
			mask: true
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
				wx.hideLoading()
			}
		})
	}
})
