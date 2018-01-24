/**
 * 男过女人关-抽奖
 */
(function($) {
    H.lottery = {
        $textb: $(".textb"),
        isLottery :false,
        nowTime :null,
        isCanShake:true,
        times:0,
        isToLottey:true,
        isTimeOver: false,
        first: true,
        lotteryTime:getRandomArbitrary(1,3),
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
        token: null,
        phone: null,
        init : function(){
            this.event();
            this.current_time();
            this.shake();
            this.refreshDec();
            setInterval(function(){
                H.lottery.account_num();
            },this.allRecordTime);
            this.red_record();
        },
        event: function() {
            $("#test").click(function(e){
                H.lottery.shake_listener();
            });
             $("#btn-cor").click(function(e){
               	e.preventDefault();
               	if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				shownewLoading();
               	$(".nav-bottom").css({
               		'background-image': 'url(../images/nav-bottom.png) no-repeat center',
					'background-size': '100%',
               		'background-position':'0% 100%'
               	});
               	toUrl("talk.html");
            });
            $("#btn-yao").click(function(e){
               	e.preventDefault();
               
               	return;
            });
        },
          //查询当前参与人数
        account_num: function(){
		       getResult('api/common/servicedaypv ', {}, 'commonApiSDPVHander');
		},
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        scroll: function() {
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
                        $(me).find('ul').animate({'margin-top': '-26px'}, delay, function() {
                            $(me).find('ul li:first').appendTo($ul)
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                }
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
                            var nowTime = new Date().getTime();
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
                url : domain_url + 'api/lottery/round' + dev,
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
                var i = Math.floor((Math.random()*H.lottery.yaoBg.length));
                $("body").css({
                	"backgroundImage":"url('"+H.lottery.yaoBg[i]+"')",
                	"background-repeat": "no-repeat",
					"background-size": "100% auto",
					"background-position": "center center"
				});
            }
        },
        shake_listener: function() {
            
            if(H.lottery.type != 2){
                $(".countdown").addClass("shake");
                setTimeout(function(){
                    $(".countdown").removeClass("shake");
                },1000);
                return;
            }
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
                    '-webkit-transform': 'translate(0px,-90px)'
                });
                $(".home-box .m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,90px)'
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
                if(!H.lottery.wxCheck){
                    setTimeout(function(){
                        H.lottery.fill(null);//摇一摇
                    }, 2000);
                    return;
                }
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        //查询最新20条中奖记录
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
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
                //config微信jssdk
                H.lottery.wxConfig();
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        H.lottery.index = i;
                        H.lottery.nowCountdown(prizeActList[i]);
                        hidenewLoading();
                        // 可以抽奖的时候再去调用中奖纪录接口
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
        // 距下次摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            H.lottery.type = 1;
            H.lottery.isCanShake = false;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.lottery.dec;
            $(".countdown-tip").html('距摇奖开启还有 ');
            $('.detail-countdown').attr('etime',beginTimeLong);
            $(".yao-icon").removeClass("wobble");
            H.lottery.count_down();
            $('.countdown').removeClass('none');
            H.lottery.repeatCheck = true;
           hidenewLoading();
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
            $(".countdown-tip").html("距摇奖结束还有");
            H.lottery.count_down();
            $(".countdown").removeClass("none");
            H.lottery.index ++;
            H.lottery.repeatCheck = true;
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + '时'+'%M%' + '分' + '%S%' + '秒', // 还有...结束
                    stpl : '%H%' + '时'+'%M%' + '分' + '%S%' + '秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.lottery.repeatCheck){
                            H.lottery.repeatCheck = false;
                            shownewLoading();
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
            $(".countdown-tip").html("今日摇奖结束");
            $(".countdown").removeClass("none");
            $(".yao-icon").removeClass("wobble");
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
            me.lotteryTime = getRandomArbitrary(1,3);
            me.times = 0;
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
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
                            if(data.pt != 0){
                            	H.lottery.lottery_point(data);
                            }else{
                            	H.lottery.lottery_point(null);
                            } 
                        }else{
	                        sn = new Date().getTime()+'';
	                        H.lottery.lottery_point(null);
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
        textMath: function() {//随机文案
            var me = this;
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));
                me.$textb.text(textList[i]);
            }
        },
        fill : function(data){
            setTimeout(function() {
                $(".home-box").removeClass("yao");
                H.lottery.imgMath();
            },300);
            if(data == null || data.result == false || data.pt == 0){
                $("#audio-a").get(0).pause();
                H.lottery.thanks();
                return;
            }else{
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();//中奖声音
            }
            if(data.pt == 9 || data.pt == 7 || data.pt == 1 || data.pt == 4){
                H.dialog.lottery.open(data);
            }

        },
        thanks:function(){
            var me = this;
            $("#audio-a").get(0).pause();
            me.textMath();
            me.$textb.removeClass("none").css("opacity","0");
            me.$textb.addClass("yaonone-text").show();
            setTimeout(function(){
                me.$textb.removeClass("yaonone-text");
                me.$textb.css("opacity","1");
                if(H.lottery.type == 2){
                	me.isCanShake = true;
                }else{
                	me.isCanShake = false;
                }
                
            },1000);
        },
        lottery_point : function(data){
            setTimeout(function(){
                H.lottery.fill(data);
            }, 2000);
        }
    };

    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var list = data.rl;
            if(list && list.length>0){
                var con = "";
                for(var i = 0 ; i<list.length; i++){
                    con +="<li><i class='coin'></i>"+(list[i].ni || "匿名用户")+"中了"+list[i].pn+"</li>";
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
    W.commonApiSDPVHander = function(data){
		if(data.code == 0){
			$(".count label").html(parseInt(2000+data.c));
			$(".count").removeClass("hidden");
		}
	}
})(Zepto);

$(function() {
    shownewLoading();
   
    var hei = $(window).height();
    $("body").css("height",hei+"px");
    if(is_android()){
        $(".main-top").css("height",(hei/2+0.5)+"px");
        $(".main-foot").css("height",(hei/2+0.5)+"px");
    }
     $(".nav-bottom").height($(window).width()*100/640-2).removeClass("hidden");
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
