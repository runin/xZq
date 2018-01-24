(function($) {
	var classId = {
		$nickname: $("#nickname"),
		$headimg: $(".head-url"),
		$myGold: $(".my-gold"),
		$orderBox: $(".order-box"),
		$swiperData: $("#swiper-data"),
		$bgBlur: $(".bg-blur"),
		$srcimg: $("#srcimg"),
		$canvas: $("#canvas"),
		$canvasShow: $("#canvas-show"),
		$headLogo: $(".head_logo"),
		$footBtn: $(".foot-btn"),
	    $fBtn: $(".f-btn"),
		$commentBtn: "comment-btn",
		$signglBtn: "signgl-btn",
		$programBtn: "program-btn",
		$mallBtn: "mall-btn",
	};
	
	H.nav = {//基本模板
		init: function(funs) {
			for(var i=0,leg=funs.length; i<leg; i++) {
				var name = funs[i].name;
				if(name == "评论管理") {
					$("#"+classId.$commentBtn).removeClass("none");
				}else if(name == "签到管理") {
					$("#"+classId.$signglBtn).removeClass("none");
				}else if(name == "节目单管理") {
					$("#"+classId.$programBtn).removeClass("none");
				}else if(name == "商城管理") {
					$("#"+classId.$mallBtn).removeClass("none");
				}
			}
			H.nav.footBtn();

		},
		
	    footBtn: function() {//按钮动画
			classId.$footBtn.find("a").tap(function() {
				var that = $(this);
				if(classId.$footBtn.find(".f-an").length>0) {
					return;
			    }
				that.addClass("f-an");

				setTimeout(function() {
					
					if(that.attr("id") == classId.$signglBtn) {//签到
						if($("body").find(".pop-sign").length > 0) {
							$(".pop-sign").removeClass("none");
							$(".sign-in").addClass("in-top");
						}else {
							H.sign.signHtml();
						}
					}else if(that.attr("id") == classId.$programBtn) {//节目单
						window.location.href="program.html";
						
					}else if(that.attr("id") == classId.$commentBtn) {//弹幕
						/*if($("body").find(".pop-box").length>0) {
							$(".comments").empty();
							$(".pop-box").removeClass("none");
							$(".comment-box").addClass("in-up");
						}else {
							H.comment.init();
						}*/
						H.comment.init();
					}else if(that.attr("id") == classId.$mallBtn) {//商城
					    window.location.href="mall.html";
					}
					classId.$fBtn.removeClass("f-an");
				},800);
			});
		}
	};

})(Zepto);