/**
 * 超级旅行团-抽奖
 */
(function($) {
    H.lottery = {
        isLottery :false,
        isCanShake:true,
        times:0,
        isToLottey:false,
        lotteryTime:getRandomArbitrary(1,5),
        cardTimes:null,
        yaoBg:[],
        canJump:true,
        wxCheck:false,
        dec: 0,
        isError: false,
        init : function(){
            this.event();
            this.current_time();
            this.shake();
            H.lottery.account_num();
            setInterval(function(){
                H.lottery.account_num();
            },5000);
            H.lottery.cardTimes = getRandomArbitrary(2, H.lottery.lotteryTime);
        },
        event: function() {
            $("#test").click(function(e){
                H.lottery.shake_listener();
//                H.dialog.card.open();
            });
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            getResult("mp/jsapiticket", {
                appId: shaketv_appid
            }, 'callbackJsapiTicketHandler', false);
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        imgMath: function() {//随机背景
            if(H.lottery.yaoBg.length >0){
                var i = Math.floor((Math.random()*H.lottery.yaoBg.length));;
                $("body").css("backgroundImage","url('"+H.lottery.yaoBg[i]+"')");
            }
        },
        textMath: function() {//随机文案
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));;
                $(".textb").text(textList[i]);
            }
        },
        shake_listener: function() {
            if(H.lottery.isCanShake){
                H.lottery.isCanShake = false;
            }else{
                return;
            }
            recordUserOperate(openid, "超级旅行团摇手机", "lvyou-tour-shake");
            recordUserPage(openid, "超级旅行团摇手机", 0);

            if(!$(".home-box").hasClass("yao")) {
                $("#audio-a").get(0).play();
                H.lottery.imgMath();
                $(".textb").removeClass("yaonone-text");
                $(".home-box").addClass("yao");
            }

            H.lottery.times++;
            if(H.lottery.times % H.lottery.lotteryTime == 0){
                H.lottery.isToLottey = true;
            }else if(H.lottery.times % H.lottery.cardTimes == 0){
                //主持人卡片
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();//中奖声音
                setTimeout(function(){
                    H.dialog.funny.open();
                    $(".home-box").removeClass("yao");
                },500);
                return;
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
                H.lottery.isToLottey = false;
            }
        },
        //查询当前参与人数
        account_num: function(){
            getResult('log/serpv ', {}, 'callbackCountServicePvHander');
        },

        //查抽奖活动接口
        current_time: function(){
            getResult('api/lottery/round', 'callbackLotteryRoundHandler',true);
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
                nowTimeStr = timeTransform(data.sctm),
                prizeActList = data.la,
                me = this;
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.change();
                    return;
                }
                //config微信jssdk
                me.wxConfig();
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        if(prizeActList[i].bi.length>0){
                            me.yaoBg = prizeActList[i].bi.split(",");
                        }
                        me.downloadImg();
                        me.isLottery = true ;
                        var beginTimeLong = timestamp(endTimeStr);
                        $('.detail-countdown').attr('etime',beginTimeLong);
                        beginTimeLong += me.dec;
                        me.count_down();
                        $(".countdown").removeClass("none");
                        hidenewLoading();
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.change();
                        return;
                    }

                }
            }else{
                me.change();
            }
        },
        change: function(){
            toUrl("index.html");
        },
        // 倒计时
        count_down : function() {
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl : '%H%' + '<label class="dian">小时</label>' + '%M%' + '<label class="dian">分</label>' + '%S%'+'<label class="dian">秒</label>', // 还有...结束
                    stpl : '%H%' + '<label class="dian">小时</label>' + '%M%' + '<label class="dian">分</label>' + '%S%'+'<label class="dian">秒</label>', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        if(H.lottery.canJump){
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
            me.lotteryTime = getRandomArbitrary(1,4);
            me.times = 0;
            me.cardTimes = getRandomArbitrary(2, me.lotteryTime);
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: { oi: openid , sn: sn },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                timeout: 10000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.result){
                        if(data.sn == sn){
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
            var me = this;
            setTimeout(function() {
                $(".home-box").removeClass("yao");
            },300);
            if(data == null || data.result == false || data.pt == 0){
                $("#audio-a").get(0).pause();
                $("#audio-c").get(0).play();//不中奖声音
                $(".texta").addClass("none");
                me.textMath();
                $(".textb").removeClass("none");
                $(".textb").addClass("yaonone-text").show();
                me.isCanShake = true;
                return;
            }else{
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();//中奖声音
            }
            H.dialog.fudai.open(data);

        },
        lottery_point : function(data){
            setTimeout(function(){
                H.lottery.fill(data);
            }, 1000);
        }
    };

    W.callbackLotteryRoundHandler = function(data){
        if(data.result == true){
            H.lottery.dec = new Date().getTime() - data.sctm;
            H.lottery.currentPrizeAct(data);
        }else{
            H.lottery.change();
        }
    };

    W.callbackCountServicePvHander = function(data){
        if(data.code == 0){
            $(".count p").html(data.c);
            $(".count").removeClass("none");
        }
    }

    W.callbackJsapiTicketHandler = function(data) {
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
                "addCard"
            ]
        });
    };
})(Zepto);

$(function() {
    var hei = $(window).height();
    $("body").css("height",hei+"px");
    if(is_android()){
        $(".main-top").css("height",(hei/2+0.5)+"px");
        $(".main-foot").css("height",(hei/2+0.5)+"px");
    }
    shownewLoading();
    //执行业务代码
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
    });

    wx.error(function(res){
        H.lottery.isError = true;
//        alert(JSON.stringify(res));
    });
});
