(function($) {
	H.index = {
		serverTime : null,
		actuid: null,
		is_true: true,
		vote: null,
		beginTime: null,
		endTime: null,
		from: getQueryString('from'),
        $btnReserve:$("#btn-reserve"),
		init: function () {
			var me = this;
			if (!openid) {
				return false;
			};
			me.current_time();
			me.event_handler();
			me.prereserve();
		},
		current_time: function(){
			getResult('meet/index', {openid: openid}, 'meetIndexHandler', true, null, false);
		},
		currentPrizeAct:function(data){
			var me = this,
				nowTimeStr = H.index.serverTime;
				// prizeActList = data.vt,
				// prizeLength = data.vt.length;

			// 最后一轮抽奖时间已超过
	        if(comptime(data.ae,nowTimeStr) >= 0){
	        	$('body').addClass('wait');
                $("#btn-reserve").removeClass("main-resever").addClass("end-resever");
                $("#btn-reserve").text("预约收看");
				return;
	        }

			// for ( var i = 0; i < prizeActList.length; i++) {
				var beginTimeStr = data.ab;
				var endTimeStr = data.ae;
				// 活动是正在进行
				if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >=0){
					me.playbtn_show();
					return;
				}
				// 活动有效但还未开始
				if(comptime(nowTimeStr,beginTimeStr) > 0){
					$('.countdown-body').removeClass('none');
					var beginTimeLong = timestamp(beginTimeStr);
	    			var nowTime = Date.parse(new Date()) / 1000;
	            	var serverTime = timestamp(nowTimeStr);
	    			if(nowTime > serverTime){
	    				beginTimeLong += (nowTime - serverTime);
	    			}else if(nowTime < serverTime){
	    				beginTimeLong -= (serverTime - nowTime);
	    			}
					$('.countdown-time').attr('etime',beginTimeLong);
					H.index.count_down();
					return;
				}
			// }
		},
		count_down : function() {
			$('.countdown-time').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '<span class="time">' + '%H%' + '</span><span>小时</span><span class="time">' + '%M%' + '</span><span>分</span><span class="time">' + '%S%' + '</span><span>秒</span>', // 还有...结束
					stpl : '<span class="time">' + '%H%' + '</span><span>小时</span><span class="time">' + '%M%' + '</span><span>分</span><span class="time">' + '%S%' + '</span><span>秒</span>', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if (H.index.is_true) {
							H.index.is_true = false;
							H.index.playbtn_show();
						};
					},
					sdCallback :function(){
					}
				});
			});
		},
		playbtn_show : function() {
			var me= this;
			if (me.vote) {
				shownewLoading();
				setTimeout(function(){
					toUrl('yaoyiyao.html?wechat_card_js=1');
				},600);
			};
			$('.countdown-body').addClass('none');
			$('.btn-goin').removeClass('none');

			$('.btn-goin').click(function(e) {
				e.preventDefault();
				var param = window.location.href;
				param = add_param(param, 'actuid', H.index.actuid);
				window.location.href = param.replace('main.html','round.html');
			});
		},
		last_countdown: function(){
			var timeFix = new Date(H.index.endTime).getTime() - new Date(H.index.serverTime).getTime();
			setTimeout(function() {
				getResult('meet/index', {openid: openid}, 'meetIndexHandler', false, null, false);
			}, timeFix + 2000);
			H.index.is_true = true;
		},
		event_handler : function() {
			var me = this;
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$("#btn-reserve").click(function(e) {
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
            $(".his").click(function(e){
                e.preventDefault();
                toUrl("record.html?wechat_card_js=1");
            });
		},
		// 检查该互动是否配置了预约功能
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
        }
	};

	W.meetIndexHandler = function(data){
		H.index.actuid = data.actUid;
		H.index.vote = data.iv;
		H.index.beginTime = data.ab;
		H.index.endTime = data.ae;
		H.index.serverTime = data.tm;
		if (data.code == 3) {
			$('.btn-goin').addClass('none');
			H.index.currentPrizeAct(data);
			// H.index.last_countdown();
		} else if (data.code ==0){
			H.index.playbtn_show();
			// H.index.last_countdown();
		} else {
			$('body').addClass('wait');
            $("#btn-reserve").removeClass("main-resever").addClass("end-resever");
            $("#btn-reserve").text("预约收看");
		}
        if(data.ar == 2){
            $(".index-tit").find("img").attr("src","images/index-tit2.png");
        }
	}
})(Zepto);

$(function(){
	H.index.init();
});


