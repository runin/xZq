(function($) {
	H.photo = {
		uuid: getQueryString('uuid'),
		init: function () {
			var me = this;
		    me.share_enter();
			me.event_handler();
		},
		share_enter :function(){
			getResult('gzlive/photo/shareindex', {openid:openid,uuid:H.photo.uuid}, 'shareIndexHxHandler',true);
		},
		event_handler : function() {
			var me = this;
			$('.photoedBox').on('click', '#btn-refresh', function(e) {
				e.preventDefault();
				toUrl("photo.html");
			});
			$('.back-index').click(function(e) {
				e.preventDefault();
				toUrl("index.html") ;
			});
			$('#vote').click(function(e) {
				e.preventDefault();
				if($(this).hasClass("voted")){
					return;
				}
				$(this).addClass("voted");
				getResult('gzlive/photo/votehx', {openid:openid,recordUuid:H.photo.uuid}, 'photeVoteHxHandler',true);
			});
			$(".close-photo").click(function(e) {
				e.preventDefault();
				toUrl("photo.html");
			});
		}
	};
	W.photeVoteHxHandler= function(data){
		if(data.code == 0){
			$("#vote").text(parseInt($("#vote").html())+1);
		}
	};
	W.shareIndexHxHandler= function(data){
		if(data.code == 0){
			$(".final-photo").attr("src",data.li);
			$(".person-info label:first-child").find("img").attr("src",data.lh||"images/avatar.jpg");
			$(".person-info label:first-child").find("span").html(data.lu||"匿名用户");
			$("#vote").text(data.lvn||0).removeClass("none");
			if(data.lf){
				$("#vote").removeClass("voted");
			}else{
				$("#vote").addClass("voted");
			}
		}
	};
})(Zepto);

$(function(){
	H.photo.init();
});



