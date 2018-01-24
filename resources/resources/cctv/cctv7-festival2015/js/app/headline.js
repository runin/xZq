(function($) {
    H.headline = {
        dec: 0,
        type: 2,
        index: 0,
        endType: 1,
        pal: null,
        nowTime: null,
        roundData: null,
        nextPrizeAct: null,
        lastRound: false,
        isTimeOver: false,
        repeat_load: true,
        crossLotteryFlag: false,    //跨天摇奖倒计时标识  true为有跨天摇奖 false为没有跨天摇奖
        crossLotteryCanCallback: false,
        auid: getQueryString('auid') || '',
        headlineName: getQueryString('headlineName') || '',
        init: function(){
            var me = this;
            me.event();
            if ($('body').hasClass('H-detail')) {
                if(me.auid != ''){
                    getResult('api/newsdiy/look/' + me.auid, {},'callbackNewsDiyLookHandler');
                }else{
                    var value = nickname;
                    shownewLoading(null, '请稍后...');
                    if (me.headlineName == '') {
                        value = nickname ? nickname : '匿名用户';
                    } else {
                        value = me.headlineName;
                    }
                    $.ajax({
                        type: 'GET',
                        async: false,
                        url: domain_url + 'api/newsdiy/get' + dev,
                        data: { openid : openid, name : value },
                        dataType: "jsonp",
                        jsonpCallback: 'callbackNewsDiyGetHandler',
                        timeout: 5000,
                        complete: function() {
                        },
                        success: function(data) {
                            if(data.code == 0){
                                location.href = './headline_detail.html?auid=' + data.id;
                            }
                        },
                        error: function(xmlHttpRequest, error) {
                        }
                    });
                }
            } else {
                $('body').css({
                    'height': $(window).height(),
                    'min-height': '100%',
                    'overflow-y': 'scroll'
                });
                me.lotteryRound_port();
            }
        },
        initHeadline: function(data){
            $('#title').html(data.t);
            $('#img').attr('src', data.i).removeClass('none');
            $('#content').html(data.ct);
            $('#detail').html(data.pt + ' 来自：<label class="source">' + data.s + '</label> ' + data.c + '评论');
        },
        event: function(){
            $('#btn-headline-submit').click(function(e){
                e.preventDefault();
                var value = $.trim($('input.name').val());
                if(value.length <= 0){
                    showTips('姓名不能为空哦');
                    return;
                }
                shownewLoading(null, '请稍后...');
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/newsdiy/get' + dev,
                    data: { openid : openid, name : value },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackNewsDiyGetHandler',
                    timeout: 5000,
                    complete: function() {
                    },
                    success: function(data) {
                        if(data.code == 0){
                            location.href = './headline_detail.html?auid=' + data.id;
                        } else {
                            showTips('头条没那么容易上啦<br>等下再试试咯~');
                            hidenewLoading();
                        }
                    },
                    error: function(xmlHttpRequest, error) {
                        showTips('头条没那么容易上啦<br>等下再试试咯~');
                        hidenewLoading();
                    }
                });
            });
            $('#btn-headline-go').click(function(e){
                e.preventDefault();
                var me = this;
                if(!$(me).hasClass('requesting')){
                    $(me).addClass('requesting');
                    toUrl('headline.html');
                }
            });
            $('.countdown').click(function(e){
                e.preventDefault();
                var me = this;
                if(!$(me).hasClass('requesting')){
                    $(me).addClass('requesting');
                    toUrl('lottery.html');
                }
            });
        },
        lotteryRound_port: function() {
            var me = this;
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
                    me.change();
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
            if(comptime(lastLotteryNtime, minCrossDay) < 0 && comptime(lastLotteryNtime, maxCrossDay) >= 0) {
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
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    me.index = i;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
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
                me.change();
                return;
            }
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty().removeClass('none');
            $(".countdown-tip").html('距摇奖开始');
            me.count_down();
            $('.countdown').removeClass('none').removeClass('shake');
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty().addClass('none');
            $(".countdown-tip").html("点我摇奖");
            me.count_down();
            $('.countdown').removeClass('none').addClass('shake');
            me.index++;
            hidenewLoading();
        },
        // 跨天摇奖开启倒计时
        crossCountdown: function(nextTime) {
            var me = this;
            me.crossLotteryFlag = false;
            me.crossLotteryCanCallback = true;
            me.type = 1;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty().removeClass('none');
            $(".countdown-tip").html('距摇奖开始');
            me.count_down();
            $('.countdown').removeClass('none').removeClass('shake');
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + '时</span>' + '%M%' + '分' + '%S%秒', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + '时</span>' + '%M%' + '分' + '%S%秒', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if (me.crossLotteryCanCallback) {
                            if(!me.isTimeOver){
                                var delay = Math.ceil(1000*Math.random() + 500);
                                me.isTimeOver = true;
                                me.crossLotteryCanCallback = false;
                                $('.countdown-tip').html('请稍后');
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
                                    $('.countdown-tip').html('请稍后');
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
                                            $('.countdown-tip').html('请稍后');
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
                                    $('.countdown-tip').html('请稍后');
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
                            }
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        change: function() {
            $(".countdown").addClass('none');
        }
    };

    W.callbackNewsDiyGetHandler = function(data){
        if(data.code == 0){
            location.href = './headline_detail.html?auid=' + data.id;
        }
    };

    W.callbackNewsDiyLookHandler = function(data){
        if(data.code == 0){
            H.headline.initHeadline(data);
        }
    };
})(Zepto);

$(function() {
    H.headline.init();
});