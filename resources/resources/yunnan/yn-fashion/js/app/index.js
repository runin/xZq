(function($) {
	H.index = {
		from: getQueryString('from') || '',
		$btnRule: $('#btn-rule'),
		$btnJoin: $('#btn-join'),
		$btnTalk: $('#btn-talk'),
		$btnReserve: $('#btn-reserve'),
		expires_in: {expires: 1},
		guide: true,
		init: function() {
			if (!openid) {
				return false;
			};
			var me = this,
				winW = $(window).width(),
				winH = $(window).height(),
				btnTalk = new Image(),
				exp = new Date(); 
			exp.setTime(exp.getTime() + 1*60*60*1000);
			btnTalk.src = './images/btn-talk.png';
			$('body').css({'height': winH,'width': winW});
			btnTalk.onload = function (){
				var btnH = $('.btn-box').height();
				$('.btn-box').css('height', Math.ceil(btnH * 0.5));
			};
			if($.fn.cookie(mpappid + '_guide')){
			}else{
				if (me.from == 'share') {
					H.dialog.guide.open();
					$.fn.cookie(mpappid + '_guide', me.guide, {expires: exp});
				};
			};
			this.event();
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
			this.$btnRule.click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			this.$btnJoin.click(function(e){
				e.preventDefault();
				showLoading();
				toUrl("vote.html");
			});
			this.$btnTalk.click(function(e){
				e.preventDefault();
				showLoading();
				toUrl("talk.html");
			});
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
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});