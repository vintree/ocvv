//index.js
//获取应用实例
var app = getApp()
var {
	api
} = require('../../config/api.default')
const urlx = require('../../lib/urlx')

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
            url: `../officialInfoDetail/index${urlx.stringify(params, true)}`
        })
    },
	onLoad: function (req) {
		var that = this
		wx.request({
			url: api({
				key: 'infoGetOfficialAndOfficialInfoList'
			}),
			data: {
				officialId: req.officialId
			},
			success: (req) => {
				this.setData({
					official: req.data.data.official,
					officialInfoCount: req.data.data.officialInfoCount,
					officialInfoList: req.data.data.officialInfoList
				})
			}
		})
	}
})
