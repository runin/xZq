(function($) {
    H.index = {
        init: function(){
            H.page.init();
            this.resize();
            this.event();
            getResult("api/article/list", {}, 'callbackArticledetailListHandler', true);
        },
        resize: function(){
            var me = this;
            var bg = 'images/bg1.jpg';
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
            var me = H.index;
            $(".go").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("yao.html");
            });
            $("#btn-rule").click(function(e) {
				e.preventDefault();
                me.btn_animate($(this));
				H.dialog.rule.open();
			});
            $(".record").click(function(e) {
				e.preventDefault();
                me.btn_animate($(this));
                toUrl("record.html");
			});
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };
    H.page = {
        $pages: $('#pages'),
        init: function() {
            if(getQueryString('yao')){
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    direction: 'vertical',
                    initialSlide :1
                });
                H.talk.init();
                $(".page").on('touchmove',function(e){
                    e.stopPropagation();
                });
            }else{
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    direction: 'vertical',
                    initialSlide :0,
                    onSlideChangeEnd: function(swiper) {
                        H.talk.init();
                    }
                });
            }


            /*var secondPageCon_h = 0;
            var parallax = this.$pages.parallax({
                direction: 'vertical',	// vertical (垂直翻页)
                swipeAnim: 'cover', 		// cover (切换效果)//default
                drag:      true,			// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
                loading:   false,			// 有无加载页
                indicator: false,			// 有无指示点
                arrow:     true,			// 有无指示箭头
                curPage: 1,
                onchange: function(index, element, direction) {
                    var $target = $(element);

                    if (direction == 'forward') {
                        if(!secondPageCon_h){
                            secondPageCon_h = $(".page-con").height();
                            H.talk.init();
                            $(".page:nth-child(2)").css('display','block');
                        }
                    }
                }
            });
            if(getQueryString('yao')){
                $(".page").removeClass("current").addClass("none");
                $(".page:nth-child(2)").addClass("current").css('display','block').removeClass("none");
                H.talk.init();
                $(".page").on('touchmove',function(e){
                        e.stopPropagation();
                });
            }*/
        }
    };

    W.callbackArticledetailListHandler = function(data){
        if(data.code == 0){
            $('.swiper-slide:nth-child(1)').css({
                "background-image": "url(" + data.arts[0].img+ ")",
                "background-size": "100% 100%"
            });
        }
    }

})(Zepto);

$(function() {
    H.index.init();
});