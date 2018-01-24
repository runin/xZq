$(function() {
	imgReady(index_bg, function() {
		$('html').css('background-color', '#A90406');
		$('body').css('background-size', $(window).width() + 'px auto');
		$('body').css('background-image', 'url('+ index_bg +')');
		$('#tab').removeClass('none').addClass('bounce-in-up');
		
		getResult('user/'+ openid +'/jf', {}, 'callbackUserjfHandler', true);
		getResult('user/url/news_personal_center_url', {serviceNo: service_no}, 'callbackUserCenterUrlHandler', true);
		
		imgReady(title_img, function() {
			$('#logo').css('background-image', 'url('+ title_img +')').addClass('swing');
		});
	});
});

window.callbackUserjfHandler = function(data) {
	if (data.code == 0) {
		if (data.hn > 0) {
			$('#jifen').addClass('news');
		}
	}
};
window.callbackUserCenterUrlHandler = function(data) {
	if (data.code == 0) {
		$('#jifen').attr('href', "javascript:toUrl('"+data.url+"');");
	}
};