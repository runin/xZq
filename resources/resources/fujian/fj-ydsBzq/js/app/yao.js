(function($) {
    H.yao = {
        $home_box: $(".home-box"),
        $audio_a: $("#audio-a"),
        $textb: $(".textb"),
        $outer: $(".outer"),
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
        },
        refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
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
            $('.back-btn').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('index.html');
            });
            $('.record').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('record.html?type=yao');
            });
        },
        shake: function() {
            W.addEventListener('shake', H.yao.shake_listener, false);
        },
        rate: function() {
            var random = parseInt(Math.random() * 100) + 1,
                type = 0;
            switch (true){
                case (0 < random) && (random <= 10):
                    type = 10;
                    break;
                case (11 < random) && (random <= 40):
                    type = 30;
                    break;
                default:
                    type = 60;
            }
            return type;
        },
        imgMath: function() {//随机背景
            var me = H.yao;
            /*if(me.yaoBg.length >0){
                var i = Math.floor((Math.random()*me.yaoBg.length));
                $("body").css("backgroundImage","url('"+me.yaoBg[i]+"')");
            }*/
            var flag = me.rate(),
                src = '';
            switch (flag){
                case 10:
                    src = "images/default/kb-kh.jpg";
                    break;
                case 30:
                    src = "images/default/dd-kh.jpg";
                    break;
                default:
                    src = "images/default/zf-kh.jpg";
            }
            $("body").css("backgroundImage","url('"+src+"')");
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
                me.canJump = true;
                me.imgMath();
                $(".m-t-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,-100px)'
                });
                $(".m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,100px)'
                });
                setTimeout(function(){
                    me.canJump = false;
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

            recordUserOperate(openid, "摇电视博中秋", "fj-ydsBzq");
            recordUserPage(openid, "摇电视博中秋", 0);

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
                url : domain_url + 'api/lottery/round',
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
                            toUrl('ad.html');
                            me.wxCheck = false;
                            me.isToLottey = false;
                            me.isCanShake = true;
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    toUrl('ad.html');
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
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        initCount:function(){
            var me = H.yao;
            setInterval(function(){
                me.account_num();
            },me.PVTime);
            setInterval(function(){
                me.red_record();
            },me.allRecordTime);
        },
        scroll: function(options) {
            $('.marquee').each(function(i) {
                var me = this, com = [], delay = 1000;
                var len  = $(me).find('li').length;
                var $ul = $(me).find('ul');
                if (len == 0) {
                    $(me).addClass('hidden');
                } else {
                    $(me).removeClass('hidden');
                }
                if(len > 1) {
                    com[i] = setInterval(function() {
                        $(me).find('ul').animate({'margin-top': '-20px'}, delay, function() {
                            $(me).find('ul li:first-child').appendTo($ul);
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
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
                //config微信jssdk
                //me.wxConfig();
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
            toUrl('ad.html');
            me.type = 1;
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            //me.countdown_domShow(beginTimeStr,"距摇奖开启还有");
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
            toUrl('ad.html');
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            //$(".countdown").removeClass("none").html('本期摇奖已结束，请等待下期!');
        },
        drawlottery:function(){
            var me = H.yao;
            var sn = new Date().getTime()+'';
            me.lotteryTime = getRandomArbitrary(1,5);
            me.times = 0;
            shownewLoading();
            me.isCanShake = false;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: {
                    oi: openid,
                    sn : sn,
                    sau: H.dialog.uid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                    sn = new Date().getTime()+'';
                },
                success : function(data) {
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
            me.$audio_a.get(0).pause();
            //$("#audio-c").get(0).play();//不中奖声音
            H.dialog.thanks.open(data);
        },
        lottery_open: function(data){
            var me = H.yao;
            if(data){
                if(data.result == true){
                    switch (data.pt){
                        case 0:
                            me.not_winning();
                            break;
                        default:
                            H.dialog.lottery.open(data);
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
        var me = H.yao;
        if(data.code == 0){
            if(data.url && data.desc){
                me.$outer.text(data.desc).attr('href', data.url).removeClass('none');
            }
        }
    };
    W.commonApiSPVHander = function(data){
        if(data.code == 0){
            $(".count label").html(data.c);
            $(".count").removeClass("none");
        }
    };
    W.callbackLotteryAllRecordHandler = function(data){
        var me = H.yao;
        if(data.result){
            var list = data.rl;
            if(list && list.length>0){
                var con = "";
                for(var i = 0 ; i<list.length; i++){
                    con +='<li>'+(list[i].ni || "匿名用户")+'中了'+list[i].pn+'</li>';
                }
                var len = $(".marquee").find("li").length;
                if(len >= 500){
                    $(".marquee").find("ul").html(con);
                }else{
                    $(".marquee").find("ul").append(con);
                }
                if(me.first){
                    me.first = false;
                    me.scroll();
                }
                $(".marquee").removeClass("none");
            }
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
