/**
 * 我要找到你-首页
 */
(function($) {
	
	H.index = {
		request_cls: 'requesting',
		from: getQueryString('from'),
		init: function () {
			var me = this;
			if (me.from) {
				setTimeout(function () {
					H.dialog.guide.open();
				}, 800);
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
			this.event_handler();
		},
		event_handler : function() {
			var me = this;
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$('#btn-begin').click(function(e) {
				e.preventDefault();
				window.location.href = "person.html";
			});
		},	
	
	}
})(Zepto);

$(function(){
	H.index.init();
	
});


