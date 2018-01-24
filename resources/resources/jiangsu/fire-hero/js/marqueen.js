/*$.fn.marqueen = function(options){
	$.fn.marqueen.defalut = {
		mode: "top",
		speed: 50,
		container: "#marqueen ul",
		row: 1,
		defaultIndex: 0,
		fixWidth: 0
	};
	return this.each(function(){
		var opts = $.extend({}, $.fn.marqueen.defalut, options);
		var fixWidth = opts.fixWidth;
		var container = $(opts.container, $(this));
		var containerSize = container.children().size();
		var slideH = 0;
		var slideW = 0;
		var selfW = 0;
		var selfH = 0;
		var flag = null;
		var winH = $(window).height();

		var allH = Math.floor(winH*0.35);
		var allH14 = Math.floor(allH*0.25);
		var allH12 = Math.floor(allH*0.5);
		var allH34 = Math.floor(allH*0.75);
		if(containerSize < opts.row) return;
		container.children().each(function(){
			if($(this).width() > selfW){
				selfW = $(this).width();
				slideW = $(this).width() + fixWidth;
			}
			if($(this).height() > selfH){
				selfH = $(this).height();
				slideH = $(this).height();
			}
		});
		switch(opts.mode){
			case "top":
				while(container.children().size() < 30){
					container.children().clone().appendTo(container);
					containerSize = container.children().size();
				}
				container.wrap('<div class="mqWrapper" style="overflow:hidden;position:relative;"></div>').css( {
					"height":containerSize*slideH*3,
					"position":"relative",
					"padding":"0",
					"margin":"0",
					"-webkit-transform":"translateY("+ allH +"px)"}).children().css({"margin":"0"});
				break;
		}
		var startIndex = 0;
		var doPlay = function(){console.log(1);
			switch (opts.mode){
				case "top":
					var tempTop = container.css("-webkit-transform").replace("translateY(",'').replace("px)",'');
					var lastLi = container.children().eq(containerSize-1);

					container.animate({"-webkit-transform":"translateY(" + (--tempTop) + "px)"},0,function(){
						if(lastLi.offset().top <= -lastLi.height()){
							container.css("-webkit-transform","translateY(" + allH + "px)");
							startIndex = 0;
						}
						if(tempTop % 10 == 0 )
						{
							for(var i=startIndex; i<startIndex+5; i++){
								var childrenEq = container.children().eq(i);
								var childrenTop = childrenEq.offset().top;
								if(childrenTop < -55 && startIndex + 5 < containerSize)
								{
									startIndex++;
								}
								if(childrenTop < allH34 && childrenTop > allH12)
								{
									childrenEq.css("background", "rgba(0,0,0, .6)");
								}
								else if(childrenTop < allH12 && childrenTop > allH14)
								{
									childrenEq.css("background", "rgba(0,0,0, .4)");
								}
								else if(childrenTop < allH14 && childrenTop > 0)
								{
									childrenEq.css("background", "rgba(0,0,0, .2)");
								}else if(childrenTop > allH || childrenTop < -50)
								{
									childrenEq.css("background", "rgba(0,0,0, 1)");
								}
							}
						}
					});
					break;
			}
		};

		doPlay();
		flag = setInterval(doPlay, opts.speed);
	});
};*/

$.fn.marqueen = function(options){
	$.fn.marqueen.defalut = {
		mode: "top",
		speed: 50,
		container: "#marqueen ul",
		row: 1,
		defaultIndex: 0,
		fixWidth: 0
	};
	return this.each(function(){
		var opts = $.extend({}, $.fn.marqueen.defalut, options);
		var fixWidth = opts.fixWidth;
		var container = $(opts.container, $(this));
		var containerSize = container.children().size();
		var slideH = 0;
		var slideW = 0;
		var selfW = 0;
		var selfH = 0;
		var flag = null;
		var winH = $(window).height();

		var allH = Math.floor(winH*0.35);
		var allH14 = Math.floor(allH*0.25);
		var allH12 = Math.floor(allH*0.5);
		var allH34 = Math.floor(allH*0.75);
		if(containerSize < opts.row) return;
		container.children().each(function(){
			if($(this).width() > selfW){
				selfW = $(this).width();
				slideW = $(this).width() + fixWidth;
			}
			if($(this).height() > selfH){
				selfH = $(this).height();
				slideH = $(this).height();
			}
		});
		switch(opts.mode){
			case "top":
				while(container.children().size() < 30){
					container.children().clone().appendTo(container);
					containerSize = container.children().size();
				}
				container.wrap('<div class="mqWrapper" style="overflow:hidden;position:relative;"></div>').css( {
					"height":containerSize*slideH*3,
					"position":"relative",
					"padding":"0",
					"margin":"0",
					"top":allH}).children().css({"margin":"0"});
				break;
		}
		var startIndex = 0;
		var doPlay = function(){
			switch (opts.mode){
				case "top":
					var tempTop = container.css("top").replace("px","");
					var lastLi = container.children().eq(containerSize-1);
					container.animate({"top":--tempTop},0,function(){
						if(lastLi.offset().top == -lastLi.height()){
							container.css("top",allH);
							startIndex = 0;
						}
						if(tempTop % 10 == 0 )
						{
							for(var i=startIndex; i<startIndex+5; i++){
								var childrenEq = container.children().eq(i);
								var childrenTop = childrenEq.offset().top;
								if(childrenTop < -30 && startIndex + 5 < containerSize)
								{
									startIndex++;
								}
								if(childrenTop < allH34 && childrenTop > allH12)
								{
									childrenEq.css("background", "rgba(0,0,0, .6)");
								}
								else if(childrenTop < allH12 && childrenTop > allH14)
								{
									childrenEq.css("background", "rgba(0,0,0, .4)");
								}
								else if(childrenTop < allH14 && childrenTop > 0)
								{
									childrenEq.css("background", "rgba(0,0,0, .2)");
								}else if(childrenTop > allH || childrenTop < -50)
								{
									childrenEq.css("background", "rgba(0,0,0, 1)");
								}
							}
						}
					});
					break;
			}
		};

		doPlay();
		flag = setInterval(doPlay, opts.speed);
	});
};
