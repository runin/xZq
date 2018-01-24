
var page = 1,
	pageSize = 10,
	loadmore = true,
	lastlength = 0,
	order=0,
	type="0",
	redid=getQueryString("redId");
(function($) {
	H.index = {
		
		init:function()
		{
			var me = this;
				me.event();
				me.btnMenuEvent();
				me.scrolling(order,type,redid);
		},
		btnMenuEvent:function()
		{
			var me = this;
			// 第一列选择状态栏
			$(".btn-allgoods").click(function()
			{
				$(".allgoods-small-list").toggleClass("none");
				$(".modal").toggleClass("none");
				if($(".btn-allgoods i").hasClass("arrow-down"))
				{

					$(".btn-allgoods i").removeClass("arrow-down").addClass("arrow-up");
				}
				else
				{

					$(".btn-allgoods i").removeClass("arrow-up").addClass("arrow-down");
				};
			});
			// 商品列表选项列
			$(".allgoods-small-list li").each(function(el,index)
			{
				
				$(this).click(function()
				{
					page = 1;
					$(".allgoods-small-list li").removeClass("selected")
					$(".allgoods-small-list").addClass("none");
					$(".modal").addClass("none");
					$(this).addClass("selected");

					//人气览的选项值
					order = $(".btn-popular-list li.selected").attr("datastyle");
					type = $(this).attr("liststyle");
					//点击商品名替换全部商品名并修改字体颜色和箭头颜色和方向(selected)
					$(".btn-allgoods span").text($(this).text()).addClass("txt-red");

					// 并且修改liststyle的值
					$(".btn-allgoods").addClass("selected").attr("liststyle",$(this).attr("liststyle"));

					$(".btn-allgoods i").removeClass("arrow-up").addClass("arrow-down");
					me.scrolling((order?order:"0"),type,"");

				});
			});
			// 人气选项列
			$(".btn-popular-list li").each(function(el,index)
			{
				
				$(this).click(function()
				{
					page = 1;
					$(".btn-popular-list li").removeClass("selected")
					$(".allgoods-small-list").addClass("none");
					$(".modal").addClass("none");
					$(this).addClass("selected");
					// 点击非最后一项时，去掉最后一项的属性值
					if(!$(this).hasClass("needsnum"))
					{
						$(".needsnum a").addClass("down").removeClass("up");
					}

					$(".btn-allgoods i").removeClass("arrow-up").addClass("arrow-down");

					type = $(".btn-allgoods").attr("liststyle");
					// 如果是升序，点击则降序
					if($(this).find("a").hasClass("up"))
					{
						
                        order = 5;
						me.scrolling(order,type,redid);
						$(this).attr("datastyle","5");
						$(this).find("a").addClass("down").removeClass("up");
						return
					}
					// 如果是降序，点击则升序
					else if($(this).find("a").hasClass("down"))
					{
						order = 4;
						me.scrolling(order,type,redid);

						$(this).attr("datastyle","4");
						$(this).find("a").addClass("up").removeClass("down");
						return
					}

					// 否则 点击的是人气，最新，剩余人次。
					else
					{
						order = $(this).attr("datastyle");
						me.scrolling(order,type,redid);
					}

					
				});
			});
			

		},
		//夺宝引导层
		userGuige:function()
		{
			var me =this;
			if(me.cookieSave(openid))
			{
				$(".rule-section").parent().removeClass("none");
				$(".rule-section").addClass("bounceInDown");
				$(".rule-section").on("webkitAnimationEnd", function () {
					$(".rule-section").removeClass("bounceInDown");
				
			     });
			}
			// 活动规则
			$(".rule-close").click(function()
			{
				$(".rule-section").addClass("bounceOutDown");
				$(".rule-section").on("webkitAnimationEnd", function () {
					$(".rule-section").removeClass("bounceOutDown");
					$(".modal").remove();
			     });
				
			});
		},
		
		// 调用是否中奖函数接口
		isLucker:function()
		{
			getResult("indianaPeriod/checkWin",{openid:openid,appId:busiAppId},"indianaPeriodCheckWinCallBackHandler",true)
		},
		
		//调用首页数据列表
		getDate:function()
		{
			getResult("indianaPeriod/index",{appId:busiAppId},"indianaPeriodIndexCallBackHandler",true)
		},
		goodsList:function(data,page)
		{
			var me = this;
			var t = simpleTpl();
			var length = data.length;
			var barP;
			var tempDate = data;
            var stringName = "";
            var goodsName="";
            var visible ="none";
            var cartClass="button-round";
			for(var i=0;i<length;i++)
			{   
				// 状态条
                barp = tempDate[i].qjc / tempDate[i].qjp * 100;
    			
    			// 是否倒计时
    			if(barp==100)
    			{
    				stringName="马上揭晓";
    				cartClass = "tt-goods-particle";
    			}
    			else{
					stringName="";
					cartClass = "button-round btn-addCart";
    			};
    			
                if(barp < 50)
    			{
    				barp = Math.ceil(barp);
    			};
    			if(tempDate[i].syflag)
    			{
    				visible="visible";
    			}
    			else
    			{
    				visible="none";
    			}

    			// 名字大于30个字符则截取
    			if((tempDate[i].qpq+tempDate[i].ppn).toString().length>=30)
    			{
    				goodsName=tempDate[i].ppn.toString().substring(0,29)+"..."
    			}
    			else
    			{
    				goodsName=tempDate[i].ppn;
    			}

				t._('<li class="grey-click-bg">')
				._('<div class="tt-goods" data-uuid="'+ tempDate[i].qid+'">')
				._('<div class="tt-goods-img">')
				._('<i class="ico ico-label ico-special '+visible + '" ></i>')
                ._('<img src="'+tempDate[i].psi +'" onerror="$(this).attr(\'src\',\'.\/images\/goods-snone.png\')">')
                ._('<div class="shine" data-collect="true" data-collect-desc="商品('+(goodsName?goodsName:"")+')"  data-collect-flag="'+(tempDate[i].proUuid?tempDate[i].proUuid:i)+'"></div>')
                ._('</div>')
                ._('<div class="tt-goods-infor" data-collect="true" data-collect-desc="商品('+(goodsName?goodsName:"")+')"  data-collect-flag="'+(tempDate[i].proUuid?tempDate[i].proUuid:i)+'">')
                ._('<p class="font13 txt-grey-main">(第' + tempDate[i].qpq +'期)  '+ (goodsName?goodsName:"") +'</p>')
                ._('<p class="bar"><span class="num-bar" style="width:'+barp+'%;">') 
                ._('<i class="color"></i></span>') 
                ._('</p>') 
                ._('<ul class="tt-txt-bottom txt-grey font12"><li class="num-needs"><p>总需'+tempDate[i].qjp + '人次</p></li><li class="num-leave"><p>剩余<b class="txt-blue">'+(tempDate[i].qjp-tempDate[i].qjc)+'</b></p></li></ul>') 
                ._('</div>')       
                ._('<div class="'+cartClass+' click-btn" id="tt-goods-particle" data-collect="true" data-collect-desc="商品('+(goodsName?goodsName:"")+')" data-collect-flag="'+ (tempDate[i].proUuid?tempDate[i].proUuid:i)+'">'+stringName+'</div>')    
                ._('</div>')
                ._('</div>')
                ._('</li>') 
			};
			$(".goods-list>ul").append(t.toString());

			// 根据参与状态,调整位置
			$(".tt-goods-particle").each(function()
			{
				$(this).prev().find("p.bar").css("margin-right",$(this).width()+15);
				$(this).prev().find(".tt-txt-bottom").css("margin-right",$(this).width()+15);
			});

		    footerPosition();
			//参与
			$(".tt-goods-particle").on("click",function(e)
		  	{
		  		e.stopPropagation();
		  		if($(this).text()=="")
		  		{
		  			var goods_id = $(this).closest(".tt-goods").attr("data-uuid");
				    //toUrl("./html/goods/goodsbuy.html?goods_id=" + goods_id);
		  		}
		  		else
		  		{
		  			var goods_id = $(this).closest(".tt-goods").attr("data-uuid");
				    toUrl("./html/goods/goodsview.html?goods_id=" + goods_id);
		  		}
			});
			//图片详情特效
			$(".tt-goods").delegate(".shine","click",function()
			{
				$(this).css("background-position","-99px 0"); 
                $(this).animate({backgroundPosition: '99px 0'},500);
				 var goods_id = $(this).closest(".tt-goods").attr("data-uuid");
				     toUrl("./html/goods/goodsview.html?goods_id=" + goods_id);
			});
			//图片详情特效
			// $(".tt-goods-infor").on("click",function()
			// {
			// 	$(this).prev().find(".shine").css("background-position","-99px 0"); 
   //              $(this).prev().find(".shine").animate({backgroundPosition: '99px 0'},500);
			// 	 var goods_id = $(this).closest(".tt-goods").attr("data-uuid");
			// 	     toUrl("./html/goods/goodsview.html?goods_id=" + goods_id);
			// });
			//图片详情特效
			$(".tt-goods").on("click",function(e)
			{
				if(e.target.className.match("btn-addCart")=="btn-addCart")
				{
					return;
				};
				$(this).find(".shine").css("background-position","-99px 0"); 
                $(this).find(".shine").animate({backgroundPosition: '99px 0'},500);
				 var goods_id = $(this).attr("data-uuid");
				     toUrl("./html/goods/goodsview.html?goods_id=" + goods_id);
			});

			
		},
		// 中奖者弹层
		luckCheck:function(data)
		{
			var me = this;
			var isLucker =true;
			data={tt:"恭喜您获奖了，请及时确认收货地址，以便商品发放！"}
			if(isLucker)
			{
				var t = simpleTpl();
				t._('<section class="modal">')
				 ._('<div class="lucker-section bounceInDown">')
				 ._('<div class="con">')
				 ._('<h1><img src="./images/lucker-tips.png"></h1>')
				 ._('<p class="con-tt">'+data.tt+'</p>')
				 ._('<div class="con-tab">')
				 ._('<a href="javascript:void(0)" data-collect="true" class="duobao-close click-btn"  data-collect-flag="tt-duobao-lucker-close" ')
				 ._(' data-collect-desc="天天夺宝-中奖-知道了" id="duobao-close">')
				 ._('知道了')
				 ._('</a>')
				 ._(' <a href="javascript:void(0)" data-collect="true" class="confirm-now click-btn" ')
				 ._(' data-collect-flag="tt-duobao-confirm-now"')
				 ._(' data-collect-desc="天天夺宝-立即确认" id="confirm-now">')
				 ._(' 立即确认')
				 ._(' </a>') 
				 ._(' </div>') 
				 ._(' </div>')
				 ._(' </div>')
				 ._(' </section>') 
				 $("body").append(t.toString()); 
				 me.relocate();
			}
			else
			{

			}
		},
		event:function()
		{
			// 全部尚品
			$(".all-goods").click(function()
			{
				// $(".user-center").removeClass("focus");
				// $(".show-prize").removeClass("focus");
				// $(this).addClass("focus");
				toUrl("allgoods.html");
			});

			// 全部尚品
			$(".index-goods").click(function()
			{
				$(".fix-tab-div a").removeClass("focus");
				$(this).addClass("focus");
				toUrl("index.html?differ");
			});

			// 晒单
			$(".show-prize").click(function()
			{
				$(".user-center").removeClass("focus");
				$(".all-goods").removeClass("focus");
				$(this).addClass("focus");
				toUrl("./html/goods/goodsshare.html");
			});
			// 个人中心
			$(".user-center").click(function()
			{
				$(".show-prize").removeClass("focus");
				$(".all-goods").removeClass("focus");
				$(this).addClass("focus");
				toUrl("./html/user/personcenter.html");
			});
            
            // 活动规则
			$(".footer-bar").click(function()
			{
				
				location.href="./html/goods/goodsrule.html";
			});
            

			// 中奖弹层关闭
			$("body").delegate(".duobao-close","click",function()
			{
				$(".lucker-section").removeClass("bounceInDown");
				$(".lucker-section").addClass("bounceOutDown");
				$(".lucker-section").on("webkitAnimationEnd", function () {
					$(".lucker-section").parent().remove();
			     });
			});
			// 中奖弹层前往
			$("body").delegate(".confirm-now","click",function()
			{
				$(".lucker-section").removeClass("bounceInDown");
				$(".lucker-section").addClass("bounceOutDown");
				$(".lucker-section").on("webkitAnimationEnd", function () {
					$(".lucker-section").parent().remove();
					toUrl("./html/user/prizelist.html");
			     });
				
			});

		},
		// 设置弹层的高度
        relocate:function(){
        	var height = $(window).height(), width = $(window).width();
        	var modalH = $('.lucker-section').height();
            $('.lucker-section').css({
				'margin-top': (height-modalH)/2,
			});
        },
        scrolling:function(order,type,redid)
        {
        	getList(true,order,type,redid);
			page ++;

			var range = 180, //距下边界长度/单位px
				maxpage = 100, //设置加载最多次数
				totalheight = 0;
				lastlength = 0;
				loadmore = true;
			$(".goods-list>ul").empty();
			$('.loading-space').addClass('none');
			$(window).scroll(function(){
				var srollPos = $(window).scrollTop();
				totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
				if(($(document).height() - range) <= totalheight  && page < maxpage && loadmore) {
				   if ($('.loading-space').hasClass('none')) {
						console.log($('.loading-space').hasClass('none'));
						return;
					}
					type = $(".btn-allgoods").attr("liststyle");
					order = $(".btn-popular-list li.selected").attr("datastyle");
					getList(true,(order?order:"0"),type,redid);
					page ++;
					$('.loading-space').addClass('none');
				}
			});
        },
        cookieSave: function(data) {
            if($.fn.cookie(data))
             {
                 return false;

             }
             else
             {
                var exp = new Date();
                exp.setTime(exp.getTime() + 60 * 1000 *60*24*30*12);
                $.fn.cookie(data, 1, {
                    expires: exp
                });
                return true;
            }
        }
	};

	W.getList = function(showloading,order,type,redid) {

		getResult("indianaPeriod/indexnew",{appId:busiAppId,page:page,pageSize:pageSize,order:order,type:type,redId:redid},"indianaPeriodIndexCallBackHandler",true)
    }
    W.indianaPeriodIndexCallBackHandler = function (data) 
    {
    	$('.loading-space').removeClass('none');
		if (data.result) {
			var items = data.items || [],
				len = items.length,
				t = simpleTpl();
				lastlength = len;
			if(len < pageSize)
			{
				loadmore = false;
				$('.loading-space').html(' --已到达列表底部--');
			}
			else{
				$('.loading-space').html(' --上拉显示更多--');
			}
			H.index.goodsList(data.items,page-1);

		} else {
			if(lastlength == pageSize)
			{
				loadmore = false;
				$('.loading-space').html(' --已到达列表底部--');
			}
			else
			{
				footerPosition();
				$('.loading-space').html(' --目前没有商品--');
			}
			
		}

	}

	W.indianaPeriodCheckWinCallBackHandler=function(data)
	{
		if(data.result)
		{
			H.index.luckCheck();
		}
	};
	//底部位置
	W.footerPosition = function()
	{
			var height=0;
			height = $(".goods-list").height()+170;
			if(height >=$(window).height())
			{
				$(".footer-bar").css({"position":"relative","bottom":"auto"})
			}
			else
			{
				$(".footer-bar").css({"position":"absolute;","bottom":"0"})
			}

	}
})(Zepto);

$(function() {
	H.index.init();
});