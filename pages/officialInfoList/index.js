//index.js
//获取应用实例
var app = getApp()
var {
	api
} = require('../../config/api.default')
const { request } = require('../../lib/request')
const urlx = require('../../lib/urlx')


let isRequest = false
let lockRequest = false

Page({
	data: {
		official: {},
		officialInfoList: [],
		page: 1,
		pageSize: 10,
		isFinish: false,
		windowWidth: 0
	},
	gotoOfficialDetail: function(e) {
        wx.navigateTo({
            url: `../officialDetail/index?officialId=${this.data.urlParams.officialId}`
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
	handleOfficialFocus: function(e) {
		const { params } = e.currentTarget.dataset		
		request({
			key: 'dynamicFocus',
			data: {
				officialId: params.officialId
			},
			isLogin: true,
			success: (res) => {
				if(res.code === 200) {
					this.requestOfficialGetOfficialDetail()
				}
			}
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
	requestRule: function(options = {}) {
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
				success: (res) => {
					wx.hideToast()
					if(res.code === 200) {
						const _officialInfoList = res.data.officialInfoList
						const official = res.data.official
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
								official: official,
								officialInfoList: officialInfoList,
								isFinish: _officialInfoList.length === 0
		
							})
							lockRequest = false
						})
					}
				}
			})
		}
		wx.hideLoading()
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
	requestOfficialGetOfficialDetail: function() {
		request({
			key: 'officialGetOfficialDetail',
			data: {
				officialId: this.data.urlParams.officialId,
			},
			success: (res) => {
				wx.hideToast()
				if(res.code === 200) {
					const officialInfo = res.data.officialInfo
					this.setData({
						official: officialInfo
					})
				}
			}
		})
	},
	onLoad: function (res) {
		this.setData({
			urlParams: res
		})
		this.requestRule({
			page: 1, 
			pageSize: 10,
		})
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		this.requestOfficialGetOfficialDetail()
	}
})
