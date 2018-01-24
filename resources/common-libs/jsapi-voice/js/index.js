$(function() {
	$.ajax({
		type: 'GET',
		url: domain_url + 'mp/jsapiticket',
		data: {
			appId: shaketv_appid,
			appSecret: shaketv_appsecret
		},
		async: true,
		dataType: 'jsonp',
		jsonpCallback: 'callbackJsapiTicketHandler',
		success: function(data){
			if (data.code !== 0) {
				return;
			}
			
			var nonceStr = 'F7SxQmyXaFeHsFOT',
				timestamp = new Date().getTime(),
				url = window.location.href.split('#')[0],
				signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);

			wx.config({
				debug: false,
				appId: shaketv_appid,	
				timestamp: timestamp,
				nonceStr: nonceStr,
				signature: signature,
				jsApiList: [
					'startRecord',
					'stopRecord',
					'onRecordEnd',
					'playVoice',
					'pauseVoice',
					'stopVoice',
					'uploadVoice',
					'downloadVoice'
				]
			});
			
			callback && callback();
		},
		error: function(xhr, type){
			alert('获取微信授权失败！');
		}
	});
	
	wx.onVoiceRecordEnd({
	    complete: function (res) {
	        voice.localId = res.localId; 
	    }
	});
	
	wx.onVoicePlayEnd({
		complete: function (res) {
			alert('录音（' + res.localId + '）播放结束');
		}
	});
	
});

wx.ready(function () {

	// 3 智能接口
	var voice = {
		localId: '',
		serverId: ''
	};

	// 4 音频接口
	// 4.2 开始录音
	document.querySelector('#startRecord').onclick = function () {
		wx.startRecord({
			cancel: function () {
				alert('用户拒绝授权录音');
			}
		});
	};

	// 4.3 停止录音
	document.querySelector('#stopRecord').onclick = function () {
		wx.stopRecord({
			success: function (res) {
				voice.localId = res.localId;
			},
			fail: function (res) {
				alert(JSON.stringify(res));
			}
		});
	};

	// 4.4 监听录音自动停止
	wx.onVoiceRecordEnd({
		complete: function (res) {
			voice.localId = res.localId;
			alert('录音时间已超过一分钟');
		}
	});

	// 4.5 播放音频
	document.querySelector('#playVoice').onclick = function () {
		if (voice.localId == '') {
			alert('请先使用 startRecord 接口录制一段声音');
			return;
		}
		wx.playVoice({
			localId: voice.localId
		});
	};

	// 4.6 暂停播放音频
	document.querySelector('#pauseVoice').onclick = function () {
		wx.pauseVoice({
			localId: voice.localId
		});
	};

	// 4.7 停止播放音频
	document.querySelector('#stopVoice').onclick = function () {
		wx.stopVoice({
			localId: voice.localId
		});
	};

	// 4.8 监听录音播放停止
	wx.onVoicePlayEnd({
		complete: function (res) {
			alert('录音（' + res.localId + '）播放结束');
		}
	});

	// 4.8 上传语音
	document.querySelector('#uploadVoice').onclick = function () {
		if (voice.localId == '') {
			alert('请先使用 startRecord 接口录制一段声音');
			return;
		}
		wx.uploadVoice({
			localId: voice.localId,
			success: function (res) {
				alert('上传语音成功，serverId 为' + res.serverId);
				voice.serverId = res.serverId;
			}
		});
	};

	// 4.9 下载语音
	document.querySelector('#downloadVoice').onclick = function () {
		if (voice.serverId == '') {
			alert('请先使用 uploadVoice 上传声音');
			return;
		}
		wx.downloadVoice({
			serverId: voice.serverId,
			success: function (res) {
				alert('下载语音成功，localId 为' + res.localId);
				voice.localId = res.localId;
			}
		});
	};

});

wx.error(function (res) {
	alert(res.errMsg);
});
