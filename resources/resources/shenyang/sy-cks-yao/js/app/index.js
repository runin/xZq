$(function() {
	newList();
	imgReady(index_bg, function() {
		$('#tab').removeClass('none').addClass('bounce-in-up');
		$('#jifen').attr('href', "user.html");

		getResult('user/jf', {oi: openid}, 'callbackUserjfHandler', true);

		imgReady(title_img, function() {
			$('#logo').css('background-image', 'url('+ title_img +')').addClass('swing');
		});
		//getResult('news/travel', {},'newsTravelHandler');
		getResult('findyou/info',{},'callbackFindyouInfo',true);
	});
	$('#apply').click(function(){
		toUrl('signup.html?uuid=' + $('#apply').attr('data-uuid'));
	});
	$('#comments').click(function(){
		toUrl('comments.html');
	});
	$("#btn-begin").click(function(){
		if(openid == "" || openid == null){
			return;
		}
		if(getQueryString('from') || getQueryString('gefrom') || !getQueryString('cb41faa22e731e9b')) {
			showTips('看电视-玩微信-摇一摇-抢大奖<br/>对着电视摇进来才能摇奖哦');
			return;
		}
		toUrl("answer.html");
	});
	$("#rule-close").click(function(){
		$('.rule-section').addClass('guide-top-ease');
		setTimeout(function()
		{
			$('.rule-section').addClass('none');
			$('.rule-section').removeClass('guide-top-ease');
		 },700);
	});
	$('ul').click(function(e){
		e.preventDefault();
		var me = $(this).find('li').eq(0);
		if(me.attr('data-gu')){
			toUrl(me.attr('data-gu'));
		}else{
			toUrl('detail.html?uid=' + me.attr('data-uid'));
		}
	});
});
var tzIsShow = function(data){
	if(data.desc && (comptime(data.pst, data.cut)>= 0 && comptime(data.cut, data.pet)>= 0)){
		$('.con').html(data.desc);
		$('.rule-section').removeClass('none');
		
	 }
};
window.newsTravelHandler=function (data){
	if(data.code == 0){
		$('#apply').removeClass('none');
		$("#apply").prev().removeClass('none');
		$('#apply').attr('data-uuid',data.id);
	}
};
window.callbackUserjfHandler = function(data) {
	if (data.code == 0) {
		if (data.hn > 0) {
			$('#jifen').addClass('news');
		}
	}
};

window.callbackFindyouInfo = function(data){
	if(data.code == 0){
		tzIsShow(data);
	}
};

var newList =  function(){
	getResult('api/ article /list', {}, 'callbackArticledetailListHandler', true);
};
window.callbackArticledetailListHandler = function(data) {
	if(data.code == 0){
		fillNewTilt(data);
	}
};
var scroll =  function(options){
	$('.marquee').each(function(i) {
		var me = this, com = [], delay = 1000;
		var len  = $(me).find('li').length;
		var $ul = $(me).find('ul');
		if (len == 0) {
			$(me).addClass('none');
		} else {
			$(me).removeClass('none');
		}
		if(len > 1) {
			com[i] = setInterval(function() {
				$(me).find('ul').animate({'margin-top': '-25px'}, delay, function() {
					$(me).find('ul li').eq(0).appendTo($ul);
					$(me).find('ul').css({'margin-top': '0'});
				});
			}, 3000);
		};
	});
};
var fillNewTilt = function(data){
	var t = simpleTpl(),
		items = data.arts,
		$ul = $('ul');
	for(i = 0, len = items.length; i< len; i++){
		t._('<li data-uid = "'+ items[i].uid +'" data-gu="'+ items[i].gu +'">'+ items[i].t +'</li>')
	}
	$ul.append(t.toString());
	scroll();
};