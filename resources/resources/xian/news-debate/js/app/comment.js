$(function(){

	(function($) {
		
		H.comment = {
			loadCommentCount: 0,
			unread: 0,
			commentList: $("#comment_list"),
			submit: $("#input_submit"),
			input: $("#input_text"),
			newTips: $("#new_tips"),
			submitTips: $("#submit_tips"),
			loading: $("#comment_loading"),
			maxid: 0,
			minid: 0,
			lastMinid: 0,
			init: function() {
				H.utils.resize();
				showLoading();
				this.initBtns();
				getResult('comments/debate',{
					'anys' : $.fn.cookie("anys"),
					'maxid' : this.maxid,
				}, 'callbackCommentsDebate');
				
				var defaultPoint = $.fn.cookie("defaultPoint");
				$.fn.cookie("reddot_debate_" + defaultPoint, "true");
			},
			
			initCommentList: function(data, direction){
				if(data.code == 0){
					// 有数据返回
					this.loadCommentCount ++;
					
					this.maxid = data.maxid > this.maxid ? data.maxid : this.maxid ;
					this.lastMinid = this.minid;
					this.minid = this.minid == 0 || data.minid < this.minid ? data.minid : this.minid ;
					
					var comments = "";
					var currentScroll = H.comment.commentList.height() - $("body")[0].scrollTop - $(window).height();
					var myPoint = $.fn.cookie("myPoint");
					var defaultPoint = $.fn.cookie("defaultPoint");
					for(var i in data.items){
						var color = $.fn.cookie("point_" + data.items[i].tid + "_color");
						if(!color){
							color = "";
						}
						var name = $.fn.cookie("point_" + data.items[i].tid + "_name");
						if(!name){
							name = "中立";
						}
						comments += '<li id="comment_'+data.items[i].id+'" class="all comment-list-item C'+ color +' ">'
									+ '<p class="comment-username">'+data.items[i].na+'<span class="point-tips">' 
									+ '（'+name+'）'
									+'</span></p>'
									+ '<section class="comment-bubble">'
										+ '<p class="detail-all">'+data.items[i].co+'</p>'
										+ '<i class="comment-arrow"></i>'
									+ '</section>'
								+ '</li>';
					}
					if(direction == "append"){
						this.commentList.append(comments);
					}else{
						this.loading.after(comments);
						setTimeout(function(){
							$("body")[0].scrollTop = $("#comment_" + H.comment.lastMinid).offset().top - 45;
						},10);
					}
					
					this.loading.removeClass('none');
					
					if(direction == "append"){
						if(this.loadCommentCount == 1){
							if(!openid || !$.fn.cookie(shaketv_appid + '_nickname')){
								// 如果没有openid或者nickname，会弹出框。弹出框时则不自动滚底部，否则会出现弹出层无法点击问题
								// 并且禁滚动
								$("body").bind("touchmove",function(){
									return false;
								});
							}else{
								
								// 第一次加载直接定位到底部
								setTimeout(function(){
									$("body")[0].scrollTop = H.comment.commentList.height();
								},100);
							}
						}else{
							// 以后加载提醒新信息
							if(currentScroll > 100){
								this.unread += data.items.length
								this.newTips.text(this.unread + "条新讨论").addClass("show");
							}
						}
					}
				}
				setTimeout(function(){
					getResult('comments/debate',{
						'anys' : $.fn.cookie("anys"),
						'maxid' : H.comment.maxid,
					}, 'callbackCommentsDebate');
				},5000);
			},
			
			initPerviousComment: function(data){
				if(data.code == 0){
					// 有数据返回
					data.items.reverse();
					this.initCommentList(data, "prepend");
					this.loading.removeClass("disabled");
				}else{
					// 没有更多历史记录了
					this.loading.text("没有更多历史记录了");
				}
				
			},
			
			initBtns: function(){
				this.submit.click(function(){
					if($.trim(H.comment.input.val()).length == 0){
						return false;
					}else if($.trim(H.comment.input.val()).length > 100){
						alert("评论字数不能超过100个字哦");
						return false;
					}

					showLoading();
					getResult('comments/save',{
						'co' : encodeURIComponent(H.comment.input.val()),
						'op' : openid,
						'nickname': ($.fn.cookie(shaketv_appid + '_nickname') && $.fn.cookie(shaketv_appid + '_nickname') != "null") ? encodeURIComponent($.fn.cookie(shaketv_appid + '_nickname')) : "",
						'headimgurl': ($.fn.cookie(shaketv_appid + '_headimgurl') && $.fn.cookie(shaketv_appid + '_headimgurl') != "null") ? $.fn.cookie(shaketv_appid + '_headimgurl') : "",
						'tid': $.fn.cookie("myPoint") ? $.fn.cookie("myPoint") : $.fn.cookie("defaultPoint") ,
						'ty': 4,
						'pa':'',
						'ns':'',
						'na':1
					}, 'callbackCommentsSave');

					
				});
				
				$(window).scroll(function(){
					if(H.comment.commentList.height() - $(window).scrollTop() - $(window).height() < 100){
						H.comment.unread = 0;
						H.comment.newTips.removeClass("show")
					}else if( $(window).scrollTop() <= 20 && !H.comment.loading.hasClass("disabled") ){
						H.comment.loading.addClass("disabled").text("加载中");
						getResult('comments/pervious',{
							'anys' : $.fn.cookie("anys"),
							'op': openid,
							'minid': H.comment.minid
						}, 'callbackCommentsPervious');
					}
			    });
				
				this.newTips.click(function(){
					if($(this).hasClass("show")){
						$("body")[0].scrollTop = H.comment.commentList.height();
					}
				});


				this.input.focus(function(){
					$("footer").css("position","absolute");
				});

				this.input.blur(function(){
					$("footer").css("position","fixed");
				});
			},
			
			afterSubmit: function(){
				this.input.val("");
				this.submitTips.removeClass("show");
				setTimeout(function(){
					H.comment.submitTips.addClass("show");
				},0);
			}
		}
		
		H.utils = {
			wrapper: $(".wrapper"),
			resize: function() {
				var height = $(window).height();
				this.wrapper.css("min-height",height).removeClass("none");
			}
		};
		
		W.callbackCommentsDebate = function(data){
			hideLoading();
			H.comment.initCommentList(data, "append");
		}
		
		W.callbackCommentsSave = function(data){
			if(data.code == 0){
				hideLoading();
				H.comment.afterSubmit();
			}else{
				alert(data.message);
			}
		}
		
		W.callbackCommentsPervious = function(data){
			H.comment.initPerviousComment(data);
		}
	})(Zepto);
	
	H.comment.init();
});

