
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
            success: (res) => {
                if(res.data.code === 200) {
                    console.log('requestsss2233', res);
                    wx.setStorageSync('session', res.data.data.wxSession)
                    _requre(options)
                } else {
                    wx.showToast({
                        title: `请求失败: ${res.data.code}`,
                        icon: 'warn',
                        mask: true,

                    })
                }
            },
            fail: (res) => {
                console.log('设置session失败')
            }
        })
    })
}

function _requre(options) {
    /**
     * isLogin: 是否需要登录
     */
    let { key, data, isLogin, success, fail } = options
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
                            success: (res) => {
                                console.log('res', res);
                                if(res.statusCode === 200) {
                                    success(res.data)
                                } else {
                                    fial(res)
                                }
                            },
                            fail: (res) => {
                                fail(res)
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
                success: (res) => {
                    success(res.data)
                },
                fail: (res) => {
                    fail(res)
                }
            })
        }
    } else {
        console.error('请求方法中，key为undefined')
    }
}

function _uploadFile(options) {
    /**
     * isLogin: 是否需要登录
     */
    let { key, data, filePath, isLogin, success, fail } = options
    if(key) {
        // 需要登录态
        const session = wx.getStorageSync('session')
        data.wxSession = session
        if(isLogin) {
            if(session) {
                wx.checkSession({
                    success: () => {
                        wx.uploadFile({
                            url: api({
                                key
                            }),
                            header: {
                                'content-type':'multipart/form-data'
                            },
                            filePath: filePath,
                            name: 'file',
                            formData: data,
                            success: (res) => {
                                success(res.data)
                            },
                            fail: (res) => {
                                fail(res)
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
            wx.uploadFile({
                url: api({
                    key
                }),
                header: {
                    'content-type':'multipart/form-data'
                },
                filePath: tempFilePaths,
                name: 'file',
                formData: data,
                success: (res) => {
                    
                    success(res.data)
                },
                fail: (res) => {
                    fail(res)
                }
            })
        }
    } else {
        console.error('请求方法中，key为undefined')
    }
}

exports.request = (options) => {
    options.data = options.data || {}
    options.success = options.success || function() {}
    options.fail = options.fail || function() {}
    _requre(options)
}

exports.uploadFile = (options) => {
    options.data = options.data || {}
    options.success = options.success || function() {}
    options.fail = options.fail || function() {}
    _uploadFile(options)
}
