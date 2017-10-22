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
					const { official, officialInfo, isOfficialInfoSupport } = res.data
					this.setData({
						official,
						officialInfo,
						isOfficialInfoSupport
					})
				}
			}
		})
	}
})
