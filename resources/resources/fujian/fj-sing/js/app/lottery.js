/**
 * 福建唱吧-抽奖
 */
(function($) {
    H.lottery = {
        isLottery :false,
        nowTime :null,
        isCanShake:false,
        times:0,
        indexFlag:1,
        isToLottey:true,
        isTimeOver: false,
        first: true,
        lotteryTime:getRandomArbitrary(1,5),
        yaoBg:[],
        pal:[],
        canJump:true,
        repeat_load:true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        dec:0,//服务器时间和本地时间的时差
        firstPra:null,//第一轮摇奖活动 用来重置倒计时
        leftPrizeCountTime: Math.ceil(7000*Math.random() + 8000),
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        PVTime: Math.ceil(15000*Math.random() + 25000),
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        type:2, //判断倒计时形式 1为抽奖开始之前，2为抽奖正在播出 默认为2
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        init : function(){
            var me = this, tipsRandom = getRandomArbitrary(1,3);
            me.event();
            me.ddtj();
            me.current_time();
        },
        event: function(){
            $("#btn-back").click(function(e){
                e.preventDefault();
                $('#btn-back').addClass('tada');
                setTimeout(function()
                {
                    $('#btn-back').removeClass('tada');
                },1000);
                toUrl('index.html');
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
                            $(me).find('ul li:first').appendTo($ul);
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                };
            });
        },
        imgMath: function() {//随机背景
            if(H.lottery.yaoBg.length >0){
                var i = Math.floor((Math.random()*H.lottery.yaoBg.length));
                $("body").css("backgroundImage","url('"+H.lottery.yaoBg[i]+"')");
            }
        },
        shake_listener: function() {
            recordUserOperate(openid, "摇奖","shakeLottery");
            if(H.lottery.isCanShake){
                 H.lottery.isCanShake = false;
            }else{
                return;
            }
            $(".yao-cool-tips").addClass("none");
            $(".yao-cool-tips").removeClass("none-tips");
            // H.lottery.times++;
            // if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
            //     H.lottery.isToLottey = false;
            // }
            if(!$(".yao-bg").hasClass("yao")) {

                $("#audio-a").get(0).play();
                $(".yao-content img").addClass("shaking");
                setTimeout(function(){
                	$(".yao-content img").removeClass("shaking");
                }, 600);
                $(".yao-bg").addClass("yao");
            }
            if(!openid || openid=='null' || H.lottery.isToLottey == false){
                setTimeout(function(){
                    H.lottery.fill(null);//摇一摇
                }, 700);
            }else{
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        ddtj: function() {
              $('#ddtj').addClass('none');
              getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
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
             recordUserOperate(openid, "调用抽奖接口","doLottery");
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
                },
                success : function(data) {
                    if(data.result == true){
                        H.lottery.nowTime = timeTransform(data.sctm);
                        H.lottery.currentPrizeAct(data);
                    }else{
                        if(H.lottery.repeat_load){
                            H.lottery.repeat_load = false;
                            setTimeout(function(){
                                H.lottery.current_time();
                            },5000);
                        }else{
                            hidenewLoading();
                            $(".countdown").removeClass("none");
                            $('.countdown-tip').text("活动尚未开始");
                            $('.detail-countdown').text("");
                            $('.index-join').css("background-image",'url("./images/index-join-grey.png")');
                            H.lottery.isCanShake = false;
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                     hidenewLoading();
                    $(".countdown").removeClass("none");
                    $('.countdown-tip').text("活动尚未开始");
                    $('.detail-countdown').text("");
                     //修改首页按钮颜色
                    $('.index-join').css("background-image",'url("./images/index-join-grey.png")');
                    H.lottery.isCanShake = false;
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
            var me = this, nowTimeStr = H.lottery.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [];
            var day = nowTimeStr.split(" ")[0];
            if(prizeActListAll && prizeActListAll.length > 0) {
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day) {
                        prizeActList.push(prizeActListAll[i]);
                    }
                };
            }
            H.lottery.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0) {
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et, nowTimeStr) >= 0) {  //如果最后一轮结束
                    H.lottery.change();
                    return;
                }
                //config微信jssdk
            
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >=0){
                        H.lottery.index = i;
                        H.lottery.nowCountdown(prizeActList[i]);
                        H.lottery.initCount();
                        hidenewLoading();
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.lottery.index = i;
                        H.lottery.beforeShowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                }
            }else{
                return;
            }
        },
        initCount:function(){
            // 可以抽奖的时候再去调用 pv 剩余红包数  中奖纪录接口
            setTimeout(function(){
                H.lottery.account_num();
            },this.PVTime);
          
            setInterval(function(){
                H.lottery.leftPrizeCount();
            },this.leftPrizeCountTime);
        },
        change: function(){
            H.lottery.indexFlag = 1;
            hidenewLoading();
            $(".countdown-tip").html('本期摇奖已结束');
            $('.detail-countdown').html("");
            $(".countdown").removeClass("none");

             //修改首页按钮颜色
            $('.index-join').css("background-image",'url("./images/index-join-grey.png")');
            H.lottery.isCanShake = false;

        },
        // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            H.lottery.indexFlag = 1;
            H.lottery.type = 1;
            H.lottery.isCanShake = false;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            var nowTime = Date.parse(new Date())/1000;
            var serverTime = timestamp(H.lottery.nowTime);
            if(nowTime > serverTime){
                beginTimeLong += (nowTime - serverTime);
            }else if(nowTime < serverTime){
                beginTimeLong -= (serverTime - nowTime);
            }
            H.lottery.dec = serverTime - nowTime;
            $(".countdown-tip").html('距摇奖开启还有 ');
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.lottery.count_down();
            $('.countdown').removeClass('none');

            //修改首页按钮颜色
           
            $('.index-join').css("background-image",'url("./images/index-join-grey.png")');
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            H.lottery.indexFlag = 2;
            H.lottery.isCanShake = true;
            H.lottery.type = 2;
            if(pra.bi.length > 0){
                H.lottery.yaoBg = pra.bi.split(",");
            }
            H.lottery.downloadImg();
            H.lottery.isLottery = true ;
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            var nowTime = Date.parse(new Date())/1000;
            var serverTime = timestamp(H.lottery.nowTime);
            if(nowTime > serverTime){
                beginTimeLong += (nowTime - serverTime);
            }else if(nowTime < serverTime){
                beginTimeLong -= (serverTime - nowTime);
            }

            $('.detail-countdown').attr('etime',beginTimeLong);
            $(".countdown-tip").html("距本轮摇奖结束还有");
            H.lottery.count_down();
             H.lottery.index++;
            $(".countdown").removeClass("none");

            //修改首页按钮颜色
            $('.index-join').css("background-image",'url("./images/index-join.png")');
            //去掉首页倒计时
            $("#index-time").addClass("none");
            hidenewLoading();
        },
        refreshCountdown:function(pra,dec){
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
            $('.detail-countdown').attr('etime',beginTimeLong);
            $(".countdown-tip").html("距本轮摇奖结束还有");
            H.lottery.count_down();
            $(".countdown").removeClass("none");
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({ 
                    etpl : '%H%' + '时' + '%M%' + '分' + '%S%'+'秒', // 还有...结束
                    stpl : '%H%' + '时' + '%M%' + '分' + '%S%'+'秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true
                        if(H.lottery.type == 1){
                            //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                            if(!H.lottery.isTimeOver){
                                H.lottery.isTimeOver = true;
                                $('.countdown-tip').html('请稍后');
                                shownewLoading();
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
                                shownewLoading();
                                setTimeout(function() {
                                    H.lottery.beforeShowCountdown(H.lottery.pal[H.lottery.index]);
                                }, 1000);
                            }
                        }else{
                            H.lottery.isCanShake = false;
                        }
                        return;
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
                url : domain_url + 'api/lottery/exec/luck',
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
                error : function() {
                    sn = new Date().getTime()+'';
                    H.lottery.lottery_point(null);
                }
            });
        },
        fill : function(data){
            setTimeout(function() {
                $(".yao-bg").removeClass("yao");
            },300);
            if(data == null || data.result == false || data.pt == 0){
                //$("#audio-a").get(0).pause();
                $(".yao-cool-tips").removeClass("none");
                $(".yao-cool-tips").addClass(" none-tips");
                H.lottery.isCanShake = true;
                return;
            }else{
                //$("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();//中奖声音
            }
            if(data.pt == 7 || data.pt == 9){
                //卡券，外链
                H.dialog.lottery.open(data);
            }else if(data.pt == 1){
                //兑换码或者实物奖
                H.dialog.lottery.open(data);
            }
        },
        lottery_point : function(data){
            setTimeout(function(){
                H.lottery.fill(data);
            },700);
        }
     
    };

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
    W.commonApiPromotionHandler = function(data){
	    if (data.code == 0 && data.desc && data.url) {
	      $('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
	    } else {
	      $('#ddtj').remove();
          $('.yao-content').css("margin-top",'45px');
	    };
	}
     W.commonApiSPVHander =  function(data){

     };

})(Zepto);

$(function() {
    H.lottery.init();
  });
