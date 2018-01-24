(function($) {
    H.vote = {
        $voteCountdown: $("#vote-countdown"),
        nowTime: null,
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        index: 0, // 当前抽奖活动在 list 中的下标
        pal: [],// 抽奖活动list
        dec: 0,//服务器时间与本地时间的差值
        type: 2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        isTimeOver: false,
        periodUuid: null,
        $vote_info: $(".vote-info"),
        firstStatus: false,//默认值fale,但第一组未开始定义全部状态为true
        listStatus: [],
        listLength: 0,
        isFirstIn:true,
        labelH:0,
        ing: 'ing',
        notStart: 'notStart',
        ended: 'ended',
        swichtype:0,
        lastObj:null,
        selectUuid:null,
        selectImg:null,
        selectGd:null,
        outlink:null,
        isFirstload:null,
        link:null,
        isLeftLoad:false,
        isRightLoad:false,
        notGainDelay:1000,
        $unlockcard:$(".body-lock-card>.body-content"),
        $lotteryCountdown: $("#lottery-countdown"),
        oi:getQueryString("oi"),
        init: function(){
            this.canJump = true;
            //this.guide();
            this.event();
            //this.lotteryRound_port();
            this.refreshDec();
            this.getUserinfo();
            this.resize();
            //getResult('api/greetingcard/material/allGain', {oi:openid}, 'callbackGreetingcardMaterialAllGainHandler');
        },
        refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
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
                            var nowTime = new Date().getTime();
                            H.vote.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {}
                });
            },dely);
        },
        guide: function () {
            var step = 0;
            $(".lock-card").on("click", function () {guide()});
            $(".my-card").on("click", function () {guide()});
            $(".fight").on("click", function () {guide()});
            $(".black").on("click", function () {guide()});
            $(".guide2").on("click", function () {guide()});
            $(".guide3").on("click", function () {guide()});
            $(".guide4").on("click", function () {guide()});
            function guide(){
                switch (step){
                    case 0:
                        $(".black").css("background","rgba(0,0,0,.7)");
                        $(".lock-card").css("z-index","210");
                        $(".guide2").css({"opacity":"1","z-index":"210"});
                        $(".guide3").css("z-index","210");
                        $(".guide4").css("z-index","210");
                        $(".fight").css("z-index","210");
                        $(".guide-hand").css({"opacity":"1","z-index":"210"});
                        step++;
                        break;
                    case 1:
                        $(".lock-card").css("z-index","190");
                        $(".my-card").css("z-index","210");
                        $(".guide2").css("opacity","0");
                        $(".guide3").css("opacity","1");
                        step++;
                        break;
                    case 2:
                        $(".my-card").css("z-index","190");
                        $(".guide3").css("opacity","0");
                        $(".guide4").css("opacity","1");
                        step++;
                        break;
                    case 3:
                        $(".guide2").addClass('none');
                        $(".guide3").addClass('none');
                        $(".guide4").addClass('none');
                        $(".guide-hand").addClass('none');
                        $(".black").addClass('none').off();
                        $(".fight").off();
                        H.vote.event();
                        break;
                    default :
                        break;
                }
            }
        },
        event: function(){
            var me = H.vote;
            $(".go-rank").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("rank.html");
                //toUrl("lottery.html?cb41faa22e731e9b="+cb41faa22e731e9b);
            });
            $(".ft-back").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("switch.html");
            });
            $(".fight").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                if(me.selectUuid !== null){
                    var exp = new Date();
                    exp.setTime(exp.getTime() + 30*1000);
                    if($.fn.cookie(openid + 'delay') == null) {
                        $.fn.cookie(openid + 'delay', true, {expires: exp});
                        if($.fn.cookie(openid + 'ischallenge') == "false"){
                            var cexp = new Date();
                            cexp.setTime(exp.getTime() + 24*60*60*1000);
                            $.fn.cookie(openid + 'ischallenge', true, {expires: cexp});
                            if(me.oi){
                                toUrl("fight.html?uuid="+me.selectUuid+"&img="+me.selectImg+"&gd="+me.selectGd+"&oi="+me.oi);
                            }else{
                                toUrl("fight.html?uuid="+me.selectUuid+"&img="+me.selectImg+"&gd="+me.selectGd);
                            }
                        }else{
                            toUrl("fight.html?uuid="+me.selectUuid+"&img="+me.selectImg+"&gd="+me.selectGd);
                        }
                    }else{
                        showTips("英雄莫要心急，休息片刻再来吧");
                    }
                }else{
                    showTips("请先选择一张卡牌哦");
                }
            });
            //this.swichbox();
        },
        resize: function () {
            $(".body").css({"height":($(window).height() - 175) + "px"});
        },
        jump: function(){
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        getUserinfo: function () {
            getResult('api/user/info_v2', {matk: matk}, 'callbackUserInfoHandler', true);
            getResult('api/fight/activity/current', {matk: matk}, 'callbackFightCurrentHandler', true);
            getResult('api/lottery/integral/my', {
                oi: openid
                //pu:acttUID
            }, 'callbackIntegralMyHandler', true);
            getResult('api/fight/player/selfWideRank', {oi:openid}, 'callbackFightPlayerFightSelfWideRankHandler');
        },
        swichbox: function () {
            if(this.swichtype == 0){
                $(".lock-card").one("click", function () {
                    $(this).css({"background":"-webkit-linear-gradient(top, #ca151b 0%,#8f0b11 40%,#350107 100%)"});
                    $(".my-card").css({"background":"-webkit-linear-gradient(top, #616161 0%,#373737 40%,#0d0d0d 100%)"});
                    $(".body-my-card").addClass('none');
                    $(".body-lock-card").removeClass('none').css({"-webkit-animation":"justshow 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).one("webkitAnimationEnd", function () {
                        $(this).css({"-webkit-animation":""});
                        $(".lock-card").off();
                        H.vote.swichtype = 1;
                        H.vote.swichbox();
                    });
                    if(H.vote.isRightLoad == false){
                        shownewLoading();
                        getResult('api/fight/player/allNotGain', {oi:openid}, 'callbackFightPlayerAllNotGainHandler');
                        H.vote.isRightLoad = true;
                    }
                });
            }else{
                $(".my-card").one("click", function () {
                    $(this).css({"background":"-webkit-linear-gradient(top, #ca151b 0%,#8f0b11 40%,#350107 100%)"});
                    $(".lock-card").css({"background":"-webkit-linear-gradient(top, #616161 0%,#373737 40%,#0d0d0d 100%)"});
                    $(".body-lock-card").addClass('none');
                    $(".body-my-card").removeClass('none').css({"-webkit-animation":"justshow 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).one("webkitAnimationEnd", function () {
                        $(this).css({"-webkit-animation":""});
                        $(".my-card").off();
                        H.vote.swichtype = 0;
                        H.vote.swichbox();
                    });
                    if(H.vote.isLeftLoad == false){
                        shownewLoading();
                        //getResult('api/greetingcard/material/allGain', {oi:openid}, 'callbackGreetingcardMaterialAllGainHandler');
                        getResult('api/fight/player/allGain', {oi:openid}, 'callbackFightPlayerAllGainHandler');
                        H.vote.isLeftLoad = true;
                    }
                });
            }
        },
        getcard: function (type) {
            this.isLeftLoad = false;
            this.isRightLoad = false;
            $(".body-my-card>.body-content").html('');
            $(".body-lock-card>.body-content").html('');
            if(type == 0){
                getResult('api/fight/player/allGain', {oi:openid}, 'callbackFightPlayerAllGainHandler');
                this.isLeftLoad = true;
            }else{
                getResult('api/fight/player/allNotGain', {oi:openid}, 'callbackFightPlayerAllNotGainHandler');
                this.isRightLoad = true;
            }
        },
        showcard: function (data,type) {
            var content,card = data.ml,cardinfo='';
            if(type == 0){
                content = $(".body-my-card>.body-content");
            }else{
                content = this.$unlockcard;
            }
            if(card){
                for(var a=3;a>0;a--){
                    for(var i=0;i<card.length;i++){
                        if(card[i].gd == a){
                            cardinfo += '<section class="content-box">'
                                + '<div class="select-player-img" uuid="' + card[i].ud + '" gd="' + card[i].gd + '" nm="' + card[i].ulsi + '">';
                            if(type == 1){
                                cardinfo += '<img class="lock" src="./images/lock-bg.png" />'
                                    + '<div class="unlock"><div class="n-gold"><img src="images/score-bg.png" />'
                                    + '<p>' + card[i].ui + '</p></div><p>点击解锁</p></div>';
                            }
                            cardinfo += '<img src="./images/' + (card[i].gd+1).toString() + 's-bg.png" /><div class="select-player-box">'
                                + '<img src="' + card[i].lsi + '" /></div><div class="star-box">';
                            for(var b=0;b<parseInt(card[i].gd);b++){
                                cardinfo += '<i class="icon-star"></i>'
                            }
                            cardinfo += '</div></div></section>';
                        }
                    }
                }
            }
            content.append(cardinfo);
            if(type == 1){
                content.find(".select-player-img").one("click", function () {
                    content.find(".select-player-img").off();
                    H.vote.unlock($(this));
                });
            }else{
                $(".body-my-card").find(".select-player-box").on("click", function () {
                    $(".body-my-card").find(".select-player-box").off();
                    H.vote.fight($(this));
                });
            }
        },
        fight: function (self) {
            if(this.lastObj == null){
                this.lastObj = self;
                self.parent().addClass("select");
            }else if(this.lastObj !== self){
                this.lastObj.parent().removeClass("select");
                self.parent().addClass("select");
                this.lastObj = self;
            }
            this.selectUuid = self.parent().attr("uuid");
            //this.selectImg = self.find("img").attr("src");
            this.selectImg = self.parent().attr("nm");
            this.selectGd = self.parent().attr("gd");
            $(".body-my-card").find(".select-player-box").on("click", function () {
                $(".body-my-card").find(".select-player-box").off();
                H.vote.fight($(this));
            });
        },
        unlock: function (self) {
            var uuid = self.attr("uuid");
            getResult('api/fight/player/unlock4integral', {oi:openid,pu:uuid}, 'callbackFightPlayerUnlock4IntegralHandler');
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };
    W.callbackFightPlayerAllGainHandler = function(data) {
        if(data == undefined){

        }else{
            hidenewLoading();
            if(data.result){
                if($("body").hasClass('body-getcard')){
                    getResult('api/fight/player/allNotGain', {oi:openid}, 'callbackFightPlayerAllNotGainHandler');
                }else{
                    H.vote.showcard(data,0);
                }
            }else{
            }
        }
        hidenewLoading();
    };
    W.callbackFightPlayerAllNotGainHandler = function(data) {
        if(data == undefined){

        }else{
            hidenewLoading();
            if(data.result){
                H.vote.showcard(data,1);
                H.vote.$unlockcard.append(H.vote.outlink);
                $(".outtext").on("click", function () {
                    window.location.href = H.vote.link;
                });
            }else{
                if($("body").hasClass('body-getcard')){
                    setTimeout(function () {
                        getResult('api/fight/player/allGain', {oi:openid}, 'callbackFightPlayerAllGainHandler');
                    }, H.vote.notGainDelay);
                    H.vote.notGainDelay += 5000;
                }
            }
        }
        hidenewLoading();
    };
    W.callbackUserInfoHandler = function(data) {
        if(data == undefined){

        }else{
            $(".player-name").text(data.nn?data.nn:"匿名");
            $(".player-headimg").find('img').attr("src",data.hi?data.hi:"./images/avatar.png");
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
    W.callbackFightPlayerUnlock4IntegralHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.result){
                if(data.us){
                    showTips('解锁成功');
                    H.vote.getcard(1);
                }else{
                    showTips('解锁失败');
                }
            }else{
                showTips('解锁失败');
            }
        }
        H.vote.$unlockcard.find(".select-player-img").one("click", function () {
            H.vote.$unlockcard.find(".select-player-img").off();
            H.vote.unlock($(this));
        });
        hidenewLoading();
    };

    W.callbackFightCurrentHandler = function(data){
        var me = H.vote;
        if(data.code == 0){
        }
        H.vote.jump();
    };

    W.commonApiPromotionHandler = function(data){
        var me = H.vote;
        if(data.code == 0){
            if(data.url && data.desc){
                var link = data.url.indexOf(';');
                var de = data.desc.indexOf(';');
                me.link = data.url.substring(link+1);
                me.outlink = '<div class="outlink"><img src="images/toy3.png" /><a class="outtext" data-collect="true" data-collect-flag="outlink" data-collect-desc="卡牌页外链">' + data.desc.substring(de+1) + '</a></div>';
            }
        }
        if($("body").hasClass('body-getcard')){
            H.vote.getcard(1);
        }else{
            H.vote.getcard(0);
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

})(Zepto);

$(function() {
    H.vote.init();
});
