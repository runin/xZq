var activityUuid = null;
var callbackQuizLotteryHandler = function(data) {
};
var callbackQuizAwardHandler = function(data) {
};
function luckWheel(opt) {
	var _opt = {
		// 奖项列表
		items : [],
		// 时间长度
		duration : 6000,
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

var prizeResultUuid = '';
var isSendAward = false;
function submitAward(){
	if(isSendAward)
		return;
	isSendAward = true;
	$("#submit_btn").attr('class', 'btned');
    var phone = $("#phone").val();
    if(phone=='' || phone.length != 11){ 
    	alert("请输入正确的手机号码！"); 
    	isSendAward = false;
    	$("#submit_btn").attr('class', 'btn');
    	$("#phone").focus();
    	return;
    }
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "quiz/award",
		data:{openid:openid,prizeResultUuid:prizeResultUuid,phone:$("#phone").val()},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackQuizAwardHandler",
		success : function(data) {
			console.log(data);
			if(data.code==0){
				$("#input_phone_div").addClass("none");
				$("#phone_html").html(data.phone);
				$("#phone_label").removeClass("none");
				$("#submit_btn").addClass("none");
				$("#goBack_btn").removeClass("none");
            }else if(data.code==1){
                alert(data.message);
            	$("#submit_btn").attr('class', 'btn');
            	isSendAward = false;
            }
		},
		error : function() {
			alert(COMMON_SYSTEM_ERROR_TIP);
	    	$("#submit_btn").attr('class', 'btn');
        	isSendAward = false;
		}
	});
}
$(function() {
	$("#img_lottery_bg").attr("src", lottery_bg);
	
	activityUuid = getQueryString('activityUuid');
	$("#submit_btn").click(function() {
		submitAward();
	});
	$("#btn-share").click(function() {
		$("#div-share-box").show();
	});
	$("#div-share-box").click(function() {
		$("#div-share-box").hide();
	});
	var msg = '';
	var canGo = false;
	$("#lottery-btn").click(function() {
		if (msg != '' && msg.length > 0)
		{
			alert(msg);
			return;
		}
		if (canGo) {
			return;
		}
		canGo = true;
		$.ajax({
			type : "get",
			async : false,
			url : domain_url + "quiz/lottery",
			data : {
				openid : openid,
				activityUuid : activityUuid
			},
			dataType : "jsonp",
			jsonp : "callback",
			jsonpCallback : "callbackQuizLotteryHandler",
			success : function(data) {
				if (data.code == 0) {
					// 奖项列表
					var awards = data.luckyWheel;
					// 初始化大转盘
					var lw = new luckWheel({
						items : awards,
						// 回调函数
						callback : function(i) {
								if (data.prizeStatus) {
									prizeResultUuid = data.prizeResultUuid;
									if(data.prizeType == 1){
										$("#prize_name").empty().html(data.prizeName+data.prizeCount+data.prizeUnit);
										$("#input_phone_div").removeClass("none");
									}else if (data.prizeType == 2) {
										$("#prize_name").empty().html(data.prizeName);
										$("#integral_desc").removeClass("none");
										$("#submit_btn").addClass("none");
										$("#goBack_btn").removeClass("none");
									}
									$("#hj_box").removeClass("none");
									window.location.hash="anchor";
									$("#phone").val(data.quizPhone);
									$("#phone").focus();
                                    $('.tip').append(data.tt);
                                    jsmain();
                                    var height = $('#winmain').outerHeight();
                                    $('body').css('minHeight', height + 80);



								} else {
									alert("您未抽中奖品，感谢您的参与！");
									location.href = "index.html";
								}
						}
					});
					if (data.prizeIndex >= 0) {
						lw.run(awards[data.prizeIndex]);
					}
				} else {
					msg = data.message;
					alert(msg);
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