/**
 *评论抽奖页
 */
(function($) {
	H.comments = {
		$main : $('#main'),
		$lottery_time : $(".lottery-time"),
		commActUid:null,
		now_time : null,
		check: null,
		dec : 0,
		init : function(){
			var me = this;
			me.current_time();
			me.currentCommentsAct();
			me.event_handler();
			
		},
		event_handler: function() {
			var me = this;
			this.$lottery_time.click(function(e){
				e.preventDefault();
				if(H.comments.$lottery_time.attr("disabled") != 'disabled' && openid != null){
					toUrl("yaoyiyao.html");
				}
			});

			$(window).scroll(function(){
				var scroH = $(this).scrollTop(),
					$fix = $('.fix');
				if(scroH > 0){
					$fix.removeClass('none');
					me.$top_back.removeClass('none');
				}else if(scroH == 0){
					$fix.addClass('none');
					me.$top_back.addClass('none');
				}
			});
			
			$("#record").on("click",function(){
				window.location.href = "record.html";
			});
			
		},
		bindClick: function(){
			$("#sup").find('.support').click(function(){
				var attrUuid = $(this).attr("data-uuid");
				getResult('express/themecomment/support', {openid:openid,activityUuid:H.comments.commActUid,attrUuid:attrUuid}, 'supportHandler',true);
			});
		},
		current_time: function(){
			getResult('api/lottery/round' + dev,{}, 'callbackLotteryRoundHandler');
		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeActList = data.la,
				prizeLength = 0,
				nowTimeStr = timeTransform(data.sctm),
				me = this,
				$lottery_time_h1 = me.$lottery_time.find(".lottery");

			me.lotteryActList = prizeActList;
			prizeLength = prizeActList.length;
			if(prizeActList.length >0){
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
					$lottery_time_h1.html('今日抽奖已结束');
					H.comments.$lottery_time.find('i').removeClass('swing');
					H.comments.$lottery_time.find('i').addClass('lottery-timed');
					H.comments.$lottery_time.attr("disabled","disabled");
					$('.detail-countdown').addClass('none');
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
						$lottery_time_h1.html('抽奖开启');
						H.comments.$lottery_time.find('i').removeClass('swing');
						H.comments.$lottery_time.find('i').addClass('lottery-timed');
						H.comments.$lottery_time.attr("disabled","disabled");
						var beginTimeLong = timestamp(beginTimeStr);
						beginTimeLong += me.dec;
						$('.detail-countdown').removeClass("none").attr('etime',beginTimeLong);
						H.comments.count_down();
						return;
					}
				}
			}else{
				me.change();
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
						var $lottery_time_h1 = H.comments.$lottery_time.find(".lottery");
						$lottery_time_h1.html('抽奖开启');
						H.comments.$lottery_time.find('i').addClass('swing').removeClass('lottery-timed');
						H.comments.$lottery_time.removeAttr("disabled");
						$('#lottery').removeClass('none');
						$('.detail-countdown').addClass("none");
						setTimeout(toUrl("yaoyiyao.html"), 1600);
					},
					sdCallback :function(){
					}
				});
			});
		},
		currentCommentsAct : function() {
			if(openid){
				getResult('express/themecomment/index/'+openid, {}, 'expressIndexHandler',true);
			}
		},
		change : function(){
			var me = this;
			me.$lottery_time.find(".lottery").html('今日抽奖已结束');
			$('.detail-countdown').addClass('none');
		}
	};

	W.expressIndexHandler = function(data){
		if(data.code == 0){
			H.comments.commActUid = data.actUid;
			$("#comm-title").text(data.actTle);
			var result = data.result;
			if(result != null && result.length != 0){
				var sumCount = data.count;
				var sumPercent = 0;
				var t = simpleTpl(), $sx_ul = $('#progress');
				for (var i = 0, len = result.length; i < len; i++) {
					var percent = (result[i].ac/sumCount * 100).toFixed(0);
					if(i == result.length-1){
						percent = (100.00 - sumPercent).toFixed(0);
					}
					t._('<p>')
						._('<label>'+ result[i].av +'</label>')
						._('<i class="support-pro"><span style="width:'+(percent)+'%;background:'+result[i].acl+'"></span></i>')
						._('<span class="lv" >'+percent+'%</span>')
					._('</p>');
					sumPercent += percent*1;
				}
				
				$sx_ul.html(t.toString());
				$sx_ul.removeClass("none");
				return;
			}
			var attrs = data.attrs;
			if(attrs != null && attrs.length != 0){
				var me = this, t = simpleTpl(), $sx_ul = $('#sup');
				for (var i = 0, len = attrs.length; i < len; i++) {
					if(attrs[i].ai != ""){
						t._('<a class="btn zc-btn support" style="background:'+attrs[i].acl+'" data-uuid = "'+ attrs[i].au +'"><i class="hand" style="background: url('+attrs[i].ai+') no-repeat right center;background-size:36px auto"></i><label>'+attrs[i].av+'</label></a>');
					}else{
						t._('<a class="btn zc-btn support" style="background:'+attrs[i].acl+'" data-uuid = "'+ attrs[i].au +'"><i></i><label class="chan-width">'+attrs[i].av+'</label></a>');
					}
				}
				$sx_ul.html(t.toString());
				$sx_ul.removeClass("none");
				H.comments.bindClick();
			}
		}else{
			H.comments.check = false;
		}
	};
	
	W.supportHandler = function(data){
		if(data.code == 0){
			var sumCount = data.count;
			var sumPercent = 0;
			var result = data.result;
			var t = simpleTpl(), $sx_ul = $('#progress');
			for (var i = 0, len = result.length; i < len; i++) {
				var percent = (result[i].ac/sumCount * 100).toFixed(0);
				if(i == result.length-1){
					percent = (100.00 - sumPercent).toFixed(0);
				}
				t._('<p>')
					._('<label>'+ result[i].av +'</label>')
					._('<i class="support-pro"><span style="width:'+(percent)+'%;background:'+result[i].acl+'"></span></i>')
					._('<span class="lv">'+percent+'%</span>')
				._('</p>');
				sumPercent += percent*1;
			}
			
			$sx_ul.html(t.toString());
			$('#sup').addClass("none");
			$sx_ul.removeClass("none");
		}
	};

	W.callbackLotteryRoundHandler = function(data){
		if(data.result == true){
			var nowTimeStemp = new Date().getTime();
			H.comments.dec = nowTimeStemp - data.sctm;
			H.comments.currentPrizeAct(data);
		}else{
			H.comments.change();
		}
	};
})(Zepto);
$(function(){
	H.comments.init();
});