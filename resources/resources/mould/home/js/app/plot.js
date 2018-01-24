(function($) {
    H.plot = {
        uid: getQueryString('uid') || '',
        init: function () {
            this.programlistPort();
        },
        swiperInit: function() {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                slidesPerView: 1,
                paginationClickable: true,
                spaceBetween: 0,
                loop: true
            });
        },
        programlistPort: function() {
            if (this.uid == '') toUrl('index.html');
            getResult('api/recommendpro/programlist', {}, 'callbackApiRedProlistHandler');
        },
        fillDetailContent: function(data) {
            var me = this, t = simpleTpl(), items = data.items || [], length = items.length;
            for (var i = 0; i < length; i++) {
                if (items[i].uid == me.uid) {
                    var showList = items[i].ib.split(',') || [], showLength = showList.length;
                    for (var j = 0; j < showLength; j++) {
                        t._('<section class="swiper-slide slide' + j + '">')
                            ._('<img src="' + showList[j] + '">')
                        ._('</section>')
                    };
                    $('.swiper-wrapper').html(t.toString());
                    me.swiperInit();

                    if (items[i].rdc) $('#J_content').append('<section><p>节目简介</p><section>' + items[i].rdc + '</section></section>');
                    if (items[i].rds) $('#J_content').append('<section><p>奖品设置</p><section>' + items[i].rds + '</section></section>');
                    if (items[i].gourl && items[i].gourl != '') {
                        $('#btn-go').click(function(e) {
                            e.preventDefault();
                            location.href = items[i].gourl;
                        }).removeClass('none');
                    } else {
                        $('#btn-go').addClass('none');
                    }
                    return;
                }
            };
        }
    };

    W.callbackApiRedProlistHandler = function(data) {
        if (data.code == 0) {
            H.plot.fillDetailContent(data);
        } else {
            toUrl('index.html');
        }
    };
})(Zepto);

$(function(){
    H.plot.init();
});