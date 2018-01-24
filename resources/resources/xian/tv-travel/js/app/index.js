/**
 * 成都深夜快递-首页
 */
(function($){
	H.index ={
		width : $(window).width(),
		$btnBegin : $("#btn-begin"),
		init : function(){
			var me = this;
			me.$btnBegin.height(me.width*0.68*153/430);
			if(!openid){
				showLoading();
			}else{
				
				$("#btn-rule").click(function(e){
					e.preventDefault();
					H.dialog.rule.open();
				});
				me.$btnBegin.click(function(e){
					e.preventDefault();
					showLoading();
					toUrl("lottery.html");
				});
			}
			
		}
	}	
})(Zepto)

$(function(){
	H.index.init();
});
