(function($) {
    H.vote = {
        $home_box: $(".home-box"),
        $audio_a: $("#audio-a"),
        $textb: $(".textb"),
        $outer: $(".outer"),
        nowTime: null,
        isCanShake: false,
        isover:false,
        isyaoover:false,
        isvoteover:false,
        times: 0,
        PV:"",
        haslink:false,
        first:true,
        isToLottey:true,
        lotteryTime:getRandomArbitrary(1,5),
        yaoBg: [],
        voteinfo:"",
        guid:false,
        puid:"",
        pic:"",
        isret:null,
        cx:null,
        cy:null,
        isdown:false,
        winW:null,
        winH:null,
        isvover:false,
        isvote:false,
        isfill:false,
        istickets:true,
        hascallback:false,
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
            me.winW = $(window).width();
            me.winH = $(window).height();
            me.event();
            me.current_time();
            //me.shake();
            //me.jump();
            me.vote();
            me.refreshDec();
            me.tttj();
            //H.dialog.rule.open();
        },
        tttj: function() {
            if($("body").hasClass("ttlink")) {
                getResult("api/common/promotion", {
                    oi: openid
                }, commonApiPromotionHandler, false);
            }
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
                            //H.vote.dec = data.t - nowTime;
                            var nowTime = new Date().getTime();
                            H.vote.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
            $('body').css({
                'width': $(window).width(),
                //'height': $(window).height()
                'min-height':$(window).height()
            })
        },
        event: function(){
            var me = H.vote;
            $(".gototc").one("click", function () {
                toUrl("barrage.html");
            });
            $(".backtomain").on("click", function (e) {
                e.preventDefault();
                toUrl('index.html');
            });
            $(".godz").on("click", function (e) {
                e.preventDefault();
                toUrl('vote.html');
            });
            $('#btn-rank').click(function(e) {
                e.preventDefault();
                H.vote.isCanShake = false;
                $('#btn-rank').css({"-webkit-animation":"toggle 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).on("webkitAnimationEnd", function () {
                    H.dialog.rank.open();
                    $(".rank-dialog").css({"-webkit-animation":"dispshow 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("webkitAnimationEnd", function () {
                        $('.rank-dialog').css({"-webkit-animation":""});
                        $('#btn-rank').css({"-webkit-animation":""});
                    });
                });
            });
            $(".touch").on("touchstart", function (ts) {
                if (ts.targetTouches.length == 1) {
                    ts.preventDefault();
                    var touch = ts.targetTouches[0];
                }
                var consty = touch.pageY;
                $(".touch").on("touchmove", function (e) {
                    e.preventDefault;
                    e = e.changedTouches[0];
                    var y = e.pageY;
                    if(!me.isret){
                        if(me.isdown){
                            $(".zan-box").css("top",(y - me.winH)+"px");
                            me.cy = y - me.winH;
                            console.log(y + "  "+ consty + "  "+ (y - me.winH));
                        }else{
                            $(".zan-box").css("top",(consty + y - me.winH)+"px");
                            me.cy = consty + y - me.winH;
                            console.log(me.cy);
                        }
                    }
                }).one("touchend", function () {
                    me.isret = true;
                    if(me.cy - parseInt(me.winH * -0.7) > 0){
                        $(".zan-box").animate({"top":"0"},500,'ease-out',function () {
                            me.isret = false;
                            me.isdown = true;
                        });
                    }else{
                        me.isret = true;
                        $(".zan-box").animate({"top":"-90%"},500,'ease-out',function () {
                            me.isret = false;
                        });
                    }
                })
            })
        },
        resize: function (self) {
            var winW = $(window).width();
            $(self).css({"width":$(window).width()*0.4,"height":($(window).width()*0.4)*0.7});
        },
        vote: function () {
            var me = H.vote;
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud'+dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.code == 0){
                        H.vote.voteinfo = data;
                        H.vote.chktime(data);
                    }else if(data.code == 4){
                        H.vote.voteinfo = data;
                        H.vote.chktime(data,true);
                        //$(".ltl").css("opacity","1");
                    } else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.current_time();
                            },500);
                        }else{
                            me.isToLottey = false;
                            me.change();
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        chktime: function (data) {
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
                success : function(serverdata) {
                    hidenewLoading();
                    $(".ltnum").css("opacity","0");
                    if(serverdata.t){
                        var serverT = serverdata.t;
                        var hasvote = false;
                        for(var i = 0;(i<=data.items.length - 1);i++){
                            var st = timestamp(data.items[i].gst);
                            var et = timestamp(data.items[i].get);
                            //alert(JSON.stringify(data.items[i]));
                            //if((serverT>st)&&(serverT<et)){
                                hasvote = true;
                                //$(".voteinfo>div").html(data.items[i].pitems[0].na);
                                //$(".voteinfo>p").html(data.items[i].pitems[0].ni);
                                for(var a = 0; a < data.items[i].pitems.length;a++){
                                    H.vote.guid = data.items[i].guid;
                                    H.vote.puid += data.items[i].pitems[a].pid;
                                    H.vote.pic = data.items[i].pitems[a].im;
                                    var infoData = "";
                                    infoData += '<div class="zan" id="' + data.items[i].pitems[a].pid + '"><div class="voteinfo"><div>' + data.items[i].pitems[a].na + '</div></div>';
                                    infoData += '<a href="#" class="zan-btn" puid="' + data.items[i].pitems[a].pid + '" guid="' + data.items[i].guid + '" data-collect="true" data-collect-flag="vote-sign" data-collect-desc="点赞按钮">为TA亮灯</a>';
                                    //infoData += '<div class="zan-bg"><img class="baby" id="baby" src="' + H.vote.pic + '" /></div>';
                                    infoData += '<div class="zan-per"><span></span></div>';
                                    if(data.items[i].pitems[a].re == "0"){
                                        H.vote.isvoteover = true;
                                    }
                                    if(H.vote.isfill == false){
                                        $(".zan-box").append(infoData);
                                    }
                                    $(".baby").css("opacity","1");
                                }
                                //$(".zan").css("height",($(window).width() * 0.7)+"px");
                                getResult('api/voteguess/isvote', {yoi:openid,guid: H.vote.guid}, 'callbackVoteguessIsvoteHandler');
                                H.vote.isfill = true;
                            //}
                        }
                        if(hasvote == false){
                            //if(H.vote.isyaoover == false){
                            //}
                            H.vote.isvover = true;
                            $(".zan-box").removeClass("none").html('<div style="position:relative;width:100%;height:' + ($(window).height() *.75)+"px" + ';line-height:' + ($(window).height() *.75)+"px" + ';text-align: center;color:white">本期活动未开始</div>');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        zan: function (picdata,guid,puid) {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/guessplayer' +dev,
                data: {
                    yoi:openid,
                    guid: guid,
                    pluids: puid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessGuessHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    hidenewLoading();
                    if(data.code == 0){
                        //$(".ltl").css("opacity","1");
                        $(".zan").css("opacity","1");
                        $(".zan-btn").on("click", function () {
                            showTips("您已经投过票了");
                        });
                        $(".countdown").removeClass("none").one("click", function () {
                            toUrl("yao.html?vj=1");
                        });
                        showTips("投票成功");
                        $("#"+puid).find(".zand").css("display","block");
                    }else if(data.code == 4){
                        showTips("您已经投过票了");
                        $(".zan").css("opacity","1");
                        $(".zan-btn").on("click", function () {
                            showTips("您已经投过票了");
                        });
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        shake: function() {
            W.addEventListener('shake', H.vote.shake_listener, false);
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
            var me = H.vote;
            if(me.yaoBg.length >0){
                var i = Math.floor((Math.random()*me.yaoBg.length));
                $("body").css("backgroundImage","url('"+me.yaoBg[i]+"')");
            }
        },
        textMath: function() {//随机文案
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));
                H.vote.$textb.text(textList[i]);
            }
        },
        //查抽奖活动接口
        current_time: function(){
            var me = H.vote;
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

        //查询当前参与人数
        account_num: function(){
            //getResult('api/common/servicepv', {}, 'commonApiSPVHander');
            if(H.vote.guid !== false){
                getResult('api/voteguess/groupplayertickets', {groupUuid: H.vote.guid}, 'callbackVoteguessGroupplayerticketsHandler');
            }
        },
        initCount:function(){
            setInterval(function(){
                H.vote.account_num();
            },this.PVTime);
            //var recordDelay = Math.ceil(15000*Math.random() + 20000);
            //setTimeout(function(){
            //    H.vote.red_record();
            //}, recordDelay);
            //setInterval(function(){
            //    H.vote.red_record();
            //}, H.vote.allRecordTime);
            //setInterval(function(){
            //    H.vote.leftPrizeCount();
            //}, H.vote.leftPrizeCountTime);
        },
        downloadImg: function(){
            var t = simpleTpl(),me = H.vote;
            for(var i = 0;i < me.yaoBg.length;i++){
                t._('<img src="'+me.yaoBg[i]+'" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.vote.nowTime,
                $tips = $(".time-tips"),
                prizeActList = [],
                me = H.vote;
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
            var me = H.vote,
                beginTimeStr = pra.pd+" "+pra.st,
                beginTimeLong = timestamp(beginTimeStr);

            me.type = 1;
            beginTimeLong += me.dec;
            $(".countdown-tip").css("display","none").off();
            $(".countdown").addClass("none").off();
            $('.detail-countdown').attr('etime',beginTimeLong).addClass("none");
            me.count_down();
            shownewLoading();
            setTimeout(function () {
                H.vote.isvote = false;
                //H.vote.puid = "";
                $(".zan").find(".zand").css("display","none");
                me.chktime(H.vote.voteinfo);
            },(getRandomArbitrary(1,3)*1000));
            me.isCanShake = false;
            me.isover = true;
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            var me = H.vote,
                endTimeStr = pra.pd+" "+pra.et,
                beginTimeLong = timestamp(endTimeStr);
            me.type = 2;
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).addClass("none");
            $(".countdown-tip").css("display","block");
            me.count_down();
            me.index ++;
            me.isCanShake = true;
            me.isover = false;
        },
        // 倒计时
        count_down : function() {
            $('.detail-countdown').each(function() {
                var me = H.vote;
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
            shownewLoading();
            H.vote.isCanShake = false;
            $(".countdown").addClass("none").off();
            $(".countdown-tip").removeClass("none").css("display","none");
            H.vote.$textb.addClass("none");
            H.vote.isover = true;
            H.vote.isyaoover = true;
            //$(".shake").css({"-webkit-animation":""});
            //toUrl("over.html");
            if(H.vote.isvover == false){
                $(".zan-box").removeClass("none").html('<div style="position:relative;width:100%;height:' + ($(window).height() *.75)+"px" + ';line-height:' + ($(window).height() *.75)+"px" + ';text-align: center;color:white">本期活动已结束</div>');
            }
            hidenewLoading();
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
        if (data.code == 0) {
            var link = data.url.indexOf(';');
            var de = data.desc.indexOf(';');
            $('#tttj').removeClass('none').find('p').text(data.desc.substring(0,de) || '更多红包点击这里');
            $('#tttj').click(function(e) {
                e.preventDefault();
                location.href = data.url.substring(0,link)
            });
        } else {
            $('#tttj').remove();
        };
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
                if(H.vote.first){
                    H.vote.first = false;
                    H.vote.scroll();
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
    };
    W.callbackVoteguessGroupplayerticketsHandler = function(data){
        if(data.code == 0){
            var ttnumb = 0;
            for(var i=0;i<data.items.length;i++){
                ttnumb += data.items[i].cunt;
            }
            for(var a=0;a<data.items.length;a++){
                var zan = $("#"+data.items[a].puid).find(".zan-per");
                zan.find("span").html(data.items[a].cunt+"票");
                //var zanper = data.items[a].cunt/ttnumb;
                //if(zanper<0){zanper=0}if(zanper>1){zanper=1}
                //zan.find("div").find("p").css("width",Math.ceil(zanper*100)+"%");
            }
        }
    };
    W.callbackVoteguessIsvoteHandler = function(data){
        if((data.so == undefined)||(data.code == 0) && !(H.vote.puid.match(data.so))){
            $(".zan").css("opacity","1");
            if(H.vote.isvote == false){
                $(".zan-btn").off().on("click", function () {
                    var me = this;
                    shownewLoading();
                    $(".zan-btn").off();
                    H.vote.zan(H.vote.pic,H.vote.guid,$(me).attr("puid"));
                });
            }
        }else{
            $("#"+data.so).find(".zand").css("display","block");
            H.vote.isvote = true;
            $(".zan").css("opacity","1");
            $(".zan-btn").off().on("click", function () {
                showTips("您已经投过票了");
            });
            $(".countdown").removeClass("none").one("click", function () {
                toUrl("yao.html?vj=1");
            });
        }
        if(!H.vote.hascallback){
            H.vote.hascallback = true;
            H.vote.initCount();
        }
    };
})(Zepto);


$(function() {
    H.vote.init();
});
