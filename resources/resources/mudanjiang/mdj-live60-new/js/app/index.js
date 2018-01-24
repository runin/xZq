(function($){
	H.index = {
		$btnReserve: $('#btn-reserve'),
		$adver: $('.adver'),
		init: function(){
			this.resize();
			this.rule();
			this.get_gg();
			this.event();
		},
		get_gg: function(){
			getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler', true);
		},
		rule: function(){
			getResult('api/common/rule', {}, 'commonApiRuleHandler', true);
		},
		resize: function(){
			$('#tab').removeClass('none').addClass('bounce-in-up');
		},
		// 是否配置了预约节目
		prereserve: function() {
			var me = this;
			$.ajax({
				type : 'GET',
				async : true,
				url : domain_url + 'api/program/reserve/get',
				data: {},
				dataType : "jsonp",
				jsonpCallback : 'callbackProgramReserveHandler',
				success : function(data) {
					if (!data.reserveId) {
						return;
					}
					window['shaketv'] && shaketv.preReserve_v2({
							tvid:yao_tv_id,
							reserveid:data.reserveId,
							date:data.date},
						function(resp){
							if (resp.errorCode == 0) {
								me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
							}
						});
				}
			});
		},
		event: function(){
			this.$btnReserve.click(function(e) {
				e.preventDefault();
				var reserveId = $(this).attr('data-reserveid');
				var date = $(this).attr('data-date');
				if (!reserveId || !date) {
					return;
				};
				window['shaketv'] && shaketv.reserve_v2({
						tvid:yao_tv_id,
						reserveid:reserveId,
						date:date},
					function(d){
						if(d.errorCode == 0){
							H.index.$btnReserve.addClass('none');
						}
					});
			});

			$('.pinglun').click(function(e){
				e.preventDefault();
				toUrl('comments.html');
			});
			$('.baoliao').click(function(e){
				e.preventDefault();
				toUrl('baoliao.html');
			});
			$('.jifen').click(function(e){
				e.preventDefault();
				toUrl('mall.html');
			});
			$(".toupiao").click(function(e){
				e.preventDefault();
				toUrl("answer.html");
			});
			$(".gift").click(function(e){
				e.preventDefault();
				toUrl("record.html");
			});
			$(".lottery").click(function(e){
				e.preventDefault();
				toUrl("yao.html");
			});
			$(".rule").click(function(e){
				e.preventDefault();
				$('.rule-first').removeClass('bounceOutUp').addClass('bounceInDown');
				$('.rule-section').removeClass('none');
			});
			$("#rule-close").click(function(e){
				e.preventDefault();
				$('.rule-first').removeClass('bounceInDown').addClass('bounceOutUp');
				setTimeout(function(){
					$('.rule-section').addClass('none')
				},1300);
			});
		}
	};

	W.commonApiRuleHandler = function(data) {
		if (data.code == 0) {
			$('.con').html(data.rule);
		}
	};
	W.callbackLinesDiyInfoHandler = function(data) {
		if(data.code == 0 && data.gitems[0] && data.gitems[0].ib){
			H.index.$adver.removeClass('none').find('img').attr('src',data.gitems[0].ib);
		}
	}
})(Zepto);
$(function(){
	H.index.init();
});