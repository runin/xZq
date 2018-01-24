var page = 1,
	pageSize = 5,
	time = 0,
    loadmore = true,
    first = true;

$(function() {
	getList(true);
    page ++;


    var range = 180, //距下边界长度/单位px
        maxpage = 100, //设置加载最多次数
        totalheight = 0;

    $(window).scroll(function(){
        var srollPos = $(window).scrollTop();
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if (($(document).height() - range) <= totalheight  && page < maxpage && loadmore) {
            if (!$('#mallSpinner').hasClass('none')) {
                console.log(!$('.mallSpinner').hasClass('none'));
                return;
            }
            $('#mallSpinner').removeClass('none');
            getList();
            page ++;
        }
    });
    
    $(".btn-back").click(function(e){
    	e.preventDefault();
    	toUrl("index.html");
    });
});

window.getList = function (showloading) {
	if(openid)
	getResult('newseyeday/lotteryhis', {openid:openid,page: page, pageSize: pageSize}, 'newseyedayLotteryHisHandler', showloading);
}

window.newseyedayLotteryHisHandler = function(data) {
    $('#mallSpinner').addClass('none');
		  if(!data.list&&first){
		  	
		  	$(".list").html("<p class='no-record'>您目前没有获奖记录</p>");
		  }else{
		   	var t = simpleTpl(),
			list = data.list || [],
			len = list.length;
			if (time == 0&&len == 0) {
				//window.location.href = 'gift_empty.html';
				return;
			} else if (len < pageSize) {
	            loadmore = false;
			}
			for (var i = 0; i < len; i ++) {
				var classStateck = typeof(list[i].ck)=="undefined"?"none":"";
				var classStatecn = typeof(list[i].cn)=="undefined"?"none":"";
				t._('<li>')
					._('<div class="gift-icon"></div>')
					._('<div class="gift-time">'+ list[i].pd +'</div>')
					._('<div class="gift-content">')
						._('<p class="gift-name">'+list[i].pn+'</p>')
						._('<p class="'+classStateck+'">'+ list[i].ck +'</p>')
						._('<p class="'+classStatecn+'">'+ list[i].cn +'</p>')
					._('</div>')
				._('</li>');
			}
			$('#gift-timeline').append(t.toString()).closest('.list').removeClass('none');
		
	   }
		first = false;
		$('.btn-loadmore').addClass('none');
	time ++;
};