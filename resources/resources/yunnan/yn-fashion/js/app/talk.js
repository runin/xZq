(function($) {
	H.talk = {
		maxid: 0,
		minid: 0,
		unread: 0,
		pageSize: 10,
		lastMinid: 0,
		loadCommentCount: 0,
		headerH: 0,
		actUid: '',
		comments: '',
		STARTING_CLS: 'starting',
		STARTED_CLS: 'started',
		ENDED_CLS: 'ended',
		commentList: $("#comment_list"),
		input: $("#input_text"),
		$hostList: $('header .main ul'),
		$timebox: $('#time-box'),
		currTime: new Date().getTime(),
		ismeTrue: true,
		TIMETRUE_CLS: true,
		SHOWTRUE_CLS: true,
		SETTRUE_CLS: true,
		LOADTRUE_CLS: true,
		NEWMESSAGE_CLS: true,
		FIRSTLOADTRUE_CLS: true,
		expires_in: {expires: 1},
		init: function() {
			var me = this,
				winW = $(window).width(),
				winH = $(window).height();
			$('body').css({
				'width': winW,
				'height': winH
			});
			if (!openid) {
				return false;
			};
			getResult('fashion/chatIndex', {}, 'fashionChatIndexHandler', true, null);
			getResult('api/common/servicepv', {}, 'commonApiSPVHander');
			setInterval(function(){
				getResult('api/common/servicepv', {}, 'commonApiSPVHander');
			},3000);
			me.event();
			me.canBottom();
		},
		event: function() {
			$(".go-back").click(function(e){
				e.preventDefault();
				showLoading();
				toUrl("index.html");
			});
			$("#input_submit").click(function(){
				H.talk.comment = $.trim($('#input_text').val()) || '';
				if($.trim(H.talk.input.val()).length == 0){
					showTips("什么都没有说呢");
					return false;
				} else if ($.trim(H.talk.input.val()).length < 3){
					showTips("多说一点吧！至少3个字哦");
					return false;
				} else if ($.trim(H.talk.input.val()).length > 100){
					showTips("评论字数不能超过100个字哦");
					return false;
				};
				if (H.talk.actUid != '') {
					getResult('api/comments/save',{
						'co' : encodeURIComponent(H.talk.input.val()),
						'op' : openid,
						'nickname': nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "匿名用户",
						'headimgurl': headimgurl ? headimgurl : "",
						'tid': H.talk.actUid,
						'ty': 1
					}, 'callbackCommentsSave', true, null);
				};
			});
			$('.tips-info').click(function(e) {
				e.preventDefault();
				var talkroom = document.getElementById('talkroom');
				talkroom.scrollTop = $('.comment-list').height();
	        	$('.tips-info').animate({'opacity':'0'}, 300, function(){
	        		$('.tips-info').html('').css('display', 'none');
	        		H.talk.NEWMESSAGE_CLS = true;
	        	});
			});
		},
		fillCount: function(data) {
			$('.content span label').html(data.c);
		},
		server_time: function(serverTime){
			var time, nowTime = Date.parse(new Date());
            if(nowTime > serverTime){
                time += (nowTime - serverTime);
            }else if(nowTime < serverTime){
                time -= (serverTime - nowTime);
            }
            return time;
        },
		fillContent: function(data) {
			var me = this,
				t = simpleTpl(),
				tpinfo = data.tpinfo || [],
				length = tpinfo.length;
			me.currTime = timestamp(data.act);
			for (var i = 0; i < length; i++) {
				t._('<li data-actUid="' + tpinfo[i].actUid + '" data-stime="'+ timestamp(tpinfo[i].ab) +'" data-etime="'+ timestamp(tpinfo[i].ae) +'" style="z-index:' + i + ';">')
					._('<div class="host-avatar"><img src="' + tpinfo[i].ai + '"></div>')
					._('<div>')
						._('<p class="host-name">' + tpinfo[i].ad + '</p>')	
						._('<p class="host-content">' + tpinfo[i].at + '</p>')
					._('</div>')
					._('<img class="line" src="./images/line-talkroom.png">')
				._('</li>')
			};
			me.$hostList.html(t.toString());
			me.progress(data.act);
		},
		progress: function(data) {
			var me = this,
			server_time = new Date(data).getTime();
			this.$hostList.find('li').each(function() {
				var $me = $(this);
				$me.progress({
					cTime: me.currTime,
					stpl : '距离下期话题开始还有 <span class="tbx"><span>%H%</span><span>:</span><span>%M%</span><span>:</span><span>%S%</span></span>',
					callback: function(state) {
						if(H.talk.TIMETRUE_CLS) {
							var cls = '';
							switch(state) {
								case 1:
									cls = me.STARTING_CLS + ' none';
									break;
								case 2:
									cls = me.STARTED_CLS;
									break;
								default:
									cls = me.ENDED_CLS + ' none over';
							}
							$me.removeClass().addClass(cls);

							var $starting = me.$hostList.find('li.' + me.STARTING_CLS),
								$started = me.$hostList.find('li.' + me.STARTED_CLS),
								$ended = me.$hostList.find('li.' + me.ENDED_CLS),
								length = me.$hostList.find('li').length,
								winH = $(window).height(),
								headerH = $('header').height(),
								footerH = $('footer').height();
								sendH = $('.input-box-wrapper').height();
							$('.talkroom').css('height', winH - headerH);
							if ($started.length == 0 && length != 0) {
								$('#comment_list').removeClass('none').addClass('transparent');
								$('footer').addClass('transparent');
								$('.content span').addClass('transparent');
								$('.input-box-wrapper').addClass('over');
							} else {
								$('#comment_list').removeClass('transparent');
								$('footer').removeClass('transparent');
								$('.content span').removeClass('transparent');
								$('.input-box-wrapper').removeClass('over');
							};
							if ($started.eq(0).attr('data-laststr') == '000000') {
								location.reload();
							};
							if ($starting.length == length) {
								$('body').addClass('now');
							} else {
								$('body').removeClass('now');
							};
							
							if ($started.length > 0) {
								me.$timebox.addClass('none');
								$started.eq(0).removeClass('none');
								H.talk.actUid = $started.eq(0).attr('data-actUid');
								if (H.talk.SHOWTRUE_CLS) {
									H.talk.SHOWTRUE_CLS = false;
									getResult('api/comments/room', {
										'op' : openid,
										'anys' : H.talk.actUid,
										'maxid' : H.talk.maxid,
										'ps' : H.talk.pageSize
									}, 'callbackCommentsRoom');
									var talkroom = document.getElementById('talkroom');
									talkroom.scrollTop = $('.comment-list').height();
								};
								if ($started.eq(0).attr('data-sellect') != 'sellect') {
									me.$timebox.removeClass('none');
									me.$timebox.html($starting.eq(0).attr('data-timestr'));
								};
							} else {
								if ($starting.length > 0) {
									var $prev = $starting.eq(0).prev('li');
									$starting.eq(0).addClass('none');
									$prev.removeClass('none');
									$prev.find('.vote-count').removeClass('transparent');
									$prev.find('.vote-bar p span').removeClass('transparent');
									me.$timebox.removeClass('none');
									me.$timebox.html($starting.eq(0).attr('data-timestr'));
								} else if ($me.next('li').length == 0) {
									clearInterval(window.progressTimeInterval);
									H.talk.actUid = '';
									$('#comment_list').addClass('over');
									$('footer').addClass('over');
									$('.content span').addClass('over');
									$('#time-box').html('《时尚我最懂》<br>每周四晚22:20等你来');
									$('body').addClass('end');
								};
							};
						};
					}
				});
			});
		},
		fillCommentList: function(data){
			if(data.code == 0){
				this.loadCommentCount ++;
				this.maxid = data.maxid > this.maxid ? data.maxid : this.maxid ;
				this.lastMinid = this.minid;
				this.minid = this.minid == 0 || data.minid < this.minid ? data.minid : this.minid ;
				
				var me = this, comments = "", itemsList = data.items;
				if (H.talk.maxid == 0) {
					itemsList = itemsList.reverse();
				}
				for(var i in itemsList){
					if (hex_md5(openid) == itemsList[i].op) {
						if (H.talk.ismeTrue) {
							var ismestr = 'isme';
						} else {
							var ismestr = 'isme none';
						};
					} else {
						var ismestr = '';
					};
					var h= itemsList[i].hu ? itemsList[i].hu + '/' + yao_avatar_size : "./images/avatar/avatar" + Math.ceil(7*Math.random()) + ".png";
					comments += '<li class="all comment-list-item ' + ismestr + '">'
								+ '<div class="comment-header"><img src="' + h +'"></div>'
								+ '<div class="comment-content"><p class="comment-username">' + ( itemsList[i].na || "匿名用户") +'<span class="point-tips"></span></p>'
								+ '<section class="comment-bubble">'
									+ '<p class="detail-all">' + (itemsList[i].co || "《时尚我最懂》每周四晚22:20等你来~") + '</p>'
									+ '<i class="comment-arrow"></i>'
								+ '</section></div>'
							+ '</li>';
				};
				$('#comment_list').append(comments);
				if (H.talk.FIRSTLOADTRUE_CLS) {
					H.talk.FIRSTLOADTRUE_CLS = false;
					var talkroom = document.getElementById('talkroom');
					talkroom.scrollTop = $('.comment-list').height();
					setTimeout(function() {
						var talkroom = document.getElementById('talkroom');
						talkroom.scrollTop = $('.comment-list').height();
					}, 600);
				};
				if (H.talk.LOADTRUE_CLS) {
					var talkroom = document.getElementById('talkroom');
					talkroom.scrollTop = $('.comment-list').height();
					setTimeout(function(){
						var talkroom = document.getElementById('talkroom');
						talkroom.scrollTop = $('.comment-list').height();
					}, 600);
				} else {
					if (H.talk.NEWMESSAGE_CLS) {
						H.talk.NEWMESSAGE_CLS = false;
						$('.tips-info').css({'display': 'block','top': $('header').height()}).html('来新消息啦!点我查看~').animate({'opacity':'1'}, 600);
					};
				}
			};
			if (H.talk.SETTRUE_CLS) {
				H.talk.SETTRUE_CLS = false;
				setInterval(function(){
					if (H.talk.actUid != '') {
						getResult('api/comments/room', {
							'op' : openid,
							'anys' : H.talk.actUid,
							'maxid' : H.talk.maxid,
							'ps' : H.talk.pageSize
						}, 'callbackCommentsRoom');
					};
				},5000);
			};
		},
		canBottom: function() {
			var maxHeight = 10,
				pageHeight = 0,
				talkroom = document.getElementById('talkroom');
		    $('#talkroom').scroll(function(){
		    	var winH = $(window).height(),
		    		headerH = $(window).height();
		    	$('body').css('height', winH);
		    	$('.talkroom').css('height', winH - headerH - 50);
		        pageHeight = parseFloat(talkroom.clientHeight) + parseFloat(talkroom.scrollTop);
		        if (($('.comment-list').height() - maxHeight - parseFloat(talkroom.scrollTop)) <= pageHeight) {
		        	H.talk.LOADTRUE_CLS = true;
		        } else {
		        	H.talk.LOADTRUE_CLS = false;
		        	$('.tips-info').css('display', 'block').animate({'opacity':'0'}, 300, function(){
		        		$('.tips-info').html('').css('display', 'none');
						H.talk.NEWMESSAGE_CLS = true;
		        	});
		        };
		    });
		},
		fillAfterSubmit: function(){
			H.talk.ismeTrue = false;
			$('#input_text').blur().val('');
			var h= headimgurl ? headimgurl + '/' + yao_avatar_size : "./images/avatar/avatar" + Math.ceil(7*Math.random()) + ".png";
			var comments = "";
			comments += '<li class="all comment-list-item isme">'
						+ '<div class="comment-header"><img src="' + h +'"></div>'
						+ '<div class="comment-content"><p class="comment-username">' + ( nickname || "匿名用户") +'<span class="point-tips"></span></p>'
						+ '<section class="comment-bubble">'
							+ '<p class="detail-all">' + (H.talk.comment || "《时尚我最懂》每周四晚22:20等你来~") + '</p>'
							+ '<i class="comment-arrow"></i>'
						+ '</section></div>'
					+ '</li>';
			$('#comment_list').append(comments);
			var talkroom = document.getElementById('talkroom');
			talkroom.scrollTop = $('.comment-list').height();
			setTimeout(function() {
				var talkroom = document.getElementById('talkroom');
				talkroom.scrollTop = $('.comment-list').height();
			}, 600);
			getResult('api/comments/room', {
				'op' : openid,
				'anys' : H.talk.actUid,
				'maxid' : H.talk.maxid,
				'ps' : H.talk.pageSize
			}, 'callbackCommentsRoom');
		},
		preLoad: function(){
			$('.preme').animate({'opacity':'1'}, 500);
			setTimeout(function() {
				$('.talkroom').animate({'opacity':'1'}, 400);
			}, 300)
		}
	}
	
	W.fashionChatIndexHandler = function(data) {
		if (data.code == 0) {
			H.talk.preLoad();
			H.talk.fillContent(data);
		} else {
			H.talk.preLoad();
		}
	};

	W.commonApiSPVHander = function(data) {
		H.talk.fillCount(data);
	};

	W.callbackCommentsRoom = function(data) {
		H.talk.fillCommentList(data);
	};
	
	W.callbackCommentsSave = function(data) {
		if(data.code == 0){
			H.talk.fillAfterSubmit();
		}else{
			showTips(data.message);
		};
	};
})(Zepto);

$(function(){
	H.talk.init();
});