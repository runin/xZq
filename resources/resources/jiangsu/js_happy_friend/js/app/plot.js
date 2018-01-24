(function($) {
    H.plot = {
        init: function () {
        	this.articleList();
        },
        articleList: function() {
            getResult('api/article/list', {}, 'callbackArticledetailListHandler');
        },
        iFrameHeight: function() {   
			var iFrame = document.getElementById("tvb");   
			var subWeb = document.frames ? document.frames["tvb"].document : iFrame.contentDocument; 
			if(iFrame != null && subWeb != null) {
			   iFrame.height = subWeb.body.scrollHeight;
			   // iFrame.width = subWeb.body.scrollWidth;
			}
		}
    };

    W.callbackArticledetailListHandler = function(data) {
        if (data.code == 0) {
        	$('.tvshow').append('<iframe id="tvb" frameborder="0" width="' + $(window).width() + '" height="220" src="' + data.arts[0].gu + '&tiny=0&auto=0" allowfullscreen></iframe>').append('<p class="tips">精彩提要</p>').append('<p class="info">' + data.arts[0].i + '</p>');
    		$('.detail').html(data.arts[0].cn);
    	}
    };
})(Zepto);

$(function(){
    H.plot.init();
});