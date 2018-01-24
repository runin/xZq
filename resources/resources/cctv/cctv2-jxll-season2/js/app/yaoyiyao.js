/**
 * 惊喜连连-抽奖
 */
(function($) {
    H.yao = {
        canShake:true,
        dely:Math.ceil(60000*2*Math.random() + 60000*1),
        init : function(){
            var me = this;
            this.event();
            this.shake();
            setTimeout(function(){
                me.record_fill(allrecord);
            },15000);
            setTimeout(function(){
                me.prize_num(Math.ceil(100000*Math.random() + 900000));
            },3000);
            $.fn.cookie('jumpNum', 0, {expires: -1});
            me.setTime();
        },
        setTime:function(){
            var me = this;
            var a = setTimeout(function(){
                me.ping();
                me.dely = Math.ceil(60000*2*Math.random() + 60000*1);
                clearTimeout(a);
                a = null;
                me.setTime();
            },me.dely);
        },
        //返回给定范围内的随机数
        getRandomArbitrary:function(min, max) {
            return parseInt(Math.random()*(max - min)+min);
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
                        toUrl("vote.html");
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        scroll: function() {
            $('.marquee').each(function(i) {
                var me = this, com = [], delay = 1000;
                var len  = $(me).find('li').length;
                var $ul = $(me).find('ul');
                if (len == 0) {
                    $(me).addClass('none');
                } else {
                    $(me).removeClass('none');
                }
                if(len > 1) {
                    com[i] = setInterval(function() {
                        $(me).find('ul').animate({'margin-top': '-20px'}, delay, function() {
                            $(me).find('ul li:first').appendTo($ul)
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                };
            });
        },
        shake_listener: function() {
            if(H.yao.canShake){
                if(!$(".home-box").hasClass("yao")) {
                    $("#audio-a").get(0).play();
                    $(".m-t-b").css({
                        '-webkit-transition': '-webkit-transform .2s ease',
                        '-webkit-transform': 'translate(0px,-100px)'
                    });
                    $(".m-f-b").css({
                        '-webkit-transition': '-webkit-transform .2s ease',
                        '-webkit-transform': 'translate(0px,100px)'
                    });
                    setTimeout(function(){
                        $(".m-t-b").css({
                            '-webkit-transform': 'translate(0px,0px)',
                            '-webkit-transition': '-webkit-transform .5s ease'
                        });
                        $(".m-f-b").css({
                            '-webkit-transform': 'translate(0px,0px)',
                            '-webkit-transition': '-webkit-transform .5s ease'
                        });
                    }, 1200);
                    H.yao.canShake = false;
                    $(".home-box").addClass("yao");
                }
                setTimeout(function(){
                    H.yao.fill(null);//摇一摇
                }, 2000);
            }
        },
        fill : function(data){
            setTimeout(function() {
                $(".home-box").removeClass("yao");
            },2000);
            $("#audio-a").get(0).pause();
            H.dialog.thanksLottery.open();
        },
        record_fill:function(data){
            if(data.result){
                var list = data.rl;
                if(list && list.length>0){
                    var con = "";
                    for(var i = 0 ; i<list.length; i++){
                        con +="<li>"+(list[i].ni || "匿名用户")+"中了"+list[i].pn+"</li>";
                    }
                    var len = $(".marquee").find("li").length;
                    if(len >= 500){
                        $(".marquee").find("ul").html(con);
                    }else{
                        $(".marquee").find("ul").append(con);
                    }
                    H.yao.scroll();
                    $(".marquee").removeClass("none");
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
