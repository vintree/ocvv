//index.js
//获取应用实例
var app = getApp()
var { api } = require('../../config/api.default')
const { getEnhanceUserInfo } = require('../../lib/authorize')
const { request } = require('../../lib/request')
Page({
	data: {
		userInfo: {},
		officialInfo: {},
		isFinish: false
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
	onLoad: function (req) {
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
										this.setData({
											officialInfo: res.data.officialInfo
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
	}
})
