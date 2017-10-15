//index.js
//获取应用实例
var app = getApp()
var {
	api
} = require('../../config/api.default')
const { 
	circleList,
	circleFocus
} = require('../../data/circle')
const urlx = require('../../lib/urlx')
Page({
	data: {
		circleList: []
	},
    gotoCircleAll: function(e) {
        wx.navigateTo({
            url: `../circleAll/index`
        })
	},
	gotoOfficialList: function(e) {
        wx.navigateTo({
            url: `../officialList/index${urlx.stringify({
				...this.data.urlParams,
				circleId: e.currentTarget.dataset.circleid
			}, true)}`
        })
    },
	gotoofficialInfoList: function(e) {
        wx.navigateTo({
            url: `../officialInfoList/index`
        })
    },
	onLoad: function (req) {
		const urlParams = req
		wx.request({
			url: api({
				key: 'circleGetListAndOfficialCount'
			}),
			success: (req) => {
				console.log('circleList', req.data.data.circleList);
				this.setData({
					circleList: req.data.data.circleList,
					urlParams
				})
			}
		})
	}
})
