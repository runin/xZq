(function($){
  	H.index = {
  		init : function(){
  			var me = this;
  			me.tick();
  			me.scrollChalk();
			$(".news-box").animate({"opacity":1},1000,function(){
				$("#audio-tip").get(0).play();
			})	 
  		},
  	    showLocale : function showLocale(objD){   
	        var str,colorhead,colorfoot;   
	        var yy = objD.getYear();   
	            if(yy<1900) yy = yy+1900;   
	        var MM = objD.getMonth()+1;   
	            if(MM<10) MM = '0' + MM;   
	        var dd = objD.getDate();   
	            if(dd<10) dd = '0' + dd;   
	        var hh = objD.getHours();   
	            if(hh<10) hh = '0' + hh;   
	        var mm = objD.getMinutes();   
	            if(mm<10) mm = '0' + mm;   
	        var ss = objD.getSeconds();   
	            if(ss<10) ss = '0' + ss;   
	        var ww = objD.getDay();      
	            if (ww==0) ww="星期日";   
	            if (ww==1) ww="星期一";   
	            if (ww==2) ww="星期二";   
	            if (ww==3) ww="星期三";   
	            if (ww==4) ww="星期四";   
	            if (ww==5) ww="星期五";   
	            if (ww==6) ww="星期六";   
	                str = '<div class="time">' + hh + '<span class="dot"></span>' + mm + '</div><div class="day"><span >'+ MM + '月' + dd + '日' +'</span><span>' + ww +'</span></div>';
	            return(str);   
	    },   
		tick : function (){   
	        var today;   
	        today = new Date();   
	        document.getElementById("localtime").innerHTML = H.index.showLocale(today);   
	        window.setTimeout(function(){
	        	H.index.tick()
	        }, 1000);
	    } ,
	    scrollChalk : function() {
	        this.touchEvent($(".news")[0],$(".news"));
	        this.touchEvent($(".lock")[0],$(".slide"));
	    },
	    touchEvent : function(el,$target){
	    	var startPosition, endPosition, deltaX, deltaY, moveLength;
	        var clientWidth = $(window).width();
	    	 el.addEventListener('touchstart', function (e) {
	                e.preventDefault();
	                var touch = e.touches[0];
	                startPosition = {
	                    x: touch.pageX,
	                    y: touch.pageY
	                }
	            });
	            el.addEventListener('touchmove', function (e) {
	                e.preventDefault();
	                var touch = e.touches[0];
	                endPosition = {
	                    x: touch.pageX,
	                    y: touch.pageY
	                }
	                deltaX = endPosition.x-startPosition.x;
	                deltaY = endPosition.y -startPosition.y;          
					if(deltaX>0){
						$target.css({
							'-webkit-transform': 'translateX('+deltaX+'px)',
							 '-webkit-transition': '-webkit-transform 0s'
						})
					}else{
						$target.css({
							'-webkit-transform': 'translateX(0)',
							 '-webkit-transition': '-webkit-transform 0s'
						})
					}
					
	            });
	            el.addEventListener('touchend', function (e) {
	                e.preventDefault();
		            if (endPosition.x > clientWidth*0.8) {
		                $target.css({'-webkit-transform' :'translateX('+ clientWidth+20+'px)',
		                '-webkit-transition': '-webkit-transform .5s ease'
		                });
		                toUrl('enter.html');
		            }else{
	                    $target.css({'-webkit-transform' : 'translateX(0px)',
	                    '-webkit-transition': '-webkit-transform .5s ease'
	                   });
		            }
	            });
	    }
	}
 })(Zepto)
 $(function() {
    H.index.init();
});
