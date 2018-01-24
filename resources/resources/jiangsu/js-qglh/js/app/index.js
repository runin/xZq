$(function() {
	H.index = {
		lotteryid : null,
		overtime : null,
		times : null,
		init : function() {
			this.event_handler();
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
				if(H.index.overtime){
					toUrl("baoliao.html?uid="+H.index.lotteryid);
				}else{
					H.dialog.over.open(H.index.times);
				}
			});
			$("#rule").click(function(e){
				e.preventDefault();
				H.dialog.rule.open();
			});
			
			$("#btn-vote").click(function(e){
				e.preventDefault();
				toUrl("comments.html?uid="+H.index.lotteryid);
				
			});

		}
	};
	
	W.newseyeCheckHandler = function(data){
		H.index.lotteryid=data.iu;
		H.index.overtime=data.jc;
		H.index.times=data.im;
	}
});

$(function() {
	H.index.init();
});
