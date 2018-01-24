var goods_ppuuid=getQueryString("goods_ppuuid");
var page = 1;
var pageSize = 6;
var loadmore = true;
var lastlength = 0;
(function($) {
	H.goodsshare = {
        
		init:function()
		{
			var me = this;
				me.event();
				// me.getShareDate();
				me.scrolling();
		},
		shareList:function(data)
		{
			// var data={title:"中了100000大代金券",
			//           name:"薛明晨",
			//           time:"11-15  22:00",
			//           uuid:"3123123",
			//           img:"../../images/baby.jpg",
			//           text:"首先要谢谢一元夺宝，其次还是要谢谢一元夺宝还有哥哥，没有我哥哥的介绍我没这个运气。之前自己的苹果六手机摔坏了，修不了，很沮丧，没过几天运气回来了，我当时有点不相信，以为是假的'骗人的。"
			// };
			// 
			var t = simpleTpl();
			var length = data.length;

			for(var i=0;i<length;i++)
			{   
               t._('<li class="border-low-grey">')
                ._('<div class="w-show" data-uid="'+data[i].suid+'">')
                ._('<p class="title">'+data[i].sb+'</p>')
                ._('<p><span class="author txt-red">'+data[i].nk+'</span><span class="time txt-grey flow-right">'+data[i].rtb+'</span></p>')
                ._('<div class="abbr">')
                ._('<div class="pic"><a href="javascript:void(0);"><img src="'+data[i].si.split(";")[0]+'" alt="'+data[i].title+'" onerror="$(this).attr(\'src\',\'..\/..\/images\/goods-snone.png\')"></a></div>')
                ._('<div class="txt txt-grey">'+data[i].sm.replace(/<.*?>/ig,"")+'</div>')    
                ._(' </div>') 
                ._(' </div>')      
                ._('</li>')         
                        
			};

			$(".share-content ul").append(t.toString());
			$(".w-show").click(function(e)
			{
				var uid=$(this).attr("data-uid");
				location.href="./goodssharedetail.html?goods_id="+uid;
			});
			//参与
		
		},

		event:function()
		{
			// 全部尚品
			$(".all-goods").click(function()
			{
				$(".fix-tab-div a").removeClass("focus");
				$(this).addClass("focus");
				toUrl("../../allgoods.html");
			});

			// 首页
			$(".index-goods").click(function()
			{
				$(".fix-tab-div a").removeClass("focus")
				$(this).addClass("focus");
				toUrl("../../index.html?differ");
			});
			
			// 个人中心
			$(".user-center").click(function()
			{
				$(".show-prize").removeClass("focus");
				$(".all-goods").removeClass("focus");
				$(this).addClass("focus");
				toUrl("../user/personcenter.html");
			});
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
			});
        },
	}
	// 查询所有参与者的信息
	W.getList = function(showloading) {
		if($('.share-content').hasClass('share-content-pp')){
			getResult("indianaShareOrder/list", {appId:busiAppId,puid:goods_ppuuid,page:page,ps:pageSize}, 'indianaShareOrderListCallBackHandler', showloading);
		}else{
			getResult("indianaShareOrder/list", {appId:busiAppId,page:page,ps:pageSize}, 'indianaShareOrderListCallBackHandler', showloading);
		}
    }
    W.indianaShareOrderListCallBackHandler = function (data) 
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
			H.goodsshare.shareList(items);

		} else {
			if(lastlength==pageSize)
			{
				loadmore = false;
				$('.loading-space').html(' --已到达列表底部--');
			}
			else
			{
				$('.loading-space').html(' --还没有同志晒单呢--');
			}
		}

	}	  
})(Zepto);

$(function() {
	H.goodsshare.init();
});