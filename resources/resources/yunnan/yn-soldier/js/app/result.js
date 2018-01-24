(function($) {
	H.photo = {
		uuid: getQueryString('uuid'),
		enter :getQueryString('enter'),
		init: function () {
			var me = this;
		    me.share_enter();
			me.event_handler();
			if(me.enter == "self"){
				$("#btn-refresh").addClass("self-rephoto");
			}
			$("#btn-refresh").removeClass("none");
		},
		share_enter :function(){
			getResult('gzlive/photo/shareindex', {openid:openid,uuid:H.photo.uuid}, 'shareIndexHxHandler',true);
		},
		event_handler : function() {
			var me = this;
			$('.photoedBox').on('click', '#btn-refresh', function(e) {
				e.preventDefault();
				if(H.photo.enter== "self"){
					toUrl("photo.html?type=2");
	     		}else{
	     			toUrl("photo.html");
	     		}
			});
			$('.back-index').click(function(e) {
				e.preventDefault();
				toUrl("index.html") ;
			});
			$(".close-photo").click(function(e) {
				e.preventDefault();
				toUrl("photo.html");
			});
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



