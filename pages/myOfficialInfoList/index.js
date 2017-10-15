//index.js
//获取应用实例
var app = getApp()
var {
	api
} = require('../../config/api.default')
const urlx = require('../../lib/urlx')
const { request } = require('../../lib/request')
Page({
	data: {},
	gotoOfficialDetail: function(e) {
        wx.navigateTo({
            url: `../officialDetail/index`
        })
	},
	gotoOfficialInfoDetail: function(e) {
		const params = {
			...e.currentTarget.dataset.params,
			...this.data.official
		}
        wx.navigateTo({
            url: `../myOfficialInfoDetail/index${urlx.stringify(params, true)}`
        })
    },
	onLoad: function (res) {
		var that = this
		request({
			key: 'infoGetOfficialAndOfficialInfoList',
			data: {
				officialId: res.officialId
			},
			isLogin: true,
			success: (res) => {
				this.setData({
					official: res.data.official,
					officialInfoCount: res.data.officialInfoCount,
					officialInfoList: res.data.officialInfoList
				})
			}
		})
	}
})
