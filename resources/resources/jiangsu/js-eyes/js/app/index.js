$(function() {
	H.index = {
		init : function() {
			this.event_handler();
		},
		event_handler : function() {
			$("#btn-begin").click(function(e){
				e.preventDefault();
				if(openid == "" || openid == null){
					return;
				}
				
				getResult('newseye/check/'+openid, {}, 'newseyeCheckHandler');
			});
			
			$("#rule").click(function(e){
				e.preventDefault();
				H.dialog.rule.open();
			});
			
			$("#jifen").click(function(e){
				e.preventDefault();
				toUrl("user.html");
			});
		}
	};
	
	W.newseyeCheckHandler = function(data){
		if(data.jc){
			toUrl("baoliao.html?uid="+data.iu);
		}else{
			H.dialog.over.open(data.im);
		}
	}
});

$(function() {
	H.index.init();
});
