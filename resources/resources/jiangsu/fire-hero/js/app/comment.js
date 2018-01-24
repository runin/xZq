(function(){
	// 弹幕_S
	H.send =
	{
		$comments: $('#marqueen'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		REQUEST_CLS: 'requesting',
		allRecordTime: Math.ceil(4000*Math.random() + 10000),
		init: function() {
			var me = this;
			me.resize();
			me.event();
			H.comment.init();
		},
		resize: function(){
			var me = this;
			var width = $(window).width();
			var height = $(window).height();

			me.$comments.css({
				'width': width*0.42,
				'height': height*0.35
			});
			$(".head_img").attr("src",headimgurl||"images/avatar.png")
		},
		event: function() {
			var me = this;
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

				/*shownewLoading(null,'发射中...');*/
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
                        /*hidenewLoading();*/
                    },
                    success : function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                        	showTips('发射成功');
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/avatar.png';
							me.$comments.find("ul li:first").before('<li><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-cor">'+comment+'</div></li>');
                            $('.isme').parent().parent('div').addClass('me');
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
		$comments: $('#marqueen'),
		flag: true,
		init: function() {
			var me = this;
			me.spellDom(msg);
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
						var domAttr = [];
	                    for (var i = 0, len = items.length; i < len; i++) {
	                    	var hmode = "<div class='c_head_img'><img src='./images/avatar.png' class='c_head_img_img' /></div>";
		                    if (items[i].hu) {
		                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img' /></div>";
		                    }
							domAttr.push(hmode + '<div class="comment">'+ items[i].co +'</div>');
						}
						me.spellDom(domAttr);
	                } else {
	                	return;
	                }
                }
            });
        },
		spellDom: function(msg){
			var t = simpleTpl(),me = this;
			$.each(msg, function(i, items){
				t._('<li>'+items+'</li>');
			});
			me.$comments.find("ul").append(t.toString());
			if(me.flag){
				if(W.screen.width == 360){
					$("#marqueen").marqueen({
						mode: "top",	//滚动模式，top是向上滚动，left是朝左滚动
						container: "#marqueen ul",	//包含的容器
						row: 5,	//滚动行数
						speed: 20	//轮播速度，单位ms
					});
				}else{
					$("#marqueen").marqueen({
						mode: "top",	//滚动模式，top是向上滚动，left是朝左滚动
						container: "#marqueen ul",	//包含的容器
						row: 5,	//滚动行数
						speed: 25	//轮播速度，单位ms
					});
				}
				me.flag = false;
			}


		}
	};
})(Zepto);

$(function(){
	H.send.init();
});

var msg =
	[
		"<div class='c_head_img'><img src='./images/head/0q.jpg' class='c_head_img_img' /></div><div class='comment'>1加油！加油！中国选手最棒！</div>",
		"<div class='c_head_img'><img src='./images/head/1q.jpg' class='c_head_img_img' /></div><div class='comment'>2打的人热血沸腾啊</div>",
		"<div class='c_head_img'><img src='./images/head/3q.jpg' class='c_head_img_img' /></div><div class='comment'>3简直太帅了</div>",
		"<div class='c_head_img'><img src='./images/head/4q.jpg' class='c_head_img_img' /></div><div class='comment'>4最喜欢有腹肌的男人</div>",
		"<div class='c_head_img'><img src='./images/head/5q.jpg' class='c_head_img_img' /></div><div class='comment'>5节目好好看啊</div>",
		"<div class='c_head_img'><img src='./images/head/6q.jpg' class='c_head_img_img' /></div><div class='comment'>6怎么练腹肌，教我！教我！</div>",
		"<div class='c_head_img'><img src='./images/head/7q.jpg' class='c_head_img_img' /></div><div class='comment'>7河南卫视的节目太棒了</div>",
		"<div class='c_head_img'><img src='./images/head/8q.jpg' class='c_head_img_img' /></div><div class='comment'>8身材都太好了，赞！</div>",
		"<div class='c_head_img'><img src='./images/head/9q.jpg' class='c_head_img_img' /></div><div class='comment'>9选手们都很棒，32个赞</div>"
	];