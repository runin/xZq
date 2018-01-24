(function($) {

	H.lottery = {
		actid:getQueryString("uid"),
		cid:getQueryString("cid"),
		user_answer_uuid : '',
		surveyInfoUuid : '',
		quesData : '',
		now_time : null,
		curr_index : 0,
		REQUEST_CLS: 'requesting',
		$dl: $("#answer dl"),
		$count_down: $("#count-down"),
		$answer: $("#answer"),
		$content_items: $(".content-items"),
		$btn_click: $("#btn-click"),

		init : function(){
			this.$count_down.css('height', $(window).height());
			this.event_handler();

			getResult("newseyeday/index/" + openid,'newseyedayIndexHandler',true);
		},

		event_handler : function(){
			var me = this;
			this.$btn_click.click(function(e){
				e.preventDefault();
				if(!$(this).hasClass("disabled")){
					me.submitSurvey();
				}
			});

			$(".btn-back-simple").click(function(e){
				e.preventDefault();
				$(this).attr("href", 'index.html');
			});

			this.$dl.delegate('dd', 'click', function(e, data){
				e.preventDefault();
				if($(this).hasClass(me.REQUEST_CLS)){
					return;
				}
				$(this).removeClass('dding').addClass('dded').siblings('dd').removeClass('dded').addClass('dding');
				H.lottery.user_answer_uuid = $(this).attr('id');
			});
		},
		checkActivity : function(data){
			var prizeActList = data.quizinfo,
				prizeLength = prizeActList.length,
				nowTimeStr = H.lottery.now_time,
				me = this;

			if(comptime(nowTimeStr,prizeActList[0].qb) > 0){
				this.fill(data, 0);
				this.$dl.find('dd').addClass(me.REQUEST_CLS);
				this.$btn_click.addClass('disabled').text('活动未开始');
				return;
			}
			if(comptime(prizeActList[prizeLength-1].qe,nowTimeStr) > 0 || prizeActList[prizeLength-1].qf){
				this.fill(data, prizeLength-1);
				this.$dl.find('dd').addClass(me.REQUEST_CLS);
				this.$btn_click.addClass('disabled').text('活动已结束');
				return;
			}

			for ( var i = 0; i < prizeActList.length; i++) {
				var bTime = prizeActList[i].qb ,
					eTime = prizeActList[i].qe;
				this.fill(data, i);
				if(comptime(nowTimeStr, bTime) > 0){
					/*$('.countdown').attr('data-stime', timestamp(nowTimeStr)).attr('data-etime', timestamp(bTime));*/
					/*var count = timestamp(bTime) - timestamp(nowTimeStr);*/
					var beginTimeLong = timestamp(bTime);
					var nowTime = Date.parse(new Date());
					var serverTime1 = timestamp(nowTimeStr);
					if(nowTime > serverTime1){
						beginTimeLong += (nowTime - serverTime1);
					}else if(nowTime < serverTime1){
						beginTimeLong -= (serverTime1 - nowTime);
					}
					var count = beginTimeLong - timestamp(nowTimeStr);
					this.count_down(count);
					H.lottery.$count_down.removeClass("none");
					return;
				}else if( comptime(nowTimeStr, eTime) > 0 && !prizeActList[i].qf){
					this.curr_index = i;
					H.lottery.$count_down.addClass("none");
					return;
				}
			}
		},

		submitSurvey : function () {
			var checkedParams = H.lottery.user_answer_uuid;
			if (null == checkedParams || checkedParams.length == 0) {
				alert("请选择您的答案");
				return;
			}
			this.$btn_click.addClass("disabled");
			getResult("newseyeday/answer",{
				openid: openid,
				quizInfoUuid: this.$dl.find('dt').attr('id'),
				attrUuid: checkedParams
			},'newseyedayAnswerHandler',true);
		},

		count_down: function(count) {
			$('.countdown').each(function(index) {
				var curr = new Date().getTime(),
					before = curr - 1 * 60 * 60 * 1000,
					after = curr + count,
					stime = '',
					etime = '';
				switch (index) {
					case 0:
						stime = before;
						etime = after;
						break;
					case 1:
						stime = curr - 60 * 1000;
						etime = curr;
						break;
					case 2:
						stime = after;
						etime = after + 60 * 1000;
						break;
				}
				$(this).attr('data-stime', stime).attr('data-etime', etime);
			});

			$('.countdown').countdown({
				stpl: '0',
				etpl: '<span class="state2">%H%: %M%: %S%</span>',
				otpl: '',
				callback: function(state) {
					if(state === 3){
						H.lottery.$count_down.addClass("none");
					}
				}
			});
		},
		fill: function(data, index) {
			var t = simpleTpl(),
				qitems = data.quizinfo[index] || [],
				items = qitems.qa;
			t._('<dt id="'+ data.quizinfo[index].qu +'" data-qr="'+ data.quizinfo[index].qr +'">'+ data.quizinfo[index].qt +'</dt>');
			for (var i = 0, len = items.length; i < len; i ++) {
				t._('<dd class="dding" id="'+ items[i].au +'">')
					._('<label>'+ items[i].ai + '</label></dd>');
			}
			this.$dl.html(t.toString());
			this.count_down();
		}
	};

	W.newseyedayAnswerHandler = function(data) {
		if(data.code == 0){
			H.lottery.now_time = data.tm;
			H.lottery.quesData.quizinfo[H.lottery.curr_index].qf = true;
			H.lottery.$btn_click.removeClass("disabled");
			H.lottery.checkActivity(H.lottery.quesData);
			if(data.ar){
				H.dialog.lottery.open(data, false);
			}else{
				H.dialog.lottery.open('',true);
			}
		}
	};
	W.newseyedayIndexHandler = function(data) {
		if(data.code == 0){
			H.lottery.now_time = data.tm;
			H.lottery.quesData = data;
			H.lottery.checkActivity(data);
		}else if(data.code == 2){//活动已结束，查得昨天最后一道题
			H.lottery.fill(data, 0);
			H.lottery.$dl.find('dd').addClass(H.lottery.REQUEST_CLS);
			H.lottery.$btn_click.addClass('disabled').text('活动已结束');
		}
	}
})(Zepto);
$(function(){
	H.lottery.init();
});

