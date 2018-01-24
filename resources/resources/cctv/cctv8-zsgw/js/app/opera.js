(function($) {
    H.opera = {
        uuid: null,
        $container:$(".container").find("ul"),
        init: function() {
            this.event();
            this.dataArticle();
        },
        dataArticle: function() {
            getResult("api/article/list", {}, "callbackArticledetailListHandler",true)
        },
        loadOperaList: function(uuid) {
            getResult("api/article/section", { uuid: uuid }, "callbackArticledetailDetailSectionHandler", true)
        },
        fillDom: function(items) {
            var t = simpleTpl();
            var me = this;
            for(var i=0;i<items.length;i++)
            {

                t._('<li><a href="./opera-detail.html?operaSort='+i+'" data-collect="true" data-collect-flag="opera-list'+i+'" data-collect-desc="剧集-列表-'+items[i].tt+'">')
                ._('<section class="tv-list">')
                ._('<div class="tv-icon"><img src="'+items[i].img+'" alt=""></div>')
                ._('<div class="tv-brief"> <div class="tv-name">'+items[i].tt+'</div>')
                ._('<p class="tv-tips">'+(items[i].n?items[i].n:".......")+'</p></div></section>')
                ._('<i class="arrow"><img src="./images/arrow-right.png" alt=""></i></a></li>')
            };
            me.$container.empty();
            me.$container.append(t.toString());
        },
        event: function() {


        }
    };
    W.callbackArticledetailListHandler = function(data) {
        if (data.code == 0) {
            H.opera.uuid = data.arts[2].uid;
            H.opera.loadOperaList(data.arts[2].uid);

        }
    }
    W.callbackArticledetailDetailSectionHandler = function(data) {
        if (data.code == 0) {
            H.opera.fillDom(data.items)
        }
    }

})(Zepto);
(function($) {
    H.lottery = {
        dec: 0,
        type: 2,
        index: 0,
        times: 0,
        endType: 1,
        pal: null,
        nowTime: null,
        pingFlag: null,
        roundData: null,
        nextPrizeAct: null,
        canJump: true,
        wxCheck: false,
        isError: false,
        safeFlag: false,
        lastRound: false,
        isToLottey: true,
        isCanShake: false,
        isTimeOver: false,
        repeat_load: true,
        lotteryImgList: [],
        lotteryTime: getRandomArbitrary(1, 2),
        redNextWidth: 0,
        entityNextWidth: 0,
        first: true,
        init: function() {
            this.lotteryRound_port();
            this.checkPing();
        },
        ping: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/common/time' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'commonApiTimeHandler',
                timeout: 10000,
                complete: function() {},
                success: function(data) {
                    if (data.t) {
                        var nowTimeStemp = new Date().getTime();
                        me.dec = nowTimeStemp - data.t;
                    }
                },
                error: function(xmlHttpRequest, error) {}
            });
        },
        checkPing: function() {
            var me = this,
                delay = Math.ceil(60000 * 2 * Math.random() + 60000 * 1);
            me.pingFlag = setTimeout(function() {
                clearTimeout(me.pingFlag);
                me.ping();
                me.checkPing();
            }, delay);
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
                complete: function() {},
                success: function(data) {
                    if (data.result == true) {
                        me.nowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        me.dec = nowTimeStemp - data.sctm;
                        me.roundData = data;
                        me.currentPrizeAct(data);
                    } else {
                        if (me.repeat_load) {
                            me.repeat_load = false;
                            setTimeout(function() {
                                me.lotteryRound_port();
                            }, 500);
                        } else {
                            me.change();
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {

                }
            });
        },
        currentPrizeAct: function(data) {
            //获取抽奖活动
            var me = this,
                nowTimeStr = this.nowTime,
                prizeActListAll = data.la,
                prizeLength = 0,
                prizeActList = [],
                day = nowTimeStr.split(" ")[0];
            if (prizeActListAll && prizeActListAll.length > 0) {
                for (var i = 0; i < prizeActListAll.length; i++) {
                    if (prizeActListAll[i].pd == day) {
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if (prizeActList.length > 0) {
                //如果最后一轮结束
                if (comptime(prizeActList[prizeLength - 1].pd + " " + prizeActList[prizeLength - 1].et, nowTimeStr) >= 0) {
                    me.endType = 3;
                    me.change(true);
                    return;
                }
                for (var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if (comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0) {
                        if (i < prizeActList.length - 1) {
                            var nextBeginTimeStr = prizeActList[i + 1].pd + " " + prizeActList[i + 1].st;
                            if (comptime(endTimeStr, nextBeginTimeStr) <= 0) {
                                me.endType = 2;
                                // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                                me.lastRound = false;
                                me.nextPrizeAct = prizeActList[i + 1];
                            } else {
                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                me.endType = 1;
                            }
                        } else {
                            // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                            me.endType = 3;
                            me.lastRound = true;
                        }
                        me.nowCountdown(prizeActList[i]);
                        return;
                    }
                    if (comptime(nowTimeStr, beginTimeStr) > 0) {
                        me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            } else {
                console.log("网络忙");
            }
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd + " " + prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime', beginTimeLong).empty();
            me.count_down();
            $('.countdown').addClass('on').removeClass('none');
            $(".countdown-tip").text("距离摇奖开始还有");
            hidenewLoading();

        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList) {
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd + " " + prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime', beginTimeLong).empty();
            me.count_down();
            $('.countdown').addClass('end').removeClass('none');
            $(".countdown-tip").text("距离摇奖结束还有");
            me.index++;
            me.canJump = true;
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '%M%' + ' : ' + '%S%', // 还有...结束
                    stpl: '%M%' + ' : ' + '%S%', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if (me.canJump) {
                            if (me.type == 1) {
                                //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                if (!me.isTimeOver) {
                                    me.isTimeOver = true;
                                    shownewLoading(null, '请稍后...');
                                    setTimeout(function() {
                                        me.nowCountdown(me.pal[me.index]);
                                    }, 1000);
                                }
                            } else if (me.type == 2) {
                                //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                                if (!me.isTimeOver) {
                                    me.isTimeOver = true;
                                    if (me.index >= me.pal.length) {
                                        me.change();
                                        me.type = 3;
                                        return;
                                    }
                                    shownewLoading(null, '请稍后...');
                                    var i = me.index - 1;
                                    if (i < me.pal.length - 1) {
                                        var endTimeStr = me.pal[i].pd + " " + me.pal[i].et;
                                        var nextBeginTimeStr = me.pal[i + 1].pd + " " + me.pal[i + 1].st;
                                        if (comptime(endTimeStr, nextBeginTimeStr) <= 0) {
                                            // 有下一轮并且下一轮的开始时间和本轮的结束时间重合
                                            me.endType = 2;
                                        } else {
                                            // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                            me.endType = 1;
                                        }
                                    }
                                    setTimeout(function() {
                                        if (me.endType == 2) {
                                            me.nowCountdown(me.pal[me.index]);
                                        } else if (me.endType == 1) {
                                            me.beforeCountdown(me.pal[me.index]);
                                        } else {
                                            me.change();
                                        }
                                    }, 1000);
                                }
                            } else {
                                me.isCanShake = false;
                            }
                        }
                    },
                    sdCallback: function() {
                        me.isTimeOver = false;
                    }
                });
            });
        },
        change: function(flag) {
            $('.countdown').addClass('end').removeClass('none');
            $(".countdown-tip").text("摇奖结束");
            hidenewLoading();
        }
    };
    H.lottery.init();
})(Zepto);

$(function() {
    H.opera.init();
});
