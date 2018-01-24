/**
 * 美丽梦想家
 */
(function($) {
	H.index = {
		$front: $('#wrapper-front'),
		$back: $('#wrapper-back'),
		uuid: null,
		request_cls: 'requesting',
		disabled_cls: 'disabled',
		$loading: $("#loading"),
		$content_container: $(".content-container"),
		$wrapper: $("#wrapper"),
		$from: $("#from"),
		from: getQueryString('from'),
		timer : 2000,
		score : 0,

		init: function() {
			showLoading($("#loading"));
			var me = this;
			if (this.from) {
				me.$from.removeClass('none');
				setTimeout(function(){
					me.$from.addClass('rotate');
					setTimeout(function(){
						me.$wrapper.removeClass('none');
						me.$from.addClass('none');
					}, me.timer);
				},3000);
			}else if (openid) {
				me.$wrapper.removeClass('none');
				me.$front.removeClass(me.request_cls);
			} else {
				me.$front.addClass(me.request_cls);
				return;
			}

			me.$front.css({
				'width' : $(window).width(),
				'height' : $(window).height()
			});
			this.imgReady_index(me.$content_container, 523/753, title_img);
			this.imgReady_index($('.from-con'), 523/473, 'images/from-bg.png');
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
					me.event_handler();

					setTimeout(function() {
						hideLoading($("#loading"));
                        $('.start').addClass('swing');
					}, 1000);

					me.$front.addClass('zshow');
					setTimeout(function() {
						me.$back.removeClass('none');
					}, 1000);


				}, time);
			});
		},

		imgReady_index: function($, ratio, title_img){
			var width = document.documentElement.clientWidth;
			imgReady(title_img, function() {
				$.css({
					'background-image' : 'url('+ title_img +')',
					'background-size' :  (Math.ceil(width*0.82)+12) + 'px ' +Math.ceil((width*0.82 + 12)/(ratio)) + 'px',
					'width':  Math.ceil(width*0.82) + 'px',
					'height': Math.ceil((width*0.82 + 12)/(ratio)) + 'px'
				});
			});
		},

		event_handler: function() {
			var me = this;
			$('#test').click(function(e){
				e.preventDefault();
				var request_cls = H.index.request_cls;
				if ($(this).hasClass(request_cls)) {
					return;
				}
				H.index.$front.removeClass('zshow');
				setTimeout(function() {
					H.index.$front.addClass('none');
					H.index.$back.removeClass('none');
				}, 1500);

			});

			$('.ques-div').find('li').click(function(){

				H.index.score += $(this).attr('data-core')*1;

                $('.content-container').removeClass('rote');
				$('.ques-div').find('li').removeClass('li-hover');
				$(this).addClass('li-hover');
				$(this).parent().parent().hide();
				$(this).parent().parent().next('.ques-div').show();

                $(this).parent().parent().next('.ques-div').parent().addClass('rote');
                if($('.ques-my').css('display') == 'block'){
					H.index.imgReady_index(H.index.$content_container, 523/643, 'images/da-bg.png');
                    $('.ques-my .continue').removeClass('none');
                    $('#parallax-first').removeClass('none');
					H.page.enable();

					if(window.screen.height==568 || (799 < window.screen.height  && window.screen.height < 961)){
						$('.ques-my').parent().addClass('ques-lastip5');
					}else{
						$('.ques-my').parent().addClass('ques-last');
					}

					getResult('advertise/result', {
						infoUuid : H.index.uuid,
						score : H.index.score
					}, 'resultHander', true);
                }
			});

			$('#try').click(function(e) {
				e.preventDefault();
				H.index.$from.addClass('rotate');
				setTimeout(function(){
					H.index.$wrapper.removeClass('none');
					H.index.$from.addClass('none');
				}, H.index.timer);
			});

			$('#rule').click(function(e){
				e.preventDefault();
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
				$('.rule-con').removeClass('none');
			});

			$('#know').click(function(e){
				e.preventDefault();
				$('.rule-con').addClass('none');
			});

			$('#close').click(function(e){
				e.preventDefault();
				$('.rule-con').addClass('none');
			});

			if(!openid){
			 $('.is-openid').addClass(this.request_cls);
			}
			$('.is-openid').click(function(e){
				e.preventDefault();
				if($(this).hasClass(me.request_cls)){
					alert('拼命加载中....');
				}
			});
		},
		check_data : function(data){
			var $phone = $('#phone'), $name = $('#name');
			$('#box-phone').find('h3').hide();
			$('input').attr('disabled','disabled');
			$phone.val(data.phone);
			$name.val(data.name || '');
			$('#btn-submit').hide();
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
					$target.find('.content').scrollTop(0);
					if (direction != 'backward') {
						var $next = $('.page').eq(index + 1);
						if ($next.length > 0) {
							H.page.preload($next);
						}
						if($next.length == 0){
							if(openid){
								getResult('advertise/checklotteryed', {
									activityUuid : H.index.uuid,
									openid : openid
								}, 'advertiseChecklotteryedHandler',true);

							}
						}
					}
					setTimeout(function() {
						recordUserOperate(openid, "滑动切换页面", "ad-question-section-" + index);
					}, 300);
				}
			});
		},

		preload: function(element) {
			var $target = $(element),
				type = $target.attr('data-type'),
				uuid = $target.attr('data-uuid');

			if (!$target.hasClass(H.page.preload_cls)) {
				return;
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

	W.advertiseIndexHander = function(data) {
		if (data.code != 0) {
			return;
		}
		H.page.disable();
		H.index.uuid = data.id;

		var $cover = $('#cover'),
			$sign = $('#sign'),
			$cross = $('#cross'),
			t = simpleTpl(),
			items = data.items || [],
			has_sign = false;


		$cover.css('background-image','url('+ data.lg +')');
		$('.ui-audio').attr('data-src',data.mu);
		/*$('title').empty().text(data.t);*/

		var ques_items = data.infos || [],
			$question = $('#question');

		for(var i = 0, len = ques_items.length; i < len; i++){
			$question.append('<div class="ques-div" id="ques-div'+ i +'"><h1> <label>Q'+ (i+1) +'</<label></h1><h2>'+ ques_items[i].it +'</h2><ul id="ques'+ i +'"></ul><p>（请直接点击答案进行选择）</p></div>');

			var ques_li = data.infos[i].attrs || [];

			for(var j = 0, lenj = ques_li.length; j < lenj; j++){
				var before = '';
				if(j == 0){
					before = 'A';
				}else if(j == 1){
					before = 'B';
				}else if(j == 2){
					before = 'C';
				}else if(j == 3){
					before = 'D';
				}
				$('#ques'+ i).append('<li data-core = '+ ques_li[j].as +'><label>'+ before +'</label><span>'+ ques_li[j].at +'</span></li>');
			}
		};

		$question.append('<div class="ques-div ques-my" id="ques-my"><h1></h1><p class="ques-head"><img src=""></p><p class="ques-des"></p><div class="continue none">上拉继续浏览</div></div>');
		$('.ques-div').hide();
		$('.ques-div').eq(0).show();

		for (var i = 0, len = items.length; i < len; i++) {
			if (items[i].tp === 3) {//抽奖
				has_sign = true;
				$sign.removeClass('none').addClass('preload').attr('data-uuid', items[i].id).attr('data-type', items[i].tp);
			} else if(items[i].tp === 4){//广告
				$cross.removeClass('none').addClass('preload').attr('data-uuid', items[i].id).attr('data-type', items[i].tp);

			}else {
				t._('<div class="page preload " data-uuid="'+ items[i].id +'" data-type="'+ items[i].tp +'"><div class="page-logo" id="page-logo'+i+'"></div></div>');
			}
		}
		$(t.toString()).insertAfter($cross);

		!has_sign && $sign.remove();

		H.page.init();
	};

	//	答题结果页
	W.resultHander = function(data){
		if(data.code == 0){
			var $ques_my = $('#ques-my');

			$ques_my.find('h1').text(data.rt);
			$ques_my.find('.ques-head img').attr('src',data.ri);
			$ques_my.find('.ques-des').text(data.rc);

			share_title = data.st;
			share_desc = data.sc;

			hideLoading(H.index.$loading);
		}
	};

	W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-section").html(data.rule);
			hideLoading(H.index.$loading);
		}
	};

	W.advertiseChecklotteryedHandler = function(data){//检查抽奖
		if(data.code == 0){
			hideLoading(H.index.$loading);
			if(data.flag == true){
				H.lottery.ispass = true;
			}else{//已抽过奖
				$.fn.cookie("ruuid-"+ openid, data.ruuid,{expires:1});
				$('.sign-logo').hide();
				luck_prize = data;
				if(data.pt == 3){//谢谢参与
					H.lottery.isShow('thank', true);
				}else if(data.pt == 4){//中卡劵
					H.lottery.giftDrect(data);
					$(".prize").html(data.ptt);
					if(!data.phone && !data.name){
						$('#box-phone').find('h3').text('您上次未领奖，请填写信息！');
					}else{
						H.index.check_data(data);
						$('.address-info').removeClass('none');
					}
					$('.box').addClass('none');
					$('#box-phone').removeClass('none');
				}else if(data.pt == 1 ||data.pt == 2){
					$(".prize").html(data.ptt);
					if(!data.phone && !data.name){
						$('#box-phone').find('h3').text('您上次未领奖，请填写信息！');
					}else{
						H.index.check_data(data);
						$('.address').text('喊小伙伴们一起来参与吧！').removeClass('none');
					}
					$('.box').addClass('none');
					$('#box-phone').removeClass('none');
				}
			}

		}
		else{
			alert(data.message);
			toUrl('index.html');
		}
	};

	W.phoneScale = parseInt(window.screen.width) / 320;

})(Zepto);
$(function(){
	H.index.init();
});


