/**
 * 直播广州五周年
 */
(function($){
    H.index = {
        nowTime: null,
        dec: 0,//服务器时间与本地时间的差值
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        wxCheck: false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isCanShake: false,
        type: 2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        lotteryTime: getRandomArbitrary(1,3),
        isToLottey: true,
        times: 0,
        index: 0, // 当前抽奖活动在 list 中的下标
        init: function(){
            //this.pre_dom();
            this.event();
            this.current_time();
            this.refreshDec();
            this.jump();
        },
        jump: function(){
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
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
                            H.index.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
        pre_dom: function(){
            var wWidth = $(window).width(),
                wHeight = $(window).height();

            if(900 < window.screen.height  && window.screen.width > 900){
                $(".redbao").css({
                    "margin-top": (wHeight - 384*0.80)/2 + "px"
                });
            }else if(650 < window.screen.height  && window.screen.height < 750){
                $(".redbao").css({
                    "margin-top": (wHeight - 384*0.85)/2 -10 + "px"
                });
            }else if(568 == window.screen.height  && window.screen.width == 320){
                $(".redbao").css({
                    "margin-top": (wHeight - 384*0.80)/2 + 10 + "px"
                });
            }else if(480 == window.screen.height  && window.screen.width == 320){
                $(".redbao").css({
                    "margin-top": (wHeight - 384*0.60)/2 + "px"
                });
            }else{
                $(".redbao").css({
                    "margin-top": (wHeight - 384*0.85)/2 + "px"
                });
            }
        },
        shake_listener: function() {
            var me = H.index;
            if(me.isCanShake){
                me.isCanShake = false;
            }else{
                return;
            }

            if(me.type != 2){
                return;
            }

            me.times++;
            if(!(me.times % me.lotteryTime == 0)){
                me.isToLottey = false;
            }

            recordUserOperate(openid, "抽奖", "shakeLottery");
            recordUserPage(openid, "抽奖", 0);

            if(!openid || openid=='null' || me.isToLottey == false){
                setTimeout(function(){
                    me.fill(null);//摇一摇
                }, 1500);
            }else{
                /*if(!me.wxCheck){
                    //微信config失败
                    setTimeout(function(){
                        me.fill(null);//摇一摇
                    }, 2000);
                    return;
                }*/
                me.drawlottery();
            }
            me.isToLottey = true;
        },

        drawlottery:function(){
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            var me = H.index;
            var sn = new Date().getTime()+'';
            me.lotteryTime = getRandomArbitrary(1,3);
            me.times = 0;
            shownewLoading();
            me.isCanShake = false;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck' + dev,
                data: {
                    oi: openid,
                    sn : sn
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                    sn = new Date().getTime()+'';
                    me.isCanShake = true;
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        me.lotteryTime = getRandomArbitrary(3,6);
                        me.times = 0;
                        sn = new Date().getTime()+'';
                        me.lottery_point(null);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            me.fill(data);
                        }else{
                            me.fill(null);
                        }
                    }else{
                        me.fill(null);
                    }
                },
                error : function() {
                    me.fill(null);
                }
            });
        },
        fill : function(data){
            var me = H.index;
            if(data == null || data.result == false || data.pt == 0){
                me.not_winning();
                return;
            }
            me.lottery_open(data);
        },
        not_winning: function(data){
            showTips("大奖与您擦肩而过~~~");
            setTimeout(function(){
                H.index.isCanShake = true;
            },1200);
        },
        lottery_open: function(data){
            var me = H.index,
                meDialog = H.dialog;
            if(data){
                if(data.result == true){
                    switch (data.pt){
                        case 0://谢谢参与
                            me.not_winning();
                            break;
                        case 1://实物奖品
                            meDialog.swLottery.open(data);
                            break;
                        /*case 2://积分奖品
                            meDialog.jfLottery.open(data);
                            break;*/
                        case 4://红包奖品
                            meDialog.redLottery.open(data);
                            break;
                        case 7://卡劵奖品
                            meDialog.kjLottery.open(data);
                            break;
                        /*case 9://外链奖品
                            meDialog.wlLottery.open(data);
                            break;
                        default:
                         meDialog.lottery.open(data);*/
                    }
                }
            }
        },
        event: function(){
            var me = this;
            $(".go").click(function(e){
                e.preventDefault();
                me.shake_listener();
            });
        },
        //查抽奖活动接口
        current_time: function(){
            var me = H.index;
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.result == true){
                        me.nowTime = timeTransform(data.sctm);
                        var nowTime = new Date().getTime();
                        var serverTime = data.sctm;
                        me.dec = nowTime - serverTime;
                        console.log("me.nowTime="+me.nowTime);
                        console.log("serverTime="+timeTransform(serverTime));
                        me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.current_time();
                            },500);
                        }else{
                            me.wxCheck = false;
                            me.isToLottey = false;
                            me.isCanShake = true;
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    me.wxCheck = false;
                    me.isToLottey = false;
                    me.isCanShake = true;
                }
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.index.nowTime,
                $tips = $(".time-tips"),
                prizeActList = [],
                me = H.index;
            var day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.type = 3;
                    me.change();
                    return;
                }
                //如果第一轮未开始
                if(comptime(prizeActList[0].pd+" "+prizeActList[0].st,nowTimeStr) < 0){
                    me.beforeShowCountdown(prizeActList[0]);
                    return;
                }
                //config微信jssdk
                me.wxConfig();
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        /*if(prizeActList[i].bi.length>0){
                            me.yaoBg = prizeActList[i].bi.split(",");
                        }
                        me.initCount();*/
                        me.nowCountdown(prizeActList[i]);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.beforeShowCountdown(prizeActList[i]);
                        return;
                    }
                }
            }else{
                me.change();
                return;
            }
        },
        // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            var me = H.index,
                beginTimeStr = pra.pd+" "+pra.st;
            me.type = 1;
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            me.countdown_domShow(beginTimeStr,"距摇奖开启还有");
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            var me = H.index,
                endTimeStr = pra.pd+" "+pra.et;

            me.type = 2;
            me.countdown_domShow(endTimeStr,"距摇奖结束还有");
            me.index ++;
            me.isCanShake = true;
        },
        countdown_domShow: function(time, word){
            var me = H.index,
                timeLong = timestamp(time);
            timeLong += me.dec;
            $('.detail-countdown').attr('etime',timeLong);
            $(".countdown-tip").html(word);
            me.count_down();
            $('.items-count').removeClass('none');
            $('.loading').addClass('none');
            //$(".countdown").removeClass("none");
            me.isTimeOver = false;
        },
        // 倒计时
        count_down : function() {
            $('.detail-countdown').each(function() {
                var me = H.index;
                $(this).countDown({
                    etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
                    stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true
                        var $loading = $(".loading"),
                            $items_count = $('.items-count');

                        if(!me.isTimeOver){
                            me.isTimeOver = true;
                            $items_count.addClass('none');
                            $loading.removeClass('none');
                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                me.nowCountdown(me.pal[me.index]);
                            }else if(me.type == 2){
                                me.isCanShake = false;
                                //距摇奖结束倒计时结束后显示距离下轮摇奖开始倒计时
                                if(me.index >= me.pal.length){
                                    me.change();
                                    me.type = 3;
                                    return;
                                }
                                me.beforeShowCountdown(me.pal[me.index]);
                            }
                        }
                    },
                    sdCallback :function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        change: function(){
            var me = H.index;
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            //$(".countdown").removeClass("none").html('本期摇奖已结束!');
            $(".deatil").removeClass("tada");
            $(".end").removeClass("none").html('本期抽奖已结束!');
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'mp/jsapiticket',
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
        }
    }

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('.ddtj').text(data.desc || '');
            $("#ddtj").click(function(){
                showLoading();
                location.href = data.url;
            });
            $('#ddtj').removeClass("none");
        } else {
            $('#ddtj').remove();
        }
    };
})(Zepto);
$(function(){
   H.index.init();
    var me = H.index;
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !me.isError){
                    me.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res){
        me.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});