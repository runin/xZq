function luckWheel(opt) {
	var _opt = {
		// 奖项列表
		items : [],
		// 时间长度
		duration : 5000,
		// 重复转圈次数
		repeat : 5,
		// 回调函数
		callback : function() {
		}
	}

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
		$("#lottery-btn").rotate({
			angle : 0,
			animateTo : turnTo + this.repeat * 360,
			duration : this.duration,
			callback : function() {
				me.callback(index);
			}
		});
	}
}
var lotterySurveyPrizeRecordUuid = '';
$(function() {
	var msg = '';
	var canGo = false;
	$("#lottery-btn")
			.click(
					function() {
						if (msg != '' && msg.length > 0)
							{
								alert(msg);
								return;
							}
						if (canGo) {
							alert('您的抽奖机会已用完！');
						} else {
							$
									.ajax({
										type : "get",
										async : false,
										url : domain_url
												+ "lottery/luckwheel/win",
										data : {
											activityUuid : activityUuid,
											openid : openid,
											lotteryInfoUuid : lotteryInfoUuid
										},
										dataType : "jsonp",
										jsonp : "callback",
										jsonpCallback : "callbackHandler",
										success : function(data) {
											if (data.code == 0) {
												// 奖项列表
												var awards = data.luckyWheel;
												// 初始化大转盘
												var lw = new luckWheel(
														{
															items : awards,
															// 回调函数
															callback : function(
																	i) {
																if (true) {
																	if (data.prizeStatus) {
																		$(
																				"#prize")
																				.empty()
																				.html(
																						data.prizeName
																								+ data.prizeCount
																								+ data.prizeUnit);
																		$(
																				"#win-info")
																				.removeClass(
																						"none");
																		lotterySurveyPrizeRecordUuid = data.lotterySurveyPrizeRecordUuid;
																		$(
																				"#phone")
																				.focus();
																	} else
																		alert("您未抽中奖品，感谢您的参与！");
																}
															}
														});
												// 进入页面自动触发大转盘转呀
												if (data.prizeIndex >= 0) {
													if (!canGo) {
														canGo = true;
														lw
																.run(awards[data.prizeIndex]);
													} else {
														alert('您的抽奖机会已用完！');
													}
												}
											} else if (data.code == 1) {
												msg = data.message;
												alert(msg);
											} else if (data.code == 2) {
												msg = data.message;
												alert(msg);
											}
										},
										error : function() {
											alert(COMMON_SYSTEM_ERROR_TIP);
										}
									});
						}
					});
});

function submitAward() {
	var phone = $("#phone").val();
	if (phone == '' || phone.length != 11) {
		alert("请输入正确的手机号码！");
		$("#phone").focus();
		return;
	}
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "lottery/luckwheel/award",
		data : {
			openid : openid,
			lotterySurveyPrizeRecordUuid : lotterySurveyPrizeRecordUuid,
			phone : $("#phone").val()
		},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackHandler",
		success : function(data) {
			if (data.code == 0) {
				location.href = "win_step.html?lotterySurveyPrizeRecordUuid="
						+ lotterySurveyPrizeRecordUuid;
			} else if (data.code == 1) {
				alert(data.message);
			}
		},
		error : function() {
			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
}