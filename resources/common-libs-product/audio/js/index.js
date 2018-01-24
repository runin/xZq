(function($) {
	
	H.index = {
		
		init: function() {
			var $audio = $('#ui-audio').audio({
				auto: true,			// 是否自动播放，默认是true
				stopMode: 'stop',	// 停止模式是stop还是pause，默认stop
				audioUrl: 'http://cdn.holdfun.cn/ahtvcomedian/audio/20141127/chaojixiaoxing.mp3',
				steams: ["<img src='./images/icon-musical-note.png' />", "<img src='./images/icon-musical-note.png' />"],
				steamHeight: 150,
				steamWidth: 44
			});
			
			setTimeout(function() {
				$audio.pause();
				//$audio.stop();
			}, 2000);
		}	
			
	};
	
})(Zepto);

$(function() {
	H.index.init();
});