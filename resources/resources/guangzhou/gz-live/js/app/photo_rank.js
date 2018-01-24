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
			var me = this, winH = $(window).height();
			$('body').addClass('rank');
			$('.main').css('min-height', winH);
			me.historyTrue = false;
			getResult('gzlive/photo/index', {
				openid: openid,
				page: me.showPage,
				pageSize: me.showPagesize
			}, 'photoIndexHandler', true, null);
			getResult('gzlive/photo/record/dayranktop10', {}, 'photoDayRankTop10Handler', true, null);
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
		},
		fillrank: function(data) {
			var t = simpleTpl(), current = data.items || [], currentLen = data.items.length, defaultImg = './images/showhead.png';
			if (currentLen > 0) {
				for (var i = 0; i < currentLen; i ++) {
					t._('<div class="card" data-uuid="' + current[i].ru + '">')
						._('<div class="info clearfix">')
							._('<i class="rank"><span>第' + (i + 1) + '名</span><p>' + current[i].rvnd + '个赞</p></i>')
							._('<span class="left nhead">')
								._('<img class="head" src="' + ( current[i].ruh ? ( current[i].ruh + '/' + yao_avatar_size ) : defaultImg ) + '" border="0" />')
							._('</span>')
							._('<span class="right name">' + ( current[i].run ? current[i].run : '第一现场观众' ) + '</span>')
						._('</div>')
						._('<div class="content-box" data-uuid="' + current[i].ru + '">')
							._('<div class="swiper-container">')
								._('<div class="swiper-wrapper">')
								var imgs = current[i].ri.split(','), swiperButtonStatus = '';
								var len = imgs.length;
								for (var j = 0; j < len; j++) {
					                t._('<div class="swiper-slide">')
					                    ._('<img src="./images/loading.png" data-src="' + imgs[j] + '" class="swiper-lazy">')
					                    ._('<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>')
					                ._('</div>')
					            };
					            if (len <= 1) {
					            	var swiperButtonStatus = ' none';
					            }
								t._('</div>')
								._('<div id="swiper-button-prev" class="swiper-button-prev swiper-button-white' + swiperButtonStatus + '"><img src="./images/icon-arrow-left.png"></div>')
								._('<div id="swiper-button-next" class="swiper-button-next swiper-button-white' + swiperButtonStatus + '"><img src="./images/icon-arrow-right.png"></div>')
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
										._('<span class="commont-text">' + unescape(comm[j].cv.replace(/\\/g, "%")) + '</span>')
									._('</li>')
								}
								t._('</ul>')
							._('</div>')
						._('</div>')
					._('</div>')
				};
				$('.cards').append(t.toString());
				this.scroll({speed:40,rowHeight:40});
				this.showbtn();
				this.event();
				this.swiper();
			}
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
					if (H.photo.showPage < H.photo.maxpage && H.photo.loadmore) {
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
				    } else {
						$('.more').removeClass('nomore').addClass('hasmore').find('a').html('点击加载更多');
				    }
				});
			};
			
			$('.content-box').click(function(e) {
				e.preventDefault();
				if (!H.photo.historyTrue) {
					var topicUuid = $(this).attr('data-uuid') || '';
					if (topicUuid != '') {
						setTimeout(function() {
							toUrl('photo_detail.html?uuid=' + topicUuid );
						}, 50);
					};
				} else {
					return;
				}
			});

			// $('.zanbtn').click(function(e) {
			// 	e.preventDefault();
			// 	if (!H.photo.historyTrue) {
			// 		// if($(this).find('.icon').hasClass('true')){ return; }
			// 		H.photo.zanuuid = $(this).attr('data-uuid') || '';
			// 		H.photo.zanSelector = this;
			// 		getResult('gzlive/photo/vote', {
			// 			openid: openid,
			// 			actUuid: H.photo.uuid,
			// 			recordUuid: H.photo.zanuuid
			// 		}, 'photeVoteHandler', true, null);
			// 	} else {
			// 		H.photo.showtip('往期话题不能点赞哦~');
			// 		return;
			// 	}
			// });
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
		showtip: function(word, pos, timer) {
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
		},
        swiper: function() {
            var me = this, swiper = new Swiper('.swiper-container', {
                preloadImages: false,
                lazyLoading: true,
                spaceBetween: 85,
                loop: true
            });
            $(".swiper-box").animate({'opacity':'1'},800);
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

	W.photeVoteHandler = function(data) {
		if (data.code == 0) {
			$(H.photo.zanSelector).find('.icon').removeClass('false').addClass('true');
			var voteNum = parseInt($(H.photo.zanSelector).find('.number').html()) + 1;
			$(H.photo.zanSelector).find('.number').html(voteNum);
		} else if (data.code == 5) {
			H.photo.showtip('亲，您已经投过票了');
		};
	};
	
	W.photoDayRankTop10Handler = function(data) {
		if(data.code == 0 && data.items){
			H.photo.fillrank(data);
		}
	};
})(Zepto);

$(function() {
	H.photo.init();
});