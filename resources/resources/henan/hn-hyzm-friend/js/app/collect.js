;(function($){
	H.collect = {
		init: function(){
			this.event();
		},
		event: function(){
			var me = H.collect;
			$(".back-btn").tap(function(e){
				e.preventDefault();
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
				var	content = $.trim($content.val());

				if(content.length == 0){
					showTips("介绍一下您的宝物吧");
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

				getResult('api/friendcircle/topicadd', {
					oi : openid,
					nn: nickname ? encodeURIComponent(nickname) : "",
					hu: headimgurl ? headimgurl : "",
					title: encodeURIComponent(content),
					name : encodeURIComponent(name),
					images : $images
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
			$(".form-group").addClass('none');
			$(".not-start").removeClass('none');
		} else {
			showTips("资料提交失败，请稍后重试");
		}
	};
})(Zepto);
$(function(){
	H.collect.init();
});