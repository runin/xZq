(function($) {
	H.index = {
		from: getQueryString('from'),
		nowTime: null,
		init: function() {
			this.event();
			this.prereserve();
			this.current_time();
			if (this.from == 'share') {
				H.dialog.guide.open();
			};
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
                                $('#btn-reserve').removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
				}
			});
		},
		event: function() {
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$('#btn-join').click(function(e) {
				e.preventDefault();
				toUrl('vote.html');
			});
			$('#btn-lottery').click(function(e) {
				e.preventDefault();
				toUrl('lottery.html');
			});
			$('#btn-reserve').click(function(e) {
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
                            $('#btn-reserve').addClass('none');
                        }
                    });
			});
		},
		current_time: function(){
			getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler', true, null, false);
		},
		currentPrizeAct:function(data){
			var me = this, prizeActList = data.la,
				prizeLength = data.la.length, nowTimeStr = H.index.nowTime;

	        if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
	        	$('header .countdown').addClass('none');
				return;
	        }
			for ( var i = 0; i < prizeActList.length; i++) {
				var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
				var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
				if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >=0){
					shownewLoading(null, '请稍等...');
					toUrl('lottery.html');
					// $('#btn-lottery').trigger('click');
					return;
				}
				if(comptime(nowTimeStr,beginTimeStr) > 0){
					var beginTimeLong = timestamp(beginTimeStr);
	    			var nowTime = Date.parse(new Date());
	            	var serverTime = timestamp(nowTimeStr);
	    			if(nowTime > serverTime){
	    				beginTimeLong += (nowTime - serverTime);
	    			}else if(nowTime < serverTime){
	    				beginTimeLong -= (serverTime - nowTime);
	    			}
					$('.countdown').removeClass("none");
    				$(".countdown-tip").html('距离摇奖开启还有');
					$('.detail-countdown').attr('etime',beginTimeLong);
					H.index.count_down();
					return;
				}
			}
		},
		count_down : function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '<span class="time">%H%</span><span class="dot">:</span><span class="time">%M%</span><span class="dot">:</span><span class="time">%S%</span>', // 还有...结束
					stpl : '<span class="time">%H%</span><span class="dot">:</span><span class="time">%M%</span><span class="dot">:</span><span class="time">%S%</span>', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						shownewLoading(null, '请稍等...');
						toUrl('lottery.html');
						// $('#btn-lottery').trigger('click');
					},
					sdCallback :function(){
					}
				});
			});
		}
	};

	W.callbackLotteryRoundHandler = function(data){
		if(data.result){
			H.index.nowTime = timeTransform(data.sctm);
			H.index.currentPrizeAct(data);
		} else {
			$('header .countdown').addClass('none');
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});