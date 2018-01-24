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
		var index = opts.defaultIndex;
		var oldIndex = index;
		var fixWidth = opts.fixWidth;
		var container = $(opts.container, $(this));
		var containerSize = container.children().size();
		var slideH = 0;
		var slideW = 0;
		var selfW = 0;
		var selfH = 0;
		var flag = null;

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
			case "left":
				container.children().clone().appendTo(container).clone().prependTo(container); 
				container.wrap('<div class="mqWrapper" style="overflow:hidden;position:relative;"></div>').css( { "width":containerSize*slideW*3,"position":"relative","overflow":"hidden","padding":"0","margin":"0","left":-containerSize*slideW}).children().css({"float":"left","text-center":"center"});
				break;
			case "top":
				container.children().clone().appendTo(container).clone().prependTo(container); 
				container.wrap('<div class="mqWrapper" style="overflow:hidden;position:relative;height:'+opts.row*slideH+'px"></div>').css( { "height":containerSize*slideH*3,"position":"relative","padding":"0","margin":"0","top":-containerSize*slideH}).children().css({"width":"100%","margin":"0","height":selfH});
				break;
		}
		var doPlay = function(){
			switch(opts.mode){
				case "left":
				case "top":
					if (index >= 2){
						index = 1;
					} else if(index < 0){
						index = 0;
					}
					break;
			}
			switch (opts.mode){
				case "left":
					var tempLeft = container.css("left").replace("px",""); 
					if(index == 0){
						container.animate({"left":++tempLeft},0,function(){
							if(container.css("left").replace("px","") >= 0){
								for(var i=0; i<containerSize; i++){
									container.children().last().prependTo(container);
								};
								container.css("left", -containerSize*slideW);
							}
						});
					} else {
						container.animate({"left":--tempLeft},0,function(){
							if(container.css("left").replace("px","") <= -containerSize*slideW*1.755){
								for(var i=0; i<containerSize; i++){
									container.children().first().appendTo(container);
								};
								container.css("left", -containerSize*slideW);}
						});
					}
					break;
				case "top":
					var tempTop = container.css("top").replace("px",""); 
					if(index == 0){
						container.animate({"top":++tempTop},0,function(){
							if(container.css("top").replace("px","") >= 0){
								for(var i=0; i<containerSize; i++){
									container.children().last().prependTo(container);
								};
								container.css("top",-containerSize*slideH);
							}
						});
					} else {
						container.animate({"top":--tempTop},0,function(){
							if(container.css("top").replace("px","") <= -containerSize*slideH*2){
								for(var i=0; i<containerSize; i++){
									container.children().first().appendTo(container);
								};
								container.css("top",-containerSize*slideH);
							}
						});
					}
					break;
				}
				oldIndex=index;
		};

		doPlay();
		index++;
		flag = setInterval(doPlay, opts.speed);
	});
};