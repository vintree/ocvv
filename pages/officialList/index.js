//index.js
//获取应用实例
var app = getApp()
var { api } = require('../../config/api.default')
const urlx = require('../../lib/urlx')
const { getEnhanceUserInfo } = require('../../lib/authorize')

let isRequestGetIcoList = false
let lockRequestIcoList = false
Page({
	data: {
		officialList: []
	},
    gotoOfficialAll: function(e) {
        wx.navigateTo({
            url: `../officialAll/index`
        })
	},
	gotoOfficialInfoList: function(e) {
		console.log('dadsa', e.currentTarget.dataset);
		const { officialId } = e.currentTarget.dataset.params
        wx.navigateTo({
            url: `../officialInfoList/index${urlx.stringify({
				officialId
			}, true)}`
        })
	},
	handleOfficialFocus: function(e) {
		const { params } = e.currentTarget.dataset
		console.log('ddd', e.currentTarget);
		getEnhanceUserInfo((wxSessionCode) => {
			// const code = options.resLogin.code
			// const userInfo = options.resGetUserInfo.userInfo
			wx.request({
				url: api({
					key: 'dynamicFocus'
				}),
				data: {
					officialId: params.officialId,
					wxSessionCode
				},
				success: (req) => {
					console.log('ssss', req);
					// this.setData({
					// 	userInfo: {
					// 		...userInfo,
					// 		...req.data.data.userInfo
					// 	}
					// })
				}
			})
		})

		e.stopPropagation()
	},
	onLoad: function (req) {
		var that = this

		getEnhanceUserInfo((wxSessionCode) => {
			// const code = options.resLogin.code
			// const userInfo = options.resGetUserInfo.userInfo
			wx.request({
				url: api({
					key: 'officialGetList'
				}),
				data: {
					circleId: req.circleId,
					wxSessionCode
				},
				success: (req) => {
					this.setData({
						officialList: req.data.data.officialList,
						urlParams: req
					})
				}
			})
		})

		
	}
})
