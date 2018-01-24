(function($) {
	var classId = {
		$headLogo: $(".top-logo"),
		$navCon: $(".nav-con"),
		$commentBtn: "comment-btn",
		$signglBtn: "signgl-btn",
		$programBtn: "program-btn",
		$mallBtn: "mall-btn",
		$myBtn: "my-btn",
		$navArrow: $(".nav-arrow")
	};
	
	H.navBtn = {//基本模板
		$nav:true,
		init: function() {
			this.configFn();
			this.navboxFn();
		},
		configFn: function() {//基本信息
		    getResult('api/channelhome/config', {}, 'callbackChannelhomeConfigHandler');
		},
	    footBtn: function() {//按钮动画
			classId.$navCon.find("a").tap(function() {
				var that = $(this);
				if(classId.$navCon.find(".f-an").length>0) {
					return;
			    }
				that.addClass("f-an");

				setTimeout(function() {
					if(that.attr("id") == classId.$signglBtn) {//签到
						if($("body").find(".pop-sign").length > 0) {
							$(".pop-sign").removeClass("none");
							$(".sign-in").addClass("in-top");
						}else {
							H.sign.init();
						}
					}else if(that.attr("id") == classId.$programBtn) {//节目单
						window.location.href="program.html";
						
					}else if(that.attr("id") == classId.$commentBtn) {//弹幕
						H.comment.init();
					}else if(that.attr("id") == classId.$mallBtn) {//商城
					    window.location.href="mall.html";
					}else if(that.attr("id") == classId.$myBtn) {//我的
					    window.location.href="my.html";
					}
					classId.$navCon.find("a").removeClass("f-an");
				},800);
			});
		},
		navboxFn: function() {
			classId.$navArrow.click(function(e) {
				if(H.navBtn.$nav) {
					$(this).parent().removeClass("nav-down").addClass("nav-up");
					H.navBtn.$nav = false;
				}else {
					$(this).parent().removeClass("nav-up").addClass("nav-down");
					H.navBtn.$nav = true;
				}
			});
		}
	};

	W.callbackChannelhomeConfigHandler = function(data) {//基本模板
		if(data && data.code==0) {
			var funs = data.funs;
			classId.$headLogo.find("span").css("backgroundImage","url('"+data.icon+"')");
			for(var i=0,leg=funs.length; i<leg; i++) {
				var name = funs[i].name;
				if(name == "评论管理") {
					$("#"+classId.$commentBtn).removeClass("none");
				}else if(name == "签到管理") {
					$("#"+classId.$signglBtn).removeClass("none");
				}else if(name == "节目单管理") {
					$("#"+classId.$programBtn).removeClass("none");
				}else if(name == "我的") {
					$("#"+classId.$myBtn).removeClass("none");
				}
			}
			H.navBtn.footBtn();
		}
	};

	H.navBtn.init();

})(Zepto);