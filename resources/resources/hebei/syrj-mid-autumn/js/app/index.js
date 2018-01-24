(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnRule: $('#btn-rule'),
		$yj: $('.yj'),
		$card: $('.card'),
		$btnReserve: $('#btn-reserve'),
        istrue:true,
		init: function() {this.event();
			this.loadShare();
			this.loadResize();
			this.prereserve();
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
			this.$btnRule.click(function(e) {
				e.preventDefault();
				me.btn_animate($(this));
				H.dialog.rule.open();
			});
			this.$yj.click(function(e) {
				e.preventDefault();
				$(this).removeClass('fadeInLeft');
				me.btn_animate($(this));
				toUrl('barrage.html');
			});
			this.$card.click(function(e) {
				e.preventDefault();
				$(this).removeClass('fadeInRight');
				me.btn_animate($(this));
				toUrl('postcard.html');
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
		loadShare: function() {
            var me = this;
            if (me.from == 'share') {
                H.dialog.guide.open();
            }
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
})(Zepto);

$(function() {
	H.index.init();
});