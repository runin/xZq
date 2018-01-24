(function($) {
	var classId = {
		$headUrl: $(".headurl"),
		$topLogo: $(".top-logo"),
		$myBox: $(".my-box"),
		$myJifen: $("#my-jifen"),
		$myPaiheng: $("#my-paiheng"),
		$nickname: $("#nickname"),
		$myNav: $("#my-nav"),
		$aReturn: $(".a-return"),
		$jiangpinList: $(".jiangpin-list"),
		$jifenN: $("#jifen-n"),
		$paihengN: $("#paiheng-n"),
		$paihengH: $("#paiheng-h")
	};
	
	H.my = {//基本模板
	    $h:"",
		init: function() {
			this.headUrl();
			this.configFn();
			this.mypjcountFn();
			this.navFn();
			this.lotteryRecord();
			this.fixedFn();
			
			this.selfJf();
			this.fulibangFn();
			
			var wH = $(window).height();
			classId.$myBox.css("min-height",wH-10);
		},
		
		navFn: function() {//我的选项展开
			classId.$myNav.find("li").click(function() {
				var name = $(this).attr("name");
				$("#"+name).removeClass("none").siblings().addClass("none");
				H.my.$h = $("#"+name).find(".scale-box").height();
			});
			classId.$aReturn.click(function(e) {
				classId.$myBox.find("div").eq(0).removeClass("none").siblings().addClass("none");
			});
		},
		
		fixedFn: function() {//二级页面头部定位
		    $(window).scroll(function() {
				if($(window).scrollTop() >= 10){
					$(".head-box").addClass("fixed");
					var t = $(window).scrollTop();
					if(t<50) {
						var s = (t/100)>0.8?(t/100):0.8;
					    $(".scale-box").css({"-webkit-transform":"scale("+s+", "+s+")","min-height":(H.my.$h-t)+"px","padding":"0"})
					}
					
				}else {
					$(".scale-box").css({"-webkit-transform":"scale(1, 1)","min-height":H.my.$h+"px","padding":"5px 0"});
					$(".head-box").removeClass("fixed");
				}
			});
		},
		
		headUrl: function() {
			var headimgurl = window.headimgurl ? window.headimgurl+"/64" : "images/avatar.jpg";
			var nickname = window.nickname ? window.nickname : "匿名" ;
			classId.$headUrl.css("background-image","url('"+headimgurl+"')");
			classId.$nickname.text(nickname);
		},
		
		configFn: function() {//基本信息
		    getResult('api/channelhome/config', {}, 'callbackChannelhomeConfigHandler');
		},
		
		mypjcountFn: function() {//查询用户在频道下所有业务中奖数量
			getResult('api/lottery/count4Channel', {oi:openid}, 'callbackLotteryCount4Channel');
		},
		
		selfJf: function() {//获取个人积分
			getResult('api/tvintegral/rank/self', {oi: openid}, 'callbackTvIntegralRankSelfHandler');
		},
		
		lotteryRecord: function() {//我的奖品
			getResult('api/lottery/record4Channel', {oi:openid}, 'callbackLotteryRecord4Channel');
		},
		
		fulibangFn: function() {//查询总积分排行Top10
			getResult('api/tvintegral/rank/channeltop', {}, 'callbackTvChannelRank20TopsHandler');
		}
	};

	W.callbackChannelhomeConfigHandler = function(data) {//基本模板
		if(data && data.code==0) {
			classId.$topLogo.find("span").css("backgroundImage","url('"+data.icon+"')");
		}
	};
	
	W.callbackLotteryCount4Channel = function(data) {
		if(data && data.result == true) {
			$("#my-jiangpin,#jiangpin-n").html(data.lc);
		}else {
			$("#my-jiangpin,#jiangpin-n").html(0);
		}
	};
	
	W.callbackTvIntegralRankSelfHandler = function(data) {
		if(data && data.result == true){
			classId.$myJifen.text(data.in);
			classId.$jifenN.text(data.in);
			classId.$paihengN.text(data.in);
			
			if(data.rk>100) {
				classId.$myPaiheng.text("100+");
				classId.$paihengH.text("100+");
			}else {
				classId.$myPaiheng.text(data.rk);
				classId.$paihengH.text(data.rk);
			}
		}else{
			classId.$myJifen.text("0");
			classId.$myPaiheng.text("0");
			classId.$jifenN.text("0");
			classId.$paihengN.text("0");
		}
	};
	
	W.callbackLotteryRecord4Channel = function(data) {
		var ul = $("<ul></ul>");
		if(data&&data.result == true){
			var t = simpleTpl();
			var rl = data.rl;
			for(var i = 0, leg = rl.length; i<leg; i++) {
				var lt = rl[i].lt.substring(5,16);
				t._('<li>')
				t._('<i class="i-round"></i>')
				t._('<p>'+lt+'</p>')
				t._('<div class="jiangpin-con">')
				t._('<h2>'+rl[i].pn+'</h2>')
				if(rl[i].cc) {
					t._('<h2>兑换码: '+rl[i].cc+'</h2>')
				}
				t._('</div>')
				t._('</li>')
			}
			var a = ul.append(t.toString());
			classId.$jiangpinList.append(a);
		}else {
			classId.$jiangpinList.append('<p class="noting">啥都没有~</p>');
		}
	};
	
	W.callbackTvChannelRank20TopsHandler = function(data) {
		alert(data.result);
		if(data && data.result==true) {
			var tops = data.tops;
			var t = simpleTpl();
			for(var i=0, leg=tops.length; i<leg; i++) {
				var img=tops[i].hi?tops[i].hi+"/64":"images/avatar.jpg",
				    nn=tops[i].nn?tops[i].nn:"匿名";
					
				t._('<ul>')
				t._('<li><img src="'+img+'" /><span>'+nn+'</span></li>')
				t._('<li>'+tops[i].in+'</li>')
				t._('<li>第'+tops[i].rk+'名</li>')
				t._('</ul>')
			}
			$(".paiheng-list").append(t.toString());
		}
	};

	H.my.init();

})(Zepto);