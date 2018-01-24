var awards = "";
$(function() {
	var isAward = false;

	$("#img_lottery_bg").attr("src", lottery_bg);

	$("#btn-lottery").click(function(e) {
		e.preventDefault();
		if ($(this).hasClass('disabled')) {
			alert('亲，您已参与过本期抽奖');
			return;
		}
		$(this).addClass('disabled');
		getResult('api/lottery/luck', {
			oi : openid
		}, 'callbackLotteryLuckHandler');
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
			getResult('api/lottery/award', {
				oi : openid,
				ph : phone
			}, 'callbackLotteryAwardHandler');
		}

	});

	$('#btn-share').click(function(e) {
		e.preventDefault();

		share();
	});

    var init_prize = function(){
        getResult('api/lottery/prizes','callbackLotteryPrizesHandler',true);
    };

});

window.callbackLotteryAwardHandler = function(data) {
	if (data.result) {
		$('.box').addClass('none');
		$('#box-tip').removeClass('none');
		$('#phone-num').text(data.phone);
		// 兑换提示

		if (data.prizeType == 1) {
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
}

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

window.callbackLotteryLuckHandler = function(data) {
	if (data.result) {
		// 初始化大转盘
		var lw = new luckWheel(
				{
					items : awards,
					// 回调函数
					callback : function() {
						if (data.result) {
                            if(data.pt == 1 || data.pt == 2){
                                $(".prize")
                                    .html(
                                        data.pt == 2 ? data.pn
                                            : (data.pn
                                            + "一" + data.pu));
                                $("#box-phone").removeClass("none");
                                window.location.hash = "anchor";
                                $("#phone").val(data.ph).focus();
                                $("#win_prize_tip").empty().html(data.tt);
                                $('.data-ad').empty().html(data.aw);
                                $('.data-ct').empty().html(data.ad);
                                $('.data-tp').empty().html(data.pd);
                            }

						} else {
							alert("您未抽中奖品，感谢您的参与！");
							window.location.href = 'index.html'
									+ (gefrom ? ('?gefrom=' + gefrom) : '');
						}
					}
				});

		if (data.px >= 1) {
			lw.run(awards[data.px -1]);
		}
	} else {
		window.location.href = "index.html"
				+ (gefrom ? ('?gefrom=' + gefrom) : '');
	}
}

W.callbackLotteryPrizesHandler = function(data){
    if(data.result){
        awards = data.pa;
    }
};