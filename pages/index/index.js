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
	gotoCircleList: function(e) {
		console.log('dddss');
		wx.switchTab({
            url: `../circleList/index`
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
					page: page || 1,
					pageSize: pageSize || 10
				},
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
				}
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
	onLoad: function () {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		this.requestRule({
			page: this.data.page,
			pageSize: this.data.pageSize,
		})

		// wx.request({
		// 	// 获取token
		// 	url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
		// 	data: {
		// 	  appid: 'wx826671981dcd4102',
		// 	  secret: 'b71b176fe5bad33328bef2e9edcc4f76'
		// 	},
		// 	success: (res) => {
		// 	  wx.request({
		// 		// 调用接口C
		// 		url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + res.data.access_token,
		// 		method: 'POST',
		// 		data: {
		// 		  "path": "pages/meiTuan/meiTuan",
		// 		  "width": 430
		// 		},
		// 		success: (res) => {
		// 			console.log('sss', res);
		// 			this.setData({
		// 				qrcode: res.data
		// 			})
		// 		  // res是二进制流，后台获取后，直接保存为图片，然后将图片返回给前台
		// 		  // 后台二进制怎么转图片？我也不会后台，学会了再贴代码
		// 		}
		// 	  })
		// 	}
		//   })

	}
})
