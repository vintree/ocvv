//index.js
//获取应用实例
var app = getApp()
const { request, uploadFile } = require('../../lib/request')

Page({
	data: {
		officialInfo: {},
		urlParams: {},
		circleList: [],
		circleListActiveIndex: 0
	},
	uploadPic: function() {
		wx.chooseImage({
			count: 1,
			success: (res) => {
				const tempFilePaths = res.tempFilePaths
				uploadFile({
					key: 'officialUploadOfficialPic',
					filePath: tempFilePaths[0],
					isLogin: true,
					success: (res) => {
						console.log('res', res);
						if(res.code === 200) {
							const officialInfo = this.data.officialInfo
							officialInfo.officialPicUrl = res.data.officialPicUrl
							this.setData({
								officialInfo
							})
							console.log('officialInfo', officialInfo);
						}
					}
				})
			}
		})
	},
	handleInputOfficialName: function(e) {
		const officialInfo = this.data.officialInfo
		officialInfo.officialName = e.detail.value
		this.setData({
			officialInfo
		})
	},
	handleInputOfficialFullName: function(e) {
		const officialInfo = this.data.officialInfo
		officialInfo.officialFullName = e.detail.value
		this.setData({
			officialInfo
		})
	},
	handleInputOfficialEmail: function(e) {
		const officialInfo = this.data.officialInfo
		officialInfo.officialEmail = e.detail.value
		this.setData({
			officialInfo
		})
	},
	handleInputOfficialPhone: function(e) {
		const officialInfo = this.data.officialInfo
		officialInfo.officialPhone = e.detail.value
		this.setData({
			officialInfo
		})
	},
	handleInputOfficialDes: function(e) {
		const officialInfo = this.data.officialInfo
		officialInfo.officialDes = e.detail.value
		this.setData({
			officialInfo
		})
	},
	handleInputOfficialDoorplate: function(e) {
		const officialInfo = this.data.officialInfo
		officialInfo.officialDoorplate = e.detail.value
		this.setData({
			officialInfo
		})
	},
	handleMap: function() {
		wx.chooseLocation({
			success: (req) => {
				const officialInfo = this.data.officialInfo
				officialInfo.officialLat = req.latitude
				officialInfo.officialLog = req.longitude
				officialInfo.officialAddress = req.address
				this.setData({
					officialInfo: officialInfo
				})
			}
		})
	},
	bindPickerChange: function(e) {
		const officialInfo = this.data.officialInfo
		officialInfo.circleId = this.data.circleList[e.detail.value].circleId
		officialInfo.circleName = this.data.circleList[e.detail.value].circleName
		this.setData({
			officialInfo
		})
	},
	formSubmit: function(e) {
		wx.showLoading({
			title: '加载更多...',
			mask: true
		})
		request({
			key: 'officialCreate',
			data: this.data.officialInfo,
			isLogin: true,
			success: (res) => {
				if(res.code === 200) {
					wx.hideLoading()
					if(res.data.success) {
						wx.showToast({
							title: '更新成功',
							icon: 'success',
							duration: 1200,
							mask: true,
							success: () => {
								console.log('sssdd');
								wx.switchTab({
									url: '../my/index',
									success: (e) => {
										// tab切换刷新
										let page = getCurrentPages().pop();  
										if (page == undefined || page == null) return;  
										page.onLoad();  
									}
								})
							}
						})
					}
				} else {
					wx.hideLoading()
				}
			},
			fail: () => {
				wx.hideLoading()
			}
		})
	},
	onLoad: function (req) {
		this.setData({
			urlParams: req
		})
		
		request({
			key: 'circleGetListAndOfficialCount',
			success: (req) => {
				if(req.code === 200) {
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
	}
})
