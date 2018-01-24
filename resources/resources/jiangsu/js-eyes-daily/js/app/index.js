/**
 * 江苏新闻眼--首页
 */
$(function() {
	H.index = {
		actuid :null,
		overtime : null,
		times : null,
		request_cls: 'requesting',
		init : function() {
			var me = this;
			
			me.imgReady(index_bg);
			if(!openid){
				$('.is-openid').addClass(this.request_cls);
			}
			$('.is-openid').click(function(e){
				e.preventDefault();
				if($(this).hasClass(me.request_cls)){
					alert('拼命加载中....');
				}
			});
			me.event_handler();
			
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
			if(!openid){
				return;
			}
			getResult('newseye/check/'+openid, {}, 'newseyeCheckHandler', true);
			$("#btn-begin").click(function(e){
				e.preventDefault();
				if(!openid){
					return;
				}
				if($(this).attr("disabled")!== "disabled"){
					if(H.index.overtime){
						toUrl("baoliao.html?uid="+H.index.actuid);
					}else{
						H.dialog.over.open(H.index.times);
					}
				}else{
					alert("活动尚未开始！");
				}
				
			});
			$("#rule").click(function(e){
				e.preventDefault();
				H.dialog.rule.open();
			});
	
			if (openid){
				$("#jifen").attr('href', 'user.html');
			};
			$("#btn-vote").click(function(e){
				e.preventDefault();
				toUrl("lottery.html?uid="+H.index.actuid);
				
			});

		}
	};
	
	W.newseyeCheckHandler = function(data){
		if(data.code ==0){
			H.index.actuid = data.iu;
			H.index.overtime=data.jc;
			H.index.times=data.im;
		}else{
			$("#btn-begin").attr("disabled","disabled");
		}
	}

	//一键关注是否显示判断
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
