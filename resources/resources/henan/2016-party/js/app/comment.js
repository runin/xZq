(function(){
	// 弹幕_S
	H.send = 
	{   
		$comments: $('#comments'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		REQUEST_CLS: 'requesting',
		init: function() {
			var me = this;
			me.resize();
			H.comment.init();
			me.event();
		},
		resize: function(){
			var me = this;
			var width = $(window).width();
			var height = $(window).height();
			if(W.screen.height === 480){
				$("header").height(height*0.42);
				$('#article').css('height', height*0.10);
				me.$comments.css({
					'width': width,
					'height': height*0.48
				});
			}else{
				$("header").height(height*0.35);
				$('#article').css('height', height*0.08);
				me.$comments.css({
					'width': width,
					'height': height*0.55
				});
			}

			$(".container").css({
				'width': width,
				'height': height
			});
			$('.header-nav:first-child div:first-child,.header-nav:first-child div:nth-child(2),.header-nav:first-child div:nth-child(3)').addClass("selected");
			setTimeout(function(){
				$('.header-nav:first-child div:first-child,.header-nav:first-child div:nth-child(2),.header-nav:first-child div:nth-child(3)').removeClass("selected");
			},3000);
		},
		btn_animate: function(str,calback){
			str.addClass('flipInY');
			setTimeout(function(){
				str.removeClass('flipInY');
			},150);
		},
		event: function() {
			var me = this;
			$('.header-nav:first-child div:first-child,.header-nav:nth-child(2) div:first-child').tap(function(e){
				e.preventDefault();
				me.btn_animate($(this));
				$(this).removeClass("selected");
				toUrl("card.html");
			});

			$('.header-nav:first-child div:nth-child(2),.header-nav:nth-child(2) div:nth-child(2)').tap(function(e){
				e.preventDefault();
				me.btn_animate($(this));
				$(this).removeClass("selected");
				toUrl("lottery.html");
			});

			$('.header-nav:first-child div:nth-child(3),.header-nav:nth-child(2) div:nth-child(3)').tap(function(e){
				e.preventDefault();
				me.btn_animate($(this));
				$(this).removeClass("selected");
				toUrl("vote.html");
			});

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
					return;
				} else if (len > 20) {
					showTips('观点字数超出了20字');
					me.$inputCmt.removeClass('error').addClass('error');
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
                        tid:null,
                        ty: 2,
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
                        	showTips('发射成功');
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/avatar.png';
                            barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-cor">'+comment+'</div></div>');
                            $('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                        showTips("评论失败");
                    }
                });
				
			});
	     }
	};
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
                url : domain_url + "api/comments/room"+dev,
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
	                    	var hmode = "<div class='c_head_img'><img src='./images/avatar.png' class='c_head_img_img' /></div>";
		                    if (items[i].hu) {
		                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img' /></div>";
		                    }
		                    barrage.pushMsg(hmode + items[i].co); 
	                    }
	                } else {
	                	return;
	                }
                }
            });
        }
	};
})(Zepto);

$(function()
{
	H.send.init();
});