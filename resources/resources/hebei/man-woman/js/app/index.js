(function($) {
	H.index = {
		$yj: $('.yj'),
		$btnReserve: $('#btn-reserve'),
		init: function() {this.event();
			this.loadResize();
			this.prereserve();
			this.rule();
		},
		rule: function(){
			getResult('api/common/rule', {}, 'commonApiRuleHandler', true);
		},
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
		event: function() {
			var me = H.index;
			$(".btn-rule").click(function(e) {
				e.preventDefault();
				me.btn_animate($(this));
				$('.rule-div').removeClass('bounceOutUp').addClass('bounceInDown');
				$('.rule-section').removeClass("none");
			});
			$(".rule-close").click(function(e){
				e.preventDefault();
				me.btn_animate($(this));
				$('.rule-div').removeClass('bounceInDown').addClass('bounceOutUp');
				setTimeout(function(){
					$('.rule-section').addClass('none');
				},800);
			});
			this.$yj.click(function(e) {
				e.preventDefault();
				$(this).removeClass('fadeInLeft');
				me.btn_animate($(this));
				toUrl('yao.html');
			});
			this.$btnReserve.click(function(e) {
				e.preventDefault();
				me.btn_animate($(this));
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
		},
		loadResize: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			$('html, body, .main').css({
				'height': winH,
				'width': winW
			});
			$('.logo').removeClass('none').addClass('zoomIn');
			$('footer a.yj').removeClass('none').addClass('fadeInLeft');
			$('footer a.card').removeClass('none').addClass('fadeInRight');
		},
		btn_animate: function(str){
			str.addClass('flipInY');
			setTimeout(function(){
				str.removeClass('flipInY');
			},200);
		}
	};

	W.commonApiRuleHandler = function(data) {
		if (data.code == 0) {
			$('.con-htm').html(data.rule);

		}
	};
})(Zepto);

$(function() {
	H.index.init();
});