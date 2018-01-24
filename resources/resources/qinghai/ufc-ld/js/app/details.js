(function($){
    H.detail={
        guid: getQueryString("guid"),
        pid: getQueryString("pid"),
        cunt: $.fn.cookie("cunt-" + openid + "-pid-" + getQueryString("pid")),
        init: function(){
            this.event();
            this.query_info();
            this.shake();
        },
        //查询投票信息
        query_info: function(){
            getResult('api/voteguess/inforoud', {}, 'callbackVoteguessInfoHandler', true);
        },
        guessplayer: function(){
            getResult('api/voteguess/guessplayer', {
                yoi: openid,
                guid: H.detail.guid,
                pluids: H.detail.pid
            }, 'callbackVoteguessGuessHandler', true);
        },
        shake: function() {
            W.addEventListener('shake', H.detail.shake_listener, false);
        },
        cuntTimes: function(times, isVote){
            var me = H.detail,
                widthW = 0;
            switch (times){
                case 0:
                    widthW = "0%";
                    $(".hand").addClass("waggle");
                    break;
                case 1:
                    widthW = "20%";
                    $(".hand").addClass("waggle");
                    break;
                case 2:
                    widthW = "40%";
                    $(".hand").addClass("waggle");
                    break;
                case 3:
                    widthW = "60%";
                    $(".hand").addClass("waggle");
                    break;
                case 4:
                    widthW = "80%";
                    $(".hand").addClass("waggle");
                    break;
                case 5:
                    widthW = "100%";
                    $(".hand").removeClass("waggle");
                    if(!isVote){
                        $("#audio-a").get(0).pause();
                        $("#audio-b").get(0).play();//中奖声音
                        me.guessplayer();
                    }
                    break;
                default:
                    widthW = "0%";
                    $(".hand").addClass("waggle");
            }
            /*console.log("me.cunt="+me.cunt);
            console.log("me.width="+widthW);*/
            $('.progress-bar').css({
                "width": widthW
            }).addClass("bc-bb");
            $(".pren").text(widthW);
        },
        shake_listener: function() {
            var me = H.detail;
            if(me.cunt < 5){
                $("#audio-a").get(0).play();
                me.cunt++;
                me.cuntTimes(parseInt(me.cunt), false);
            }
            $.fn.cookie("cunt-" + openid, me.cunt, {expires:6});
            $.fn.cookie("cunt-" + openid + "-pid-" + me.pid, me.cunt, {expires:6})
        },
        event: function(){
            $(".btn").click(function(e){
                e.preventDefault();
                toUrl("vote.html");
            });
            $("#test").click(function(e){
                H.detail.shake_listener();
            });
        },
        spellHtml: function(data){
            var me = H.detail, t = simpleTpl();
            t._('<img src="'+ data.im2 +'">')
                ._('<div class="jdt">')
                    ._('<div class="progress">')
                    ._('<div class="progress-bar"></div>')
                    ._('</div>')
                    ._('<div class="pren"></div>')
                ._('</div>')
                ._('<img class="hand" src="images/hand.png">')
                ._('<div class="in">'+ data.in +'</div>')

            $("section").html(t.toString());
            me.cuntTimes(parseInt(me.cunt), true);
        }
    };
    W.callbackVoteguessInfoHandler = function(data){
        var me = H.detail;
        if(data.code == 0){
            $.each(data.items, function(i,item){
                if(item.guid == me.guid){
                    $.each(item.pitems, function(j,jtem){
                        if(jtem.pid == me.pid){
                            /*console.log(j);
                            console.log(jtem);*/
                            me.spellHtml(jtem);
                        }
                    });
                }
            });
        }
    };
    W.callbackVoteguessGuessHandler = function(data){
        if(data.code == 0){
            showTips("加油成功！");
        }
    }
})(Zepto);
$(function(){
    H.detail.init();
});
