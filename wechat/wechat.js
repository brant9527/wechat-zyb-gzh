"use strict"

let Promise =require('bluebird')
let request =Promise.promisify(require('request'))
let prefix='https://api.weixin.qq.com/cgi-bin/'
let api ={
	accessToken:prefix+'token?grant_type=client_credential',
}


function Wechat(opts){
	let that =this;
	this.appID=opts.appID;
	this.appsecret=opts.appsecret;
	this.getAccessToken=opts.getAccessToken;
	this.saveAccessToken=opts.saveAccessToken;
	this.getAccessToken().then((data)=>{
		try{
			data=JSON.parse(data)
		}
		catch(e){
			return that.updataAccessToken()
		}
		if(that.isValidAccessToken(data)){
			Promise.resolve(data)
		}else{
			return that.updataAccessToken()
		}
	}).then((data)=>{
		that.access_token=data.access_token
		that.expires_in=data.expires_in
		that.saveAccessToken(data)
	})
}
Wechat.prototype.isValidAccessToken=function(data){
	if(!data&&!data.accessToken&&!data.expires){
		return false
	}
	let accessToken=data.accessToken
	let expires_in =data.expires_in
	let time =new Date().getTime()
	if(time<expires_in){
		return true;
	}else{
		return false;
	}
}

Wechat.prototype.updataAccessToken=function(data){
	console.log('更新')
	let appID=this.appID
	let appsecret=this.appsecret;
	let url =api.accessToken+'&appid='+appID+'&secret='+appsecret
	
	return new Promise (function(resolve,reject){
		request({url:url,json:true}).then(response=>{
		let data=response['body']
		let nowTime=new Date().getTime()
		let expires_in=nowTime+(data.expires_in-20)*1000
		data.expires_in=expires_in
		resolve(data)
	})
	})
}
module.exports=Wechat