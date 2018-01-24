(function($) {
    H.yao = {
        $home_box: $(".home-box"),
        $audio_a: $("#audio-a"),
        $textb: $(".textb"),
        $outer: $(".outer"),
        nowTime: null,
        isToLottey:true,
        isCanShake: true,
        isTimeOver:false,//有无倒计时标识
        isLotteryTime:false,//是否在抽奖时间段表识
        isSbtRed: false,
        times: 0,
        first: true,
        lotteryTime: getRandomArbitrary(3,5),
        yaoBg: [],
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        init: function(){
            var me = this;
            me.event();
            me.current_time();
            me.shake();
            me.tttj();
        },
        //查抽奖活动接口
        current_time: function(){
            getResult('api/lottery/round',{}, 'callbackLotteryRoundHandler',true);
        },
        shake: function() {
            W.addEventListener('shake', H.yao.shake_listener, false);
        },
        downloadImg: function(){
            var t = simpleTpl(),me = H.yao;
            for(var i = 0;i < me.yaoBg.length;i++){
                t._('<img src="'+me.yaoBg[i]+'" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
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
                $('.yao-text').text(textList[i]);
            }
        },
        shake_listener: function() {
            var me = H.yao;
            if (me.isTimeOver) {
                //没有倒计时在进行，不能摇
                return;
            }
            if (!me.isLotteryTime) {
                //非摇奖时间，不能摇
                return;
            }
            if(me.isCanShake){
                me.isCanShake = false;
            }else{
                return;
            }
            recordUserOperate(openid, "摇奖", "shakeLottery");
            recordUserPage(openid, "摇奖", 0);
            me.times++;

            if(!(me.times % me.lotteryTime == 0)){
                me.isToLottey = false;
            }
            if(!me.$home_box.hasClass("yao")) {
                me.$audio_a.get(0).play();
                me.imgMath();
                me.$home_box.addClass("yao");
                $('.yao-text').animate({'opacity':'0','-webkit-transform':'scale(0)'}, 100, function(){
                    $(this).addClass('none');
                });
            }
            if(!openid || openid=='null' || me.isToLottey == false){
                setTimeout(function(){
                    me.fill(null);//摇一摇
                }, 1500);
            }else{
                /*if(!me.wxCheck){
                    //微信config失败
                    setTimeout(function(){
                        me.fill(null);//摇一摇
                    }, 1500);
                    return;
                }*/
                me.drawlottery();
                // setTimeout(function(){
                //     me.drawlottery();
                // }, 1500);
            }
            me.isToLottey = true;
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
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.change();
                    return;
                }
                //config微信jssdk
                //me.wxConfig();
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        if(prizeActList[i].bi.length>0){
                            me.yaoBg = prizeActList[i].bi.split(",");
                        }
                        me.do_count_down(endTimeStr,nowTimeStr,true);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.do_count_down(beginTimeStr,nowTimeStr,false);
                        return;
                    }
                }
            }else{
                me.change();
                return;
            }
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
            H.yao.isCanShake = false;
            $(".countdown").removeClass("none").html('本期摇奖已结束，请等待下期!');
            H.yao.$textb.addClass("none");
        },
        do_count_down: function(endTimeStr,nowTimeStr,isStart){
            var me = H.yao;
            if(isStart){
                me.downloadImg();
                me.isLotteryTime = true;
                $(".countdown").html('距离摇奖结束还有<span class="detail-countdown"></span>');
            }else{
                me.isLotteryTime = false;
                me.$textb.addClass("none");
                $(".countdown").html('距离摇奖开启还有<span class="detail-countdown"></span>');
            }
            var endTimeLong = timestamp(endTimeStr);
            var nowTime = Date.parse(new Date())/1000;
            var serverTime = timestamp(nowTimeStr);
            if(nowTime > serverTime){
                endTimeLong += (nowTime - serverTime);
            }else if(nowTime < serverTime){
                endTimeLong -= (serverTime - nowTime);
            }
            $('.detail-countdown').attr('etime',endTimeLong);
            H.yao.count_down();
            $(".countdown").removeClass("none");
        },
        // 倒计时
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
                    stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        H.yao.isTimeOver = true;
                        $(".countdown").html('加载中...');
                        shownewLoading();
                        var delay = Math.ceil(2500*Math.random() + 1700);
                        setTimeout(function(){
                            hideLoading();
                            console.log(1);
                            H.yao.current_time();
                        }, delay);
                    },
                    sdCallback :function(){
                        H.yao.isTimeOver = false;
                    }
                });
            });
        },
        drawlottery:function(){
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            shownewLoading(null, '抽奖中，请稍后...');
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck' + dev,
                data: {
                    matk: matk
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                complete: function() {
                    // hidenewLoading();
                },
                success : function(data) {
                    H.yao.lottery_point(data);
                },
                error : function() {
                    H.yao.lottery_point(null);
                }
            });
        },
        fill : function(data){
            hidenewLoading();
            var me = H.yao;
            setTimeout(function() {
                me.$home_box.removeClass("yao");
            },300);
            if(data == null || data.result == false || data.pt == 0){
                me.not_winning();
                me.isCanShake = true;
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
        not_winning: function(){
            var me = H.yao;
            me.$audio_a.get(0).pause();
            //$("#audio-c").get(0).play();//不中奖声音
            me.textMath();
            $('.yao-text').removeClass('none').animate({'opacity':'1','-webkit-transform':'scale(1)'}, 200);
        },
        lottery_open: function(data){
            var me = H.yao;
            if(data){
                if(data.result == true){
                    if (data.pt == 1) {
                        H.dialog.lottery.open(data);
                    } else if (data.pt == 4) {
                        H.dialog.redbagLottery.open(data);
                    } else if (data.pt == 5) {
                        H.dialog.lottery.open(data);
                    } else if (data.pt == 7) {
                        H.dialog.wxcardLottery.open(data);
                    } else if (data.pt == 9) {
                        H.dialog.linkLottery.open(data);
                    } else {
                        me.not_winning();
                    }
                }
            }
        },
        event: function(){
            var me = this;
            $("#test").click(function(e){
                e.preventDefault();
                me.wxCheck = true;
                me.lotteryTime = 1;
                me.shake_listener();
            });
        },
        tttj: function() {
            $('#tttj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };
    W.callbackLotteryRoundHandler = function(data){
        var me = H.yao;
        if(data.result == true){
            me.nowTime = timeTransform(data.sctm);
            me.currentPrizeAct(data);
        }else{
            me.change();
        }
    };
    W.commonApiPromotionHandler = function(data){
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
    H.yao.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                if(t && !H.yao.isError){
                    H.yao.wxCheck = true;
                }
            }
        });
    });
    wx.error(function(res){
        H.yao.isError = true;
    });
});
