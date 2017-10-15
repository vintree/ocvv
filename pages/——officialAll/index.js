//index.js
//获取应用实例
var app = getApp()
var {
	api
} = require('../../config/api.default')
// import tempObj from '../../tpl/icoItem/index'

let isRequestGetIcoList = false
let lockRequestIcoList = false
Page({
	data: {
		page: 1,
		pageSize: 10,
		icoList: [],
		isFinish: false,
		isRequestGetIcoList: false,
		windowWidth: 0
	},
	onPullDownRefresh: function() {
		if(isRequestGetIcoList) return
		if(!lockRequestIcoList) {
			lockRequestIcoList = true
			this.requestGetIcoList({
				page: 1,
				pageSize: 10,
				wxScrollType: 'top'
			})
		}
	},
	requestGetIcoList: function(options) {
		const { page, pageSize, wxScrollType } = options
		if(!this.data.isFinish || wxScrollType === 'top') {
			isRequestGetIcoList = true
			this.setData({
				isRequestGetIcoList: true
			})
			let icoList = this.data.icoList
			wx.request({
				url: api.getIcoList,
				data: {
					icoState: 'ING',
					page: page || 1,
					pageSize: pageSize || 10
				},
				success: (data) => {
					const _icoList = data.data.data.icoList
					if(wxScrollType === 'top') {
						icoList = _icoList
						wx.stopPullDownRefresh()
						wx.showToast({
							title: '刷新成功',
							icon: 'success',
							duration: 1200
						})
					} else {
						icoList = icoList.concat(_icoList)
					}
					setTimeout(() => {
						isRequestGetIcoList = false
						this.setData({
							isRequestGetIcoList: false
						})
						this.setData({
							page: page,
							pageSize: pageSize,
							icoList: icoList,
							isFinish: _icoList.length === 0
						})
						lockRequestIcoList = false
					})
				}
			})
		}
	},
	onReachBottom: function(e) {
		if(isRequestGetIcoList) return
		if(!lockRequestIcoList) {
			this.requestGetIcoList({
				page: this.data.page + 1,
				pageSize: this.data.pageSize
			})
		}
    },
    gotoFindAll: function(e) {
        console.log('dddd', e);
        wx.navigateTo({
            url: `../findAll/index`
        })
    },
	gotoDetail: function(e) {
		const icoId = e.currentTarget.dataset.icoid
		const icoDetailLink = e.currentTarget.dataset.icodetaillink
		const icoPlatformLink = e.currentTarget.dataset.icoplatformlink
		if(icoDetailLink) {
			wx.navigateTo({
				url: `../icoDetail/index?icoId=${icoId}`
			})
		} else {
			wx.setClipboardData({
				data: icoPlatformLink,
				success: function(res) {
					wx.getClipboardData({
						success: function(res) {
							console.log(res.data) // data
						}
					})
					wx.showModal({
						title: '提示',
						content: '由于小程序限制，部分项目页面无法直接打开，已复制平台官网地址，请使用手机浏览器访问！',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定')
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})
				}
			})
		}
	},
	onLoad: function () {
		var that = this
		wx.getSystemInfo({
			success: (res) => {
				console.log('getSystemInfo', res);
				this.requestGetIcoList({
					page: this.data.page,
					pageSize: this.data.pageSize,
				})
				this.setData({
					scrollHeight: res.windowHeight,
					windowWidth: res.windowWidth
				})
			}
		});
	}
})
