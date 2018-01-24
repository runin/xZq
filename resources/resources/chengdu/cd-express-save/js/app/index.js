/**
 * 成都深夜快递-首页
 */
(function($) {
	H.index = {
		init : function() {
			this.event_handler();
		},
		event_handler : function() {
			var me = this;
			$('#activity').click(function(e) {

				var $mobile = $('.mobile'),
					$name = $('.name'),
					mobile = $.trim($mobile.val()),
					name = $.trim($name.val());

				if (!name) {
					alert('请先输入姓名');
					$name.focus();
					return;
				}
				if (!mobile || !/^\d{11}$/.test(mobile)) {
					alert('请先输入正确的手机号');
					$mobile.focus();
					return;
				}
				if(openid != null){
					getResult('gzlive/themecomment/award', {
						ph: mobile,
						un: encodeURIComponent(name),
						openid: openid
					}, 'callbackAwardHander');
				}
			});
		}
	}
	W.callbackAwardHander = function(data) {
		if (data.code == 0) {
			alert("提交成功！");
			$("input").attr("diasbled","diasbled");
			$('#activity').addClass("none");
			$('#tip').removeClass("none");
		}
	}
})(Zepto);
$(function(){
	H.index.init();
});
