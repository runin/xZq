;(function(){
	window.appendMsgTimer = 100 ;
	window.maxCache = 50 ;
	window.maxMsgLength = 10 ;
	window.CACHESEND = [] ;
	window.CACHEMSG = [] ;
	window.CACHEMSGINDEX = 0;
	
	$.fn.barrage = function(opts){
		var setting = {
			fontSize : [15]  ,
			fontColor : ["FFFFFF"] ,
			padding : 10 ,
			heightOffset : 10 ,
			itemHeight: 28,
			leftRange : 40 ,
			maxLeftWidth : 2000 ,
			heightPre : 80 , 
			speed : 80
		};

		$.extend({}, setting, opts);
		var that = this,
			msgPre = "msg-index",
			leftWidth = width = that.width() , 
			startHeight = height = that.height() , 
			msgIndex = 0,
			fontSizeLen = setting.fontSize.length,
			fontColorLen = setting.fontColor.length;
		this.getLastLeft = function(){
			var $msg = $("#" + msgPre + msgIndex ) ;
			if($msg.length != 0){
				$msg.removeAttr("id");
				var lastWidth = $msg.offset().left + $msg.width() ;
				return (lastWidth > 0 && lastWidth < width ) ? null : lastWidth ;
			}
			return null ;
		};
		
		this.appendMsg = function( msg ){
			if(!msg) {
				return ;
			}
			var leftWidth = this.getLastLeft() || width,
				$msgDiv = $("<div>").attr("id", msgPre + msgIndex);
			$msgDiv.addClass("comment_item");

			if (leftWidth > setting.maxLeftWidth) {
				leftWidth = leftWidth % setting.maxLeftWidth + width;
			}
			$msgDiv.html(msg);
			$msgDiv.css({
				"white-space": "nowrap",
				"position" : "absolute" ,
				"display" : "block" ,
				"-webkit-transform": "translateX(" + (leftWidth + 40) + "px)",
				"top" : (height-startHeight + setting.itemHeight )  + "px" ,
				"height": setting.itemHeight + "px",
				"line-height": setting.itemHeight + "px",
				"fontSize" : this.randSize()  + "px" ,
				"color" : "#" + this.randColor(),
				"border-radius": '3px',
				"padding": '0 5px 0 8px'
			});

			startHeight = startHeight - setting.itemHeight - setting.heightOffset;
			msgIndex++;
			if (startHeight <= setting.heightPre) {
				startHeight = height;
				msgIndex = 0;
			}

			$msgDiv.appendTo(this);
			var msgWidth = $msgDiv.width();


			var that = this;
			var dtime = that.duration(msgWidth + leftWidth);
			var sid = "s_" + msgPre + msgIndex+parseInt(Math.random() * 1000);
			var className = "pass_barrage" + msgIndex+parseInt(Math.random() * 1000);
			var style = $('<style style="display:none" id=' + sid + '></style>');
			var arr = [];
			arr.push("." + className + " {");
			arr.push("-webkit-animation-name: " + className + "_a;");
			arr.push("-webkit-animation-duration: " + (dtime / 1000) + "s;");
			arr.push("-webkit-animation-timing-function: " + (parseInt(Math.random() * 10) % 2 == 0 ? "linear" : "ease") + ";");
			arr.push("-webkit-animation-iteration-count: 1;");
			arr.push("}");
			arr.push(" @-webkit-keyframes " + className + "_a {");
			arr.push(" 100% {");
			arr.push(" -webkit-transform:translateX(" + (0 - msgWidth) + "px);");
			arr.push(" }");
			arr.push("}");
			style[0].innerHTML = arr.join("");
			$("head").append(style);
			$msgDiv.addClass(className);

			(function (m, t, s) {
				setTimeout(function () {
					m.hide();
					m.remove();
					s.remove();
				}, t);
			})($msgDiv, dtime, style);
		};
		
		this.randSize = function(){
			return setting.fontSize[Math.floor(Math.random() * fontSizeLen)] ;
		};
		
		this.randColor = function(){
			return setting.fontColor[Math.floor(Math.random()* fontColorLen)] ;
		};
		
		this.duration = function(distance){
			return distance / setting.speed * 1000;
		};
		
		this.pushMsg = function(msg){
			if( window.CACHESEND.length < window.maxCache ) {
				window.CACHESEND.push(msg);
			} else {
				window.CACHESEND[Math.floor( Math.random() * 1000) % window.maxCache] = msg ;
			}
			
			if( window.CACHEMSG.length < window.maxCache ) {
				window.CACHEMSG.push(msg);
			} else {
				window.CACHEMSG[Math.floor( Math.random() * 1000) % window.maxCache] = msg ;
			}
		};
		
		this.start = function( startType ){
			$.appendMsg4Cache();
			
			if( startType != 0 ){
				$.appendMsg4Data();
			}
		};
		return this;
	};
	
	$.appendMsg4Cache = function(){
    	setTimeout(function(){
    		if( window.CACHESEND.length > 0 && barrage.find("div").length < window.maxMsgLength){
        		barrage.appendMsg(window.CACHESEND.pop());
        	}
   		 	$.appendMsg4Cache();
    	}, window.appendMsgTimer );
	};
	
	$.appendMsg4Data = function(){
        setTimeout(function(){
        	var cacheLen = window.CACHEMSG.length;
        	window.CACHEMSGINDEX = window.CACHEMSGINDEX % cacheLen;
        	
        	if( barrage.find("div").length < Math.min(cacheLen, window.maxMsgLength)){
        		window.CACHESEND.push(window.CACHEMSG[window.CACHEMSGINDEX ++]);
        	}
        	$.appendMsg4Data();
        }, 70);
	};
	
})();