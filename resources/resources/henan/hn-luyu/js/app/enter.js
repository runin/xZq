/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		flag : false,
		from: getQueryString('from'),
		init: function () {
			this.event_handler();
			this.tick();
			getResult('api/newsclue/count', {openid :openid}, 'callbackClueCountHandler ', true);
		},
		event_handler : function() {
			var me = this;
			$('#btn-er').click(function(e) {
				e.preventDefault();
				if (!$(this).hasClass('request')) {
					$(this).addClass('request');
					H.dialog.erweima.open();
					setTimeout(function(){
						$("#btn-er").removeClass('request');
					}, 1000);
				}
				return;
			});
			$('#btn-bao').click(function(e) {
				e.preventDefault();
				if (!$(this).hasClass('request')) {
					$(this).addClass('request');
					if(H.index.flag){
						toUrl('baoliao_success.html') ;
					}else{
						toUrl("baoliao.html");
					}
					setTimeout(function(){
						$("#btn-bao").removeClass('request');
					}, 1000);
				}
				return;
			});
			$(".audio-icon").click(function(e){
				e.preventDefault();
				//在播放
				var me = $(this);
				$(".unplay").remove();
				if(!me.hasClass("playing")){
					me.find("#luyu-audio").attr("src","images/luyu-audio.mp3");
					me.find("#luyu-audio").get(0).play();
				    me.addClass("playing");
				    me.addClass("animated");
					me.find("#luyu-audio").get(0).addEventListener('ended', function(e){
						me.removeClass("animated");
						me.removeClass("playing");
					}, false);
				}else{
					me.find("#luyu-audio").get(0).pause();
					me.removeClass("playing");
					me.removeClass("animated");
					me.find("#luyu-audio").attr("src","");
				}
			});
			$(".dia-share").click(function(e){
				shownewLoading();
				toUrl("activity.html");
			})
		},
		showLocale : function showLocale(objD){   
	        var str,colorhead,colorfoot;    
	        var hh = objD.getHours();   
	            if(hh<10) hh = '0' + hh;   
	        var mm = objD.getMinutes();   
	            if(mm<10) mm = '0' + mm;   
	                str = '<div class="time">' + hh + '<span class="dot">:</span>' + mm + '</div>';
	            return(str);   
	    },   
		tick : function (){   
	        var today;   
	        today = new Date();   
	        document.getElementById("dia-time").innerHTML = H.index.showLocale(today);   
	        window.setTimeout(function(){
	        	H.index.tick()
	        }, 1000);
	    } ,
	}
window.callbackClueCountHandler = function(data) {
	if(data&&data.code == 0&&data.count >0 ){
		H.index.flag = true;
		//toUrl('baoliao_success.html') ;
	}else{
		H.index.flag = false;
		//toUrl('baoliao.html') ;
	}
};
})(Zepto);                             

$(function(){
	H.index.init();
});


