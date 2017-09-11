"use strict"
let sha1 = require('sha1')
let getRawBody = require('raw-body')
let Wechat = require('./wechat')


module.exports = function(opts) {
	let wechat = new Wechat(opts)
	return function*(next) {
		let token = opts.token;
		let appid = opts.token;
		let signature = this.query.signature;
		let nonce = this.query.nonce;
		let timestamp = this.query.timeStamp;
		var echostor = this.query.echostr;
		let str = [token, timestamp, nonce].sort().join('')
		let shaResult = sha1(str)
		console.log('发送数据：'+this.method)
		if(this.method === 'GET') {
			if(shaResult == signature) {
				this.body = echostor + ''
			} else {
				this.body = 'wrong'
			}
		} 
		else if(this.method === 'POST') {
			console.log('关注成功')
			if(shaResult !== signature) {
				this.body = 'wrong'
				return false;
			}
			let data = yield getRawBody(this.req, {
				length: this.length,
				limit:'1mb',
				encoding:this.charset,
			})
			console.log(data.toString())
		}

	}
}
