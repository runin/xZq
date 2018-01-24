(function() {
	
	H.card = {
		$star: $('#star'),
		starId: getQueryString('id'),
		SPEAKING_CLS: 'h-speaking',
		LOADING_CLS: 'loading',
		NORECORD_CLS: 'norecord',
		STOPPING_CLS: 'stopping',
		RECORDING_CLS: 'recording',
		READY_CLS: 'ready',
		starName: '',
		init: function() {
			if (!this.starId) {
				window.location.href = 'star.html';
				return false;
			}
			if (!openid || !nickname) {
				return;
			}
			
			this.event();
			H.voice.init();
			
			var me = this;
			if (me.isView()) {
				$('body').addClass('view-card');
				
				getResult({
					url: 'ceremony/cardinfo',
					data: {
						cu: me.starId
					},
					loading: true,
					jsonpCallback: 'callbackCardInfoHandler',
					success: function(data) {
						if (data.result) {
							me.fillData(data.sn, {
								name: data.nn,
								avatar: data.hi + '/' + yao_avatar_size,
								wish: data.gt,
								voice: data.vi
							});
							return;
						}
						alert('贺卡信息加载失败');
					},
					error: function() {
						H.dialog.tips.open();
					}
				});
				if (window['localStorage'] && !localStorage.bjcwGuided) {
					H.dialog.guide.open();
				}
				
			} else {
				this.initWishes();
				
				me.fillData((parseInt(me.starId) || 1), {
					name: $.fn.cookie(shaketv_appid + '_nickname'),
					avatar: $.fn.cookie(shaketv_appid + '_headimgurl') + '/' + yao_avatar_size
				});
			}
			
			wx.ready(function() {
				$('html').addClass(me.READY_CLS);
			});
		},
		
		isView: function() {
			return this.starId.length > 2;
		},
		
		initWishes: function() {
			var wishList = wishes || [],
				len = wishList.length;
			
			$('#input-bless').attr('placeholder', wishList[Math.floor(Math.random() * 1000) % len]);
		},
		
		fillData: function(starId, info) {
			var $star = this.$star,
				$me = $('#me'),
				star = W['stars'][parseInt(starId) - 1];
			
			if (!star) {
				return;
			}
			$('#content').removeClass('hidden');
			$star.find('img').attr('src', star.avatar || '');
			$star.find('.voice').append('<audio preload="auto" class="audio none" src="'+ star.wish +'"></audio>');
			$star.find('.name').text(star.name || '');
			this.starName = star.name || '';
			
			$me.find('.name').text(info.name);
			$me.find('img').attr('src', info.avatar);
			if (info.voice) {
				var $mevoice = $me.find('.voice').addClass(H.card.LOADING_CLS).removeClass('none');
				
				wx.ready(function () {
					wx.downloadVoice({
					    serverId: info.voice,
					    success: function (res) {
					        H.voice.localId = res.localId;
					        $mevoice.removeClass(H.card.LOADING_CLS);
					    }
					});
				});
			} else {
				$me.addClass('text').find('.wish-txt').removeClass('none').text(info.wish);
			}
			
			this.audioReady();
		},
		
		audioReady: function() {
			var me = this;
			$('audio').on('loadedmetadata', function() {
				$(this).siblings('span').text(Math.ceil($(this).get(0).duration) + "'");
				$(this).get(0).pause();
				//$(this).closest('.voice').trigger('click');
			});
		},
		
		event: function() {
			var me = this,
				$me = $('#me'),
				$share = $('#share'),
				$wrapper = $('#wrapper'),
				$btnvoice = $('#btn-voice'),
				$btnpress = $('#btn-press'),
				$errtip = $('#err-tip'),
				CANCEL_TIP = '点击结束录音',
				RECORD_TIP = '点击开始录音',
				ERROR_TIP = '录音时间太短',
				STOPPING_TIP = '正在停止录音';
			
			$('#btn-type').click(function(e) {
				e.preventDefault();
				var $btn = $(this), $html = $('html');
				
				if (!$html.hasClass(me.READY_CLS)) {
					alert('努力加载中，请稍候');
					return;
				}
				
				if ($html.hasClass(H.card.NORECORD_CLS)) {
					return;
				}
				
				$('#star-voice').find('audio').get(0).pause();
				$btnpress.text(RECORD_TIP);
				$html.addClass(H.card.SPEAKING_CLS);
			});
			
			$btnpress.click(function(e) {
				e.preventDefault();
				
				var $html = $('html');
				if ($html.hasClass(H.card.RECORDING_CLS)) {	// 正在录音
					
					$btnpress.text(STOPPING_TIP).addClass(H.card.STOPPING_CLS);
					wx.stopRecord({
						success: function (res) {
							H.voice.localId = res.localId;
							
							$btnpress.removeClass(H.card.STOPPING_CLS).text(RECORD_TIP);
							$html.removeClass(H.card.SPEAKING_CLS).removeClass(H.card.RECORDING_CLS);
							$me.addClass('voice ' + H.card.LOADING_CLS);
							
							wx.uploadVoice({
								localId: H.voice.localId,
								success: function (res) {
									H.voice.serverId = res.serverId;
									$me.removeClass(H.card.LOADING_CLS);
									$('#me-voice').trigger('click');
								}
							});
						},
						fail: function() {
							$btnpress.removeClass(H.card.STOPPING_CLS);
							$html.removeClass(H.card.SPEAKING_CLS).removeClass(H.card.RECORDING_CLS);
						}
					});
					
				} else {
					$html.addClass(H.card.RECORDING_CLS);
					$(this).text(CANCEL_TIP);
					wx.startRecord({
						cancel: function () {
							$html.addClass(H.card.NORECORD_CLS).removeClass(H.card.SPEAKING_CLS);
							$btnpress.text(RECORD_TIP);
						}
					});
				}
			});
			
			$('#star-voice').addClass('no-border').click(function() {
				var $tg = $(this),
					$audio = $(this).find('audio');
				
				if ($tg.hasClass('scale')) {
					return;
				}
				$tg.addClass('scale');
				$audio.get(0).play();
				$audio.on('playing', function() {
					console.log('playing')
				}).on('ended', function() {
					console.log('ended');
					$audio.get(0).pause();
					$tg.removeClass('scale');
				});
			});
			
			$('#me-voice').addClass('no-border').click(function(e) {
				e.preventDefault();
				
				if (!H.voice.localId || $(this).hasClass('loading')) {
					alert('正在加载祝福语音，请稍候');
					return;
				}
				var $tg = $(this);
				$tg.addClass('scale');
				wx.playVoice({
					localId: H.voice.localId
				});
			});
			
			$('#btn-sendcard').click(function(e) {
				e.preventDefault();
				
				var $input = $('#input-bless'),
					voiceId = H.voice.serverId,
					words = $.trim($input.val()) || $input.attr('placeholder'),
					wordsLen = words.length,
					isText = $me.hasClass('voice') ? false : true;
				
				if ((isText && wordsLen == 0) || (!isText && !voiceId)) {
					alert('先说点什么吧');
					return;
				} else if (isText && wordsLen > 300) {
					alert('祝福的话儿贵精不贵多哦');
					return;
				}
				getResult({
					url: 'ceremony/makecard',
					data: {
						oi: openid,
						sn: me.starId,
						gt: isText ? encodeURIComponent(words) : '',
						vi: isText ? '' : voiceId,
						nn: encodeURIComponent($.fn.cookie(shaketv_appid + '_nickname') || ''),
						hi: $.fn.cookie(shaketv_appid + '_headimgurl') || ''
					},
					loading: true,
					bindUI: $(this),
					jsonpCallback: 'callbackMakeCardHandler',
					success: function(data) {
						if (data.result) {
							W['cardid'] = data.cu;
							if (W['localStorage']) {
								W['localStorage'].starName = me.starName;
								W['localStorage'].cardid = data.cu;
							}
							
							$(window).scrollTop(0);
							share();
							return;
						}
						alert('发送贺卡失败，请重试');
					},
					error: function() {
						H.dialog.tips.open();
					}
				});
					
			});
			
			$share.click(function() {
				$(this).addClass('none');
			});
			
			$('#speak-dialog').addClass('no-border').click(function(e) {
				e.preventDefault();
				
				var $html = $('html');
				if ($html.hasClass(H.card.RECORDING_CLS) || $(e.target).closest('.dialog').length > 0) {
					return;
				}
				$('html').removeClass(H.card.SPEAKING_CLS);
			});
		}
			
	};
	
	H.voice = {
		localId: '',
		serverId: '',
		init: function(callback) {
			$.ajax({
				type: 'GET',
				url: domain_url + 'mp/jsapiticket',
				data: {
					appId: shaketv_appid2,
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
						appId: shaketv_appid2,	
						timestamp: timestamp,
						nonceStr: nonceStr,
						signature: signature,
						jsApiList: [
							'startRecord',
							'stopRecord',
							'onVoiceRecordEnd',
							'onVoicePlayEnd',
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
			        H.voice.localId = res.localId; 
			        $('html').removeClass(H.card.SPEAKING_CLS);
			    }
			});
			
			wx.onVoicePlayEnd({
				complete: function (res) {
					$('#me-voice').removeClass('scale');
				}
			});
			
			wx.error(function (res) {
				if (res.errMsg == 'uploadVoice:fail') {
					alert('上传祝福语音到微信失败，请重试');
					$('#me').removeClass('loading voice');
				}
			});
		}
	};
	
})(Zepto);

$(function() {
	H.card.init();
});