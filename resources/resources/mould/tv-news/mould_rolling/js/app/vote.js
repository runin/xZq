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
        PVTime: Math.ceil(2000*Math.random() + 8000),
        isTimeOver: false,
        init: function(){
            var me = this;
            me.event();
            me.current_time();
            //me.shake();
            //me.jump();
            me.vote();
            me.refreshDec();
            //me.tttj();
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
            $(".btn-tocomment").on("click", function (e) {
                e.preventDefault();
                toUrl('comment.html');
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
                            if((serverT>st)&&(serverT<et)){
                                hasvote = true;
                                //$(".voteinfo>div").html(data.items[i].pitems[0].na);
                                //$(".voteinfo>p").html(data.items[i].pitems[0].ni);
                                for(var a = 0; a < data.items[i].pitems.length;a++){
                                    H.vote.guid = data.items[i].guid;
                                    H.vote.puid += data.items[i].pitems[a].pid;
                                    H.vote.pic = data.items[i].pitems[a].im;
                                    var infoData = "";
                                    infoData += '<div class="praise" id="' + data.items[i].pitems[a].pid + '"><div class="voteinfo"></div>';
                                    infoData += '<a href="#" class="praise-btn" puid="' + data.items[i].pitems[a].pid + '" guid="' + data.items[i].guid + '" data-collect="true" data-collect-flag="vote-sign" data-collect-desc="点赞按钮"></a>';
                                    infoData += '<div class="praise-bg"><p>' + data.items[i].pitems[a].in + '</p></div>';
                                    infoData += '<div class="praise-per"><p>' + data.items[i].pitems[a].in + '</p><span></span><div><p></p></div></div>';
                                    if(data.items[i].pitems[a].re == "0"){
                                        H.vote.isvoteover = true;
                                    }
                                    if(H.vote.isfill == false){
                                        $(".praise-box").append(infoData);
                                    }
                                    $(".baby").css("opacity","1");
                                }
                                $(".tt").html(data.items[i].t);
                                $(".voteinfo").css("height",($(window).width() * 0.1)+"px");
                                getResult('api/voteguess/isvote', {yoi:openid,guid: H.vote.guid}, 'callbackVoteguessIsvoteHandler');
                                H.vote.isfill = true;
                            }
                        }
                        if(hasvote == false){
                            //if(H.vote.isyaoover == false){
                            //}
                            H.vote.isvover = true;
                            //$(".praise-box").removeClass("none").html('<div style="position:relative;width:100%;height:' + ($(window).height() *.75)+"px" + ';line-height:' + ($(window).height() *.75)+"px" + ';text-align: center;color:white">本期活动未开始</div>');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        praise: function (picdata,guid,puid) {
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
                        showTips("投票成功");
                        H.vote.changeBg($("#"+puid),1);
                    }else if(data.code == 4){
                        $(".praise-bg").addClass('none');
                        $(".praise-per").removeClass('none');
                        showTips("您已经投过票了");
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        changeBg: function (self,type) {
            if(self.find('.voteinfo').css('background').match('A')){
                self.find('.voteinfo').css({'background':'url("images/A-p.png") no-repeat','background-size':'100% 100%'});
                self.find('.praise-per').find('div').find('p').css({'background':'url("images/prg.jpg") no-repeat','backgroundSize':'100% 12px'});
            }else if(self.find('.voteinfo').css('background').match('B')){
                self.find('.voteinfo').css({'background':'url("images/B-p.png") no-repeat','background-size':'100% 100%'});
                self.find('.praise-per').find('div').find('p').css({'background':'url("images/prg.jpg") no-repeat','backgroundSize':'100% 12px'});
            }else{
                self.find('.voteinfo').css({'background':'url("images/C-p.png") no-repeat','background-size':'100% 100%'});
                self.find('.praise-per').find('div').find('p').css({'background':'url("images/prg.jpg") no-repeat','backgroundSize':'100% 12px'});
            }
            if(type == 1){
                self.find('.praise-bg').css({'background':'url("images/zan-pick.png") no-repeat','background-size':'100% 100%'});
                setTimeout(function () {
                    $(".praise").css("opacity","1");
                    $(".praise-btn").off();
                    $(".praise-bg").addClass('none');
                    $(".praise-per").removeClass('none');
                },2000);
            }else{
                $(".praise").css("opacity","1");
                $(".praise-btn").off();
                $(".praise-bg").addClass('none');
                $(".praise-per").removeClass('none');
            }
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
            H.vote.account_num();
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
            $(".countdown-tip").removeClass("none").html('距摇奖开始还有');
            $(".countdown").removeClass("none").off();
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("none");
            me.count_down();
            shownewLoading();
            setTimeout(function () {
                H.vote.isvote = false;
                //H.vote.puid = "";
                //$(".praise").find(".praised").css("display","none");
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
            $(".countdown").removeClass("none").on("click", function () {
                toUrl("lottery.html");
            });
            $('.detail-countdown').attr('etime',beginTimeLong).addClass("none");
            $(".countdown-tip").html('点我去摇奖');
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
            //if(H.vote.isvover == false){
            //    $(".praise-box").removeClass("none").html('<div style="position:relative;width:100%;height:' + ($(window).height() *.75)+"px" + ';line-height:' + ($(window).height() *.75)+"px" + ';text-align: center;color:white">本期活动已结束</div>');
            //}
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
            var ttnumb = 0, per = 0;
            for(var i=0;i<data.items.length;i++){
                ttnumb += data.items[i].cunt;
            }
            for(var a=0;a<data.items.length;a++){
                var praise = $("#"+data.items[a].puid).find(".praise-per");
                var praiseper = data.items[a].cunt/ttnumb;
                if(praiseper<0){praiseper=0}if(praiseper>1){praiseper=1}
                if(data.items.length == (a+1)){
                    praise.find("span").html((100 - per)+"%");
                }else{
                    per += Math.floor(praiseper*100);
                    praise.find("span").html(Math.floor(praiseper*100)+"%");
                }
                praise.find("div").find("p").css("width",Math.floor(praiseper*100)+"%");
            }
        }
    };
    W.callbackVoteguessIsvoteHandler = function(data){
        if((data.so == undefined)||(data.code == 0) && !(H.vote.puid.match(data.so))){
            $(".praise").css("opacity","1");
            //$(".ltl").css("opacity","0");
            if(H.vote.isvote == false){
                $(".praise-bg").removeClass('none');
                $(".praise-per").addClass('none');
                $(".praise-btn").on("click", function () {
                    shownewLoading();
                    $(".praise-btn").off();
                    H.vote.praise(H.vote.pic,H.vote.guid,$(this).attr("puid"));
                });
            }
        }else{
            //$("#"+data.so).find(".praised").css("display","block");
            H.vote.isvote = true;
            H.vote.changeBg($("#"+data.so),0);
            //    .on("click", function () {
            //    showTips("您已经投过票了");
            //});
            //$(".countdown").removeClass("none").one("click", function () {
            //    toUrl("yao.html?vj=1");
            //});
        }
        if(!H.vote.hascallback){
            H.vote.hascallback = true;
            H.vote.initCount();
        }
    };

    H.comments = {
        actUid : null,
        page : 0,
        beforePage : 0,
        pageSize:10,
        item_index : 0,
        commActUid: "",
        loadmore : true,
        isCount : true,
        expires: {expires: 7},
        hotIsZ:[],
        attrUuid: null,
        init : function(){
            H.comments.resize();
        },
        resize: function () {
            var winW = $(window).width(),winH=$(window).height(),hotH=winH*.35;
            $(".praise-box").css({"top":(winH *.06+28)+"px","height":hotH});
            $(".hot-head").css("top",(winH *.08+hotH+28)+"px");
            $(".hot-body").css({"top":(winH *.1+hotH+56)+"px","height":(winH *.84-hotH-106)+"px"});
            H.comments.event_handler();
        },
        event_handler: function() {
            var me = this;
            $('body').delegate('.show-all', 'click', function(e) {
                e.preventDefault();
                var $class_all = $(this).parent('div').find('.all-con');
                $class_all.find('span').toggleClass('all');
                if( $class_all.find('span').hasClass('all')){
                    $(this).text('^显示全部');
                }else{
                    $class_all.css('height','auto');
                    $(this).text('^收起');
                }
            }).delegate('.baoliao', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('clue.html');
                }
            }).delegate('.countdown', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('lottery.html');
                }
            });

            $(window).scroll(function(){
                var scroH = $(this).scrollTop(),
                    $fix = $('.fix');
                if(scroH > 0){
                    $fix.removeClass('none');
                    $(".top-back").removeClass('none');
                }else if(scroH == 0){
                    $fix.addClass('none');
                    $(".top-back").addClass('none');
                }
            });

            var range = 2, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;
            $('header').scroll(function(){
                var srollPos = $('header').scrollTop();
                totalheight = parseFloat($('header').height()) + parseFloat(srollPos);
                if (($('#sx-ul').height() - range) <= totalheight  && H.comments.page < maxpage && H.comments.loadmore) {
                    if ($('#qy_loading').length > 0) {
                        return;
                    }
                    H.comments.getList(H.comments.page);
                }
            });

            $("#send").click(function(){
                if($.trim($("#comments-info").val()).length == 0){
                    showTips("什么都没有说呢");
                    return false;
                } else if ($.trim($("#comments-info").val()).length < 3){
                    showTips("多说一点吧！至少3个字哦");
                    return false;
                } else if ($.trim($("#comments-info").val()).length > 100){
                    showTips("评论字数不能超过100个字哦");
                    return false;
                }
                //if(!$.trim($("#comments-info").val())){
                //    showTips('请填写评论');
                //    $("#comments-info").focus();
                //    return;
                //}
                if(openid != null){
                    $("#send").attr("disabled","disabled");
                    $("#comments-info").attr("disabled","disabled");
                    if(headimgurl != null && headimgurl.indexOf("./images/avatar.png") > 0){
                        headimgurl='';
                    }
                    getResult('api/comments/save', {
                        co:encodeURIComponent($("#comments-info").val()),
                        op:openid,
                        tid:H.comments.commActUid,
                        ty:1,
                        pa:null,
                        nickname: encodeURIComponent(nickname || ''),
                        headimgurl: headimgurl || ''
                    }, 'callbackCommentsSave',true);
                }
            });
            $("#back-index").click(function(e){
                e.preventDefault();
                toUrl("index.html");
            });
        },
        getList:function(page){
            if(page - 1  == this.beforePage){
                getResult('comments/list', {page:page,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList', true);
            }
        },
        bindZanClick: function(cls){
            $("."+cls).click(function(){
                var isHotZaned = false;
                if($(this).hasClass('z-ed')){ return; }
                for(var i=0;i<H.comments.hotIsZ.length;i++){
                    if(H.comments.hotIsZ[i] == $(this).parent().parent().attr("data-uuid")){isHotZaned=true}
                }
                //if($(this).parent().parent().attr("data-uuid")){
                //
                //}
                $(this).addClass("curZan").addClass('z-ed');
                if(isHotZaned){
                    $(".curZan").text($(".curZan").text()*1 + 1);
                    $(".curZan").removeClass("curZan");
                    showTips('您已经给这条评论点过赞了');
                    return;
                }else{
                    H.comments.hotIsZ.push($(this).parent().parent().attr("data-uuid"));
                }
                getResult('api/comments/praise', {
                    uid:$(this).parent().parent().attr("data-uuid"),
                    op:openid
                }, 'callbackCommentsPraise');
            });
        },
        is_show: function(i){
            var $all_con = $('#all-con' + i);
            var height = $all_con.height(),
                inner_height = $all_con.find('span').height();
            if(inner_height > height){
                $all_con.find('span').addClass('all');
                $('#show-all' + i).removeClass('none');
            }
        },
        tpl: function(data) {
            var me = this, t = simpleTpl(),item = data.items || [],len = item.length,  $top_comment = $('#top-comment'),$nor_comment = $('#nor-comment');
            if(data.kind == 1){
                if(len>4)len = 4;
            }
            for (var i = 0; i < len; i++) {
                var isZan = item[i].isp ? "z-ed":"";
                t._('<li data-uuid = "'+ item[i].uid +'">')
                    ._('<section class="avatar"><img src="'+ (item[i].im ? (item[i].im + '/' + yao_avatar_size) : './images/avatar.png')+'"/></section>')
                    ._('<div>')
                    ._('<label class="zan '+isZan+'" data-collect="true" data-collect-flag="answer-zan" data-collect-desc="点赞按钮" >'+ item[i].pc +'</label>')
                    ._('<p>'+ (item[i].na || '匿名用户') +'</p>')
                    ._('<p class="all-con" id="all-con'+ me.item_index +'">')
                    ._('<span>'+ item[i].co +'</span>')
                    ._('</p>')
                    ._('<a class="show-all none" id="show-all'+ me.item_index +'" data-collect="true" data-collect-flag="answer-show" data-collect-desc="评论收缩显示" >^显示全部</a>')
                    ._('</div>')
                    ._('</li>');
                ++ me.item_index;
            }
            if(data.kind == 1){
                $top_comment.append(t.toString());
            }else{
                $nor_comment.append(t.toString());
            }
            // for (var i = 0, len = me.item_index; i < len; i++) { me.is_show(i); }
            H.comments.bindZanClick("zan");
        },
        currentComments : function(commActUid) {
            getResult('api/comments/list', {page:1,ps:this.pageSize,anys:H.comments.commActUid,op:openid,dt:1,zd:0,kind:1}, 'callbackCommentsList',true);
            //getResult('api/comments/list', {page:1,ps:this.pageSize,anys:H.comments.commActUid,op:openid,dt:0,zd:0,kind:0}, 'callbackCommentsList');
            getResult('api/comments/count', {anys:H.comments.commActUid}, 'callbackCommentsCount', true);
        }
    };


    W.callbackCommentsList = function(data){
        if(data.code == 0){
            if (data.items.length < H.comments.pageSize && data.kind == 0) {
                H.comments.loadmore = false;
            }
            if(data.items.length == H.comments.pageSize){
                if(H.comments.page == 0){
                    H.comments.beforePage = 1;
                    H.comments.page = 2;
                }else{
                    H.comments.beforePage = H.comments.page;
                    H.comments.page++ ;
                }
            }
            H.comments.tpl(data);

            $('#nor-comment li').unbind('click');
            $('#nor-comment li').click(function(e) {
                e.preventDefault();
                var me = this;
                //if ($(me).hasClass('big')) {
                //    $(me).removeClass('big');
                //} else {
                //    $('#nor-comment li').removeClass('big');
                //    $(me).addClass('big');
                //}
            });
        }else {
        }
    };

    W.callbackCommentsSave = function(data){
        if(data.code == 0 ){
            //var headImg = null;
            //if(headimgurl == null || headimgurl == ''){
            //    headImg = './images/avatar.png';
            //}else{
            //    headImg = headimgurl + '/' + yao_avatar_size;
            //}
            //var t = simpleTpl(),$nor_comment = $('#nor-comment');
            //t._('<li id="'+ data.uid +'" data-uuid = "'+ data.uid +'">')
            //    ._('<section class="avatar"><img src="'+ headImg +'"/></section>')
            //    ._('<div>')
            //    ._('<label class="zan-'+data.uid+'" class="zan" data-collect="true" data-collect-flag="answer-zan" data-collect-desc="点赞按钮" >'+ 0 +'</label>')
            //    ._('<p>'+ (nickname || '匿名用户') +'</p>')
            //    ._('<p class="all-con" id="all-con'+ data.uid +'">')
            //    ._('<span>'+ $("#comments-info").val() +'</span>')
            //    ._('</p>')
            //    // ._('<a class="show-all none" id="show-all'+ data.uid +'" data-collect="true" data-collect-flag="answer-show" data-collect-desc="评论收缩显示">^显示全部</a>')
            //    ._('</div>')
            //    ._('</li>');
            //
            //if($nor_comment.children().length==0){
            //    $nor_comment.append(t.toString());
            //}else{
            //    $nor_comment.children().first().before(t.toString());
            //}
            //H.comments.is_show(data.uid);
            $("#comments-info").val("");
            //H.comments.bindZanClick("zan-"+data.uid);
            //$('.com-head').find("label").html($('.com-head').find("label").html()*1+1);
            //
            //var navH = $("#"+data.uid).offset().top;
            //$(window).scrollTop(navH);
            //
            $("#send").removeAttr("disabled");
            $("#comments-info").removeAttr("disabled");
            showTips('发送成功');
        }else{
            showTips('评论失败');
            // $("#comments-info").val("");
            $("#send").removeAttr("disabled");
            $("#comments-info").removeAttr("disabled");
        }

        $('#nor-comment li').unbind('click');
        $('#nor-comment li').click(function(e) {
            e.preventDefault();
            var me = this;
            if ($(me).hasClass('big')) {
                $(me).removeClass('big');
            } else {
                $('#nor-comment li').removeClass('big');
                $(me).addClass('big');
            }
        });
    };

    W.callbackCommentsPraise = function(data){
        if(data.code == 0){
            $(".curZan").text($(".curZan").text()*1 + 1);
            $(".curZan").removeClass("curZan");
        }
    };

    W.callbackVoteguessInfoHandler = function(data){
        if(data.code == 0){
            H.comments.commActUid = data.pid;
            H.comments.currentComments();
        }
    };

    W.callbackCommentsCount = function(data){
        if(data.code == 0){
            $(".tt-numb").removeClass('none');
            $(".tt-numb>p").html((data.tc?data.tc:'0')+"评论");
        }
    };

})(Zepto);


$(function() {
    H.vote.init();
    H.comments.init();
});
