//index.js
//获取应用实例
var app = getApp()
var {
	api
} = require('../../config/api.default')
const official = require('../../data/official')
const content = require('../../data/officialContent')
const {
	getEnhanceUserInfo
} = require('../../lib/authorize')
const { request } = require('../../lib/request')

Page({
	data: {
		officialInfo: {},
		isOfficialInfoSupport: false,
		urlParams: {}
	},
	onShareAppMessage: function(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: this.data.official.officialName,
			path: `/pages/officialInfoDetail?officialInfoId=${this.data.urlParams.officialInfoId}`,
			success: (res) => {
				let { officialInfo, urlParams } = this.data
				officialInfo.officialInfoShare = officialInfo.officialInfoShare++
				this.setData({
					officialInfo: officialInfo
				})
				request({
					key: 'dynamicInfoShare',
					data: {
						officialInfoId: urlParams.officialInfoId
					},
					isLogin: true,
					success: (res) => {
						if(res.code === 200) {
							console.log('res', res);
							officialInfo.officialInfoShare = res.data.officialInfoShare
							this.setData({
								officialInfo
							})
						}
					}
				})
			},
			fail: function(res) {
				// 转发失败
				console.log('fail');
			}
		}
	},
	handleSupport: function() {
		let { officialInfo, urlParams } = this.data
		officialInfo.officialInfoSupport = officialInfo.officialInfoSupport + 1
		if(this.data.isOfficialInfoSupport) return

		this.setData({
			isOfficialInfoSupport: !this.data.isOfficialInfoSupport,
			officialInfo: officialInfo
		})
		request({
			key: 'dynamicInfoSupport',
			data: {
				officialInfoId: urlParams.officialInfoId
			},
			isLogin: true,
			success: (res) => {
				wx.hideLoading()
				if(res.code === 200) {
					const officialInfoSupport = res.data.officialInfoSupport
					const isOfficialInfoSupport = res.data.officialInfoSupport
					officialInfo.officialInfoSupport = officialInfoSupport
					this.setData({
						isOfficialInfoSupport,
						officialInfo
					})
				}
			}
		})
	},
	gotoOfficialInfoList: function(e) {
        wx.redirectTo({
            url: `../officialInfoList/index?officialId=${this.data.official.officialId}`
        })
	},
	gotoOfficialInfoDetailShare: function(e) {
		wx.navigateTo({
            url: `../officialInfoDetailShare/index?officialId=${this.data.official.officialId}`
        })
	},
	onReady:function(){ 

		// wx.getSystemInfo({
		// 	success: (res) => {
		// 		console.log('ddss', res);
		// 		const { windowWidth, windowHeight } = res
		// 		const ctx = wx.createCanvasContext('myCanvas')
		// 		ctx.drawImage('https://chuantu.biz/t6/111/1508870571x605558817.png', 0, 0, windowWidth, windowHeight)
		// 		ctx.draw()
		// 	}
		// })
		// const ctx = wx.createCanvasContext('myCanvas')
		// ctx.drawImage('https://pic.ieee.top/official/circle/share.png', 0, 0, 100, 200)
		// ctx.draw()
		
	}, 
	onLoad: function (res) {
		this.setData({
			urlParams: res
		})

		wx.showLoading({
			title: '加载中',
			mask: true
		})

		request({
			key: 'infoGet',
			data: {
				officialInfoId: res.officialInfoId,
			},
			success: (res) => {
				wx.hideLoading()
				if(res.code === 200) {
					const { official, officialInfo, isOfficialInfoSupport } = res.data
					this.setData({
						official,
						officialInfo,
						isOfficialInfoSupport
					})

					// const ctx = wx.createCanvasContext('myCanvas')
					// ctx.drawImage('https://chuantu.biz/t6/111/1508870571x605558817.png', 0, 0, 100, 200)
					// ctx.draw()
					// setTimeout(() => {
					// 	console.log('ddsss');
					// 	wx.canvasToTempFilePath({
					// 		x: 0,
					// 		y: 0,
					// 		width: 375,
					// 		height: 667,
					// 		destWidth: 375,
					// 		destHeight: 667,
					// 		canvasId: 'myCanvas',
					// 		success: function(res) {
					// 			console.log('ddsssdsasdas');
					// 			console.log('22222', res.tempFilePath)
				
					// 			wx.previewImage({
					// 				urls: [res.tempFilePath],
					// 				success: (res) => {
					// 					console.log('success', res);
					// 				},
					// 				complete: (res) => {
					// 					console.log('complete:', res);
					// 				}
					// 			})
					// 		},
					// 		complete: (res) => {
					// 			console.log(res);
					// 		}
					// 	})
					// }, 2000)
				}
			}
		})
		
	}
})
