;(function($){
	H.collect = {
		sign: getQueryString("sign"),
		name: getQueryString("name"),
		init: function(){
			this.event();
		},
		event: function(){
			var me = H.collect;

			if(is_android()){
				$("input").each(function() {
					$(this).focus(function(){
						$('.copyright').addClass('none');
					}).blur(function(){
						$('.copyright').removeClass('none');
					})
				});
				$("textarea").each(function() {
					$(this).focus(function(){
						$('.copyright').addClass('none');
					}).blur(function(){
						$('.copyright').removeClass('none');
					})
				});
			}


			$(".back-btn").tap(function(e){
				e.preventDefault();
				me.btn_animate($(this));
				toUrl("friend.html");
			});
			$('#upload-box').upload({
				url: domain_url + 'fileupload/image', 	// 图片上传路径
				numLimit: 3,							// 上传图片个数
				formCls: 'upload-form'					// 上传form的class
			});
			$("#btn-submit").tap(function(e){
				e.preventDefault();
				me.btn_animate($(this));

				//  必填信息
				var $content = $("textarea[name='content']");
				    $name = $("input[name='name']"),
					$phone = $("input[name='phone']"),
					$address = $("input[name='address']");

				var content = $.trim($content.val()),
					name = $.trim($name.val()),
					phone = $.trim($phone.val()),
					address = $.trim($address.val());



				if(content.length == 0){
					showTips("说说您做这道菜的心得吧~~");
					$content.focus();
					return false;
				}

				var $images = "";
				$(".img-preview").each(function(){
					if($(this).attr('data-url')){
						$images += $(this).attr('data-url') + ',';
					}
				});

				if($images == ""){
					showTips("请上传照片");
					return false;
				}else{
					$images = $images.substr(0,$images.length-1);
				}

				if(name.length < 2 || name.length > 30){
					showTips('姓名长度为2~30个字符');
					$name.focus();
					return false;
				}else if(!/^\d{11}$/.test(phone)){
					showTips('这手机号，可打不通哦...');
					$phone.focus();
					return false;
				}else if (address.length < 8 || address.length > 80 || address.length == 0) {
					showTips('请填写您的详细地址');
					$address.focus();
					return false;
				}
				var nn = null;
				if(nickname){
					nn = encodeURIComponent(nickname)+ ','+ encodeURIComponent(me.name);
				}else{
					nn = encodeURIComponent("匿名用户")+ ','+ encodeURIComponent(me.name);
				}
				getResult('api/friendcircle/topicadd', {
					oi : openid,
					nn: nn,
					hu: headimgurl ? headimgurl : "",
					content: encodeURIComponent(name),//姓名,
					sign: me.sign,
					images : $images,
					title: encodeURIComponent(content),
					voices: phone, //电话
					videos: address //地址
				}, 'callbackFriendcircleAddTopic',true);

			});
		},
		btn_animate: function(str){
			str.addClass('flipInY');
			setTimeout(function(){
				str.removeClass('flipInY');
			},200);
		}
	};
	W.callbackFriendcircleAddTopic = function(data) {
		if (data.code == 0) {
			var storage = W.localStorage,me = H.collect;
			if(!storage.getItem("vs-"+ me.sign +"-"+ openid)){
				storage.setItem("vs-"+ me.sign +"-"+ openid, 1);
			}
			toUrl("collectSuccess.html?sign="+ me.sign);
		} else {
			showTips("资料提交失败，请稍后重试");
		}
	};
})(Zepto);
$(function(){
	H.collect.init();
});