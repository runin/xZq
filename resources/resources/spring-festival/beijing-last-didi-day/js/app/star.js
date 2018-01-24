(function() {
	
	H.star = {
		$stars: $('#star-list'),
		starId: getQueryString('id'),
		init: function() {
			if (!openid || !nickname) {
				return;
			}
			
			this.fillData();
			this.event();
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
			
		}
	
	};
	
})(Zepto);

$(function() {
	H.star.init();
});