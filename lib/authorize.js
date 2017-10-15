exports.getEnhanceUserInfo = (cb) => {
    wx.login({
        success: (res) => {
            const resLogin = res
            const code = res.code
            wx.getUserInfo({
                withCredentials: true,
                success: (res) => {
                    const resGetUserInfo = res
                    const { userInfo, rawData, signature, encryptedData, iv } = res
                    cb(code)
                },
                fail: (error) => {
                    wx.showModal({
                        title: '重要提示',
                        content: '亲，通过授权后，将会获得全部功能，若想后续开通授权，请进入如下操作：在微信「发现」-「小程序」-「小程序」-删除「官方消息」，重新找到「官方消息」在进行授权，建议此时授权。',
                        cancelText: '不授权',
                        confirmText: '授权',
                        showCancel: true,
                        success: (res) => {
                            const { confirm, cancel } = res
                            if(confirm) {
                                wx.openSetting({
                                    success: (res) => {
                                        const authSetting = res.authSetting
                                        cb(code)
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    })
}