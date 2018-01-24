(function($) {
	// 弹幕_S
	H.praise = {
		timer: 5000,
		maxid: 0,
		pageSize: 50,
		tid: '',
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		REQUEST_CLS: 'narrow',
		$header: $('header'),
		$wrapper: $('article'),
		$comments: $('#comments'),
		jumpUrl: null,
		puid: null,
		uid: null,
		expires_in: { expires: 1 },
		init: function() {
			var me = this;
			me.$inputCmt.addClass('error').removeClass('error');
			me.resize();
			W['barrage'] = this.$comments.barrage();
			W['barrage'].start(1);
			setInterval(function() {
				me.flash();
			}, me.timer);
			me.event();
			me.round();
			me.dayPV();
			setInterval(function(){
				me.dayPV();
			},5000);
			getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
		},
		resize: function() {
			var height = $(window).height();
			this.$header.css('height', Math.round(height * 0.50));
			this.$wrapper.css('height', Math.round(height * 0.5-55));
			this.$comments.css('height', Math.round(height * 0.5 - 55));
			$('body').css('height', height);
		},
		event: function() {
			var me = this;
			$("#lottery").click(function(){
				$(this).addClass("pulse");
				toUrl("lottery.html");
			});
			$(".tttj").click(function(){
				shownewLoading(null, '请稍后...');
				location.href = me.jumpUrl;
			});
			$("#rule").click(function(e){
				e.preventDefault();
				$(this).addClass("pulse");
				getResult('common/rule', {}, 'callbackRuleHandler', true);
			});
			$("#praise").click(function(){
				if(!$(this).hasClass("praised")){
					getResult('api/sign/signed', {
						yoi: openid,
						auid: me.uid
					}, 'callbackSignSignedHandler',true);
					// 签到成功
					$("#praise").addClass("praised");
					$("#praise-num").text($("#praise-num").text()*1 + 1);
					$("#plus").addClass("zaned");
				}
			});
			$("#touzi").click(function(){
				$(this).addClass("pulse");
				toUrl(register_url);
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
					url : domain_url + 'api/comments/save?'+dev,
					data: {
						co: encodeURIComponent(comment),
						op: openid,
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
						setTimeout(function(){
							me.$btnCmt.removeClass(me.REQUEST_CLS);
						},1000);
						if (data.code == 0) {
							showTips('发射成功', null, 800);
							barrage.appendMsg(comment);
							me.$inputCmt.removeClass('error').val('');
						}
					}
				});

			});
		},
		dayPV: function(){
			getResult('api/common/servicedaypv', {}, 'commonApiSDPVHander');
		},
		round: function(){
			getResult('api/sign/round', {}, 'callbackSignRoundHandler',true);
		},
		isSign: function(){
			var me = this;
			var signCookie =  $.fn.cookie(me.uid + '_sign');
			if(signCookie && signCookie == "signed"){
				// 已经签过到
				// 判断是否到抽奖时间
				$("#praise").addClass("praised");
			}else{
				// 调用接口判断是否签过到
				getResult('api/sign/issign', {
					yoi: openid,
					auid: me.uid
				}, 'callbackSignIsHandler', true);
			}
		},
		flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + "api/comments/room" + dev + "&temp=" + new Date().getTime(),
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
	                if (data.code == 0) {
	                    me.maxid = data.maxid;
	                     var items = data.items || [];
	                    for (var i = 0, len = items.length; i < len; i++) {
							barrage.pushMsg(items[i].co);
	                    }
	                }
                }
            });
        }
	};
	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			H.praise.jumpUrl = data.url;
			$(".tttj").removeClass("none");
		}else{
			$(".tttj").addClass("none");
		}
	};
	W.callbackSignRoundHandler = function(data){
		if(data.code == 0){
			H.praise.puid = data.puid;
			if(data.items && data.items.length > 0){
				var currentTime = timeTransform(data.cud*1);
				for(var i = 0;i < data.items.length;i ++){
					var item = data.items[i];
					if(comptime(currentTime,item.st) <= 0 && comptime(currentTime,item.et) >= 0){
						H.praise.uid = data.items[i].uid;
						H.praise.isSign();
					}
				}
			}
		}
	};
	W.callbackSignIsHandler = function(data){
		if(data.result){
			//已经签到
			$("#praise").addClass("praised");
			$.fn.cookie(H.praise.uid + '_sign',"signed", H.praise.expires_in);
		}
	};
	W.callbackSignSignedHandler = function(data){
		if(data.code == 0){
			$.fn.cookie(H.praise.uid + '_sign',"signed", H.praise.expires_in);
		}
	};
	W.commonApiSDPVHander = function(data){
		if(data.code == 0){
			var dayPV = 17000 + data.c*1;
			if(dayPV > $("#praise-num").text()*1){
				$("#praise-num").text(dayPV);
			}
		}
	};
	W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			setTimeout(function(){
				H.dialog.rule.open(data.rule);
				$(this).removeClass("pulse");
			},1000);
		}
	};
})(Zepto);

$(function() {
	H.praise.init();
});