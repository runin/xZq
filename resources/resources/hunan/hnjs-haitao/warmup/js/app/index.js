(function($) {
	
	H.index = {
		$countdown: $('.img-count-down'),
		$reserveBtn: $('#reserve_btn'),
		$yaoBtn: $('#yao_btn'),
		$endBtn: $('#end_btn'),

		init: function() {
			this.initCountDown();
			this.initReserve();
		},

		initCountDown: function(){
			this.$countdown.countDown({
				'stpl' : '<span>%D%</span>天<span>%H%</span>小时<span>%M%</span>分'
			});
		},

		initReserve: function(){
			if(W.yao_tv_id){
				new Reserve().init({
					id: "#reserve_btn", 
					yao_tv_id: W.yao_tv_id
				}, null , function(){
					$('#reserve_btn').addClass('none');
					H.index.loadLotteryCount();
				});
			}
		},

		loadLotteryCount: function(){
			getResult('api/lottery/leftLotteryCount',{
				oi: openid
			}, 'callbackLotteryleftLotteryCountHandler');
		},

		showLottery: function(data){
			H.index.$yaoBtn.removeClass('none');
			H.index.$yaoBtn.find('.left-count').html(data.lc).removeClass('none');

			H.index.$yaoBtn.click(function(){
				location.href = './yao.html';
			});
		},

		hideLottery: function(){
			H.index.$endBtn.removeClass('none');
		}
	};

	W.callbackLotteryleftLotteryCountHandler = function(data){
		if(data.result && data.lc > 0){
			H.index.showLottery(data);
		}else{
			H.index.hideLottery();
		}
	}


	H.index.init();

})(Zepto);