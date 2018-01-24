/**
 * 老三热线-积分宝库页
 */
(function($){
    H.jfbk = {
        $flow: $(".flow"),
        init: function(){
            this.event();
            this.self();
            this.pre_dom();
        },
        pre_dom: function(){
            var height = $(window).height(), width = $(window).width();
            $('body').css({
                'width': width,
                'height': height
            });

            $(".flow-body").css({
                "left": (width - 170)/2,
                "top": (height - 207)/2
            });
        },
        self: function(){
            getResult('api/lottery/integral/rank/self', {
                oi: openid
            }, 'callbackIntegralRankSelfRoundHandler', true);
        },
        btn_animate: function(str,calback){
            str.addClass('rotate');
            setTimeout(function(){
                str.removeClass('rotate');
            },1000);
        },
        event: function(){
            var me = H.jfbk;
            $("#back").click(function(e){
                e.preventDefault();
                toUrl('yao.html');
            });
            $("#mrqd").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("mrqd.html");
            });
            $("#jfcj").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("jfcj.html");
            });
            $("#zjjl").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("record.html");
            });
            $(".wdjf").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                setTimeout(function(){
                    me.$flow.removeClass("none").find('.flow-body').addClass('bounceInDown');
                    setTimeout(function(){
                        me.$flow.find('.flow-body').removeClass('bounceInDown');
                    }, 1000);
                }, 500);

            });
            $(".close").click(function(e){
                e.preventDefault();
                me.$flow.find('.flow-body').addClass('bounceOutUp');
                setTimeout(function(){
                    me.$flow.addClass("none").find('.flow-body').removeClass('bounceOutUp');
                }, 1000);
            });
        }
    };

    W.callbackIntegralRankSelfRoundHandler = function(data){
        var me = H.jfbk;
        if(data.result){
            $(".my-jf").text(data.in || 0);
        }
    };
})(Zepto);
$(function(){
    H.jfbk.init();
});