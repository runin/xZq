(function($) {
    H.index = {
        init: function(){
        	cb41faa22e731e9b : getQueryString("cb41faa22e731e9b"),
            H.page.init();
            this.resize();
            this.event();
            getResult("api/article/list", {}, 'callbackArticledetailListHandler', true);
        },
        resize: function(){
            var me = this;
            var bg = '';
            shownewLoading(null,'请稍等...');
            imgReady(bg, function() {
                $('.item-animate').removeClass('none').addClass('animated');
                hidenewLoading();
            });
            $('.ctrls').removeClass('none').addClass('animated');

            W.onload = function(){
                $('.page:nth-child(2)').removeClass("none");
            };
        },
        event: function(){
            $(".toupiao").click(function(e){
                e.preventDefault();
                toUrl("vote.html");
            });
            $(".yao").click(function(e){
                e.preventDefault();
                toUrl("yao.html");
            });
            $(".speak").click(function(e){
                e.preventDefault();
                toUrl("comment.html");
            });
             $(".pre").click(function(e){
                e.preventDefault();
                if(!H.index.cb41faa22e731e9b){
                	toUrl("pre.html");
                }else{
                	toUrl("pre.html?cb41faa22e731e9b="+cb41faa22e731e9b);
                }
               
            });
            $("#btn-rule").click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
        }
    };
    H.page = {
        $pages: $('#pages'),
        init: function() {
            var secondPageCon_h = 0;
            var parallax = this.$pages.parallax({
                direction: 'vertical',	// vertical (垂直翻页)
                swipeAnim: 'cover', 		// cover (切换效果)//default
                drag:      true,			// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
                loading:   false,			// 有无加载页
                indicator: false,			// 有无指示点
                arrow:     true,			// 有无指示箭头
                onchange: function(index, element, direction) {
                    var $target = $(element);

                    if (direction == 'forward') {
                        if(!secondPageCon_h){
                            secondPageCon_h = $(".page-con").height();
                            $(".page-con").css({
                                "margin-top": ($(window).height() - secondPageCon_h)/2
                            });
                        }
                    }
                }
            });
        }
    };
    W.callbackArticledetailListHandler = function(data){
        if(data.code == 0){
            $('.page:nth-child(1)').css({
                "background-image": "url(" + data.arts[0].img+ ")",
                "background-size": "100% 100%"
            });
        }
    }

})(Zepto);

$(function() {
    H.index.init();
});