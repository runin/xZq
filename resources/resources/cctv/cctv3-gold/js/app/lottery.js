(function($) {
	H.lottery = {
        dec: 0,
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
        sponsorDetailFlag: false,
        lotteryImgList: [],
        lotteryTime: getRandomArbitrary(1,3),
        first: true,
        rp:getQueryString("rp"),
		init: function() {
            var me = this;
            me.event();
            me.resize();
            me.lotteryRound_port();
            me.shake();
            if(me.rp){
                showTips("领取成功");
            }
		},
		resize: function() {
			var me = this, winW = $(window).width(), winH = $(window).height(), resizes = document.querySelectorAll('.resize'), scaleW = window.innerWidth / 320, scaleH = window.innerHeight / 480;
			$('body, .cover-box').css({'width': winW, 'height': winH});
            if(!is_android()){
                $(".main-top").css("height", (winH / 2) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2) + "px").css('bottom', '0');
            } else {
                $(".main-top").css("height", (winH / 2 + 0.5) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2 + 0.5) + "px").css('bottom', '0');
            }
            for (var j = 0; j < resizes.length; j++) {
                resizes[j].style.width = parseInt(resizes[j].style.width) * scaleW + 'px';
                resizes[j].style.height = parseInt(resizes[j].style.height) * scaleH + 'px';
                resizes[j].style.top = parseInt(resizes[j].style.top) * scaleH + 'px';
                resizes[j].style.left = parseInt(resizes[j].style.left) * scaleW + 'px';
            };
		},
		event: function() {
			var me = this;
            $("#test").click(function(e){
                me.wxCheck = true;
                me.lotteryTime = 1;
                me.shake_listener();
                //toUrl("split.html?sau=2q34");
            });
            $('body').delegate('.product-box-pull', 'click', function(e) {
                e.preventDefault();
                $('.product-box').addClass('on');
                $('.product-box-pull').addClass('on');
                me.sponsorDetailFlag = true;
            }).delegate('.product-box .btn-pack', 'click', function(e) {
                e.preventDefault();
                $('.product-box').removeClass('on');
                $('.product-box-pull').removeClass('on');
                me.sponsorDetailFlag = false;
            }).delegate('.product-box .product-url', 'click', function(e) {
                e.preventDefault();
                var url = $(this).find("a").attr("href");
                shownewLoading(null,"请稍候...");
                location.href = url;
            }).delegate('#comments-btn', 'click', function(e) {
                e.preventDefault();
                H.lottery.isCanShake = false;
                $("#comments").addClass("fadeInUp");
                $("#comments").removeClass("none");
                setTimeout(function(){
                    $("#comments").removeClass("fadeInUp");
                },1000);
                H.talk.init();
            });
		},
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        ping: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/common/time' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'commonApiTimeHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.t){
                        me.safeLotteryMode('off');
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        checkPing: function() {
            var me = this, delay = Math.ceil(60000*2*Math.random() + 60000*1);
            me.pingFlag = setTimeout(function(){
                clearTimeout(me.pingFlag);
                me.ping();
                me.checkPing();
            }, delay);
        },
        lotteryRound_port: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.result == true){
                        me.nowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        me.dec = nowTimeStemp - data.sctm;
                        me.roundData = data;
                        me.currentPrizeAct(data);
                        $('.product-box-pull').removeClass('on');
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.lotteryRound_port();
                            },500);
                        }else{
                            me.change();
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    me.safeLotteryMode('on');
                }
            });
        },
        safeLotteryMode: function(flag) {
            var me = this;
            if (flag == 'on') {
                me.checkPing();
                $('.countdown, .icon-countdowntips').addClass('none');
                me.safeFlag = true;
            } else if (flag == 'off') {
                clearTimeout(me.pingFlag);
                me.pingFlag = null;
                me.lotteryRound_port();
                $('.countdown, .icon-countdowntips').removeClass('none');
                me.safeFlag = false;
            } else {
                me.safeLotteryMode('off');
            };
        },
        shake_listener: function() {
            if (!H.lottery.safeFlag) {
                if(H.lottery.sponsorDetailFlag) {
                    return;
                }
                if(H.lottery.isCanShake){
                    H.lottery.isCanShake = false;
                    H.lottery.canJump = false;
                }else{
                    return;
                }
                if (H.lottery.type != 2) {
                    return;
                }
                H.lottery.times++;
                if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                    H.lottery.isToLottey = false;
                }
            }
            if(!$(".home-box").hasClass("yao")) {
                $("#audio-a").get(0).play();
                $(".m-t-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate3d(0,-100px,0)'
                });
                $(".m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate3d(0,100px,0)'
                });
                setTimeout(function(){
                    $(".m-t-b").css({
                        '-webkit-transform': 'translate3d(0,0,0)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                    $(".m-f-b").css({
                        '-webkit-transform': 'translate3d(0,0,0)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                }, 1000);
                $(".home-box").addClass("yao");
            }
            // recordUserOperate(openid, "摇奖", "shakeLottery");
            if(!openid || openid=='null' || H.lottery.isToLottey == false || H.lottery.safeFlag == true) {
                setTimeout(function(){
                    H.lottery.fill(null);//摇一摇
                }, 1500);
            } else {
                if(!H.lottery.wxCheck) {
                    //微信config失败
                    setTimeout(function(){
                        H.lottery.fill(null);//摇一摇
                    }, 1500);
                    return;
                }
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        imgMath: function() {//随机背景
            var me = this;
            if(me.lotteryImgList.length >0){
                var i = Math.floor((Math.random()*me.lotteryImgList.length));;
                $("#shake-box").css("background","url('" + me.lotteryImgList[i] + "') no-repeat center center");
            }
        },
        account_num: function(){
            getResult('api/common/servicedaypv', {}, 'commonApiSDPVHander');
        },
        downloadImg: function(){
            var me = this, t = simpleTpl();
            if($(".preImg")){
                $(".preImg").remove();
            }
            for(var i = 0;i < me.lotteryImgList.length;i++){
                t._('<img class="preload preImg" src="'+me.lotteryImgList[i]+'">')
            };
            $("body").append(t.toString());
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this, nowTimeStr = this.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [], day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.endType = 3;
                    me.change();
                    return;
                }
                //config微信jssdk
                me.wxConfig();
                $('.swiper-container').animate({'opacity':'1'}, 300);
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        if(i < prizeActList.length - 1){
                            var nextBeginTimeStr = prizeActList[i + 1].pd + " " + prizeActList[i + 1].st;
                            if(comptime(endTimeStr, nextBeginTimeStr) <= 0){
                                me.endType = 2;
                                // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                                me.lastRound = false;
                                me.nextPrizeAct = prizeActList[i+1];
                            } else {
                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                me.endType = 1;
                            }
                        }else{
                            // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                            me.endType = 3;
                            me.lastRound = true;
                        }
                        me.nowCountdown(prizeActList[i]);
                        me.initComponent();
                        $.fn.cookie('jumpNum', 0, {expires: -1});
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            }else{
                me.safeLotteryMode('on');
                return;
            }
        },
        initComponent: function(){
            var me = this;
            setTimeout(function() {me.account_num();}, me.PVTime);
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html('距摇奖开始还有');
            me.count_down();
            $('.countdown, .icon-countdowntips').removeClass('none');
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html("距摇奖结束还有");
            me.count_down();
            $('.countdown, .icon-countdowntips').removeClass('none');
            me.index++;
            me.canJump = true;
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            hidenewLoading();
            if(H.lottery.first){
                setInterval(function(){
                    H.lottery.allRecord_port();
                },8000);
            }
        },
        count_down: function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.canJump){
                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                if(!me.isTimeOver){
                                    me.isTimeOver = true;
                                    $('.countdown-tip').html('请稍后');
                                    shownewLoading(null,'请稍后...');
                                    setTimeout(function() {
                                        me.nowCountdown(me.pal[me.index]);
                                    }, 1000);
                                }
                            }else if(me.type == 2){
                                //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                                if(!me.isTimeOver){
                                    me.isTimeOver = true;
                                    if(me.index >= me.pal.length){
                                        me.change();
                                        me.type = 3;
                                        return;
                                    }
                                    $('.countdown-tip').html('请稍后');
                                    shownewLoading(null,'请稍后...');
                                    var i = me.index - 1;
                                    if(i < me.pal.length - 1){
                                        var endTimeStr = me.pal[i].pd + " " + me.pal[i].et;
                                        var nextBeginTimeStr = me.pal[i + 1].pd + " " + me.pal[i + 1].st;
                                        if(comptime(endTimeStr,nextBeginTimeStr) <= 0){
                                            // 有下一轮并且下一轮的开始时间和本轮的结束时间重合
                                            me.endType = 2;
                                        } else {
                                            // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                            me.endType = 1;
                                        }
                                    }
                                    setTimeout(function(){
                                        if(me.endType == 2){
                                            me.nowCountdown(me.pal[me.index]);
                                        }else if(me.endType == 1){
                                            me.beforeCountdown(me.pal[me.index]);
                                        } else {
                                            me.change();
                                        }
                                    },1000);
                                }
                            }else{
                                me.isCanShake = false;
                            }
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        drawlottery: function() {
            shownewLoading();
            var me = this, sn = new Date().getTime()+'';
            me.lotteryTime = getRandomArbitrary(1,3);
            me.times = 0;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/luck' + dev,
                data: { oi: openid , sn: sn},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryLuckHandler',
                timeout: 10000,
                complete: function() {
                    hidenewLoading();
                },
                success: function(data) {
                    if(data.flow && data.flow == 1){
                        me.lotteryTime = getRandomArbitrary(6, 10);
                        me.times = 0;
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
        },
        fill: function(data) {
            this.imgMath();
            $(".home-box").removeClass("yao");
            if(data == null || data.result == false || data.pt == 0){
                $("#audio-a").get(0).pause();
                this.thanks();
                return;
            }else{
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();    //中奖声音
            }
            if (data.pt == 1) {
                H.dialog.shiwuLottery.open(data);
            } else if (data.pt == 7) {
                H.dialog.wxcardLottery.open(data);
            } else if (data.pt == 4) {
                H.dialog.redLottery.open(data);
            } else {
                this.thanks();
            }
        },
        thanks: function() {
            //H.dialog.thanksLottery.open();
            var me = this;
            me.canJump = true;
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
                    me.isCanShake = true;
                }, 300);
            }, 1500);
        },
        lottery_point: function(data) {
            var me = this;
            setTimeout(function() {me.fill(data);},1500);
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
        change: function() {
            hidenewLoading();
            // this.tttj();
            this.isCanShake = false;
            $(".countdown-tip").html('今日摇奖已结束，请明天再来');
            $('.detail-countdown').html("");
            $(".countdown, .showOver").removeClass("none");
            $('.swiper-container').animate({'opacity':'1'}, 300);
        },
        allRecord_port: function(){
            getResult('api/lottery/allrecord', {ol:1}, 'callbackLotteryAllRecordHandler');
        },
        scroll: function(options) {
            $('.marquee').each(function(i) {
                var me = this, com = [], delay = 1000;
                var len  = $(me).find('li').length;
                var $ul = $(me).find('ul');
                var hei = $(me).find('ul li').height();
                if (len == 0) {
                    $(me).addClass('hidden');
                } else {
                    $(me).removeClass('hidden');
                }
                if(len > 1) {
                    com[i] = setInterval(function() {

                        $(me).find('ul').animate({'margin-top': -hei+'px'}, delay, function(){
                            $(me).find('ul li:first-child').appendTo($ul);
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                }
            });
        },
	};

    H.talk = {
        uid: null,
        input: $("#comments-input"),
        maxid: 0,
        pageSize: 50,
        meArray: new Array(),
        isBottom:false,
        $tip:$("#msg-tip"),
        isFirst:true,
        refreshIntever:null,
        init: function() {
            var me = this;
            me.event();
            me.room();
            me.refreshIntever = setInterval(function(){
                H.talk.room();
            },5000);
            me.canBottom();
        },
        event: function(){
            var me = this;
            $("#comments-send").click(function(){
                if($.trim(H.talk.input.val()).length == 0){
                    showTips("什么都没有说呢");
                    return false;
                } else if ($.trim(H.talk.input.val()).length < 3){
                    showTips("多说一点吧！至少3个字哦");
                    return false;
                } else if ($.trim(H.talk.input.val()).length > 100){
                    showTips("评论字数不能超过100个字哦");
                    return false;
                };
                if (H.talk.uid != '') {
                    getResult('api/comments/save',{
                        'co' : encodeURIComponent(H.talk.input.val()),
                        'op' : openid,
                        'nickname': nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "匿名用户",
                        'headimgurl': headimgurl ? headimgurl : "",
                        'tid': H.talk.uid,
                        'ty': 1
                    }, 'callbackCommentsSave', true, null);
                };
            });
            me.$tip.click(function(){
                $('#comment_list').scrollToTop($('#comment_list')[0].scrollHeight);
            });
            $("#comments-close").click(function(){
                $("#comments").addClass("fadeOutDown");
                setTimeout(function(){
                    $("#comments").removeClass("fadeOutDown");
                    $("#comments").addClass("none");
                    H.lottery.isCanShake = true;
                    location.reload(true);
                },1000);
                // 停止聊天室的自动刷新
                clearInterval(me.refreshIntever);
            });
        },
        fillAfterSubmit: function(){
            var me = this;
            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : "images/avatar.jpg";
            var comments = "";
            comments += '<li class="fr">'
                    +"<div class='comments-con'>"
                + '<img src="' + h +'">'
                + '<span>'+me.input.val()+'</span>'
                + '</div>'
                + '</li>';
            $('#comment_list').append(comments);

            $('#comment_list').scrollToTop($('#comment_list')[0].scrollHeight);
        },
        room: function(){
            getResult('api/comments/room', {
                'maxid' : H.talk.maxid,
                'ps' : H.talk.pageSize
            }, 'callbackCommentsRoom');
            H.talk.pageSize = 10;
        },
        isin: function(uid){
            for(var i = 0;i < H.talk.meArray.length;i++){
                if(H.talk.meArray[i] == uid){
                    return true;
                }
            }
            return false;
        },
        canBottom: function() {
            var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
            var nScrollTop = 0;   //滚动到的当前位置
            var nDivHight = $("#comment_list").height();
            $('#comment_list').scroll(function(){
                nScrollHight = $(this)[0].scrollHeight;
                nScrollTop = $(this)[0].scrollTop;
                if(nScrollTop + nDivHight >= nScrollHight-3){
                    H.talk.isBottom = true;
                    H.talk.$tip.animate({
                            opacity: 0
                        }, 500,
                        'ease-out');
                }else{
                    H.talk.isBottom = false;
                }
            });
        }
    };
    W.callbackCommentsSave = function(data) {
        if(data.code == 0){
            H.talk.fillAfterSubmit();
            H.talk.input.blur().val('');
            H.talk.meArray.push(data.uid);
        }else{
            showTips(data.message);
        };
    };
    W.callbackCommentsRoom = function(data){
        if(data.code == 0){
            var items = data.items;
            if(items.length > 0){
                H.talk.maxid = data.maxid;
                var t = simpleTpl();
                for(var i = items.length-1;i >= 0;i--){
                    if(H.talk.isin(items[i].uid)){
                        continue;
                    }
                    var h= items[i].hu ? items[i].hu + '/' + yao_avatar_size : "images/avatar.jpg";
                    var n = items[i].na ? items[i].na:'匿名用户';
                    if(items[i].op == hex_md5(openid)){
                        t._('<li class="fr">')
                            ._('<div class="comments-con">')
                            ._('<img src="'+h+'">')
                            ._('<span>'+items[i].co+'</span>')
                            ._('</div>')
                            ._("</li>");
                    }else{
                        t._('<li>')
                            ._('<div class="comments-con">')
                            ._('<img src="'+h+'">')
                            ._('<span>'+items[i].co+'</span>')
                            ._('</div>')
                            ._("</li>");
                    }
                }
                $('#comment_list').append(t.toString());

                if(H.talk.isFirst){
                    $('#comment_list').scrollToTop($('#comment_list')[0].scrollHeight);
                    H.talk.isFirst = false;
                    return;
                }

                if(!H.talk.isBottom){
                    if(!H.talk.isFirst){
                        H.talk.$tip.animate({
                                opacity: 1
                            }, 500,
                            'ease-in');
                    }else{
                        H.talk.isFirst = false;
                    }
                }else{
                    $('#comment_list').scrollToTop($('#comment_list')[0].scrollHeight);
                }
            }
        }
    }

    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var list = data.rl;
            if(list && list.length>0){
                var con = "";
                for(var i = 0 ; i<list.length; i++){
                    con +='<li><i></i>'+(list[i].ni || "匿名用户")+'中了'+list[i].pn+'</li>';
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
            if (data.c*1 != 0) {
                $(".count label").html(data.c);
                $(".count").removeClass("hidden");
                setInterval(function(){
                    var pv = getRandomArbitrary(33,99);
                    pv = $(".count label").html()*1 + pv;
                    $(".count label").html(pv);
                },3000);
            }
        }
    };
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