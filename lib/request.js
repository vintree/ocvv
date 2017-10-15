
const { api } = require('../config/api.default')
const { getEnhanceUserInfo } = require('./authorize')

function _setSession(options) {
    getEnhanceUserInfo((wxSessionCode) => {
        wx.request({
            url: api({
                key: 'getWxSession'
            }),
            data: {
                wxSessionCode
            },
            success: (req) => {
                if(req.data.code === 200) {
                    wx.setStorageSync('session', req.data.data.wxSession)
                    _requre(options)
                }
            },
            fail: (req) => {
                console.log('设置session失败')
            }
        })
    })
}

function _requre(options) {
    /**
     * isLogin: 是否需要登录
     * isCheckSession: 是否需要校验session
     */
    let { key, data, isLogin, success, fail } = options
    data = data || {}
    success = success || function() {}
    fail = fail || function() {}
    if(key) {
        // 需要登录态
        const session = wx.getStorageSync('session')
        data.wxSession = session
        if(isLogin) {
            if(session) {
                wx.checkSession({
                    success: () => {
                        wx.request({
                            url: api({
                                key
                            }),
                            data: data,
                            success: (req) => {
                                success(req.data)
                            },
                            fail: (req) => {
                                fail(req)
                            }
                        })
                    },
                    fail: () => {
                        _setSession(options)
                    }
                })
            } else {
                _setSession(options)
            }
        } else {
            wx.request({
                url: api({
                    key
                }),
                data: data,
                success: (req) => {
                    success(req.data)
                },
                fail: (req) => {
                    fail(req)
                }
            })
        }
    } else {
        console.error('请求方法中，key为undefined')
    }
}


exports.request = (options) => {
    _requre(options)
}