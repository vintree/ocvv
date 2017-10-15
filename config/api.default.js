// exports.host = 'http://127.0.0.1:7001'

const apiMap = {
    userValid: '/rest/official/user/valid',
    infoCreate: '/rest/official/info/create',
    infoGet: '/rest/official/info/get',
    infoDelete: '/rest/official/info/delete',
    infoGetOfficialAndOfficialInfoList: '/rest/official/info/getOfficialAndOfficialInfoList',
    infoSetOfficialInfo: '/rest/official/info/setOfficialInfo',
    getTimeList: '/rest/official/info/getTimeList',
    dynamicInfoSupport: '/rest/official/dynamic/infoSupport',
    dynamicInfoShare: '/rest/official/dynamic/infoShare',
    dynamicFocus: '/rest/official/dynamic/focus',
    circleGetListAndOfficialCount: '/rest/official/circle/getListAndOfficialCount',
    officialGetList: '/rest/official/getList',
    officialGetOfficialInfo: '/rest/official/getOfficialInfo',
    getWxSession: '/rest/official/user/getWxSession'
    // createOrUpdateUser: '/rest/official/createOrUpdateUser',
    // getCircleListAndOfficialCount: '/rest/official/getCircleListAndOfficialCount',
    // getOfficialList: '/rest/official/getOfficialList',
}

exports.api = (options) => {
    const { key } = options
    // let host = 'https://api.ieee.top'
    let host = 'http://127.0.0.1:7001'
    return host + apiMap[key]
}
