/**
 * 我要找到你-首页
 */

(function($) {
	H.index = {
        canLottery:2,
		init: function () {
			this.event_handler();
			this.prereserve();
		},
		event_handler : function() {
			var me = this;
			$('.btn-game').click(function(e) {
				e.preventDefault();
				if($(this).hasClass("bounceInDownJoin")){
					return;
				}
				$(this).addClass("bounceInDownJoin");
				setTimeout(function(){
					$('.btn-game').removeClass("bounceInDownJoin")
				},1000);
                toUrl("game.html");
			});
			$('.btn-zan').click(function(e) {
				e.preventDefault();
				if($(this).hasClass("bounceInDownJoin")){
					return;
				}
				$(this).addClass("bounceInDownJoin");
				setTimeout(function(){
					$('.btn-zan').removeClass("bounceInDownJoin")
				},1000);
                toUrl("vote.html");
			});
			$('.btn-bao').click(function(e) {
				e.preventDefault();
				if($(this).hasClass("bounceInDownJoin")){
					return;
				}
				$(this).addClass("bounceInDownJoin");
				setTimeout(function(){
					$('.btn-bao').removeClass("bounceInDownJoin")
				},1000);
                toUrl("sign.html");
			});
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				setTimeout(function(){
					$('#btn-rule').removeClass("requesting")
				},1000);
				H.dialog.rule.open();
			});
			$("#btn-reserve").click(function(e) {
                    e.preventDefault();
                    $(this).addClass("requesting");
					setTimeout(function(){
						$("#btn-reserve").removeClass("requesting")
					},1000);
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
                                $("#btn-reserve").addClass('none');
                            }
                        });
            });
			
		},
		// 检查该互动是否配置了预约功能
		prereserve: function() {
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
                                $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
                }
            });
		}
	}	
})(Zepto);                             

$(function(){
	H.index.init();
});


