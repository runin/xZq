(function($) {
    H.yao = {
        isCanShake:true,
        delay:Math.ceil(60000*2*Math.random() + 60000*1),
        init : function(){
            var me = this;
            this.resize();
            this.event();
            this.shake();
            // setTimeout(function(){
            //     me.prize_num(Math.ceil(10000*Math.random() + 90000));
            // },3000);
            $.fn.cookie('jumpNum', 0, {expires: -1});
            me.setTime();
        },
        resize: function() {
            var winH = $(window).height();
            $("body").css("height", winH);
            if(!is_android()){
                $(".main-top").css("height", (winH / 2) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2) + "px").css('bottom', '0');
            } else {
                $(".main-top").css("height", (winH / 2 + 0.5) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2 + 0.5) + "px").css('bottom', '0');
            }
        },
        setTime:function(){
            var me = this;
            var a = setTimeout(function(){
                me.ping();
                me.delay = Math.ceil(60000*2*Math.random() + 60000*1);
                clearTimeout(a);
                a = null;
                me.setTime();
            },me.delay);
        },
        event: function() {
            $("#test").click(function(e){
                H.yao.shake_listener();
            });
        },
        shake: function() {
            W.addEventListener('shake', H.yao.shake_listener, false);
        },
        ping: function(){
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/common/time' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'commonApiTimeHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    if(data.t){
                        toUrl("lottery.html");
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        thanks: function(){
            if (typeof(thanks_tips) == 'undefined' || thanks_tips.length == 0) {
                var tips = '运气不太好哦，摆正姿势，再来一次！';
            } else {
                var tips = thanks_tips[getRandomArbitrary(0, thanks_tips.length)]
            }
            $('.thanks-tips').html(tips).addClass('show');
            H.yao.isCanShake = true;
            setTimeout(function(){
                $('.thanks-tips').removeClass('show');
            }, 1300);
        },
        shake_listener: function() {
            if(H.yao.isCanShake){
                if(!$(".home-box").hasClass("yao")) {
                    H.yao.isCanShake = false;
                    $("#audio-a").get(0).play();
                    $(".m-t-b").css({
                        '-webkit-transition': '-webkit-transform .2s ease',
                        '-webkit-transform': 'translate3d(0,-100px,0)'
                    });
                    $(".m-f-b").css({
                        '-webkit-transition': '-webkit-transform .2s ease',
                        '-webkit-transform': 'translate3d(0,100px,0)'
                    });
                    setTimeout(function(){
                        $(".m-t-b").css({
                            '-webkit-transform': 'translate3d(0,0,0)',
                            '-webkit-transition': '-webkit-transform .5s ease'
                        });
                        $(".m-f-b").css({
                            '-webkit-transform': 'translate3d(0,0,0)',
                            '-webkit-transition': '-webkit-transform .5s ease'
                        });
                    }, 1000);
                    $(".home-box").addClass("yao");
                    setTimeout(function(){
                        $("#audio-a").get(0).pause();
                        H.yao.thanks();
                        setTimeout(function() {
                            $(".home-box").removeClass("yao");
                        },1000);
                    }, 1500);
                }
            }
        },
        prize_num:function(data){
            $(".rednum").find("span").text(data);
            var si = setInterval(function(){
                var nowpn = $(".rednum").find("span").text()*1;
                var pn = this.getRandomArbitrary(1,4);
                if(pn >= nowpn){
                    $(".rednum").animate({"opacity":"0"},800);
                    clearInterval(si);
                }else{
                    pn = $(".rednum").find("span").text()*1-pn;
                    $(".rednum").find("span").text(pn);
                    $(".rednum").animate({"opacity":"1"},800);
                }
            },3000);
        }
    };
})(Zepto);

$(function() {
    H.yao.init();
});
var openid = null;