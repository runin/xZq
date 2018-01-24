$(function() {
	//window.surveyInfoUuid = getQueryString('surveyInfoUuid');
	window.surveyPrizelogUuid = 0;
	var isAward = false;
	var luck_prize = null;

	//$("#img_lottery_bg").attr("src", lottery_bg);

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
			serviceNo : serviceNo
		}, 'callbackLotteryHander',true);
	});

	$('#btn-submit').on('click', function(e) {
		e.preventDefault();

		if($(this).hasClass('red-close')){
			toUrl('answer.html');
			return;
		}

		var $phone = $('#phone'), phone = $.trim($phone.val()),
			$name = $('#name'), name = $.trim($name.val());

		if (name.length < 2 || name.length > 30) {
			showTips('姓名长度为2~30个字符');
			$name.focus();
			return false;
		}
		if (!/^\d{11}$/.test(phone)) {
			showTips('这手机号，可打不通...');
			$phone.focus();
			return false;
		}

		if (!isAward) {
			isAward = true;
			$('.btn-submit').addClass('loading-btn');
			getResult('synews/awardnew', {
				openid: openid,
				puid: surveyPrizelogUuid,
				ph: phone,
				un: encodeURIComponent(name)
			}, 'syAwardHandler');
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
window.commonApiPromotionHandler = function(data){
	if(data.code == 0){
		if(data.url && data.desc){
			jumpUrl = data.url;
			$('.outer').text(data.desc).removeClass('none');
		}
	}
};
window.syAwardHandler = function(data) {
	if (data.code == 0) {
		getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
		$('.red-fixed input').attr('disabled', 'disabled').addClass('disabled');
		$('.red-fixed .award p').text('以下是您的领奖信息');
		$('.red-fixed #btn-submit').text('返 回').addClass('red-close');
	} else if (data.code == 1) {
		alert(data.message);
		var url = "index.html";
		if (gefrom != null && gefrom != '') {
			url = url + "?gefrom=" + gefrom;
		}
		location.href = url;
	}
};

window.callbackLotteryHander = function(data) {
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
			$(".red-fixed .award section img").attr('src', data.pi);
			$(".red-fixed .items").addClass("none");
			$(".red-fixed .award").removeClass("none");
			window.location.hash = "anchor";
			$("#name").val(data.name).focus();
			$("#phone").val(data.phone);
			//$("#win_prize_tip").empty().html(data.wpt);
		}

	} else {
		alert("您未抽中奖品，感谢您的参与！");
		window.location.href = 'index.html'
		+ (gefrom ? ('?gefrom=' + gefrom) : '');
	}
};