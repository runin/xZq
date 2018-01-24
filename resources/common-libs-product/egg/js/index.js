(function($) {
	
	H.index = {
		$wrapper: $('#wrapper'),
		init: function() {
			this.event();
			
			this.$wrapper.css({'width': $(window).width(), 'height': $(window).height()});
		},
		
		event: function() {
			$('#btn-egg-lottery').click(function(e) {
				e.preventDefault();
				
				LotteryEgg.init({
					countUrl: domain_url + 'comedian/querylc', 	// 剩余抽奖次数接口地址
					countCallback: 'callbackComedianQuerylc',	// 剩余抽奖次数接口回调函数名
					lotteryUrl: domain_url + 'comedian/lottery',// 抽奖接口地址 
					lotteryCallback: 'callbackComedianLottery',	// 抽奖接口回调函数 
					awardUrl: domain_url + 'comedian/award/', 	// 领奖接口地址
					awardCallback: 'callbackComedianAward'   	// 领奖接口回调函数
				}).open();
			});
		}
			
	};
	
})(Zepto);

$(function() {
	H.index.init();
});