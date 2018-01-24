
//******个人总积分******//

(function($) {
	window.jf = "";
	window.pm = "";
	window.self;
	
	H.jifen = {
		init: function() {
			this.selfJf();
			window.self = H.jifen.selfJf;
			//this.channeltop();
		},
		selfJf: function() {
			getResult('api/tvintegral/rank/self', {oi: openid}, 'callbackTvIntegralRankSelfHandler');
		},
		rankingFn: function() {
			var t = simpleTpl();
			t._('<section class="pop-bg">')
			t._('<div class="jf-ranking in-up">')
			t._('<a href="javascript:void(0);" class="pop-close-x"></a>')
			t._('<h5>积分排行榜</h5>')
			t._('<div class="integral-ph">')
			t._('<div class="absence none">啥都没有哦~</div>')
			t._('<ul id="integral-list" class="none">')
			t._('</ul>')
			t._('</div>')
			t._('</div>')
			t._('</section>')
			$("body").append(t.toString());
			H.index.closeFn(".pop-close-x",".jf-ranking");
			getResult('api/tvintegral/rank/channeltop', {}, 'callbackTvChannelRank20TopsHandler');
		},
		channeltop: function() {
			$(".user-gold").click(function() {
				H.jifen.rankingFn()
			});
		}
	};

	W.callbackTvIntegralRankSelfHandler = function(data) {//获取个人积分
		if(data && data.result == true){
			$("#integration").text(data.in);
			window.jf = data.in;
			if(data.rk>100) {
				window.pm = "100+";
			}else {
				window.pm = data.rk;
			}
		}else{
			$("#integration").text('0');
		}
	};
	W.callbackTvChannelRank20TopsHandler = function(data) {//前20排名积分榜
	    var t = simpleTpl();
		if(data && data.result == true){
			var tops = data.tops;
			for(var i in tops){
				t._('<li>')
				t._('<i></i>')
				t._('<span class="">'+tops[i].in+"/64"+'</span>')
				t._('<em>第'+tops[i].rk+'名</em>')
				t._('</li>')
			}
			$("#integral-list").append(t.toString()).removeClass("none");
			 
		}else{
			$(".absence").removeClass("none");
		}
	};

	H.jifen.init();

})(Zepto);