$(function() {
	var actid = getQueryString("uid");
	$('#btn-submit').click(function(e) {
		e.preventDefault();
		if ($(this).hasClass('requesting')) {
			return;
		}
        $(this).addClass('requesting');

		var $content = $('#content'),
			content = $.trim($content.val());
		
		if (!content) {
			$(this).removeClass('requesting');
			alert('请您写下您的评论');
			$content.focus();
			return;
		}
		var len = content.length;
		if (len < 0|| len > 200) {
			$(this).removeClass('requesting');
			alert('评论长度为0-200字');
			$content.focus();
			return;
		}
		
		getResult('newseye/clue', {
			actid: actid,
			openid: openid,
			content: encodeURIComponent(content)
		}, 'callbackClueHandler',true);
	});
    getResult('newseye/index/'+openid, {}, 'newseyeIndexHandler');
	$('.btn-back-simple').click(function(e) {
		e.preventDefault();
		var content = $.trim($('#content').val());
		if (content.length > 0){
			if (!confirm('是否放弃正在编辑的信息吗？')) {
				return;
			} else {
				window.location.href = 'index.html';
			}
			return;
		}
		window.location.href = 'index.html';
	});
	window.newseyeIndexHandler = function(data){
			$("#comm-title").text(data.at);  
	}
	window.callbackClueHandler = function(data) {
		$('#btn-submit').removeClass('requesting');
		if (data.code == 0) {
			window.is_submit = true;
				getResult('newseye/lottery', {
					openid : openid,
					actid : actid,
					cid : data.cuuid
				}, 'callbackLotteryHander',true);
	
			
		} else {
			alert("提交成功，感谢您的参与!");
		}
	}
	W.callbackLotteryHander = function(data) {
		if(!data || !data.ucount){
			var data = {"code":0,"pi":"./images/xxcy.jpg","pt":2};
			H.dialog.lottery.open(data,1);
			return;
		}
		H.dialog.lottery.open(data,1);
		
	};
});




