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
        totalheight = 0,
		headImg = null,
		nickName = "";
    $(window).scroll(function(){
        var srollPos = $(window).scrollTop();
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if (($(document).height() - range) <= totalheight  && page < maxpage && loadmore) {
            if (!$('#mallSpinner').hasClass('none')) {
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
 
	if(headimgurl == null || headimgurl == ''){
			headImg = './images/avatar.jpg';
	}else{
			headImg = headimgurl + '/' + yao_avatar_size;
	}
	if(nickname == null|| nickname == ''){
		 nickName = "靓妆观众";
	}else{
		nickName = nickname;
	}
	$(".gift-header p:first-child img").attr("src",headImg);
	$(".gift-header p:last-child span").text(nickName);
});

window.getList = function (showloading) {
	if(openid) {
		getResult('tjexpress/lotteryhis', {openid:openid,page: page, pageSize: pageSize}, 'expressLotteryHisHandler', showloading);
	}
}

window.expressLotteryHisHandler = function(data) {
    $('#mallSpinner').addClass('none');
		  if(!data.list&&first){
		  	
		  	$(".list").html("<p class='no-record'>您目前没有获奖记录</p>");
		  }else{
		   	var t = simpleTpl(),
			list = data.list || [],
			len = list.length;
			if (time == 0&&len == 0) {
				return;
			} else if (len < pageSize) {
	            loadmore = false;
			}
			for (var i = 0; i < len; i ++) {
				if(data.list[i].pt ==6){
					t._('<li>')
					._('<div>')
						._('<span>'+ data.list[i].pn+'</span>')
						._('<span>序列号：'+data.list[i].ck +'</span>')
					._('</div>')
					._('<a class="btn-detail" data-collect="true" data-collect-flag="js-mother-day-mygift-detail'+i+'-back" data-collect-desc="我的口袋查看详情">查看详情</a>')
				._('</li>');
				}
			}
			$('#gift-list').append(t.toString()).closest('.list').removeClass('none');
			  $('.btn-detail').each(function(){
		    		$(this).click(function(e) {
					e.preventDefault();
					H.dialog.rule.open();
			  });
    })
		
	   }
		first = false;
		$('.btn-loadmore').addClass('none');
	time ++;
};