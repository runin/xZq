(function ($) {

    H.voice = { 
    	isReady: false,
    	$btnVoice: $('#btn_voice'),
    	$btnRecord: $('#btn_record_voice'),
    	$commentInput: $('#comment_input_wrapper'),
    	$tips: $('#voice_record_tips'),

    	lastServerId: 0,
    	lastDuration: 0,
    	recordBegin: 0,
    	currentLocalId: 0,

        init: function () {
        	getResult("mp/jsapiticket", {
				appId: W.mpappid
			}, 'callbackJsapiTicketHandler');
        },

        initVoiceEvents: function(){
        	H.voice.bindBtns();
        },

        uploadVoice: function(localId){
        	wx.uploadVoice({
			    localId: localId,
			    isShowProgressTips: 1,
			        success: function (res){
			        var serverId = res.serverId;
			        H.voice.saveVoice(res.serverId);
			    }
			});
        },

        saveVoice: function(serverId){
        	showLoading(null, '语音发送中');
        	H.comment.lastType = 'comment';
        	H.voice.lastServerId = serverId;
        	var option = {
				co: JSON.stringify({
					'type': 'voice',
					'serverId' : serverId,
					'duration' : H.voice.lastDuration
				}),
                oi: openid,
                nn: nickname ? encodeURIComponent(nickname) : "",
                hu: headimgurl ? headimgurl : ""
			}
			getResult('api/comments/save', option, 'callbackCommentsApiSave');
        },

        playVoice: function(serverId){
        	if(H.voice.isReady){
        		H.voice.stopVoice(H.voice.currentLocalId);

	        	wx.downloadVoice({
				    serverId: serverId,
				    isShowProgressTips: 1,
				    success: function (res) {
				        H.voice.currentLocalId = res.localId;
				        wx.playVoice({
						    localId: res.localId
						});
				    }
				});
	        }
        },

        stopVoice: function(localId){
        	if(H.voice.isReady){
        		wx.stopVoice({
				    localId: localId
				});
        	}
        },

        submitVoiceSuccess: function(data){
			showTips('语音发送成功');
			
			var duration = Math.floor(H.voice.lastDuration / 1000);
			var size = duration / 30 * 100;
			if(size < 20){
				size = 20;
			}else if(size >= 90){
				size = 90;
			}
			var t = simpleTpl();
			t._(H.comment.$tmplVoice.tmpl({
				'name': nickname ? nickname : '匿名用户',
				'src': headimgurl ? headimgurl : './images/avatar.jpg',
				'praised': 0,
				'uid': data.uid,
				'pc': 0,
				'pcshow': (H.comment.curTab == 1) ? 'none' : '',
				'duration': (duration == 0 ? 1 : duration) + '\"',
				'vid': H.voice.lastServerId,
				'size': 'width: ' + size + '%',
				'length': H.voice.lastDuration,
				'vip': 'none'
			}));

			if(H.comment.curTab == 0){
				H.comment.$list.append(t.toString());
				H.comment.$commentScrolling[0].scrollTop = 99999;	
			}else{
				H.comment.$list.prepend(t.toString());
				H.comment.$commentScrolling[0].scrollTop = 0;	
			}
			
			H.comment.bindPraise();
			H.comment.emptyComments();
			H.comment.bindVoice();
			H.comment.isNewHeight = true;
		},

        bindBtns: function(){
        	this.$btnVoice.tap(function(){
        		if(!$(this).hasClass('active')){
        			$(this).addClass('active');
        			$(this).find('img').attr('src' , './images/icon-keyboard-white.png');
        			H.voice.$btnRecord.removeClass('none');
        			H.voice.$commentInput.addClass('none');
        		}else{
        			$(this).removeClass('active');
        			$(this).find('img').attr('src' , './images/icon-record-white.png');
        			H.voice.$btnRecord.addClass('none');
        			H.voice.$commentInput.removeClass('none');
        		}
        	});

        	this.$btnRecord.bind('touchstart', function(){
        		H.voice.recordBegin = new Date().getTime();
        		$(this).addClass('recording');
        		H.voice.$tips.removeClass('none');
        		wx.startRecord();
        		return false;
        	});

        	this.$btnRecord.bind('touchend', function(){
        		$(this).removeClass('recording');
        		H.voice.$tips.addClass('none');
        		wx.stopRecord({
				    success: function (res) {
				    	H.voice.lastDuration = new Date().getTime() - H.voice.recordBegin;
				        H.voice.uploadVoice(res.localId);
				    }
				});
        		return false;
        	});
        }
    };

    W.callbackJsapiTicketHandler = function(data){
		var url = window.location.href;
		var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
		var timestamp = Math.round(new Date().getTime()/1000);
		var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);

		wx.config({
		    appId: W.mpappid,
		    timestamp: timestamp,
		    nonceStr:nonceStr,
		    signature:signature,
		    jsApiList: [
		    	'checkJsApi',
				'addCard',
				'startRecord',
				'stopRecord',
				'stopVoice',
				'onVoiceRecordEnd',
				'playVoice',
				'stopVoice',
				'onVoicePlayEnd',
				'uploadVoice',
				'downloadVoice'
		    ]
		});

		wx.ready(function () {
			wx.checkJsApi({
			    jsApiList: [
					'addCard',
					'startRecord',
					'stopRecord',
					'stopVoice',
					'onVoiceRecordEnd',
					'playVoice',
					'stopVoice',
					'onVoicePlayEnd',
					'uploadVoice',
					'downloadVoice'
			    ],
			    success: function (res) {
					H.voice.isReady = true;
					H.voice.initVoiceEvents();
					H.award.isKaquanReady = true;
			    }
			});
	    });

	    wx.error(function(res){
			H.voice.isReady = false;
	    });
	};

    H.voice.init();
    // H.voice.initVoiceEvents();

})(Zepto);