(function($) {
    H.index = {
        rp: getQueryString('rp') || '',
        init: function() {
            $('body, .cover-box, .zanzu').css({
                'width': $(window).width(),
                'height': $(window).height()
            });
            $('.main').css({
                'width': $(window).width(),
                'height': $(window).width(),
                'top': ($(window).height() - $(window).width()) / 2,
                'left': '0'
            });
            if (is_android()) {$('body').addClass('and')}
            this.addStar();
            H.lottery.init();
        },
        addStar: function(num) {
            var s = num || 20;
            for (var i = 0; i < s; i++) {
                var span = document.createElement("span");
                var k = (i % 3) + 2
                span.setAttribute("class", ("star blink hide star-" + k));
                var timeDelay = Math.random() * 3 + "s";
                var cycle = Math.random() * 5 + 2 + "s";
                var left = Math.floor(Math.random() * document.body.clientWidth) + "px";
                var top = document.body.clientHeight - Math.floor(Math.random() * document.body.clientHeight) + "px";
                var tempStyle = "-webkit-animation-delay:" + timeDelay + ";animation-delay:" + timeDelay + ";-webkit-animation-duration:" + cycle + ";animation-duration:" + cycle + ";left:" + left + ";top:" + top + ";";
                span.setAttribute("style", tempStyle);
                $('.stars').append(span);
            };
        }
    };

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
        isError: false,
        safeFlag: false,
        lastRound: false,
        isToLottey: true,
        isCanShake: false,
        isTimeOver: false,
        repeat_load: true,
        lotteryImgList: [],
        lotteryTime: getRandomArbitrary(1, 2),
        init: function() {
            this.event();
            this.lotteryRoundPort();
            W.addEventListener('shake', H.lottery.shake_listener, false);
            this.swiperInit();
        },
        event: function() {
            var me = this;
            $('body').delegate('#test', 'click', function(e) {
                e.preventDefault();
                me.lotteryTime = 1;
                me.shake_listener();
            });
        },
        swiperInit: function() {
            var mySwiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                resistanceRatio : 1,
                touchMoveStopPropagation : false,
                iOSEdgeSwipeDetection: true,
                onSlideChangeEnd: function(swiper) {
                    var activeIndex = parseInt(mySwiper.activeIndex);
                    if (activeIndex == 1) {
                        setTimeout(function(){
                            $('.tri1').animate({'opacity':'.7'}, 500);
                        }, 3500);
                        setTimeout(function(){
                            $('.li1').animate({'opacity':'.5'}, 500);
                        }, 4500);
                        setTimeout(function(){
                            $('.li2').animate({'opacity':'.5'}, 500);
                        }, 6500);
                        setTimeout(function(){
                            $('.li3').animate({'opacity':'.5'}, 500);
                        }, 8500);
                        $('.zanzu').addClass('load');
                    } else {
                        $('.zanzu').removeClass('load');
                        H.lottery.isCanShake = false;
                        $('.tri1, .li1, .li2, .li3').removeAttr('style');
                    }
                }
            });
            if (H.index.rp != '') mySwiper.slideTo(2, 0, false);
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
                    if (data.t) me.safeLotteryMode('off');
                },
                error: function(xmlHttpRequest, error) {}
            });
        },
        checkPing: function() {
            H.lottery.pingFlag = setTimeout(function() {
                clearTimeout(H.lottery.pingFlag);
                H.lottery.ping();
                H.lottery.checkPing();
            }, 30e3);
        },
        lotteryRoundPort: function() {
            var me = this;
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
                                me.lotteryRoundPort();
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
        servicePVPort: function() {
            getResult('api/common/servicepv', {}, 'commonApiSPVHander', false);
        },
        safeLotteryMode: function(flag) {
            var me = this;
            if (flag == 'on') {
                me.checkPing();
                $('.countdown').addClass('none');
                me.safeFlag = true;
            } else if (flag == 'off') {
                clearTimeout(me.pingFlag);
                me.pingFlag = null;
                me.lotteryRoundPort();
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
                if (H.lottery.type != 2) return;
                H.lottery.times++;
                if (!(H.lottery.times % H.lottery.lotteryTime == 0)) H.lottery.isToLottey = false;
            }
            if (!$(".home-box").hasClass("yao")) {
                $("#audio-a").get(0).play();
                $('.main').addClass('waggle');
                setTimeout(function() {
                    $('.main').removeClass('waggle');
                }, 1000);
                $(".home-box").addClass("yao");
            }
            recordUserOperate(openid, "摇奖", "shakeLottery");
            $('.thanks-tips').removeClass('show');
            if (!openid || openid == 'null' || H.lottery.isToLottey == false || H.lottery.safeFlag == true) {
                H.lottery.fill(null); //摇一摇
            } else {
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        red_record: function() {
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
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
                    me.change();
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
                        // me.initComponent();
                        return;
                    }
                    if (comptime(nowTimeStr, beginTimeStr) > 0) {
                        me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            } else {
                me.safeLotteryMode('on');
                return;
            }
        },
        initComponent: function() {
            var me = this;
            me.red_record();
            setTimeout(function() {
                me.servicePVPort();
                setInterval(function() {
                    me.servicePVPort();
                }, 5000);
            }, 5000);
            setInterval(function() {
                me.red_record();
            }, Math.ceil(60000 * Math.random() + 120000));
        },
        beforeCountdown: function(prizeActList) {
            $('.zanzu').removeClass('happy');
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd + " " + prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime', beginTimeLong).empty();
            $(".countdown-tip").html('距离摇奖开始');
            me.count_down();
            $('.countdown').removeClass('none');
            if (prizeActList.bi.length > 0) {
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            hidenewLoading();
        },
        nowCountdown: function(prizeActList) {
            $('.zanzu').addClass('happy');
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd + " " + prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime', beginTimeLong).empty();
            $(".countdown-tip").html("距离摇奖结束");
            me.count_down();
            $('.countdown').removeClass('none');
            me.index++;
            me.canJump = true;
            if (prizeActList.bi.length > 0) {
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            hidenewLoading();
            this.initComponent();
        },
        count_down: function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if (me.canJump) {
                            if (me.type == 1) {
                                //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                if (!me.isTimeOver) {
                                    me.isTimeOver = true;
                                    $('.countdown-tip').html('');
                                    // shownewLoading(null,'...');
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
                                    $('.countdown-tip').html('');
                                    // shownewLoading(null,'...');
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
            var me = this,
                sn = Math.sn();
            me.lotteryTime = getRandomArbitrary(1, 2);
            me.times = 0;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/exec/luck' + dev,
                data: {
                    matk: matk,
                    sn: sn
                },
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryLuckHandler',
                timeout: 10000,
                complete: function() {},
                success: function(data) {
                    if (data.flow && data.flow == 1) {
                        me.lotteryTime = getRandomArbitrary(6, 10);
                        me.times = 0;
                        sn = Math.sn();
                        me.lottery_point(null);
                        return;
                    }
                    if (data.result) {
                        if (data.sn == sn) {
                            sn = Math.sn();
                            me.lottery_point(data);
                        }
                    } else {
                        sn = Math.sn();
                        me.lottery_point(null);
                    }
                },
                error: function() {
                    sn = Math.sn();
                    me.lottery_point(null);
                }
            });
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            recordUserPage(openid, "调用抽奖接口", 0);
        },
        fill: function(data) {
            hidenewLoading();
            $(".home-box").removeClass("yao");
            if (data == null || data.result == false || data.pt == 0) {
                $("#audio-a").get(0).pause();
                // H.dialog.thanks.open();
                H.lottery.thanks();
                return;
            } else {
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play(); //中奖声音
            }
            if (data.pt == 4) {
                H.dialog.lottery.open(data);
            } else {
                H.lottery.thanks();
            }
        },
        thanks: function() {
            var me = this;
            hidenewLoading();
            me.canJump = true;
            me.isCanShake = true;
            if (typeof(thanks_tips) == 'undefined' || thanks_tips.length == 0) {
                var tips = '姿势摆的好，就能中大奖';
            } else {
                var tips = thanks_tips[getRandomArbitrary(0, thanks_tips.length)]
            }
            $('.thanks-tips').html(tips).addClass('show');
        },
        lottery_point: function(data) {
            var me = this;
            setTimeout(function() {
                me.fill(data);
            }, 900);
        },
        change: function() {
            $('.zanzu').removeClass('happy');
            this.isCanShake = false;
            $(".countdown").removeClass('none').find(".countdown-tip").html('摇奖活动已结束');
            $('.detail-countdown').html("").addClass('none');
            hidenewLoading();
        }
    };

    H.dialog = {
        puid: 0,
        ci: null,
        ts: null,
        si: null,
        $container: $('body'),
        open: function() {
            var me = this;
            if (this.$dialog) {
                this.$dialog.removeClass('none');
            } else {
                this.$dialog = $(this.tpl());
                H.dialog.$container.append(this.$dialog);
            }
            this.$dialog.find('.dialog').addClass('bounceInDown');
            setTimeout(function() {
                me.$dialog.find('.dialog').removeClass('bounceInDown');
            }, 1000);
            H.dialog.relocate();
        },
        relocate: function() {
            var height = $(window).height(),
                width = $(window).width();
            $('.modal, .dialog').each(function() {
                $(this).css({
                    'width': width,
                    'height': height,
                    'left': 0,
                    'top': 0
                });
            });
        },
        lottery: {
            $dialog: null,
            rp: null,
            open: function(data) {
                H.lottery.isCanShake = false;
                var me = this,
                    $dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                me.update(data);
                H.lottery.canJump = false;
            },
            close: function() {
                H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutDown');
                $('.modal').animate({'opacity':'0'}, 800);
                setTimeout(function() {
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find(".strick-box .box").click(function(e) {
                    e.preventDefault();
                    shownewLoading(null,'请不要关闭页面');
                    setTimeout(function() {
                        location.href = me.rp;
                    }, 50);
                });
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if (data.result && data.pt == 4) {
                    me.rp = data.rp;
                    $(".redlottery-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="Redlottery-dialog">')
                    ._('<div class="dialog redlottery-dialog">')
                    ._('<div class="strick-box">')
                    ._('<a href="#" class="btn-close"></a>')
                    ._('<img src="./images/icon-dialog-header.png"><div class="box">')
                    ._('<img class="award-img" src="./images/blank.png">')
                    ._('</div><img src="./images/icon-dialog-footer.png"></div>')
                    ._('</div>')
                    ._('</div>');
                return t.toString();
            }
        }
    };

    W.callbackLotteryAwardHandler = function(data) {};

    W.callbackLotteryAllRecordHandler = function(data) {
        if (data.result) {
            var recordList = data.rl,
                tpl = '';
            if (recordList && recordList.length > 0) {
                tpl += '<ul>';
                for (var i = 0; i < recordList.length; i++) {
                    var username = (recordList[i].ni || "匿名用户");
                    if (username.length >= 9) username = username.substring(0, 8) + '...';
                    tpl += "<li><span>" + username + "中了" + recordList[i].pn + "</span></li>";
                }
                tpl += '</ul>';
                $("#marqueen").animate({
                    'transform': 'translate3d(-500px,0,0)'
                }, 1000, function() {
                    $("#marqueen").css({
                        'transform': 'translate3d(500px,0,0)',
                        'opacity': '1'
                    }).animate({
                        'transform': 'translate3d(500px,0,0)'
                    }, 1000, function() {
                        $("#marqueen").html(tpl).marqueen({
                            mode: "left",
                            container: "#marqueen ul",
                            speed: 15,
                            fixWidth: 0
                        });
                        setTimeout(function() {
                            $("#marqueen").animate({
                                'transform': 'translate3d(0,0,0)'
                            }, 1000);
                        }, 1000);
                    });
                });
            }
        }
    };

    W.commonApiSPVHander = function(data) {
        if (data.code == 0) {
            $("#pv label").text(data.c);
            $("#pv").animate({
                'opacity': '1'
            }, 500);
        } else {
            $("#pv").animate({
                'opacity': '0'
            }, 500);
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});