;(function(){
	window.appendMsgTimer = 100 ;
	window.maxCache = 50 ;
	window.maxMsgLength = 8 ;
	window.CACHESEND = [] ;
	window.CACHEMSG = [] ;
	window.CACHEMSGINDEX = 0;

	$.fn.barrage = function(opts){
		var setting = {
			fontSize : [16, 18, 24]  ,
			fontColor : ["FFFFFF", "FFF000", "FF0077"] ,
			padding : 10 ,
			heightOffset : 10 ,
			itemHeight: 26,
			leftRange : 40 ,
			maxLeftWidth : 6000 ,
			heightPre : 80 ,
			speed : 80
		};

		var that = this,
			msgPre = "msg-index",
			leftWidth = width = that.width() ,
			startHeight = height = that.height() ,
			msgIndex = 0,
			fontSizeLen = setting.fontSize.length,
			fontColorLen = setting.fontColor.length;

		$.extend({}, setting, opts);
		this.getLastLeft = function(){
			var $msg = $("#" + msgPre + msgIndex ) ;
			if( $msg.length != 0 ){
				$msg.removeAttr("id");
				var lastWidth = $msg.offset().left + $msg.width() ;
				return (lastWidth > 0 && lastWidth < width ) ? null : lastWidth ;
			}
			return null ;
		};

		this.appendMsg = function( msg ){
			if( !msg ) {
				return ;
			}
			var leftWidth = this.getLastLeft() || width,
				$msgDiv = $($("<div>").appendTo( this )).attr("id", msgPre + msgIndex );

			if( leftWidth > setting.maxLeftWidth ) {
				leftWidth = leftWidth%setting.maxLeftWidth + width ;
			}
			$msgDiv.html( msg );
			$msgDiv.css({
				"white-space": "nowrap",
				"position" : "absolute" ,
				"display" : "block" ,
				"left": Math.floor(Math.random() * setting.leftRange) + leftWidth + "px",
				"top" : (height-startHeight + setting.itemHeight )  + "px" ,
				"height": setting.itemHeight + 12 + "px",
				"line-height": setting.itemHeight + 7 + "px",
				"fontSize" : this.randSize()  + "px" ,
				"color" : "#" + this.randColor(),
				"border-radius": '3px',
				"padding": '2px 8px'
			});
			$msgDiv.find('img').css({
				"position" : "relative" ,
				"display" : "inline-block" ,
				"border-radius": "100%",
				"-webkit-border-radius": "100%",
				"height": "26px",
				"width": "26px",
				"top": "-3px",
				"margin-right": "6px",
				"overflow": "hidden",
				"font-size" : "0" ,
				"vertical-align": "middle"
			});

			startHeight = startHeight - setting.itemHeight - setting.heightOffset ;
			msgIndex ++ ;
			if( startHeight <= setting.heightPre ){
				startHeight = height ;
				msgIndex = 0 ;
			}

			var msgWidth = $msgDiv.width();
			$msgDiv.animate({"left": (0 - msgWidth - 50)+"px" }, this.duration( msgWidth + leftWidth ) , 'ease-in', function(){
				$(this).remove() ;
			});
		};

		this.randSize = function(){
			return setting.fontSize[Math.floor(Math.random() * fontSizeLen)] ;
		};

		this.randColor = function(){
			return setting.fontColor[Math.floor(Math.random()* fontColorLen)] ;
		};

		this.duration = function( distance){
			return distance / setting.speed * 1000;
		};

		this.pushMsg = function( msg ){
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