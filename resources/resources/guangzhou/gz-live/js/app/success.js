$(function() {
	var amount = getQueryString('amount'),
		name = decodeURIComponent(getQueryString('name')),
		cover = getQueryString('cover'),
		jf = getQueryString('jf'),
		uid = getQueryString('uid'),
		tip = decodeURIComponent(getQueryString('tip')),
		$tips = $('#tips');

	$('#cover').html('<img src="'+ cover+'" />');
	$('#tips').html('恭喜您，已成功使用 '+ (amount * jf) +' 积分换取了'+ name + ' ' + amount +' 份！');
	
	if (tip) {
		$('#detail').html(tip).removeClass('none');
	}
	
	$('#btn-share').click(function(e) {
		e.preventDefault();
		
		share('mall.html');
	});
});