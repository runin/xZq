(function($) {

	H.send = {
		qiu : getQueryString('qiu'),
		init : function(){
			getResult('user/'+openid+'/phone', {},'callbackUserPhoneHandler');
			this.event_handler();
		},
		event_handler : function(){
			$('#btn-submit').click(function(e) {

				e.preventDefault();
				if ($(this).hasClass('requesting')) {
					return;
				}
				$(this).addClass('requesting');

				var $content = $('#content'),
					content = $.trim($content.val()),
					$phone = $('#phone'),
					phone = $.trim($phone.val()),
					regex = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^\d{11}$)/;

				if (!content) {
					$(this).removeClass('requesting');
					alert('请您写下祝福');
					$content.focus();
					return;
				}
				var len = content.length;
				if (len < 4 || len > 200) {
					$(this).removeClass('requesting');
					alert('祝福文字长度为4-200字');
					$content.focus();
					return;
				}
				if (!phone || !regex.test(phone)) {
					$(this).removeClass('requesting');
					alert('请输入正确的电话号码，格式为：\n 座机：010-12345678\n手机：13800138000');
					$phone.focus();
					return;
				}


				getResult('news/clue', {
					serviceNo: '',
					openid: openid,
					phone: phone,
					content: encodeURIComponent(content)
				}, 'callbackClueHandler');

			});

			$('.btn-back-simple').click(function(e) {
				e.preventDefault();

				var content = $.trim($('#content').val()),
					phone = $.trim($('#phone').val());

				if (content.length > 0 || phone.length > 0 ) {
					if (!confirm('是否放弃提交祝福？')) {
						return;
					} else {
						window.location.href = 'index.html';
					}
					return;
				}
				window.location.href = 'index.html';
			});

			$('#jingcai').click(function(e) {
				e.preventDefault();
				var me = this;
				if(me.qiu == null || me.qiu == 'null'){
					toUrl('index.html');
				}else{
					toUrl('guess.html?qiu=' + me.quizInfoUuid);
				}
			});
		}


	}

	W.callbackUserPhoneHandler=function (data){
		$('#phone').val(data.result);
	}

	W.callbackClueHandler = function(data) {
		$('#btn-submit').removeClass('requesting');
		$('#success-dialog').removeClass('none');
		$('#suc-tlt').text("提交成功！");
		$('#suc-describe').text('关注跨年晚会，您的祝福不仅有机会在电视展示，同时还有机会赢得猪牛羊大奖哦！');
	}

})(Zepto);

H.send.init();


