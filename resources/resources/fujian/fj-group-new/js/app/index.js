/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		from: getQueryString('from'),
		index_bg: "images/bg-body.jpg",
		now_time : null,
		istrue : true,
		init: function () {
			var cbUrl = window.location.href;
			if(cbUrl.indexOf('cb41faa22e731e9b') < 0 ){
				$('#div_subscribe_area').css('height', '0');
			} else {
				$('#div_subscribe_area').css('height', '50px');
				$(".logo").css("width","250px");
			};
			this.event_handler();
			this.load_bg();
			this.prereserve();
			this.current_time();
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
				if (!reserveId) {
					return;
				}
				shaketv.reserve(yao_tv_id, reserveId, function(data){});
			});
			
		},
		load_bg: function(){
			imgReady(this.index_bg, function() {
				$('body').css('background-size', document.documentElement.clientWidth + 'px ' + document.documentElement.clientHeight + 'px');
				$('body').css('background-image', 'url('+ H.index.index_bg +')');
			});
		},
		current_time: function(){
			   getResult('express/lotteryactivity', {}, 'expressLotteryActivityHandler');
		},
		// 检查该互动是否配置了预约功能
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
					// yao_tv_id: 微信为电视台分配的id
					window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function(resp){
						if (resp.errorCode == 0) {
							$("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId);
						}
					});
				}
			});
		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeActList = data.activity,
				prizeLength = data.activity.length,
				nowTimeStr = H.index.now_time,
				me = this,
				$tips = $(".time-tips");



	        if(comptime(prizeActList[prizeLength-1].ap+" "+prizeActList[prizeLength-1].ae,nowTimeStr) >= 0){
	        	$tips.html('今日抽奖已结束，明天再来吧');
				$('.detail-countdown').addClass('none');
				return;
	        }

			for ( var i = 0; i < prizeActList.length; i++) {
				var beginTimeStr = prizeActList[i].ap+" "+prizeActList[i].ab;
				var endTimeStr = prizeActList[i].ap+" "+prizeActList[i].ae;
				if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >=0){
					toUrl("yaoyiyao.html");
					return;
				}
				if(comptime(nowTimeStr,beginTimeStr) > 0){
					$tips.html('距离抽奖开启还有');
					var beginTimeLong = timestamp(beginTimeStr);
	    			var nowTime = Date.parse(new Date())/1000;
	            	var serverTime = timestamp(nowTimeStr);
	    			if(nowTime > serverTime){
	    				beginTimeLong += (nowTime - serverTime);
	    			}else if(nowTime < serverTime){
	    				beginTimeLong -= (serverTime - nowTime);
	    			}
					$('.detail-countdown').removeClass("none").attr('etime',beginTimeLong);
					H.index.count_down();
					return;
				}
			}
		},
		// 倒计时
		count_down : function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.index.istrue){
							H.index .istrue = false;
							$tips = $(".time-tips");
						    $tips.html('抽奖开启');
						    $('#lottery').removeClass('none');
						    $('.detail-countdown').addClass("none");
						    setTimeout(toUrl("yaoyiyao.html"), 1600);
						}
					},
					sdCallback :function(){
					}
				});
			});
		}
	}
	W.expressLotteryActivityHandler = function(data){
		if(data.code == 0){
			H.index.now_time = data.tm;
			H.index.currentPrizeAct(data);
		}
	}
})(Zepto);

$(function(){
	H.index.init();
});


