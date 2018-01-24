/**
 * 江苏新闻眼--首页
 */
$(function() {
	H.index = {
		$btnStart : $('#btn-start'),
		$btnBegin : $('#btn-begin'),
		$rule : $('#rule'),
		$gift : $('#gift'),
		request_cls: 'requesting',
		init : function() {
			this.event_handler();
			this.imgReady($(".title"),242,106);
			this.imgReady($(".home"),521,291);
		},
		imgReady : function($logo,w,h) {
			var width = $logo.width(),
				height = width/(w/h);
			$logo.css({
				'background-size':  width + 'px ' + height + 'px',
				'width': width + 'px',
				'height': height + 'px'
			});

		},
		event_handler : function() {
			var me = this;
			this.$btnBegin.click(function(e){
				e.preventDefault();
				if($(this).hasClass(me.request_cls)){
					return;
				}
				getResult('newseye/check/'+openid, {}, 'newseyeCheckHandler');
			});
			
			this.$rule.click(function(e){
				e.preventDefault();
				if($(this).hasClass(me.request_cls)){
					return;
				}
				H.dialog.rule.open();
			});
			this.$btnStart.click(function(e){
				e.preventDefault();
				if($(this).hasClass(me.request_cls)){
					return;
				}
				getResult('newseyeday/check/', {}, 'newseyedayCheckHandler');
			});
			if (openid) {
				this.$gift.attr('href', 'gift.html');
			}
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
	
	W.newseyeCheckHandler = function(data){
		if(data.jc){
			location.href = "baoliao.html?uid="+data.iu;
		}else{
			H.dialog.over.open(data.im);
		}
	};
	W.newseyedayCheckHandler = function(data){
		if(data.code != 0){//截止今天（包括今天）及以前的时间都没有查到题目
			alert('活动未开始');
			return;
		}else{
			location.href = 'lottery.html';
		}
	};
	var cbUrl = window.location.href;
			if(cbUrl.indexOf('cb41faa22e731e9b') < 0 ){
				$('#div_subscribe_area').css('height', '0');
			} else {
				$('#div_subscribe_area').css('height', '50px');
			};
});

$(function() {
	H.index.init();
});
