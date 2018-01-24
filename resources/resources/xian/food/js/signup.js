var clickFlag_sign = true, clickFlag_award = true, click_sign = true,btn_sign = $("#btn-sign");
function loadingSign() {
	add_loadding(page);
	$("#load-img").attr("src", "images/paint.jpg");
	getResult('travel/enter/signdetail', {
		uuid : uuid,
		openid : openid,
		stationUuid : stationUuid
	}, 'callbackSignDetailHander', true);
}
window.callbackSignDetailHander = function(data) {
    var $mobile_num = $('#phone');
        if (data.code == 1) {
        btn_sign.removeClass("btn-sign").addClass("btn-signed").attr(
				"disabled", "disabled").attr("onclick", "javascript:void(0);")
				.text(data.message);
		click_sign = false;
	} else if (data.code == 3) {
        btn_sign.removeClass("btn-sign").addClass("btn-signed").attr(
				"onclick", "javascript:void(0);").text(data.message);
            $mobile_num.attr("disabled", "disabled").val(data.ph || '');
		$('#name').attr("disabled", "disabled").val(data.na || '');
		click_sign = false;
	} else {
		btn_sign.removeClass("btn-signed").addClass("btn-sign").removeAttr(
				"disabled").removeAttr("onclick").text("立即报名");
        $mobile_num.val(data.ph || '');
        click_sign = true;
	}
	$("#rule-content").html(data.ad);
	$("#addressStr").html(data.adr);
	$("#sign-copyright").html(data.sc);
	addressUrl = data.au;
	$("#map").find("img").attr("src", addressUrl);
	unbind_move();
	del_loadding(page);
}

btn_sign.on("click", function() {
		signup();
});

function signup() {
	var $name = $('#name'), 
		$mobile = $('#phone'), 
		name = $.trim($name.val()), 
		mobile = $.trim($mobile.val());

	if (!uuid) {
		alert('找不到该活动');
		return;
	}
	if (!name) {
		alert('请先输入姓名');
		$name.focus();
		return false;
	}
	if (!mobile || !/^\d{11}$/.test(mobile)) {
		alert('请先输入正确的手机号');
		$mobile.focus();
		return false;
	}

	if (clickFlag_sign && click_sign) {
		clickFlag_sign = false;
		$('.phone').val(mobile);
        btn_sign.hide();
		buttLoading("sign-loading");
	
		getResult('travel/enter/sure', {
			uuid : uuid,
			openid : openid,
			p : mobile,
			n : encodeURIComponent(name)
		}, 'callbackTravelEnterSureHander');
	}
}

window.callbackTravelEnterSureHander = function(data) {
	if (data.code == 0) {
        btn_sign.removeClass("btn-sign").addClass("btn-signed").attr(
				"disabled", "disabled").attr("onclick", "javascript:void(0);")
				.text('恭喜您，报名成功');
		lotteryPrize();
	} else {
        btn_sign.removeClass("btn-sign").addClass("btn-signed").attr(
				"disabled", "disabled").attr("onclick", "javascript:void(0);")
				.text(data.message);
	}
}

function lotteryPrize() {
	getResult('travel/enter/lottery', {
		enterUuid : uuid,
		openid : openid,
		activityUuid : null,
		stationUuid : stationUuid,
		serviceNo : serviceNo,
		channelUuid : channelUuid
	}, 'callbackTravelLotteryHander');
}
var enterPrizelogUuid, yourPhone, connectPhoneStr, toolTip, consultTel, pType;
window.callbackTravelLotteryHander = function(data) {
	if (data.code == 0) {
		enterPrizelogUuid = data.puuid;
		yourPhone = data.yp;
		connectPhoneStr = data.cps;
		consultTel = data.ct;
		toolTip = data.pt;
		pType = data.prizeType;

        var jf_laye = $("#jf-laye"),no_laye = $("#no-laye"),entity_laye = $("#entity-laye");
		if (data.prizeType == 1) {
			// 实物
			$(".entity-luck").empty().html(data.ltp);
			$("#entity-img").attr("src", data.piu);
			$("#entity-tip").text(data.wpt);
            jf_laye.removeClass("none").addClass("none");
            no_laye.removeClass("none").addClass("none");
		} else if (data.prizeType == 2) {
			// 积分
			$("#jf-luck").empty().html(data.ltp);
			$("#jf-img").attr("src", data.piu);
			$("#jf-tip").text(data.wpt);
			$("#jf-phone").val(data.phone);
            entity_laye.removeClass("none").addClass("none");
            no_laye.removeClass("none").addClass("none");
		} else {
			// 谢谢参与
			$("#no-luck").empty().html(data.ltp);
			$("#no-img").attr("src", data.piu);
            jf_laye.removeClass("none").addClass("none");
            entity_laye.removeClass("none").addClass("none");
		}

        page_var.addClass("disabled");
		$('.apply').removeClass('none');
		$("#button-sign-loading").hide();
        btn_sign.show();
		
		var $lottery = $('#lottery-container'),
			$pLottery = $lottery.parent(),
			width = Math.ceil($pLottery.width()),
			height = Math.ceil($pLottery.height());
		
		var lottery = new Lottery($lottery.get(0), 'images/paint.jpg', 'image', width, height, function() {
			$lottery.addClass('none');
			$('.des').removeClass('none');
			if (data.prizeType == 1) {
				// 实物
                entity_laye.removeClass('none');
			} else if (data.prizeType == 2) {
				// 积分
                jf_laye.removeClass("none");
			} else {
				// 谢谢参与
                no_laye.removeClass("none");
			}
		});
		lottery.init(data.piu, 'image');
	} else if (data.code == 4) {
		// 报名成功，但是没有奖品，直接提示报名成功
		$('#phone').attr("disabled", "disabled");
		$('#name').attr("disabled", "disabled");
		$("#button-sign-loading").hide();
        btn_sign.show();
	} else {
        btn_sign.removeClass("btn-sign").addClass("btn-signed").attr(
				"disabled", "disabled").attr("onclick", "javascript:void(0);")
				.text(data.message);
		$("#button-sign-loading").hide();
        btn_sign.show();
	}
}
$(".award").on("click", function() {
	var type = $(this).attr("name");
	if (clickFlag_award) {
		clckFlag_award = false;
		$('#' + type + '-award').hide();
		buttLoading(type + "-loading");
		award(type);
	}
});
function award(type) {
	var phoneNum = $("#" + type + "-phone").val();
	getResult('travel/enter/award', {
		enterPrizelogUuid : enterPrizelogUuid,
		openid : openid,
		phone : phoneNum
	}, 'callbackTravelAwardHander');
}

window.callbackTravelAwardHander = function(data) {
	if (data.code == 0) {
		var phone = data.phone;
		var prizeTip = yourPhone + phone + toolTip;
		if (pType == 1) {
			$("#entity-prizeTip").empty().html(prizeTip);
			$("#entity-conStr").empty().text(connectPhoneStr);
			$("#entity-conTel").empty().html(consultTel);
			$("#entity-prev").addClass("none");
			$("#entity-award").show();
			$("#button-entity-loading").hide();
			$("#entity-contact").removeClass("none");
		} else {
			$("#jf-prizeTip").empty().text(prizeTip);
			$("#jf-prev").addClass("none");
			$("#jf-award").show();
			$("#button-jf-loading").hide();
			$("#jf-contact").removeClass("none");
		}
	} else {
		alert("系统异常！");
	}
}

function buttLoading(loadDivId) {
    var t= spellLoading("butt","button-" + loadDivId );
	$('#' + loadDivId).append(t.toString());
}