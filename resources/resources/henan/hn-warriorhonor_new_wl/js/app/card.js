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
        $unlockcard:$(".body-lock-card>.body-content"),
        $lotteryCountdown: $("#lottery-countdown"),
        init: function(){
            this.canJump = true;
            this.event();
            this.lotteryRound_port();
            this.refreshDec();
            this.getUserinfo();
            this.jump();
            this.resize();
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
        event: function(){
            var me = H.vote;
            $(".go-rank").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("rank.html");
                //toUrl("lottery.html?cb41faa22e731e9b="+cb41faa22e731e9b);
            });
            $(".go-talk").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("friend.html");
            });
            $(".fight").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                if(me.selectUuid !== null){
                    var exp = new Date();
                    exp.setTime(exp.getTime() + 30*1000);
                    if($.fn.cookie(openid + 'delay') == null) {
                        $.fn.cookie(openid + 'delay', true, {expires: exp});
                        toUrl("fight.html?uuid="+me.selectUuid+"&img="+me.selectImg+"&gd="+me.selectGd);
                    }else{
                        showTips("英雄莫要心急，休息片刻再来吧");
                    }
                }else{
                    showTips("请先选择一张卡牌哦");
                }
            });
            this.swichbox();
        },
        resize: function () {
            $(".body").css({"height":($(window).height() - 170) + "px"});
        },
        jump: function(){
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        getUserinfo: function () {
            getResult('api/user/info_v2', {matk: matk}, 'callbackUserInfoHandler', true);
            getResult('api/lottery/integral/my', {
                oi: openid
                //pu:acttUID
            }, 'callbackIntegralMyHandler', true);
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
                        getResult('api/greetingcard/material/allNotGain', {oi:openid}, 'callbackGreetingcardMaterialAllNotGainHandler');
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
                        getResult('api/greetingcard/material/allGain', {oi:openid}, 'callbackGreetingcardMaterialAllGainHandler');
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
                getResult('api/greetingcard/material/allGain', {oi:openid}, 'callbackGreetingcardMaterialAllGainHandler');
                this.isLeftLoad = true;
            }else{
                getResult('api/greetingcard/material/allNotGain', {oi:openid}, 'callbackGreetingcardMaterialAllNotGainHandler');
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
                for(var i=0;i<card.length;i++){
                    if(card[i].result){
                        cardinfo += '<section class="content-box">'
                            + '<div class="select-player-img" uuid="' + card[i].ud + '" gd="' + card[i].gd + '" nm="' + card[i].ulsi + '">';
                        if(type == 1){
                            cardinfo += '<img class="lock" src="./images/lock-bg.png" />'
                                + '<div class="unlock"><div class="n-gold"><img src="images/score-bg.png" />'
                                + '<p>' + card[i].ui + '</p></div><p>点击解锁</p></div>';
                        }
                        cardinfo += '<img src="./images/' + (card[i].gd+1).toString() + 's-bg.png" /><div class="select-player-box">'
                            + '<img src="' + card[i].lsi + '" /></div><div class="star-box">';
                        for(var a=0;a<parseInt(card[i].gd);a++){
                            cardinfo += '<i class="icon-star"></i>'
                        }
                        cardinfo += '</div></div></section>';
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
            getResult('api/greetingcard/material/unlock4integral', {oi:openid,mu:uuid}, 'callbackGreetingcardMaterialUnlock4IntegralHandler');
        },
        lotteryRound_port: function() {
            var me = this;
            shownewLoading();
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.result == true){
                        me.nowTime = timeTransform(data.sctm);
                        console.log(me.nowTime);
                        var nowTimeStemp = new Date().getTime();
                        me.dec = nowTimeStemp - data.sctm;
                        me.roundData = data;
                        me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.lotteryRound_port();
                            },500);
                        }else{
                            me.change();
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    me.safeLotteryMode('on');
                }
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this, nowTimeStr = this.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [], day = nowTimeStr.split(" ")[0];
            // 判断是否为跨天摇奖 配置文件中crossdayLimit跨天摇奖阀值，默认2h
            var lastLotteryEtime = prizeActListAll[prizeActListAll.length - 1].pd + ' ' + prizeActListAll[prizeActListAll.length - 1].et;
            var lastLotteryNtime = prizeActListAll[prizeActListAll.length - 1].nst;
            var crossDay = timeTransform(new Date().setDate(new Date(lastLotteryEtime).getDate() + 1)).split(" ")[0];
            var minCrossDay = crossDay + ' 00:00:00';
            var maxCrossDay = timeTransform(new Date(minCrossDay).getTime() + crossdayLimit);
            if(comptime(lastLotteryNtime, minCrossDay) <= 0 && comptime(lastLotteryNtime, maxCrossDay) >= 0) {
                me.crossLotteryFlag = true;
            } else {
                me.crossLotteryFlag = false;
            }

            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    if (me.crossLotteryFlag) {
                        me.type = 1;
                        me.crossCountdown(prizeActList[prizeLength - 1].nst);
                    } else {
                        me.type = 3;
                        me.endType = 3;
                        me.change();
                    }
                    return;
                }
                //如果第一轮未开始
                if(comptime(prizeActList[0].pd + " " + prizeActList[0].st,nowTimeStr) < 0){
                    me.beforeCountdown(prizeActList[0]);
                    //me.$goLottery.find("span").text("等待摇奖");
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) <= 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        if(i < prizeActList.length - 1){
                            var nextBeginTimeStr = prizeActList[i + 1].pd + " " + prizeActList[i + 1].st;
                            if(comptime(endTimeStr, nextBeginTimeStr) <= 0){
                                me.endType = 2;
                                // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                                me.lastRound = false;
                                me.nextPrizeAct = prizeActList[i+1];
                            } else {
                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                me.endType = 1;
                            }
                        }else{
                            // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                            me.endType = 3;
                            me.lastRound = true;
                        }
                        me.nowCountdown(prizeActList[i]);
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            }else{
                //me.safeLotteryMode('on');
                return;
            }
        },
        initComponent: function(){
            var me = this, recordDelay = Math.ceil(15000*Math.random() + 20000);
            setTimeout(function(){ me.red_record(); }, recordDelay);
            setInterval(function(){ me.red_record(); }, me.allRecordTime);
            setTimeout(function() {me.account_num();}, me.PVTime);
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.$lotteryCountdown.find(".countdown-tip").html('距摇奖开始还有');
            $(".countdown").css({"-webkit-animation":""}).off();
            me.count_down();
            //me.$lotteryCountdown.removeClass('none');
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty().addClass('none');
            me.$lotteryCountdown.find(".countdown-tip").html("点我去摇奖");
            $(".countdown").css({"-webkit-animation":"shake 2s infinite","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("click", function () {
                toUrl("lottery.html?cb41faa22e731e9b="+cb41faa22e731e9b);
            });
            me.count_down();
            //me.$lotteryCountdown.removeClass('none');
            me.index++;
            me.canJump = true;
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            hidenewLoading();
        },
        // 跨天摇奖开启倒计时
        crossCountdown: function(nextTime) {
            var me = this;
            me.isCanShake = false;
            me.crossLotteryFlag = false;
            me.crossLotteryCanCallback = true;
            me.type = 1;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += me.dec;
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.$lotteryCountdown.find(".countdown-tip").html('距本轮摇奖开始还有');
            me.count_down();
            //me.$lotteryCountdown.removeClass('none');
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            me.$lotteryCountdown.find('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + '</span>时<span class="fetal-H">' + '%M%' + '</span>分<span class="fetal-H">' + '%S%' + '</span>秒', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + '</span>时<span class="fetal-H">' + '%M%' + '</span>分<span class="fetal-H">' + '%S%' + '</span>秒', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.canJump){
                            if (me.crossLotteryCanCallback) {
                                if(!me.isTimeOver){
                                    var delay = Math.ceil(1000*Math.random() + 500);
                                    me.isTimeOver = true;
                                    me.crossLotteryCanCallback = false;
                                    me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                    shownewLoading(null, '请稍后...');
                                    setTimeout(function(){
                                        me.lotteryRound_port();
                                    }, delay);
                                }
                            } else {
                                if(me.type == 1){
                                    //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                    if(!me.isTimeOver){
                                        me.isTimeOver = true;
                                        me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                        shownewLoading(null,'请稍后...');
                                        setTimeout(function() {
                                            me.nowCountdown(me.pal[me.index]);
                                        }, 1000);
                                    }
                                }else if(me.type == 2){
                                    //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                                    if(!me.isTimeOver){
                                        me.isTimeOver = true;
                                        if(me.index >= me.pal.length){
                                            if (me.crossLotteryFlag) {
                                                me.type = 1;
                                                me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                                shownewLoading(null,'请稍后...');
                                                setTimeout(function() {
                                                    me.crossCountdown(me.pal[me.pal.length - 1].nst);
                                                }, 1000);
                                            } else {
                                                me.type = 3;
                                                me.change();
                                            }
                                            return;
                                        }
                                        me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                        shownewLoading(null,'请稍后...');
                                        var i = me.index - 1;
                                        if(i < me.pal.length - 1){
                                            var endTimeStr = me.pal[i].pd + " " + me.pal[i].et;
                                            var nextBeginTimeStr = me.pal[i + 1].pd + " " + me.pal[i + 1].st;
                                            if(comptime(endTimeStr,nextBeginTimeStr) <= 0){
                                                // 有下一轮并且下一轮的开始时间和本轮的结束时间重合
                                                me.endType = 2;
                                            } else {
                                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                                me.endType = 1;
                                            }
                                        }
                                        setTimeout(function(){
                                            if(me.endType == 2){
                                                me.nowCountdown(me.pal[me.index]);
                                            }else if(me.endType == 1){
                                                me.beforeCountdown(me.pal[me.index]);
                                            } else {
                                                me.change();
                                            }
                                        },1000);
                                    }
                                }else{
                                    me.isCanShake = false;
                                }
                            }
                        }else{
                            me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        change: function() {
            var me = this;
            this.isCanShake = false;
            //me.$lotteryCountdown.removeClass('none').find(".countdown-tip").html('本期摇奖已结束，下期再战！');
            //me.$lotteryCountdown.find('.detail-countdown').html("").addClass('none');
            $(".countdown").css({"-webkit-animation":""}).off();
            hidenewLoading();
            //me.$lotteryCountdown.text("本期摇奖已结束，下期再战！");
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };
    W.callbackGreetingcardMaterialAllGainHandler = function(data) {
        if(data == undefined){

        }else{
            hidenewLoading();
            if(data.result){
                H.vote.showcard(data,0);
            }else{
            }
        }
        hidenewLoading();
    };
    W.callbackGreetingcardMaterialAllNotGainHandler = function(data) {
        if(data == undefined){

        }else{
            hidenewLoading();
            if(data.result){
                H.vote.showcard(data,1);
            }else{
            }
            H.vote.$unlockcard.append(H.vote.outlink);
            $(".outtext").on("click", function () {
                window.location.href = H.vote.link;
            });
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
    W.callbackGreetingcardMaterialUnlock4IntegralHandler = function(data) {
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

    W.commonApiPromotionHandler = function(data){
        var me = H.vote;
        if(data.code == 0){
            if(data.url && data.desc){
                var link = data.url.indexOf(';');
                var de = data.desc.indexOf(';');
                me.link = data.url.substring(link+1);
                me.outlink = '<div class="outlink"><img src="images/toy3.png" /><a class="outtext" data-collect="true" data-collect-flag="outlink" data-collect-desc="卡牌页外链">' + data.desc.substring(de+1) + '</a></div>';
                //me.$unlockcard.append(outtext);
                //$(".outtext").on("click", function () {
                //    window.location.href = data.url.substring(link+1);
                //});
                //me.outlink = outtext;
                //if(H.vote.isFirstload !== true){
                //    content.append(H.vote.outlink);
                //    $(".outtext").on("click", function () {
                //        window.location.href = data.url.substring(link+1);
                //    });
                //}
                //H.vote.isFirstload = true;
            }
        }
        H.vote.getcard(0);
    };

})(Zepto);

$(function() {
    H.vote.init();
});
