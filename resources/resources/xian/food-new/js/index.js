/**
 * 美食
 */
(function($) {
	H.index = {
		$front: $('#wrapper-front'),
		$back: $('#wrapper-back'),
		uuid: null,
		request_cls: 'requesting',
		disabled_cls: 'disabled',
		
		init: function() {
			var me = this;
			var lottery = new Lottery(this.$front.get(0), 'images/front.jpg', 'image', $(window).width(), $(window).height(), function() {
				me.$front.removeClass('zshow');
				setTimeout(function() {
					me.$front.addClass('none');
					me.$back.removeClass('none');
				}, 1500);
				
				// 播放声音
				if (!H.audio.audio) return;
				H.audio.show();
				H.audio.audio.play();

				// 声音启动
				$(document).one("touchstart", function() {
					H.audio.audio.play();
				});
			});
			lottery.init();

			// 首页
			getResult('travel/enter/foodindex', {
				cuid : channelUuid,
				openid : openid,
				serviceNo : serviceNo
			}, 'callbackFoodEnterHander', true);
			
			var loading_time = new Date().getTime();
			$(window).on('load', function() {
				var now = new Date().getTime(),
					loading_end = false,
					time,
					time_del = now - loading_time;

				if (time_del >= 2200) {
					loading_end = true;
				}

				if (loading_end) {
					time = 0;
				} else {
					time = 2200 - time_del;
				}
				
				setTimeout(function() {
					H.map.map_create();
					me.event_handler();
					
					setTimeout(function() {
						$('.ui-alert').addClass('none');
					}, 1000)

					me.$front.addClass('zshow');
					setTimeout(function() {
						me.$back.removeClass('none');
					}, 1000);
					
					H.audio.init();
					H.audio.event_handler();

				}, time);
			});
		},
		
		event_handler: function() {
			var me = this;
			$('.btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule();
			});
			
			$('.btn-closedlg').click(function(e) {
				e.preventDefault();
				$('.sign-dialog').addClass('none');
				H.page.enable();
			});
			
			$('.btn-share').click(function() {
				share();
			});
			
			H.sign.$btn_sign.click(function(e) {
				e.preventDefault();

				if ($(this).hasClass(me.disabled_cls) || $(this).hasClass(me.request_cls)) {
					return;
				}
				var $mobile = H.sign.$mobile,
					$name = H.sign.$name,
					mobile = $.trim($mobile.val()),
					name = $.trim($name.val());
				
				if (!name) {
					alert('请先输入姓名');
					$name.focus();
					$(this).removeClass(me.request_cls);
					return false;
				}
				if (!mobile || !/^\d{11}$/.test(mobile)) {
					alert('请先输入正确的手机号');
					$mobile.focus();
					$(this).removeClass(me.request_cls);
					return false;
				}
				
				$('.mobile').val(mobile);
				$(this).addClass(me.request_cls);
				getResult('travel/enter/sure', {
					uuid : me.uuid,
					openid : openid,
					p : mobile,
					n : encodeURIComponent(name)
				}, 'callbackTravelEnterSureHander');
			});
			
			H.sign.$btn_award.click(function(e) {
				e.preventDefault();
				
				var request_cls = H.index.request_cls;
				if ($(this).hasClass(request_cls)) {
					return;
				}
				
				var $mobile = H.sign.$mobile_award,
					mobile = $.trim($mobile.val());
				
				if (!mobile || !/^\d{11}$/.test(mobile)) {
					alert('请先输入正确的手机号');
					$mobile.focus();
					$(this).removeClass(request_cls);
					return false;
				}
				
				$(this).addClass(request_cls);
				getResult('travel/enter/award', {
					enterPrizelogUuid : $(this).attr('puuid'),
					openid : openid,
					phone : mobile
				}, 'callbackTravelAwardHander');
				
			});
		}
	};
	
	H.page = {
		$pages: $('#pages'),
		preload_cls: 'preload',
		init: function() {
			this.$pages.parallax({
				direction: 'vertical', 	// horizontal (水平翻页)
				swipeAnim: 'cover', 	// cover (切换效果)
				drag:      true,		// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
				loading:   false,		// 有无加载页
				indicator: false,		// 有无指示点
				arrow:     true,		// 有无指示箭头
				onchange: function(index, element, direction) {
					var $target = $(element);
					if ($target.hasClass('sign')) {
						H.audio.$audio.addClass('zlow');
					} else {
						H.audio.$audio.removeClass('zlow');
					}
					$target.find('.content').scrollTop(0);
					if (direction != 'backward') {
						var $next = $('.page').eq(index + 1);
						if ($next.length > 0) {
							H.page.preload($next);
						}
						
						if ($target.hasClass('page-swipe')) {
							H.swipe.init();
						}
					}
				}
			});
			
			$('.content')
				.on('touchstart', function() {
					var height = $(this).height(),
						inner_height = $(this).find('.content-container').height();

					if (inner_height > height) {
						H.page.disable();
					}
				})
				.on('touchend', function() {
					H.page.enable();
				});
		},
		
		preload: function(element) {
			var $target = $(element),
				type = $target.attr('data-type'),
				uuid = $target.attr('data-uuid');
			
			if (!$target.hasClass(H.page.preload_cls)) {
				return;
			}
			if (type == 3) {
				getResult('travel/enter/signdetail', {
					uuid: H.index.uuid,
					openid: openid,
					stationUuid: stationUuid
				}, 'callbackSignDetailHander', true, H.sign.$sign);
			} else {
				showLoading($target);
				$.ajax({
					type : 'GET',
					async : false,
					url : domain_url + 'travel/enterattr/fooddetail/' + uuid,
					dataType : "jsonp",
					jsonp : "callback",
					jsonpCallback : "callbackFoodDetailHander",
					complete: function() {
						hideLoading($target);
					},
					success : function(data) {
						if (data.code != 0) {
							return;
						}
						H.page.loaded($target);
						$target.find('.content-container').html(data.c);
					}
				});
			}
		},
		
		loaded: function($tg) {
			if ($tg && $tg.length > 0) {
				$tg.removeClass(this.preload_cls);
			}
		},
		enable: function() {
			this.$pages.removeClass(H.index.disabled_cls);
		},
		
		disable: function() {
			this.$pages.addClass(H.index.disabled_cls);
		},	
	};
	
	H.utils = {
		is_own_empty: function(obj) {
			for (var name in obj) {
				if (obj.hasOwnProperty(name)) {
					return false;
				}
			}
			return true;
		},
		scroll_stop: function() {
			$(window).on('touchmove.scroll', this.scroll_control);
			$(window).on('scroll.scroll', this.scroll_control);
		},
		scroll_start: function() {
			$(window).off('touchmove.scroll');
			$(window).off('scroll.scroll');
		},
		scroll_control: function(e) {
			e.preventDefault();
		},
	};

	H.dialog = {
		rule: function() {
			$('.sign-dialog').addClass('none');
			$('#sign-rule').removeClass('none');
		},
		
		lottery: function(data) {
			var $sign_lty = $('#sign-lottery'),
				$lottery = $('#lottery-container'),
				$lottery_rlt = $('#lottery-result');
			
			$('.sign-dialog').addClass('none');
			H.page.disable();
			
			$sign_lty.find('.lottery-item').addClass('none');
			$lottery.removeClass('none');
			$sign_lty.removeClass('none');
			
			var $body = $sign_lty.find('.sd-body'),
				head_h = $sign_lty.find('.sd-head').height(),
				foot_h = $sign_lty.find('.sd-foot').height(),
				height = $sign_lty.height() - head_h - foot_h - 40,
				width = $body.width();
			
			$body.css({width: width, height: height});
			var lottery = new Lottery($lottery.get(0), 'images/paint.jpg', 'image', width, height, function() {
				$lottery.addClass('none');
				$lottery_rlt.removeClass('none');
			});
			lottery.init(domain_url + data.piu, 'image');
		},
		
		award: function(phone) {
			$('#tip-phone').append('&nbsp;&nbsp;' + phone);
			$('.lottery-item').addClass('none');
			$('#lottery-share').removeClass('none');
		}
		
	};
	
	H.sign = {
		$sign: $('#sign'),
		$name: $('#s-name'),
		$mobile: $('#s-mobile'),
		$btn_sign: $('#btn-sign'),
		$mobile_award: $('#a-mobile'),
		$btn_award: $('#btn-award'),
		disable: function(msg) {
			this.$name.attr('disabled', 'disabled');
			this.$mobile.attr('disabled', 'disabled');
			this.$btn_sign.addClass(H.index.disabled_cls);
			msg && this.$btn_sign.text(msg);
		},
		// 抽奖
		lottery: function() {
			getResult('travel/enter/lottery', {
				enterUuid : H.index.uuid,
				openid : openid,
				activityUuid : null,
				stationUuid : stationUuid,
				serviceNo : serviceNo,
				channelUuid : channelUuid
			}, 'callbackTravelLotteryHander', true, this.$sign);
		},
		
		signed: function() {
			this.$btn_sign.text('恭喜您，已报名成功');
		}
		
	};
	
	H.audio = {
		$audio: $('.ui-audio'),
		audio: null,
		audio_val: true,
		zlow: function() {
			this.$audio.addClass('zlow');
		},
		
		show: function() {
			this.$audio.removeClass('zlow none');
		},
		
		init: function() {
			$('#coffee-flow').coffee({
				steams: ["<img src='./images/audio_icon.png' />", "<img src='./images/audio_icon.png' />"],
				steamHeight: 150,
				steamWidth: 44
			});
			
			var options_audio = {
				loop: true,
				preload: "auto",
				src: this.$audio.attr('data-src')
			}
			this.audio = new Audio();

			for (var key in options_audio) {
				if (options_audio.hasOwnProperty(key) && (key in this.audio)) {
					this.audio[key] = options_audio[key];
				}
			}
			this.audio.load();
		},

		event_handler: function() {
			var me = this;
			if (this.$audio.length == 0) {
				return;
			}

			var txt = me.$audio.find('.audio-txt'),
				time_txt = null;
			me.$audio.find('.btn-audio').on('click', function() {
				me.audio_contorl();
			});

			$(me.audio).on('play', function() {
				me.audio_val = false;

				audio_txt(txt, true, time_txt);

				$.fn.coffee.start();
				$('.coffee-steam-box').show(500);
			})

			$(me.audio).on('pause', function() {
				audio_txt(txt, false, time_txt)

				$.fn.coffee.stop();
				$('.coffee-steam-box').hide(500);
			});

			function audio_txt(txt, val, time_txt) {
				txt.text(val ? '打开' : '关闭');
				if (time_txt) {
					clearTimeout(time_txt);
				}

				txt.removeClass('animated hide');
				time_txt = setTimeout(function() {
					txt.addClass('animated').addClass('hide');
				}, 1000)
			}
		},

		audio_contorl: function() {
			if (!this.audio_val) {
				this.audio_stop();
			} else {
				this.audio_play();
			}
		},

		audio_play: function() {
			this.audio_val = false;
			if (this.audio) {
				this.audio.play();
			}
		},

		audio_stop: function() {
			this.audio_val = true;
			if (this.audio) {
				this.audio.pause();
			}
		}
	};
	H.map = {
		$map: $('#bdmaps'),
		map_value: null,
		map_index: null,
		
		event_handler: function(obj, eventType, fn, option) {
			var fnHandler = fn;
			if (!H.utils.is_own_empty(option)) {
				fnHandler = function(e) {
					fn.call(this, option);
				}
			}
			obj.each(function() {
				$(this).on(eventType, fnHandler);
			})
		},

		map_show: function(option) {
			var str_data = $(this).attr('data-detal');
			option.detal = str_data != '' ? eval('(' + str_data + ')') : '';
			option.latitude = $(this).attr('data-latitude');
			option.longitude = $(this).attr('data-longitude');

			var detal = option.detal,
				latitude = option.latitude,
				longitude = option.longitude,
				fnOpen = option.fnOpen,
				fnClose = option.fnClose;

			H.utils.scroll_stop();
			H.map.$map.addClass('show');
			$(document.body).animate({
				scrollTop: 0
			}, 0);

			if ($(this).attr('data-mapindex') != H.map.map_index) {
				H.map.$map.html($('<div class="bk"><span class="s-bg-map-logo"></span></div>'));
				H.map.map_value = false;
				H.map.map_index = $(this).attr('data-mapindex');

			} else {
				H.map.map_value = true;
			}

			setTimeout(function() {
				if (H.map.$map.find('div').length >= 1) {
					H.map.$map.addClass("mapOpen");
					H.page.disable();
					H.utils.scroll_stop();
					H.audio.$audio.addClass('zlow');

					setTimeout(function() {
						if (!H.map.map_value) H.map.add_map(detal, latitude, longitude, fnOpen, fnClose);
					}, 500)
				} else return;
			}, 100);
		},

		map_save: function() {
			$(window).on('webkitTransitionEnd transitionend', mapClose);
			H.page.enable();
			H.utils.scroll_start();
			H.map.$map.removeClass("mapOpen");

			if (!H.map.map_value) H.map.map_value = true;

			function mapClose() {
				H.map.$map.removeClass('show');
				$(window).off('webkitTransitionEnd transitionend');
			}
		},

		//地图函数传值，创建地图
		add_map: function(detal, latitude, longitude, fnOpen, fnClose) {
			var detal = detal,
				latitude = Number(latitude),
				longitude = Number(longitude);

			var fnOpen = typeof(fnOpen) === 'function' ? fnOpen : '',
				fnClose = typeof(fnClose) === 'function' ? fnClose : '';

			//默认值设定
			var a = {
				sign_name: '',
				contact_tel: '',
				address: '天安门'
			};

			H.utils.is_own_empty(detal) ? detal = a : detal = detal;
			!latitude ? latitude = 39.915 : latitude = latitude;
			!longitude ? longitude = 116.404 : longitude = longitude;

			H.map.$map.bdmap({
				detal: detal, //地址值
				latitude: latitude, //纬度
				longitude: longitude, //经度
				fnOpen: fnOpen, //回调函数，地图开启前
				fnClose: fnClose //回调函数，地图关闭后
			});
		},

		map_create: function() {
			if ($('.bd-map').length <= 0) return;
			var node = $('.bd-map');

			var option = {
				fnOpen: H.utils.scroll_stop,
				fnClose: H.map.map_save
			};
			H.map.event_handler(node, 'click', H.map.map_show, option);
		}
	};
	
	H.swipe = {
		$swipe: $('#swipe'),
		init: function() {
			Swipe(this.$swipe.get(0), {
				stopPropagation: true
			});
		}
	};
	
	W.callbackFoodEnterHander = function(data) {
		if (data.code != 0) {
			return;
		}
		H.index.uuid = data.id;
		
		var $cover = $('#cover'),
			$sign = $('#sign'),
			t = simpleTpl(),
			items = data.items || [],
			has_sign = false;
		
		$cover.find('.content').html('<img src="'+ domain_url + data.lg +'" /><h2>'+ data.an +'</h2>');
		
		for (var i = 0, len = items.length; i < len; i++) {
			if (items[i].tp === 3) {
				has_sign = true;
				$sign.removeClass('none').addClass('preload').attr('data-uuid', items[i].id).attr('data-type', items[i].tp);
			} else {
				t._('<div class="page preload" data-uuid="'+ items[i].id +'" data-type="'+ items[i].tp +'"><div class="content"><div class="content-container"></div></div></div>');
			}
		}
		$(t.toString()).insertAfter($cover);
		!has_sign && $sign.remove(); 
		
		H.page.init();
	};
	
	// 获取详情
	W.callbackFoodDetailHander = function(data) {};
	
	// 获取报名活动信息
	W.callbackSignDetailHander = function(data) {
		H.page.loaded(H.sign.$sign);
		$('#sign-rule').find('.sd-body').html(data.ad);
		$('#addr').html(data.adr);
		if (data.code == 3) {
			H.sign.$btn_sign.addClass('disabled').text(data.message);
			H.sign.$name.val(data.na).attr('disabled', 'disabled');
			H.sign.$mobile.val(data.ph).attr('disabled', 'disabled');
		}
	};
	
	// 提交报名
	W.callbackTravelEnterSureHander = function(data) {
		H.sign.$btn_sign.removeClass(H.index.request_cls);
		H.sign.disable();
		if (data.code == 0) {
			H.sign.signed();
			H.sign.lottery();
		}
	};
	
	// 抽奖
	W.callbackTravelLotteryHander = function(data) {
		H.sign.$btn_award.removeClass(H.index.request_cls);
		
		if (data.code != 0) {
			alert(data.message);
			return;
		}

		if (data.prizeType == 3) {
			$("#result-tip").find('.tip-fail').removeClass('none');
		} else {
			$("#result-tip").find('.tip-win').removeClass('none');
		}
		
		// 结果弹层内容
		$(".result-tip").find('h3').html(data.ltp);
		$("#result-img").html('<img src="'+ domain_url + data.piu +'" />');
		$("#mobile-label").text(data.wpt);
		H.sign.$btn_award.attr('puuid', data.puuid);
		
		// 分享弹层内容
		$('#share-content').html('<p id="tip-phone">'+ data.yp +'</p>')
			.append(data.pt)
			.append('<p>'+ data.cps + '&nbsp;&nbsp;'+ data.ct +'</p>');
		
		H.dialog.lottery(data);
	};
	
	// 领奖
	W.callbackTravelAwardHander = function(data) {
		if (data.code != 0) {
			alert(data.message);
			return;
		}
		
		H.dialog.award(data.phone);
	};
	
    W.phoneScale = parseInt(window.screen.width) / 320;
	
})(Zepto);

H.index.init();
