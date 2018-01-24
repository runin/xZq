(function($) {
    H.rank = {
        $body:$(".body"),
        $fdrank:$(".body-my-card"),
        $selflog:$(".body-lock-card"),
        swichtype:0,
        init: function(){
            this.event();
            this.resize();
            //this.getUserinfo();
            //this.getrank();
            this.getjobs();
        },
        event: function(){
            var me = H.rank;
            $("#info").tap(function(e){
                e.preventDefault();
                $(".user-info").removeClass('none');
            });
            //$(".get").tap(function (e) {
            //    e.preventDefault();
            //    $(".sign").addClass('none');
            //    $(".get-tips").removeClass('none');
            //    $(".get-cls").tap(function (e) {
            //        e.preventDefault();
            //        $(".get-tips").addClass('none');
            //    });
            //});
            $(".daily-back").one("click",function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("switch.html");
            });
            //this.swichbox();
        },
        resize: function () {
            if($("body").hasClass("body-daily")){
                $(".body").css({"height":($(window).height() - 45) + "px"});
            }else{
                $(".body").css({"height":($(window).height() - 145) + "px"});
            }
        },
        getjobs: function () {
            var challenge10 = 0,win5 = 0,challengefd = 0,win3fd = 0,exp = new Date(),isDone = 0;
            var today = exp.getDate();
            exp.setTime(exp.getTime() + 24*60*60*1000);
            if(parseInt($.fn.cookie(openid + 'today')) !== today){
                $.fn.cookie(openid + 'today', today, {expires: exp});
                $.fn.cookie(openid + 'challenge10', '0', {expires: exp});
                $.fn.cookie(openid + '5win', '0', {expires: exp});
                $.fn.cookie(openid + 'challengefd', '0', {expires: exp});
                $.fn.cookie(openid + 'win3fd', '0', {expires: exp});
            }
            if($.fn.cookie(openid + 'challenge10')){
                if(parseInt($.fn.cookie(openid + 'challenge10')) >= 10){
                    challenge10=10;
                    isDone ++;
                }else{
                    challenge10=parseInt($.fn.cookie(openid + 'challenge10'));
                }
                if(parseInt($.fn.cookie(openid + 'challenge10')) == 0){
                    $(".challenge10 .rank-challenge>p").css({"background":'transparent',"color":"#8ad400","border":"#8ad400 1px solid"}).text("去完成").on("click", function () {
                        toUrl("card.html");
                    });
                }else{
                    $(".challenge10 .rank-challenge>p").css(
                        "background",
                        '-webkit-linear-gradient(left, #ffa10e 0%,#ffa10e ' + Math.ceil(challenge10*10) + '%,transparent ' + (Math.ceil(challenge10*10) + 1) + '%,transparent 100%)'
                    ).text((challenge10==10)?"已完成":challenge10+"/10");
                }
            }
            if($.fn.cookie(openid + '5win')){
                if(parseInt($.fn.cookie(openid + '5win')) >= 5){
                    win5=5;
                    isDone ++;
                }else{
                    win5=parseInt($.fn.cookie(openid + '5win'));
                }
                if(parseInt($.fn.cookie(openid + '5win')) == 0){
                    $(".win5 .rank-challenge>p").css({"background":'transparent',"color":"#8ad400","border":"#8ad400 1px solid"}).text("去完成").on("click", function () {
                        toUrl("card.html");
                    });
                }else{
                    $(".win5 .rank-challenge>p").css(
                        "background",
                        '-webkit-linear-gradient(left, #ffa10e 0%,#ffa10e ' + Math.ceil(win5*20) + '%,transparent ' + (Math.ceil(win5*20) + 1) + '%,transparent 100%)'
                    ).text((win5==5)?"已完成":win5+"/5");
                }
            }
            if($.fn.cookie(openid + 'challengefd')){
                if(parseInt($.fn.cookie(openid + 'challengefd')) >= 1){
                    challengefd=1;
                    isDone ++;
                }else{
                    challengefd=parseInt($.fn.cookie(openid + 'challengefd'));
                }
                if(parseInt($.fn.cookie(openid + 'challengefd')) == 0){
                    $(".challengefd .rank-challenge>p").css({"background":'transparent',"color":"#8ad400","border":"#8ad400 1px solid"}).text("去完成").on("click", function () {
                        toUrl("fdrank.html?ptype=2");
                    });
                }else{
                    $(".challengefd .rank-challenge>p").css(
                        "background",
                        '-webkit-linear-gradient(left, #ffa10e 0%,#ffa10e ' + Math.ceil(challengefd*100) + '%,transparent ' + (Math.ceil(challengefd*100) + 1) + '%,transparent 100%)'
                    ).text((challengefd==1)?"已完成":challengefd+"/1");
                }
            }
            if($.fn.cookie(openid + 'win3fd')){
                if(parseInt($.fn.cookie(openid + 'win3fd')) >= 3){
                    win3fd=3;
                    isDone ++;
                }else{
                    win3fd=parseInt($.fn.cookie(openid + 'win3fd'));
                }
                if(parseInt($.fn.cookie(openid + 'win3fd')) == 0){
                    $(".win3fd .rank-challenge>p").css({"background":'transparent',"color":"#8ad400","border":"#8ad400 1px solid!important"}).text("去完成").on("click", function () {
                        toUrl("fdrank.html?ptype=2");
                    });
                }else{
                    $(".win3fd .rank-challenge>p").css(
                        "background",
                        '-webkit-linear-gradient(left, #ffa10e 0%,#ffa10e ' + Math.ceil(win3fd*33) + '%,transparent ' + (Math.ceil(win3fd*33) + 1) + '%,transparent 100%)'
                    ).text((win3fd==3)?"已完成":win3fd+"/3");
                }
            }
            $(".daily-tips").html('今日已完成' + isDone + '个任务<img src="images/daily-icon.png" />');
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };
    W.callbackGreetingcardMaterialFightRank4SelfHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.result){
                $(".ft-win").text((data.wc?data.wc:"0") + "胜");
                $(".ft-lose").text((data.fc?(parseInt(data.fc)-parseInt(data.wc)):"0") + "负");
                $(".btn-box>span").text("第" + (data.rk?data.rk:"0") + "名");
            }else{
            }
        }
        hidenewLoading();
    };
    W.callbackGreetingcardMaterialFightRank4WinHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.result){
                H.rank.fillrank(data);
            }else{
            }
        }
        hidenewLoading();
    };
    W.callbackUserInfoHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.result){
            }else{
            }
            H.rank.userinfo(data);
        }
        hidenewLoading();
    };
    W.callbackIntegralMyHandler = function(data) {
        if(data == undefined){

        }else{
            $(".gold").text(data.in?data.in:"0");
        }
        hidenewLoading();
    };
    W.callbackUserEditHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.result){
                $(".user-info").addClass('none');
            }else{
            }
        }
        hidenewLoading();
    };
})(Zepto);

$(function() {
    H.rank.init();
});
