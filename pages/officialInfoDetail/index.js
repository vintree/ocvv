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
		urlParams: {},
		isOneself: false
	},
	onShareAppMessage: function(res) {
		let { officialInfo, urlParams, official } = this.data
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: official.officialName + ' · 官方消息',
			path: `pages/officialInfoDetail?officialInfoId=${urlParams.officialInfoId}`,
			success: (res) => {
				officialInfo.officialInfoShare = officialInfo.officialInfoShare++
				this.setData({
					officialInfo: officialInfo
				})
				request({
					key: 'dynamicInfoShare',
					data: {
						officialInfoId: urlParams.officialInfoId,
						officialId: official.officialId
					},
					isLogin: true,
					success: (res) => {
						if(res.code === 200) {
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
		let { officialInfo, urlParams, official } = this.data		
		officialInfo.officialInfoSupport = officialInfo.officialInfoSupport + 1
		if(this.data.isOfficialInfoSupport) return

		this.setData({
			isOfficialInfoSupport: !this.data.isOfficialInfoSupport,
			officialInfo: officialInfo
		})
		request({
			key: 'dynamicInfoSupport',
			data: {
				officialInfoId: urlParams.officialInfoId,
				officialId: official.officialId
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
	gotoSend: function(e) {
		wx.navigateTo({
            url: `../send/index?officialInfoId=${this.data.officialInfo.officialInfoId}`
        })
	},
	handleDelete: function(e) {
		wx.showActionSheet({
			itemList: ['删除'],
			itemColor: '#FF0000',
			success: (res) => {
				if(res.tapIndex === 0) {
					request({
						key: 'infoDelete',
						data: {
							officialInfoId: this.data.urlParams.officialInfoId
						},
						isLogin: true,
						success: (res) => {
							wx.redirectTo({
								url: `../myOfficialInfoList/index?officialId=${this.data.urlParams.officialId}`
							})
						}
					})


					// getEnhanceUserInfo((wxSessionCode) => {
					// 	// const code = options.resLogin.code
					// 	wx.request({
					// 		url: api({
					// 			key: 'infoDelete'
					// 		}),
					// 		data: {
					// 			wxSessionCode,
					// 			officialInfoId: this.data.urlParams.officialInfoId
					// 		},
					// 		success: (req) => {
					// 			wx.redirectTo({
					// 				url: `../myOfficialInfoList/index?officialId=${this.data.urlParams.officialId}`
					// 			})
					// 		}
					// 	})
					// })
				}
			},
			fail: function(res) {
			  	console.log(res.errMsg)
			}
		})
	},
	handleMore: function() {
		wx.showActionSheet({
			itemList: ['编辑', '删除'],
			itemColor: '#666',
			success: (res) => {
				switch(res.tapIndex) {
					case 0:
						this.gotoSend()
						break;
					case 1:
						this.handleDelete()
						break;
				}
			},
			fail: function(res) {
			  	console.log(res.errMsg)
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
            url: `../officialInfoDetailShare/index?officialInfoId=${this.data.urlParams.officialInfoId}`
        })
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
					const { official, officialInfo, isOfficialInfoSupport, isOneself } = res.data
					this.setData({
						official,
						officialInfo,
						isOfficialInfoSupport,
						isOneself
					})
				}
			}
		})
	}
})
