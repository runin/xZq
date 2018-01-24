/**
 * 老三热线--摇奖页
 */
(function($) {
    H.yao = {
        $home_box: $(".home-box"),
        $audio_a: $("#audio-a"),
        $textb: $(".textb"),
        $new: $("#new"),
        $hand: $(".hand"),
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
        PVTime: Math.ceil(2000*Math.random() + 3000),
        allRecordTime: Math.ceil(4000*Math.random() + 1000),
        first: true,
        canJump: true,
        isTimeOver: false,
        init: function(){
            var me = this;
            me.event();
            me.current_time();
            me.shake();
            me.jump();
            me.refreshDec();
            me.get_gg();
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
        get_gg: function(){
            getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler', true);
        },
        event: function(){
            var me = H.yao;
            $("#test").click(function(e){
                e.preventDefault();
                me.wxCheck = true;
                me.lotteryTime = 1;
                me.shake_listener();
            });
            $('.back-btn').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('index.html');
            });
            me.$new.click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                if(!$(this).hasClass('disabled')){
                    toUrl('answer.html');
                }
            });
            $('.record').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('jfbk.html');
            });
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
                }, 720);
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
        jump: function(){
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        //查询当前参与人数
        account_num: function(){
            getResult('api/common/servicepv', {}, 'commonApiSPVHander');
        },
        initCount:function(){
            var me = H.yao;
            setInterval(function(){
                me.account_num();
            },me.PVTime);
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
                    me.$new.addClass('disabled');
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
                        if(prizeActList[i].bi.length>0){
                            me.yaoBg = prizeActList[i].bi.split(",");
                        }
                        me.initCount();
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
            me.$new.removeClass('disabled');
            me.countdown_domShow(beginTimeStr,"距摇奖开启还有");
            me.$hand.removeClass('start');
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            var me = H.yao,
                endTimeStr = pra.pd+" "+pra.et;

            me.type = 2;
            me.$new.addClass('disabled');
            me.$hand.addClass('start');
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
            me.$new.addClass("disabled");
            me.$hand.removeClass('start');
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
                url : domain_url + 'api/lottery/exec/luck' + dev,
                data: {
                    matk: matk,
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
            setTimeout(function(){
                H.yao.fill(data);
            }, 1500);
        },
        not_winning: function(data){
            var me = H.yao;
            me.isCanShake = true;
            me.$audio_a.get(0).pause();
            //$("#audio-c").get(0).play();//不中奖声音
            //H.dialog.thanks.open(data);
            me.textMath();
            //me.$textb.removeClass("visibility");
            me.$textb.addClass("yaonone-text").removeClass("visibility");
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
                        case 2://积分奖品
                            meDialog.jfLottery.open(data);
                            break;
                        case 7://卡劵奖品
                            meDialog.kjLottery.open(data);
                            break;
                        case 9://外链奖品
                            meDialog.wlLottery.open(data);
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
    W.commonApiSPVHander = function(data){
        if(data.code == 0){
            $(".count label").html(data.c);
            $(".count").removeClass("none");
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            var t = simpleTpl(), gitems = data.gitems || [];
            $.each(gitems, function(g,gitem){
                t._('<div><img src="'+ gitem.ib +'"></div>');
            });
            $(".zz-img").append(t.toString());
            $(".zan-zhu").removeClass("none");
        }
    }
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
