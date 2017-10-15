//index.js
//获取应用实例
var app = getApp()
var {
	api
} = require('../../config/api.default')
const official = require('../../data/official')
const content = require('../../data/officialContent')

let isRequestGetIcoList = false
let lockRequestIcoList = false
Page({
	data: {
		officialMsg: {},
		isContentGood: false
	},
	onShareAppMessage: function(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: '自定义转发标题',
			path: '/pages/officialInfoDetail?id=123',
			success: function(res) {
				console.log('success');
				// 转发成功
			},
			fail: function(res) {
				// 转发失败
				console.log('fail');
			}
		}
	},
	handleGood: function() {
		console.log('ssss');
		this.setData({
			isContentGood: !this.data.isContentGood
		})
	},
	gotoOfficialInfoList: function(e) {
        wx.navigateTo({
            url: `../officialInfoList/index`
        })
    },
	onLoad: function () {
		const officialMsg = {
			official: official[0],
			content: content[0]
		}
		this.setData({
			officialMsg
		})
	}
})
