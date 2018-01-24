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
			}, 3500);

			H.page.rank();
		}
	};
	
	H.page = {
		parallax: null,
		puid: 0,
		$pages: $('#pages'),
		$arrows: $('#ui-arrows'),
		$top_outer: $('#ui-outer-top'),
		$top_inner: $('#ui-inner-top'),
		$ui_audio: $('#ui-audio'),
		$wrapper: $('.wrapper'),
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
						H.index.$share.addClass('none');
					}else{
						H.index.$share.removeClass('none');
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

			$('.home').click(function(e){
				e.preventDefault();
				$('.info-box').addClass('none');
				me.$ui_audio.addClass('none');
				me.$arrows.removeClass('none');
				H.index.$share.removeClass('none');
				me.$wrapper.removeClass('none');
			});
			this.$pages.delegate('.xs-wrapper', 'click', function(e) {
					e.preventDefault();
				var $curr = $('#info-box-' + $('.current').attr('data-guid'));
				$curr.removeClass('none');
                $curr.find('.ui-audio').audio({
					auto: false,			// 默认自动播放
					stopMode: 'pause',	// 默认stop，可不传
					audioUrl: $curr.find('.ui-audio').attr('data-url'),
					steams: ["<img src='./images/icon-musical-note.png' />", "<img src='./images/icon-musical-note.png' />"],
					steamHeight: 150,
					steamWidth: 44
				}).removeClass('none');

				me.$wrapper.addClass('none');
				me.$arrows.addClass('none');
				H.index.$share.addClass('none');
				getResult('vote/detail', {
					attrUuid: $('.current').attr('data-guid')
				}, 'detailHandler', true);

			});
			H.index.$share.click(function(e){
				e.preventDefault();

				H.about.init();
				me.$wrapper.addClass('none');
				me.$arrows.addClass('none');
				H.index.$share.addClass('none');

				$('.rank-box').removeClass('none');
			})
		},
		info: function(id , src){
			var t = simpleTpl();
		t._('<div class="masking-box info-box none" id="info-box-'+ id +'" >')
			._('<section class="info" >')
				._('<a class="home" data-collect="true" data-collect-flag="xian-song-info-back" data-collect-desc="西安广播-返回首页">< 返回</a>')
				._('<div class="info-con" id="info-con"></div>')
			._('</section>')
			._('<section class="ui-audio none" data-url="'+ src +'">')
                ._('<div class="coffee-flow">')
                 ._('<a href="#" class="audio-icon"></a>')
                ._('</div>')
			._('</section>')
		 ._('</div>')

			$masking_box = $(t.toString());
			$('body').append($masking_box);
		},
		rank: function(){
			var t = simpleTpl();
			t._('<div class="masking-box rank-box none">')
				._('<section class="info" >')
					._('<a class="rank-close" data-collect="true" data-collect-flag="xian-song-info-back" data-collect-desc="西安广播-返回首页"></a>')
					._('<section class="ui-movies info-con none" id="ui-movies">')
						._('<div class="ui-list" id="ui-list"></div>')
						/*._('<a href="#" class="btn-loadmore" data-collect="true" data-collect-flag="xian-song-about-btn" data-collect-desc="页面加载更多"><i></i>加载更多</a>')*/
					._('</section>')
				._('</section>')
			._('</div>')

			$masking_box = $(t.toString());

			$('body').append($masking_box);
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
					t._('<div class="xs-wrapper" data-collect="true" data-collect-flag="xian-song-index-num'+ i +'" data-collect-desc="唱响中国-详情">')
		        		/*._('<div class="img-con">')
							._('<p>')
								._('<label><span>歌词：</span>陈春丽</label>')
								._('<label><span>演唱：</span>梁    凡</label>')
							._('</p>')
							._('<img src="'+ items[i].ai +'" />')
		        		._('</div>')*/
						._('<img src="'+ items[i].ai +'" />')
		        		._('<div class="xs-bot"><span>'+ items[i].an +'</span><label class="votenum">'+ items[i].vn +'</label></div>')
		        	._('</div>')
		        	._('<div class="ctrl-wrapper">')
		        		t._('<div class="cwc-item cw-vote">')
		        			._('<div class="cw-btns">')
		        				._('<a href="#" class="btn-vote btn-jinji '+ vote +'" data-surplus="'+ items[i].uv +'" data-collect="true" data-collect-flag="xian-song-index-votejj" data-collect-desc="唱响中国-投票按钮"><i></i>赞一个</a>')
								._('<a href="#" class="draw '+ voted + ' ' + disabled + '" data-collect="true" data-collect-flag="xian-song-index-votejj" data-collect-desc="唱响中国-抽奖按钮">我要抽奖</a>')
		        			._('</div>')
		        		._('</div>');
		        		
		        		t._('<div class="cwr-ctrl ctrl">')
	        				._('<p class="tips"><a href="#" class="btn-rule" data-collect="true" data-collect-flag="xian-song-index-rulebtn" data-collect-desc="唱响中国-规则弹层按钮">活动规则</a></p>')
	        			._('</div>');
        			
		        	t._('</div>')
		        ._('</div>');
				H.page.info(items[i].au , items[i].am);
			}
			return t.toString();
		}
	};

	W.voteIndexHandler =function(data) {
		if(data.code == 0 || data.code == 3 || data.code == 4){
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
				$btn.addClass('none');
				$voteNum.html($voteNum.html()*1+1);
				$('.current').find('.draw').removeClass('none');
				H.page.$pages.removeClass("disabled");
			}, 2000);
		}
	};
	
	W.lotteryHandler = function(data){
		$('.current').find('.draw').addClass("btn-disabled");
		H.dialog.lottery.open();
		H.dialog.lottery.update(data);
	}

	W.detailHandler =function(data) {
		if(data.code == 0){
			var $curr = $('#info-box-' + $('.current').attr('data-guid'));
			$curr.find('.info-con').html(data.ad);
		}
	};
})(Zepto);
$(function(){
	H.index.init();
});
