(function($) {
	
	H.index = {
		from: getQueryString('from'),
		$ctrl_wrapper: $('.ctrl-wrapper'),
		$share: $('#ui-share'),
		init: function() {
			var me = this;
			if(openid != null){
				getResult('vote/index', {
					openid: openid
				}, 'voteIndexHandler',true);
			}
			
			setTimeout(function() {
				me.$share.removeClass('none');
			}, 1000);
		}
	};
	
	H.page = {
		parallax: null,
		puid: 0,
		$pages: $('#pages'),
		$arrows: $('#ui-arrows'),
		$top_outer: $('#ui-outer-top'),
		$top_inner: $('#ui-inner-top'),
		s_type: 0,
		TURNED_CLS: 'turned',
		STARTING_CLS: 'starting',
		ENDED_CLS: 'ended',
		timeout: true,
		time: 3000,
		init: function(data) {
			var me = this;
			this.$pages.append(this.tpl(data));
			if (this.$pages.find('.page').length <= 1) {
				return;
			}

			this.parallax = me.$pages.parallax({
				direction: 'horizontal', 	// vertical (垂直翻页)
				swipeAnim: 'default', 	// cover (切换效果)
				drag:      true,		// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
				loading:   false,		// 有无加载页
				indicator: false,		// 有无指示点
				arrow:     false,		// 有无指示箭头
				onchange: function(index, element, direction) {

					if($('.current').attr('data-id') == 1){
						$('#ui-share').addClass('none');
					}else{
						$('#ui-share').removeClass('none');
					}
					me.update_arrow(index, element);
					if (index > 0) {
						var message = direction == 'forward' ? '右翻' : (direction == 'backward' ? '左翻' : '');
						recordUserOperate(openid, message + '查看第' + index + '个餐厅', 'ah-pagechange-' + index);
					}
				}
			});
			
			var height = $(window).height();
			$('.xs-wrapper').css('height', height * 0.60).css('marginTop', height * 0.2);
			$('.ctrl-wrapper').css('height', height * 0.28);
			
			me.event_handler();
			me.progress();
		},
		
		update_arrow: function(index, element) {
			if ($(element).next('.page').length == 0) {
				this.$arrows.addClass('left');
			} else {
				this.$arrows.removeClass('left');
			}
		},
		
		to: function(guid) {
			if (!this.parallax) {
				return;
			}
			var width = $(window).width(),
				$pages = this.$pages.find('.page'),
				index = $pages.index('[data-guid="'+ (guid || 0) +'"]');
			
			index = index > -1 ? index : 1;
			var $page = $('.page').eq(index);
			if (index == 0 || $page.hasClass('none')) {
				return;
			}
			$pages.removeClass('current');
			$page.addClass('current');
			this.$pages.css("-webkit-transform", "matrix(1, 0, 0, 1, -" + (index * width) + ", 0)");
			window.curPage = index;
			
			this.update_arrow(index, $page);
		},
		
		progress: function() {
			var me = this;
			$('.page-round').each(function(index) {
				var $page = $(this),
					guid = $page.attr('data-guid'),
					$prev_page = $page.prev(),
					result = $page.attr('data-rs');

				$page.progress({
					index: index,
					callback: function(state) {
						var $last_page = $('.page-round').not(function() {
							return $(this).hasClass(me.ENDED_CLS);
						}).first();
						
						if (me.timeout && $last_page.length == 0) {
							$last_page = $('.page-round').eq(0);
						}

						if (!$last_page.hasClass(me.TURNED_CLS)) {
							var state_val = $last_page.attr('data-state');
							if (!state_val) {
								return;
							}
							$last_page.addClass(me.TURNED_CLS);
							if (state_val == 3 && $last_page.next().length == 0) {
								var $first = $('.page-round').eq(0);
								if (me.timeout) {
									me.timeout = false;
									setTimeout(function() {
										me.to($first.length > 0 ? $first.attr('data-guid') : 0);
									}, me.time);
								} else {
									me.to($first.length > 0 ? $first.attr('data-guid') : 0);
								}
							} else {
								if (me.timeout) {
									me.timeout = false;
									setTimeout(function(){
										me.to($last_page.attr('data-guid'));
									}, me.time);
								} else {
									me.to($last_page.attr('data-guid'));
								}
							}
						}
						
					},
					stCallback: function(state) {// 即将开始
						$page.addClass(me.STARTING_CLS).removeClass('none');
					},
					sdCallback: function(state) { // 正在进行
						$page.removeClass(me.STARTING_CLS).removeClass('none');
					},
					otCallback: function(state) {// 表演结束
						$page.addClass(me.ENDED_CLS)
					}
				});
			});
		},
		
		event_handler: function() {
			var me = this;
			this.$pages.delegate('.btn-vote', 'click', function(e) {
				e.preventDefault();
				me.$pages.addClass("disabled");
				var $page = $(this).closest('.page'),
					guid = $page.attr('data-guid');
				getResult('vote/vote', {
					openid: openid,
					actUuid: H.page.puid,
					attrUuid: guid
				}, 'voteHandler', true);
			});

			this.$pages.delegate('.draw', 'click', function(e) {
					e.preventDefault();
				if($('.current').find('.draw').hasClass('btn-disabled')){return;}
					me.fill_masking();
					var $page = $(this).closest('.page'),
					guid = $page.attr('data-guid');
					H.page.ani_relocate(guid);
			});

			this.$pages.delegate('.xs-wrapper', 'click', function(e) {
					e.preventDefault();

				toUrl('info.html?au=' + $('.current').attr('data-guid'));
			});
		},
		
		get_page: function(guid) {
			return $('#page-' + guid);
		},
		to2: function(){
			if($('.giftBoxDiv').hasClass("step-1")){
                $('.giftBoxDiv').removeClass('step-1').addClass('step-2');
                $('.wer').addClass('page-a');
            }
			else{
                $('.giftBoxDiv').removeClass('step-2').addClass('step-1');
            }

		},
		fill_masking : function(){
			var t = simpleTpl();

			t._('<div class="masking-box">')
				._('<div class="gift">')
					._('<div class="giftBoxDiv step-1">')
						._('<div class="giftbox">')
							._('<div class="cover">')
								._('<div></div>')
							._('</div>')
							._('<div class="box"></div>')
						._('</div>')
						._('<div class="wer">')
                            ._('<span></span>')
                            ._('<span></span>')
                            ._('<span></span>')

                            ._('<span></span>')
                            ._('<span></span>')
                            ._('<span></span>')
						._('</div>')
					._('</div>')
				._('</div>')
			._('</div>')

			$masking_box = $(t.toString());

			$('body').append($masking_box);
		},
		ani_relocate : function(data){
			setTimeout(function() {
				H.page.to2();
				setTimeout(function() {
					getResult('vote/lottery', {
						openid: openid,
						actUid: H.page.puid,
						attrUuid: data
					}, 'lotteryHandler', true, $('.dialog'));
					$('.giftBoxDiv').removeClass('step-1');
				}, 1700);
			},1000);
		},
		
		tpl: function(data) {
			var t = simpleTpl(),
				items = data.attrs || [];
			this.puid = data.actUid;
			H.dialog.puid = this.puid;
			
			for (var i = 0, len = items.length; i < len; i ++) {
				var vote = items[i].uv > 0 ? '' : 'none',
					voted = items[i].uv != 0 ? 'none' : '',
					disabled = items[i].uv == 0 && items[i].up ? 'btn-disabled' : '';
				
				t._('<div class="page page-round" id="page-'+ items[i].au +'" data-guid="'+ items[i].au +'">');
					t._('<div class="xs-wrapper" data-collect="true" data-collect-flag="food-annual-index-num'+ i +'" data-collect-desc="年度美食-大图">')
		        		._('<img src="'+ items[i].ai +'" />')
		        		._('<div class="xs-bot"><span>'+ items[i].an +'</span><label class="votenum">'+ items[i].vn +'</label></div>')
		        	._('</div>')
		        	._('<div class="ctrl-wrapper">')
		        		t._('<div class="cwc-item cw-vote">')
		        			._('<div class="cw-btns">')
		        				._('<a href="#" class="btn-vote btn-jinji '+ vote +'" data-surplus="'+ items[i].uv +'" data-collect="true" data-collect-flag="food-annual-index-votejj" data-collect-desc="年度美食-献花按钮"><i></i>赞一个</a>')
								._('<a href="#" class="draw '+ voted + ' ' + disabled + '" data-collect="true" data-collect-flag="food-annual-index-votejj" data-collect-desc="年度美食-献花按钮">我要抽奖</a>')
		        			._('</div>')
		        		._('</div>');
		        		
		        		t._('<div class="cwr-ctrl ctrl">')
	        				._('<p class="tips"><a href="#" class="btn-record" data-collect="true" data-collect-flag="food-annual-index-rulebtn" data-collect-desc="年度美食-规则弹层按钮">查看中奖记录</a></p>')
	        			._('</div>');
        			
		        	t._('</div>')
		        ._('</div>');
			}
			return t.toString();
		}
	};

	W.voteIndexHandler =function(data) {
		if(data.code == 0){
			H.page.init(data);
		}else if(data.code == 3){//活动结束
			H.page.init(data);
		}else if(data.code == 4){//当天投票次数结束
			H.page.init(data);
		}
	};

	W.voteHandler =function(data) {
		if(data.code == 1){
			alert(data.message);
			return;
		}else{
			var $btn = $('.current').find('.btn-vote');
			var $voteNum = $('.current').find('.votenum');
			$btn.addClass('animated');
			setTimeout(function() {
				$btn.removeClass('animated');
				$voteNum.html($voteNum.html()*1+1);
				$btn.addClass('none');
				$('.current').find('.draw').removeClass('none');
				H.page.$pages.removeClass("disabled");
			}, 2000);
		}
	}
	
	W.lotteryHandler = function(data){
		$('.current').find('.draw').addClass("btn-disabled");
		H.dialog.lottery.open();
		H.dialog.lottery.update(data);
	}
})(Zepto);
$(function(){
	H.index.init();
});
