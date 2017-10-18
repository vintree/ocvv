//index.js
//获取应用实例
var app = getApp()
var { request } = require('../../lib/request')
const urlx = require('../../lib/urlx')

Page({
	data: {
		circleList: []
	},
	gotoOfficialList: function(e) {
        wx.navigateTo({
            url: `../officialList/index${urlx.stringify({
				...this.data.urlParams,
				circleId: e.currentTarget.dataset.circleid
			}, true)}`
        })
	},
	onPullDownRefresh: function() {
		this.requestCircleList({
			wxScrollType: 'top'
		})
	},
	requestCircleList: function(options = {}) {
		const { wxScrollType } = options
		request({
			key: 'circleGetListAndOfficialCount',
			success: (req) => {
				if(req.code === 200) {
					wx.hideToast()
					wx.stopPullDownRefresh()
					if(wxScrollType === 'top') {
						wx.showToast({
							title: '刷新成功',
							icon: 'success',
							duration: 1200
						})
					}
					this.setData({
						circleList: req.data.circleList,
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
	},
	onLoad: function (req) {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		this.setData({
			urlParams: req
		})
		this.requestCircleList()
	}
})
