$(function() {
	FastClick.attach(document.body);
	
	$(document).bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		location.href = 'main.html';
	});
});

var $numWrapper = $('#interact-wrapper'),
	$nums = $('#nums'),
	url = "log/countpv/" + channelUuid;

imgReady(index_bg, function() {
	var win_width = $(window).width();
	$('body').css('background-image', 'url('+ index_bg +')');
	$('body').css('background-size', win_width + 'px auto');
	$('html').css('background-color', '#D12B2B');
	getResult(url, {}, 'callbackCountPvHander', true);
	
	setInterval(function() {
		getResult(url, {}, 'callbackCountPvHander');
	}, 5000);
});

function callbackCountPvHander(data) {
	var num = data.c || 0;
	var strs = num.toString().split(''),
		t = simpleTpl();

	for (var i = 0, len = strs.length; i < len; i++) {
		t._('<span class="digit">'+ strs[i] +'</span>');
	}
	$nums.html(t.toString());
	$('#interact-wrapper').removeClass('hidden');
	//$('#needle').removeClass('none').addClass('move');
	
	setTimeout(function() {
		window.location.href = 'main.html';
	}, 3000);
}