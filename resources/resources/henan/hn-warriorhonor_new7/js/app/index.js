(function($){
    H.index = {
        canJump:true,
        voteinfo:null,
        isvote:false,
        isask:false,
        nowTime: null,
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        index: 0, // 当前抽奖活动在 list 中的下标
        pal: [],// 抽奖活动list
        dec: 0,//服务器时间与本地时间的差值
        type: 2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        isTimeOver: false,
        so:"",
        $lotteryCountdown: $("#lottery-countdown"),
        init: function(){
            this.canJump = true;
            this.event();
            if($("body").hasClass('pg-switch')){
                this.lotteryRound_port();
                this.vote();
            }else{
                getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler');
                //getResult('api/article/list', {}, 'callbackArticledetailListHandler');
            }
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        swinit: function () {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                effect : 'coverflow',
                slidesPerView: 1,
                prevButton:'.swiper-button-prev',
                nextButton:'.swiper-button-next',
                paginationBulletRender: function (index, className) {
                    var pname = null;
                    //return '<span class="' + className + '">' + pname + '</span>';
                }
            });
        },
        event: function(){
            var me = H.index;
            $(".go").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("switch.html?cb41faa22e731e9b="+cb41faa22e731e9b);
            });
            $(".totalk").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("talk.html");
            });
            $(".tolottery").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("lottery.html");
            });
        },
        vote: function () {
            var me = H.index;
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud'+dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.code == 0){
                        H.index.voteinfo = data;
                        H.index.chktime(data);
                    }else if(data.code == 4){
                        H.index.voteinfo = data;
                        H.index.chktime(data,true);
                        //$(".ltl").css("opacity","1");
                    } else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                //me.current_time();
                            },500);
                        }else{
                            me.isToLottey = false;
                            me.change();
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        chktime: function (data) {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/common/time',
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'commonApiTimeHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(serverdata) {
                    hidenewLoading();
                    $(".ltnum").css("opacity","0");
                    if(serverdata.t){
                        var serverT = serverdata.t;
                        var hasvote = false;
                        for(var i = 0;(i<=data.items.length - 1);i++){
                            var st = timestamp(data.items[i].gst);
                            var et = timestamp(data.items[i].get);
                            //alert(JSON.stringify(data.items[i]));
                            if((serverT>st)&&(serverT<et)){
                                hasvote = true;
                                //$(".voteinfo>div").html(data.items[i].pitems[0].na);
                                //$(".voteinfo>p").html(data.items[i].pitems[0].ni);
                                for(var a = 0; a < data.items[i].pitems.length;a++){
                                    H.index.guid = data.items[i].guid;
                                    H.index.puid += data.items[i].pitems[a].pid;
                                    var infoData = "";
                                    infoData += '<div class="swiper-slide"><img src="' + data.items[i].pitems[a].im + '">';
                                    if(data.items[i].pitems[a].im2 == ''){
                                        infoData += '<div class="outer-box"><a style="opacity: 0" href="#"></a></div>';
                                    }else{
                                        infoData += '<div class="outer-box">' +
                                            '<a href="#" onclick="H.index.outlink(this)" data-link="' + data.items[i].pitems[a].im2 + '" class="outer-btn" data-collect="true" data-collect-flag="outer-btn' + (data.items[i].pitems[a].na?data.items[i].pitems[a].na:a) + '" data-collect-desc="' + (data.items[i].pitems[a].ni) + '_外跳按钮">' +
                                            '点此观看直播</a>' +
                                            '</div>';
                                    }
                                    infoData += '<div class="card-bottom"><span class="card-name">' + data.items[i].pitems[a].ni + '</span><a href="#" class="praise-btn" onclick="H.index.praise(this)" puid="' + data.items[i].pitems[a].pid + '" guid="' + data.items[i].guid + '" data-collect="true" data-collect-flag="vote-sign" data-collect-desc="点赞按钮"></a>';
                                    infoData += '<span id="' + data.items[i].pitems[a].pid + '" class="card-numb"></span>';
                                    infoData += '<p class="card-info">' + data.items[i].pitems[a].in + '</p></div></div>';
                                    $(".swiper-wrapper").append(infoData);
                                }
                                H.index.swinit();
                                //$(".voteinfo").css("height",($(window).width() * 0.1)+"px");
                                getResult('api/voteguess/isvote', {yoi:openid,guid: H.index.guid}, 'callbackVoteguessIsvoteHandler');
                                H.index.isfill = true;
                            }
                        }
                        if(hasvote == false){
                            H.index.isvover = true;
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        outlink: function (self) {
            shownewLoading();
            setTimeout(function () {
                window.location.href = $(self).attr("data-link");
            },500);
        },
        praise: function (self) {
            if(H.index.so !== "" && H.index.so.match($(self).attr("puid"))){
                showTips("您已经投过票了");
            }else{
                if(H.index.isask){
                }else{
                    H.index.isask = true;
                    $.ajax({
                        type : 'GET',
                        async : false,
                        url : domain_url + 'api/voteguess/guessplayer' +dev,
                        data: {
                            yoi:openid,
                            guid: $(self).attr("guid"),
                            pluids: $(self).attr("puid")
                        },
                        dataType : "jsonp",
                        jsonpCallback : 'callbackVoteguessGuessHandler',
                        timeout: 11000,
                        complete: function() {
                        },
                        success : function(data) {
                            hidenewLoading();
                            if(data.code == 0){
                                showTips("投票成功");
                                $("#"+$(self).attr("puid")).text(parseInt($("#"+$(self).attr("puid")).text())+1);
                            }else if(data.code == 4){
                                showTips("您已经投过票了");
                            }
                            H.index.so += $(self).attr("puid");
                            H.index.isask = false;
                        },
                        error : function(xmlHttpRequest, error) {
                        }
                    });
                }
            }
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
                    //me.safeLotteryMode('on');
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
            me.$lotteryCountdown.find(".countdown-tip").html('开始摇奖');
            //$(".countdown").css({"border-bottom":"inset 1px #525252","background":"black"}).off();
            $(".tolottery").addClass("none");
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
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
            //$(".countdown").css({"border-bottom":"none","background":'url("images/button1.png") no-repeat',"background-size":"100% 100%"}).one("click", function () {
            //    toUrl("lottery.html?cb41faa22e731e9b="+cb41faa22e731e9b);
            //});
            $(".tolottery").removeClass("none");
            $(".countdown-tip").css("margin","0 18px 0");
            me.count_down();
            me.$lotteryCountdown.addClass('none');
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
            me.$lotteryCountdown.removeClass('none');
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
            me.$lotteryCountdown.removeClass('none').find(".countdown-tip").html('本期摇奖已结束，下期再战！');
            me.$lotteryCountdown.find('.detail-countdown').html("").addClass('none');
            $(".countdown").css({"-webkit-animation":""}).off();
            $(".tolottery").addClass("none");
            hidenewLoading();
            me.$lotteryCountdown.text("本期摇奖已结束，下期再战！");
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
    	if(data.code == 0){
    		$(".tlt").attr("src",data.gitems&&data.gitems[0].is?data.gitems[0].is:"images/tlt.png");
    	}else{
    		$(".tlt").attr("src","images/tlt.png");
    	}
    };
    W.callbackArticledetailListHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.code == 0){
                $(".go").before('<img class="ad" src="' + (data.arts[0].img).toString() + '" />');
            }else if(data.code == 1){
            }
        }
        hidenewLoading();
    };
    W.callbackVoteguessGroupplayerticketsHandler = function(data){
        if(data.code == 0){
            for(var a=0;a<data.items.length;a++){
                $("#"+data.items[a].puid).text(data.items[a].cunt);
            }
        }
    };
    W.callbackVoteguessIsvoteHandler = function(data){
        if((data.so == undefined)){
            H.index.so = '';
        }else{
            H.index.so = data.so;
        }
        getResult('api/voteguess/groupplayertickets',{groupUuid: H.index.guid},'callbackVoteguessGroupplayerticketsHandler');
    };
})(Zepto);
$(function(){
    H.index.init();
});
