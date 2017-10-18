//index.js
//获取应用实例
var app = getApp()
const officialContentList = require('../../data/officialContentList')
const { request } = require('../../lib/request')

let isRequest = false
let lockRequest = false
Page({
	data: {
		officialInfoList: [],
		page: 1,
		pageSize: 10,
		isFinish: false,
		windowWidth: 0
	},
    gotoOfficialInfoDetail: function(e) {
		const params = e.currentTarget.dataset.params
        wx.navigateTo({
            url: `../officialInfoDetail/index?officialInfoId=${params.officialInfoId}`
        })
	},
	onPullDownRefresh: function() {
		if(isRequest) return
		if(!lockRequest) {
			lockRequest = true
			this.requestOfficialInto({
				page: 1,
				pageSize: 10,
				wxScrollType: 'top'
			})
		}
	},
	requestOfficialInto: function(options) {
		const { page, pageSize, wxScrollType } = options
		if(!this.data.isFinish || wxScrollType === 'top') {
			isRequest = true
			let officialInfoList = this.data.officialInfoList
			request({
				key: 'infoGetOfficialInfoList',
				data: {
					page: page || 1,
					pageSize: pageSize || 10
				},
				success: (res) => {
					wx.hideToast()
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
				}
			})
		}
	},
	onReachBottom: function(e) {
		if(isRequest) return
		if(!lockRequest) {
			this.requestOfficialInto({
				page: this.data.page + 1,
				pageSize: this.data.pageSize
			})
		}
	},
	onLoad: function () {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		this.requestOfficialInto({
			page: this.data.page,
			pageSize: this.data.pageSize,
		})
	}
})
