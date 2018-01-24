window.onload = function() {
		labels = document.getElementById('male').getElementsByTagName('label');
		radios = document.getElementById('male').getElementsByTagName('input');
		for (i = 0, j = labels.length; i < j; i++) {
			labels[i].onclick = function() {
				if (this.className == '') {
					for (k = 0, l = labels.length; k < l; k++) {
						labels[k].className = '';
						radios[k].checked = false;
					}
					this.className = 'checked';
					try {
						document.getElementById(this.name).checked = true;
					} catch (e) {
					}
				}
			}
		}
	}

$(function() {
	$(".passwordShow").click(function() {
		if ($(this).attr("id") == 'sex_male') {

			$(".djqr").show();
			$(".jr").hide();

		}
	});
	$(".djqr").hide();
	$(".jr").hide();

	$(".passwordchanneldetail").click(function() {
		if ($(this).attr("id") == 'sex_female') {
			$(".djqr").show();
			$(".jr").hide();

		}
	});
	$(".djqr").hide();
	$(".jr").hide();

	$(".passwordtrendsdetail").click(function() {
		if ($(this).attr("id") == 'sex_nomale') {
			$(".jr").show();
			$(".djqr").hide();
		}
	});
	$(".djqr").hide();
	$(".jr").hide();
	
	var content = '辽宁宜佳购物情人节抽奖';
	
	$("#btn-award").click(function(){
		var phone = $(".mobile").val();
		var regex = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^\d{11}$)/;
		if (!phone || !regex.test(phone)) {
			alert('请输入正确的电话号码，格式为:13800138000');
			return;
		}
		getResult('synews/clue', {
			serviceNo: service_no,
			openid: openid,
			phone: phone,
			content: encodeURIComponent(content),
			imgs: ''
		}, 'callbackClueHandler');
	});
	
	window.callbackClueHandler = function(data){
		$.fn.cookie('cookie_lnyj_input','true',{expires: 30});
		window.location.href = "end.html";
	};
	
});
//结束
function end() {
	var isInput = $.fn.cookie('cookie_lnyj_input');
	if(isInput == null){
		$("#sctck").removeClass("none");
	}else{
		$.fn.cookie('cookie_lnyj_input','true',{expires: 30});
		window.location.href = "end.html";
	}
}