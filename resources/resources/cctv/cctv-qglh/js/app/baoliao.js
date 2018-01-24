$(function() {
	//设置默认分享
	window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, getShareUrl());
	// 一键关注
	window['shaketv'] && shaketv.subscribe(follow_shaketv_appid, function(returnData){
		// console.log(returnData.errorMsg);
	});
	function getShareUrl() {
		var href = window.location.href;
		href = href.replace(/[^\/]*\.html/i, 'index.html');
		href = add_param(href, 'resopenid', hex_md5(openid), true);
		href = add_param(href, 'from', 'share', true);
		return add_yao_prefix(href);
	}
	var actid = "";
	getResult('user/url/lhyz', {serviceNo: service_no}, 'callbackUserCenterUrlHandler');
	getResult("cctv/current", {},'callbackSurveyCurrentHander', true);
	//getResult('newseye/index/'+openid, {}, 'newseyeIndexHandler', true);
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
		if (len < 10 || len > 200) {
			$(this).removeClass('requesting');
			alert('评论长度为10-200字');
			$content.focus();
			return;
		}
		
		getResult('news/clue', {
			serviceNo: service_no,
			phone: '    ',
			openid: openid,
			content: encodeURIComponent(content)
		}, 'callbackClueHandler',true);
	});
	
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
	$('#btn-enter').click(function(e) {
		e.preventDefault();
		getResult('version/lastversion/cctv13_timeline', {}, 'callbackLastVersionHandler',true);
	});
	window.newseyeCheckHandler = function(data){
		if(data.jc){
			actid = data.iu;
		    getResult('newseye/index/'+openid, {}, 'newseyeIndexHandler');
		}else{
			return;
		}
		
	}
	window.callbackUserCenterUrlHandler = function(data){
		if(data.url == '0'){
			$("#state").text("即将讨论");
		}else{
			$("#state").text("开始讨论");
		}
		
	}
	window.callbackSurveyCurrentHander = function(data){
	     var attrs = data.sinfo.tlist;
		var newShareDesc = attrs[0].sv + "，" +share_desc
		//设置默认分享
		window['shaketv'] && shaketv.wxShare(share_img, newShareDesc, newShareDesc, getShareUrl());
			$("#comm-title").html(attrs[0].sv); 
			$("#comm-des").html(data.sinfo.tt); 
	}
	window.callbackClueHandler = function(data) {
		$('#btn-submit').removeClass('requesting');
		if (data.code == 0) {
			window.is_submit = true;
			$(".form-group").addClass("none");
			$(".succ").removeClass("none");
		} else {
			alert(data.message);
		}
	};
	window.callbackLastVersionHandler = function(data) {
		if (data.result) {
			setTimeout(function() {
				window.location.href = data.redirect;
			}, 5);
		}
	}
});




