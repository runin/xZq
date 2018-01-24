/**
 * 社区春晚-抽奖
 */
(function($) {
	H.lottery = {
		ispass : false,
		surveyPrizelogUuid : 0,
	    isAward : false,
		lotteryPrizeList : ["0","1","2","3","4","5","6"],
		init : function(){
			$("#img_lottery_bg").attr("src", lottery_bg);
			this.isShow('official', true);
			this.event();
			getResult('syparty/index', {
				qid : surveyInfoUuid
			}, 'callIndexHander',true);
		},
		event: function() {
			$("#btn-lottery").click(function(e) {
				e.preventDefault();
				if ($(this).hasClass('disabled')) {
					return;
				}
				$(this).addClass('disabled');
				if(openid && H.lottery.ispass){
					H.lottery.drawlottery();
				}
			});

			$('#btn-submit').on('click', function(e) {
				e.preventDefault();

				var $phone = $('#phone'),
					phone = $.trim($phone.val()),
					$name = $('#name'),
					name = $.trim($name.val()),
					$card_no = $('#card_no'),
					card_no = $.trim($card_no.val());

				if (!phone || !/^\d{11}$/.test(phone)) {
					alert("请输入正确的手机号码！");
					$phone.focus();
					return;
				}
				if (!name) {
					alert('请输入姓名');
					$name.focus();
					return false;
				}
				if(!card_no){
					$card_no.focus();
					alert('请输入身份证号');
				 	return false;
				 }

				if (!this.isAward) {
					this.isAward = true;
					$('.btn-submit').addClass('loading-btn');
					getResult('syparty/award', {
						openid : openid,
						surveyPrizelogUuid : this.surveyPrizelogUuid,
						phone : phone,
						name : encodeURIComponent(name),
						idcard : card_no
					}, 'callbackAwardHander');
				}

			});

			$('.btn-back-simple').click(function(e) {
				e.preventDefault();
				showLoading();
				setTimeout(function(){
					toUrl('index.html');
				}, 3000);
			});


		},
		rate: function() {
			var random = parseInt(Math.random() * 100) + 1;
			return parseInt(lottery_rate) >= random;
		},
		drawlottery:function(){
			var flag = H.lottery.rate();
			if(flag){
				//中奖
				getResult('syparty/lottery', {
					openid : openid,
					surveyInfoUuid : surveyInfoUuid
				}, 'callbackLotteryHander',true);
			}else{
				H.lottery.lottery_point(null, true);
				//谢谢参与
				getResult('syparty/thanksprize', {
					openid : openid,
					surveyInfoUuid : surveyInfoUuid
				}, 'thanksPrizeHandler');
			}
		},
		isShow : function($target, isShow){
			var $target = $('.' + $target);
			$target.removeClass('none');
			isShow ? $target.show() : $target.hide();
		},
		fill : function(data){
			if (data.code == 0) {
				luck_prize = data;
				this.surveyPrizelogUuid = data.surveyPrizelogUuid;
				$(".prize")
					.html(
					data.prizeType == 2 ? data.prizeName
						: (data.prizeName
					+ "一" + data.prizeUnit));
				H.lottery.isShow('official', false);
				$("#box-phone").removeClass("none");
				window.location.hash = "anchor";
				$("#phone").val(data.phone).focus();
				$("#win_prize_tip").empty().html(data.wpt);

			} else {
				H.lottery.isShow('official', false);
				H.lottery.isShow('thank', true);
				alert("您未抽中奖品，感谢您的参与！");
				toUrl('index.html');
			}
		},
		lottery_point : function(data, isThank){
			// 奖项列表
			    isThank ? awards = this.lotteryPrizeList : awards = data.luckyWheel;
			// 初始化大转盘
			var lw = new luckWheel(
				{
					items : awards,
					// 回调函数
					callback : function() {
						if(isThank || data.prizeIndex === pointer){
							H.lottery.isShow('official', false);
							H.lottery.isShow('thank', true);
						}else{
							H.lottery.fill(data);
						}
					}
				});

			isThank ? lw.run(awards[pointer]) : lw.run(awards[data.prizeIndex]);
		}
	};
	W.callIndexHander = function(data){
		if(data.code == 0){
			H.lottery.ispass = true;
		}
		else{
			alert(data.message);
			toUrl('index.html');
		}
	};

	W.thanksPrizeHandler = function(data) {
	};
	W.callbackAwardHander = function(data) {
		if (data.code == 0) {
			$('.box').addClass('none');
			$('#box-tip').removeClass('none');
			var $phone = $('#phone'),
				phone = $.trim($phone.val());
			$('#phone-num').text(phone);
			// 兑换提示

			if (luck_prize.prizeType == 1) {
				$("#prize_link_tip").empty().html(',领奖时请带好当前手机。');
				$('.data-ad').empty().html(luck_prize.ad);
				$('.data-ct').empty().html(luck_prize.ct);
				$('.data-tp').empty().html(luck_prize.tp);
			} else {
				$('.address').addClass('none');
			}
		} else if (data.code == 1) {
			alert("亲,服务器君很忙,休息一下再试吧");
			toUrl('index.html');
		}
	};

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

	W.callbackLotteryHander = function(data) {
		if (data.code == 0) {
			H.lottery.lottery_point(data);
		} else {
			alert(data.message);
			toUrl('index.html');
		}
	};
})(Zepto);

$(function() {
	H.lottery.init();
});
