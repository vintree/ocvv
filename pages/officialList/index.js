//index.js
//获取应用实例
var app = getApp()
var { api } = require('../../config/api.default')
const urlx = require('../../lib/urlx')
const { getEnhanceUserInfo } = require('../../lib/authorize')
const { request } = require('../../lib/request')

let isRequest = false
let lockRequest = false
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
		const { officialId } = e.currentTarget.dataset.params
        wx.navigateTo({
            url: `../officialInfoList/index${urlx.stringify({
				officialId
			}, true)}`
        })
	},
	handleOfficialFocus: function(e) {
		const { params } = e.currentTarget.dataset
		getEnhanceUserInfo((wxSessionCode) => {
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
				}
			})
		})
		e.stopPropagation()
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
	onReachBottom: function(e) {
		if(isRequest) return
		if(!lockRequest) {
			this.requestRule({
				page: this.data.page + 1,
				pageSize: this.data.pageSize
			})
		}
	},
	requestRule: function(options = {}) {
		const { page, pageSize, wxScrollType } = options
		if(!this.data.isFinish || wxScrollType === 'top') {
			isRequest = true
			let officialList = this.data.officialList

			request({
				key: 'officialGetList',
				data: {
					circleId: this.data.urlParams.circleId,
					page: page || 1,
					pageSize: pageSize || 10
				},
				success: (res) => {
					wx.hideToast()
					if(res.code === 200) {
						const _officialList = res.data.officialList
						if(wxScrollType === 'top') {
							officialList = _officialList
							wx.stopPullDownRefresh()
							wx.showToast({
								title: '刷新成功',
								icon: 'success',
								duration: 1200
							})
						} else {
							officialList = officialList.concat(_officialList)
						}
						setTimeout(() => {
							isRequest = false
							this.setData({
								page: page,
								pageSize: pageSize,
								officialList: officialList,
								isFinish: _officialList.length === 0
							})
							lockRequest = false
						})
					}
				}
			})
		}
	},
	onLoad: function (req) {
		this.setData({
			urlParams: req
		})
		this.requestRule({
			page: 1,
			pageSize: 10
		})
	}
})
