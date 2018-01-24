(function($) {
	H.photo = {
		uuid: '',
		zanuuid: '',
		commNum: 0,
		maxpage: 100,
		showPage: 1,
		showPagesize: 5,
		isTrue: true,
		aniTrue: true,
		listTrue: true,
		loadmore: true,
		historyTrue: true,
		zanSelector: null,
		history: getQueryString('history') || '',
		historyuuid: getQueryString('uuid') || '',
		init: function() {
			var me = this;
			var winH = $(window).height();
			$('.main').css('min-height', winH);
			if (me.history == 'open') {
				me.historyTrue = true;
				getResult('gzlive/photo/detailact', {
					actUuid: me.historyuuid,
					page: me.showPage,
					pageSize: me.showPagesize
				}, 'photoDetailActHandler', true, null);
			} else {
				me.historyTrue = false;
				getResult('gzlive/photo/index', {
					openid: openid,
					page: me.showPage,
					pageSize: me.showPagesize
				}, 'photoIndexHandler', true, null);
			}
		},
		fill: function(data) {
			var me = this, serverTime = str2date(data.ae),
				now = new Date(), end = new Date(serverTime),
				lastTime = end.getTime() - now.getTime();
			var lastDay = Math.ceil(lastTime / (24 * 60 * 60 * 1000));
			if (lastDay > 0) {
				$('.count-day label').html(lastDay);
			} else {
				setTimeout(function() {
					toUrl('preshow.html');
				}, 50);
			};

			$('.topic-head img').attr('src', data.ai);
			$('.topic-title .topic-name').html(data.at);
			$('.topic-content .topic-desc').html(data.att);
			$('.count-total label').html(data.ac);
			$('body').removeClass('history-cards');

			if ($('.topic-name').html().length > 10 && $('.topic-name').html().length < 20) {
				$('.topic-name').css('font-size', '24px');
			} else if ($('.topic-name').html().length >= 20) {
				$('.topic-name').css('font-size', '18px');
			} else {
				$('.topic-name').css('font-size', '28px');
			};
			var t = simpleTpl(),
				current = data.current || [],
				currentLen = current.length,
				defaultImg = './images/avatar.png';
				for (var i = 0; i < currentLen; i ++) {
					t._('<div class="card" data-uuid="' + current[i].ru + '" data-collect="true" data-collect-flag="tj-food-show-card-btn" data-collect-desc="美图秀首页-点击美图卡片">')
						._('<div class="info clearfix">')
							._('<i class="rank"></i>')
							._('<span class="left nhead">')
								._('<img class="head" src="' + ( current[i].ruh ? ( current[i].ruh + '/' + yao_avatar_size ) : defaultImg ) + '" border="0" />')
							._('</span>')
							._('<span class="right name">' + ( current[i].run ? current[i].run : '匿名用户' ) + '</span>')
						._('</div>')
						._('<div class="content-box" data-uuid="' + current[i].ru + '">')
							._('<div class="images">')
								._('<img src="' + current[i].ri + '" border="0" />')
							._('</div>')
							._('<div class="text">' + current[i].rd + '</div>')
							._('<div class="commonts">')
								._('<ul>')
								var comm = current[i].comm || [],
									commLen = comm.length;
								for (var j = 0; j < commLen; j ++) {
									t._('<li data-tuuid = "' + comm[j].cu + '">')
										._('<div class="nhead fl-l">')
											._('<img src="' + ( comm[j].ch ? ( comm[j].ch + '/' + yao_avatar_size ) : defaultImg ) + '" border="0" />')
										._('</div>')
										._('<span class="commont-name">' + ( comm[j].cn ? comm[j].cn : '匿名用户' ) + '</span>')
										._('<span>:</span>')
										._('<span class="commont-text">' + comm[j].cv + '</span>')
									._('</li>')
								}
								t._('</ul>')
							._('</div>')
						._('</div>')
						._('<div class="events">')
							._('<div class="sharebtn">')
								._('<img src="images/ring.png" border="0" />')
								._('<span>点击右上角分享拉票</span>')
							._('</div>')
							._('<div class="zanbtn" data-uuid="' + current[i].ru + '" data-collect="true" data-collect-flag="tj-food-show-zan-btn" data-collect-desc="美图秀首页-点赞按钮">')
								._('<i class="icon ' + current[i].rvf + '"></i>')
								._('<span class="number">' + current[i].rvn + '</span>')
							._('</div>')
						._('</div>')
					._('</div>')
				};
			$('.cards').append(t.toString());
			this.scroll({speed:40,rowHeight:40});
			this.showbtn();
			this.event();
		},
		fillhistory: function(data) {
			$('.banner').addClass('none');
			$('.tabs li:first').removeClass('active').css({'border-right':'1px solid #d4d4d4'}).find('a').css({'background-color':'transparent'}).attr('href', 'show.html');
			$('.topic-head img').attr('src', data.ai);
			$('.topic-title .topic-name').html(data.at);
			$('.topic-content .topic-desc').html(data.att);
			$('.count-total label').html(data.ac);
			$('body').addClass('history-cards');

			var t = simpleTpl(),
				current = data.current || [],
				currentLen = current.length,
				defaultImg = './images/avatar.png';
				for (var i = 0; i < currentLen; i ++) {
					t._('<div class="card" data-uuid="' + current[i].ru + '">')
						._('<div class="info clearfix">')
							._('<i class="rank"></i>')
							._('<span class="left nhead">')
								._('<img class="head" src="' + ( current[i].ruh ? ( current[i].ruh + '/' + yao_avatar_size ) : defaultImg ) + '" border="0" />')
							._('</span>')
							._('<span class="right name">' + ( current[i].run ? current[i].run : '匿名用户' ) + '</span>')
						._('</div>')
						._('<div class="content-box" data-uuid="' + current[i].ru + '">')
							._('<div class="images">')
								._('<img src="' + current[i].ri + '" border="0" />')
							._('</div>')
							._('<div class="text">' + current[i].rd + '</div>')
							._('<div class="commonts">')
								._('<ul>')
								var comm = current[i].comm || [],
									commLen = comm.length;
								for (var j = 0; j < commLen; j ++) {
									t._('<li data-tuuid = "' + comm[j].cu + '">')
										._('<div class="nhead fl-l">')
											._('<img src="' + ( comm[j].ch ? ( comm[j].ch + '/' + yao_avatar_size ) : defaultImg ) + '" border="0" />')
										._('</div>')
										._('<span class="commont-name">' + ( comm[j].cn ? comm[j].cn : '匿名用户' ) + '</span>')
										._('<span>:</span>')
										._('<span class="commont-text">' + comm[j].cv + '</span>')
									._('</li>')
								}
								t._('</ul>')
							._('</div>')
						._('</div>')
						._('<div class="events">')
							._('<div class="sharebtn">')
								._('<img src="images/ring.png" border="0" />')
								._('<span>点击右上角分享拉票</span>')
							._('</div>')
							._('<div class="zanbtn requesting" data-uuid="' + current[i].ru + '">')
								._('<i class="icon ' + current[i].rvf + '"></i>')
								._('<span class="number">' + current[i].rvn + '</span>')
							._('</div>')
						._('</div>')
					._('</div>')
				};
			$('.cards').append(t.toString());
			this.scroll({speed:40,rowHeight:40});
			this.showbtn();
			this.event();
		},
		event: function() {
			if (H.photo.isTrue) {
				H.photo.isTrue = false;
				$('.show').click(function(e) {
					e.preventDefault();
					if (H.photo.uuid.length > 0) {
						setTimeout(function() {
							toUrl('collect.html?uuid=' + H.photo.uuid);
						}, 50);
					} else {
						return;
					}
				});
				$('.more').click(function(e) {
					e.preventDefault();
					$('.more').removeClass('hasmore').addClass('nomore').find('a').html('正在拼命加载');
					if (H.photo.showPage < H.photo.maxpage && H.photo.loadmore) {
						if (H.photo.history == 'open') {
							if ((H.photo.showPage - 1) == H.photo.commNum) {
								if (H.photo.listTrue) {
									H.photo.listTrue = false;
								};
								getResult('gzlive/photo/detailact', {
									actUuid: H.photo.historyuuid,
									page: H.photo.showPage,
									pageSize: H.photo.showPagesize
								}, 'photoDetailActHandler', true, null);
							};
						} else {
							if ((H.photo.showPage - 1) == H.photo.commNum) {
								if (H.photo.listTrue) {
									H.photo.listTrue = false;
								};
								getResult('gzlive/photo/index', {
									openid: openid,
									page: H.photo.showPage,
									pageSize: H.photo.showPagesize
								}, 'photoIndexHandler', true, null);
							};
						};
				    } else {
						$('.more').removeClass('nomore').addClass('hasmore').find('a').html('点击加载更多');
				    }
				});
				$('.back-btn').click(function(e) {
					e.preventDefault();
					toUrl('index.html');
				});
				$('.preshow').click(function(e) {
					e.preventDefault();
					toUrl('preshow.html');
				});
			};
			$('.zanbtn').click(function(e) {
				e.preventDefault();
				if ($(this).hasClass('requesting')) {
					showTips('往期话题不可以点赞哦~');
					return;
				};
				H.photo.zanuuid = $(this).attr('data-uuid') || '';
				H.photo.zanSelector = this;
				getResult('gzlive/photo/vote', {
					openid: openid,
					actUuid: H.photo.uuid,
					recordUuid: H.photo.zanuuid
				}, 'photeVoteHandler', true, null);
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
							$(me).find('ul li:first').appendTo($ul)
							$(me).find('ul').css({'margin-top': '0'});
						});
					}, 3000);
				};
			});
		},
		showbtn: function() {
			var maxHeight = 0,
				pageHeight = 0;
		    $(window).scroll(function(){
		        var srollHeight = $(window).scrollTop();
		        pageHeight = parseFloat($(window).height()) + parseFloat(srollHeight);
		        if (($(document).height() - maxHeight) <= pageHeight) {
		        	$('.show').removeClass('bounceInUp').addClass('bounceOutDown');
		        } else {
		        	$('.show').removeClass('bounceOutDown').addClass('bounceInUp');
		        };
		    });
		}
	};

	W.photoIndexHandler = function(data) {
		$('.main').animate({'opacity':'1'}, 500).css('z-index', '0');
		$('.more').removeClass('nomore').addClass('hasmore').find('a').html('点击加载更多');
		if (data.code == 0) {
			H.photo.listTrue = true;
			if (data.current.length < H.photo.showPagesize) {
				$('.more').addClass('none');
				H.photo.loadmore = false;
			};
			if(data.current.length == H.photo.showPagesize){
				if(H.photo.showPage == 0){
					H.photo.commNum = 1;
					H.photo.showPage = 2;
				}else{
					H.photo.commNum = H.photo.showPage;
					H.photo.showPage++ ;
				}
			};
			H.photo.uuid = data.au;
			H.photo.fill(data);
			$('.main').removeClass('none');
		} else if (data.code == 4) {
			setTimeout(function() {
				toUrl('preshow.html');
			}, 50);
			$('.main').removeClass('none');
		} else {
			showTips('请等待下期话题哦~');
			$('.main').addClass('none');
			setTimeout(function() {
				toUrl('index.html');
			}, 2200);
		};
	};
	
	W.photoDetailActHandler = function(data) {
		$('.main').animate({'opacity':'1'}, 500).css('z-index', '0');
		$('.more').removeClass('nomore').addClass('hasmore').find('a').html('点击加载更多');
		if (data.code == 0) {
			H.photo.listTrue = true;
			if (data.current.length < H.photo.showPagesize) {
				$('.more').addClass('none');
				H.photo.loadmore = false;
			};
			if(data.current.length == H.photo.showPagesize){
				if(H.photo.showPage == 0){
					H.photo.commNum = 1;
					H.photo.showPage = 2;
				}else{
					H.photo.commNum = H.photo.showPage;
					H.photo.showPage++ ;
				}
			};
			H.photo.uuid = data.au;
			H.photo.fillhistory(data);
			$('.main').removeClass('none');
		} else {
			showTips('马上带您回到本期话题哦~');
			$('.main').addClass('none');
			setTimeout(function() {
				toUrl('show.html');
			}, 2200);
		};
	};

	W.photeVoteHandler = function(data) {
		if (data.code == 0) {
			$(H.photo.zanSelector).find('.icon').removeClass('false').addClass('true');
			var voteNum = parseInt($(H.photo.zanSelector).find('.number').html()) + 1;
			$(H.photo.zanSelector).find('.number').html(voteNum);
		} else if (data.code == 5) {
			showTips('亲，您已经投过票了');
		};
	};
	
})(Zepto);

$(function() {
	H.photo.init();
});