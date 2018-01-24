(function($) {
    H.lottery = {
        isLottery :false,
        nowTime :null,
        isCanShake:false,
        times:0,
        isToLottey:true,
        isTimeOver: false,
        first: true,
        lotteryTime: getRandomArbitrary(1,3),
        yaoBg:[],
        lastRound: false, //判断是否为最后一轮，是最后一轮倒计时结束后直接跳转结束页，否则跳转投票页
        canJump:true,
        repeat_load:true, //用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        dec:0, //服务器时间和本地时间的时差
        firstPra:null, //第一轮摇奖活动 用来重置倒计时
        nextPrizeAct:null, //第一轮摇奖活动 用来重置倒计时
        leftPrizeCountTime: Math.ceil(7000*Math.random() + 8000),
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        PVTime: Math.ceil(20000*Math.random() + 10000),
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        type:2, //判断倒计时形式 1为抽奖开始之前，2为抽奖正在播出 默认为2
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        endType:1,
        index:0,
        pal: null,
        roundData:null,
        sponsorLotteryFlag: false,
        sponsorLoadnum: 0,
        init : function(){
            this.event();
            this.resize();
            this.sponsor_port();
            this.lotteryRound_port();
            this.shake();
        },
        resize: function() {
            var winW = $(window).width(), winH = $(window).height();
            $("body, .sponsor-box").css({'width':winW, 'height':winH});
            if(!is_android()){
                $(".main-top").css("height", (winH / 2) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2) + "px").css('bottom', '0');
            } else {
                $(".main-top").css("height", (winH / 2 + 0.5) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2 + 0.5) + "px").css('bottom', '0');
            }
        },
        event: function() {
            var me = this;
            $("#test").click(function(e){
                H.lottery.wxCheck = true;
                H.lottery.lotteryTime = 1;
                H.lottery.shake_listener();
            });
            $('body').delegate('.product-box-pull', 'click', function(e) {
                e.preventDefault();
                $('.product-box').addClass('on');
                $('.product-box-pull').addClass('on');
                me.sponsorLotteryFlag = true;
            }).delegate('.product-box .btn-pack', 'click', function(e) {
                e.preventDefault();
                $('.product-box').removeClass('on');
                $('.product-box-pull').removeClass('on');
                me.sponsorLotteryFlag = false;
            });
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        lotteryRound_port: function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 10000,
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
                                H.lottery.lotteryRound_port();
                            },500);
                        }else{
                            alert();
                            toUrl('over.html');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    toUrl('yaoyiyao.html');
                }
            });
        },
        sponsor_port:function(){
          getResult("api/linesdiy/info", {}, "callbackLinesDiyInfoHandler");
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
                        $(me).find('ul').animate({'margin-top': '-28px'}, delay, function() {
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
            if(H.lottery.sponsorLotteryFlag) {
                return;
            }
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
                    '-webkit-transform': 'translate3d(0,-100px,0)'
                });
                $(".m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate3d(0,100px,0)'
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
            if(!openid || openid=='null' || H.lottery.isToLottey == false){
                setTimeout(function(){
                    H.lottery.fill(null);//摇一摇
                }, 1500);
            }else{
                if(!H.lottery.wxCheck){
                    //微信config失败
                    setTimeout(function(){
                        H.lottery.fill(null);//摇一摇
                    }, 1500);
                    return;
                }
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        account_num: function(){
            getResult('api/common/servicepv', {}, 'commonApiSPVHander');
        },
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        leftPrizeCount:function(){
            getResult('api/lottery/leftDayCountLimitPrize',{},'callbackLeftDayCountLimitPrizeHandler');
        },
        downloadImg: function(){
            if($(".preImg")){
                $(".preImg").remove();
            }
            var t = simpleTpl();
            for(var i = 0;i < H.lottery.yaoBg.length;i++){
                t._('<img class="preload preImg" src="'+H.lottery.yaoBg[i]+'">')
            }
            $("body").append(t.toString());
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this, nowTimeStr = H.lottery.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [];
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
            if(prizeActList.length > 0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    H.lottery.endType = 3;
                    H.lottery.change();
                    // cookie4toUrl('over.html');
                    return;
                }
                //config微信jssdk
                H.lottery.wxConfig();
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    console.log(i);
                    H.lottery.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        if(i < prizeActList.length - 1){
                            var nextBeginTimeStr = prizeActList[i + 1].pd + " " + prizeActList[i + 1].st;
                            if(comptime(endTimeStr, nextBeginTimeStr) <= 0){
                                H.lottery.endType = 2;
                                // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                                H.lottery.lastRound = false;
                                H.lottery.nextPrizeAct = prizeActList[i+1];
                            } else {
                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                H.lottery.endType = 1;
                            }
                        }else{
                            // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                            H.lottery.endType = 3;
                            H.lottery.lastRound = true;
                        }
                        H.lottery.nowCountdown(prizeActList[i]);
                        H.lottery.initCount();
                        // H.lottery.tttj();
                        $.fn.cookie('jumpNum', 0, {expires: -1});
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        H.lottery.beforeCountdown(prizeActList[i]);
                        // cookie4toUrl('index.html?fromURL=lottery');
                        return;
                    }

                }
            }else{
                toUrl('yaoyiyao.html');
                return;
            }
        },
        initCount:function(){
            setTimeout(function(){
                H.lottery.account_num();
            },this.PVTime);
            // var recordDelay = Math.ceil(15000*Math.random() + 20000);
            // setTimeout(function(){
            //     H.lottery.red_record();
            // }, recordDelay);
            // setInterval(function(){
            //     H.lottery.red_record();
            // },this.allRecordTime);
            // setInterval(function(){
            //     H.lottery.leftPrizeCount();
            // },this.leftPrizeCountTime);
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            H.lottery.isCanShake = false;
            H.lottery.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.lottery.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html('距抽奖开始还有');
            H.lottery.count_down();
            $('.countdown').removeClass('none');
            if(prizeActList.bi.length > 0){
                H.lottery.yaoBg = prizeActList.bi.split(",");
            }
            H.lottery.downloadImg();
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            H.lottery.isCanShake = true;
            H.lottery.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.lottery.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html("距抽奖结束还有");
            H.lottery.count_down();
            $(".countdown").removeClass("none");
            H.lottery.index++;
            H.lottery.canJump = true;
            if(prizeActList.bi.length > 0){
                H.lottery.yaoBg = prizeActList.bi.split(",");
            }
            H.lottery.downloadImg();
            hidenewLoading();
        },
        count_down : function() {
            var me = this;
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl : '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.lottery.canJump){
                            if(H.lottery.type == 1){
                                //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                if(!H.lottery.isTimeOver){
                                    H.lottery.isTimeOver = true;
                                    $('.countdown-tip').html('请稍后');
                                    shownewLoading(null,'请稍后...');
                                    setTimeout(function() {
                                        H.lottery.nowCountdown(H.lottery.pal[H.lottery.index]);
                                    }, 1000);
                                }
                            }else if(H.lottery.type == 2){
                                //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                                if(!H.lottery.isTimeOver){
                                    H.lottery.isTimeOver = true;
                                    if(H.lottery.index >= H.lottery.pal.length){
                                        H.lottery.change();
                                        H.lottery.type = 3;
                                        return;
                                    }
                                    $('.countdown-tip').html('请稍后');
                                    shownewLoading(null,'请稍后...');
                                    var i = H.lottery.index - 1;
                                    if(i < H.lottery.pal.length - 1){
                                        var endTimeStr = H.lottery.pal[i].pd + " " + H.lottery.pal[i].et;
                                        var nextBeginTimeStr = H.lottery.pal[i + 1].pd + " " + H.lottery.pal[i + 1].st;
                                        if(comptime(endTimeStr,nextBeginTimeStr) <= 0){
                                            // 有下一轮并且下一轮的开始时间和本轮的结束时间重合
                                            H.lottery.endType = 2;
                                        } else {
                                            // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                            H.lottery.endType = 1;
                                        }
                                    }
                                    setTimeout(function(){
                                        if(H.lottery.endType == 2){
                                            H.lottery.nowCountdown(H.lottery.pal[H.lottery.index]);
                                        }else if(H.lottery.endType == 1){
                                            H.lottery.beforeCountdown(H.lottery.pal[H.lottery.index]);
                                        } else {
                                            H.lottery.change();
                                        }
                                    },1000);
                                }
                            }else{
                                H.lottery.isCanShake = false;
                            }
                        }
                    },
                    sdCallback :function(){
                        H.lottery.isTimeOver = false;
                    }
                });
            });
        },
        countdown_otCallback: function() {
            if(H.lottery.canJump){
                if(!H.lottery.isTimeOver){
                    H.lottery.isTimeOver = true;
                    H.lottery.isCanShake = false;
                    shownewLoading(null,'请稍后...');
                    $(".countdown-tip").html('请稍后');
                    if (H.lottery.lastRound) {
                        toUrl('over.html');
                    } else {
                        cookie4toUrl("index.html?fromURL=lottery");
                    }
                }
            }
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
                        me.lotteryTime = getRandomArbitrary(6, 10);
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
            $(".home-box").removeClass("yao");
            H.lottery.imgMath();
            if(data == null || data.result == false || data.pt == 0){
                $("#audio-a").get(0).pause();
                H.lottery.thanks();
                return;
            }else{
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();//中奖声音
            }

            if (data.pt == 1) {
                H.dialog.shiwuLottery.open(data);
            } else if (data.pt == 7) {
                H.dialog.wxcardLottery.open(data);
            } else {
                H.lottery.thanks();
            }
        },
        thanks: function(){
            H.lottery.canJump = true;
            if (typeof(thanks_tips) == 'undefined' || thanks_tips.length == 0) {
                var tips = '不纯不抢，继续来战，加油吧~';
            } else {
                var tips = thanks_tips[getRandomArbitrary(0, thanks_tips.length)]
            }
            $('.thanks-tips').html(tips).addClass('show');
            setTimeout(function(){
                $('.thanks-tips').removeClass('show');
                setTimeout(function(){
                    $('.thanks-tips').empty();
                    H.lottery.isCanShake = true;
                }, 300);
            }, 1000);
        },
        lottery_point : function(data){
            setTimeout(function(){
                H.lottery.fill(data);
            },1500);
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
        change: function(){
            hidenewLoading();
            $(".countdown-tip").html('今日摇奖已结束，请明天再来');
            $('.detail-countdown').html("");
            $(".countdown").removeClass("none");
            H.lottery.isCanShake = false;
        },
        tttj: function() {
            $('#tttj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };

    W.commonApiSPVHander = function(data){
        if(data.code == 0){
            if (data.c*1 != 0) {
                $(".count label").html(data.c);
                $(".count").removeClass("hidden");
                setInterval(function(){
                    var pv = getRandomArbitrary(33,99);
                    pv = $(".count label").html()*1 + pv;
                    $(".count label").html(pv);
                },3000);
            }
        }
    };

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
    };

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
    };

    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            var t = simpleTpl(), items = data.gitems, productH = Math.floor($(window).width() / 3);
            if(items && items.length > 0){
                for(var i = 0; i < items.length; i++) {
                    if (items[i].mu == '') {
                        var classStatus = 'none';
                    } else {
                        var classStatus = '';
                    }
                    t._('<li><img src="' + items[i].ib + '" onerror="$(this).remove()"><a href="' + items[i].mu + '" class="' + classStatus + '">查看详情</a></li>')
                };
                $('.product-box ul').html(t.toString());
                $('.product-box ul li').css('width', productH);
                $('.product-box ul').css('width', productH * items.length);
            }
            $('.product-box-pull').removeClass('on');
        } else {
            $('.product-box-pull').addClass('on');
        }
    };

    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0 && data.desc && data.url) {
            $('#tttj').removeClass('none').find('p').text(data.desc || '');
            $('#tttj').click(function(e) {
                e.preventDefault();
                if ($("#btn-rule").hasClass('requesting')) {
                    return;
                }
                $("#btn-rule").addClass('requesting');
                shownewLoading(null, '请稍后...');
                location.href = data.url
            });
        } else {
            $('#tttj').remove();
        };
    };
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
