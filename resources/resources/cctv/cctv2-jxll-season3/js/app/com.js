/**
 * Created by Chris on 2015/12/9.
 */
(function($) {
    H.common = {
        dec:0,
        isLottery:false,
        stretch:93,
        overStretch:70,
        init: function () {
            var me = this;
            me.event();
            // 进入页面之后判断抽奖
            H.lottery.init();
            if($(window).width() <= 320 && $(window).height() <= 480){
                me.stretch = 60;
                me.overStretch = 60;
            }else if($(window).width() == 360){
                me.stretch = 80;
            }
        },
        event: function(){
            $('.icon-surprise').click(function(e){
                e.preventDefault();
                if(!$(this).hasClass("clicked")){
                    $(this).addClass("clicked");
                    shownewLoading(null,"请稍后...");
                    setTimeout(function(){
                        location.href = 'http://surprise-question.app.uiwork.com/home/wapIndex';
                    },800);
                }
            });
        },
        showOver : function(){
            var me = this;
            if(me.isLottery){
                return;
            }
            // 调用剧照接口查询下期奖品
            H.common.showPage($("#over"));
            setTimeout(function(){
                H.over.nextPrize();
            },300);
        },
        showLottery : function(){
            var me = this;
            me.showPage($("#lottery"));
        },
        showVote : function(){
            var me = this;
            H.vote.init();
            me.showPage($("#vote"));
            setTimeout(function(){
                H.vote.swiperVote();
            },400);
        },
        showPage : function($id){
            var me = this;
            $(".page").animate({'opacity': '0'},200);
            setTimeout(function(){
                $(".page").addClass("none");
                $($id).removeClass("none");
                $($id).animate({'opacity': '1'},200);
                hidenewLoading();
                // me.ddtj();
            },200);
        },
        ping: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'api/common/time' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback: 'commonApiTimeHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.t){
                        var nowTimeStemp = new Date().getTime();
                        H.common.dec = nowTimeStemp - data.t*1;
                    }
                }
            });
        },
        ddtj: function() {
            $('.icon-red').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };


    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('.icon-red').attr('href', 'javascript:void(0);').removeClass('none');
            $(".icon-red").click(function(e){
                e.preventDefault();
                location.href = data.url;
            });
        } else {
            $('.icon-red').remove();
        };
    }
})(Zepto);

$(function(){
    shownewLoading();
    H.common.init();
});