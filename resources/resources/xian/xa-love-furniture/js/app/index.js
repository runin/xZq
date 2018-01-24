/**
 * 爱尚家具--首页
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
		lastId: 0,
		timer : 2000,
		score : 0,

		init: function() {
			showLoading($("#loading"));
			var me = this;
			Img = new Image();
			Img.src = 'images/gift.png';
			Img.src = 'images/from-center.png';
			Img.src = 'images/bottom.png';

			Img.onload = function (){
				if (openid) {
					me.$from.removeClass('none');
					setTimeout(function(){
						me.$from.addClass('rotate');
						setTimeout(function(){
							me.$wrapper.removeClass('none');
							me.$from.addClass('none');
						}, me.timer);
					},3000);
				} else {
					me.$front.addClass(me.request_cls);
					return;
				}
			};


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
                if($(this).parent().parent().attr('id') == H.index.lastId){
                    toUrl('lottery.html?uuid='+ H.index.uuid + '&score=' + H.index.score);
                    return;
                }
				$(this).parent().parent().hide();
				$(this).parent().parent().next('.ques-div').show();

                $(this).parent().parent().next('.ques-div').parent().addClass('rote');

			});

			$('#from').click(function(e) {
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
		}
	};

	W.advertiseIndexHander = function(data) {
		if (data.code != 0) {
			return;
		}
		H.index.uuid = data.id;

		var $cover = $('#cover'),
			$cross = $('#cross'),
			t = simpleTpl();


		$cover.css('background-image','url('+ data.lg +')');
		$('.ui-audio').attr('data-src',data.mu);

		var ques_items = data.infos || [],
			$question = $('#question');

		for(var i = 0, len = ques_items.length; i < len; i++){
			$question.append('<div class="ques-div" id="ques-div'+ i +'"><h1> <label>Q'+ (i+1) +'</<label></h1><h2>'+ ques_items[i].it +'</h2><ul id="ques'+ i +'"></ul><p>（本测试共'+ques_items.length+'道题）</p></div>');
			if(i == len-1){
				H.index.lastId = "ques-div" + i;
			}
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

		$('.ques-div').hide();
		$('.ques-div').eq(0).show();
		$(t.toString()).insertAfter($cross);
	};

	W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-section").html(data.rule);
			hideLoading(H.index.$loading);
		}
	};

	W.phoneScale = parseInt(window.screen.width) / 320;

})(Zepto);
$(function(){
	H.index.init();
});


