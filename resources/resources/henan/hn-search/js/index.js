
$(function(){
	var arr = [],search = document.getElementById("search");
	var result = false;
	var $audio = $('#ui-audio').audio({
		auto: true,			// 是否自动播放，默认是true
		stopMode: 'pause',	// 停止模式是stop还是pause，默认stop
		audioUrl: './images/audio-a.mp3',
		steams: ["<img src='./images/icon-musical-note.png' />", "<img src='./images/icon-musical-note.png' />"],
		steamHeight: 34,
		steamWidth: 34
	});
	setTimeout(function(){
		$(".ad-list").find(".li1").addClass("bounceInDown");
		$(".ad-list").find(".li2").addClass("bounceInDown");
		$(".ad-list").find(".li3").addClass("show");
		$(".ad-list").find(".li4").addClass("bounceInUp");
		$(".ad-list").find(".li5").addClass("bounceInUp");
		$(".ad-list").removeClass("hidden");
	},500)
	$(".search").on("click",function(e){
		e.preventDefault();
		$(".icon-search").addClass("none");
		$(search).focus();
	});
	$(".ad-img").on("click",function(e){
		e.preventDefault();
		$ad = $(this);
		$ad.addClass("pulse");
		setTimeout(function(){
			$ad.removeClass("pulse");
			window.location.href = $ad.find("a").attr('data-href');
		},1000);
		
	});

	$(".icon-close").on('click',function(e){
		e.preventDefault();
		e.stopPropagation();
		$(search).val("");
		if($(".icon-search").hasClass("none")){
			$(".icon-search").removeClass("none");
		}
		$(".search-list").empty().addClass("none");
		$(".ad-list").removeClass("none");
		
	});
	search.addEventListener("input",function(e){
		$(".ad-img").removeClass("select");
		if(!search.value){
			$(".search-list").empty().addClass("none");
			$(".ad-list").removeClass("none");
		}else{
			var patterm=new RegExp(search.value,"gi");
			var len = $(".search-list").find(".ad-img").length;
			result = false;
			//输入改变就把之前的结果清空
			$(".search-list").empty();
			$(".ad-img").each(function(){
				if(patterm.test($(this).attr('data-desc'))){
					var selected = false;
					var _select = "";
					var $select = $(this);
					var selectNum = $select.attr("data-num");
					//判断是否和之前匹配的重复
					if(len > 0){
						$(".search-list").find(".ad-img").each(function(){
							if(selectNum === $(this).attr("data-num")){
								selected = true;
							}
						})
					}else{
						selected = false;
						
					}
					//没有重复，添加到查询列表
					if(!selected){
						_select = $select.get(0).cloneNode(true);
						$(_select).appendTo($(".search-list"));
						$(_select).addClass("bounceInDownR");
						setTimeout(function(){
							$(_select).removeClass("bounceInDownR");
						},1000);
						$(".search-list").find(".ad-img").on("click",function(e){
							e.preventDefault();
							$ad = $(this);
							$ad.addClass("pulse1");
							setTimeout(function(){
								$ad.removeClass("pulse1");
								window.location.href = $ad.find("a").attr('data-href');
							},1000);
							
						});
					}
					result = true;
					$(".search-list").removeClass("none");
					$(".ad-list").addClass("none");
				}
			})
			//是否有匹配结果
			if(!result){
				$(".search-list").html("<p>没有相关的结果<p>").removeClass("none");
				$(".ad-list").addClass("none");
			}else{
				$(".search-list").find("p").remove();
				$(".search-list").removeClass("none");
				$(".ad-list").addClass("none");
				
			}
		}
	});


	
})