/**
 * Created by Administrator on 2015/8/13.
 */

(function($) {
    H.yao = {
        $home_box: $(".home-box"),
        $audio_a: $("#audio-a"),
        $textb: $(".textb"),
        $outer: $(".outer"),
        nowTime: null,
        isCanShake: false,
        isover:false,
        times: 0,
        PV:"",
        haslink:false,
        first:true,
        isToLottey:true,
        lotteryTime:getRandomArbitrary(1,5),
        yaoBg: [],
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        leftPrizeCountTime: Math.ceil(7000*Math.random() + 8000),
        repeat_load:true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        index:0, // 当前抽奖活动在 list 中的下标
        pal:[],// 抽奖活动list
        dec:0,//服务器时间与本地时间的差值
        type:2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        PVTime: Math.ceil(2000*Math.random() + 3000),
        isTimeOver: false,
        init: function(){
            var me = this;
            me.event();
            me.current_time();
            //me.shake();
            //me.jump();
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
                            //var nowTime = Date.parse(new Date());
                            //H.yao.dec = data.t - nowTime;
                            var nowTime = new Date().getTime();
                            H.yao.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
            $('body').css({
                'width': $(window).width(),
                'height': $(window).height()
            })
        },
        event: function(){
            var me = H.yao;
            $(".tosign").on("click", function (e) {
                e.preventDefault();
                $(".tosign").css({"-webkit-animation":"toggle 0.2s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                    toUrl('sign.html');
                });
            });
            $(".toindex").on("click", function (e) {
                e.preventDefault();
                toUrl('index.html');
            });
        },
        shake: function() {
            W.addEventListener('shake', H.yao.shake_listener, false);
        },
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        //查询业务当前抽奖活动有限制奖品剩余数量
        leftPrizeCount:function(){
            getResult('api/lottery/leftDayCountLimitPrize',{},'callbackLeftDayCountLimitPrizeHandler');
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
                            $(me).find('ul li:first').appendTo($ul);
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                };
            });
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
        //查抽奖活动接口
        current_time: function(){
            var me = H.yao;
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round'+dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.result == true){
                        /*me.nowTime = timeTransform(data.sctm);
                         var nowTime = Date.parse(new Date())/1000;
                         var serverTime = timestamp(me.nowTime);
                         me.dec = (serverTime - nowTime);*/

                        me.nowTime = timeTransform(data.sctm);
                        var nowTime = new Date().getTime();
                        var serverTime = data.sctm;
                        console.log('s='+me.nowTime);
                        console.log('n='+timeTransform(nowTime));
                        me.dec = nowTime - serverTime;
                        me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.current_time();
                            },500);
                        }else{
                            //me.wxCheck = false;
                            me.isToLottey = false;
                            me.change();
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    //me.wxCheck = false;
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
            setInterval(function(){
                H.yao.account_num();
            },this.PVTime);
            var recordDelay = Math.ceil(15000*Math.random() + 20000);
            setTimeout(function(){
                H.yao.red_record();
            }, recordDelay);
            setInterval(function(){
                H.yao.red_record();
            }, H.yao.allRecordTime);
            setInterval(function(){
                H.yao.leftPrizeCount();
            }, H.yao.leftPrizeCountTime);
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
                        //me.initCount();
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
                beginTimeStr = pra.pd+" "+pra.st,
                beginTimeLong = timestamp(beginTimeStr);
            me.type = 1;
            beginTimeLong += me.dec;
            $(".countdown-tip").html('距摇奖开启还有 ');
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("none");
            me.count_down();
            $('.countdown').removeClass('none').off();
            me.isCanShake = false;
            me.isover = true;
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            var me = H.yao,
                endTimeStr = pra.pd+" "+pra.et,
                beginTimeLong = timestamp(endTimeStr);
            me.type = 2;
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).addClass("none");
            $(".countdown-tip").html("点我去摇奖");
            me.count_down();
            $(".countdown").removeClass("none").one("click", function () {
                $(".countdown").css({"-webkit-animation":"toggle 0.2s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                    toUrl("yao.html");
                });
            });
            me.index ++;
            me.isCanShake = true;
            me.isover = false;
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
                        if(!me.isTimeOver){
                            me.isTimeOver = true;
                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                me.nowCountdown(me.pal[me.index]);
                            }else if(me.type == 2){
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
            H.yao.isCanShake = false;
            $(".countdown").removeClass("none").off();
            $(".countdown-tip").removeClass("none").html('本期摇奖已结束');
            H.yao.$textb.addClass("none");
            H.yao.isover = true;
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
        if(data.result){
            var list = data.rl;
            //list = [{"ni":"23423","pn":"234234"},
            //
            //    {"ni":"1111","pn":"11111"},
            //    {"ni":"2222","pn":"22"},
            //    {"ni":"3333","pn":"234234"},
            //    {"ni":"4444","pn":"234234"},
            //]
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
                if(H.yao.first){
                    H.yao.first = false;
                    H.yao.scroll();
                }
                $(".marquee").removeClass("none");
            }
        }
    };
    W.callbackLeftDayCountLimitPrizeHandler = function(data){
        if(data.result){
            $(".leftlot").find("span").text(data.lc);
            if(data.lc == 0){
                $(".leftlot").css("opacity","0");
            }else{
                $(".leftlot").css("opacity","1");
            }
        }
    }
})(Zepto);

$(function() {
    H.yao.init();
    var me = H.yao;
    //wx.ready(function () {
    //    wx.checkJsApi({
    //        jsApiList: [
    //            'addCard'
    //        ],
    //        success: function (res) {
    //            var t = res.checkResult.addCard;
    //            //判断checkJsApi 是否成功 以及 wx.config是否error
    //            if(t && !me.isError){
    //                me.wxCheck = true;
    //            }
    //        }
    //    });
    //    //wx.config成功
    //});

    //wx.error(function(res){
    //    me.isError = true;
    //    //wx.config失败，重新执行一遍wx.config操作
    //    //H.record.wxConfig();
    //});
});

var queshowimg,winW,winH,bd,talkbg;
$(document).ready(function () {
    winW = $(window).width();
    winH = $(window).height();
    bd = $(".body");
    talkbg = $(".talkbg");
    talkbg.css({"width":winW,"height":winH});
    bd.css({"top":"165px","height":(winH - 235)+"px"});
    $("body").on("click", function () {
        $(".lottery-none").css("display","none");
    });
});
document.getElementById("title-img").onload = function () {
    $(".title-img").css("opacity","1");
};
