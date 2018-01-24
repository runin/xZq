(function($) {
	H.photo = {
		uuid: '',
		zanuuid: '',
		commNum: 0,
		showPage: 1,
		showPagesize: 8,
		isTrue: true,
		aniTrue: true,
		historyTrue: true,
		zanSelector: null,
		history: getQueryString('history') || '',
		historyuuid: getQueryString('uuid') || '',
		init: function() {
			var me = this;
			if (!openid) {
				return false;
			};
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
					toUrl('photo_history.html');
				}, 50);
			};

			$('.topic-head img').attr('src', data.ai);
			$('.topic-title .topic-name').html(data.at);
			$('.topic-content .topic-desc').html(data.att);
			$('.count-total label').html(data.ac);

			if ($('.topic-name').html().length > 10 && $('.topic-name').html().length < 20) {
				$('.topic-name').css('font-size', '24px');
			} else if ($('.topic-name').html().length >= 20) {
				$('.topic-name').css('font-size', '19px');
			} else {
				$('.topic-name').css('font-size', '30px');
			};
			var cardLen = $('.card').length;
			H.photo.commNum = H.photo.showPage * H.photo.showPagesize - cardLen;
			$('.cards').empty();
			var t = simpleTpl(),
				current = data.current || [],
				currentLen = current.length,
				defaultImg = './images/showhead.png';
				for (var i = 0; i < currentLen; i ++) {
					t._('<div class="card" data-uuid="' + current[i].ru + '">')
						._('<div class="info clearfix">')
							._('<i class="rank"></i>')
							._('<span class="left nhead">')
								._('<img class="head" src="' + ( current[i].ruh ? ( current[i].ruh + '/' + yao_avatar_size ) : defaultImg ) + '" border="0" />')
							._('</span>')
							._('<span class="right name">' + ( current[i].run ? current[i].run : '第一现场观众' ) + '</span>')
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
										._('<span class="commont-name">' + ( comm[j].cn ? comm[j].cn : '第一现场观众' ) + '</span>')
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
							._('<div class="zanbtn" data-uuid="' + current[i].ru + '">')
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
			$('.tabs li:first').removeClass('active').css({'border-right':'1px solid #d4d4d4'}).find('a').css({'background-color':'transparent'}).attr('href', 'photo.html');
			$('.topic-head img').attr('src', data.ai);
			$('.topic-title .topic-name').html(data.at);
			$('.topic-content .topic-desc').html(data.att);
			$('.count-total label').html(data.ac);

			var cardLen = $('.card').length;
			H.photo.commNum = H.photo.showPage * H.photo.showPagesize - cardLen;
			$('.cards').empty();
			var t = simpleTpl(),
				current = data.current || [],
				currentLen = current.length,
				defaultImg = './images/showhead.png';
				for (var i = 0; i < currentLen; i ++) {
					t._('<div class="card" data-uuid="' + current[i].ru + '">')
						._('<div class="info clearfix">')
							._('<i class="rank"></i>')
							._('<span class="left nhead">')
								._('<img class="head" src="' + ( current[i].ruh ? ( current[i].ruh + '/' + yao_avatar_size ) : defaultImg ) + '" border="0" />')
							._('</span>')
							._('<span class="right name">' + ( current[i].run ? current[i].run : '第一现场观众' ) + '</span>')
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
										._('<span class="commont-name">' + ( comm[j].cn ? comm[j].cn : '第一现场观众' ) + '</span>')
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
							._('<div class="zanbtn" data-uuid="' + current[i].ru + '">')
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
							toUrl('photo_collect.html?uuid=' + H.photo.uuid);
						}, 50);
					} else {
						return;
					}
				});
				$('.more').click(function(e) {
					e.preventDefault();
					$('.more').removeClass('hasmore').addClass('nomore').find('a').html('正在拼命加载');
					if (H.photo.commNum <= 0) {
						H.photo.showPage++;
					};
					if (H.photo.history == 'open') {
						getResult('gzlive/photo/detailact', {
							actUuid: H.photo.historyuuid,
							page: H.photo.showPage,
							pageSize: H.photo.showPagesize * H.photo.showPage
						}, 'photoDetailActHandler', true, null);
					} else {
						getResult('gzlive/photo/index', {
							openid: openid,
							page: H.photo.showPage,
							pageSize: H.photo.showPagesize * H.photo.showPage
						}, 'photoIndexHandler', true, null);
					};
				});
			};
			if (!H.photo.historyTrue) {
				$('.content-box').click(function(e) {
					e.preventDefault();
					var topicUuid = $(this).attr('data-uuid') || '';
					if (topicUuid != '') {
						setTimeout(function() {
							toUrl('photo_detail.html?uuid=' + topicUuid );
						}, 50);
					};
				});
			} else {
				$('.content-box').click(function(e) {
					e.preventDefault();
					var topicUuid = $(this).attr('data-uuid') || '';
					if (topicUuid != '') {
						setTimeout(function() {
							toUrl('photo_detail.html?history=open&uuid=' + topicUuid + '&historyuuid=' + H.photo.historyuuid);
						}, 50);
					};
				});
			}
			$('.zanbtn').click(function(e) {
				e.preventDefault();
				// if($(this).find('.icon').hasClass('true')){ return; }
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
				com[i] = setInterval(function() {
					$(me).find('ul').animate({'margin-top': '-40px'}, delay, function() {
						$(me).find('ul li:first').appendTo($ul)
						$(me).find('ul').css({'margin-top': '0'});
					});
				}, 3000);
			});
		},
		showbtn: function() {
			var maxHeight = 60,
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
		},
		showtip: function(word, pos) {
			if (H.photo.aniTrue) {
				H.photo.aniTrue = false;
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
					'text-align': 'center'
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
							H.photo.aniTrue = true;
						}, 1850);
				});
			};
		}
	};

	W.photoIndexHandler = function(data) {
		$('.main').animate({'opacity':'1'}, 500).css('z-index', '0');
		$('.more').removeClass('nomore').addClass('hasmore').find('a').html('点击加载更多');
		if (data.code == 0) {
			H.photo.uuid = data.au;
			H.photo.fill(data);
			$('.main').removeClass('none');
		} else if (data.code == 4) {
			setTimeout(function() {
				toUrl('photo_history.html');
			}, 50);
			$('.main').removeClass('none');
		} else {
			H.photo.showtip('请等待下期话题哦~');
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
			H.photo.uuid = data.au;
			H.photo.fillhistory(data);
			$('.main').removeClass('none');
		} else {
			H.photo.showtip('马上带您回到本期话题哦~');
			$('.main').addClass('none');
			setTimeout(function() {
				toUrl('photo.html');
			}, 2200);
		};
	};

	W.photeVoteHandler = function(data) {
		if (data.code == 0) {
			$(H.photo.zanSelector).find('.icon').removeClass('false').addClass('true');
			var voteNum = parseInt($(H.photo.zanSelector).find('.number').html()) + 1;
			$(H.photo.zanSelector).find('.number').html(voteNum);
		} else if (data.code == 5) {
			H.photo.showtip('亲，您已经投过票了');
		};
	};
	
})(Zepto);

$(function() {
	H.photo.init();
});