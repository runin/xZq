
(function($) {
    H.lottery = {
        $textb:$(".yao-cool-tips"),
        $nav_left:$(".nav-left"),
        $nav_right:$(".nav-right"),
        isLottery: false,
        nowTime: null,
        isCanShake: false,
        times: 0,
        isToLottey: true,
        isTimeOver: false,
        first: true,
        lotteryTime: getRandomArbitrary(1, 3),
        yaoBg: [],
        pal: [],
        istrue: false,
        canJump: true,
        repeat_load: true, //用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        dec: 0, //服务器时间和本地时间的时差
        firstPra: null, //第一轮摇奖活动 用来重置倒计时
        leftPrizeCountTime: Math.ceil(7000 * Math.random() + 8000),
        allRecordTime: Math.ceil(40000 * Math.random()),
        PVTime: Math.ceil(15000 * Math.random()),
        wxCheck: false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        type: 2, //判断倒计时形式 1为抽奖开始之前，2为抽奖正在播出 默认为2
        isError: false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        init: function() {
            var me = this,
                tipsRandom = getRandomArbitrary(1, 3);
            //$('.icon-zantips').attr('src', './images/icon-zantips' + tipsRandom + '.png').animate({'opacity':'1'}, 600);
            me.event();
            me.current_time();
        },
        event: function() {
            this.$nav_left.click(function(e) {
                e.preventDefault();
                toUrl('yaoyiyao.html');
            });
            this.$nav_right.click(function(e) {
                e.preventDefault();
                toUrl('lovetest.html');
            });
        },
        bindClick:function()
        {
            $(".timebuy-btn").css({"background":"#f1585d","color":"#fff"}).text("马上抢").off();
            $(".timebuy-btn").click(function()
            {
                var me = this;
                $(me).addClass("joinscale-btn");
                setTimeout(function()
                {
                    $(me).removeClass("joinscale-btn");
                },1000);
                if (!openid || openid == 'null'||H.lottery.isCanShake==false) {
                setTimeout(function() {
                    H.lottery.fill(null); //摇一摇
                }, 2000);
            } else {
                // if(!H.lottery.wxCheck){
                //    //微信config失败
                //    setTimeout(function(){
                //        H.lottery.fill(null);//摇一摇
                //    }, 2000);
                //    return;
                // }
                H.lottery.drawlottery();
              }
            })
        },
        //查询业务当前抽奖活动有限制奖品剩余数量
        leftPrizeCount: function() {
            getResult('api/lottery/leftDayCountLimitPrize', {at:5}, 'callbackLeftDayCountLimitPrizeHandler');
        },
        //查询业务当前抽奖活动所关联的奖品
        momentPrize: function() {
            getResult('api/lottery/prizes', {at:5}, 'callbackLotteryPrizesHandler',true);
        },

        //查抽奖活动接口
        current_time: function() {
            shownewLoading();
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/round' + dev,
                data: {at:5},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryRoundHandler',
                timeout: 11000,
                complete: function() {},
                success: function(data) {
                    if (data.result == true) {

                        H.lottery.nowTime = timeTransform(data.sctm);
                        H.lottery.currentPrizeAct(data);
                    } else {
                        if (H.lottery.repeat_load) {
                            H.lottery.repeat_load = false;
                            setTimeout(function() {
                                H.lottery.current_time();
                            }, 5000);
                        } else {
                            hidenewLoading();
                            $(".goods").removeClass("none");
                            $(".goods-show").addClass("none");
                            $(".timebuy-btn").css({"background":"#ddd","color":"#000"}).text("活动尚未开始").off();
                            H.lottery.isCanShake = false;
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    hidenewLoading();
                    $(".goods").removeClass("none");
                    $(".timebuy-btn").css({"background":"#ddd","color":"#000"}).text("活动尚未开始").off();
                    H.lottery.isCanShake = false;
                }
            });
        },

        downloadImg: function() {
            var t = simpleTpl();
            for (var i = 0; i < H.lottery.yaoBg.length; i++) {
                t._('<img src="' + H.lottery.yaoBg[i] + '" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
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
                H.lottery.wxConfig();
                for (var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if (comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0) {
                        //H.lottery.getPort();
                        H.lottery.index = i;
                        H.lottery.nowCountdown(prizeActList[i]);
                        H.lottery.initCount();
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
        initCount: function() {

            H.lottery.leftPrizeCount();
        },
        change: function() {
            $(".goods").removeClass("none");
            $(".goods-show").addClass("none");
            hidenewLoading();
            $(".timebuy-btn").css({"background":"#ddd","color":"#000"}).text("本期已结束").off();
            H.lottery.isCanShake = false;
        },
        // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            H.lottery.type = 1;
            H.lottery.isCanShake = false;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.lottery.dec;
            H.lottery.istrue = true;
            H.lottery.momentPrize();

            $(".goods").removeClass("none");
            $(".countdown-tip").html('距摇奖开启还有 ');
            $('.detail-countdown').attr('etime', beginTimeLong);
            H.lottery.count_down();
            $('.countdown').removeClass('none');
            $(".timebuy-btn").css({"background":"#ddd","color":"#000"}).text("等待下一轮").off(); 
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra) {
            var me = this;
            H.lottery.isCanShake = true;
            H.lottery.type = 2;
            H.lottery.isLottery = true;
            H.lottery.istrue = true;
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.lottery.dec;

            H.lottery.leftPrizeCount();
            H.lottery.momentPrize();
            $(".goods").removeClass("none");
            $('.detail-countdown').attr('etime', beginTimeLong);
            $(".countdown-tip").html("距本轮摇奖结束还有");
            H.lottery.count_down();
            H.lottery.index++;
            $(".countdown").removeClass("none");
            hidenewLoading();
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
                            H.lottery.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
       count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%'+':'+'%M%' + ':' + '%S%'+'', // 还有...结束
                    stpl : '%H%'+':'+'%M%' + ':' + '%S%'+'', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true
                       
                        if(H.lottery.istrue){
                            H.lottery.istrue = false;
                            if (H.lottery.type == 1) {              
                                    H.lottery.nowCountdown(H.lottery.pal[H.lottery.index]);
                            } else if (H.lottery.type == 2) {
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
                       H.lottery.istrue = true;
                    }
                });
            });
        },
        drawlottery: function() {
            var me = this;
            var sn = new Date().getTime() + '';
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            shownewLoading();
            me.lotteryTime = getRandomArbitrary(1, 3);
            me.times = 0;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/luck'+ dev,
                data: {
                    oi: openid,
                    sn: sn,
                    at:5
                },
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryLuckHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success: function(data) {
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
        fill: function(data) {
            var me= this;
            if (data == null || data.result == false ||data.pt==0) {
                showTips("点太快了，慢点再点");
            } else {
               me.wx_card(data);
            }
        },
        lottery_point: function(data) {
            H.lottery.fill(data);
        },
        wx_card:function(data){
                var me = this;
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: data.ci,
                        cardExt: "{\"timestamp\":\""+ data.ts +"\",\"signature\":\""+ data.si +"\"}"
                    }],
                    success: function (res) {
                        //H.lottery.wxCheck = true;
                        H.lottery.canJump = true;
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid,
                            rn: me.name ? encodeURIComponent(me.name) : "",
                            ph: me.mobile ? me.mobile : ""
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        H.lottery.isCanShake = true;
                        H.lottery.canJump = true;
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    },
                    cancel:function(){
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    }
                });
        },
        wxConfig: function() {
            //后台获取jsapi_ticket并wx.config
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'mp/jsapiticket' + dev,
                data: {
                    appId: shaketv_appid
                },
                dataType: "jsonp",
                jsonpCallback: 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {},
                success: function(data) {
                    if (data.code == 0) {
                        var url = window.location.href.split('#')[0];
                        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
                        var timestamp = Math.round(new Date().getTime() / 1000);
                        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
                        //权限校验
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr: nonceStr,
                            signature: signature,
                            jsApiList: ["addCard", "checkJsApi"]
                        });
                    }
                },
                error: function(xmlHttpRequest, error) {}
            });
        },
    };


    W.commonApiSPVHander = function(data) {
        if (data.code == 0) {
            $(".count").html("当前在线人数：" + data.c + "人").removeClass("none");
        }
    }
   
    W.callbackLeftDayCountLimitPrizeHandler = function(data) {
        if(data.result) {
            if(data.lc !=0)
            {
                H.lottery.bindClick();
            }
            else
            {
                $(".timebuy-btn").css({"background":"#ddd","color":"#000"}).text("本轮奖品已抢完").off(); 
                $(".goods-show").addClass("none");
               
            }
            
        }
    };
    W.callbackLotteryPrizesHandler = function(data)
    {
        var imgsrc="./images/prize.jpg"
        if(data.result) {
           $(".goods-show img").attr("src",data.pa[0].pi?data.pa[0].pi:imgsrc);
           $(".goods-infor h2").text(data.pa[0].pn?data.pa[0].pn:"飞科剃须刀30元代金卷");
           var ruleInfor=data.pa[0].pd
           if(ruleInfor.length>30)
           {
                ruleInfor = ruleInfor.substring(0,30)+'<span class="viewmore">.....查看更多>></span>';
               
           }

           $(".goods-infor p").html("<strong>使用规则：</strong>"+ruleInfor);
           $(".goods").removeClass("none");

           $("body").delegate(".viewmore","click",function()
            {
                    ruleInfor = data.pa[0].pd;
                    $(".goods-infor p").html("<strong>使用规则：</strong>"+ruleInfor+"<span class='close'>收回<<</span>");
            })
            $("body").delegate(".close","click",function()
            {
                    ruleInfor = data.pa[0].pd;
                    $(".goods-infor p").html("<strong>使用规则：</strong>"+ruleInfor.substring(0,30)+'<span class="viewmore">.....查看更多>></span>');
            })

          
           
        }
        else
        {
           // $(".goods-show img").attr("src",imgsrc);
           // $(".goods-infor h2").text("飞科剃须刀代金卷");
           // $(".goods-infor p").html("<strong>使用规则：</strong>"+"本券只试用于飞科商城，每个订单仅限一张，不找零，不 兑现，最终解释权归商家所有.....");
           // $(".goods").removeClass("none");
        }
    }
   
})(Zepto);
$(function() {
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