(function($) {
	
	H.index = {
		follow_key: 'wx614a0f37684e8f10',
		init: function() {
			// 一键关注
			window['shaketv'] && shaketv.subscribe(this.follow_key, function(returnData){
				// console.log(returnData.errorMsg);
			});
		}
			
	};
	
})(Zepto);

$(function() {
	H.index.init();
});