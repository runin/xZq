(function($) {
    H.talk = {
        tid: '',
        $article: $('#article'),
        $question: $('#question'),
        $inputCmt: $('#input-comment'),
        $btnCmt: $('#btn-comment'),
        $btnRule: $('#btn-rule'),
        $total: $('#count'),
        REQUEST_CLS: 'requesting',
        PVTime: Math.ceil(4000 * Math.random()),
        init: function() {
            if (!openid) {
                return false;
            };
           
            H.utils.resize();
			
            this.eventHandle();
            H.comment.init();
            H.lottery.init();
        },
        account_num: function() {
            getResult('log/serpv ', {}, 'callbackCountServicePvHander');
        },
        eventHandle: function() {
            var me = this;

            var $tvListBtn = $("#tvList-btn");
            $tvListBtn.click(function(e) {
                e.preventDefault();
                toUrl("menu.html");
            });
            this.$btnCmt.click(function(e) {
                e.preventDefault();

                if ($(this).hasClass(me.REQUEST_CLS)) {
                    return;
                }
                var comment = $.trim(me.$inputCmt.val()) || '',
                    comment = comment.replace(/<[^>]+>/g, ''),
                    len = comment.length;

                if (len < 1) {
                    showTips('请先说点什么吧');
                    me.$inputCmt.removeClass('error').addClass('error');
                    setTimeout(function() {
                        me.$inputCmt.removeClass('error');
                    }, 1500)
                    return;
                } else if (len > 20) {
                    showTips('观点字数超出了20字');
                    me.$inputCmt.removeClass('error').addClass('error');
                    setTimeout(function() {
                        me.$inputCmt.removeClass('error');
                    }, 1500)
                    return;
                }

                $(this).addClass(me.REQUEST_CLS);

                shownewLoading(null, '发射中...');
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/comments/save' + dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackCommentsSave',
                    complete: function() {
                        hidenewLoading();
                    },
                    success: function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                            showTips('发射成功', null, 800);
                            var h = headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
                            barrage.appendMsg('<div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div>' + comment);
                            $('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                    }
                });

            });
        },
    };
    H.lottery = {
        nowTime: null,
        isTimeOver: false,
        first: true,
        pal: [],
        canJump: true,
        repeat_load: true, //用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        dec: 0, //服务器时间和本地时间的时差
        firstPra: null, //第一轮摇奖摇奖 用来重置倒计时
        type: 2, //判断倒计时形式 1为抽奖开始之前，2为抽奖正在播出 默认为2
        //查抽奖摇奖接口
        init: function() {

            this.current_time();
        },
        refreshDec: function() {
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000 * 5 * Math.random() + 60000 * 3);
            setInterval(function() {
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/common/time',
                    data: {},
                    dataType: "jsonp",
                    jsonpCallback: 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {},
                    success: function(data) {
                        if (data.t) {
                            var nowTime = new Date().getTime();
                            H.lottery.dec = nowTime - data.t;
                        }
                    },
                    error: function(xmlHttpRequest, error) {}
                });
            }, dely);
            $('body').css({
                'width': $(window).width(),
                'height': $(window).height()
            })
        },
        current_time: function() {
            //shownewLoading();
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryRoundHandler',
                timeout: 11000,
                complete: function() {},
                success: function(data) {
                    if (data.result == true) {
                        H.lottery.nowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        H.lottery.dec = nowTimeStemp - data.sctm;
                        H.lottery.currentPrizeAct(data);
                    } else {
                        if (H.lottery.repeat_load) {
                            H.lottery.repeat_load = false;
                            setTimeout(function() {
                                H.lottery.current_time();
                            }, 5000);
                        } else {
                            hidenewLoading();
                            $(".countdown").removeClass("none");
                            $('.countdown-tip').text("摇奖尚未开始");
                            $(".wrap-game").removeClass("none");
                            $(".game-join").addClass("heart");
                            $('.detail-countdown').text("");

                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    hidenewLoading();
                    $(".game-join").addClass("heart");
                    $(".countdown").addClass("none");
                    // $('.countdown-tip').text("摇奖尚未开始");
                    // $('.detail-countdown').text("");

                }
            });
        },
        currentPrizeAct: function(data) {
            var me = this,
                nowTimeStr = H.lottery.nowTime,
                prizeActListAll = data.la,
                prizeLength = 0,
                prizeActList = [];
            var day = nowTimeStr.split(" ")[0];
            if (prizeActListAll && prizeActListAll.length > 0) {
                for (var i = 0; i < prizeActListAll.length; i++) {
                    if (prizeActListAll[i].pd == day) {
                        prizeActList.push(prizeActListAll[i]);
                    }
                };
            }
            H.lottery.pal = prizeActList;
            prizeLength = prizeActList.length;
            if (prizeActList.length > 0) {
                if (comptime(prizeActList[prizeLength - 1].pd + " " + prizeActList[prizeLength - 1].et, nowTimeStr) >= 0) { //如果最后一轮结束
                    H.lottery.change();
                    return;
                }
                //config微信jssdk
                for (var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    //在摇奖时间段内且可以抽奖
                    if (comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0) {
                        //H.lottery.getPort();
                        H.lottery.index = i;
                        toUrl("yaoyiyao.html");
                        //H.lottery.nowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                    if (comptime(nowTimeStr, beginTimeStr) > 0) {
                        H.lottery.index = i;
                        H.lottery.beforeShowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                }
            } else {
                return;
            }
        },
        change: function() {
            hidenewLoading();
            $(".countdown-tip").html('本期摇奖已结束');
            $('.detail-countdown').html("");
            $(".countdown").removeClass("none");
        },
        // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            H.lottery.type = 1;
            H.lottery.isCanShake = false;
            var beginTimeStr = pra.pd + " " + pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            $(".game-join").addClass("heart");
            beginTimeLong += H.lottery.dec;
            $('.countdown').find(".yao-hand").removeClass('wobble');
            $(".countdown-tip").html('倒计时 ');
            $(".countdown").find(".detail-countdown").removeClass("none");
            $('.detail-countdown').attr('etime', beginTimeLong);
            H.lottery.count_down();
            $('.countdown').removeClass('none');
            $(".wrap-game").removeClass("none");
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra) {
            H.lottery.isCanShake = true;
            H.lottery.type = 2;
            var endTimeStr = pra.pd + " " + pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.lottery.dec;
            $('.detail-countdown').attr('etime', beginTimeLong);
            // $(".countdown-tip").html("距本轮摇奖结束还有");
            $(".game-join").removeClass("heart");
            H.lottery.count_down();
            H.lottery.index++;
            $('.countdown').find(".yao-hand").addClass('wobble');
            $(".countdown").find(".countdown-tip").text("进入摇奖");
            $(".countdown").find(".detail-countdown").addClass("none");
            $(".countdown").removeClass("none");
            $(".wrap-game").removeClass("none");
            hidenewLoading();
            toUrl("yaoyiyao.html");
        },
        count_down: function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl: '%H%' + ':' + '%M%' + ':' + '%S%' + '', // 还有...结束
                    stpl: '%H%' + ':' + '%M%' + ':' + '%S%' + '', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true
                        if (H.lottery.type == 1) {
                            //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                            if (!H.lottery.isTimeOver) {
                                H.lottery.isTimeOver = true;
                                $('.countdown-tip').html('请稍后');
                                shownewLoading();
                                setTimeout(function() {
                                    H.lottery.nowCountdown(H.lottery.pal[H.lottery.index]);
                                }, 1000);
                            }
                        } else if (H.lottery.type == 2) {
                            //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                            if (!H.lottery.isTimeOver) {
                                H.lottery.isTimeOver = true;
                                if (H.lottery.index >= H.lottery.pal.length) {
                                    H.lottery.change();
                                    H.lottery.type = 3;
                                    return;
                                }
                                $('.countdown-tip').html('请稍后');
                                shownewLoading();
                                setTimeout(function() {
                                    H.lottery.beforeShowCountdown(H.lottery.pal[H.lottery.index]);
                                }, 1000);
                            }
                        } else {
                            H.lottery.isCanShake = false;
                        }
                        return;
                    },
                    sdCallback: function() {
                        H.lottery.isTimeOver = false;
                    }
                });
            });
        },
    };
    // 弹幕_S
    H.comment = {
        timer: 5000,
        maxid: 0,
        pageSize: 50,
        $comments: $('#comments'),
        init: function() {
        	hidenewLoading();
            var me = this;
            W['barrage'] = this.$comments.barrage();
            W['barrage'].start(1);
            setInterval(function() {
                me.flash();
            }, me.timer);
        },
        flash: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + "api/comments/room?temp=" + new Date().getTime(),
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType: "jsonp",
                jsonpCallback: 'callbackCommentsRoom',
                success: function(data) {
                    if (data.code == 0) {
                        me.maxid = data.maxid;
                        var items = data.items || [],
                            umoReg = '/:';
                        for (var i = 0, len = items.length; i < len; i++) {
                            if ((items[i].co).indexOf(umoReg) >= 0) {
                                var funny = items[i].co;
                                var nfunny = funny.replace('/:', '');
                                barrage.appendMsg('<div class="c_head_img"><img src="' + (items[i].hu ? (items[i].hu + "/" + yao_avatar_size) : "./images/danmu-head.jpg") + '" /></div>' + '<img class="funnyimg" src="./images/funny/' + nfunny + '.png" border="0" />');
                            } else {
                                var hmode = "<div class='c_head_img'><img src='./images/danmu-head.jpg' class='c_head_img_img' /></div>";
                                if (items[i].hu) {
                                    hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img' /></div>";
                                }
                                if (i < 5) {
                                    $.fn.cookie('default_comment' + i, hmode + items[i].co, expires_in);
                                }
                                barrage.pushMsg(hmode + items[i].co);
                            }

                        }
                    } else {
                        return;
                    }
                }
            });
        }
    };
    // 弹幕_E

    H.utils = {
        $header: $('header'),
        $wrapper: $('article'),
        $comments: $('#comments'),
        $ctrls: $('.ctrls'),

        resize: function() {
            var height = $(window).height();
            var headerH = height * 0.20;
            var headerC = height - headerH;
            this.$header.css('height', Math.round(headerH));
            this.$wrapper.css('height', Math.round(headerC));
            this.$comments.css('height', Math.round(headerC - 110));
            this.$ctrls.css('bottom', $(".foot-btn").height());
            $('body').css('height', height);

        }
    };

    W.callbackCountServicePvHander = function(data) {
        if (data.code == 0) {
            H.talk.$total.removeClass("none");
            H.talk.$total.text("在线人数：  " + data.c);
        }
    };
    //天天淘金的广告链接
    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0) {
            jumpUrl = data.url;
            $(".outer").attr("href", jumpUrl).html(data.desc).removeClass("none");
        } else {
            $(".outer").addClass("none");
        }
    };
})(Zepto);

$(function() {
	shownewLoading();
    H.talk.init();
});
