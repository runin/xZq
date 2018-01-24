(function() {
	
	H.star = {
		$stars: $('#star-list'),
		$mobile: $('#mobile'),
		starId: getQueryString('id'),
		init: function() {
			if (!openid || !nickname) {
				return;
			}
			
			this.countdown();
			
			this.fillData();
			
			this.$mobile.val($.fn.cookie(shaketv_appid + '_mobile') || '');
			
			this.event();
			
			this.initAPI();
		},
		
		initAPI: function() {
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
							'closeWindow'
						]
					});
				},
				error: function(xhr, type){
					alert('获取微信授权失败！');
				}
			});
		},
		
		countdown: function() {
			var me = this;
			window['serverTime'] = new Date().getTime();
			$('#countdown').attr('data-etime', timestamp(end_time))
				.attr('data-stime', timestamp(begin_time))
				.countdown({
					stpl: '<span>%H%</span><i>:</i><span>%M%</span><i>:</i><span>%S%</span>',
					etpl: '<span>00</span><i>:</i><span>00</span><i>:</i><span>00</span>', 
					otpl: '<span>00</span><i>:</i><span>00</span><i>:</i><span>00</span>',
					callback: function(state) {
						if (state > 1) {
							H.dialog.guide.open(true);
						}
					}
				});
			
			me.getServerTime();
			setInterval(function() {
				me.getServerTime();
			}, 30000);
		},
		
		getServerTime: function() {
			getResult({
				url: 'common/time',
				jsonpCallback: 'callbackTimeHandler',
				success: function(data) {
					if (data.t) {
						window['serverTime'] = data.t;
					}
				}
			});
		},
		
		fillData: function() {
			var t = simpleTpl(),
				stars = W['stars'] || [];
			
			for (var i = 0, len = stars.length; i < len; i ++) {
				t._('<li data-id="'+ (i + 1) +'">')
					._('<audio preload="auto" class="audio none" src="'+ stars[i].wish +'"></audio>')
					._('<div class="avatar">')
						._('<i class="icon-voice none"></i>')
						._('<img src="'+ stars[i].avatar +'" />')
					._('</div>')
					._('<span>'+ stars[i].name +'</span>')
				._('</li>');
			}
			this.$stars.html(t.toString()).css('minHeight', $(window).height() * 0.62);
		},
		
		event: function() {
			var me = this;
			this.$stars.delegate('li', 'click',function(e) {
				var $tg = $(this),
					$siblings = $tg.siblings('li');
				
				if ($siblings.hasClass('scale')) {
					return;
				}
				$siblings.removeClass('selected');
				$(this).addClass('selected scale');
				
				var $audio = $(this).find('audio');
				$audio.get(0).play();
				$audio.on('playing', function() {
					console.log('playing')
				}).on('ended', function() {
					console.log('ended');
					$audio.get(0).pause();
					$tg.removeClass('scale');
				});
				
			});
			
			$('#btn-sendcard').click(function(e) {
				e.preventDefault();
				
				var $selected = me.$stars.find('.selected');
				if ($selected.length == 0) {
					alert('请先选择您喜欢的明星');
					return false;
				}
				me.starId = $selected.attr('data-id');
				window.location.href = 'card.html?id=' + me.starId;
			});
			
			$('.btn-card').click(function(e) {
				e.preventDefault();
				
				$('html').attr('class', 'h-star');
			});
		}
	};
	
})(Zepto);

$(function() {
	H.star.init();
});