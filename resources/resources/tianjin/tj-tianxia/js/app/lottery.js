/**
 * 新闻早动员-抽奖
 */
(function($) {
    H.lottery = {
        isLottery :false,
        nowTime :null,
        isCanShake:true,
        times:0,
        isToLottey:true,
        isTimeOver: false,
        first: true,
        lotteryTime:getRandomArbitrary(1,5),
        yaoBg:[],
        canJump:true,
        allRecordTime: Math.ceil(4000*Math.random() + 10000),
        PVTime: Math.ceil(7000*Math.random() + 8000),
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        type:2, //判断倒计时形式 1为节目开始之前，2为节目正在播出 默认为2 ,3为今日抽奖已结束
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        dec:0,
        index:0,
        repeatCheck:true,
        pal:null,
        init : function(){
            this.event();
            this.current_time();
            this.shake();
            this.refreshDec();
        },
        event: function() {
            $("#test").click(function(e){
                H.lottery.shake_listener();
            });
            $('#back-btn').click(function(){
                $(this).addClass("pulse");
                setTimeout(function(){
                    toUrl("index.html");
                },1000);
            });
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        scroll: function(options) {
            $('.marquee').each(function(i) {
                var me = this, com = [], delay = 1000;
                var len  = $(me).find('li').length;
                var $ul = $(me).find('ul');
                if (len == 0) {
                    $(me).addClass('none');
                } else {
                    $(me).removeClass('none');
                }
                if(len > 1) {
                    com[i] = setInterval(function() {
                        $(me).find('ul').animate({'margin-top': '-20px'}, delay, function() {
                            $(me).find('ul li:first').appendTo($ul)
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                };
            });
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
                            var nowTime = Date.parse(new Date());
                            H.lottery.dec = (nowTime - data.t);
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
        //查抽奖活动接口
        current_time: function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round',
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.result == true){
                        H.lottery.nowTime = timeTransform(data.sctm);
                        var nowTime = Date.parse(new Date());
                        H.lottery.dec = (nowTime - data.sctm);
                        H.lottery.currentPrizeAct(data);
                    }else{
                        H.lottery.change();
                    }
                },
                error : function(xmlHttpRequest, error) {
                    H.lottery.change();
                }
            });
        },
        imgMath: function() {//随机背景
            if(H.lottery.yaoBg.length >0){
                var i = Math.floor((Math.random()*H.lottery.yaoBg.length));;
                $("body").css("backgroundImage","url('"+H.lottery.yaoBg[i]+"')");
            }
        },
        shake_listener: function() {
            if(H.lottery.isCanShake){
                H.lottery.isCanShake = false;
            }else{
                return;
            }
            if(H.lottery.type != 2){
                return;
            }
            H.lottery.times++;

            if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                H.lottery.isToLottey = false;
            }
            if(!$(".home-box").hasClass("yao")) {
                // $(".swiper-slide4 .m-f-b").css('-webkit-animation', 'mfoot 2s 1 ease');
                // $(".swiper-slide4 .m-t-b").css('-webkit-animation', 'mtop 2s 1 ease');
                $("#audio-a").get(0).play();
                $(".yao-cool-tips").removeClass("yaonone-text");
                $(".home-box .m-t-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,-100px)'
                });
                $(".home-box .m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,100px)'
                });
                setTimeout(function(){
                    $(".home-box .m-t-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .7s ease'
                    });
                    $(".home-box .m-f-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .7s ease'
                    });
                }, 1200);
                $(".home-box").addClass("yao");
            }
            if(!openid || openid=='null' || H.lottery.isToLottey == false){
                setTimeout(function(){
                    H.lottery.fill(null);//摇一摇
                }, 2000);
            }else{
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        //查询当前参与人数
        account_num: function(){
            getResult('api/common/servicepv', {}, 'commonApiSPVHander');
        },
        //查询最新20条中奖记录
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        //查询业务当前抽奖活动有限制奖品剩余数量
        leftPrizeCount:function(){
            getResult('api/lottery/leftDayCountLimitPrize',{},'callbackLeftDayCountLimitPrizeHandler');
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.lottery.nowTime,
                prizeActList = [],
                me = this;
            var day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            H.lottery.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    H.lottery.type = 3;
                    H.lottery.change();
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        H.lottery.index = i;
                        H.lottery.nowCountdown(prizeActList[i]);
                        hidenewLoading();
                        // 可以抽奖的时候再去调用 pv 中奖纪录接口
                        setTimeout(function(){
                            H.lottery.account_num();
                            setInterval(function(){
                                H.lottery.account_num();
                            },10000);
                        },this.PVTime);
                        setInterval(function(){
                            H.lottery.red_record();
                        },this.allRecordTime);
                        return;
                    }
                    // 据下次摇奖开始
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.lottery.index = i;
                        H.lottery.beforeShowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                }
            }else{
                H.lottery.change();
                return;
            }
        },
        // 距下次摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            H.lottery.type = 1;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.lottery.dec;
            $(".countdown-tip").html('距下轮摇奖开启还有 ');
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.lottery.count_down();
            $('.countdown').removeClass('none');
            H.lottery.repeatCheck = true;
        },
        // 距本轮摇奖结束倒计时
        nowCountdown: function(pra){
            H.lottery.type = 2;
            H.lottery.isCanShake = true;
            if(pra.bi.length>0){
                H.lottery.yaoBg = pra.bi.split(",");
            }
            H.lottery.downloadImg();
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.lottery.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            $(".countdown-tip").html("距本轮摇奖结束还有");
            H.lottery.count_down();
            $(".countdown").removeClass("none");
            H.lottery.index ++;
            H.lottery.repeatCheck = true;
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + ':' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl : '%H%' + ':' + '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.lottery.repeatCheck){
                            H.lottery.repeatCheck = false;
                            if(H.lottery.type == 1){
                                //距下次摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                H.lottery.nowCountdown(H.lottery.pal[H.lottery.index]);
                            }else if(H.lottery.type == 2){
                                //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
                                if(H.lottery.index >= H.lottery.pal.length){
                                    // 如果已经是最后一轮摇奖倒计时结束 则显示 今日摇奖结束
                                    H.lottery.change();
                                    H.lottery.type = 3;
                                    return;
                                }
                                H.lottery.beforeShowCountdown(H.lottery.pal[H.lottery.index]);
                            }
                        }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        change: function(){
            hidenewLoading();
            H.lottery.isCanShake = false;
            H.lottery.type = 3;
            $(".countdown").html("今日摇奖结束");
            $(".countdown").removeClass("none");
        },
        downloadImg: function(){
            $(".preImg").remove();
            var t = simpleTpl();
            for(var i = 0;i < H.lottery.yaoBg.length;i++){
                t._('<img class="preImg" src="'+H.lottery.yaoBg[i]+'" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
        },
        drawlottery:function(){
            var me = this;
            var sn = new Date().getTime()+'';
            shownewLoading();
            me.lotteryTime = getRandomArbitrary(1,5);
            me.times = 0;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: { oi: openid , sn : sn},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
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
        textMath: function() {
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));;
                $(".yao-cool-tips span").text(textList[i]);
            }
        },
        fill : function(data){
            setTimeout(function() {
                $(".home-box").removeClass("yao");
                H.lottery.imgMath();
            },300);
            if(data == null || data.result == false || data.pt == 0){
                $("#audio-a").get(0).pause();
                H.dialog.thanks.open();
                return;
            }else{
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();//中奖声音
            }

            if(data.pt == 5){
                //兑换码
                H.dialog.lottery.open(data);
            }

        },
        thanks:function(){
            $(".yao-text-default").addClass("none");
            H.lottery.textMath();
            $(".yao-cool-tips").removeClass("none");
            $(".yao-cool-tips").addClass("yaonone-text").show();
            H.lottery.isCanShake = true;
        },
        lottery_point : function(data){
            setTimeout(function(){
                H.lottery.fill(data);
            }, 2000);
        }
    };

    W.commonApiSPVHander = function(data){
        if(data.code == 0){
            $(".count label").html(data.c);
            $(".count").removeClass("hidden");
        }
    }

    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var list = data.rl;
            if(list && list.length>0){
                var con = "";
                for(var i = 0 ; i<list.length; i++){
                    con +="<li>"+(list[i].ni || "匿名用户")+"中了"+list[i].pn+"</li>";
                }
                var len = $(".marquee").find("li").length;
                if(len >= 500){
                    $(".marquee").find("ul").html(con);
                }else{
                    $(".marquee").find("ul").append(con);
                }
                if(H.lottery.first){
                    H.lottery.first = false;
                    H.lottery.scroll();
                }
                $(".marquee").removeClass("none");
            }
        }
    }

    W.callbackLeftDayCountLimitPrizeHandler = function(data){
        if(data.result){
            $(".rednum").find("span").text(data.lc);
            if(data.lc == 0){
                $(".rednum").css("opacity","0");
            }else{
                $(".rednum").css("opacity","1");
            }
        }
    }
})(Zepto);

$(function() {
    shownewLoading();
    H.lottery.init();
});
