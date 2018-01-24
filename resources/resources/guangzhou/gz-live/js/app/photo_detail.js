(function($) {
	H.detail = {
		uuid: '',
		zanuuid: '',
		commNum: 0,
		commentsCount: 0,
		showPage: 1,
		showPagesize: 10,
		isTrue: true,
		aniTrue: true,
		listTrue: true,
		loadmore: true,
		zanSelector: null,
		meituUuid: getQueryString('uuid') || '',
		historyUuid: getQueryString('historyuuid') || '',
		historyTrue: getQueryString('history') || '',
		REQUEST_CLS: 'requesting',
		init: function() {
			var me = this;
			if (!openid) {
				return false;
			};
			if (me.meituUuid == '') {
				toUrl('photo.html');
				return;
			};
			getResult('gzlive/photo/index', {
				openid: openid
			}, 'photoIndexHandler', true, null, true);
			getResult('comments/count', {anys: H.detail.meituUuid}, 'callbackCommentsCount', true, null);
			getResult('comments/list', {page:me.showPage,ps:me.showPagesize,anys:me.meituUuid,op:openid,dt:1}, 'callbackCommentsList',true, null);
		},
		fill: function(data) {
			var me = this, serverTime = str2date(data.ae),
				now = new Date(), end = new Date(serverTime),
				lastTime = end.getTime() - now.getTime();
			var lastDay = Math.ceil(lastTime / (24 * 60 * 60 * 1000));
			if (lastDay > 0) {
				$('.topic-title .topic-day label').html(lastDay);
			} else {
				setTimeout(function() {
					toUrl('photo_history.html');
				}, 50);
			};

			$('.topic-head img').attr('src', data.ai);
			$('.topic-title .topic-name').html(data.at);
			$('.topic-title .topic-desc').html(data.att).addClass('none');

			if ($('.topic-name').html().length > 10 && $('.topic-name').html().length < 20) {
				$('.topic-name').css('font-size', '24px');
			} else if ($('.topic-name').html().length >= 20) {
				$('.topic-name').css('font-size', '19px');
			} else {
				$('.topic-name').css('font-size', '30px');
			};
			if (H.detail.historyTrue == 'open') {
				getResult('gzlive/photo/detail', {
					actUUid: H.detail.historyUuid,
					recordUUid: H.detail.meituUuid
				}, 'photoDetailHandler', true, null);
			} else {
				getResult('gzlive/photo/detail', {
					actUUid: H.detail.uuid,
					recordUUid: H.detail.meituUuid
				}, 'photoDetailHandler', true, null);
			}
		},
		fillcomm: function(data) {
			var t = simpleTpl(), i = 0,
				current = data.current || [],
				currentLen = current.length,
				defaultImg = './images/showhead.png';
			t._('<div class="info clearfix">')
				._('<div class="zanbtn none" data-uuid="' + current[i].ru + '">')
					._('<i class="icon ' + current[i].rvf + '"></i>')
					._('<span class="number">' + current[i].rvn + '</span>')
				._('</div>')
				._('<span class="left nhead">')
					._('<img class="head" src="' + ( current[i].ruh ? ( current[i].ruh + '/' + yao_avatar_size ) : defaultImg ) + '" border="0">')
				._('</span>')
				._('<span class="right name">' + (current[i].run ? current[i].run : '第一现场观众') + '</span>')
			._('</div>')
			._('<div class="swiper-container">')
				._('<div class="swiper-wrapper">')
				var imgs = current[i].ri.split(',');
				for (var j = 0, len = imgs.length; j < len; j++) {
	                t._('<div class="swiper-slide">')
	                    ._('<img src="./images/loading.png" data-src="' + imgs[j] + '" class="swiper-lazy">')
	                    ._('<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>')
	                ._('</div>')
	            };
				t._('</div>')
				._('<div class="swiper-button-prev swiper-button-white"><img src="./images/icon-arrow-left.png"></div>')
				._('<div class="swiper-button-next swiper-button-white"><img src="./images/icon-arrow-right.png"></div>')
			._('</div>')
			._('<div class="text">' + current[i].rd + '</div>')
			
			._('<div class="events">')
				._('<div class="sharebtn">')
					._('<img src="images/ring.png" border="0" />')
					._('<span>点击右上角分享拉票</span>')
				._('</div>')
				._('<div class="zanbtn" data-uuid="' + current[i].ru + '">')
					._('<i class="icon ' + current[i].rvf + '"></i>')
					._('<span class="number">' + current[i].rvn + '</span>')
				._('</div>')
			._('</div>')
			$('.card').append(t.toString());
			this.event();
			this.gotop();
			this.swiper();
		},
		filltalk: function(data) {
			var me = this, t = simpleTpl(), item = data.items || [], $top_comment = $('#top-comment'),$nor_comment = $('#nor-comment');
			for (var i = 0, len = item.length; i < len; i++) {
				t._('<li data-uuid = "'+ item[i].uid +'">')
					._('<div class="detailhead">')
						._('<img src="' + (item[i].im ? (item[i].im + '/' + yao_avatar_size) : './images/showhead.png') + '">')
					._('</div>')
					._('<div class="comment">')
						._('<p class="name">' + (item[i].na || '第一现场观众') + '</p>')
						._('<p class="content">' + item[i].co + '</p>')
					._('</div>')
				._('</li>')
			};
			$('.comments ul').append(t.toString());
		},
		event: function() {
			var me = this;
			$('.zanbtn').click(function(e) {
				e.preventDefault();
				if($(this).find('.icon').hasClass('true')) {
					H.detail.showtip('亲，您已经投过票了');
					return;
				}
				H.detail.zanuuid = $(this).attr('data-uuid') || '';
				H.detail.zanSelector = this;
				getResult('gzlive/photo/vote', {
					openid: openid,
					actUuid: H.detail.uuid,
					recordUuid: H.detail.zanuuid
				}, 'photeVoteHandler', true, null, true);
			});
			$('#send').click(function(e){
				e.preventDefault();
				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				};
				var comment = $.trim($('#comments-info').val()) || '',
					comment = comment.replace(/<[^>]+>/g, ''),
					len = comment.length;
				if (len < 5) {
					me.showtip('至少说5个字哦~', 4);
					$(this).removeClass(me.REQUEST_CLS);
					$('#comments-info').focus();
					return;
				} else if (len > 140) {
					me.showtip('字数不能超过140字哦~', 4);
					$(this).removeClass(me.REQUEST_CLS);
					$('#comments-info').focus();
					return;
				};
				$(this).addClass(me.REQUEST_CLS);
				if(openid != null){
					$('#send').attr('disabled','disabled');
					$('#comments-info').attr('disabled','disabled');
					getResult('comments/save', {
						op: openid,
						co: encodeURIComponent($('#comments-info').val()),
						tid: H.detail.meituUuid,
						ty: 1,
						nickname: nickname ? encodeURIComponent($.fn.cookie(shaketv_appid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
					}, 'callbackCommentsSave', true, null);
				};
				// getResult('comments/count', {anys: H.detail.meituUuid}, 'callbackCommentsCount', true, null);
				$('.com-head label').html($('.com-head label').html() * 1 + 1);
				var share = document.getElementById('share');
				share.scrollTop = 50000;
				setTimeout(function(){
					share.scrollTop = 50000;
				}, 500);
			});
			$('.gotop').click(function(e) {
				e.preventDefault();
				$('.comments ul').scrollTop(0);
				$(this).addClass('none');
			});

			var range = 20, maxpage = 100, totalheight = 0;
			$('.comments .list').scroll(function(){
			    var srollPos = $('.comments .list').scrollTop();
			    totalheight = parseFloat($('.comments .list').height()) + parseFloat(srollPos);
				if (($('.comments ul').height() - range) <= totalheight && H.detail.showPage < maxpage && H.detail.loadmore) {
					H.detail.getList(H.detail.showPage);
			    }
			});
		},
		gotop: function() {
			$('.comments ul').scroll(function() {
				var commentsH = $('.comments ul').scrollTop();
				if(commentsH >= 180) {
					$('.gotop').removeClass('none');
				} else if(commentsH == 0){
					$('.gotop').addClass('none');
				};
			});
		},
		getList: function(page) {
			var me = this;
			if((page - 1)  == me.commNum){
				if (H.detail.listTrue) {
					H.detail.listTrue = false;
					getResult('comments/list', {
						op: openid,
						anys: H.detail.meituUuid,
						page: page,
						ps: H.detail.showPagesize,
						zd: 0,
						kind: 0
					}, 'callbackCommentsList', true, null);
				};
			};
		},
		showtip: function(word, pos) {
			if (H.detail.aniTrue) {
				H.detail.aniTrue = false;
				var pos = pos || '2';
				$('body').append('<div class="tips none"></div>');
				$('.tips').css({
					'position': 'fixed' ,
					'max-width': '80%' ,
					'top': '60%' ,
					'left': '50%' ,
					'z-index': '1000' ,
					'color': 'rgb(255, 255, 255)' ,
					'padding': '20px 10px' ,
					'border-radius': '5px' ,
					'margin-left': '-120px' ,
					'background': 'rgba(0, 0, 0, 0.8)' ,
					'text-align': 'center',
					'opacity': '0'
				});
				$('.tips').html(word);
				var winW = $(window).width(),
					winH = $(window).height();
				$('.tips').removeClass('none').css('opacity', '0');
				var tipsW = $('.tips').width(),
					tipsH = $('.tips').height();
				$('.tips').css({'margin-left': -tipsW/2,'top':(winH - tipsH)/(pos - 0.2)}).removeClass('none');
				$('.tips').animate({
					'opacity': '1',
					'top': (winH - tipsH)/pos}, 300, function() {
						setTimeout(function() {
							$('.tips').animate({'opacity':'0'}, 300, function() {
								$('.tips').addClass('none').css('top', (winH - tipsH)/(pos - 0.2));
							});
						}, 1500);
						setTimeout(function() {
							$('.tips').remove();
							H.detail.aniTrue = true;
						}, 1850);
				});
			};
		},
        swiper: function() {
            var me = this, swiper = new Swiper('.swiper-container', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                pagination: '.swiper-pagination',
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                spaceBetween: 85
            });
            $(".swiper-box").animate({'opacity':'1'},800);
        }
	};

	W.photoIndexHandler = function(data) {
		$('.main').animate({'opacity':'1'}, 500).css('z-index', '0');;
		if (data.code == 0) {
			H.detail.uuid = data.au;
			H.detail.fill(data);
		} else if (data.code == 4) {
			setTimeout(function() {
				toUrl('photo_history.html');
			}, 50);
		};
	};
	W.photoDetailHandler = function(data) {
		if (data.code == 0) {
			// H.detail.uuid = data.au;
			H.detail.fillcomm(data);
		} else if (data.code == 4) {
			setTimeout(function() {
				toUrl('photo_history.html');
			}, 50);
		};
	};
	
	W.photeVoteHandler = function(data) {
		if (data.code == 0) {
			$(H.detail.zanSelector).find('.icon').removeClass('false').addClass('true');
			var voteNum = parseInt($(H.detail.zanSelector).find('.number').html()) + 1;
			$(H.detail.zanSelector).find('.number').html(voteNum);
		} else if (data.code == 5) {
			H.detail.showtip('亲，您已经投过票了');
		};
	};

	W.callbackCommentsSave = function(data) {
		$('#send').removeClass(H.detail.REQUEST_CLS);
		$("#send").removeAttr("disabled");
		$("#comments-info").removeAttr("disabled");

		if(data.code == 0 ){
			H.detail.showtip('您的评论审核后将会被大家看到');
			var headImg = null;
			if(headimgurl == null || headimgurl == ''){
				headImg = './images/showhead.png';
			}else{
				headImg = headimgurl + '/' + yao_avatar_size;
			}
			var t = simpleTpl();
			t._('<li id="' + data.uid + '">')
				._('<div class="detailhead">')
					._('<img src="' + headImg + '">')
				._('</div>')
				._('<div class="comment">')
					._('<p class="name">' + (nickname || '第一现场观众') + '<span class="checktalk">(审核中)</span></p>')
					._('<p class="content">' + $("#comments-info").val() + '</p>')
				._('</div>')
			._('</li>')
			if($('.comments ul').children().length == 0){
				$('.comments ul').append(t.toString());
			}else{
				$('.comments ul').children().first().before(t.toString());
			};
			// $('.com-head').find("label").html($('.com-head').find("label").html()*1+1);
			$("#comments-info").val("");

			$('.comments .list').scrollTop('0');
			
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}else{
			$("#comments-info").val("");
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
			H.detail.showtip(data.message,4);
		};
	};

	W.callbackCommentsList = function(data){
		if(data.code == 0){
			H.detail.listTrue = true;
			if (data.items.length < H.detail.showPagesize && data.kind == 0) {
				H.detail.loadmore = false;
			};
			if(data.items.length == H.detail.showPagesize){
				if(H.detail.showPage == 0){
					H.detail.commNum = 1;
					H.detail.showPage = 2;
				}else{
					H.detail.commNum = H.detail.showPage;
					H.detail.showPage++ ;
				}
			};
			H.detail.filltalk(data);
		};
	};

	W.callbackCommentsCount = function(data) {
		if (data.code == 0) {
			H.detail.commentsCount = data.tc;
			$('.com-head label').html(data.tc);
		};
	};
	
})(Zepto);

$(function() {
	H.detail.init();
});