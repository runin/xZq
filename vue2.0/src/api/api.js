import { Promise } from 'es6-promise'
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

const api = {}
const domain_url = window.isDev ? 'http://anong.holdfun.cn/aportal/' : "http://album.holdfun.cn/aportal/";
export default api;

api.getLastZanList = function(auuid){
	return Vue.http.jsonp( domain_url + 'api/album/prise/last', {
		params: {
			matk : matk,
			auuid: auuid
		}
	}).then(api.codeVerify);
}

api.getAlbumVisits = function(auuid){
	return Vue.http.jsonp( domain_url + 'api/profile/visitor/album', {
		params: {
			matk : matk,
			auuid: auuid
		}
	}).then(api.codeVerify);
}


api.getAlbumLikes = function(auuid){
	return Vue.http.jsonp( domain_url + 'api/profile/prise/album', {
		params: {
			matk : matk,
			auuid: auuid
		}
	}).then(api.codeVerify);
}


api.getAllVisits = function(){
	return Vue.http.jsonp( domain_url + 'api/profile/prise/all', {
		params: {
			matk : matk
		}
	}).then(api.codeVerify);
}


api.getAllLikes = function(){
	return Vue.http.jsonp( domain_url + 'api/profile/prise/all', {
		params: {
			matk : matk
		}
	}).then(api.codeVerify);
}


api.share = function(auuid){
	return Vue.http.jsonp( domain_url + 'api/album/share', {
		params: {
			matk : matk,
			auuid: auuid
		}
	});
}

// 相册浏览
api.getAllPlayData = function(auuid){
	return Promise.all([api.getFriendAlbumDetailByUid(auuid), api.getPhotoList(auuid)]).then(function(results){
		return new Promise(function(resolve, reject){
			if(results.length >= 2){
				if(results[0].data && results[0].data.usid){
					api.getAlbumProfileByUid(results[0].data.usid).then(function(profileData){
						var result = {
							detail: results[0].data,
							photos: results[1].data,
							profiles: profileData
						}
						resolve(result);
					});
				}else{
					reject('get all play data error');
				}
			}else{
				reject('get all play data error');
			}
		})
	});
}

// 相册预览
api.getAllPreviewData = function(auuid){
	return Promise.all([api.getAlbumDetail(auuid), api.getPhotoList(auuid)]).then(function(results){
		return new Promise(function(resolve, reject){
			if(results.length >= 2){
				var result = {
					detail: results[0].data,
					photos: results[1].data,
				}
				resolve(result);
			}else{
				reject('get all preview data error');
			}
		})
	});
}

// 修改背景音乐
api.updateMusic = function(auuid, muuid){
	return Vue.http.jsonp( domain_url + 'api/album/edit/music', {
		params: {
			matk : matk,
			auuid: auuid,
			muuid: muuid
		}
	}).then(api.codeVerify);
}

// 修改主题
api.updateTmpl = function(auuid, uuid){
	return Vue.http.jsonp( domain_url + 'api/album/edit/theme', {
		params: {
			matk : matk,
			auuid: auuid,
			tuuid: uuid
		}
	}).then(api.codeVerify);
}

// 好友相册详情
api.getFriendAlbumDetailByUid = function(auuid){
	return Vue.http.jsonp( domain_url + 'api/album/detail/friend', {
		params: {
			matk : matk,
			auuid: auuid,
			uid: uid
		}
	}).then(api.codeVerify);
}

// 自己相册详情
api.getAlbumDetail = function(auuid){
	return Vue.http.jsonp( domain_url + 'api/album/detail/self', {
		params: {
			matk : matk,
			auuid: auuid
		}
	}).then(api.codeVerify);
}

// 空间访客列表
api.getVisitsList = function(){
	return Vue.http.jsonp( domain_url + 'api/profile/visitor/all', {
		params: {
			matk : matk
		}
	}).then(api.codeVerify);
}

api.getAllHomeDataByUid = function(uid){
	return Promise.all([api.getAlbumListByUid(uid), api.getAlbumProfileByUid(uid)]).then(function(results){
		return new Promise(function(resolve, reject){
			if(results.length >= 2){
				var result = {
					list: results[0].data.albums.albums,
					profiles: results[1].data,
				}
				resolve(result);
			}else{
				reject('get all home data by uid error');
			}
		})
	});
}

// 好友空间列表
api.getAlbumListByUid = function(uid){
	return Vue.http.jsonp( domain_url + 'api/album/friend', {
		params: {
			matk : matk,
			uid : uid
		}
	});
}

