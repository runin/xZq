(function($) {
    H.daily = {
        time:null,
        ist:null,
        iet:null,
        day:null,
        isgetpic:false,
        isask:false,
        isLoad:false,
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
        $video: $('.video-div'),
        index:0, // 当前抽奖活动在 list 中的下标
        pal:[],// 抽奖活动list
        dec:0,//服务器时间与本地时间的差值
        type:2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        PVTime: Math.ceil(2000*Math.random() + 8000),
        isTimeOver: false,
        repeat_load:true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        myVedio:document.getElementById("video"),
        init: function () {
            getResult('api/article/list', {}, 'callbackArticledetailListHandler');
            getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
            this.event();
            this.vote();
            this.wxConfig();
            if($.fn.cookie(openid + 'sex')){
                $(".sex").val($.fn.cookie(openid + 'sex'));
            }
            if($.fn.cookie(openid + 'age')){
                $(".age").val($.fn.cookie(openid + 'age'));
            }
        },
        videoEvent:function(e){
            var me = this;
            me.myVedio.addEventListener(e,function(){
                if(e == "ended"){
                    $(".play").animate({opacity:1},500);
                }
            });
        },
        event: function() {
            var me = this;
            $('body').delegate('.btn-info', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('info.html');
                }
            }).delegate('.btn-play', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('reserve.html');
                }
            }).delegate('.play', 'click', function(e) {
                e.preventDefault();
                if (me.myVedio.paused){
                    me.myVedio.play();
                    $(".play").animate({opacity:0},500);
                }else{
                    me.myVedio.pause();
                    $(".play").animate({opacity:1},500);
                }
            });
            $('.outer').on("click", function (e) {
                e.preventDefault();
                var age = parseInt($(".age").val());
                if(isNaN(age) || age > 99 || age < 0){
                    showTips("请输入正确年龄");
                }else{
                    var exp = new Date(),ischg = false;
                    exp.setTime(exp.getTime() + 7*24*60*60*1000);
                    if($.fn.cookie(openid + 'sex') !== $(".sex").val()){
                        $.fn.cookie(openid + 'sex', $(".sex").val() , {expires: exp});
                        ischg = true;
                    }
                    if(parseInt($.fn.cookie(openid + 'age')) !== age){
                        $.fn.cookie(openid + 'age', age , {expires: exp});
                        ischg = true;
                    }
                    if(ischg){
                        getResult('api/entryinfo/save',
                            {
                                openid:openid,
                                phone:"",
                                sex: $(".sex").val(),
                                age:age
                            },'callbackActiveEntryInfoSaveHandler');
                    }else{
                        $(".vote").removeClass("none");
                    }
                }
            });
            //me.myVedio.play();
            //$(".play").css("opacity","0");
            //me.videoEvent("ended");
        },
        swinit: function () {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                //effect : 'coverflow',
                //slidesPerView: 1,
                autoplay : 3000,
                prevButton:'.swiper-button-prev',
                nextButton:'.swiper-button-next',
                paginationBulletRender: function (index, className) {
                    var pname = null;
                    return '<span class="' + className + '">' + pname + '</span>';
                }
            });
        },
        vote: function () {
            var me = H.daily;
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/question/round'+dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackQuestionRoundHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.code == 0){
                        H.daily.voteinfo = data;
                        H.daily.chktime(data);
                    }else if(data.code == 4){
                        H.daily.voteinfo = data;
                        H.daily.chktime(data,true);
                        //$(".ltl").css("opacity","1");
                    } else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                //me.current_time();
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
                        for(var i = 0;(i<=data.qitems.length - 1);i++){
                            var st = timestamp(data.qitems[i].qst);
                            var et = timestamp(data.qitems[i].qet);
                            //alert(JSON.stringify(data.items[i]));
                            if((serverT>st)&&(serverT<et)){
                                hasvote = true;
                                //$(".voteinfo>div").html(data.items[i].pitems[0].na);
                                //$(".voteinfo>p").html(data.items[i].pitems[0].ni);
                                for(var a = 0; a < data.qitems[i].aitems.length;a++){
                                    H.daily.guid = data.qitems[i].quid;
                                    H.daily.puid += data.qitems[i].aitems[a].auid;
                                    H.daily.pic = '';
                                    var infoData = "";
                                    infoData += '<div class="praise" id="' + data.qitems[i].aitems[a].auid + '"><div class="voteinfo"></div>';
                                    infoData += '<a href="#" class="praise-btn" puid="' + data.qitems[i].aitems[a].auid + '" guid="' + data.qitems[i].quid + '" data-collect="true" data-collect-flag="vote-sign" data-collect-desc="点赞按钮"></a>';
                                    infoData += '<div class="praise-bg"><p>' + data.qitems[i].aitems[a].at + '</p></div>';
                                    infoData += '<div class="praise-per"><p>' + data.qitems[i].aitems[a].at + '</p><div><p></p></div><span class="praise-span"></span></div>';
                                    //if(data.qitems[i].aitems[a].re == "0"){
                                    //    H.daily.isvoteover = true;
                                    //}
                                    if(H.daily.isfill == false){
                                        $(".praise-box").append(infoData);
                                    }
                                    $(".baby").css("opacity","1");
                                }
                                $(".tt").html(data.qitems[i].qt);
                                //$(".voteinfo").css("height",($(window).width() * 0.07)+"px");
                                getResult('api/question/record', {yoi:openid,quid: H.daily.guid}, 'callbackQuestionRecordHandler');
                                H.daily.isfill = true;
                            }
                        }
                        if(hasvote == false){
                            //if(H.daily.isyaoover == false){
                            //}
                            H.daily.isvover = true;
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
                url : domain_url + 'api/question/answer' +dev,
                data: {
                    yoi:openid,
                    suid: guid,
                    auid: puid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackQuestionAnswerHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    hidenewLoading();
                    if(data.code == 0){
                        shownewLoading(false,"投票成功<br/>正在抽奖");
                        H.daily.changeBg($("#"+puid),1);
                        setTimeout(function () {
                            H.daily.drawlottery();
                        },2000);
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
            self.find('.voteinfo').css({'background':'url("images/box-select.png") no-repeat','background-size':'100% 100%'});
            if(type == 1){
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
        wxConfig: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'mp/jsapiticket' + dev,
                data: {appId: shaketv_appid},
                dataType: "jsonp",
                jsonpCallback: 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                },
                success: function(data) {
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
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        drawlottery: function() {
            var me = this, sn = new Date().getTime()+'';
            me.lotteryTime = getRandomArbitrary(1,3);
            me.times = 0;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/exec/luck4Vote' + dev,
                data: { matk: matk , sn: sn, sau: me.sau},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryLuck4VoteHandler',
                timeout: 10000,
                complete: function() {
                    hidenewLoading();
                },
                success: function(data) {
                    if(data.flow && data.flow == 1){
                        sn = new Date().getTime()+'';
                        me.lottery_point(null);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime()+'';
                            me.lottery_point(data);
                        }
                    }else{
                        sn = new Date().getTime()+'';
                        me.lottery_point(null);
                    }
                },
                error: function() {
                    sn = new Date().getTime()+'';
                    me.lottery_point(null);
                }
            });
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            recordUserPage(openid, "调用抽奖接口", 0);
        },
        fill: function(data) {
            if(data == null || data.result == false || data.pt == 0){
                this.thanks();
                return;
            }else{
            }
            H.dialog.openLuck.open(data);
        },
        thanks: function() {
            var me = this;
            me.canJump = true;
            if (typeof(thanks_tips) == 'undefined' || thanks_tips.length == 0) {
                var tips = '姿势摆的好，就能中大奖';
            } else {
                var tips = thanks_tips[getRandomArbitrary(0, thanks_tips.length)]
            }
            $('.thanks-tips').html(tips).addClass('show');
            setTimeout(function(){
                $('.thanks-tips').removeClass('show');
                setTimeout(function(){
                    $('.thanks-tips').empty();
                }, 300);
            }, 1000);
        },
        lottery_point: function(data) {
            var me = this;
            setTimeout(function() {me.fill(data);}, 1800);
        }
    };
    W.callbackQuestionSupportHandler = function(data){
        if(data.code == 0){
            var ttnumb = 0, per = 0;
            for(var i=0;i<data.aitems.length;i++){
                ttnumb += data.aitems[i].supc;
            }
            for(var a=0;a<data.aitems.length;a++){
                var praise = $("#"+data.aitems[a].auid).find(".praise-per");
                var praiseper = data.aitems[a].supc/ttnumb;
                if(praiseper<0){praiseper=0}if(praiseper>1){praiseper=1}
                praise.find(".praise-span").html(data.aitems[a].supc + "票&nbsp&nbsp" + Math.floor(praiseper*100) +"%");
                praise.find("div").find("p").css("width",Math.floor(praiseper*100)+"%");
            }
        }
        $(".black").on("click", function () {
            $(".vote").addClass("none");
        });
    };
    W.callbackQuestionRecordHandler = function(data){
        if((data.anws == undefined)||(data.code == 0) && !(H.daily.puid.match(data.anws))){
            $(".praise").css("opacity","1");
            //$(".ltl").css("opacity","0");
            if(H.daily.isvote == false){
                $(".praise-bg").removeClass('none');
                $(".praise-per").addClass('none');
                $(".praise-btn").on("click", function () {
                    shownewLoading();
                    $(".praise-btn").off();
                    H.daily.praise(H.daily.pic,H.daily.guid,$(this).attr("puid"));
                });
            }
        }else{
            //$("#"+data.so).find(".praised").css("display","block");
            H.daily.isvote = true;
            H.daily.changeBg($("#"+data.anws),0);
            //    .on("click", function () {
            //    showTips("您已经投过票了");
            //});
            //$(".countdown").removeClass("none").one("click", function () {
            //    toUrl("yao.html?vj=1");
            //});
        }
        if(!H.daily.hascallback){
            H.daily.hascallback = true;
            getResult('api/question/eachsupport', {quid: H.daily.guid}, 'callbackQuestionSupportHandler');
            setInterval(function(){
                if(H.daily.guid !== false){
                    getResult('api/question/eachsupport', {quid: H.daily.guid}, 'callbackQuestionSupportHandler');
                }
            },Math.ceil(2000*Math.random() + 8000));
        }
    };
    W.callbackArticledetailListHandler = function(data){
        if(data == undefined){

        }else{
            if(data.code == 0){
                hidenewLoading();
                //$("source").attr("src",data.arts[0].gu);
                H.daily.$video.css("height",(H.daily.$video.width() *.5) + "px");
                var url = data.arts[0].gu + '&width=' + H.daily.$video.width() + '&height=' + (H.daily.$video.width() * .5);
                H.daily.$video.html('<iframe src="'+ url +'"></iframe>');
                //$(".bot>p").html(data.arts[2].i);
                //$(".bot").append('<a href="#" class="outer" data-collect="true" data-collect-flag="outer" data-collect-desc="外链按钮"></a>');
                //$(".outer").on("click", function () {
                //    shownewLoading();
                //    setTimeout(function () {
                //        window.location.href = data.arts[2].cn;
                //    })
                //});
                H.daily.isgetpic = true;
            }else if(data.code == 1){
                if(H.daily.isask == false){
                    getResult('api/article/list', {}, 'callbackArticledetailListHandler');
                    H.daily.isask = true;
                }else{
                    hidenewLoading();
                }
            }
        }
    };
    W.callbackLinesDiyInfoHandler = function (data) {
        if(data.code == 0){
            for(var i=0;i<data.gitems.length;i++){
                $(".swiper-wrapper").append('<img class="swiper-slide" src="' + data.gitems[i].ib + '" />');
            }
            //H.lottery.share_img = data.gitems[0].ib;
            H.daily.swinit();
        }
    };
    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.url) {
            //var link = data.url.split(';');
            //var de = data.desc.split(';');
            $('.linkout').removeClass("hidden");
            $("#linkout").click(function(){
                showLoading();
                //location.href = link[0];
                location.href = data.url;
            });
        } else {
            $('#linkout').remove();
        }
    };
    W.callbackActiveEntryInfoSaveHandler = function(data){
        //$(".outer").off();
        if (data.code == 0) {
            $(".vote").removeClass("none");
        } else {
        }
    };
    H.lottery = {
        dec: 0,
        sau: 0,
        type: 2,
        index: 0,
        times: 0,
        endType: 1,
        pal: null,
        nowTime: null,
        pingFlag: null,
        roundData: null,
        nextPrizeAct: null,
        canJump: true,
        wxCheck: false,
        isError: false,
        safeFlag: false,
        lastRound: false,
        isToLottey: true,
        isCanShake: false,
        isTimeOver: false,
        repeat_load: true,
        recordFirstload: true,
        sponsorDetailFlag: false,
        lotteryImgList: [],
        lotteryTime: getRandomArbitrary(1,3),
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
    }
})(Zepto);

$(function(){
    H.daily.init();
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