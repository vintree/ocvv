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
		// 判断删除 || 新建
		let { officialInfoId } = this.data.urlParams
		let key = officialInfoId ? 'infoSetOfficialInfo' : 'infoCreate'
		let data = {}
		if(officialInfoId) {
			// 更新信息
			data = {
				officialInfoId: officialInfoId,
				officialInfoTitle: title,
				officialInfoContent: content
			}
			
			wx.showLoading({
				title: '正在发布中...',
				mask: true
			})

			request({
				key: 'infoSetOfficialInfo',
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
							success: (res) => {
								console.log('ddsss', res);
								wx.redirectTo({
									url: `../officialInfoDetail/index?officialInfoId=${officialInfoId}`
								})
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
		} else {
			// 新建
			data = {
				officialInfoTitle: title,
				officialInfoContent: content,
				wxPage: 'pages/officialInfoDetail/index',
				wxWidth: 50
			}

			wx.showLoading({
				title: '正在发布中...',
				mask: true
			})

			request({
				key: 'infoCreate',
				data: data,
				isLogin: true,
				success: (res) => {
					wx.hideLoading()
					officialInfoId = res.data.officialInfoId
					if(res.code === 200) {
						wx.showToast({
							title: '发布成功',
							icon: 'success',
							duration: 1000,
							mask: true,
							success: (res) => {
								console.log('ddsss', res);
								wx.redirectTo({
									url: `../officialInfoDetail/index?officialInfoId=${officialInfoId}`
								})
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
		}
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
