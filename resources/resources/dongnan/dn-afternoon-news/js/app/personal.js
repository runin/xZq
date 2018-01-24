(function($) {
    H.personal = {
		init: function() {
			this.headimgFn();
			this.recordFn();
		},
		headimgFn: function() {
			if(headimgurl) {
				$(".personal-head").find("img").attr("src",headimgurl);
			}else {
				$(".personal-head").find("img").attr("src","images/avatar.jpg");
			}
			
		},
		recordFn: function() {
			getResult('api/lottery/record', {oi:openid}, 'callbackLotteryRecordHandler', true);
		}
       
    };
	
	W.callbackLotteryRecordHandler = function(data) {//获取个人信息
		if(data&&data.result == true){
			var t = simpleTpl();
			var rl = data.rl;
			for(var i = 0, leg = rl.length; i<leg; i++) {
				t._('<li>')
				t._('<i class="circle"></i>')
				t._('<h2>'+rl[i].lt+'</h2>')
				t._('<div class="prize-info">')
				t._('<h3>名称：'+rl[i].pn+'</h3>')
				if(rl[i].cc) {
					t._('<p>兑换码：'+rl[i].cc+'</p>')
				}
				t._('</div>')
				t._('</li>')
			};
			$("#record-list").append(t.toString()).removeClass("none");
		}else {
			$(".absence").removeClass("none");
		}
	};
	
	H.personal.init();
	
})(Zepto);
