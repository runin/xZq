(function($){
	//shownewLoading();
  	H.index = {
  		init : function(){
  			var me = this;
  			me.tick();
  			me.scrollChalk();
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
	        this.touchEvent($(".news-box")[0]);
	        this.touchEvent($(".lock span")[0]);
	    },
	    touchEvent : function(el){
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
	                deltaX = endPosition.x-startPosition.x ;
	                deltaY = endPosition.y -startPosition.y;
	                $(".slide").animate({"left": deltaX});
	            });
	            el.addEventListener('touchend', function (e) {
	                e.preventDefault();
					$(".slide").animate({'left' : deltaX},function(){
		                if (deltaX > 80) {
		                	$(".slide").animate({'left' : clientWidth+20});
		                    toUrl('enter.html');
		                }else{
	                   		$(".slide").animate({'left' : 0},1000);
		                }
	                });
	            });
	    }
	}
 })(Zepto)
 $(function() {
    H.index.init();
});
