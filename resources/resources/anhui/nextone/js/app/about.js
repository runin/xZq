(function($) {
	
	H.about = {
		page: 1,
		pageSize: 5,
		total: 0,
		init: function() {
			getResult('comedian/replay', {
				tsuid: stationUuid,
				yp: openid
			}, 'callbackComedianReplay');
			
			getResult('common/activtyRule/' + serviceNo, {}, 'callbackRuleHandler', true, $('#ui-content'));
			
			getList(true);
		    this.page ++;
		    
		    this.scroll_load();
		    this.event_handler();
		    
		    var height = $(window).height();
			$('.main').css('minHeight', height);
		},
		
		init_audio: function(url) {
			H.audio.init(url);
			H.audio.event_handler();
			
			// 播放声音
			var interval = setInterval(function() {
				if (!H.audio.audio) return;
				H.audio.show();
				H.audio.audio.play();
				clearInterval(interval);
			}, 1000);

			// 声音启动
			$(document).one("touchstart", function() {
				H.audio.audio.play();
			});
		},
		
		event_handler: function() {
			$('#ui-movies').delegate('.movie', 'click', function(e) {
				var guid = $(this).attr('data-guid');
				window.location.href = 'movie.html?guid=' + guid;
			});
		},
		
		scroll_load: function() {
			var me = this,
				range = 180, //距下边界长度/单位px
		        maxpage = 100, //设置加载最多次数
		        totalheight = 0;
	
		    $(window).scroll(function(){
		        var srollPos = $(window).scrollTop();
		        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
		        if (me.total > 0 && me.page <= Math.ceil(me.total / me.pageSize) && ($(document).height() - range) <= totalheight) {
		            getList();
		            me.page ++;
		        }
		    });
		},
		
		add_items: function(data) {
			var items = data.items || [],
				len = items.length,
				t = simpleTpl();
			
			this.total = data.ac;
			
			for (var i = 0; i < len; i++) {
				t._('<div class="ui-movie movie" data-guid="'+ items[i].guid +'" data-collect="true" data-collect-flag="ah-about-tomovie" data-collect-desc="安徽重播页面-进入视频播放">')
	        		._('<div class="cover"><img src="'+ items[i].vi +'" /></div>')
	        		._('<div class="content">')
	        			._('<h3>《超级笑星》<span>'+ items[i].da +'</span></h3>')
						._('<p>'+ items[i].vd +'</p>')
	        		._('</div>')
	        	._('</div>');
			}
			$('#ui-list').append(t.toString());
			$('#ui-movies').removeClass('none');
		},
		
		show_ctrl: function(data) {
			var $ctrl = $('#um-ctrl'),
				$tip = $ctrl.find('.tips-txt'),
				$btn_lottery = $ctrl.find('.btn-lottery'),
				$btn_result = $ctrl.find('.btn-result');
			
			if (data.lc > 0) { //剩余抽奖次数
				$btn_lottery.removeClass('none');
				$tip.text('您有'+ data.lc +'次抽奖机会');
			} else {
				$btn_lottery.addClass('none');
				if (data.hc > 0) {//猜中次数
					$tip.text('您猜中了'+ data.hc +'次，离大奖越来越近了');
				} else {
					$tip.text('您还未中奖，继续加油');
				}
			}
			if (data.gc > 0) {//参与次数
				$btn_result.removeClass('none');
			} else {
				$btn_lottery.addClass('none');
				$btn_result.addClass('none');
			}
			
			$ctrl.removeClass('none');
		}
	};
	
	W.getList = function(showloading) {
		getResult('comedian/repage', {
			tsuid: stationUuid,
			page: H.about.page,
			pageSize: H.about.pageSize
		}, 'callbackComedianRePage', true);
	};
	
	W.callbackComedianReplay = function(data) {
		if (data.code == 0) {
			setTimeout(function() {
				H.about.init_audio(data.vul);
			}, 5);
			
			H.about.show_ctrl(data);
		}
	};
	
	W.callbackComedianRePage = function(data) {
		if (data.code != 0) {
			return;
		}
		H.about.add_items(data);
	};
	
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			$('#ui-content').html(data.rule).removeClass('none');
		}
	};
})(Zepto);

H.about.init();