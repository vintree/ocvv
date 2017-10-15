//index.js
//获取应用实例
var app = getApp()
var {
	api
} = require('../../config/api.default')
const {
	getEnhanceUserInfo
} = require('../../lib/authorize')
const { request } = require('../../lib/request')


Page({
	data: {
		officialInfo: {}
	},
	uploadPic: function() {
		getEnhanceUserInfo((wxSessionCode) => {
			// const code = options.resLogin.code
			if(code) {
				wx.chooseImage({
					count: 1,
					success: function(res) {
						var tempFilePaths = res.tempFilePaths
						wx.uploadFile({
							url: 'http://api.ieee.top:7001/rest/official/uploadOfficialPic', //仅为示例，非真实的接口地址
							header: {
								'content-type':'multipart/form-data'
							},
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								code: wxSessionCode
							},
							success: function(res){
								var data = res.data
								console.log('dddd', res);
								//do something
							}
						})
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
				this.setData({
					officialInfo: officialInfo
				})
			}
		})

		// const officialInfo = this.data.officialInfo
		// wx.openLocation({
		// 	latitude: Number(officialInfo.officialLat),
		// 	longitude: Number(officialInfo.officialLog),
		// 	scale: 28,
		// 	success: (res) => {
		// 		console.log('sss', res);
		// 	}
		// })	  
	},
	onLoad: function (req) {
		request({
			key: 'officialGetOfficialInfo',
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
