(function($) {
	H.barrage = {
		tid: '',
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		$total: $('#total'),
		$btnFunny: $('.funny-box img'),
		REQUEST_CLS: 'requesting',
		init: function() {
			this.loadImg();
			this.event();
		},
		loadImg: function(){
			var imgs = [
				"images/bg.jpg"
			];
			loadImg = function () {
				for (var i = 0; i < imgs.length; i++) {//图片预加载
					var img = new Image();
					img.style = "display:none";
					img.src = imgs[i];
					img.onload = function () {
						$("body").animate({'opacity':'1'}, 100);
					}
				}

			};
			loadImg();
            setTimeout(function(){
                H.utils.resize();
            },2000);

		},
		event: function() {
			var me = this;
			$("#rule").click(function (e) {
				H.dialog.rule.open();
			});
			$("#jfsc").click(function(e){
				e.preventDefault();
				toUrl("home.html");
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
					me.$inputCmt.focus();
					return;
				} else if (len > 90) {
					showTips('字数超出了100字');
					me.$inputCmt.focus();
					return;
				}

				$(this).addClass(me.REQUEST_CLS);

				shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'comments/save'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: null,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(shaketv_appid + '_nickname')) : "",
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
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
							barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="'+h+'" /></div><div class="comment">'+comment+'</div></div>');
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

	W.callbackCommentsTopicInfo = function(data){
		if(data.code == 0){
			var item = data.items[0];
			H.barrage.tid = item.uid;
		}
	};
	
	// 弹幕_S
	H.comment = {
		timer: 5000,
		maxid: 0,
		pageSize: 30,
		$comments: $('#comments'),
		icon: ["./images/icon-cake1.png", "./images/icon-ham.png", "./images/icon-cake2.png","./images/icon-bread.png"],
		init: function() {
			var me = this;
			W['barrage'] = this.$comments.barrage();
			setTimeout(function(){
				W['barrage'].start(1);
				setInterval(function() {
					me.flash();
				}, me.timer);
			}, 1000);
		},
		randIcon : function () {
			var me =this;
            return me.icon[Math.floor(Math.random() * me.icon.length)];
        },
		flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'comments/room'+dev,
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
                    if (data.code != 0) {
                        return;
                    }
                    me.maxid = data.maxid;
                    var items = data.items || [];
                    for (var i = 0, len = items.length; i < len; i ++) {
                        var headImg = items[i].hu ? items[i].hu + '/' + yao_avatar_size : './images/danmu-head.jpg';
                    	barrage.pushMsg("<div class='c_head_img'><img class='c_head_img_img' src='"+headImg+"'/></div><div class='comment'>"+items[i].co+"</div>");
                    }
                }
            });
        }
	};
	// 弹幕_E
	
	H.utils = {
		$wrapper: $('#article'),
		$comments: $('#comments'),
		resize: function() {
			var zwinH = $(window).height();
			this.$comments.css({
				'height': Math.round(zwinH* 0.8),
                'margin-top': Math.round(zwinH* 0.1)
			});
			this.$wrapper.css({
				'height': Math.round(zwinH* 0.8),
                'margin-top': Math.round(zwinH* 0.1)
			}).removeClass("none");

			$('body').css('height', zwinH);
            H.comment.init();
		}	
	};
	
})(Zepto);
$(function() {
	H.barrage.init();
});