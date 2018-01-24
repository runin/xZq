/**
 *评论抽奖页
 */
(function($) {
     H.listen = {
     	urlData :getQueryString("attr_uuid"),
     	init: function(){
     		var me = this;
     		var w = ($(".main").width()-32)*0.2;
     		$("#coffee-flow label").height(w);
     		$("#coffee-flow").height(w);
     		$("#coffee-flow label img").height(w);
     		$(".audio-icon").height(w);
     		$(".back-before").click(function(e) {
				e.preventDefault();
				window.location.href = "before.html";
			});
			me.showInfo();
     		
     	},
     	showInfo : function(){
     		getResult('waitme/indexhx', {}, 'waitmeIndexHandler', true);
     	},
     }
     W.waitmeIndexHandler = function(data){
     		var t = simpleTpl(),
			 attrs = data.attrs[0];
				$("#coffee-flow label img").attr("src",attrs.asi);
				$(".audio-info label img").attr("src",attrs.ai);						
				$(".audio-info .info-text").html(attrs.ad);
				var w = ($(".main").width()-32)*0.2;
				$("#coffee-flow label").height(w);
				$("#coffee-flow label img").height(w);
				$("#coffee-flow").height(w);
				$(".audio-icon").height(w);
				$("header.top-nav").addClass("none");				
				$(".main").removeClass("none");
				var $audio = $('#ui-audio').audio({
					auto: false,			// 是否自动播放，默认是true
					stopMode: 'stop',	// 停止模式是stop还是pause，默认stop
					audioUrl: attrs.am,
					steams:["<img src='./images/icon-musical-note.png' />", "<img src='./images/icon-musical-note.png' />"],
					steamHeight: 150,
					steamWidth: 44
				});
				setTimeout(function() {
				     $audio.pause();
				     //$audio.stop();
				}, 2000);
     }
})(Zepto);
$(function(){
	H.listen.init();
});