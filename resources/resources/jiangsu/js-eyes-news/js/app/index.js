/**
 * 江苏新闻眼--首页
 */
$(function() {
	H.index = {
		$btnStart : $('#btn-start'),
		$btnBegin : $('#btn-begin'),
		$rule : $('#rule'),
		$jifen : $('#jifen'),
		request_cls: 'requesting',
		init : function() {
			this.event_handler();
			this.imgReady(index_bg);
		},
		imgReady : function(index_bg) {
			var width = document.documentElement.clientWidth,
				height = width/(640/562);
			$('.logo').css('background', 'url('+ index_bg +') no-repeat');
			$('.logo').css({
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
				this.$jifen.attr('href', 'user.html');
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
});

$(function() {
	H.index.init();
});
