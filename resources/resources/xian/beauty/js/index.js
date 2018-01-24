/**
 * 广告
 */
(function($) {
	H.index = {
		uuid: null,
		request_cls: 'requesting',
		disabled_cls: 'disabled',

		init: function() {
			var me = this;

			H.map.map_create();



			this.event_handler();
			
			// 首页
			getResult('travel/enter/foodindex', {
				cuid : channelUuid,
				openid : openid,
				serviceNo : serviceNo
			}, 'callbackFoodEnterHander', true);
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
				$('.masking').addClass('none');
				H.page.enable();
			});
			
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
				getResult('advertise/enter/award', {
					openid : openid,
					enterPrizelogUuid : $(this).attr('pluid'),
					phone : mobile,
					userName : encodeURIComponent(name),
					responseId: getQueryString('resopenid')
				}, 'callbackAdvertiseAwardHander');
				
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

					if (direction != 'backward') {
						var $next = $('.page').eq(index + 1);
						if ($next.length > 0) {
							H.page.preload($next);
						}
						if ($target.hasClass('page-swipe')) {
							H.swipe.init();
                            $target.removeClass('page-swipe');
						}

						var height = $('.content-fu').height(),
							inner_height = $target.find('.content-container').height();

						if (inner_height > height) {
							$target.find('.triangle').removeClass('none');
						}else{
							$target.find('.triangle').addClass('none');
						}
					}
					setTimeout(function() {
						recordUserOperate(openid, "滑动切换页面", "beauty-section-" + index);
					}, 300);
				}
			});

			$('.triangle-zjmh').click(function() {
				$('.zoujin-zjmh').removeClass('content-fu');
				$('.triangle-zjmh').hide('none');
			});

			$('.triangle-zj').click(function() {
				$('.zoujin-zj').removeClass('content-fu');
				$('.triangle-zj').hide();
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
				getResult('advertise/enter/checklottery', {
					openid: openid,
					enterUuid: H.index.uuid,
					serviceNo: serviceNo,
					stationUuid: stationUuid,
					channelUuid: channelUuid
				}, 'callbackCheckLotteryHander', true, H.sign.$sign);
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
						$target.find('.b-zjimg').attr('src',data.lg);
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
			$('.masking').removeClass('none');
		},
		
		lottery: function(data) {
			var $sign_lty = $('#sign-lottery'),
				$lottery = $('#lottery-container'),
				$lottery_rlt = $('#lottery-result');

			$('.sign-dialog').addClass('none');
			
			$sign_lty.find('.lottery-item').addClass('none');
			$lottery.removeClass('none');
			$sign_lty.removeClass('none');
			
			var $body = $sign_lty.find('.sd-body'),
				lott_width = $(window).width()*0.9,
				lott_height = $(window).height()*0.68;
			
			$body.css({width: lott_width, height: lott_height});
			var lottery = new Lottery($lottery.get(0), 'images/b-gua.jpg', 'image', lott_width, lott_height, function() {
				$lottery.addClass('none');
				$lottery_rlt.removeClass('none');
				H.page.enable();
				/*更新活动抽奖状态为已刮奖*/
				getResult('advertise/enter/updateStatus', {
					enterPrizelogUuid: H.sign.$btn_award.attr('pluid')
				}, 'callbackUpdateStatusHander', true, H.sign.$sign);

			});
			lottery.init( data.piu, 'image');
		},
		
		award: function(phone) {
			$('#tip-phone').append('&nbsp;&nbsp;' + phone);
			$('.lottery-item').addClass('none');
			$('#lottery-share').removeClass('none');


			$('.lottery-item').addClass('none');
			$('#lottery-result').removeClass('none');
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
			this.$btn_sign.addClass(H.index.disabled_cls);
			msg && this.$btn_sign.text(msg);
		},
		// 抽奖
		lottery: function() {},


		sign_fill: function(data){
			$(".award-info").html(data.ltp);//ltp运气太好了，恭喜您获得价值238元的4d生物美学免费洁牙1次"
			$(".award-state").html(data.wpt);//wpt请填写您的手机号，以便顺利领奖
			$("#result-img").html('<img src="'+ data.piu +'" />');//牙齿图
		},
		sign_success_fill: function(data){
			H.sign.$invite.find('h1').text(data.ltp);
			$('.invite-sm').text(data.st);//"st": "成功邀请5个好友参与活动，就能打开千元美容大奖礼包。",
			$('#sign-rule').find('.sd-body').html(data.ad);//"ad":活动规则
		},
		open_gift: function(data){
			H.sign.$b_click.click(function(e){
				e.preventDefault();
				H.sign.$invite.addClass('none');
				$('.open-gift').removeClass('none');
				$('.tel-ctrl').attr('href','tel:'+data.stl);


				for(var i= 0,len_ite =data.items.length;i < len_ite;i ++) {
					$('#ling-gift').append('<h1 class="ling-title">' + data.items[i].pn + '</h1><img src=" '+  data.items[i].piu + '">');
				}

				getResult('advertise/enter/openPrize', {
					openid : openid,
					serviceNo : serviceNo,
					enterUuid: H.index.uuid
				}, 'callbackOpenPrizeHander');
			})
		},

		friend_li_fill: function(data){
			var len =data.sitems.length;
			$('.invite-gm').addClass('none');
			$('#invite-ul').removeClass('none');
			if(len <= share_number){
				for(var i= 0;i < len;i ++){
					$('#invite-ul').append('<li>' + (i+1) + ' 、 <span class="username">' + data.sitems[i].un + '</span> <span class="mobile">'+data.sitems[i].ph +'</span></li>');
				}
			}
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
		$sign_map :$('#sign-map'),
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

		map_fill: function(data) {
			$('#addr').attr('src',data.au);//au 地图
			H.map.$sign_map.attr('data-longitude',data.alot);
			H.map.$sign_map.attr('data-latitude',data.alat);
			H.map.$sign_map.attr('data-detal',"{'sign_name':'','contact_tel':'" + data.stl + "','address':'" + data.adr + "'}");
		}
	};
	
	H.swipe = {
		$swipe: $('#swipe'),
		$swipe_img:$('.swipe-img'),

		init: function() {
			Swipe(this.$swipe.get(0), {
				stopPropagation: false
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
			$cross = $('#cross'),
			t = simpleTpl(),
			items = data.items || [],
			win_width = $(window).width(),
			win_height = $(window).height(),
			has_sign = false,
			show_flag = 0;

            $('.ui-audio').attr('data-src',data.mu);
            $('title').empty().text(data.t);
			$cover.find('.content').html('<img id="logo" class="logo" src="'+ data.lg +'" />');
		var logoSize = Math.ceil(win_width*0.89),$logo = $('#logo');
			$logo.css({'top': (win_height - logoSize) / 2});

		for (var i = 0, len = items.length; i < len; i++) {
			if (items[i].tp === 3) {
				has_sign = true;
				$sign.removeClass('none').addClass('preload').attr('data-uuid', items[i].id).attr('data-type', items[i].tp);
			} else if(items[i].tp === 5){
				$cross.removeClass('none').addClass('preload').attr('data-uuid', items[i].id).attr('data-type', items[i].tp);

			}else {
				show_flag++;
				if(show_flag == 1){
						t._('<div class="page preload page-sec" data-uuid="'+ items[i].id +'" data-type="'+ items[i].tp +'">' +
							'<div class="content">' +
								'<h2><img class="b-zjimg" src="#"></h2>' +
								'<div class="content-fu zoujin-zjmh zoujin-fu">' +
									'<div class="content-container"></div>' +
								'</div><a class="triangle triangle-zjmh none" data-collect="true" data-collect-flag="beauty-zjmh" data-collect-desc="医院简介介绍显示更多按钮"></a>' +
							'</div>' +
						'</div>');
				}else{
					t._('<div class="page preload page-firs" data-uuid="'+ items[i].id +'" data-type="'+ items[i].tp +'">' +
						'<div class="content">' +
							'<h2 class="b-zjtit f-right"><img class="b-zjimg" src="#"></h2><div class="clear"></div>' +
							'<div class="zoujin-zj zoujin-fu content-fu f-right">' +
								'<div class="content-container"></div>' +
							'</div><div class="clear"></div><a class="triangle triangle-zj f-right none" data-collect="true" data-collect-flag="beauty-zj" data-collect-desc="医院专家介绍显示更多按钮"></a>' +
						'</div><p class="b-zj"><img src="http://test.holdfun.cn/portal/resources/beauty/images/b-zj.png"></p>' +
					'</div>');
				}
			}
		}
		$(t.toString()).insertAfter($cover);

		!has_sign && $sign.remove();

		H.page.init();

        H.audio.init();
        H.audio.event_handler();
        setTimeout(H.audio.audio_contorl(),1);
        $(document).one("touchstart", function() {
            H.audio.audio.play();
        });
	};
	
	// 获取详情
	W.callbackFoodDetailHander = function(data) {
		var $swipe_wrap = $('#swipe-wrap'),
			items = data.items || [],
			win_height = $(window).height();
		if(data.code == 0){
			for (var i = 0, len = items.length; i < len; i++) {
				$swipe_wrap.append('<div><img class="swipe-img" src="'+ items[i].imu +'"></div>')
			}
			var $swipe_img = $('.swipe-img');
			$swipe_img.css('height',win_height);
		}
	};
	
	// 获取报名活动信息
	W.callbackCheckLotteryHander = function(data) {
		H.page.loaded(H.sign.$sign);
		var img_2600 = 'http://test.holdfun.cn/portal/resources/beauty/images/2600.png',
		 	img_click = 'http://test.holdfun.cn/portal/resources/beauty/images/b-click.png';

		$("input").each(function() {
			$(this).focus(function(){
				$('.sign-form').addClass('input-up');
			}).blur(function(){
				$('.sign-form').removeClass('input-up');
			})
		});

		if (data.code == 0 || data.code == 5) {

			$('.invite-befor').removeClass('none');
			$('.sign-gua').removeClass('none');
			H.dialog.lottery(data);

			H.sign.sign_fill(data);
			H.map.map_fill(data);
			H.sign.sign_success_fill(data);


			H.sign.$btn_award.attr('pluid', data.pluid);
            H.sign.$b_click.attr('src',img_2600);
            $('.invite-gm').removeClass('none');

		}
		if (data.code == 3) {//已经刮奖且领奖成功但不满足分享条件：
            H.sign.$invite.removeClass('none');
            H.sign.$invite.find('h2').html(data.yp + data.phone);

			H.sign.sign_success_fill(data);
			H.map.map_fill(data);

			if(data.sitems != null){
				H.sign.friend_li_fill(data);
				var len = data.sitems.length;
				if(len < share_number){
					H.sign.$b_click.attr('src',img_2600);
				}else{
					H.sign.$b_click.attr('src',img_click);
					H.sign.open_gift(data);
				}
			}else{
				$('.invite-gm').removeClass('none');
				$('#invite-ul').addClass('none');
				H.sign.$b_click.attr('src',img_2600);
			}

		}
		if (data.code == 4) {
			//上一次进入刮奖页面刮奖后未领奖退出，第二次进入时：
			H.sign.$btn_award.attr('pluid', data.pluid);
			$('.invite-befor').removeClass('none');
			$('#lottery-result').removeClass('none');

			H.sign.sign_fill(data);
			H.map.map_fill(data);

			H.sign.$b_click.attr('src',img_2600);
			H.sign.sign_success_fill(data);

			$('.invite-gm').removeClass('none');
		}
		if (data.code == 7) {
			//已经刮奖且满足分享条件：
			H.sign.$invite.removeClass('none');
			H.sign.$invite.find('h2').html(data.yp + data.phone);
			$('.tel-ctrl').text(data.stl);

			H.sign.sign_success_fill(data);
			H.map.map_fill(data);

			H.sign.friend_li_fill(data);


			H.sign.$b_click.attr('src',img_click);
			H.sign.open_gift(data);
		}
		if (data.code == 6) {
			//满足分享条件且已经领取礼包：

			$('.open-gift').removeClass('none');
			$('.tel-ctrl').text(data.stl);
			$('.tel-ctrl').attr('href','tel:'+data.stl);

			for(var i= 0,len_ite =data.items.length;i < len_ite;i ++) {
				$('#ling-gift').append('<h1>' + data.items[i].pn + '</h1><img src=" '+ data.items[i].piu + '">');
			}


		}
	};

	W.callbackUpdateStatusHander = function(data) {}

	
	// 领奖
	W.callbackAdvertiseAwardHander = function(data) {
		if (data.code != 0) {
			alert(data.message);
			return;
		}
		
		H.dialog.award(data.phone);

		H.sign.$btn_award.addClass('disabled');
		H.sign.$name.attr('disabled', 'disabled');
		H.sign.$mobile_award.attr('disabled', 'disabled');

		$('.invite-befor').addClass('none');
        H.sign.$invite.removeClass('none');
        H.sign.$invite.find('h2').html(data.yp + data.phone);
	};

    W.callbackOpenPrizeHander = function(data){}
	
    W.phoneScale = parseInt(window.screen.width) / 320;
	
})(Zepto);

H.index.init();