// 好友空间详情
api.getAlbumProfileByUid = function(uid){
	return Vue.http.jsonp( domain_url + 'api/profile/friend', {
		params: {
			matk : matk,
			uid : uid
		}
	}).then(api.codeVerify);
}

api.getAllHomeData = function(){
	return Promise.all([api.getAlbumList(), api.getAlbumProfile()]).then(function(results){
		return new Promise(function(resolve, reject){
			if(results.length >= 2){
				var result = {
					list: results[0].data,
					profiles: results[1].data,
				}
				resolve(result);
			}else{
				reject('get all home data error');
			}
		})
	});
}

// 自己空间列表
api.getAlbumList = function(){
	return Vue.http.jsonp( domain_url + 'api/album/self', {
		params: {
			matk : matk
		}
	});
}

// 自己空间详情
api.getAlbumProfile = function(){
	return Vue.http.jsonp( domain_url + 'api/profile/self', {
		params: {
			matk : matk
		}
	}).then(api.codeVerify);
}

// 创作相册
api.createAlbum = function(title, photos){
	return Vue.http.jsonp( domain_url + 'api/album/create', {
		params: {
			matk : matk,
			title: title,
			photos: JSON.stringify(photos)
		}
	});
}

// 创作相册
api.changeAlbum = function(auuid, photos){
	return Vue.http.jsonp( domain_url + 'api/album/edit/photos', {
		params: {
			matk : matk,
			auuid: auuid,
			photos: JSON.stringify(photos),
		}
	}).then(api.codeVerify);
}

// 保存相册
api.saveAlbum = function(auuid){
	return Vue.http.jsonp( domain_url + 'api/album/publish', {
		params: {
			matk : matk,
			auuid: auuid
		}
	}).then(api.codeVerify);
}

// 删除相册
api.delAlbum = function(auuid){
	return Vue.http.jsonp( domain_url + 'api/album/unpublish', {
		params: {
			matk : matk,
			auuid: auuid
		}
	}).then(api.codeVerify);
}

// 相册点赞
api.zanAlbum = function(auuid){
	return Vue.http.jsonp( domain_url + 'api/album/prise', {
		params: {
			matk : matk,
			auuid: auuid
		}
	}).then(api.codeVerify);
}

// 相册照片列表
api.getPhotoList = function(auuid){
	return Vue.http.jsonp( domain_url + 'api/photo/list', {
		params: {
			matk : matk,
			auuid: auuid
		}
	}).then(api.codeVerify);
}


api.getMusicAndTmpls = function(){
	return Promise.all([api.getMusicList(), api.getTmplList()]).then(function(results){
		return new Promise(function(resolve, reject){
			if(results.length >= 2){
				var result = {
					musics: results[0].data.result,
					tmpls: results[1].data.result,
				}
				resolve(result);
			}else{
				reject('get music and tmpls error');
			}
		})
	});
}

// 音乐列表
api.getMusicList = function(){
	return Vue.http.jsonp( domain_url + 'api/music/list', {
		params: {
			matk : matk
		}
	}).then(api.codeVerify);
}

// 模板列表
api.getTmplList = function(){
	return Vue.http.jsonp( domain_url + 'api/theme/list', {
		params: {
			matk : matk
		}
	}).then(api.codeVerify);
}

// JS Ticket
api.getTicket = function(){
	return Vue.http.jsonp( domain_url + 'api/mp/auth/jsapiticket', {
		params: {
			matk : matk,
		},
		callback: 'callbackMpJsapiTicketHandler'
	}).then(api.codeVerify).then(api.wxConfig);
}

// 验证code
api.codeVerify = function(result){
	return new Promise(function(resolve, reject){
		if(result.data && result.data.code == 0){
			resolve(result);
		}else{
			reject('request code is not 0');
		}
	})
}

api.wxConfig = function(data){
	return new Promise(function(resolve, reject){
		var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
		var timestamp = Math.round(new Date().getTime() / 1000);
		var url = location.href.split('#')[0];
		var shaObject = new jsSHA("SHA-1", "TEXT");
		shaObject.update('jsapi_ticket='+data.data.ticket+'&noncestr='+nonceStr+'&timestamp='+timestamp+'&url='+url);
		wx.config({
		    debug: false,
		    appId: window.mpappid,
		    timestamp: timestamp,
		    nonceStr: nonceStr,
		    signature: shaObject.getHash('HEX'),
		    jsApiList: [
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'chooseImage',
				'previewImage',
				'uploadImage',
				'downloadImage',
				'hideOptionMenu',
				'showOptionMenu',
				'hideMenuItems',
				'showMenuItems'
		    ]
		});
		wx.ready(function(){
			resolve();
		});
		wx.error(function(){
			reject('weChat config fail');
		});
	});
}