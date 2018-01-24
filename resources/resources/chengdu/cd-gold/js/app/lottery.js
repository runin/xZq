(function($) {

	H.lottery = {
		cheap : null,
		actUid : null,
		pru : null,
		luckyPrize : null,
		expires : {expires: 7},
		type : 1,
		init : function(){
			this.event_handler();
			this.count_down();
		},
		event_handler : function(){
			var me = this;
		},
		// 倒计时
		count_down: function() {
			
		},
		lottery:function(actUid,type){
			this.type = type;
			this.actUid = actUid;
				getResult('express/lottery', {
					openid : openid,
					actUid : actUid
				}, 'expressLotteryHandler',true);
		}
	}


	W.expressLotteryHandler = function(data) {
		if (data.code == 0 && data.pru != null) {
			H.lottery.pru = data.pru;
			H.dialog.lottery.open();
			H.dialog.lottery.update(data);
			if(H.lottery.type == 1){
				H.index.current_time();
			}else{
				H.comments.current_time();
			}
		}else{
			H.dialog.lottery.open();
			H.dialog.lottery.update(data);
			if(H.lottery.type == 1){
				H.index.current_time();
			}else{
				H.comments.current_time();
			}
		}
	};
})(Zepto);

H.lottery.init();

