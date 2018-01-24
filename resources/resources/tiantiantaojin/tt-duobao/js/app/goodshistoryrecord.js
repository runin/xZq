var uid=getQueryString("goods_id");
var page = 1;
var pageSize = 20;
var loadmore = true;
var lastlength = 0;
(function($) {
	H.goodshistoryrecord = {
        
		init:function()
		{
			var me = this;
				me.event();
				//me.historyList();
				me.scrolling();
		},
		historyList:function(data)
		{
			var t = simpleTpl();
			var length = data.length;

			for(var i=0;i<length;i++)
			{   
			   var visible = "none";
			   var luckno = "true";
			   if(!data[i].pw)
			   {
			   		visible ="show";
			   		luckno = "none";
			   }
               t._('<li>')
               ._('<div class="record-title font12">期号: '+data[i].pt +'  (揭晓时间: '+data[i].ltime + ') </div>')
          	   ._('<div class="li-record">')
          	   ._('<div class="avatar">') 
          	   ._(' <i class="ico ico-label ico-noopen '+visible+'"></i>') 
               ._('<img width="40" height="40" onerror="$(this).attr(\'src\',\'..\/..\/images\/avatar.png\')"  src="' + data[i].qhi + '">')   
               ._('</div>')  
               ._('<div class="winner-infor">')  
               ._('<p class="p_break"> <span>获奖者：</span><span class="user-name txt-red">'+(data[i].nk?data[i].nk:"无")+'</span></p>')
               ._('<p class="p_break"> <span class="address txt-spec">('+((data[i].pare + data[i].ip)?(data[i].pare + data[i].ip):"无")+')</span></p>')  
               ._('<p class="p_break"> <span>幸运号码：</span><span class="luck-id txt-red">'+(data[i].pw?data[i].pw:"无")+'</span></p>')  
               ._('<p class="p_break '+luckno +'"> <span>本期参与：</span><span class="user-times txt-red">'+data[i].wjc+'</span><span>人次</span></p>')
               ._('<p class="p_break '+visible +'"><span class="txt-red">商品未开奖，参与者参与所消费的元宝已退回余额，请到个人中心查看</span></p>')                      
               ._('</div>')  
               ._('</div>')  
               ._('</li>')         
			};
			$(".histroy-record-content ul").append(t.toString());
			$(".w-show").click(function(e)
			{
				var uid=$(this).attr("data-uid");
				location.href="./goodssharedetail.html?goods_id="+uid;
			});
			//参与
		
		},

		event:function()
		{
			
		},
		scrolling:function()
        {
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
					$('#mallSpinner').addClass('loading-space');	
					getList();
					page ++;
				}
				else
				{
					$('.loading-space').html(' --已到达列表底部--');
				}
			});
        },
	}
	// 查询所有参与者的信息
	W.getList = function(showloading) {

		getResult("indianaPeriod/announcedperiod", {appId:busiAppId,puid:uid,page:page,ps:pageSize}, 'indianaPeriodAnnouncedPeriodCallBackHandler', showloading);
    }
    W.indianaPeriodAnnouncedPeriodCallBackHandler = function (data) 
    {

    	$('#mallSpinner').removeClass('loading-space');
		$('#mallSpinner').addClass('none');
		if (data.result) {
			var items = data.items || [],
				len = items.length;
                lastlength = len;
			if (len < pageSize) {
				loadmore = false;
				$('.loading-space').html(' --已到达列表底部--');
			}
			else{
				$('.loading-space').html(' --下拉显示更多--');
			}
			//调用用户列表函数
			H.goodshistoryrecord.historyList(items);
		} else {
			if(lastlength == pageSize)
			{
				loadmore = false;
				$('.loading-space').html(' --已到达列表底部--');
			}
			$('.loading-space').html(' --此期还没有往期揭晓--');
		}

	}	  
})(Zepto);

$(function() {
	H.goodshistoryrecord.init();
});