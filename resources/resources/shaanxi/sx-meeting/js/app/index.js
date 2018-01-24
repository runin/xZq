(function($){
	H.command = {
		passwrod : "",
		isPass : getQueryString("isPass"),
		isEnter : false,
		init : function(){
			this.command();
			this.event();
			if(this.isPass){
				H.command.yaoPage();
			}else{
				$(".ad-box").removeClass("hidden").css({"opacity" : "1"});
				$(".bg").removeClass("hidden").css({"opacity" : "1"});
				$(".home-box").addClass("hidden").css({"opacity" : "0"});
			}
		},
		command : function(){
			getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler');
		},
		event : function(){
			$("#btn-sub").click(function(e){
				e.preventDefault();
				$(this).addClass("requesting");
				$(".command-info").addClass("disabled");
				var inputText = $(".command-info").val();
				if(inputText.length == 0){
					showTips("请输入口令");
					$("#btn-sub").removeClass("requesting");
					return;
				}
				if(inputText == H.command.passwrod ){
					showTips("口令匹配成功");
					H.command.showyao();
					setTimeout(function(){
						if(!is_android()){
							window.location.href = "index.html?isPass=true";
						}
					},2000)
					
				}else{
					$("#btn-sub").removeClass("requesting");
					$(".command-info").val("").removeClass("disabled");
					showTips("口令匹配失败");
				}
			})
		},
		showyao : function(){
			$(".ad-box").removeClass("hidden").animate({"opacity" : "0"},1000);
			setTimeout(function(){
				$(".home-box").removeClass("hidden").animate({"opacity" : "1"},1500);
				$(".ad-box").addClass("hidden");
				$(".bg").addClass("hidden");
				H.command.isEnter = true;
			},1000)
		},
		yaoPage : function(){
			$(".ad-box").addClass("hidden").css({"opacity" : "0"});
			$(".home-box").removeClass("hidden").css({"opacity" : "1"});
			$(".bg").addClass("hidden");
			H.command.isEnter = true;
		}
	}
	window.callbackLinesDiyInfoHandler = function(data){
		hidenewLoading()
		if(data&&data.code == 0&&data.gitems){
			H.command.passwrod = data.gitems[0].info;
		}else{
			$(".command").removeClass("none");
		}
	}

})(Zepto);
$(function(){
	H.command.init();
})
