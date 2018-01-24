(function($) {
	
	H.stars = {
		$stars: $('#stars'), 
		$btn_card: $('#btn-card'),
		$pv: $('#ui-pv'),
		expires: {expires: 7},
		init: function() {
			this.shake_tv();
			
			H.utils.resize();
			this.event();
			
			var t = simpleTpl(),
				stars = W['stars'] || [];
			
			for (var i = 0, len = stars.length; i < len; i++) {
				t._('<dd data-type="'+ stars[i].type +'" data-id="'+ (i + 1) +'" data-wish="'+ stars[i].wish +'">')
					if (stars[i].type == 'audio') {
						t._('<audio preload="auto" class="audio none" src="'+ stars[i].wish +'"></audio>');
					}
					
	    			t._('<div class="avatar">')
	    				._('<img src="'+ (stars[i].avatar || './images/blank.gif') +'" />')
	    			._('</div>')
	    			._('<span>'+ stars[i].name +'</span>')
	    		._('</dd>');
			}
			this.$stars.html(t.toString());
			
			
			this.update_pv();
		},
		
		shake_tv: function() {
			var me = this,
				nickname = $.fn.cookie('da-nickname'),
				avatar = $.fn.cookie('da-avatar');
			
			if (!nickname || !avatar) {
				W['shaketv'] && shaketv.authorize(shaketv_token_avatar, 'userinfo', function(data) {
					if (data.errorCode == 0){
						getResult('shaketv/userinfo?openid='+ openid +'&code=' + data.code, {}, 'callbackShaketvUserinfoHandler', true);
					 } else {
						 window.location.href = 'index.html';
					 }
				});
			}
		},
		
		update_pv: function() {
			getResult('log/servicepv/'+ serviceNo, {}, 'callbackCountServicePvHander');
			setInterval(function() {
				getResult('log/servicepv/'+ serviceNo, {}, 'callbackCountServicePvHander');
			}, 5000);
		},
		
		event: function() {
			var me = this;
			this.$stars.delegate('dd', 'click',function(e) {
				var $tg = $(this),
					$siblings = $tg.siblings('dd'),
					type = $tg.attr('data-type');
				
				if (type == 'audio') {
					if ($siblings.hasClass('scale')) {
						return;
					}
					$siblings.removeClass('selected');
					$(this).addClass('selected scale');
					me.$stars.find('dt').remove();
					
					var $audio = $(this).find('audio');
					$audio.get(0).play();
					$audio.on('playing', function() {
						console.log('playing')
					}).on('ended', function() {
						console.log('ended');
						$audio.get(0).pause();
						$tg.removeClass('scale');
					});
				} else {
					$siblings.removeClass('selected');
					$(this).addClass('selected tips');
					
					me.$stars.find('dt').remove();
					var id = parseInt($tg.attr('data-id')),
						index, arrow_cls = '';
					
					if (id % 4 == 0) {
						index = id;
					} else {
						index = Math.ceil(id / 4) * 4;
						arrow_cls = 'a' + (id % 4);
						
					}
					
					me.$stars.find('dd').eq(index - 1).after('<dt class="arrow-box '+ arrow_cls +'"><div class="tip">'+ $tg.attr('data-wish') +'</div></dt>');
				}
				
			});
			
			this.$btn_card.click(function(e) {
				e.preventDefault();
				
				var $selected = me.$stars.find('.selected');
				if ($selected.length == 0) {
					alert('请先选择您喜欢的明星');
					return false;
				}
				window.location.href = 'card.html?id=' + ($selected.attr('data-id') || 1);
			});
		}
	};
	
	H.utils = {
		$main: $('#main'),
		resize: function() {
			var me = this,
				width = $(window).width(),
				height = $(window).height();
			
			this.$main.css('minHeight', height);
		}
	};
	
	W.callbackCountServicePvHander = function(data) {
		if (data.c) {
			H.stars.$pv.find('strong').text(data.c);
			H.stars.$pv.removeClass('none');
		}
	};
	
	W.callbackShaketvUserinfoHandler = function(data) {
		if (data.nickname) {
			$.fn.cookie('da-nickname', data.nickname, H.stars.expires);
		}
		if (data.headimgurl) {
			$.fn.cookie('da-avatar', data.headimgurl, H.stars.expires);
		}
	};
	
})(Zepto);

H.stars.init();
