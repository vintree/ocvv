//index.js
//获取应用实例
var app = getApp()
var { api } = require('../../config/api.default')
// const { getEnhanceUserInfo } = require('../../lib/authorize')
const { request } = require('../../lib/request')
Page({
	data: {
		userInfo: {},
		officialInfo: {}
	},
	gotoMyOfficialDetail: function() {
		wx.navigateTo({
            url: `../myOfficialDetail/index?officialId=${this.data.userInfo.officialId}`
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
	onLoad: function (req) {
		wx.getUserInfo({
			success: (res) => {
				const userInfo = res.userInfo
				request({
					key: 'userValid',
					data: {
						...res.userInfo,
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
									key: 'officialGetOfficialInfo',
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
					}
				})
			}
		})
	}
})
