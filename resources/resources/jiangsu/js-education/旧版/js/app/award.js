//-------------//
//----我的奖品----//

(function($) {
	
	H.award = {
		init: function() {
			this.showFn();
			this.myprizeFn();
			this.mypjcountFn();
		},
		showFn: function() {
			$(".user-gift").unbind("click").click(function() {
				if($("body").find(".my-prize").length>0) {
					$(".pop-bg").removeClass("none");
					$(".my-prize").addClass("in-up");
				}else {
					H.award.myprizeFn();
					$(".pop-bg").removeClass("none");
				}
			});
		},
		mypjcountFn: function() {//中奖数量
			getResult('api/lottery/count4Channel', {oi:openid}, 'callbackLotteryCount4Channel');
		},
		myprizeFn: function() {
			var t = simpleTpl();
			t._('<section class="pop-bg none">')
			t._('<div class="my-prize in-up">')
			t._('<a href="javascript:void(0);" class="pop-close-x"></a>')
			t._('<h5>我的奖品</h5>')
			t._('<div class="record">')
			t._('<div class="absence none">啥都没有哦~</div>')
			t._('<ul id="my-prize-list" class="none">')
			t._('</ul>')
			t._('</div>')
			t._('</div>')
			t._('</section>')
			$("body").append(t.toString());
			H.index.closeFn(".pop-close-x",".my-prize");
			getResult('api/lottery/record4Channel', {oi:openid}, 'callbackLotteryRecord4Channel');
		}
	};

	W.callbackLotteryRecord4Channel = function(data) {
		if(data&&data.result == true){
			var t = simpleTpl();
			var rl = data.rl;
			//$("#my-jps").text(rl.length);
			for(var i = 0, leg = rl.length; i<leg; i++) {
				t._('<li>')
				t._('<i class="circle"></i>')
				t._('<h2>'+rl[i].lt+'</h2>')
				t._('<div class="prize-info">')
				t._('<h3>您在江苏教育节目中赢得'+rl[i].pn+'</h3>')
				t._('<p>奖品信息：'+rl[i].pd+'')
				if(rl[i].cc) {
					t._('<lable>(  兑换码: '+rl[i].cc+')</lable>')
				}
				t._('</p>')
				t._('</div>')
				t._('</li>')
			}
			$("#my-prize-list").append(t.toString()).removeClass("none");
			H.index.closeFn(".pop-close-x",".my-prize");
		}else {
			$(".absence").removeClass("none");
		}
	};
	W.callbackLotteryCount4Channel = function(data) {
		if(data && data.result==true) {
			$("#my-jps").text(data.lc);
		}else {
			$("#my-jps").text(0);
		}
	}
	

	H.award.init();

})(Zepto);