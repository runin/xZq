(function($) {
    H.lottery = {
        first: true,
        type: 2,
        index: 0,
        times: 0,
        endType: 1,
        pal: null,
        nowTime: null,
        roundData: null,
        nextPrizeAct: null,
        canJump: true,
        wxCheck: false,
        isError: false,
        lastRound: false,
        isToLottey: true,
        isCanShake: false,
        isTimeOver: false,
        repeat_load: true,
        recordFirstload: true,
        crossLotteryCanCallback: false,
        lotteryImgList: [],
        lotteryTime: 1,
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        PVTime: Math.ceil(20000*Math.random() + 10000),
        rp: getQueryString("rp"),
        init: function(){
            var me = this;
            me.tttj();
            me.current_time();
            me.event();
            me.shake();
            me.account_num();
            setInterval(function(){
                me.account_num();
            }, 10e3);
            if(me.rp){
                setTimeout(function(){
                    showTips("领取成功");
                },1e3);
            }
        },
        //查询当前参与人数
        account_num: function(){
            getResult('api/common/servicepv', {}, 'commonApiSPVHander');
        },
        event: function() {
            var me = this;
            $('#test').click(function(e) {
                e.preventDefault();
                me.wxCheck = true;
                me.lotteryTime = 1;
                me.shake_listener();
            });
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'mp/jsapiticket' + dev,
                data: {appId: shaketv_appid},
                dataType : "jsonp",
                jsonpCallback : 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        var url = window.location.href.split('#')[0];
                        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
                        var timestamp = Math.round(new Date().getTime()/1000);
                        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
                        //权限校验
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr:nonceStr,
                            signature:signature,
                            jsApiList: [
                                "addCard",
                                "checkJsApi"
                            ]
                        });
                    }

                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        //查抽奖活动接口
        current_time: function(){
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 5e3,
                complete: function() {
                },
                success : function(data) {
                    if(!data.result || data.flow == 1){
                        if(H.lottery.repeat_load){
                            H.lottery.repeat_load = false;
                            setTimeout(function(){
                                H.lottery.current_time();
                            },500);
                        }else{
                            // 未配置，结束页
                            H.common.showOver();
                        }
                    }else{
                        H.lottery.nowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        H.common.dec = nowTimeStemp - data.sctm;
                        H.lottery.roundData = data;
                        H.lottery.currentPrizeAct(data);
                    }
                },
                error : function(xmlHttpRequest, error) {
                    if(H.lottery.repeat_load) {
                        H.lottery.repeat_load = false;
                        setTimeout(function(){
                            H.lottery.current_time();
                        },2000);
                    }else{
                        // toUrl("lottery.html");
                        H.common.showLottery();
                        H.lottery.isCanShake = true;
                        $('.yao-text').removeClass('none');
                        setTimeout(function(){
                            toUrl('main.html');
                        }, 90e3);
                    }
                }
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this, nowTimeStr = this.nowTime, prizeActList = data.la, prizeLength = 0;
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            //config微信jssdk
            me.wxConfig();
            if(prizeActList.length > 0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.type = 3;
                    me.endType = 3;
                    // 最后一轮摇奖结束，结束页
                    H.common.showOver();
                    return;
                }
                
                // 开始定时刷新dec
                setInterval(function(){
                    H.common.ping();
                }, 28e3);

                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        H.common.isLottery = true;
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
                        // me.initCount();
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            }else{
                // 未配置，结束页
                H.common.showOver();
            }
        },
        initCount:function(){
            var recordDelay = Math.ceil(5000*Math.random() + 10000);
            H.lottery.red_record();
            setInterval(function(){
                H.lottery.red_record();
            }, recordDelay);
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            _nextLotID = prizeActList.ud || 'error';
            H.common.showVote();
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.common.dec;
            $('.lottery-countdown').attr('etime',beginTimeLong).empty();
            $(".lottery-tip").html('距离摇奖开始');
            me.count_down();
            $(".lottery-countdown").removeClass("none");
            $('.lottery-cd').removeClass('none');
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            delData("box");
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.common.dec;
            $('.lottery-countdown').attr('etime',beginTimeLong).empty();
            $(".lottery-tip").html("距离摇奖结束");
            me.count_down();
            $(".lottery-countdown").removeClass("none");
            $('.lottery-cd').removeClass('none');
            me.index++;
            me.canJump = true;
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            H.common.showLottery();
            hidenewLoading();
            H.comment.init();
        },
        count_down: function() {
            var me = this;
            $('.lottery-countdown').each(function() {
                $(this).countDown({
                    etpl: '%M%' + ':' + '%S%' + '.' + '%ms%', // 还有...结束
                    stpl: '%M%' + ':' + '%S%' + '.' + '%ms%', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.canJump){
                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                if(!me.isTimeOver){
                                    me.isTimeOver = true;
                                    // me.nowCountdown(me.pal[me.index]);

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
                                        $(".lottery-countdown").addClass("none");
                                        me.type = 3;
                                        // 最后一轮摇奖结束，结束页
                                        H.common.isLottery = false;
                                        H.common.showOver();
                                        return;
                                    }
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
                                    // if(me.endType == 2){
                                    //     me.nowCountdown(me.pal[me.index]);
                                    // }else if(me.endType == 1){
                                    //     me.beforeCountdown(me.pal[me.index]);
                                    // }
                                    setTimeout(function(){
                                        if(me.endType == 2){
                                            me.nowCountdown(me.pal[me.index]);
                                        }else if(me.endType == 1){
                                            me.beforeCountdown(me.pal[me.index]);
                                        }
                                    },1000);
                                }
                            }else{
                                me.isCanShake = false;
                            }
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        downloadImg: function(){
            var me = this, t = simpleTpl();
            if($(".preImg")){
                $(".preImg").remove();
            }
            for(var i = 0;i < me.lotteryImgList.length;i++){
                t._('<img class="preload preImg" src="'+me.lotteryImgList[i]+'">')
            }
            $("body").append(t.toString());
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        shake_listener: function() {
            if ($('.modal').length > 0) return;
            if(H.lottery.isCanShake){
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
            }else{
                return;
            }
            if (H.lottery.type != 2) {
                return;
            }
            H.lottery.times++;
            if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                H.lottery.isToLottey = false;
            }
            if(!$(".home-box").hasClass("yao")) {
                $("#audio-a").get(0).play();
                $(".m-t-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate3d(0,-16.5vh,0)'
                });
                $(".m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate3d(0,16.5vh,0)'
                });
                setTimeout(function(){
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
            recordUserOperate(openid, "摇奖", "shakeLottery");
            if(!openid || openid=='null' || H.lottery.isToLottey == false) {
                setTimeout(function(){
                    H.lottery.fill(null);//摇一摇
                }, 1000);
            } else {
                shownewLoading(null, '抽奖中，请稍后...');
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        drawlottery:function(){
            var me = this;
            var sn = new Date().getTime()+'';
            shownewLoading();
            me.lotteryTime = 1;
            me.times = 0;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck' + dev,
                data: { matk: matk , sn : sn},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        me.lotteryTime = getRandomArbitrary(3,6);
                        me.times = 0;
                        sn = new Date().getTime()+'';
                        H.lottery.lottery_point(null);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime()+'';
                            H.lottery.lottery_point(data);
                        }
                    }else{
                        sn = new Date().getTime()+'';
                        H.lottery.lottery_point(null);
                    }
                },
                error : function() {
                    sn = new Date().getTime()+'';
                    H.lottery.lottery_point(null);
                }
            });
        },
        fill : function(data){
            var me = this;
            hidenewLoading();
            setTimeout(function() {
                $(".home-box").removeClass("yao");
                H.lottery.imgMath();
            },300);
            if(data == null || data.result == false || data.pt == 0){
                // H.dialog.thanksLottery.open();
                me.thanks();
                return;
            }else{
                $("#audio-b").get(0).play();//中奖声音
            }

            if(data.pt == 7){
                //卡券
                H.dialog.wxcardLottery.open(data);
            }else if(data.pt == 9){
                //外链
                H.dialog.linkLottery.open(data);
            }else if(data.pt == 1){
                //实物奖
                H.dialog.shiwuLottery.open(data);
            } else {
                me.thanks();
            }
        },
        lottery_point : function(data){
            setTimeout(function(){
                H.lottery.fill(data);
            },1000);
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
            $('.home-box .thanks-tips').html(tips).addClass('show');
            setTimeout(function(){
                $('.home-box .thanks-tips').removeClass('show');
            }, 1300);
        },
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        imgMath: function() {//随机背景
            var me = this;
            if(me.lotteryImgList.length >0){
                var i = Math.floor((Math.random()*me.lotteryImgList.length));
                $("#lottery").css("background","url('" + me.lotteryImgList[i] + "') no-repeat center center");
                $("#lottery").css("background-size","100% auto");
            }
        },
        scroll: function(options) {
            $('.marquee').each(function(i) {
                var me = this, com = [], delay = 1000;
                var len = $(me).find('li').length;
                var $ul = $(me).find('ul');
                if (len == 0) {
                    $(me).addClass('none');
                } else {
                    $(me).removeClass('none');
                }
                if(len > 1) {
                    com[i] = setInterval(function() {
                        $(me).find('ul').animate({'margin-top': '-28px'}, delay, function() {
                            $(me).find('ul li:first').appendTo($ul)
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                };
            });
        },
        tttj: function() {
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };

    W.commonApiSPVHander = function(data){
        if(data.code == 0) $('.pv').removeClass('knone').find('label').html(data.c);
    };

    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0 && data.url) $('.tttj').removeClass('none').attr('data-url', data.url || '').html('<img src="' + data.desc + '">');
    };
})(Zepto);