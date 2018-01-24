/**
 * 成都跨年晚会-首页
 */
(function($) {
	H.index = {
		from: getQueryString('from'),
		quizInfoUuid : null,
		nextQuizUuid : null,
		nextQuizBeginTime : null,
		expires: {expires: 7},
		cardList : [],
		init : function() {
			var me = this;
			if (me.from) {
				setTimeout(function() {
					H.dialog.guide.open();
				}, 800);
			}
			this.count_down();
			this.event_handler();
			getResult('party/quiz/index', {}, 'quizIndexHandler',true);
		},
		event_handler : function() {
			var me = this;
			$('#vote').click(function(e) {
				e.preventDefault();

				if ($(this).hasClass('btn-disabled')) {
					return;
				}
				toUrl('guess.html?qiu=' + me.quizInfoUuid);
			});
			$('#szf').click(function(e) {
				e.preventDefault();

				toUrl('send.html?qiu=' + me.quizInfoUuid);
			});
		},
		common_data : function(data) {
			H.index.quizInfoUuid = data.qiu;
			$('#rule-dialog').find('.rule-con').html(data.rl);
			$('.card').find('p').text(data.cn);
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
						$('#vote').removeClass('none');
						$('#not-started').addClass('none');

					},
					sdCallback :function(){
						var h1 = $('.detail-countdown label:nth-child(1)'),
						 	h2 = $('.detail-countdown label:nth-child(2)'),
						 	h3 = $('.detail-countdown label:nth-child(3)');

						if (h1.text() == 0 && h2.text() == 0){
							h1.hide();
							h2.hide();
							h3.hide();
						}else{
							$('.detail-countdown').css('width','230px');
						}
					}
				});
			});
		}
	}
	W.quizIndexHandler = function(data) {
		var $vote = $('#vote');
		$('#rule-dialog').find('.rule-con').html(data.rl);
		$('.card').find('p').text(cardNum);
		var nowTime = data.tm, queList = questionList.quizinfo;
		//获取当前题目
		for ( var i = 0; i < queList.length; i++) {
			if (comptime(queList[i].qb, nowTime) >= 0 && comptime(queList[i].qe, nowTime) <= 0) {
				H.index.quizInfoUuid = queList[i].qu;
				break;
			}
		}
		//获取下一个题目
		for ( var i = 0; i < queList.length; i++) {
			if (comptime(queList[i].qb, nowTime) <= 0) {
				H.index.nextQuizUuid = queList[i].qu;
				H.index.nextQuizBeginTime = queList[i].qb;
				break;
			}
		}
		if(null == H.index.quizInfoUuid){
			if(null == H.index.nextQuizUuid){
				$vote.text('活动结束').addClass('btn-disabled');
			}else{
				$vote.addClass('none');
				$('#detail-countdown').attr('stime',
						timestamp(data.tm)).attr('etime',
						timestamp(H.index.nextQuizBeginTime));

				H.index.quizInfoUuid = H.index.nextQuizUuid;
				$('#not-started').removeClass('none');
			}
		}else{
			/*$.fn.cookie("answer-"+H.index.quizInfoUuid,null);
			$.fn.cookie("prize-"+H.index.quizInfoUuid,null);*/
			var answerCookie = $.fn.cookie("answer-"+H.index.quizInfoUuid);
			if(answerCookie != null){
				if(null == H.index.nextQuizUuid){
					$vote.text('活动结束').addClass('btn-disabled');
				}else{
					$('#detail-countdown').attr('stime',
							timestamp(data.tm)).attr('etime',
							timestamp(H.index.nextQuizBeginTime));
					$vote.addClass('none');
					H.index.quizInfoUuid = H.index.nextQuizUuid;
					$('#not-started').removeClass('none');
				}
			}
		}
	}
	function cardNum(){
		var cardnum = 0, queList = questionList.quizinfo;
		for ( var i = 0; i < queList.length; i++) {
			var prizeCookie = $.fn.cookie("prize-"+queList[i].qu);
			if(null != prizeCookie){
				if(prizeCookie.split("-")[1] >= 3){
					var prizeUuid = prizeCookie.split("-")[0];
					if(H.index.cardList.indexOf(prizeUuid)<0){
						cardnum ++;
						H.index.cardList.push(prizeUuid);
					}
				}
			}
		}
		return cardnum;
	}
})(Zepto);

H.index.init();
