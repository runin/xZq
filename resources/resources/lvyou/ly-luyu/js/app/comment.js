(function(){
	// 弹幕_S
	H.send = 
	{   
		$comments: $('#comments'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		REQUEST_CLS: 'requesting',
		allRecordTime: Math.ceil(4000*Math.random() + 10000),
		init: function() {
			var me = this;
			var width = $(window).width();
			var height = $(window).height();
			
			$("header").height(height*0.15);
			me.$comments.css('width', width);
			me.$comments.css('height', height*0.85-100);
			$(".container").width(width);
			$(".container").height(height);
			$(".head_img").attr("src",headimgurl||"images/danmu-head.jpg")
			H.comment.init();
			me.event();
			setInterval(function(){
                H.send.account_num();
            }, H.send.allRecordTime);
		},
		   //查询当前参与人数
        account_num: function(){
		       getResult('api/common/servicepv ', {}, 'commonApiSPVHander');
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
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/danmu-head.jpg';
                            barrage.appendMsg('<div class="cor"><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-cor">'+comment+'</div></div>');
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
	                    	var hmode = "<div class='c_head_img'><img src='./images/danmu-head.jpg' class='c_head_img_img' /></div>";
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
	W.commonApiSPVHander = function(data){
		if(data.code == 0){
			var num = String(data.c);
			var t = "";
			for(var i = 0;i< num.length;i++){
			   t = t + "<label>"+num[i]+"</label>";
			}
			$(".count span").html(t);
			$(".count").removeClass("hidden");
		}
	};
})(Zepto);

$(function()
{
	H.send.init();
});