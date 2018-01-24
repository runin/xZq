/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		flag : false,
		from: getQueryString('from'),
		init: function () {
			this.event_handler();
			getResult('api/newsclue/count', {openid :openid}, 'callbackClueCountHandler ', true);
		},
		event_handler : function() {
			var me = this;
			$('#btn-er').click(function(e) {
				e.preventDefault();
				if (!$(this).hasClass('request')) {
					$(this).addClass('request');
					H.dialog.erweima.open();
					setTimeout(function(){
						$("#btn-er").removeClass('request');
					}, 1000);
				}
				return;
			});
			$('#btn-bao').click(function(e) {
				e.preventDefault();
				if (!$(this).hasClass('request')) {
					$(this).addClass('request');
					if(H.index.flag){
						toUrl('baoliao_success.html') ;
					}else{
						toUrl("baoliao.html");
					}
					setTimeout(function(){
						$("#btn-bao").removeClass('request');
					}, 1000);
				}
				return;
			});
		}
	}
window.callbackClueCountHandler = function(data) {
	if(data&&data.code == 0&&data.count >0 ){
		H.index.flag = true;
		//toUrl('baoliao_success.html') ;
	}else{
		H.index.flag = false;
		//toUrl('baoliao.html') ;
	}
};
})(Zepto);                             

$(function(){
	H.index.init();
});


