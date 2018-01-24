/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		index_bg: "images/bg-body.jpg",
		now_time : null,
		istrue : true,
		dec : 0,
		$tips : $(".time-tips"),
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
			getResult('api/lottery/round' + dev,{}, 'callbackLotteryRoundHandler');
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
		change : function(){
			var me = this;
			me.$tips.html('今日抽奖已结束，明天再来吧');
			$('.detail-countdown').addClass('none');
		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeActList = data.la,
				prizeLength = 0,
				nowTimeStr = timeTransform(data.sctm),
				me = this;
			me.lotteryActList = prizeActList;
			prizeLength = prizeActList.length;
			if(prizeActList.length >0){
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
					me.change();
					return;
				}
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
					var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
						toUrl("yaoyiyao.html");
						return;
					}
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						me.$tips.html('距离抽奖开启还有');
						var beginTimeLong = timestamp(beginTimeStr);
						beginTimeLong += me.dec;
						$('.detail-countdown').removeClass("none").attr('etime',beginTimeLong);
						H.index.count_down();
						return;
					}
				}
			}else{
				me.change();
			}
		},
		// 倒计时
		count_down : function() {
			var me = this;
			$('.detail-countdown').each(function() {
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.index.istrue){
							H.index .istrue = false;
							me.$tips.html('抽奖开启');
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
	};
	W.callbackLotteryRoundHandler = function(data){
		if(data.result == true){
			var nowTimeStemp = new Date().getTime();
			H.index.dec = nowTimeStemp - data.sctm;
			H.index.currentPrizeAct(data);
		}else{
			H.index.change();
		}
	};
})(Zepto);

$(function(){
	H.index.init();
});


