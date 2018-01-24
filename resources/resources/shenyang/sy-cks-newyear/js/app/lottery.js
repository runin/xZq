$(function() {
	window.surveyInfoUuid = getQueryString('surveyInfoUuid');
	window.surveyPrizelogUuid = 0;
	var isAward = false;
	var luck_prize = null;

	$("#img_lottery_bg").attr("src", lottery_bg);

	$("#btn-lottery").click(function(e) {
		e.preventDefault();
		if ($(this).hasClass('disabled')) {
			return;
		}
		$(this).addClass('disabled');
		recordUserOperate(openid, "调用抽奖接口", "doLottery");
		getResult('synews/lottery', {
			openid : openid,
			surveyInfoUuid : surveyInfoUuid,
			serviceNo : service_no
		}, 'callbackLotteryHander',true);
	});

	$('#btn-submit').on('click', function(e) {
		e.preventDefault();

		var $phone = $('#phone'), phone = $.trim($phone.val());

		if (!phone || !/^\d{11}$/.test(phone)) {
			alert("请输入正确的手机号码！");
			$phone.focus();
			return;
		}

		if (!isAward) {
			isAward = true;
			$('.btn-submit').addClass('loading-btn');
			getResult('synews/award', {
				openid : openid,
				surveyPrizelogUuid : surveyPrizelogUuid,
				phone : phone
			}, 'callbackAwardHander');
		}

	});

	$('#btn-share').click(function(e) {
		e.preventDefault();

		share();
	});
	$('.outer').click(function(e){
		e.preventDefault();
		toUrl(jumpUrl);
	});
});

window.callbackAwardHander = function(data) {
	if (data.code == 0) {
		$('.box').addClass('none');
		$('#box-tip').removeClass('none');
		var $phone = $('#phone'), phone = $.trim($phone.val());
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
		alert(data.message);
		var url = "index.html";
		if (gefrom != null && gefrom != '') {
			url = url + "?gefrom=" + gefrom;
		}
		location.href = url;
	}
};
window.luckWheel = function(opt) {
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

window.callbackLotteryHander = function(data) {
	if (data.code == 0) {
		// 奖项列表
		var awards = data.luckyWheel;
		// 初始化大转盘
		var lw = new luckWheel(
				{
					items : awards,
					// 回调函数
					callback : function() {
						if (data.code == 0) {
							luck_prize = data;
							window.surveyPrizelogUuid = data.surveyPrizelogUuid;
							if(data.prizeType == 3){
								alert("您未抽中奖品，感谢您的参与！");
								window.location.href = 'index.html'
								+ (gefrom ? ('?gefrom=' + gefrom) : '');
							}else{
								$(".prize")
									.html(
									data.prizeType == 2 ? data.prizeName
										: (data.prizeName
									+ "一" + data.prizeUnit));
								$("#box-phone").removeClass("none");
								window.location.hash = "anchor";
								$("#phone").val(data.phone).focus();
								$("#win_prize_tip").empty().html(data.wpt);
							}

						} else {
							alert("您未抽中奖品，感谢您的参与！");
							window.location.href = 'index.html'
									+ (gefrom ? ('?gefrom=' + gefrom) : '');
						}
					}
				});

		if (data.prizeIndex >= 0) {
			lw.run(awards[data.prizeIndex]);
		}
	} else {
		alert(data.message);
		window.location.href = "index.html"
				+ (gefrom ? ('?gefrom=' + gefrom) : '');
	}
}