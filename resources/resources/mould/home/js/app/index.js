(function($) {
    H.index = {
        init: function() {
            this.event();
            this.linesdiyInfoPort();
            this.programlistPort();
            this.initComponent();
        },
        event: function() {
            var me = this;
            $('body').delegate('#J_content a', 'click', function(e) {
                e.preventDefault();
                toUrl('plot.html?uid=' + $(this).attr('data-uid'));
            });

            $('#J_countdown').click(function(e) {
                e.preventDefault();
                toUrl('lottery.html');
            });
        },
        initComponent: function() {
            var me = this;
            this.allrecordPort();
            setInterval(function(){
                me.allrecordPort();
            }, Math.ceil(60000*Math.random() + 120000));
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
        linesdiyInfoPort: function() {
            getResult("api/linesdiy/info",{},"callbackLinesDiyInfoHandler");
        },
        allrecordPort: function() {
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        programlistPort: function() {
            getResult('api/recommendpro/programlist', {}, 'callbackApiRedProlistHandler');
        },
        broadEffect: function() {
            setTimeout(function(){
                $('#J_content a').each(function(index) {
                    var $this = $(this);
                    setTimeout(function(){
                        $this.addClass('animatedSelf infinite flipX');
                    }, 500*(index + 1));
                });
            }, 3000);
        },
        fillBroadList: function(data) {
            var me = this, t = simpleTpl(), items = data.items || [], length = items.length;
            for (var i = 0; i < length; i++) {
                t._('<a href="javascript:;" data-uid="' + items[i].uid + '">')
                    ._('<img class="avatar" src="' + items[i].is + '">')
                    ._('<section class="wrapper">')
                        ._('<h1>' + items[i].n + '</h1>')
                        ._('<h3>' + items[i].pd + '</h3>')
                        ._('<p>' + items[i].rds + '</p>')
                    ._('</section>')
                ._('</a>')
            };
            $('#J_content').html(t.toString());
            me.broadEffect();
        },
        fillBannerList: function(data) {
            var me = this, t = simpleTpl(), gitems = data.gitems || [], length = gitems.length;
            for (var i = 0; i < length; i++) {
                t._('<section class="swiper-slide" data-uid="' + gitems[i].uid + '">')
                    ._('<a href="' + (gitems[i].mu ? gitems[i].mu : 'javascript:;') + '">')
                        ._('<img src="' + gitems[i].ib + '">')
                    ._('</a>')
                ._('</section>')
            };
            $('.swiper-wrapper').html(t.toString());
            this.swiperInit();
        }
    };

    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var recordList = data.rl, tpl = '';
            if(recordList && recordList.length > 0){
                tpl += '<ul>';
                for(var i = 0 ; i < recordList.length; i++){
                    var username = (recordList[i].ni || "匿名用户");
                    if (username.length >= 9) username = username.substring(0, 8) + '...';
                    tpl += "<li>" + username + "<span>获得" + recordList[i].pn + "</span></li>";
                }
                tpl += '</ul>';
                $("#J_marqueen").css({'opacity':'0'}).html(tpl).marqueen({
                    mode: "top",
                    container: "#J_marqueen ul",
                    speed: 40,
                    fixWidth: 0
                }).animate({'opacity':'1'}, 1000);
            }
        }
    };

    W.callbackApiRedProlistHandler = function(data) {
        if (data.code == 0) {
            H.index.fillBroadList(data);
        } else {
        }
    };

    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            H.index.fillBannerList(data);
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});