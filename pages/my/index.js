//index.js
//获取应用实例
var app = getApp()
var { api } = require('../../config/api.default')
const { getEnhanceUserInfo } = require('../../lib/authorize')
const { request } = require('../../lib/request')

let isRequest = false
let lockRequest = false
Page({
	data: {
		userInfo: {},
		officialInfo: {},
	},
	gotoMyOfficialDetail: function() {
		wx.navigateTo({
            url: `../myOfficialDetail/index?officialId=${this.data.userInfo.officialId}`
        })
	},
	gotoMyOfficialApply: function() {
		wx.navigateTo({
            url: `../myOfficialApply/index`
        })
	},
    gotoSend: function(e) {
        wx.navigateTo({
            url: `../send/index`
        })
	},
	gotoMyOfficialInfoList: function(e) {
		const { officialId } = this.data.userInfo
		wx.navigateTo({
            url: `../myOfficialInfoList/index?officialId=${officialId}`
        })
	},
	gotoMyDynamic: function(e) {
		wx.navigateTo({
            url: `../myDynamic/index`
        })
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
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		getEnhanceUserInfo((wxSessionCode, userInfo) => {
			request({
				key: 'userValid',
				data: {
					...userInfo,
				},
				isLogin: true,
				success: (res) => {
					if(res.code === 200) {
						this.setData({
							userInfo: {
								...userInfo,
								...res.data.userInfo
							}
						})
						if(res.data.userInfo.officialId) {
							request({
								key: 'officialGetOfficialDetail',
								isLogin: true,
								data: {
									officialId: res.data.userInfo.officialId
								},
								success: (res) => {
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
									} else {
										wx.showToast({
											title: '加载失败',
											icon: 'fial',
											duration: 1200
										})
									}
								}
							})
						}
					}
				},
				fial: () => {
				}
			})
			wx.hideLoading()
		}, (res) => {
			wx.hideLoading()
		})
	},
	onLoad: function (res) {
		this.setData({
			urlParams: res
		})
		this.requestRule()
	}
})
