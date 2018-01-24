/**
 * 惊喜连连-抽奖
 */
(function($) {
    H.lottery = {
        isLottery :false,
        nowTime :null,
        isCanShake:false,
        times:0,
        isToLottey:true,
        isTimeOver: false,
        first: true,
        lotteryTime:getRandomArbitrary(1,3),
        yaoBg:[],
        canJump:true,
        repeat_load:true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        dec:0,//服务器时间和本地时间的时差
        firstPra:null,//第一轮摇奖活动 用来重置倒计时
        nextPrizeAct:null,//第一轮摇奖活动 用来重置倒计时
        leftPrizeCountTime: Math.ceil(7000*Math.random() + 8000),
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        PVTime: Math.ceil(20000*Math.random() + 10000),
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        type:2, //判断倒计时形式 1为抽奖开始之前，2为抽奖正在播出 默认为2
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        endType:1,
        roundData:null,
        init : function(){
            var me = this, tipsRandom = getRandomArbitrary(0,3), zzs_List = ['icon-zantips1.png','icon-zantips2-back.png','icon-zantips3-back.png'];
            // $('.icon-zantips').attr('src', './images/' + zzs_List[tipsRandom]).animate({'opacity':'1'}, 600);
            $('.icon-zantips').attr('src', './images/icon-zantips-back.png').animate({'opacity':'1'}, 600);
            me.event();
            me.updateThanks();
            me.current_time();
            me.shake();
        },
        updateThanks: function(){
            var day = timeTransform(new Date().getTime()).split(" ")[0], cover = ['2015-10-02','2015-10-03','2015-10-05'];
            if (cover.indexOf(day) >= 0) {
                thanks_list = thanks_list_last;
            }
        },
        checkResolution: function(){
            var height = $(window).height();
            if(height < 416){
                return false;
            }else{
                return true;
            }
        },
        event: function() {
            $("#test").click(function(e){
                H.lottery.lotteryTime = 1;
                H.lottery.shake_listener();
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
        imgMath: function() {//随机背景
            if(H.lottery.yaoBg.length >0){
                var i = Math.floor((Math.random()*H.lottery.yaoBg.length));;
                $("body").css("backgroundImage","url('"+H.lottery.yaoBg[i]+"')");
            }
        },
        shake_listener: function() {
            if(H.lottery.isCanShake){
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
            }else{
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
                    '-webkit-transform': 'translate(0px,-100px)'
                });
                $(".m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,100px)'
                });
                setTimeout(function(){
                    $(".m-t-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                    $(".m-f-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                }, 1200);
                $(".home-box").addClass("yao");
            }
            if(!openid || openid=='null' || H.lottery.isToLottey == false){
                setTimeout(function(){
                    H.lottery.fill(null);//摇一摇
                }, 2000);
            }else{
                if(!H.lottery.checkResolution()){
                    //检查分辨率
                    setTimeout(function(){
                        H.lottery.fill(null);//摇一摇
                    }, 2000);
                    return;
                }
                if(!H.lottery.wxCheck){
                    //微信config失败
                    setTimeout(function(){
                        H.lottery.fill(null);//摇一摇
                    }, 2000);
                    return;
                }
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
        //查抽奖活动接口
        current_time: function(){
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
                },
                success : function(data) {
                    if(data.result == true){
                        H.lottery.nowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        H.lottery.dec = nowTimeStemp - data.sctm;
                        H.lottery.roundData = data;
                        H.lottery.currentPrizeAct(data);
                    }else{
                        if(H.lottery.repeat_load){
                            H.lottery.repeat_load = false;
                            setTimeout(function(){
                                H.lottery.current_time();
                            },500);
                        }else{
                            toUrl("yaoyiyao.html");
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    toUrl("yaoyiyao.html");
                }
            });
        },
        downloadImg: function(){
            if($(".preImg")){
                $(".preImg").remove();
            }
            var t = simpleTpl();
            for(var i = 0;i < H.lottery.yaoBg.length;i++){
                t._('<img class="preImg" src="'+H.lottery.yaoBg[i]+'" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
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
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.cookie4toUrl('vote.html?lotteryBack=lottery');
                    return;
                }
                //config微信jssdk
                H.lottery.wxConfig();
                //第一轮摇奖开始之前，显示倒计时
                if(comptime(prizeActList[0].pd+" "+prizeActList[0].st,nowTimeStr) < 0){
                    H.lottery.firstPra = prizeActList[0];
                    H.lottery.beforeShowCountdown(prizeActList[0]);
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        if(i < prizeActList.length - 1){
                            var nextBeginTimeStr = prizeActList[i+1].pd+" "+prizeActList[i+1].st;
                            if(comptime(endTimeStr,nextBeginTimeStr) <=0){
                                H.lottery.endType = 2;
                                // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                                H.lottery.nextPrizeAct = prizeActList[i+1];
                            }
                        }else{
                            // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                            H.lottery.endType = 1;
                        }
                        H.lottery.nowCountdown(prizeActList[i]);
                        H.lottery.initCount();
                        $.fn.cookie('jumpNum', 0, {expires: -1});
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.cookie4toUrl('vote.html?lotteryBack=lottery');
                        return;
                    }

                }
            }else{
                toUrl('yaoyiyao.html');
                return;
            }
        },
        initCount:function(){
            // 可以抽奖的时候再去调用 pv 剩余红包数  中奖纪录接口
            setTimeout(function(){
                H.lottery.account_num();
            },this.PVTime);
            var recordDelay = Math.ceil(15000*Math.random() + 20000);
            setTimeout(function(){
                H.lottery.red_record();
            }, recordDelay);
            setInterval(function(){
                H.lottery.red_record();
            },this.allRecordTime);
            setInterval(function(){
                H.lottery.leftPrizeCount();
            },this.leftPrizeCountTime);
        },
        // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            H.lottery.type = 1;
            H.lottery.isCanShake = false;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.lottery.dec;
            $(".countdown-tip").html('距摇奖开启还有');
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.lottery.count_down();
            $('.countdown').removeClass('none');
            $(".icon-zantips").removeClass("none");
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            H.lottery.isCanShake = true;
            H.lottery.type = 2;
            if(pra.bi.length>0){
                H.lottery.yaoBg = pra.bi.split(",");
            }
            H.lottery.downloadImg();
            H.lottery.isLottery = true ;
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            var nowTime = new Date().getTime();
            var serverTime = timestamp(H.lottery.nowTime);
            if(nowTime > serverTime){
                beginTimeLong += (nowTime - serverTime);
            }else if(nowTime < serverTime){
                beginTimeLong -= (serverTime - nowTime);
            }
            $('.detail-countdown').attr('etime',beginTimeLong);
            $(".countdown-tip").html("距本轮摇奖结束还有");
            H.lottery.count_down();
            $(".countdown").removeClass("none");
            $(".icon-zantips").removeClass("none");
            H.lottery.canJump = true;
            hidenewLoading();
        },
        refreshCountdown:function(pra,dec){
            var me = this;
            H.lottery.isCanShake = true;
            H.lottery.type = 2;
            if(pra.bi.length>0){
                H.lottery.yaoBg = pra.bi.split(",");
            }
            H.lottery.downloadImg();
            H.lottery.isLottery = true ;
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += dec;
            var nowTimeStemp = new Date().getTime();
            if(nowTimeStemp >= beginTimeLong){
                shownewLoading(null,'请稍后...');
                $(".countdown-tip").html('请稍后');
                me.cookie4toUrl("vote.html?lotteryBack=lottery");
                return;
            }
            $('.detail-countdown').attr('etime',beginTimeLong);
            $(".countdown-tip").html("距本轮摇奖结束还有");
            H.lottery.count_down();
            $(".countdown").removeClass("none");
            $(".icon-zantips").removeClass("none");
            hidenewLoading();
        },
        count_down : function() {
            var me = this;
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '<span class="fetal-H">%H%' + '时</span>' + '%M%' + '分' + '%S%'+'秒', // 还有...结束
                    stpl : '<span class="fetal-H">%H%' + '时</span>' + '%M%' + '分' + '%S%'+'秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true
                        if(H.lottery.canJump){
                            if (H.lottery.type == 1) {
                                if(!H.lottery.isTimeOver){
                                    H.lottery.isTimeOver = true;
                                    shownewLoading(null,'请稍后...');
                                    $(".countdown-tip").html('请稍后');
                                    var deley = Math.ceil(1000*Math.random() + 2000);
                                    setTimeout(function(){
                                        H.lottery.refreshCountdown(H.lottery.firstPra, H.lottery.dec);
                                    },deley);
                                }
                            } else if (H.lottery.type == 2) {
                                if(!H.lottery.isTimeOver){
                                    H.lottery.isTimeOver = true;
                                    H.lottery.canJump = true;
                                    H.lottery.isCanShake = false;
                                    shownewLoading(null,'请稍后...');
                                    $(".countdown-tip").html('请稍后');
                                    setTimeout(function(){
                                        if(H.lottery.endType == 2){
                                            H.lottery.refreshCountdown(H.lottery.nextPrizeAct, H.lottery.dec);
                                            H.lottery.endType = 1;
                                        }else{
                                            me.cookie4toUrl("vote.html?lotteryBack=lottery");
                                        }
                                    },1000);
                                }
                            } else {
                                    H.lottery.canJump = false;
                                    toUrl("yaoyiyao.html");
                            }
                        }
                    },
                    sdCallback :function(){
                        H.lottery.isTimeOver = false;
                    }
                });
            });
        },
        drawlottery:function(){
            var me = this;
            var sn = new Date().getTime()+'';
            shownewLoading();
            me.lotteryTime = getRandomArbitrary(1,3);
            me.times = 0;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck' + dev,
                data: { oi: openid , sn : sn},
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

            if(data.pt == 7 || data.pt == 9){
                //卡券，外链
                H.dialog.lottery.open(data);
            }else if(data.pt == 4){
                //红包
                H.dialog.Redlottery.open(data);
            }else if(data.pt == 5 || data.pt == 1){
                //兑换码或者实物奖
                H.dialog.Entlottery.open(data);
            }

        },
        lottery_point : function(data){
            setTimeout(function(){
                H.lottery.fill(data);
            },2000);
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
        cookie4toUrl: function(page) {//cookie中的jumpNum值，0为正常，当值超过2时页面跳转至yaoyiyao.html
            var exp = new Date();
            exp.setTime(exp.getTime() + 60*1000);
            if ($.fn.cookie('jumpNum')) {
                if ($.fn.cookie('jumpNum') >= 0 && $.fn.cookie('jumpNum') < 4) {
                    var jumpNum = parseInt($.fn.cookie('jumpNum')) + 1;
                    $.fn.cookie('jumpNum', jumpNum, {expires: exp});
                    toUrl(page);
                } else if($.fn.cookie('jumpNum') >= 4) {
                    $.fn.cookie('jumpNum', 0, {expires: -1});
                    toUrl('yaoyiyao.html');
                }
            } else {
                $.fn.cookie('jumpNum', 1, {expires: exp});
                toUrl(page);
            }
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
            var num = $(".rednum").find("span").text();
            if(num*1 >= data.lc || num*1 == 0){
                $(".rednum").find("span").text(data.lc);
                if(data.lc == 0){
                    $(".rednum").css("opacity","0");
                }else{
                    $(".rednum").css("opacity","1");
                }
            }
        }
    }
})(Zepto);

$(function() {
    shownewLoading();
    H.lottery.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.lottery.isError){
                    H.lottery.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res){
        H.lottery.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});
