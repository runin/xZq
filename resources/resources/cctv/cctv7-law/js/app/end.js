$(function() {
  	getResult('api/common/promotion', {oi:openid}, 'commonApiPromotionHandler',true);
	W.commonApiPromotionHandler = function(data){
    	if(data.code == 0){
			var jumpUrl = data.url;
			$(".ddtj-text").html(data.desc);
			$(".ddtj-box").attr("data-href",jumpUrl);
			$(".ddtj-before").addClass("whole");
			$(".ddtj").removeClass("none");
			$(".ddtj-box").click(function(e){
				e.preventDefault();
				shownewLoading();
				window.location.href = $(this).attr("data-href");
			})
		}else{
			$(".ddtj").addClass("none");
		}
    }
});