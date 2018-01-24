(function($) {
	H.index = {
		$lottery_time: $(".lottery-time"),
		istrue: true,
		now_time: null,
		expires: {expires: 7},
		init: function () {
			if (!openid) {
				return false;
			};
			var me = this,
				winW = $(window).width(),
				winH = $(window).height(),
				coverImg = new Image();
			$('body').css({
				'width': winW,
				'height': winH
			});
			$('body').css({'height': winH,'width': winW});
			var paperH = (winW * 200) / 640,
				timebgH = Math.round((winW * 0.8 * 0.25 * 144) / 124) + 4;
			$('.detail-countdown').css({
				'height': timebgH + 'px',
				'line-height': timebgH + 'px'
			});
			$('.paper-box').css('height', paperH);
			$('.paper-box div').css('height', paperH);
			coverImg.src = './images/paper-cover.png';
			coverImg.onload = function (){
				$('paper-box').animate({'opacity':'1'}, 300);
			};
			me.current_time();
			me.event_handler();
			me.prereserve();
			me.scrollPaper();
		},
		event_handler : function() {
			var me = this;
			$("#btn-reserve").click(function(e) {
				e.preventDefault();
				var reserveId = $(this).attr('data-reserveid');
				if (!reserveId) {
					return;
				}
				shaketv.reserve(yao_tv_id, reserveId, function(data){});
			});
            $('#btn-go2record').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                };
                $(this).addClass(me.request_cls);
                toUrl('record.html');
            });
            $('#btn-rule').click(function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            });
		},
		current_time: function(){
			getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler', true, null, false);
		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeActList = data.la,
				prizeLength = data.la.length,
				nowTimeStr = H.index.now_time,
				me = this,
				$lottery_time_h1 = me.$lottery_time.find("a");

	        if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
	        	$('.act-info').html('敬请期待');
				H.index.$lottery_time.find('i').removeClass('swing');
				H.index.$lottery_time.find('i').addClass('lottery-timed');
				H.index.$lottery_time.attr("disabled","disabled");
				$('.countdown').addClass('none');
				$('.paper-box').addClass('none');
				return;
	        }

			for ( var i = 0; i < prizeActList.length; i++) {
				var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
				var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
				if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >=0){
					$('.paper-box').removeClass('none');
					return;
				}
				if(comptime(nowTimeStr,beginTimeStr) > 0){
					H.index.$lottery_time.find('i').removeClass('swing');
					H.index.$lottery_time.find('i').addClass('lottery-timed');
					H.index.$lottery_time.attr("disabled","disabled");
					var beginTimeLong = timestamp(beginTimeStr);
	    			var nowTime = Date.parse(new Date())/1000;
	            	var serverTime = timestamp(nowTimeStr);
	    			if(nowTime > serverTime){
	    				beginTimeLong += (nowTime - serverTime);
	    			}else if(nowTime < serverTime){
	    				beginTimeLong -= (serverTime - nowTime);
	    			}
					$('.countdown').removeClass("none");
					$('.detail-countdown').attr('etime',beginTimeLong);
					H.index.count_down();
					$('.paper-box').addClass('none');
					return;
				}
			}
		},
		count_down : function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '<div class="time-box"><span class="time">%H%</span><span class="dot">:</span><span class="time">%M%</span><span class="dot">:</span><span class="time">%S%</span></div>', // 还有...结束
					stpl : '<div class="time-box"><span class="time">%H%</span><span class="dot">:</span><span class="time">%M%</span><span class="dot">:</span><span class="time">%S%</span></div>', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.index.istrue){
							H.index.istrue = false;
							var $lottery_time_h1 = H.index.$lottery_time.find("a");
							H.index.$lottery_time.find('i').addClass('swing').removeClass('lottery-timed');
							H.index.$lottery_time.removeAttr("disabled");
							$('#lottery').removeClass('none');
							$('.countdown').addClass("none");
							$('.paper-box').removeClass('none');
						}
					},
					sdCallback :function(){
					}
				});
			});
		},
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
						return;
					}
					window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function(resp){
						if (resp.errorCode == 0) {
							$("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId);
						}
					});
				}
			});
		},
		scrollPaper: function() {
			var el = document.querySelector('.paper-box');
			var elStep = $(window).width() * 0.1;
		    var startPosition, endPosition, deltaX, deltaY, moveLength;
		    var clientWidth = $(window).width();
		    el.addEventListener('touchstart', function (e) {
		    	e.preventDefault();
		        var touch = e.touches[0];
		        startPosition = {
		            x: touch.pageX,
		            y: touch.pageY
		        }
		    });
		    el.addEventListener('touchmove', function (e) {
		    	e.preventDefault();
		        var touch = e.touches[0];
		        endPosition = {
		            x: touch.pageX,
		            y: touch.pageY
		        }
		        deltaX = endPosition.x - startPosition.x;
		        deltaY = endPosition.y - startPosition.y;
		        if(deltaX < 0) {
		        	moveLength = 0 + elStep;
		        } else if (deltaX > 0) {
		        	moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2)) + elStep;
		        };
		        if (moveLength >= 0) {
		        	$('.paper-cover').css('left', moveLength);
		        	$('.paper-mask').css('left', moveLength);
			        if (moveLength >= clientWidth-Math.round(clientWidth*0.4)) {
			        	var winW = $(window).width();
			        	$('.paper-cover').animate({'left' : winW + 100}, 1000);
			        	$('.paper-mask').animate({'left' : winW + 100}, 1000, function(){
			        		toUrl('yaoyiyao.html');
			        	});
			        };
		        };
		    });
		    el.addEventListener('touchend', function (e) {
		    	e.preventDefault();
		    	var winW = $(window).width();
		        if (moveLength < clientWidth - Math.round(clientWidth*0.4)) {
		        	$('.paper-cover').animate({'left' : '10%'}, 100);
		        	$('.paper-mask').animate({'left' : '10%'}, 100);
		        } else {
		        	$('.paper-cover').animate({'left' : winW + 100}, 1000);
		        	$('.paper-mask').animate({'left' : winW + 100}, 1000, function(){
		        		toUrl('yaoyiyao.html');
		        	});
		        }
		    });
		}
	}

	W.callbackLotteryRoundHandler = function(data){
		if(data.result){
			H.index.now_time = timeTransform(data.sctm);
			H.index.currentPrizeAct(data);
		} else {
			$('.act-info').html('敬请期待');
		}
	}
})(Zepto);

$(function(){
	H.index.init();
});