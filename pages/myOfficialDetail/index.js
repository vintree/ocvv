//index.js
//获取应用实例
var app = getApp()
var {
	api
} = require('../../config/api.default')
const { getEnhanceUserInfo } = require('../../lib/authorize')
const { request, uploadFile } = require('../../lib/request')

Page({
	data: {
		officialInfo: {}
	},
	uploadPic: function() {
		wx.chooseImage({
			count: 1,
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


		


		// getEnhanceUserInfo((wxSessionCode) => {
		// 	// const code = options.resLogin.code
		// 	if(code) {
		// 		wx.chooseImage({
		// 			count: 1,
		// 			success: function(res) {
		// 				var tempFilePaths = res.tempFilePaths
		// 				console.log('dsds', tempFilePaths);
		// 				wx.uploadFile({
		// 					url: 'http://api.ieee.top:7001/rest/official/uploadOfficialPic', //仅为示例，非真实的接口地址
		// 					header: {
		// 						'content-type':'multipart/form-data'
		// 					},
		// 					filePath: tempFilePaths[0],
		// 					name: 'file',
		// 					formData: {
		// 						code: wxSessionCode
		// 					},
		// 					success: function(res){
		// 						var data = res.data
		// 						console.log('dddd', res);
		// 						//do something
		// 					}
		// 				})
		// 			}
		// 		})
		// 	}
		// })
	},
	handleMap: function() {
		wx.chooseLocation({
			success: (req) => {
				console.log('req', req);
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
		console.log('ddddd');
		request({
			key: 'officialSetOfficialInfo',
			data: {
				...this.data.officialInfo,
				...e.detail.value
			},
			isLogin: true,
			success: (res) => {
				if(res.code === 200) {
					if(res.code.success) {
						// wx.redirectTo({
							// url: `../my/index`
						// })
					}
				}
			}
		})
	},
	onLoad: function (req) {
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
