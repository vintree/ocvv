//index.js
//获取应用实例
var app = getApp()
var { api } = require('../../config/api.default')
const official = require('../../data/official')
const content = require('../../data/officialContent')
const { getEnhanceUserInfo } = require('../../lib/authorize')

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

				getEnhanceUserInfo((wxSessionCode) => {
					// const code = options.resLogin.code
					wx.request({
						url: api({
							key: 'dynamicInfoShare'
						}),
						data: {
							officialInfoId: urlParams.officialInfoId,
							wxSessionCode
						},
						success: (req) => {
							if(req.data.code === 200) {
								console.log('req', req);
								officialInfo.officialInfoShare = req.data.data.officialInfoShare
								this.setData({
									officialInfo
								})
							}
						}
					})
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
		officialInfo.officialInfoSupport = officialInfo.officialInfoSupport++

		if(this.data.isOfficialInfoSupport) return

		this.setData({
			isOfficialInfoSupport: !this.data.isOfficialInfoSupport,
			officialInfo: officialInfo
		})

		getEnhanceUserInfo((wxSessionCode) => {
			// const code = options.resLogin.code
			wx.request({
				url: api({
					key: 'dynamicInfoSupport'
				}),
				data: {
					officialInfoId: urlParams.officialInfoId,
					wxSessionCode
				},
				success: (req) => {
					if(req.data.code === 200) {
						const officialInfoSupport = req.data.data.officialInfoSupport
						const isOfficialInfoSupport = req.data.data.officialInfoSupport
						officialInfo.officialInfoSupport = officialInfoSupport
						this.setData({
							isOfficialInfoSupport,
							officialInfo
						})
					}
				}
			})
		})
	},
	gotoOfficialInfoList: function(e) {
        wx.navigateTo({
            url: `../officialInfoList/index`
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
					getEnhanceUserInfo((wxSessionCode) => {
						// const code = options.resLogin.code
						wx.request({
							url: api({
								key: 'infoDelete'
							}),
							data: {
								wxSessionCode,
								officialInfoId: this.data.urlParams.officialInfoId
							},
							success: (req) => {
								wx.redirectTo({
									url: `../myOfficialInfoList/index?officialId=${this.data.urlParams.officialId}`
								})
							}
						})
					})
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
	onLoad: function (req) {
		this.setData({
			urlParams: req
		})
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		getEnhanceUserInfo((wxSessionCode) => {
			wx.request({
				url: api({
					key: 'infoGet'
				}),
				data: {
					officialInfoId: req.officialInfoId,
					wxSessionCode
				},
				success: (req) => {
					if(req.data.code === 200) {
						const { official, officialInfo, isOfficialInfoSupport } = req.data.data
						this.setData({
							official,
							officialInfo,
							isOfficialInfoSupport
						})
					}
					wx.hideLoading()
				}
			})
		})
	}
})
