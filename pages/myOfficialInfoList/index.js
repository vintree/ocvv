//index.js
//获取应用实例
var app = getApp()
var {
	api
} = require('../../config/api.default')
const urlx = require('../../lib/urlx')
const { request } = require('../../lib/request')

let isRequest = false
let lockRequest = false
Page({
	data: {
		officialInfoList: []
	},
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
	onPullDownRefresh: function() {
		if(isRequest) return
		if(!lockRequest) {
			lockRequest = true
			this.requestRule({
				page: 1,
				pageSize: 10,
				wxScrollType: 'top'
			})
		}
	},
	requestRule: function(options) {
		const { page, pageSize, wxScrollType } = options
		if(!this.data.isFinish || wxScrollType === 'top') {
			isRequest = true
			let officialInfoList = this.data.officialInfoList

			request({
				key: 'infoGetOfficialInfoList',
				data: {
					officialId: this.data.urlParams.officialId,
					page: page || 1,
					pageSize: pageSize || 10
				},
				isLogin: true,
				success: (res) => {
					wx.hideLoading()
					if(res.code === 200) {
						const _officialInfoList = res.data.officialInfoList
						if(wxScrollType === 'top') {
							officialInfoList = _officialInfoList
							wx.stopPullDownRefresh()
							wx.showToast({
								title: '刷新成功',
								icon: 'success',
								duration: 1200
							})
						} else {
							officialInfoList = officialInfoList.concat(_officialInfoList)
						}
						setTimeout(() => {
							isRequest = false
							this.setData({
								page: page,
								pageSize: pageSize,
								officialInfoList: officialInfoList,
								isFinish: _officialInfoList.length === 0
							})
							lockRequest = false
						})
					}

					// this.setData({
					// 	officialInfoList: res.data.officialInfoList
					// })
					// wx.hideLoading()
				}
			})


			// request({
			// 	key: 'infoGetOfficialInfoList',
			// 	data: {
			// 		page: page || 1,
			// 		pageSize: pageSize || 10
			// 	},
			// 	success: (res) => {
			// 		wx.hideLoading()
			// 		if(res.code === 200) {
			// 			const _officialInfoList = res.data.officialInfoList
			// 			if(wxScrollType === 'top') {
			// 				officialInfoList = _officialInfoList
			// 				wx.stopPullDownRefresh()
			// 				wx.showToast({
			// 					title: '刷新成功',
			// 					icon: 'success',
			// 					duration: 1200
			// 				})
			// 			} else {
			// 				officialInfoList = officialInfoList.concat(_officialInfoList)
			// 			}
			// 			setTimeout(() => {
			// 				isRequest = false
			// 				this.setData({
			// 					page: page,
			// 					pageSize: pageSize,
			// 					officialInfoList: officialInfoList,
			// 					isFinish: _officialInfoList.length === 0
			// 				})
			// 				lockRequest = false
			// 			})
			// 		}
			// 	}
			// })
		}
	},
	onReachBottom: function(e) {
		if(isRequest) return
		if(!lockRequest) {
			this.requestRule({
				page: this.data.page + 1,
				pageSize: this.data.pageSize
			})
		}
	},
	onLoad: function (res) {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		this.setData({
			urlParams: res
		})
		this.requestRule({
			page: 1,
			pageSize: 10
		})
	}
})
