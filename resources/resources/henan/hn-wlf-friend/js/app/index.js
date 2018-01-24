(function($){
    H.index = {
        init: function(){
            this.event();
            getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler');
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
                toUrl("vote.html?cb41faa22e731e9b="+cb41faa22e731e9b);
            });
        }
    }
    W.callbackLinesDiyInfoHandler = function(data){
        //is:小图
        //ib:大图
    	if(data.code == 0){
    		$(".tlt").attr("src",data.gitems&&data.gitems[0].ib?data.gitems[0].ib:"images/tlt.png");
            if(data.gitems[0].is){
                $("#gg").attr("src",data.gitems[0].is).removeClass("none");
            }
            if(data.gitems[0].mu){
                $("#gg").click(function(e){
                    e.preventDefault();
                    toUrl(data.gitems[0].mu);
                });
            }

    	}else{
    		$(".tlt").attr("src","images/tlt.png");
    	}
    }
})(Zepto);
$(function(){
    H.index.init();
});
