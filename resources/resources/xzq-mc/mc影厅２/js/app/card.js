(function($) {
	H.card = {
		init: function() {
			H.card.cardlist();
			//H.card.urlFn();
		},
		cardlist: function() {
			getResult('api/lottery/record', {oi:openid}, 'callbackLotteryRecordHandler');
		},
		urlFn: function() {
			$("#card-img").delegate("li","click",function(e) {
				window.location.href="http://m.kjgmall.com/";
			});
		}
	};

	W.callbackLotteryRecordHandler = function(data) {
		var rl = data.rl;
		var now = new Date().getTime();//当前系统时间
		var tm = 0;
		if(rl && data.result == true) {
			var t = simpleTpl();
			var sa, ea;
			for(var i=0; i<rl.length; i++) {
				sa = (rl[i].sa).substr(0,10);
				ea = (rl[i].ea).substr(0,10);
				tm = timestamp(ea);
				t._('<li>')
				if(tm<now) {
					t._('<em></em>')
				}
				t._('<i></i>')
				t._('<h2>'+rl[i].pn+'</h2>')
				t._('<h3>'+rl[i].cc+'</h3>')
				t._('<span>'+sa+' 至 '+ea+'</span>')
				t._('<p>马上去使用&gt;&gt;</p>')
				t._('<a href="http://m.kjgmall.com/"></a>')
				t._('</li>')
			}
			$("#card-img").append(t.toString());
		}
	};

	H.card.init();

})(Zepto);