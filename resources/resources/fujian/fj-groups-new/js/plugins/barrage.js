/**
*	JQuery-plus barrage
*		opt.fontSize	Array<Int>
*		opt.fontColor	Array<String>
*		opt.padding		int		(default 10)
*		opt.heightOffset	int	(default 10)
*		opt.leftRange	int 	(default 50)
*		opt.heightPre		int (default 80)
*		opt.speed		int		(default 100px/s)
*
*	Example:
*		var barrage = $(selector).barrage() ;
*		barrage.appendMsg("Hello word!");
*	
*	tips :
*		setTimeout(function(){
*			barrage.appendMsg("Hello word!");
*		},257);	
*
*
*/
;(function(){
	window.appendMsgTimer = 100 ;
	window.maxCache = 50 ;
	window.maxMsgLength = 10 ;
	window.CACHESEND = [] ;
	window.CACHEMSG = [] ;
	window.CACHEMSGINDEX = 0;
	
	$.fn.barrage = function(opts){
		var setting = {
			fontSize : [16, 18, 20]  ,
			fontColor : ["FF0000", "FFC600" , "19AE00", "FFCD02"] ,
			padding : 10 ,
			heightOffset : 10 ,
			itemHeight: 24,
			leftRange : 40 ,
			maxLeftWidth : 8000 ,
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
				$msgDiv = $($("<div> ").appendTo( this )).attr("id", msgPre + msgIndex );

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
				"height": "24px",//setting.itemHeight + "px",
				"line-height": "24px",//setting.itemHeight + "px",
				"background" : "rgba(0, 0, 0, 0.3)",
				"border-radius": '3px',
				"padding": '0 5px 0 8px',
				"color": '#fff'
			});
			$msgDiv.find('label').css({
				"border": '1px solid #fff',
				"border-radius": "50%",
				"width": "30px",
				"height": "30px",
				"position": "absolute",
				"left": "-25px",
				"top": "-5px",
				"overflow": "hidden"
			});
			$msgDiv.find('img').css({
				"width": "100%",
			});
			
			startHeight = startHeight - setting.itemHeight - setting.heightOffset ;
			msgIndex ++ ;
			if( startHeight <= setting.heightPre ){
				startHeight = height ;
				msgIndex = 0 ;
			}
			
			var msgWidth = $msgDiv.width();
			$msgDiv.animate({"left": (0 - msgWidth - 20)+"px" }, this.duration( msgWidth + leftWidth ) , 'ease-in', function(){
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