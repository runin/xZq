$(function() {
	var width = $(window).width(),
	height= $(window).height(),
	 paddingTop =400*width/640;
	
	var currentActUuid = '';
	
	$("#btn-begin").click(function(){
		if(openid == "" || openid == null){
			return;
		}
		toUrl("answer.html");
	});
	$("#btn-rule").click(function(){
		if(openid == "" || openid == null){
			return;
		}
		H.dialog.rule.open();
	});
	$(".rank").click(function(){
		getResult('api/lottery/integral/rank/top10', {pu:currentActUuid}, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
		
	});
	$(".main").css("padding-top",paddingTop);
	
	getResult("newseye/index/" + openid,{
	},'newseyeIndexHandler',true);
	
	W.newseyeIndexHandler = function(data){
		if(data.code != 1){
			currentActUuid = data.au;
		}
	};
	

	W.callbackIntegralRankTop10RoundHandler = function(data) {
		H.dialog.rank.open();
		H.dialog.rank.update(data);
	};

	var toolgd,toolgdQS,toolgdp,maincont;
	var isgo = false;
	toolgd = $(".toolgd");
	toolgdQS = document.querySelector('.toolgd');
	toolgdp = $(".toolgd>p");
	maincont = $(".main-cont");
	maincont.css("display","none");

	toolgdQS.addEventListener("webkitAnimationEnd", function () {
		toolgd.css("display","none");
		maincont.css("display","block");
		toolgd.css({"-webkit-animation":""})
	},false);

	toolgdp.on("click", function () {
		isgo = true;
		toolgd.css({"-webkit-animation":"disp 0.5s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"})
	});
	setInterval(function () {
		if(isgo == false){
			toolgd.css({"-webkit-animation":"disp 0.5s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"})
			maincont.css("display","block");
		}
	},10000);
});
    