(function($){
    H.index = {
        init: function(){
            this.event();
            getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler');
            //getResult('api/article/list', {}, 'callbackArticledetailListHandler');
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        event: function(){
            var me = H.index;
            $(".go").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("card.html?cb41faa22e731e9b="+cb41faa22e731e9b);
            });
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
    	if(data.code == 0){
    		$(".tlt").attr("src",data.gitems&&data.gitems[0].is?data.gitems[0].is:"images/tlt.png");
    	}else{
    		$(".tlt").attr("src","images/tlt.png");
    	}
    };
    W.callbackArticledetailListHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.code == 0){
                $(".go").before('<img class="ad" src="' + (data.arts[0].img).toString() + '" />');
            }else if(data.code == 1){
            }
        }
        hidenewLoading();
    }
})(Zepto);
$(function(){
    H.index.init();
});
