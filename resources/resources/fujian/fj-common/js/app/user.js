(function($){
    H.user = {
        pu: getQueryString("pu"),
        init: function(){
            this.event();
            this.self();
            this.top10();
            this.record();
        },
        //查询用户积分排行
        self: function(){
            getResult('api/lottery/integral/rank/self', {oi: openid, pu: H.user.pu}, 'callbackIntegralRankSelfRoundHandler',true);
        },
        //查询积分排行Top10
        top10: function(){
            getResult('api/lottery/integral/rank/top10', {pu: H.user.pu}, 'callbackIntegralRankTop10RoundHandler',true);
        },
        //查询个人的中奖记录
        record: function(){
            getResult('api/lottery/record', {oi: openid}, 'callbackLotteryRecordHandler',true);
        },
        event: function(){
            var me = H.user;
            $("#self-award").tap(function(e){
                e.preventDefault();
                $(".item").addClass("none");
                $("#my-award").removeClass("none");
                $("body").removeClass("blue").addClass("white");
            });

            $("#rank").tap(function(e){
                e.preventDefault();
                $(".item").addClass("none");
                $("#my-rank").removeClass("none");
                $("body").removeClass("white").addClass("blue");
            });

            $("#modification").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                H.dialog.userInfo.open();
            });

            $("#back-btn").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("lottery.html");
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        spellRank: function(data){
            var t = simpleTpl();
            $.each(data.top10, function(i,item){
                t._('<li>');
                    switch (i){
                        case 0:
                            t._('<p><img src="images/1.png" /></p>');
                            break;
                        case 1:
                            t._('<p><img src="images/2.png" /></p>');
                            break;
                        case 2:
                            t._('<p><img src="images/3.png" /></p>');
                            break;
                        default :
                            t._('<p>'+ (i+1) +'</p>');
                            break;
                    }
                    t._('<span class="name-nc">'+ (item.nn || "匿名用户") +'</span>')
                    ._('<img src="images/fen-right.png" />')
                    ._('<label class="jf"> '+ item.in +' 分</label>')
                ._('</li>');
            });
            return $("#my-rank").children("ul").append(t.toString());
        },
        spellAward: function(data){
            var t = simpleTpl();
            $.each(data.rl, function(i,item){
                var date = item.lt.split(" ")[0];
                var year = date.split("-")[0] + "年",
                    month = date.split("-")[1] + "月",
                    day = date.split("-")[2] + "日";
                t._('<li>')
                    ._('<img src="images/hb-left.png" />')
                    ._('<span>'+ item.pn +'</span>')
                    ._('<div class="date">'+ year+month+day +'</div>')
                ._('</li>');
            });
            return $("#my-award").children("ul").append(t.toString());
        }
    };
    W.callbackIntegralRankSelfRoundHandler = function(data){
        if(data.result == true){
            $("#headimgurl").find("img").attr("src", headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/avatar.png');
            $("#nickname").text(nickname || "匿名用户");
            $("#rk").text("排名: "+ data.rk);
            $("#ji-value").find("label").text(data.in);
        }
    };
    W.callbackIntegralRankTop10RoundHandler = function(data){
        if(data.result == true){
            H.user.spellRank(data);
        }else{
            $("#my-rank").children("ul").empty().append('<p class="empty">积极参与互动~<br>您的大名就会出现在这里</p>');
        }
    };
    W.callbackLotteryRecordHandler = function(data){
        if(data.result == true){
            H.user.spellAward(data);
        }else{
            $("#my-award").children("ul").empty().append('<p class="empty">亲，您还没有中奖哦~<br/>继续加油</p>');
        }
    }
})(Zepto);
$(function(){
   H.user.init();
});