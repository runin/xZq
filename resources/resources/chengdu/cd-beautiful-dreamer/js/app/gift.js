(function($){
	H.gift = {
		page : 1,
		pageSize : 2,
		time : 0,
		loadmore : true,
		first : true,
		store : getQueryString('store'),
		init : function(){
			this.getList();
			this.page ++;
			this.event();
			this.scroll();
		},
		event : function(){
            var $gift_icon = $('.gift-icon'),
                gift_icon = '.gift-icon',
                gift_selected = 'gift-selected';
			$(".btn-red").click(function(e){console.log(1);
				e.preventDefault();
				toUrl("index.html");
			});
			$('.gift-content').click(function(e){
				e.preventDefault();
				$(this).parent().siblings('li').find(gift_icon).removeClass(gift_selected);
				$(this).siblings(gift_icon).addClass('gift-selected');
				$.fn.cookie("src-"+ openid, $(this).find('img').attr('src'),{expires:1});

			});
            $gift_icon.click(function(e){
				e.preventDefault();
                if($(this).hasClass(gift_selected)){
                    getResult('advertise/chosestore', {
                        openid : openid,
                        ruuid :$.fn.cookie("ruuid-"+ openid),
                        sid : $(this).attr('data-su')
                    }, 'advertiseChoseStoreHandler');
                }else{
                    $(this).parent().siblings('li').find(gift_icon).removeClass(gift_selected);
                    $(this).addClass(gift_selected);
                }
			});
		},
		scroll : function(){
			var range = 180, //距下边界长度/单位px
				maxpage = 100, //设置加载最多次数
				totalheight = 0;

			$(window).scroll(function(){
				var srollPos = $(window).scrollTop();
				totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
				if (($(document).height() - range) <= totalheight  && this.page < maxpage && this.loadmore) {
					if (!$('#mallSpinner').hasClass('none')) {
						console.log(!$('.mallSpinner').hasClass('none'));
						return;
					}
					$('#mallSpinner').removeClass('none');
					this.getList();
					this.page ++;
				}
			});
		},
		getList : function(){
			if(openid){
				$('#mallSpinner').addClass('none');
				if(!getQueryString('length') && this.first){

					$(".list").html("<p class='no-record'>您目前没有获奖记录</p>");
				}else{
					var t = simpleTpl(),
						/*list = $.fn.cookie("si" + i) || [],*/
						len = getQueryString('length');
					if (this.time == 0&&len == 0) {
						//window.location.href = 'gift_empty.html';
						return;
					} else if (len < this.pageSize) {
						loadmore = false;
					}
					for (var i = 0; i < len; i ++) {
						t._('<li>')
							._('<div class="gift-icon" data-stoppropagation="true" data-su="'+ $.fn.cookie("su-"+ openid + i) +'"></div>')
							._('<div class="gift-content">')
								._('<img src= "'+ $.fn.cookie("si-"+ openid + i) +'" />')
							._('</div>')
						._('</li>');
					}
					$('#gift-timeline').append(t.toString()).closest('.list').removeClass('none');

				}
				first = false;
				$('.btn-loadmore').addClass('none');
				this.time ++;
			}
		}
	};

	W.advertiseChoseStoreHandler = function(data){
		if(data.code == 0){
			toUrl('confirm.html');
		}
	}

})(Zepto);
$(function(){
	H.gift.init();
});