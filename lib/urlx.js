/*
 * @Author: puxiao.wh 
 * @Date: 2017-02-27 16:21:45 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-10 02:58:28
 */

/**
 * url params => json
 * @param  {String} params=''
 * @param  {Function} callback=()=>{}
 */
function parse(params = '', callback = undefined) {
	let json = {}
	if(params.indexOf('?') !== -1) {
		params = params.substr(1).split('&');
	}
	for(let i = 0, l = params.length; i < l; i++) {
		let param = params[i]
		param = param.split('=')
		json[param[0]] = callback ? callback(param[1]) : param[1]
	}
	return json
}

/**
 * json => url params
 * @param  {Object} data
 * @param  {Boolean} isSearch=true, Whether to add '?'
 */
function stringify(data = {}, isSearch = true) {
    let params = []
    let res =''
    for(let key in data) {
        if(data.hasOwnProperty(key)) {
            params.push(`${key}=${data[key]}`)
        }
    }
    if(params.length > 0) {
        res = isSearch ? '?' : ''
    }
    return res + params.join('&')
}

/**
 * old params => new params
 * @param  {String} url=location.href
 * @param  {Object} obj
 */
function replace(url = '', obj = {}) {
	for(let o in obj) {
		if(obj.hasOwnProperty(o)) {
			const ixOf = url.indexOf(o)
			//  是否存在特定参数
			if(ixOf > -1) {
				const 
					keyIx = ixOf + o.length + 1,
					afterAllStr = url.substr(keyIx),
					beforeStr = url.substr(0, keyIx),
					ixOf2 = afterAllStr.indexOf('&');
				if(ixOf2 > -1) {
					let afterStr = afterAllStr.substr( ixOf2 )
					//  该参数原val
					// let content = afterAllStr.substr( 0, ixOf2 );
					return beforeStr + obj[o] + afterStr
				} else {
					return beforeStr + obj[o] 
				}
			} else {
				// 不存在该参数，向后追加
				if(url.indexOf('?') === -1) {
					return url + '?' + o + '=' + obj[o]
				} else {
					return url + '&' + o + '=' + obj[o]
				}
			}
		}
	}
}

const urlx = {
    parse,
    stringify,
	replace
}

module.exports = urlx