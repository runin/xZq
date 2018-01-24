(function($) {
	
	H.countdown = {
		$content: $('.countdown-wrapper p'),
		$tips: $('#countdown_tips'),

		formatStr: '',
		
		init: function(){
			this.$content.html('');
			var format = this.$content.attr('format');
			this.formatStr = '<p class="time">'+format+'</p>';
		},
		
		update: function(timeLeft){
			if(timeLeft){
				H.countdown.$tips.html('提醒您距离本轮摇奖结束还有');
				H.countdown.$content.html(showTime(timeLeft, H.countdown.formatStr));
			}
		},

		updateToStart: function(timeLeft){
			if(timeLeft){
				H.countdown.$tips.html('请耐心等待，下轮摇奖开始还有');
				H.countdown.$content.html(showTime(timeLeft, H.countdown.formatStr));
			}
		},

		end: function(){
			H.countdown.$tips.html('今天的活动已经全部结束了');
			H.countdown.$content.html('<p class="time">00<span>小时</span>00<span>分</span>00<span>秒</span></p>');
		},
	};
	
	H.countdown.init();
	
})(Zepto);