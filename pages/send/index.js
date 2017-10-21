//index.js
//获取应用实例

// const Promise = global.Promise = require('../../lib/es6-promise.min')
// const regeneratorRuntime = global.regeneratorRuntime = require('../../lib/regenerator-runtime')
// const co = require('../../lib/co')

var app = getApp()
var { api } = require('../../config/api.default')
const { getEnhanceUserInfo } = require('../../lib/authorize')
const { request } = require('../../lib/request')

Page({
	data: {
		page: 1,
		pageSize: 10,
		icoList: [],
		isFinish: false,
		isRequestGetIcoList: false,
		windowWidth: 0,
		urlParams: {},
		officialInfoTitle: '',
		officialInfoContent: ''
	},
	formSubmit: function(e) {
		const { title, content } = e.detail.value
		// 判断删除 || 创建
		const { officialInfoId } = this.data.urlParams
		let key = officialInfoId ? 'infoSetOfficialInfo' : 'infoCreate'
		const data = {
			officialInfoId: this.data.urlParams.officialInfoId,
			officialInfoTitle: title,
			officialInfoContent: content,
			wxPage: 'pages/officialInfoDetail/index',
			wxWidth: 200
		}

		wx.showLoading({
			title: '正在发布中...',
			mask: true
		})
		
		request({
			key: key,
			data: data,
			isLogin: true,
			success: (res) => {
				wx.hideLoading()
				if(res.code === 200) {
					wx.showToast({
						title: '发布成功',
						icon: 'success',
						duration: 1000,
						mask: true,
						success: () => {
							if(officialInfoId) {
								wx.navigateTo({
									url: `../officialInfoDetail/index?officialInfoId=${officialInfoId}`
								})
							} else {
								wx.navigateTo({
									url: `../officialInfoDetail/index?officialInfoId=${res.data.officialInfoId}`
								})
							}
						}
					})
				} else {
					wx.showToast({
						title: '发布失败',
						icon: 'error',
						duration: 1000,
						mask: true,
						success: () => {}
					})
				}
			}
		})

		// getEnhanceUserInfo((wxSessionCode) => {
		// 	// const code = options.resLogin.code
		// 	data.wxSessionCode = wxSessionCode

		// 	wx.showLoading({
		// 		title: '正在发布中...',
		// 		mask: true
		// 	})
		// 	wx.request({
		// 		url: api({
		// 			key: key
		// 		}),
		// 		data: data,
		// 		success: (res) => {
		// 			wx.hideLoading()
		// 			if(res.data.code === 200) {
		// 				wx.showToast({
		// 					title: '发布成功',
		// 					icon: 'success',
		// 					duration: 1000,
		// 					mask: true,
		// 					success: () => {
		// 						if(officialInfoId) {
		// 							wx.navigateTo({
		// 								url: `../officialInfoDetail/index?officialInfoId=${officialInfoId}`
		// 							})
		// 						} else {
		// 							wx.navigateTo({
		// 								url: `../officialInfoDetail/index?officialInfoId=${res.data.data.officialInfoId}`
		// 							})
		// 						}
		// 					}
		// 				})
		// 			} else {
		// 				wx.showToast({
		// 					title: '发布失败',
		// 					icon: 'error',
		// 					duration: 1000,
		// 					mask: true,
		// 					success: () => {}
		// 				})
		// 			}
		// 		}
		// 	})
		// })
	},
    gotoSendConf: function(e) {
        wx.navigateTo({
            url: `../sendConf/index`
        })
    },
	onLoad: function (res) {
		this.setData({
			urlParams: res
		})
		const { officialInfoId } = res
		if(officialInfoId) {
			wx.showLoading({
				title: '加载中',
				mask: true
			})
			getEnhanceUserInfo((wxSessionCode) => {
				wx.request({
					url: api({
						key: 'infoGet'
					}),
					data: {
						wxSessionCode,
						officialInfoId
					},
					success: (res) => {
						wx.hideLoading()
						console.log('res', res);
						if(res.data.code === 200) {
							this.setData({
								officialInfoTitle: res.data.data.officialInfo.officialInfoTitle,
								officialInfoContent: res.data.data.officialInfo.officialInfoContent
							})
						} else {
							wx.showToast({
								title: '加载失败',
								icon: 'error',
								duration: 1000,
								mask: true,
								success: () => {}
							})
						}
					}
				})
			})
		}
	}
})
