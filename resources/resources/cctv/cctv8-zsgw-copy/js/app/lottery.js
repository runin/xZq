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
        $textb: $(".textb"),
        init: function() {
            this.event();
            this.resize();
            this.lotteryRound_port();
            this.shake();
            this.link();
        },
        resize: function() {
            var me = this,
                winW = $(window).width(),
                winH = $(window).height();
            if (!is_android()) {
                $(".main-top").css("height", (winH / 2) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2) + "px").css('bottom', '0');
            } else {
                $(".main-top").css("height", (winH / 2 + 0.5) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2 + 0.5) + "px").css('bottom', '0');
            }
        },
        event: function() {
            var me = this;
            $('body').delegate('#test', 'click', function(e) {
                e.preventDefault();
                me.wxCheck = true;
                me.lotteryTime = 1;
                me.shake_listener();
            });

            $('body').delegate("#btn-record","touchend", function(e) {
                e.preventDefault();
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    shownewLoading();
                    toUrl('my-record.html');
                }
            })
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
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
                        me.safeLotteryMode('off');
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
                    me.safeLotteryMode('on');
                }
            });
        },
        safeLotteryMode: function(flag) {
            var me = this;
            if (flag == 'on') {
                me.checkPing();
                $('.countdown').addClass('none');
                me.safeFlag = true;
                $(".home-box").removeClass("none");
                $(".home-box").animate({ opacity: 1 }, 500);
                me.imgMath();
            } else if (flag == 'off') {
                clearTimeout(me.pingFlag);
                me.pingFlag = null;
                me.lotteryRound_port();
                $('.countdown').removeClass('none');
                me.safeFlag = false;
            } else {
                me.safeLotteryMode('off');
            };
            hidenewLoading();
        },
        shake_listener: function() {
            if (!H.lottery.safeFlag) {
                if (H.lottery.isCanShake) {
                    H.lottery.isCanShake = false;
                    H.lottery.canJump = false;
                } else {
                    return;
                }
                if (H.lottery.type != 2) {
                    return;
                }
                H.lottery.times++;
                if (!(H.lottery.times % H.lottery.lotteryTime == 0)) {
                    H.lottery.isToLottey = false;
                }
            }
            if (!$(".home-box").hasClass("yao")) {
                $("#audio-a").get(0).play();
                $(".m-t-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate3d(0,-100px,0)'
                });
                $(".m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate3d(0,100px,0)'
                });
                setTimeout(function() {
                    $(".m-t-b").css({
                        '-webkit-transform': 'translate3d(0,0,0)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                    $(".m-f-b").css({
                        '-webkit-transform': 'translate3d(0,0,0)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                }, 1000);
                $(".home-box").addClass("yao");
            }
            if (!openid || openid == 'null' || H.lottery.isToLottey == false || H.lottery.safeFlag == true) {
                setTimeout(function() {
                    H.lottery.fill(null); //摇一摇
                }, 1500);
            } else {
                if (!H.lottery.wxCheck) {
                    //微信config失败
                    setTimeout(function() {
                        H.lottery.fill(null); //摇一摇
                    }, 1500);
                    return;
                }
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        imgMath: function() { //随机背景
            var me = this;
            if (me.lotteryImgList.length > 0) {
                var i = Math.floor((Math.random() * me.lotteryImgList.length));
                $("body").css("background", "url('" + me.lotteryImgList[i] + "') no-repeat center center rgb(218, 32, 42)");
                $("body").css("background-size", "100% auto");
            } else {
                $("body").css("background", "url(./images/bg-yao-default.jpg) no-repeat center center rgb(218, 32, 42)");
                $("body").css("background-size", "100% auto");
            }
        },
        initComponent: function() {
            var me = this;
            setInterval(function() {
                me.all_record();
            }, 4500);
            setInterval(function() {
                H.lottery.leftPrizeCount();
            }, 5000);
        },
        all_record: function() {
            getResult('api/lottery/allrecord', {ol:1}, 'callbackLotteryAllRecordHandler');
        },
        //查询业务当前抽奖活动有限制奖品剩余数量
        leftPrizeCount: function() {
            getResult('api/lottery/leftDayCountLimitPrize', {}, 'callbackLeftDayCountLimitPrizeHandler');
        },
        downloadImg: function() {
            var me = this,
                t = simpleTpl();
            if ($(".preImg")) {
                $(".preImg").remove();
            }
            for (var i = 0; i < me.lotteryImgList.length; i++) {
                t._('<img class="preload preImg" src="' + me.lotteryImgList[i] + '">')
            };
            $("body").append(t.toString());
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
                //config微信jssdk
                me.wxConfig();
                $(".home-box").removeClass("none");
                $(".home-box").animate({ opacity: 1 }, 500);
                me.imgMath();
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
                        me.initComponent();
                        $.fn.cookie('jumpNum', 0, { expires: -1 });
                        return;
                    }
                    if (comptime(nowTimeStr, beginTimeStr) > 0) {
                        me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            } else {
                me.safeLotteryMode('on');
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
            $('.countdown').removeClass("end").addClass('on').removeClass('none');
            if (prizeActList.bi.length > 0) {
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            $(".btn-record").removeClass("none"); //显示中奖按钮
            me.downloadImg();
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
            $('.countdown').removeClass("on").addClass('end').removeClass('none');
            me.index++;
            me.canJump = true;
            if (prizeActList.bi.length > 0) {
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            $(".btn-record").addClass("none"); //影藏中奖按钮
            me.downloadImg();
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '%H%' + ':' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl: '%H%' + ': '+ '%M%' + ':' + '%S%', // 还有...开始
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
        drawlottery: function() {
            shownewLoading();
            var me = this,
                sn = new Date().getTime() + '';
            me.lotteryTime = getRandomArbitrary(1, 2);
            me.times = 0;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/exec/luck' + dev,
                data: { matk: matk, sn: sn },
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryLuckHandler',
                timeout: 10000,
                complete: function() {
                    hidenewLoading();
                },
                success: function(data) {
                    if (data.flow && data.flow == 1) {
                        me.lotteryTime = getRandomArbitrary(6, 10);
                        me.times = 0;
                        sn = new Date().getTime() + '';
                        me.lottery_point(null);
                        return;
                    }
                    if (data.result) {
                        if (data.sn == sn) {
                            sn = new Date().getTime() + '';
                            me.lottery_point(data);
                        }
                    } else {
                        sn = new Date().getTime() + '';
                        me.lottery_point(null);
                    }
                },
                error: function() {
                    sn = new Date().getTime() + '';
                    me.lottery_point(null);
                }
            });
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            recordUserPage(openid, "调用抽奖接口", 0);
        },
        fill: function(data) {
            var me = this;
            me.imgMath();
            $(".home-box").removeClass("yao");
            if (data == null || data.result == false || data.pt == 0) {
                me.thanks();
                return;
            } else {
                $("#audio-b").get(0).play(); //中奖声音
            }
            if (data.pt == 1) {
                H.dialog.shiwuLottery.open(data);
            } else if (data.pt == 4) {
                H.dialog.redbagLottery.open(data);
            } else if (data.pt == 7) {
                H.dialog.wxcardLottery.open(data);
            } else if (data.pt == 9) {
                H.dialog.linkLottery.open(data);
            } else {
                me.thanks();
            }
        },
        thanks: function() {
            var me = this;
            // $("#audio-a").get(0).pause();
            // me.$textb.text(me.textMath())
            // me.$textb.removeClass("none");
            // me.$textb.addClass("yaonone-text").show();
            // setTimeout(function() {
            //     me.$textb.removeClass("yaonone-text");
            //     if (H.lottery.type == 2) {
            //         me.isCanShake = true;
            //     } else {
            //         me.isCanShake = false;
            //     }
            // }, 1000);
            H.dialog.thanksLottery.open();
        },
        textMath: function() { //随机文案
            var me = this;
            if (textList.length > 0) {
                var i = Math.floor((Math.random() * textList.length));
                return textList[i];
            }
        },
        lottery_point: function(data) {
            var me = this;
            setTimeout(function() { me.fill(data); }, 1500);
        },
        wxConfig: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'mp/jsapiticket' + dev,
                data: { appId: shaketv_appid },
                dataType: "jsonp",
                jsonpCallback: 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {},
                success: function(data) {
                    if (data.code == 0) {
                        var url = window.location.href.split('#')[0];
                        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
                        var timestamp = Math.round(new Date().getTime() / 1000);
                        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
                        //权限校验
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr: nonceStr,
                            signature: signature,
                            jsApiList: [
                                "addCard",
                                "checkJsApi"
                            ]
                        });
                    }
                },
                error: function(xmlHttpRequest, error) {}
            });
        },
        scroll: function() {
            // 左滚动
            $("#marqueen").marqueen({
                mode: "left", //滚动模式，top是向上滚动，left是朝左滚动
                container: "#marqueen ul", //包含的容器
                row: 1, //滚动行数
                speed: 40 //轮播速度，单位ms
            });
        },
        change: function(flag) {
            this.isCanShake = false;
            $(".countdown").removeClass('none').addClass('over').html('摇奖已结束，期待下期吧！');
            $('.detail-countdown').html("");
            $(".btn-record").removeClass("none"); //显示中奖按钮
            hidenewLoading();
        },
        link: function() {
            $('#link-out').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };

    W.callbackLotteryAllRecordHandler = function(data) {
        if (data && data.result) {
            var list = data.rl;
            if (list && list.length > 0) {
                var con = "";
                for (var i = 0; i < list.length; i++) {
                    con += "<li><span>" + (list[i].ni || "匿名用户") + "中了" + list[i].pn + "</span></li>";
                }
                var len = $(".marquee").find("li").length;
                if (len >= 500) {
                    $(".marquee").find("ul").html(con);
                } else {
                    $(".marquee").find("ul").append(con);
                }
                if (H.lottery.first) {
                    H.lottery.first = false;
                    H.lottery.scroll();
                }
                $(".marquee").removeClass("hidden");
            }
        }
    };

    W.callbackLeftDayCountLimitPrizeHandler = function(data) {
        if (data.result) {
            var num = $(".rednum").find("span").text();
            if (num * 1 >= data.lc || num * 1 == 0) {
                $(".rednum").find("span").text(data.lc);
                if (data.lc == 0) {
                    $(".rednum").css("opacity", "0");
                } else {
                    $(".rednum").css("opacity", "1");
                }
            }
        }
    };

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.url) {
            var zq_desc_list = data.desc.split(";")[0].split(",");
            var zq_url_list = data.url.split(";")[0].split(",");
            var index = localStorage.getItem("link_index")?(localStorage.getItem("link_index")*1):0;
            if(index >= zq_url_list.length){
                index = 0;
            }
            $('#link-out-zq').attr('data-collect-flag', "lottery-link-btn-zq-"+index).attr("data-collect-desc","摇奖页-吸粉链接-掌趣-"+index);
            $('#link-out-zq').attr('href', "javascript:void(0);").removeClass('none');
            $('#link-out-zq').click(function(){
                location.href = zq_url_list[index];
                localStorage.setItem("link_index", ++index);
            });
            $('#link-out-zq').find("p").text(zq_desc_list[index]);

            var ym_desc = data.desc.split(";")[1];
            var ym_url = data.url.split(";")[1];
            if(ym_desc && ym_url){
                $('#link-out-ym').attr('href', "javascript:void(0);").removeClass('none');
                $('#link-out-ym').click(function(){
                    location.href = ym_url;
                });
                $('#link-out-ym').find("p").text(ym_desc);
            }
        } else {
            $('#link-out-zq').remove();
            $('#link-out-ym').remove();
        }
    };
})(Zepto);

$(function() {
    H.lottery.init();
    wx.ready(function() {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function(res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if (t && !H.lottery.isError) {
                    H.lottery.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res) {
        H.lottery.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});
