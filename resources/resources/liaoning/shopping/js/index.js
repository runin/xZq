/**
 * 购物首页
 */
(function($) {
	
	H.index = {
		$get_red: $('#get-red'),//领取红包div
		$result_red: $('#result-red'),//领取红包结果div
		$masking: $('#masking'),
		$rob_red: $('#rob-red'),//首页抢红包
		$get_redbtn: $('#get-redbtn'),//领取红包按钮
		$first_theme: $('#first-theme'),//未领红包主题
		$share_theme: $('#share-theme'),//分享进入红包主题
		$succeed_theme: $('#succeed-theme'),
		$ul_package : $('#ul-package'),
		$renPin_friend : $('#renPin-friend'),
		$immediate_use : $('#immediate-use'),
		$result_imglogo : $('#result-imglogo'),
		$invite_friendsbtn : $('#invite-friendsbtn'),
		$add_user : $('#add-user'),
		$jin_e: $('#jin-e'),
        $rotate_img:$('#rotate-img'),
        $not_openRedfin : $('#not-openRedfin'),
		request_cls: 'requesting',
		responseId : getQueryString('resopenid'),
		staui : 0,
		itemList: [],
		itemIndex: 0,
		init: function() {

			// getResult('ikea/envelope/check/' + openid, {
			// 	serviceNo : serviceNo,
			// 	responseid: H.index.responseId
			// }, 'callbackIkeaEnvelopeCheck',true);

			this.event_handler();

			// 首页列表
			getResult('ikea/mall/item/index', {
				tsuid: stationUuid,
				index: 0,
				yo: openid
			}, 'callbackIkeaMallItemIndex', true);

			this.loadAD();
		},
		event_handler: function() {
			var me = this;

			H.index.$get_redbtn.click(function(e) {//领取红包按钮
				var type = 0;
				e.preventDefault();

				if ($(this).hasClass(me.request_cls)) {
					return;
				}

				if($(this).hasClass('help-btn')){
					type = 2;

					H.index.$get_red.addClass('none');
					H.index.$result_red.removeClass('none');
                    H.index.$masking.addClass('result-go').find('#rotate-img').hide();
				}else if($(this).hasClass('help-frienLingqu')){
					type = 2;

					$(this).removeClass('help-btn');
					H.index.$first_theme.addClass('none');
                    $('#first-imglogo').addClass('none');
                    $('#share-imglogo').removeClass('none');
					H.index.$share_theme.removeClass('none');
					$(this).text('领取红包');

					$(this).removeClass('help-frienLingqu');
					getResult('ikea/envelope/receive/' + openid + '/'+ type, {
						serviceNo : serviceNo,
						responseid: H.index.responseId
					}, 'callbackIkeaEnvelopeReceive',true);
					return;
				}else if($(this).hasClass('red-openwanBtn')){
					type = 2;
					H.index.$get_red.addClass('none');
					H.index.$result_red.removeClass('none');
				}else{
					type = 1;
					H.index.$get_red.addClass('none');
					H.index.$result_red.removeClass('none');
                    if($(this).hasClass('share-gobg')){
                        H.index.$masking.addClass('result-go').find('#rotate-img').hide();
                    }
				}

				$(this).addClass(this.request_cls);
				getResult('ikea/envelope/receive/' + openid + '/'+ type, {
					serviceNo : serviceNo,
					responseid: H.index.responseId
				}, 'callbackIkeaEnvelopeReceive',true);
			});

			H.index.$immediate_use.click(function(e){//立即使用按钮
				e.preventDefault();
				if($(this).hasClass('get-more')){
					H.index.$renPin_friend.removeClass('none').addClass('renPin-friend');
					H.index.$ul_package.removeClass('none').addClass('openshare-img');
					H.index.$invite_friendsbtn.addClass('invite-share');
					H.index.$add_user.addClass('addshare-user').find('.add-red').show();

					H.index.$result_imglogo.addClass('none');

					$(this).removeClass('get-more');
					$(this).text('立即使用');

                    H.index.$masking.addClass('result-go').find('#rotate-img').hide();
                    H.index.$not_openRedfin.addClass('not-openredfont');
				}else{
					H.index.$masking.addClass('none');
					H.index.masking_hidden();
					H.index.staui = share_type;
					share_info(0);
				}

			});

			H.index.$rob_red.click(function(e){//抢红包
				e.preventDefault();

				H.index.$masking.removeClass('none').addClass('result-go').find('#rotate-img').hide();
				H.index.masking_show();
				H.index.$result_red.removeClass('none');
				share_info(H.index.staui);
			});
		},
		masking_show: function(){
			setTimeout(function(){
				H.index.$masking.addClass('masking-open');
			},1);
		},
		masking_hidden: function(){
			setTimeout(function(){
				H.index.$masking.removeClass('masking-open');
			},1);
		},
		red_number: function (data, isShare ,isShareGo){
			var $gongxi = $('#gongxi'),

				$wan_openRedfin = $('#wan-openRedfin'),
				t = simpleTpl(),
				items = data.sitems || [],
				opened_red = null,
				not_openMum = 0;


			if(data.sitems){
				not_openMum = data.sn - data.sitems.length;
			}else{
				not_openMum = data.sn;
			}
			H.index.$add_user.find('label').text(data.cr);
			H.index.$add_user.find('span').text(data.yx);
            H.index.$not_openRedfin.text(data.wk);


			H.index.$ul_package.append('<li id="li-package" class="li-package"><label>' + data.ep + '</label><span class="dutsed used-mark"></span></li>');
			if(data.dut == 2){
				$('.dutsed').text('已使用');
			}

			if(not_openMum > 0){
                H.index.$not_openRedfin.removeClass('none');
				H.index.$invite_friendsbtn.text('撒泼打滚求打开');
			}else{
				$gongxi.addClass('none');
				H.index.$result_imglogo.addClass('none');
				$wan_openRedfin.removeClass('none').text(data.wk);
				H.index.$invite_friendsbtn.text('告诉小伙伴');

				H.index.$add_user.addClass('add-user');
				H.index.$renPin_friend.addClass('renPin-friend');
				H.index.$ul_package.addClass('openwan-img');
			}

			if(isShareGo){
				H.index.$result_imglogo.addClass('none');
				H.index.$succeed_theme.removeClass('none').text(data.cg);

				H.index.$add_user.addClass('addshare-user');
				H.index.$renPin_friend.addClass('renPin-friend');
				H.index.$ul_package.addClass('openshare-img');
				H.index.$invite_friendsbtn.addClass('invite-share');
				if(H.index.$masking.hasClass('second-go')){
					H.index.$succeed_theme.addClass('none');
                    H.index.$not_openRedfin.addClass('not-openredfont');
				}
			}else{
				if(not_openMum != 0){
					$gongxi.removeClass('none').text(data.cg);
				}
			}

			if(isShare){
				for (var i = 0, len = items.length; i < len; i++) {
					opened_red += '<li class="li-package"><label>' + items[i].sp + '</label><span class="used used-mark"></span></li>';
				}
				for (var i = 0; i < not_openMum; i++) {
					opened_red += '<li class="noopen-red"></li>';
				}
				$('#li-package').after(opened_red.substring(4));
                for (var i = 0, len = items.length; i < len; i++) {
                    if(items[i].ut == 2){
                        $('.used').text('已使用');
                    }
                }
			}else{
				for (var i = 0, len = data.sn; i < len; i++) {
					t._('<li class="noopen-red"></li>');
				}
				$('#li-package').after($(t.toString()));
			}
		},
		loadAD: function () {
			getResult("api/linesdiy/info",{},"callbackLinesDiyInfoHandler");
		},
		checkProductsCount: function(index) {
			var me = this;
			var uid = me.itemList[index];
			if(uid && uid.length > 0){
				getResult('ikea/mall/item/detail/'+ uid, {
					yo: openid
				}, 'callbackIkeaMallItemDetail');
			}
		}
	};
	// 商品详情
	W.callbackIkeaMallItemDetail = function(data) {
		if (data.code == 0) {
			if(data.kc <= 0 && data.kc != -1){
				var uid = H.index.itemList[H.index.itemIndex];
				$("#"+uid).append('<img src="./images/sold-out.png" class="qianggou-sold-out" />');
				H.index.itemIndex++;
				if(H.index.itemIndex < H.index.itemList.length){
					H.index.checkProductsCount(H.index.itemIndex);
				}
			}
		}
	};
	// 首页幻灯片
	H.swipe = {
		$main: $('.main'),
		$container: $('#swiper-container'),
		$wrapper: $('#swiper-wrapper'),
		swiper: null,
		init: function(data) {
			var me = this;
			this.$wrapper.append(this.tpl(data));
			this.count_down();
			this.resize_window();
			
			this.swiper = new Swiper(this.$container.get(0), {
			    centeredSlides: true,
			    slidesPerView: 1,
				effect: 'coverflow',
				grabCursor: true,
				spaceBetween:-150,
				coverflow: {
					rotate: 0,
					stretch: 2,
					depth: 30,
					modifier: 1,
					slideShadows : true
				},
			    initialSlide: $('.ui-order-item').index('[data-index="0"]')
			});
			
			this.$wrapper.delegate('.ui-order-item', 'click', function(e) {
				var $tg = $(e.target).closest('.ui-order-item'),
					url = $tg.attr('data-url'),
					uid = $tg.attr('data-uid');
					window.location.href = 'order.html?ituid='+ uid;
			});
		},
		
		resize_window: function() {
			var height = $(window).height(),
				margin = $('.main').attr('data-margin') || 50;
			
			this.$main.css('height', height);
			if(H.index.$masking.hasClass('has_red')){
				this.$wrapper.css('marginTop', height * 0.04);
			}else{
				this.$wrapper.css('marginTop', height * 0.08);
			}
			// this.$container.css('height', height);
		},
		
		add: function(data, index) {
			if (index > 0) {
				this.swiper.appendSlide(this.tpl(data, true));
			} else {
				this.swiper.prependSlide(this.tpl(data, true));
			}
		},
		
		// 倒计时
		count_down: function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					sdtpl: '', 
					otpl: '',
					otCallback: function() {
						$me.siblings('label').html('已结束');
						$me.closest('.ui-order-item').attr('data-ss', 1)
							.find('.btn-buy').addClass('btn-disabled').text('抢购结束');
					}
				});
			});
		},
		
		tpl: function(data, flag) {
			var t = simpleTpl();
			for (var i = 0, len = data.length; i < len; i ++) {
				var item = data[i];
				if(item.re == "抢购"){
					continue;
				}
				!flag && t._('<div class="swiper-slide">');
				
				t._('<div class="ui-order-item" data-url="'+ item.hrf +'" data-uid="'+ item.uid +'" data-index="'+ item.in +'" data-ss="'+ item.ss +'" data-collect="true" data-collect-flag="shopping-index-todetail" data-collect-desc="宜佳购物 下单">')
					// ._('<img class="detail-double11" src="./images/icon-double11.png" />')
					._('<div class="item-detail">');
						if(item.kc <= 0 && item.kc != -1){
							t._('<img class="detail-sold-out" src="./images/sold-out.png" />');
						}
						t._('<img class="detail-cover" src="'+ item.im +'" />')
						._('<div class="detail-time">');
							if (item.ss == 1) {
								t._('<label>已结束</label>')
							} else if (item.ss == 2) {
								t._('<label>开始时间</label>')
								._('<strong>'+ dateformat(str2date(item.vst || ''), 'hh:mm') +'</strong>');
							} else {
								t._('<label>还剩</label>')
								._('<strong class="detail-countdown" stime="'+ timestamp(item.vst) +'" etime="'+ timestamp(item.vet) +'">-</strong>');
							}
							
						t._('</div>')
						._('<div class="detail-info">')
							._('<h2>'+ item.n +'</h2>')
							._('<p class="curr-price">')
								._('<span class="currency">￥</span>')
								._('<strong>'+ this.format_price(item.yp, true) +'</strong>')
								._('<span class="decimal">'+ this.format_price(item.yp, false) +'</span>')
								._('<span class="market-price">￥'+ this.format_price(item.mkp) +'</span>')
								._('<span class="sold">已售'+ item.se + item.un + '</span>')
							._('</p>')
						._('</div>')
					._('</div>')
					._('<div class="item-ctrl">');
						item.re && t._('<p class="tip">'+ item.re +'</p>');
						var btn_cls = '';
						if(item.ss > 0 || (item.kc <= 0 && item.kc != -1)){
							btn_cls = 'btn-disabled';
						}
						t._('<a href="#" class="btn '+ btn_cls +' btn-buy" data-collect="true" data-collect-flag="shopping-index-buynow" data-collect-desc="宜佳购物 '+ item.message +'">'+ item.message +'</a>')
					._('</div>')
				._('</div>');
						
				!flag && t._('</div>');
			}
			
			return t.toString();
		},
		
		format_price: function(price, only_int) {
			var result = (price / 100 || 0).toFixed(2) + '',
				index = result.indexOf('.');
			if (typeof only_int == 'undefined') {
				return result;
			} else if (only_int == true) {
				return result.slice(0, index);
			} else {
				return result.substr(index);
			}
		}
	};

	W.callbackIkeaMallItemIndex = function(data) {
		if (data.code == 0) {
			if (data.in == 0) {
				H.swipe.init(data.items || []);
			} else {
				H.swipe.add(data.items || [], data.in);
			}
		}
	};


	W.callbackIkeaEnvelopeCheck = function(data) {
		if(data.code == 1){//没有红包业务
			share_info(0);
			H.index.$masking.removeClass('has_red');
		}else{
			H.index.$rob_red.removeClass('none');
			share_type = 1;
			if(data.code == 4 || data.code == 6){//直接进入没有领取红包 || 分享进入没有领取红包
				H.index.$masking.removeClass('none');
				H.index.masking_show();
				H.index.$get_red.removeClass('none');
				H.index.$first_theme.removeClass('none').text(data.an);
				H.index.$get_redbtn.text('领取红包');
				H.index.red_number(data,true);
				H.index.$jin_e.text(data.ep + '元');
				H.index.$renPin_friend.addClass('none');
				H.index.$ul_package.addClass('none');
				H.index.$immediate_use.text('获取更多红包').addClass('get-more');
				H.index.$add_user.find('.add-red').hide();
			}else if(data.code == 5){//直接进入红包没有全部打开
				share_info(0);
				H.index.$jin_e.text(data.ep + '元');
				H.index.$masking.addClass('second-go');
				H.index.red_number(data,true,true);
			}else if(data.code == 9){//分享进入未帮忙且红包没有全部打开
				H.index.$masking.removeClass('none');
				H.index.masking_show();
				H.index.$get_red.removeClass('none');
				H.index.$first_theme.removeClass('none').text(data.an);
				H.index.$get_redbtn.text('帮忙开红包').addClass('help-btn');
				H.index.red_number(data,true,true);
			}else if(data.code == 7){//分享进入红包没有全部打开
				share_info(0);
				H.index.$result_red.removeClass('none');
                H.index.$masking.addClass('second-go');
				H.index.red_number(data,true,true);
			}else if(data.code == 8){//分享进入未帮忙且没有领取红包
				H.index.$masking.removeClass('none');
				H.index.masking_show();
				H.index.$get_red.removeClass('none');
				H.index.$first_theme.removeClass('none').text(data.an);
				H.index.$get_redbtn.text('帮忙开红包').addClass('help-frienLingqu').addClass('share-gobg');
				H.index.red_number(data,{},true);
				H.index.$share_theme.text(data.ts);
			}else if(data.code == 3) {//直接进入红包已经全部打开
				share_info(0);
				share_type = 2;
				H.index.$result_red.removeClass('none');
				H.index.red_number(data,true);
			}else if(data.code == 10){//分享进入自己红包已经全部打开，小伙伴的红包没有全部打开
				share_type = 2;
				H.index.$masking.removeClass('none');
				H.index.masking_show();
				H.index.$get_red.removeClass('none');
				H.index.$first_theme.removeClass('none').text(data.an);
				H.index.$get_redbtn.text('帮忙开红包').addClass('red-openwanBtn');
				H.index.red_number(data,true,true);
			}
			if(data.code != 5 && data.code != 7 && data.code != 3){
				share_info(share_type);
			}
			H.index.staui = share_type;
		}
	};

	W.callbackIkeaEnvelopeReceive = function(data){
		if(data.code != 0){
			alert(data.message);
		}else if(data.code == 3 || data.code == 4){
			alert(data.message);
			H.index.$masking.addClass('none');
		}
	};

	W.callbackLinesDiyInfoHandler = function (data) {
		if(data.code == 0){
			var gitems = data.gitems;
			if(gitems && gitems.length>0){
				var t = new simpleTpl();
				for (var i = 0; i < gitems.length; i ++){
					t._('<div class="ad-btn" id="' + gitems[i].info + '" data-href="' + gitems[i].info + '"><img src="'+ gitems[i].ib +'"></div>');
					H.index.itemList.push(gitems[i].info);
				}
				$(".bottom-btn").html(t.toString());
				H.index.checkProductsCount(H.index.itemIndex);
				$(".ad-btn").click(function(e){
					e.preventDefault();
					var hf = $(this).attr("data-href");
					if(hf.indexOf("http") >= 0){
						location.href = hf;
					}else if(hf.indexOf("rule") >= 0){
						// 打开活动规则
					}else{
						location.href = 'order.html?ituid='+ hf;
					}
				});
				$(".bottom-btn").removeClass("none");
			}
		}
	};
})(Zepto);
$(function(){
	H.index.init();
});