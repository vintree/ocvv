//index.js
//获取应用实例
var app = getApp()
var {
	api
} = require('../../config/api.default')
const officialContentList = require('../../data/officialContentList')
// const { getEnhanceUserInfo } = require('../../lib/authorize')
const { request } = require('../../lib/request')

Page({
	data: {
		officialContentList: []
	},
    gotoOfficialInfoDetail: function(e) {
		const params = e.currentTarget.dataset.params
		console.log('params', params);
        wx.navigateTo({
            url: `../officialInfoDetail/index?officialInfoId=${params.officialInfoId}`
        })
	},
	onLoad: function () {
		request({
			key: 'getTimeList',
			data: {
				page: 1,
				pageSize: 10
			},
			success: (res) => {
				if(res.code === 200) {
					this.setData({
						officialInfoList: res.data.officialInfoList
					})
				}
			}
		})
	}
})
