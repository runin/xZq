(function($) {
	H.friend = {
		$more: $('.more'),
		maxpage: 100,
		showPage: 1,
		showPagesize: 10,
		loadmore: true,
		zanSelector: null,
		secondLoding: true,
		tid: '',
		top: 0,
		init: function() {
			var me = this;
			me.resize();
			me.user();
			me.topicslist();
			me.event();
		},
		user: function(){
			$("#headimgurl").attr("src", headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/avatar.png');
			$("#nickname").text(nickname || "匿名用户");
		},
		resize: function(){
			var winW = $(window).width(),
				winH = $(window).height();
			if(!is_android()){
				$('.main').css({
					"height": winH
				});
			}else{
				$('.main').css({
					"min-height": winH
				});
			}
		},
		//获取话题和评论、点赞信息
		topicslist: function(){
			var me = H.friend;
			getResult('api/friendcircle/topicslist', {
				page: me.showPage,
				ps: me.showPagesize
			}, 'callbackFriendcircleTopicslist', true);
			me.showPage++ ;
		},
		getJsonLength: function (jsonData){
			var jsonLength = 0;
			for(var item in jsonData){
				jsonLength++;
			}
			return jsonLength;
		},
		getIsVote: function (jsonData){
			var isVote = false;
			for(var item in jsonData){
				if(jsonData[item].oi == openid){
					isVote = true;
				}
			}
			return isVote;
		},
		fill: function(data) {
			var me = H.friend,
				t = simpleTpl(),
				current = data.items || [],
				currentLen = current.length,
				defaultImg = './images/avatar.png';
				for (var i = 0; i < currentLen; i ++) {
					t._('<div class="card" id="' + current[i].uid + '" data-uuid="' + current[i].uid + '" data-collect="true" data-collect-flag="hn-hyzm-friend-card-btn" data-collect-desc="点击话题卡片">')
						._('<div class="info">')
							._('<i class="rank"></i>')
							._('<span class="left nhead">')
								._('<img class="head" src="' + ( current[i].a ? ( current[i].a + '/' + yao_avatar_size ) : defaultImg ) + '" border="0" />')
							._('</span>')
							._('<span class="right name">' + ( current[i].p ? current[i].p : '匿名用户' ) + '</span>')
						._('</div>')
						._('<div class="content-box" data-uuid="' + current[i].uid + '">')
							._('<div class="images">');

							var imsList =current[i].ims.split(',');
							var imsLength = imsList.length;

						if(imsLength>1){
							t._('<div class="swiper-container" id="swiper-'+ current[i].uid +'">')
								._('<div class="swiper-wrapper">');
								for (var j = 0; j < imsLength; j++) {
									t._('<div class="swiper-slide"><img src="' + imsList[j] + '" border="0" /></div>')
								}
								t._('</div>')
								._('<div class="swiper-pagination" id="pagination-'+ current[i].uid +'"></div>')
							._('</div>')
						}else{
							t._('<img src="' + current[i].ims + '" border="0" />');
						}

							t._('</div>')
							._('<div class="text">' + current[i].t + '</div>')
						._('</div>')
						._('<div class="events">')
							._('<div class="sharebtn">')
								._('<img src="images/right.jpg" border="0" />')
								._('<span>评论</span>')
							._('</div>')
							._('<div class="zanbtn" data-uuid="' + current[i].uid + '" data-collect="true" data-collect-flag="hn-hyzm-friend-zan-btn" data-collect-desc="点赞按钮">')
								._('<i class="icon '+ me.getIsVote(current[i].tps) +'"></i>')
								._('<span class="number">' + me.getJsonLength(current[i].tps) + '</span>')
							._('</div>')
						._('</div>')

						._('<div class="commonts" id="commonts-'+ current[i].uid +'">')
							._('<ul>');
							var comm = current[i].comments || [],
								commLen = comm.length;
							for (var j = 0; j < commLen; j ++) {
								t._('<li data-tuuid = "' + comm[j].uid + '">')
									/*._('<div class="nhead fl-l">')
										._('<img src="' + ( comm[j].hu ? ( comm[j].hu + '/' + yao_avatar_size ) : defaultImg ) + '" border="0" />')
									._('</div>')*/
									._('<span class="commont-name">' + ( comm[j].na ? comm[j].na : '匿名用户' ) + '</span>')
									._('<span>:</span>')
									._('<span class="commont-text">' + comm[j].co + '</span>')
								._('</li>')
							}
							t._('</ul>')
						._('</div>')

						._('<div class="gd none"><a class="show-all" id="show-all'+ current[i].uid +'" data-collect="true" data-collect-flag="hn-hyzm-friend-show" data-collect-desc="评论收缩显示" >﹀展开评论</a></div>')
					._('</div>')
				};
			$('.cards').append(t.toString());
			for (var i = 0, len = currentLen; i < len; i++) {
				me.is_show(current[i].uid);
				me.swiperInit("#swiper-"+ current[i].uid, "#pagination-"+ current[i].uid);
			}
			me.is_show();
			/*this.scroll({speed:40,rowHeight:40});*/
		},
		swiperInit: function(className, pagName){
			var swiper = new Swiper(className, {
				pagination: pagName,
				paginationClickable: true
			});
		},
		is_show: function(i){
			var $commont_con = $('#commonts-' + i);
			var inner_height = $commont_con.find('ul').height();
			if(inner_height > 60){
				$commont_con.addClass('all');
				$('#show-all' + i).parent().removeClass('none');
			}
		},
		event: function() {
			var me = H.friend,
				$main = $(".main");
			$main.delegate('.show-all', 'click', function(e) {
				e.preventDefault();
				var $class_all = $(this).parent().siblings('.commonts');
				$class_all.toggleClass('all');
				if( $class_all.hasClass('all')){
					$(this).text('﹀展开评论');
				}else{
					$(this).text('︿收起');
				}
			});

			$('.show').click(function(e) {
				e.preventDefault();
				toUrl('collect.html');
			});
			/*me.$more.click(function(e) {
				e.preventDefault();
				if($(this).hasClass("nomore")){
					return;
				}
				me.$more.removeClass('hasmore').addClass('nomore').find('a').html('正在拼命加载');
				if (me.showPage < me.maxpage && me.loadmore) {
						me.topicslist();
				} else {
					me.$more.removeClass('nomore').addClass('hasmore').find('a').html('点击加载更多');
				}
			});*/

			var range = 55, //距下边界长度/单位px
				totalheight = 0;
			$(window).scroll(function(e){
				e.preventDefault();
				var srollPos = $(window).scrollTop();
				totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
				if (($(document).height() - range) <= totalheight  && me.showPage < me.maxpage && me.loadmore) {
					me.topicslist();
				}
			});

			$('.back-btn').click(function(e) {
				e.preventDefault();
				toUrl('index.html');
			});
			$main.delegate('.zanbtn', 'click', function(e){
				e.preventDefault();
				me.zanSelector = this;
				if($(this).find("i").hasClass("true")){
					showTips('亲，您已经点过赞了');
					return;
				}
				getResult('api/friendcircle/topicprise', {
					oi: openid,
					nn: nickname ? encodeURIComponent(nickname) : "",
					hu: headimgurl||"images/avatar.png",
					uuid: $(this).attr('data-uuid') || ''
				}, 'callbackFriendcircleTopicprise', true, null);
			});
			$('.send').click(function(e){
				e.preventDefault();
				var $this = $(this);
				if ($this.hasClass("request")) {
					return;
				}
				var $input = $this.siblings("input");
				var comment = $.trim($input.val()) || '',
					comment = comment.replace(/<[^>]+>/g, ''),
					len = comment.length,
					nick = nickname || "匿名用户";

				if (len < 1) {
					showTips('请先说点什么吧',4);
					$input.focus();
					return;
				} else if (len > 100) {
					showTips('观点字数超出了100字',4);
					$input.focus();
					return;
				}
				$this.addClass("request");
				shownewLoading();
				$.ajax({
					type : 'GET',
					async : false,
					url : domain_url + 'api/comments/save'+dev,
					data: {
						co: encodeURIComponent(comment),
						op: openid,
						tid: me.tid,
						ty: 1,
						nickname: nick,
						headimgurl: headimgurl ? headimgurl : ""
					},
					dataType : "jsonp",
					jsonpCallback : 'callbackCommentsSave',
					complete: function() {
						hidenewLoading();
					},
					success : function(data) {
						$this.removeClass("request");
						if (data.code == 0) {
							showTips('评论成功');
							var t = simpleTpl();
							t._('<li data-tuuid = "' + data.uid + '">')
								/*._('<div class="nhead fl-l">')
								 ._('<img src="' + ( comm[j].hu ? ( comm[j].hu + '/' + yao_avatar_size ) : defaultImg ) + '" border="0" />')
								 ._('</div>')*/
								._('<span class="commont-name">' + nick + '</span>')
								._('<span>:</span>')
								._('<span class="commont-text">' + comment + '</span>')
							._('</li>')
							$("#"+me.tid).find('ul').prepend(t.toString());
							me.is_show(me.tid);
							$input.val("");
							$(".pinglun").addClass('none');
							if(is_android()){
								$(window).scrollTop(me.top);
							}
							return;
						}
					}
				});
			});
			$main.delegate('.sharebtn', 'click', function(e) {
				e.preventDefault();
				me.top = $(window).scrollTop();
				e.stopPropagation();
				me.tid = $(this).parent().siblings(".content-box").attr("data-uuid");

				$(".pinglun").removeClass('none').find("input");
				/*$(".pinglun").removeClass('none').find("input").focus();
				if(is_android()){
					setTimeout(function(){
						$(window).scrollTop(me.top);
					},500);
				}*/
			});

			var el = document.querySelector('.cards');
			el.addEventListener('touchstart', function (e) {
				$(".pinglun").addClass("none").find("input").val("");
			});
		},
		scroll: function(options) {
			$('.commonts').each(function(i) {
				var me = this, com = [], delay = 1000;
				var len  = $(me).find('li').length;
				var $ul = $(me).find('ul');
				if (len == 0) {
					$(me).addClass('none');
				} else {
					$(me).removeClass('none');
				}
				if(len > 1) {
					com[i] = setInterval(function() {
						$(me).find('ul').animate({'margin-top': '-40px'}, delay, function() {
							$(me).find('ul li:first').appendTo($ul);
							$(me).find('ul').css({'margin-top': '0'});
						});
					}, 3000);
				}
			});
		}
	};

	W.callbackFriendcircleTopicslist = function(data) {
		var me = H.friend,
			$main = $('.main');
		$main.animate({'opacity':'1'}, 500).css('z-index', '0');
		$('.more').removeClass('nomore').addClass('hasmore').find('a').html('点击加载更多');
		if (data.code == 0) {
			var arrty = data.items;
			if (arrty.length < me.showPagesize) {
				me.$more.addClass('none');
				me.loadmore = false;
			}
			me.fill(data);
			$main.removeClass('none');
		}else{
			me.$more.addClass('none');
			$(".wait").removeClass("none");
			me.loadmore = false;
		}
	};

	W.callbackFriendcircleTopicprise = function(data) {
		var me = H.friend;
		if (data.code == 0) {
			$(me.zanSelector).find('.icon').removeClass('false').addClass('true');
			var voteNum = parseInt($(me.zanSelector).find('.number').html()) + 1;
			$(me.zanSelector).find('.number').html(voteNum);
		}
	};
})(Zepto);

$(function() {
	H.friend.init();
});