(function($){
    H.card = {
        init: function(){
            this.event();
            this.spellDom(cards);
        },
        event: function(){
            var me = this;
            $('.swiper-wrapper').delegate('li', 'click', function(e){
                e.preventDefault();
                var $this = $(this);
                $this.addClass('selected');
                setTimeout(function(){
                    H.dialog.sentCard.open($this.attr('data-t'), $this.attr('data-uid'), $this.attr('data-is'), $this.attr('data-mu'), $this.attr('data-info'));
                    $this.removeClass('selected');
                },800);
            });
            $('.yao').tap(function(e){
                e.preventDefault();
                H.dialog.btn_animate($(this));
                toUrl("lottery.html");
            });
            $('.jmd').tap(function(e){
                e.preventDefault();
                H.dialog.btn_animate($(this));
                toUrl('program.html?type=card');
            });
        },
        resize:function(){
            var me = H.card,
                winW = $(window).width(), winH = $(window).height();
            var headerH = winW/(641/241);
            $('header').css({
                'background-image': "url(images/head-bg.png)",
                'background-size': '100% auto',
                'background-repeat': 'no-repeat',
                'width': winW + 'px',
                'height': headerH + 'px'
            });
            me.swiperResize(winH - headerH);
        },
        swiperInit: function(height){
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                preloadImages:false,
                lazyLoading : true
            });
        },
        swiperResize: function(allHeight){
            var winW = $(window).width(),
                slideH = allHeight/3 - 20,
                ratio = 165/238;//福袋img比例
            var slideW = (slideH) * ratio;
            $('.swiper-slide ul li').css({
                "height": (slideH) + "px",
                "width": slideW + "px"
            });
            $('.swiper-slide ul').css({
                "padding-left": (winW -(slideW*3 + winW*0.12))/2 + 'px'
            });
        },
        spellDom: function(data){
            var me = H.card, t = simpleTpl(),
                items = data.gitems || [],
                screenNum = 0;

            var newItems = [];
            for(var i=0,len=items.length;i<len;i+=3){
                newItems.push(items.slice(i,i+3));
            }

                screenNum = newItems.length;
                if(screenNum){

                    for(var i = 0; i<screenNum; i++){
                        t._('<div class="swiper-slide">');
                            for(var z = 0, len = newItems[i].length; z<len; z++){
                                t._('<ul>');
                                for(var j = 0, jen = newItems[i][z].items.length; j<jen; j++){
                                    //console.log(newItems[i][z].items.length);
                                    t._('<li data-t="'+ newItems[i][z].items[j].t +'" data-uid="'+ newItems[i][z].items[j].uid +'" data-is="'+ newItems[i][z].items[j].is +'" data-info="'+ newItems[i][z].items[j].info +'" data-mu="'+ newItems[i][z].items[j].mu +'" data-collect="true" data-collect-flag="zj-party-card-li-'+newItems[i][z].items[j].uid +'" data-collect-desc="打开明星语音弹层">')
                                        ._('<div class="headout">')
                                            ._('<img class="headimg swiper-lazy" src="'+ newItems[i][z].items[j].ib +'" />')
                                        ._('</div>')
                                        ._('<div class="name">'+ newItems[i][z].items[j].t +'</div>')
                                    ._('</li>');
                                }
                            t._('</ul>');
                        }
                    t._('</div>');

                    }
                }
            $('.swiper-wrapper').append(t.toString());
            me.resize();
            me.swiperInit();
        }
    };
})(Zepto);
$(function(){
    H.card.init();
});
