(function($) {

	H.lottery = {
		qiu : getQueryString('qiu'),
		code : getQueryString('code'),
		tm : getQueryString('tm'),
		cpu : getQueryString('cpu'),
		card : getQueryString('card'),
		lw : null,
		awards : null,
		pru : getQueryString('pru'),
		pid : 0,
		luckyPrize : null,
		expires : {expires: 7},
		cheapPrizeList : [],
		cardList : [],
		init : function(){

			this.award();
			this.event_handler();
			this.count_down();
		},
		event_handler : function(){
			var isAward = false, me = this;

			$("#btn-lottery").click(function(e) {
				e.preventDefault();
				if ($(this).hasClass('disabled')) {
					alert('亲，您已参与过本期抽奖');
					return;
				}
				$(this).addClass('disabled');
				$('#copyright-logo').addClass('none');

				H.lottery.lw.run(lotteryPrizeList[H.lottery.pid-1]);
			});

			$('#btn-submit').on('click', function(e) {
				e.preventDefault();

				var $phone = $('#phone'), phone = $.trim($phone.val()),$name = $('#s-name'),name = $.trim($name.val());
				if (!name) {
					alert('请先输入姓名');
					$name.focus();
					return false;
				}
				if (!phone || !/^\d{11}$/.test(phone)) {
					alert("请输入正确的手机号码！");
					$phone.focus();
					return;
				}

				if (!isAward) {
					isAward = true;
					$('.btn-submit').addClass('loading-btn');

					getResult('party/quiz/award', {
						openid : openid,
						prizeResultUuid : me.pru,
						phone : phone,
						userName : encodeURIComponent(name)
					}, 'quizAwardHandler');
				}

			});
		},
		// 倒计时
		count_down: function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
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
		},
		award :function(){
			var me = this;
			$('.top').css('width',document.documentElement.clientWidth);
			if(me.qiu == null  || me.qiu == 'null' || me.code == null  || me.code == 'null'){
				alert("您还未答题，请先答题！");
				toUrl('index.html');
			}
			if(me.code == 100){
				$('#lottery').removeClass('none');
				lotteryPrize();

			}else if(me.code == 101){
				
				$('#error').removeClass('none');
				if(me.tm != '' && nextQuizBeginTime(me.tm) != null){
					$('#error-detail-countdown').attr('stime',timestamp(me.tm)).attr('etime',timestamp(nextQuizBeginTime(me.tm)));
				}else{
					$('#juli-next').addClass('none');
				}

			}else{
				var cprizeCookie = $.fn.cookie("cardprize");
	    		if(cprizeCookie != null){
					getResult('party/quiz/cardprize/'+ cprizeCookie, {
						openid : openid
					}, 'quizCardPrizeHandler',true);
				}else{
					alert("您的卡片还未集齐，请继续努力！");
					toUrl('index.html');
				}
			}


		},
		fill_data : function(data){
			$(".prize").html(data.pn + "一" + data.punit);
			$("#box-phone").removeClass("none");
			$('.entity-img').html('<img src="'+ data.pi +'">');
			window.location.hash = "anchor";
			$("#phone").focus();
		},
		geted_award : function(data){
			$(".prize").html(data.pn + "一" + data.punit);
			$("#phone").attr('disabled','disabled');
			$("#s-name").attr('disabled','disabled');
			$('#box-tip').removeClass('none');
			$('#tshiyu').text('以下是您的领奖凭证，领奖详情参见首页活动规则');
			$('#btn-submit').addClass('bg-chang').text('喜大普奔通知小伙伴');

			$('.bg-chang').click(function(e) {
				e.preventDefault();

				share();
			});

			$('#zhufu').removeClass('none');
		}
	}


	W.quizAwardHandler = function(data) {
		if (data.code == 0) {
			H.lottery.geted_award(H.lottery.luckyPrize);
			if(H.lottery.card == 1){
				$.fn.cookie("cardaward",1,this.expires);
			}
		} else {
			alert(data.message);
			var url = "index.html";
			if (gefrom != null && gefrom != '') {
				url = url + "?gefrom=" + gefrom;
			}
			location.href = url;
		}
	}

	W.luckWheel = function(opt) {
		var _opt = {
			// 奖项列表
			items : [],
			// 时间长度
			duration : 7500,
			// 重复转圈次数
			repeat : 2,
			// 回调函数
			callback : function() {
			}
		};

		for ( var key in _opt) {
			this[key] = opt[key] || _opt[key];
		}

		this.run = function(v) {
			var bingos = [], index, me = this;
			for ( var i = 0, len = this.items.length; i < len; i++) {
				if (this.items[i] == v) {
					bingos.push(i);
				}
			}

			index = bingos[(new Date()).getTime() % bingos.length];
			var amount = 360 / len, fix = amount / 5, low = index * amount + fix, top = (index + 1)
				* amount - fix, range = top - low, turnTo = low
				+ (new Date()).getTime() % range;

			$("#btn-lottery").rotate({
				angle : 0,
				animateTo : turnTo + this.repeat * 360,
				duration : this.duration,
				callback : function() {
					me.callback(index);
				}
			});
		};
	};

	W.quizLotteryHandler = function(data) {
		if (data.code == 0) {
			$.fn.cookie("prize-"+H.lottery.qiu,H.lottery.luckyPrize.pu+"-"+H.lottery.luckyPrize.pt,this.expires);
			H.lottery.pru = data.result;
			initLottery(H.lottery.luckyPrize);
			share_title = entity_share_title;
			share_desc = entity_share_desc;
		} else {
			var randomNum = getRandomArbitrary(0,H.lottery.cheapPrizeList.length);
			var lucky = H.lottery.cheapPrizeList[randomNum];
			H.lottery.luckyPrize = lucky;
			getResult('party/quiz/lotteryrecord', {
				openid : openid,
				prizeUuid : lucky.pu,
				quizInfoUuid : H.lottery.qiu
			}, 'quizLotteryRecordHandler',true);
		}
	};
	W.quizLotteryRecordHandler = function(data) {
		if (data.code == 0) {
			$.fn.cookie("prize-"+H.lottery.qiu,H.lottery.luckyPrize.pu+"-"+H.lottery.luckyPrize.pt,this.expires);
			H.lottery.pru = data.result;
			initLottery(H.lottery.luckyPrize);
			if(H.lottery.luckyPrize.pt >= 3){
				share_title = card_share_title;
				share_desc = card_share_desc;
				var nextTime = nextQuizBeginTime(data.tm);
				if(nextTime != null && nextTime != ''){
					$('#detail-countdown').attr('stime',timestamp(data.tm)).attr('etime',timestamp(nextQuizBeginTime(data.tm)));
				}else{
					$('#shengxiao').find('h3').text('集齐12生肖即可获得iPhone6 Plus一部');
				}
			}
		} else {
			alert(data.message);
			window.location.href = "index.html"
			+ (gefrom ? ('?gefrom=' + gefrom) : '');
		}
	};
	W.quizCardPrizeHandler = function(data){
		if(data.code == 0){
			if(data.ps != 2){
				H.lottery.fill_data(data);
			}else{
				$('.entity-img').html('<img src="'+ data.pi +'">');
				$("#phone").attr('disabled','disabled').val(data.ph);
				$("#s-name").attr('disabled','disabled').val(data.un);
				H.lottery.geted_award(data);
				$("#box-phone").removeClass("none");
			}

		}
	}
	function lotteryPrize(){
		var answerCookie = $.fn.cookie("answer-"+H.lottery.qiu);
		if(null == answerCookie){
			alert("您还未答题，请先答题！");
			window.location.href = 'index.html'
			+ (gefrom ? ('?gefrom=' + gefrom) : '');
		}
		var prizeCookie = $.fn.cookie("prize-"+H.lottery.qiu);
		if(null != prizeCookie){
			alert("当前题目下您已经抽过奖，请下次再来！");
			window.location.href = 'index.html'
			+ (gefrom ? ('?gefrom=' + gefrom) : '');
		}
		var allPrize = [];
		for(var i = 0;i<prizeList.prize.length;i++){
			var eachPrize = prizeList.prize[i];
			if(eachPrize.ps == 1){
				allPrize.push(eachPrize);
				if(eachPrize.pc < 0){
					H.lottery.cheapPrizeList.push(eachPrize);
				}
			}
		}
		var randomNum = getRandomArbitrary(0,allPrize.length);
		var lucky = allPrize[randomNum];
		H.lottery.luckyPrize = lucky;
		if(lucky.pc < 0){
			//生成中奖记录
			getResult('party/quiz/lotteryrecord', {
				openid : openid,
				prizeUuid : lucky.pu,
				quizInfoUuid : H.lottery.qiu
			}, 'quizLotteryRecordHandler',true);
		}else{
			//判断实物奖是否可以发放
			getResult('party/quiz/lottery', {
				openid : openid,
				prizeUuid : lucky.pu,
				quizInfoUuid : H.lottery.qiu
			}, 'quizLotteryHandler',true);
		}
	}
	function cardNum(){
		var cardnum = 0, queList = questionList.quizinfo;
		for ( var i = 0; i < queList.length; i++) {
			var prizeCookie = $.fn.cookie("prize-"+queList[i].qu);
			if(null != prizeCookie){
				if(prizeCookie.split("-")[1] >= 3){
					var prizeUuid = prizeCookie.split("-")[0];
					if(H.lottery.cardList.indexOf(prizeUuid)<0){
						cardnum ++;
						H.lottery.cardList.push(prizeUuid);
					}
				}
			}
		}
		return cardnum;
	}

	// 初始化大转盘
	function initLottery(luckyPrize){
		H.lottery.lw = new luckWheel(
			{
				items : lotteryPrizeList,
				// 回调函数
				callback : function() {
					$('#lottery').addClass('none');
					if (luckyPrize.pt == 1) {//实物
						//H.lottery.pru = data.pru;
						H.lottery.fill_data(luckyPrize);
					}else if(luckyPrize.pt == 2){
						alert("您未抽中奖品，感谢您的参与！");
						window.location.href = 'index.html'
						+ (gefrom ? ('?gefrom=' + gefrom) : '');
					} else {//生肖
						$('.card-bg').html('<img src="'+ luckyPrize.pi +'"><p>'+ luckyPrize.pn +'</p>');
						$('.card').find('p').text(cardNum);
						$("#shengxiao").removeClass("none");
					}
				}
			});

		if (luckyPrize.pd >= 0) {
			H.lottery.pid = luckyPrize.pd;
		}else{
			H.lottery.pid = 3;
		}
	}
	
	function nextQuizBeginTime(nowTime){
		var queList = questionList.quizinfo,nextQuizBeginTime = null;
		//获取下一个题目开始时间
		for ( var i = 0; i < queList.length; i++) {
			if (comptime(queList[i].qb, nowTime) <= 0) {
				nextQuizBeginTime = queList[i].qb;
				break;
			}
		}
		return nextQuizBeginTime;
	}

})(Zepto);

H.lottery.init();

