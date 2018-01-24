var activityUuid = null;
var surveyInfoUuid = null;

function luckWheel(opt) {
	var _opt = {
		// 奖项列表
		items : [],
		// 时间长度
		duration : 8500,
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
		$("#lottery-btn").rotate({
			angle : 0,
			animateTo : turnTo + this.repeat * 360,
			duration : this.duration,
			callback : function() {
				me.callback(index);
			}
		});
	};
}

var surveyPrizelogUuid = '';

function submitAward(){
    var phone = $("#phone").val();
    if(phone=='' || phone.length != 11){ alert("请输入正确的手机号码！"); $("#phone").focus();return;}
    	$.ajax({
    		type : "get",
    		async : false,
    		url : domain_url + "survey/award",
    		data:{openid:openid,surveyPrizelogUuid:surveyPrizelogUuid,phone:$("#phone").val()},
    		dataType : "jsonp",
    		jsonp : "callback",
    		jsonpCallback : "callbackHandler",
    		success : function(data) {
    			if(data.code==0){
    				var url = "win_step2.html?surveyPrizelogUuid="+data.surveyPrizelogUuid;
    				if (gefrom != null && gefrom != '') {
    					url = url + "&gefrom=" + gefrom;
    				}
    				location.href = url;
                }else if(data.code==1){
                    alert(data.message);
                }
    		},
    		error : function() {
    			alert(COMMON_SYSTEM_ERROR_TIP);
    		}
    	});
}
$(function() {
	$(".img-bg").attr("src", lottery_bg);
	var msg = '';
	var canGo = false;
	activityUuid = getQueryString('activityUuid');
	surveyInfoUuid = getQueryString('surveyInfoUuid');
	$("#lottery-btn").click(function() {
		if (msg != '' && msg.length > 0)
		{
			alert(msg);
			return;
		}
		if (canGo) {
			return;
		}
		$.ajax({
			type : "get",
			async : false,
			url : domain_url + "survey/lottery",
			data : {
				activityUuid : activityUuid,
				openid : openid,
				surveyInfoUuid : surveyInfoUuid,
				serviceNo : serviceNo
			},
			dataType : "jsonp",
			jsonp : "callback",
			jsonpCallback : "callbackHandler",
			success : function(data) {
				if (data.code == 0) {
					// 奖项列表
					var awards = data.luckyWheel;
					// 初始化大转盘
					var lw = new luckWheel({
						items : awards,
						// 回调函数
						callback : function(i) {
							if (true) {
								if (data.prizeStatus) {
									surveyPrizelogUuid = data.surveyPrizelogUuid;
									if(data.prizeType == 2){
										$("#prize").empty().html(data.prizeName);
									}else{
										$("#prize").empty().html(data.prizeName+data.prizeCount+data.prizeUnit);
									}
									$("#win_prize_tip").empty().html(data.wpt);
									$("#mod_box").removeClass("none");
									$("#phone").val(data.phone);
									window.location.hash="anchor";
									$("#phone").focus();
								} else {
									alert("您未抽中奖品，感谢您的参与！");
									var url = "index.html";
				    				if (gefrom != null && gefrom != '') {
				    					url = url + "?gefrom=" + gefrom;
				    				}
				    				location.href = url;
								}
							}
						}
					});
					if (data.prizeIndex >= 0) {
						// 进入页面自动触发大转盘转呀
						if (!canGo) {
							canGo = true;
							lw.run(awards[data.prizeIndex]);
						} else {
							alert('您的抽奖机会已用完！');
						}
					}
				} else if (data.code == 1) {
					alert(data.message);
				} else if (data.code == 2) {
					alert(data.message);
					var url = "index.html";
    				if (gefrom != null && gefrom != '') {
    					url = url + "?gefrom=" + gefrom;
    				}
    				location.href = url;
				}
			},
			error : function() {
				alert(COMMON_SYSTEM_ERROR_TIP);
			}
		});
	});
	
});