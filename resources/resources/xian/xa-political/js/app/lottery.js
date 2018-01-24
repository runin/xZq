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
        first: true,
        lotteryTime:getRandomArbitrary(1,2),
        yaoBg:[],
        canJump:true,
        allRecordTime: Math.ceil(4000*Math.random() + 10000),
        PVTime: Math.ceil(7000*Math.random() + 8000),
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        type:2, //判断倒计时形式 1为节目开始之前，2为节目正在播出 默认为2
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        init : function(){
            this.event();
            this.current_time();
            this.shake();
            this.ddtj();
        },
        event: function() {
            $("#test").click(function(e){
                H.lottery.shake_listener();
            });
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        scroll: function(options) {
            // 左滚动
            $("#marquee").marqueen({
                mode: "top",	//滚动模式，top是向上滚动，left是朝左滚动
                container: "#marquee ul",	//包含的容器
                row: 1,	//滚动行数
                speed: 60,	//轮播速度，单位ms
                fixWidth: 20	//解决Zepto无法计算元素margin，padding在内的width，只有mode=left时有效
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
            H.lottery.times++;

            if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                H.lottery.isToLottey = false;
            }
            recordUserOperate(openid, "摇奖", "shakeLottery");
            recordUserPage(openid, "摇奖", 0);
            if(!$(".home-box").hasClass("yao")) {
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
        //查询最新20条中奖记录
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
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
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    recordUserOperate(openid, JSON.stringify(data), "lottery-round-succ");
                    if(data.result == true){
                        H.lottery.nowTime = timeTransform(data.sctm);
                        H.lottery.currentPrizeAct(data);
                    }else{
                        H.lottery.change();
                    }
                },
                error : function(xmlHttpRequest, error) {
                    recordUserOperate(openid, error, "lottery-round-error");
                    H.lottery.change();
                }
            });
        },
        downloadImg: function(){
            var t = simpleTpl();
            for(var i = 0;i < H.lottery.yaoBg.length;i++){
                t._('<img src="'+H.lottery.yaoBg[i]+'" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeLength = 0,
                nowTimeStr = H.lottery.nowTime,
                prizeActList = data.la,
                me = this;
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    H.lottery.change();
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        H.lottery.isCanShake = true;
                        H.lottery.type = 2;
                        if(prizeActList[i].bi.length>0){
                            H.lottery.yaoBg = prizeActList[i].bi.split(",");
                        }
                        H.lottery.downloadImg();
                        H.lottery.isLottery = true ;
                        var beginTimeLong = timestamp(endTimeStr);
                        var nowTime = new Date().getTime();
                        var serverTime = timestamp(nowTimeStr);
                        if(nowTime > serverTime){
                            beginTimeLong += (nowTime - serverTime);
                        }else if(nowTime < serverTime){
                            beginTimeLong -= (serverTime - nowTime);
                        }
                        $('.detail-countdown').attr('etime',beginTimeLong);
                        $(".countdown-tip").html("距摇奖结束还有");
                        H.lottery.count_down();
                        $(".countdown").removeClass("none");
                        hidenewLoading();
                        setInterval(function(){
                            H.lottery.red_record();
                        },this.allRecordTime);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.lottery.change();
                        return;
                    }

                }
            }else{
                H.lottery.change();
                return;
            }
        },
        change: function(){
            H.lottery.isCanShake = false;
            $(".countdown-tip").html('本期摇奖已结束');
            $(".detail-countdown").addClass("none");
            $('.countdown').removeClass('none');
            hidenewLoading();
        },
        // 倒计时
        beforeShowCountdown: function(etime) {
            $(".countdown-tip").html('距摇奖开启还有 ');
            $('.detail-countdown').attr('etime',etime);
            H.lottery.count_down();
            $('.countdown').removeClass('none');
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '<span class="fetal-H">%H%</span>' + '<span class="fetal-H"> 时 </span>' + '<span">%M%</span>' + ' 分 ' + '<span>%S%</span>'+' 秒', // 还有...结束
                    stpl : '<span class="fetal-H">%H%</span>' + '<span class="fetal-H"> 时 </span>' + '<span">%M%</span>' + ' 分 ' + '<span>%S%</span>'+' 秒', // 还有...结束
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        if(H.lottery.canJump){
                            shownewLoading(null,'请稍后...');
                            $(".countdown-tip").html('请稍后');
                            H.lottery.canJump = false;
                            H.lottery.change();
                        }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        drawlottery:function(){
            var me = this;
            var sn = new Date().getTime()+'';
            shownewLoading();
            me.lotteryTime = getRandomArbitrary(1,2);
            me.times = 0;
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
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
                error : function(xmlHttpRequest, error) {
                    recordUserOperate(openid, error, "lottery-luck-error");
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
                // H.dialog.thanks.open();
                H.lottery.thanks();
                return;
            }else{
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();//中奖声音
            }

            //0:谢谢参与1:实物奖品 9:外链领取奖品
            if(data.pt == 1 || data.pt == 9){
                H.dialog.linkLottery.open(data);
            }

        },
        thanks: function() {
            var me = this;
            hidenewLoading();
            me.canJump = true;
            me.isCanShake = true;
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
                }, 300);
            }, 1300);
        },
        lottery_point : function(data){
            setTimeout(function(){
                H.lottery.fill(data);
            }, 2000);
        },
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
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
    }

    W.commonApiPromotionHandler = function(data){
        if(data.code == 0){
            var jumpUrl = data.url;
            if(jumpUrl){
                $(".ddtj-text").html(data.desc);
                $(".ddtj-before").addClass("whole");
                $(".ddtj").removeClass("hidden").tap(function(e){
                    e.preventDefault();
                    W.location.href = jumpUrl;
                });
            }

        }else{
            $(".ddtj").addClass("hidden");
        }
    };
})(Zepto);

$(function() {
    shownewLoading();
    H.lottery.init();
});
