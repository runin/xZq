/**
 * 广告
 */
(function($) {
	H.index = {
		$front: $('#wrapper-front'),
		$back: $('#wrapper-back'),
		uuid: null,
		request_cls: 'requesting',
		disabled_cls: 'disabled',
		$loading: $("#loading"),
		firstLoad: true,

		init: function() {
			showLoading($("#loading"));
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
			getResult('advertise/index', {
				cuid : channelUuid,
				openid : openid,
				serviceNo : serviceNo
			}, 'advertiseIndexHander', true);

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
						hideLoading($("#loading"));
						H.index.firstLoad = false;
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
            $('.btn-share').click(function() {
                share();
            });

			H.sign.$btn_award.click(function(e) {
				e.preventDefault();

				var request_cls = H.index.request_cls;
				if ($(this).hasClass(request_cls)) {
					return;
				}

				var $mobile = H.sign.$mobile_award,
					$name = H.sign.$name,
					mobile = $.trim($mobile.val()),name = $.trim($name.val());

				if (!name) {
					alert('请先输入姓名');
					$name.focus();
					$(this).removeClass(me.request_cls);
					return false;
				}
				if (!mobile || !/^\d{11}$/.test(mobile)) {
					alert('请先输入正确的手机号');
					$mobile.focus();
					$(this).removeClass(request_cls);
					return false;
				}

				$(this).addClass(request_cls);
				$(this).addClass('btn-awided');
				getResult('advertise/awardprize', {
					openid : openid,
					serviceNo : serviceNo,
					phone : mobile,
					userName : encodeURIComponent(name),
					infoUuid: H.index.uuid
				}, 'awardPrizeHander');

			});
		}
	};

	H.page = {
		$pages: $('#pages'),
		preload_cls: 'preload',
		pageIndex:0,
		signPage:0,
		init: function() {
			this.$pages.parallax({
				direction: 'vertical', 	// horizontal (水平翻页)
				swipeAnim: 'cover', 	// cover (切换效果)
				drag:      true,		// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
				loading:   false,		// 有无加载页
				indicator: false,		// 有无指示点
				arrow:     true,		// 有无指示箭头
				onchange: function(index, element, direction) {
					H.page.pageIndex = index;
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
                            $target.removeClass('page-swipe');
						}
					}
					setTimeout(function() {
						recordUserOperate(openid, "滑动切换页面", "ad-house-section-" + index);
					}, 300);
				}
			});

			$('.content')
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
				getResult('advertise/checkprize', {
					openid: openid,
					advertiseUuid: H.index.uuid,
					serviceNo: serviceNo,
					stationUuid: stationUuid
				}, 'checkPrizeHander', true, H.sign.$sign);
			} else {
				showLoading($("#loading"));
				H.page.disable();
				$.ajax({
					type : 'GET',
					async : false,
					url : domain_url + 'advertiseattr/advertisedetail/' + uuid,
					dataType : "jsonp",
					jsonp : "callback",
					jsonpCallback : "advertiseDetailHander",
					complete: function() {
						if(!H.index.firstLoad){
							hideLoading($("#loading"));
						}
						H.page.enable();
					},
					success : function(data) {
						if (data.code != 0) {
							return;
						}
						H.page.loaded($target);
						if (type != 4) {
							$target.css('background-image', 'url( ' + data.lg + ')');
							var back_size = '340px',
								i = $target.attr('data-id')-2;
							if(window.screen.width==320){
								back_size = '300px';
								$target.find('#page-logo' + i).addClass('ip-pagelogo');
							}else{
								$target.find('#page-logo' + i).addClass('page-logo1');
							}

							$target.find('#page-logo' + i).css({
								'background-image': 'url( ' + data.ci + ')',
								'background-size':back_size +' auto'
							});

						}
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
		}
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
		}
	};

	H.sign = {
		$sign: $('#sign'),
		$name: $('#s-name'),
		$mobile: $('#s-mobile'),
		$mobile_award: $('#a-mobile'),
		$btn_award: $('#btn-award'),
        $b_click : $('#b-click'),
        $invite :$('#invite'),
		disable: function(msg) {
			this.$name.attr('disabled', 'disabled');
			this.$mobile.attr('disabled', 'disabled');
		},
		// 抽奖
		lottery: function() {},

        sign_fill:function(data){
			$(".title-top").html(data.pp);//奖品价格
            $("#title-brand").html(data.pb);//奖品主标题
            $("#title-name").html(data.pn);//奖品副标题
            $("#a-mobile").val(data.ph);//用户手机号
        },
        sign_success_fill:function(data){
        	$(".result-jz").html(data.pp);
        	$(".prize-brand").html(data.pb);
        	$(".prize-name").html(data.pn);
        	$(".tuhao").html(data.tt);
        	$(".house-username").html(data.ns);
	        $(".house-mibile").html(data.ph);
	        $('.tel-ctrl').attr('href','tel:'+data.stl);
			$('.tel-ctrl').append('<label>电话咨询</label><span><br/>'+ data.stl +'</span>');
        }
	};

	H.audio = {
		$audio: $('.ui-audio'),
		$audio_btn: $('.audio-icon'),
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

				me.$audio_btn.addClass('animated');
				$.fn.coffee.start();
				$('.coffee-steam-box').show(500);
			})

			$(me.audio).on('pause', function() {
				audio_txt(txt, false, time_txt)
				me.$audio_btn.removeClass('animated');
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
        $house_map :$('.house-map'),
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
		},

        map_fill:function(data) {
            H.map.$house_map.attr('data-longitude',data.alot);
            H.map.$house_map.attr('data-latitude',data.alat);
            H.map.$house_map.attr('data-detal',"{'sign_name':'','contact_tel':'" + data.stl + "','address':'" + data.adr + "'}");
        }
	};

	H.swipe = {
		$swipe: $('#swipe'),
		$swipe_img:$('.swipe-img'),
		$mySwipe : '',

		init: function() {
			$mySwipe = Swipe(this.$swipe.get(0), {
				stopPropagation: false,
				callback : function(index, elem){
					for(var i = 0 ;i<$mySwipe.getNumSlides();i++){
						var a =  "img-title";
						if(window.screen.height==568 || (799 < window.screen.height  && window.screen.height < 961)){
							a = "img-title-ip5";
						}else if(window.screen.height==480){
							a = "img-title-ip4";
						}
						if(i == index){
							$("#img"+index).parent().addClass(a+index);
						}else{
							$("#img"+i).parent().removeClass(a+i);
						}
					}
				}
			});
		}


	};

	H.lottery = {
		$dialog: $('#lottery-dialog'),
		BROKEN_CLS: 'broken',
		ANIMATED_CLS: 'animated',
		init: function() {
			var me = this;
			$('#main').css({ 'width': $(window).width(), 'height': $(window).height() });
			
			W.lc = parseInt(getQueryString('lc'));
			this.$dialog.find('strong').text(W.lc);
			
			this.event();
			this.open();
		},
		
		open: function() {
			var me = this;
			$('.modal').addClass('none');
			this.$dialog.removeClass(this.BROKEN_CLS).removeClass(this.ANIMATED_CLS).removeClass('none');
			
			var $btn_hammer = this.$dialog.find('.btn-hammer').addClass(this.ANIMATED_CLS);
			setTimeout(function() {
				$btn_hammer.removeClass(me.ANIMATED_CLS);
			}, 800);
		},
		
		shake: function() {
			W.addEventListener('shake', H.lottery.shake_listener, false);
		},
		
		unshake: function() {
			W.removeEventListener('shake', H.lottery.shake_listener, false);
		},
		
		shake_listener: function() {
			var $dialog = H.lottery.$dialog;
			if ($dialog.hasClass('none')) {
				return;
			}
				$dialog.find('.btn-hammer').trigger('click');
		},
		
		event: function() {
			var me = this;
			this.$dialog.find('.btn-hammer').click(function(e) {
				if(H.index.signPage == H.page.pageIndex){
					var $me = $(this);
					e.preventDefault();
					
					$me.addClass(me.ANIMATED_CLS);
					setTimeout(function() {
						me.$dialog.addClass(me.BROKEN_CLS);
					}, 400);
					setTimeout(function() {
						$me.removeClass(me.ANIMATED_CLS);
					}, 800);
	
					me.animate();
				}
			});
			
			this.shake();
		},
		animate: function(data) {
			var me = this;
			setTimeout(function() {
				me.$dialog.addClass(me.ANIMATED_CLS);
			}, 400);
			setTimeout(function() {
				me.$dialog.addClass('none');
				$('.invite-befor').removeClass('none');
				$('#lottery-result').removeClass('none');
			}, 1100);
		},
		reset: function() {
			this.$dialog.removeClass(this.BROKEN_CLS).removeClass(this.ANIMATED_CLS);
		}
	};

	W.advertiseIndexHander = function(data) {
		if (data.code != 0) {
			return;
		}
		H.index.uuid = data.id;

		var $cover = $('#cover'),
			$sign = $('#sign'),
			$cross = $('#cross'),
			t = simpleTpl(),
			items = data.items || [],
			has_sign = false;


        $cover.css('background-image','url('+ data.lg +')');
        $('.ui-audio').attr('data-src',data.mu);
        $('title').empty().text(data.t);
		for (var i = 0, len = items.length; i < len; i++) {
			if (items[i].tp === 3) {
				H.index.signPage = i+1;
				has_sign = true;
				$sign.removeClass('none').addClass('preload').attr('data-uuid', items[i].id).attr('data-type', items[i].tp);
			} else if(items[i].tp === 4){
				$cross.removeClass('none').addClass('preload').attr('data-uuid', items[i].id).attr('data-type', items[i].tp);

			}else {
                t._('<div class="page preload " data-uuid="'+ items[i].id +'" data-type="'+ items[i].tp +'"><div class="page-logo" id="page-logo'+i+'"></div></div>');
            }
		}
		$(t.toString()).insertAfter($cross);

		!has_sign && $sign.remove();

		H.page.init();
	};

	// 获取详情
	W.advertiseDetailHander = function(data) {
		var $swipe_wrap = $('#swipe-wrap'),
			items = data.items || [],
			win_height = $(window).height();
		if(data.code == 0){

			for (var i = 0, len = items.length; i < len; i++) {
				if(i == 0){
					$swipe_wrap.append('<div><img class="swipe-img" src="'+ items[i].bmu +'"><div class="img-title img-title'+i+'"><img id="img'+i+'"/></div></div>')
				}else{
					$swipe_wrap.append('<div><img class="swipe-img" src="'+ items[i].bmu +'"><div class="img-title"><img id="img'+i+'"/></div></div>')
				}
				$("#img"+i).attr('src',items[i].imu);
			}
			var $swipe_img = $('.swipe-img');
			$swipe_img.css('height',win_height);
		}
	};

	// 获取报名活动信息
	W.checkPrizeHander = function(data) {
		H.page.loaded(H.sign.$sign);

		$("input").each(function() {
			$(this).focus(function(){
				$('.sign-form').addClass('input-up');
			}).blur(function(){
				$('.sign-form').removeClass('input-up');
			})
		});
		if (data.code == 3) {
			H.lottery.$dialog.addClass("none");
			H.sign.$invite.removeClass('none');
			H.sign.sign_success_fill(data);
	        H.map.map_fill(data);

		}
		if (data.code == 4) {
			H.sign.sign_fill(data);
			H.lottery.init();
		}
	};

	// 领奖
	W.awardPrizeHander = function(data) {
		if (data.code != 0) {
			alert(data.message);
			return;
		}

		H.sign.$btn_award.addClass('disabled');
		H.sign.$name.attr('disabled', 'disabled');
		H.sign.$mobile_award.attr('disabled', 'disabled');

		$('.invite-befor').addClass('none');
        H.sign.$invite.removeClass('none');
        H.sign.sign_success_fill(data);
        H.map.map_fill(data);
	};

    W.phoneScale = parseInt(window.screen.width) / 320;
    
    $.fn.meteor = function(options) {
		var defaults = {
			starCount: 10,
			meteorCount: 10
		};
		var settings = $.extend(defaults, options),
			width = $(window).width(),
			height = $(window).height();
		for (var left, top, num, delay, second, i = '', j = 0; j < settings.starCount; j ++) {
			left = (width * Math.random()).toFixed(2);
			top = (height * Math.random()).toFixed(2);
			delay = Math.random().toFixed(2);
			second = (1 + 4 * Math.random()).toFixed();
			num = Math.round(1 + 3 * Math.random());
			i += '<i class="star style' + num + '" style="left:' + left + "px; top:" + top + "px; -webkit-animation-delay:" + delay + "s; -webkit-animation: star " + second + 's linear infinite;"></i>';
		}
		
		for (var j = 0; j < settings.meteorCount; j++) {
			left = (520 * Math.random() - 210).toFixed(2);
			top = (100 * Math.random() - 80).toFixed(2);
			delay = (.5 + 2.5 * Math.random()).toFixed();
			second = (1.2 + 2.8 * Math.random()).toFixed();
			num = Math.round(1 + 3 * Math.random());
			i += '<i class="meteor style' + num + '" style="left:' + left + "px; top:" + top + "px; -webkit-animation-delay:" + delay + "s; -webkit-animation: meteor " + second + 's linear infinite;"></i>';
		}
		$(this).append(i);
	};

	$('.meteor').meteor({
		starCount: 30,
		meteorCount: 20
	});

})(Zepto);

H.index.init();

