/**
 * 老三热线--摇奖页
 */
(function($) {
    H.yao = {
        $home_box: $(".home-box"),
        $audio_a: $("#audio-a"),
        $textb: $(".textb"),
        nowTime: null,
        isCanShake: false,
        times: 0,
        isToLottey: true,
        lotteryTime: getRandomArbitrary(1,3),
        yaoBg: [],
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        index: 0, // 当前抽奖活动在 list 中的下标
        pal: [],// 抽奖活动list
        dec: 0,//服务器时间与本地时间的差值
        type: 2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        wxCheck: false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isError: false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        allRecordTime: Math.ceil(4000*Math.random() + 1000),
        PVTime: Math.ceil(20000*Math.random() + 10000),
        first: true,
        canJump: true,
        isTimeOver: false,
        init: function(){
            var me = this;
            me.event();
            me.current_time();
            me.shake();
            me.refreshDec();
            me.jump();
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
                            H.yao.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
        event: function(){
            var me = H.yao;
            $("#test").click(function(e){
                e.preventDefault();
                me.shake_listener();
            });
            $(".back").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("index.html?yao=yao");
            });
        },
        jump: function(){
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        //查询当前参与人数
        account_num: function(){
            getResult('api/common/servicepv', {}, 'commonApiSPVHander');
        },
        initCount:function(){
            // 可以抽奖的时候再去调用 pv 剩余红包数  中奖纪录接口
            setTimeout(function(){
                H.yao.account_num();
            },this.PVTime);
        },
        shake: function() {
            W.addEventListener('shake', H.yao.shake_listener, false);
        },
        imgMath: function() {//随机背景
            var me = H.yao;
            if(me.yaoBg.length >0){
                var i = Math.floor((Math.random()*me.yaoBg.length));
                $("body").css("backgroundImage","url('"+me.yaoBg[i]+"')");
            }
        },
        textMath: function() {//随机文案
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));
                H.yao.$textb.text(textList[i]);
            }
        },
        shake_listener: function() {
            var me = H.yao;
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
            if(!me.$home_box.hasClass("yao")) {
                me.$audio_a.get(0).play();
                me.canJump = false;
                me.imgMath();
                me.$textb.removeClass("yaonone-text").addClass("visibility");
                $(".m-t-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,-100px)'
                });
                $(".m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,100px)'
                });
                setTimeout(function(){
                    me.canJump = true;
                    $(".m-t-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                    $(".m-f-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                }, 1200);
                me.$home_box.addClass("yao");
            }

            recordUserOperate(openid, "摇奖", "shakeLottery");
            recordUserPage(openid, "摇奖", 0);

            if(!openid || openid=='null' || me.isToLottey == false){
                setTimeout(function(){
                    me.fill(null);//摇一摇
                }, 1500);
            }else{
                if(!me.wxCheck){
                    //微信config失败
                    setTimeout(function(){
                        me.fill(null);//摇一摇
                    }, 2000);
                    return;
                }
                setTimeout(function(){
                    me.drawlottery();
                }, 1500);
            }
            me.isToLottey = true;
        },
        //查抽奖活动接口
        current_time: function(){
            var me = H.yao;
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
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    me.wxCheck = false;
                    me.isToLottey = false;
                }
            });
        },
        downloadImg: function(){
            var t = simpleTpl(),me = H.yao;
            for(var i = 0;i < me.yaoBg.length;i++){
                t._('<img src="'+me.yaoBg[i]+'" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.yao.nowTime,
                $tips = $(".time-tips"),
                prizeActList = [],
                me = H.yao;
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
                //如果第一轮结束
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
                        me.initCount();
                        if(prizeActList[i].bi.length>0){
                            me.yaoBg = prizeActList[i].bi.split(",");
                        }
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
            var me = H.yao,
                beginTimeStr = pra.pd+" "+pra.st;
            me.type = 1;
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            me.countdown_domShow(beginTimeStr,"距摇奖开启还有");
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            var me = H.yao,
                endTimeStr = pra.pd+" "+pra.et;

            me.type = 2;
            me.countdown_domShow(endTimeStr,"距摇奖结束还有");
            me.index ++;
            me.isCanShake = true;
        },
        countdown_domShow: function(time, word){
            var me = H.yao,
            timeLong = timestamp(time);
            timeLong += me.dec;
            $('.detail-countdown').attr('etime',timeLong);
            $(".countdown-tip").html(word);
            me.count_down();
            $('.items-count').removeClass('none');
            $('.loading').addClass('none');
            $(".countdown").removeClass("none");
            me.isTimeOver = false;
        },
        // 倒计时
        count_down : function() {
            $('.detail-countdown').each(function() {
                var me = H.yao;
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
                        if(me.canJump){

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
                        }else{
                            $items_count.addClass('none');
                            $loading.removeClass('none');
                        }
                    },
                    sdCallback :function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        change: function(){
            var me = H.yao;
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            $(".countdown").removeClass("none").html('本期摇奖已结束，请等待下期!');
            me.$textb.addClass("visibility");
        },
        drawlottery:function(){
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            var me = H.yao;
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
                            me.lottery_point(data);
                        }else{
                            me.lottery_point(null);
                        }
                    }else{
                        me.lottery_point(null);
                    }
                },
                error : function() {
                    me.lottery_point(null);
                }
            });
        },
        fill : function(data){
            var me = H.yao;
            setTimeout(function() {
                me.$home_box.removeClass("yao");
            },300);
            if(data == null || data.result == false || data.pt == 0){
                me.not_winning(data);
                return;
            }else{
                me.$audio_a.get(0).pause();
                $("#audio-b").get(0).play();//中奖声音
            }
            me.lottery_open(data);
        },
        lottery_point : function(data){
            H.yao.fill(data);
        },
        not_winning: function(data){
            var me = H.yao;
            //me.isCanShake = true;
            me.$audio_a.get(0).pause();
            //$("#audio-c").get(0).play();//不中奖声音
            H.dialog.thanks.open(data);
            //me.textMath();
            //me.$textb.removeClass("visibility");
            //me.$textb.addClass("yaonone-text").removeClass("visibility");
        },
        lottery_open: function(data){
            var me = H.yao,
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
                        case 4://现金红包
                            meDialog.redLottery.open(data);
                            break;
                        case 7://外链奖品
                            meDialog.kjLottery.open(data);
                            break;
                        /*default:
                            meDialog.lottery.open(data);*/
                    }
                }
            }
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
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
    };

    W.commonApiSPVHander = function(data){
        if(data.code == 0){
            $(".count label").html(data.c);
            $(".count").removeClass("hidden");
            setInterval(function(){
                var pv = getRandomArbitrary(33,99);
                pv = $(".count label").html()*1+pv;
                $(".count label").html(pv);
            },3000);
        }
    };

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('.ddtj').text(data.desc || '');
            $("#ddtj").click(function(){
                showLoading();
                location.href = data.url;
            });
            $('#ddtj').removeClass("visibility");
        } else {
            $('#ddtj').remove();
        }
    };
})(Zepto);

$(function() {
    H.yao.init();
    var me = H.yao;
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
