(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnRule: $('#btn-rule'),
		$btnReserve: $('#btn-reserve'),
		guide: true,
		cb41faa22e731e9b: getQueryString('cb41faa22e731e9b'),
		init: function() {
			var me = this;
			if (me.from == 'share') {
//				H.dialog.guide.open();
			};
			me.resie();
			me.prereserve();
			me.event();
			
		},
		// 是否配置了预约节目
		prereserve: function() {
			var me = this;
			$.ajax({
				type : 'GET',
				async : true,
				url : domain_url + 'program/reserve/get',
				data: {},
				dataType : "jsonp",
				jsonpCallback : 'callbackProgramReserveHandler',
				success : function(data) {
					if (!data.reserveId) {
						$('.btn-reserve').addClass("none");
						return;
					}else{
						$('.btn-reserve').removeClass("none");
						window.reserveId_t = data.reserveId;
						window.date_t = data.date;
						window['shaketv'] && shaketv.preReserve_v2({tvid:yao_tv_id, reserveid:data.reserveId, date:data.date}, function(resp) {
								if(resp.errorCode == 0) {
									
								}
						});
					}
					
				}
			});
		},
		event: function() {
			$("#index-btn-redBox").click(function(e){
				e.preventDefault();
					toUrl("lottery.html");
			});
			
			this.$btnRule.click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$("#btn-reserve").click(function(e){
				
				e.preventDefault();
				var reserveId = window.reserveId_t;
				var dateT = window.date_t;
                if(!reserveId){
                        return;
                }
                shaketv.reserve_v2({tvid:yao_tv_id, reserveid:reserveId, date:dateT},function(data) {
                	if(data.errorCode == 0){
                	}
                	
                });
			});
		},
		resie: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			var joinW = winW * 0.7;
			var joinH = Math.ceil(joinW * 96 / 355);
			$('body, .fly-leafs').css({
				'width': winW,
				'height': winH
			});
			$('.btn-join').css({
				'height': joinH,
				'line-height': Math.ceil(joinH * 0.78) + 'px'
			});
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});