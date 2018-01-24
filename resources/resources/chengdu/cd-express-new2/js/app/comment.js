(function($) {
	H.talk = {
		tid: '',
		$article: $('#article'),
		$question: $('#question'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		$btnRule: $('#btn-rule'),
		$nav_left: $('#nav-left'),
		$total: $('#count'),
		REQUEST_CLS: 'requesting',
		PVTime: Math.ceil(4000 * Math.random()),
		init: function() {
			if (!openid) {
				return false;
			};
			getResult('api/article/list', {}, 'callbackArticledetailListHandler');
			H.utils.resize();
			H.talk.eventHandle();
			H.comment.init();
			//this.account_num();
            //setInterval(function() {
            //    H.talk.account_num();
            //}, this.PVTime);
		},
		account_num: function(){
		    getResult('log/serpv ', {}, 'callbackCountServicePvHander');
		},
		eventHandle:function()
		{
			var me = this;
            $("#rule-dialog").click(function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            });
            $("#list").click(function(e) {
                e.preventDefault();
                H.dialog.list.init();
            });
			$('.nav-left').click(function(e) {
				e.preventDefault();
				toUrl('yaoyiyao.html');
			});
            $(".wrap-game").click(function(){
                $(this).find(".game-join").addClass("heartpop");
                $(this).find(".game-join").removeClass("heart");
                $(this).find(".game-join").on("webkitAnimationEnd",function()
                {
                     location.href="http://www.kxtui.cn/g/i.jsp?idcm=327869&tidus=76512400&from=singlemessage&isappinstalled=0"; 
                })
               
            })
			this.$btnCmt.click(function(e) {
				e.preventDefault();
				
				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				}
				var comment = $.trim(me.$inputCmt.val()) || '',
					comment = comment.replace(/<[^>]+>/g, ''),
					len = comment.length;
					
				if (len < 1) {
					showTips('请先说点什么吧');
					me.$inputCmt.removeClass('error').addClass('error');
                    setTimeout(function()
                    {
                        me.$inputCmt.removeClass('error');
                    },1500)
					return;
				} else if (len > 20) {
					showTips('观点字数超出了20字');
					me.$inputCmt.removeClass('error').addClass('error');
                    setTimeout(function()
                    {
                        me.$inputCmt.removeClass('error');
                    },1500)
					return;
				}
				
				$(this).addClass(me.REQUEST_CLS);

				shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                        	showTips('发射成功', null, 800);
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
                            barrage.appendMsg('<div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div>'+comment);
                            $('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                    }
                });
				
			});	
		}
	};
	// 弹幕_S
	H.comment = {
		timer: 5000,
		maxid: 0,
		pageSize: 50,
		$comments: $('#comments'),	
		init: function() {
			var me = this;
			W['barrage'] = this.$comments.barrage();
			W['barrage'].start(1);
			setInterval(function() {
				me.flash();
			}, me.timer);
		},
		flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + "api/comments/room?temp=" + new Date().getTime(),
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
	                if (data.code == 0) {
	                    me.maxid = data.maxid;
	                     var items = data.items || [], umoReg = '/:';
	                    for (var i = 0, len = items.length; i < len; i++) {
	                    	if ((items[i].co).indexOf(umoReg) >= 0) {
	                    		var funny = items[i].co;
	                    		var nfunny = funny.replace('/:','');
				                barrage.appendMsg('<div class="c_head_img"><img src="' + (items[i].hu ? (items[i].hu + "/" + yao_avatar_size) : "./images/danmu-head.jpg") + '" /></div>'+'<img class="funnyimg" src="./images/funny/' + nfunny + '.png" border="0" />');
	                    	}else{
	                    		var hmode = "<div class='c_head_img'><img src='./images/danmu-head.jpg' class='c_head_img_img' /></div>";
		                        if (items[i].hu) {
		                            hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img' /></div>";
		                        }
		                        if (i < 5) {
		                            $.fn.cookie('default_comment' + i, hmode + items[i].co, expires_in);
		                        }
		                        barrage.pushMsg(hmode + items[i].co);
	                    	}
	                       
	                    }
	                } else {
	                	return;
	                }
                }
            });
        }
	};
	// 弹幕_E
	
	H.utils = {
		$header: $('header'),
		$wrapper: $('article'),
		$comments: $('#comments'),
		resize: function() {
			var height = $(window).height();
			var headerH = 120;
			var headerC = height - headerH;
			this.$header.css('height', Math.round(headerH));
			this.$wrapper.css('height', Math.round(headerC));
			this.$comments.css('height', Math.round(headerC-110));
			$('body').css('height', height);
		}	
	};

	W.callbackCountServicePvHander = function(data) {
		if (data.code == 0) {
			H.talk.$total.removeClass("none");
			H.talk.$total.text("在线人数：  "+data.c);
		}
	};

	W.callbackArticledetailListHandler = function(data){
		if(data == undefined){

		}else{
			if(data.code == 0){
				hidenewLoading();
				$(".btn").before('<img class="top-ad" src="' + (data.arts[2].img?data.arts[2].img:"images/tv-info.png").toString() + '" />');
				$(".top-ad").on("click", function () {
					window.location.href = data.arts[2].gu;
				});
			}else if(data.code == 1){
				//if(H.talk.isask == false){
				//	getResult('api/article/list', {}, 'callbackArticledetailListHandler');
				//	H.talk.isask = true;
				//}else{
				//	hidenewLoading();
				//}
			}
		}
	};

	//天天淘金的广告链接
	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			jumpUrl = data.url;
			$(".outer").attr("href",jumpUrl).html(data.desc).removeClass("none");
		}else{
			$(".outer").addClass("none");
		}
	};
})(Zepto);

$(function() {
	H.talk.init();
});