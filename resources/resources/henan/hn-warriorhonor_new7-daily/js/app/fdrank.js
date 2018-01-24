(function($) {
    H.rank = {
        $body:$(".body"),
        $rankall:$(".body-rankall-body"),
        $fdrank:$(".body-my-card"),
        $selflog:$(".body-lock-card"),
        selfname:"匿名",
        swichtype:0,
        ptype:getQueryString("ptype"),
        init: function(){
            this.event();
            this.resize();
            this.getUserinfo();
            this.getrank();
        },
        event: function(){
            var me = H.rank;
            if(this.ptype = 2){
                $(".my-card").css({"background":"-webkit-linear-gradient(top, #ca151b 0%,#8f0b11 40%,#350107 100%)"});
                $(".rank-all").css({"background":"-webkit-linear-gradient(top, #616161 0%,#373737 40%,#0d0d0d 100%)"});
                $(".body-my-card").removeClass("none");
                $(".body-rankall").addClass("none");
                this.swichtype = 1;
            }
            $(".open-fillinfo").on("click",function(e){
                e.preventDefault();
                $(".user-info").removeClass('none');
            });
            $(".switch-bottom").on("click",function(e){
                e.preventDefault();
                $(".gift-info").removeClass('none');
                setTimeout(function () {
                    $(".gift-info").tap(function(e){
                        $(this).addClass('none');
                    });
                },500)
            });
            this.swichbox();
        },
        resize: function () {
            if($("body").hasClass("body-daily")){
                $(".body").css({"height":($(window).height() - 45) + "px"});
            }else{
                $(".body").css({"height":($(window).height() - 185) + "px"});
            }
        },
        getUserinfo: function () {
            getResult('api/user/info_v2', {matk: matk}, 'callbackUserInfoHandler', true);
            getResult('api/common/rule', {}, 'commonApiRuleHandler', true);
            getResult('api/lottery/integral/my', {
                oi: openid
                //pu:acttUID
            }, 'callbackIntegralMyHandler', true);
        },
        getrank: function () {
            getResult('api/fight/player/topWin4Wide', {}, 'callbackFightPlayerFightTopWin4WideHandler');
            getResult('api/fight/player/selfWideRank', {oi:openid}, 'callbackFightPlayerFightSelfWideRankHandler');
            getResult('api/fight/player/topWin4friend', {oi:openid}, 'callbackFightPlayerFightTopWin4friendHandler');
            getResult('api/fight/player/recentFightRecord', {oi:openid}, 'callbackFightPlayerRecentFightRecordHandler');
        },
        fillrank: function (data) {
            var rankinfo = "";
            for(var i=0;i<data.top10.length;i++){
                rankinfo += '<div class="rank">'
                    + '<div class="head"><div class="player-head">'
                    + '<img src="' + (data.top10[i].hi?data.top10[i].hi:"./images/avatar.png") + '" /></div>';
                if(i<3){
                    rankinfo += '<p>第' + (i+1) + '名</p></div>';
                }else{
                    rankinfo += '<p style="opacity: 0"></p></div>';
                }
                rankinfo += '<div class="name">' + (data.top10[i].nn?data.top10[i].nn:"匿名") + '</div>'
                    + '<div class="rank-win"><img src="images/winnumb-bg.png" /><p>' + (data.top10[i].wc?data.top10[i].wc:"0") + '胜</p></div>'
                    + '<div class="rank-lose"><img src="images/losenumb-bg.png" /><p>' + (data.top10[i].fc?(parseInt(data.top10[i].fc)-parseInt(data.top10[i].wc)):"0") + '负</p></div>'
                    + '<div class="rank-challenge" data-collect="true" data-collect-flag="challenge-friend" data-collect-desc="好友挑战" data-oi="' + data.top10[i].oi + '" onclick="H.rank.challenge(this)"><p>挑&nbsp战</p></div></div>';
            }
            this.$fdrank.append(rankinfo);
        },
        fillallrank: function (data) {
            var rankinfo = "";
            for(var i=0;i<data.top10.length;i++){
                rankinfo += '<div class="rank">'
                    + '<div class="head"><div class="player-head">'
                    + '<img src="' + (data.top10[i].hi?data.top10[i].hi:"./images/avatar.png") + '" /></div>';
                if(i<3){
                    rankinfo += '<p>第' + (i+1) + '名</p></div>';
                }else{
                    rankinfo += '<p style="opacity: 0"></p></div>';
                }
                rankinfo += '<div class="name">' + (data.top10[i].nn?data.top10[i].nn:"匿名") + '</div>'
                    + '<div class="rank-win"><img src="images/winnumb-bg.png" /><p>' + (data.top10[i].wc?data.top10[i].wc:"0") + '胜</p></div>'
                    + '<div class="rank-lose"><img src="images/losenumb-bg.png" /><p>' + (data.top10[i].fc?(parseInt(data.top10[i].fc)-parseInt(data.top10[i].wc)):"0") + '负</p></div></div>';
            }
            this.$rankall.append(rankinfo);
        },
        fillselfrank: function (data) {
            var rankinfo = "";
            for(var i=0;i<data.rr.length;i++){
                if(data.rr[i].iw == 1){
                    rankinfo += '<div class="rank">'
                        + '<div class="head">'
                        + '<img src="./images/icon-win.png" /></div>';
                }else{
                    rankinfo += '<div class="rank">'
                        + '<div class="head">'
                        + '<img src="./images/icon-lose.png" /></div>';
                }
                rankinfo += '<div class="rank-self-time"><p>' + data.rr[i].ft + '</p></div>'
                    + '<div class="rank-self-vs"><p>' + H.rank.selfname + " vs " + data.rr[i].on + '</p></div>'
                    + '<div class="rank-share" onclick="H.rank.rankshare(this)" data-fn="' + data.rr[i].on + '" data-win="' + data.rr[i].iw + '" data-collect="true" data-collect-flag="share-self" data-collect-desc="分享战报按钮"><img src="images/icon-share.png" /></div></div>';
            }
            this.$selflog.append(rankinfo);
        },
        challenge: function (self) {
            var exp = new Date();
            exp.setTime(exp.getTime() + 24*60*60*1000);
            $.fn.cookie(openid + 'ischallenge', false, {expires: exp});
            //toUrl("card.html?oi="+$(self).attr("data-oi"));
        },
        rankshare: function (self) {
            if($(self).attr('data-win') == 1){
                $(".share>img").attr("src","images/for-win.png");
                $(".share>p").css("color","#d1b062").text(H.rank.selfname+"在《勇士的荣耀》中大发神威战胜了 "+$(self).attr('data-fn').toString());
                window['shaketv'] && shaketv.wxShare(
                    share_img,
                    "胜利的感觉就是棒！不服来战！",
                    H.rank.selfname+"在《勇士的荣耀》中大发神威战胜了 "+$(self).attr('data-fn').toString(),
                    getUrl(openid)
                );
            }else{
                $(".share>img").attr("src","images/for-lose.png");
                $(".share>p").css("color","white").text(H.rank.selfname+"在《勇士的荣耀》中一招之差败给了 "+$(self).attr('data-fn').toString());
                window['shaketv'] && shaketv.wxShare(
                    share_img,
                    "胜败乃兵家常事，再来战过！",
                    H.rank.selfname+"在《勇士的荣耀》中一招之差败给了 "+$(self).attr('data-fn').toString(),
                    getUrl(openid)
                );
            }
            $(".share").removeClass("none").one("click", function () {
                $(this).addClass('none');
            });
        },
        userinfo: function (data) {
            H.rank.selfname = data.nn?data.nn:"匿名";
            $(".player-name").text(data.nn?data.nn:"匿名");
            $(".player-headimg").find('img').attr("src",data.hi?data.hi:"./images/avatar.png");
            $(".user-name").val(data.nn?data.nn:"");
            $(".user-tel").val(data.ph?data.ph:"");
            $(".user-addr").val(data.ad?data.ad:"");
            $(".info-text").on("click", function () {
                var name = $.trim($('.user-name').val()), mobile = $.trim($('.user-tel').val()), address = $.trim($('.user-addr').val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖！');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                } else if (address.length < 8 || address.length > 60 || address.length == 0) {
                    showTips('请填写您的详细地址，以便顺利领奖！');
                    return false;
                }else{
                    shownewLoading();
                    getResult('api/user/edit_v2',
                        {
                            matk:matk,
                            rn:name,
                            ph:mobile,
                            ad:address
                        },'callbackUserEditHandler');
                }
            });
        },
        swichbox: function () {
            $(".rank-all").tap(function () {
                if(H.rank.swichtype !== 0){
                    $(this).css({"background":"-webkit-linear-gradient(top, #ca151b 0%,#8f0b11 40%,#350107 100%)"});
                    $(".my-card").css({"background":"-webkit-linear-gradient(top, #616161 0%,#373737 40%,#0d0d0d 100%)"});
                    $(".lock-card").css({"background":"-webkit-linear-gradient(top, #616161 0%,#373737 40%,#0d0d0d 100%)"});
                    $(".body-my-card").addClass('none');
                    $(".body-lock-card").addClass('none');
                    $(".body-rankall").removeClass('none').css({"-webkit-animation":"justshow 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).one("webkitAnimationEnd", function () {
                        $(this).css({"-webkit-animation":""});
                        H.rank.swichtype = 0;
                    });
                }
            });
            $(".my-card").tap(function () {
                if(H.rank.swichtype !== 1) {
                    $(this).css({"background":"-webkit-linear-gradient(top, #ca151b 0%,#8f0b11 40%,#350107 100%)"});
                    $(".lock-card").css({"background":"-webkit-linear-gradient(top, #616161 0%,#373737 40%,#0d0d0d 100%)"});
                    $(".rank-all").css({"background":"-webkit-linear-gradient(top, #616161 0%,#373737 40%,#0d0d0d 100%)"});
                    $(".body-lock-card").addClass('none');
                    $(".body-rankall").addClass('none');
                    $(".body-my-card").removeClass('none').css({"-webkit-animation":"justshow 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).one("webkitAnimationEnd", function () {
                        $(this).css({"-webkit-animation":""});
                        H.rank.swichtype = 1;
                    });
                }
            });
            $(".lock-card").tap(function () {
                if(H.rank.swichtype !== 2) {
                    $(this).css({"background":"-webkit-linear-gradient(top, #ca151b 0%,#8f0b11 40%,#350107 100%)"});
                    $(".my-card").css({"background":"-webkit-linear-gradient(top, #616161 0%,#373737 40%,#0d0d0d 100%)"});
                    $(".rank-all").css({"background":"-webkit-linear-gradient(top, #616161 0%,#373737 40%,#0d0d0d 100%)"});
                    $(".body-my-card").addClass('none');
                    $(".body-rankall").addClass('none');
                    $(".body-lock-card").removeClass('none').css({"-webkit-animation":"justshow 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).one("webkitAnimationEnd", function () {
                        $(this).css({"-webkit-animation":""});
                        H.rank.swichtype = 2;
                    });
                }
            });
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };
    W.callbackFightPlayerFightSelfWideRankHandler = function(data) {
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
    W.callbackFightPlayerFightTopWin4friendHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.result){
                H.rank.fillrank(data);
            }else{
            }
        }
        hidenewLoading();
    };
    W.callbackFightPlayerRecentFightRecordHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.result){
                H.rank.fillselfrank(data);
            }else{
            }
        }
        hidenewLoading();
    };
    W.callbackFightPlayerFightTopWin4WideHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.result){
                H.rank.fillallrank(data);
            }else{
            }
        }
        hidenewLoading();
    };
    W.callbackUserInfoHandler = function(data) {
        if(data == undefined){

        }else{
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
    W.commonApiRuleHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.code == 0){
                $(".gift-info-box>p").html(data.rule);
            }else{
            }
        }
        hidenewLoading();
    };
})(Zepto);

$(function() {
    H.rank.init();
});
