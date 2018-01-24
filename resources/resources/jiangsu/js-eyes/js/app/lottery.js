(function($) {

	H.lottery = {
		actid:getQueryString("uid"),
		cid:getQueryString("cid"),
		init : function(){
			this.event_handler();
		},
		event_handler : function(){
			var me = this;
			$("#btn-click").click(function(e){
				e.preventDefault();
				if($("#btn-click").attr("disabled") != "disabled"){
					H.lottery.lottery();
					$("#btn-click").attr("disabled","disabled");
				}
			});
			
			$(".btn-back-simple").click(function(e){
				e.preventDefault();
				toUrl('index.html');
			});
		},
		lottery:function(){
				getResult('newseye/lottery', {
					openid : openid,
					actid : H.lottery.actid,
					cid : H.lottery.cid
				}, 'callbackLotteryHander',true);
		}
	}

	W.callbackLotteryHander = function(data) {
		H.dialog.lottery.open();
		H.dialog.lottery.update(data);
		$("#not-open").addClass("none");
		$("#open").removeClass("none");
	};
})(Zepto);
$(function(){
	H.lottery.init();
});

