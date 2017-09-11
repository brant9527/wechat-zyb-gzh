"use strict"
let koa = require("koa")
let sha1 = require('sha1')
let path = require('path')
let util = require('./libs/util')
let wechat = require('./wechat/g')

let wechat_file = path.join(__dirname, './config/wechat.txt')
var config = {
	wechat: {
		appID: 'wxdd866eeb0191b1ef',
		appsecret: 'cf9dd933e88183f6212cbd052d518850',
		token: 'zybtoken',
		getAccessToken: function() {
			return util.readFileAsync(wechat_file)
		},
		saveAccessToken: function(data) {
			data = JSON.stringify(data)
			return util.writeFileAsync(wechat_file, data)
		}
	}
}

let app = new koa()
app.use(wechat(config.wechat))
app.listen(80, function() {
	console.log("监听80端口")
})