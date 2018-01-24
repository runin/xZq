var page = 1,
	pageSize = 5,
	time = 0,
    loadmore = true;

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
    	$(this).attr("href", "user.html");
    });
});

window.getList = function (showloading) {
	getResult('personal/' + openid + '/channel/' + channelUuid + '/prize', {page: page, pageSize: pageSize}, 'callbackUserPrizeHandler', showloading);
}

window.callbackUserPrizeHandler = function(data) {
    $('#mallSpinner').addClass('none');
	if (data.code == 0) {
		var t = simpleTpl(),
			items = data.items || [],
			len = items.length;


		if (time == 0 && len == 0) {
			window.location.href = 'gift_empty.html';
			return;
		} else if (len < pageSize) {
            loadmore = false;
		}
		for (var i = 0; i < len; i ++) {
			t._('<li>')
				._('<div class="gift-icon"></div>')
				._('<div class="gift-time">'+ items[i].pd +'</div>')
				._('<div class="gift-content">')
					._('<h2>'+ items[i].pn +'</h2>')
					._('<p>领奖方式：'+ items[i].way +'</p>')
					._('<p>领奖地址：'+ items[i].adr +'</p>')
					._('<p>咨询电话：'+ items[i].tel +'</p>')
				._('</div>')
			._('</li>');
		}
		$('#gift-timeline').append(t.toString()).closest('.list').removeClass('none');
	} else {
		$('.btn-loadmore').addClass('none');
	}
	time ++;
}