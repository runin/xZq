(function($) {
	H.index = {
		istrue: true,
		nowTime: null,
        isTimeOver:false,
        isLotteryTime:false,
		init: function () {
			var me = this,
				winW = $(window).width(),
				winH = $(window).height();
			$('body').css({
				'width': winW,
				'height': winH
			});
			$('body').css({'height': winH,'width': winW});
			me.currentTime();
			me.event();
		},
		event : function() {
			var me = this;
            $('#btn-rule').click(function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            });
            $('#btn-join').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('btn-notime')) {
                	$('.countdown').addClass('shake');
                	setTimeout(function() {
                		$('.countdown').removeClass('shake')
                	}, 1000);
                	return;
                }
                toUrl('yaoyiyao.html');
            });
		},
		currentTime: function(){
			getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler', true, null, false);
		},
        currentPrizeAct:function(data){
			var me = this, prizeActListAll = data.la, prizeLength = 0,
				nowTimeStr = H.index.nowTime, prizeActList = [];

			var day = nowTimeStr.split(" ")[0];
			if(prizeActListAll&&prizeActListAll.length>0){
				for ( var i = 0; i < prizeActListAll.length; i++) {
					if(prizeActListAll[i].pd == day){
						prizeActList.push(prizeActListAll[i]);
					}
			    }
			}
			prizeLength = prizeActList.length;
			if(prizeActList.length >0){
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
					 H.index.change();
					 return;
			    }
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
					var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
						H.index.do_count_down(endTimeStr,nowTimeStr,true);
						return;
					}
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						H.index.do_count_down(beginTimeStr,nowTimeStr,false);
						return;
					}
				}
			}else{
				H.index.change();
				return;
			}
        },
        change: function(){
        	$(".countdown").removeClass("none");
			$('#btn-join').addClass('btn-notime');
			$('.detail-countdown').html("");
			$(".countdown-tip").html('本期摇奖已结束，请等待下期!');
        },
        do_count_down: function(endTimeStr,nowTimeStr,isStart){
        	if(isStart){
                H.index.isLotteryTime = true;
				$(".countdown-tip").html('距离摇奖结束还有');
				$('#btn-join').removeClass('btn-notime');
        	}else{
                H.index.isLotteryTime = false;
    			$(".countdown-tip").html('距离摇奖开启还有');
				$('#btn-join').addClass('btn-notime');
        	}
        	var endTimeLong = timestamp(endTimeStr);
			var nowTime = Date.parse(new Date())/1000;
        	var serverTime = timestamp(nowTimeStr);
			if(nowTime > serverTime){
				endTimeLong += (nowTime - serverTime);
			}else if(nowTime < serverTime){
				endTimeLong -= (serverTime - nowTime);
			}
			$('.detail-countdown').attr('etime',endTimeLong);
			H.index.count_down();
			$(".countdown").removeClass("none");
        },
		count_down : function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(!H.index.isTimeOver){
							H.index.isTimeOver = true;
    						$(".countdown-tip").html('');
							shownewLoading(null,'请稍后...');
							var delay = Math.ceil(2500*Math.random() + 1700);
						    setTimeout(function(){
								hidenewLoading();
						    	getResult('api/lottery/round', 'callbackLotteryRoundHandler',true);
						    }, delay);
						}
						return;
					},
					sdCallback :function(){
						H.index.isTimeOver = false;
					}
				});
			});
		}
	}

	W.callbackLotteryRoundHandler = function(data){
		if(data.result){
			H.index.nowTime = timeTransform(data.sctm);
			H.index.currentPrizeAct(data);
		} else {
			$('.countdown-tip').html('敬请期待~');
			$('.countdown').removeClass('none');
			$('#btn-join').addClass('btn-notime');
		}
	}
})(Zepto);

$(function(){
	H.index.init();
});