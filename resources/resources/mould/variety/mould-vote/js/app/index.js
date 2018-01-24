(function($){
    H.index = {
        nowTime:"",
        dec:0,
        crossLotteryFlag:true,
        groupUuid:"",
        count:0,
        cunt:0,
        commentsList: new Array(),
        ZDcommentsList: new Array(),
        selfCommentsList: new Array(),
        pid: null,
        canRepeat: true,
        REQUEST_CLS: 'requesting',
        $inputCmt: $('#input-comment'),
        clsList: ["pink","red","blue","green","brown"],
        playerId:"",
        maxid:0,
        isCover: $.fn.cookie("cover"),
        canVote: false,
        init : function(){
            var me = this;
            me.disDouble();
            if(!me.isCover){
                me.initCover();
                $.fn.cookie("cover",true,1);
            }else{
                $(".ad-box").addClass("none");
                $(".vote").removeClass("none");
                me.current_time();
            }
            me.initVote();
            me.event();
            me.getComments();
            setInterval(function(){
                me.getComments();
            },10000);
            setTimeout(function () {
                me.showComments();
            },1000);
            setTimeout(function () {
                me.getZDComments();
            },8000);
            me.votePlayer();
        },
        disDouble:function(){
            // 禁用iPhone双击事件
            var agent = navigator.userAgent.toLowerCase();        //检测是否是ios
            var iLastTouch = null;                                //缓存上一次tap的时间
            if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0)
            {
                document.body.addEventListener('touchend', function(event)
                {
                    var iNow = new Date().getTime();
                    iLastTouch = iLastTouch || iNow + 1 /** 第一次时将iLastTouch设为当前时间+1 */ ;
                    var delta = iNow - iLastTouch;
                    if (delta < 500 && delta > 0)
                    {
                        event.preventDefault();
                        return false;
                    }
                    iLastTouch = iNow;
                }, false);
            }
        },
        event: function () {
          var me = this;
            $(".rank-list").tap(function (e) {
                e.stopPropagation();
                toUrl("rank.html?player="+me.playerId);
            });
            $(".border").tap(function(){
                if(me.canVote){
                    var heart = getRandomArbitrary(1,7);
                    var cls = getRandomArbitrary(1,5);
                    $(".hart-list").append("<div class='heart"+heart+" f"+cls+"' id='heart"+me.count+"'></div>");
                    me.count++;
                    me.cunt++;
                    $(".num").text(me.cunt);
                    var li = $(".hart-list").find("div").length;
                    if(li >= 50){
                        $(".hart-list").empty();
                    }
                }
            });
            $(".inp").tap(function (e) {
                e.stopPropagation();
            });
            $("#submit").tap(function(e) {
                e.stopPropagation();
                e.preventDefault();
                if ($(this).hasClass(me.REQUEST_CLS)) {
                    return;
                }
                var comment = $.trim(me.$inputCmt.val()) || '',
                    comment = comment.replace(/<[^>]+>/g, ''),
                    len = comment.length;

                if (len < 1) {
                    showTips('请先说点什么吧');
                    me.$inputCmt.removeClass('error').addClass('error');
                    return;
                } else if (len > 30) {
                    showTips('字数不能超过30哦');
                    me.$inputCmt.removeClass('error').addClass('error');
                    return;
                }
                $(this).addClass(me.REQUEST_CLS);
                shownewLoading(null,'发送中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        $("#submit").removeClass(me.REQUEST_CLS);
                        if(data.code == 0) {
                            showTips('发送成功');
                            var cls = getRandomArbitrary(0,5);
                            var na = nickname ? nickname : "匿名";
                            var t = new simpleTpl();
                            t._('<li><div class="'+me.clsList[cls]+'"><span class="ni">' + filterXSS(na) + '：</span><span class="con">' + filterXSS(comment) + '</span></div></li>');
                            $("#comments_content").append(t.toString());
                            var n = $("#comments_content").find("li").length;
                            if(n >= 6){
                                $("#comments_content").find("li").first().remove();
                            }
                            me.$inputCmt.removeClass('error').val('');
                            me.selfCommentsList.push(data.uid);
                            return;
                        }
                        showTips("发送失败");
                    }
                });
            });

        },
        votePlayer: function () {
            var me = this;
              setInterval(function () {
                  if(me.count > 0){
                      getResult('api/voteguess/guessplayerany', {yoi:openid,guid:me.groupUuid,pluids:me.playerId,cnts:me.count}, 'callbackVoteguessGuessAnyHandler');
                  }
              },10000);
        },
        voteRank: function () {
            var me = this;
            getResult('api/voteguess/pltop10', {pluids:me.playerId}, 'callbackVoteguessTop10Handler');
        },
        initCover: function () {
            getResult('api/comments/topic/round', {oi:openid}, 'callbackCommentsTopicInfo',true);
        },
        current_time: function(){
            var me = this;
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
                        me.nowTime = timeTransform(data.sctm);
                        var nowTime = new Date().getTime();
                        me.dec = (nowTime - data.sctm);
                        me.currentPrizeAct(data);
                    }else{
                        me.end();
                    }
                },
                error : function(xmlHttpRequest, error) {
                    me.end();
                }
            });
        },
        //活动结束
        end: function(){
            $(".countdown-tip").html("本期摇奖已结束");
            $(".detail-countdown").addClass("hidden");
            $(".countdown").removeClass("none");

        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeLength = 0,
                nowTimeStr = H.index.nowTime,
                prizeActList = data.la,
                me = this;
            if(prizeActList.length >0){
                prizeLength = prizeActList.length;
                // 判断是否为跨天摇奖 配置文件中crossdayLimit跨天摇奖阀值，默认2h
                var lastLotteryEtime = prizeActList[prizeLength - 1].pd + ' ' + prizeActList[prizeLength - 1].et;
                var lastLotteryNtime = prizeActList[prizeLength - 1].nst;
                var crossDay = timeTransform(new Date().setDate(new Date(lastLotteryEtime).getDate() + 1)).split(" ")[0];
                var minCrossDay = crossDay + ' 00:00:00';
                var maxCrossDay = timeTransform(new Date(minCrossDay).getTime() + crossdayLimit);
                if(comptime(lastLotteryNtime, minCrossDay) <= 0 && comptime(lastLotteryNtime, maxCrossDay) >= 0) {
                    me.crossLotteryFlag = true;
                } else {
                    me.crossLotteryFlag = false;
                }
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    if (me.crossLotteryFlag) {
                        me.crossCountdown(prizeActList[prizeLength - 1].nst);
                    } else {
                        me.end();
                    }
                    return;
                }

                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        me.nowCountdown();
                        return;
                    }
                    // 据下次摇奖开始
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.beforeShowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                }
            }else{
                me.end();
            }
        },
        // 距下次摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            var me = this;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $(".countdown-tip").html('距摇奖开启还有 ');
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
            me.count_down();
            $('.countdown').removeClass('none');
            me.repeatCheck = true;
        },
        // 距本轮摇奖结束倒计时
        nowCountdown: function(){
            $(".countdown-tip").html("摇奖正在进行中~");
            $(".countdown").removeClass("none");
            toUrl("yao.html");
        },
        // 跨天摇奖开启倒计时
        crossCountdown: function(nextTime) {
            var me = this;
            me.crossLotteryFlag = false;
            me.crossLotteryCanCallback = true;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
            $(".countdown-tip").html('距本轮摇奖开始还有');
            me.count_down();
            $('.countdown').removeClass('none');
            me.repeatCheck = true;
            hidenewLoading();
        },
        count_down : function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl : '%M%' + '分' + '%S%' + '秒', // 还有...结束
                    stpl : '%M%' + '分' + '%S%' + '秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(me.repeatCheck) {
                            me.repeatCheck = false;
                            $(".countdown-tip").html("请稍后");
                            $('.detail-countdown').addClass("hidden");
                            if (me.crossLotteryCanCallback) {
                                var delay = Math.ceil(1000 * Math.random() + 500);
                                me.crossLotteryCanCallback = false;
                                shownewLoading(null, '请稍后...');
                                setTimeout(function () {
                                    me.current_time();
                                }, delay);
                                return;
                            }
                            //距下次摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                            me.nowCountdown();
                        }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        initVote: function(){
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        me.pid = data.pid;
                        var items = data.items;
                        var nowTimeStr = timeTransform(data.cud * 1);
                        if(items && items.length > 0){
                            for(var i = 0; i < items.length; i++){
                                var beginTimeStr = items[i].gst, endTimeStr = items[i].get;
                                if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                                    me.groupUuid = items[i].guid;
                                    var pitems = items[i].pitems;
                                    if(pitems && pitems.length > 0){
                                        me.playerId = pitems[0].pid;
                                        $(".num").attr("id",pitems[0].pid);
                                        $(".vote").css({
                                            'background' : 'url('+pitems[0].im+') 0 0 no-repeat' ,
                                            'background-size': '100% 100%'
                                        });
                                        me.voteRank();
                                        me.canVote = true;
                                    }
                                }
                            }
                        }
                        me.initVoteNum();
                        setInterval(function () {
                            me.initVoteNum();
                        },5000);
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        initVoteNum: function () {
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/groupplayertickets' + dev,
                data: {
                    groupUuid: me.groupUuid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessGroupplayerticketsHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        var items = data.items;
                        if(items && items.length > 0){
                            if(items[0].cunt > me.cunt){
                                me.cunt = items[0].cunt;
                                $(".num").text(me.cunt);
                                $(".vote-num").removeClass("none");
                            }
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        getComments: function () {
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/comments/room' + dev,
                data: {
                    ps: 50,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        var items = data.items;
                        if(items && items.length > 0){
                            me.maxid = data.maxid;
                            for(var i = items.length-1; i >= 0; i--){
                                if($.inArray(items[i].uid, me.selfCommentsList) < 0){
                                    me.commentsList.push(items[i]);
                                }
                            }
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        getZDComments: function () {
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/comments/list' + dev,
                data: {
                    page: 1,
                    ps: 50,
                    zd: 1
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsList',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        var items = data.items;
                        if(items && items.length > 0){
                            for(var i = 0; i < items.length; i++){
                                me.ZDcommentsList.push(items[i]);
                            }
                            setInterval(function(){
                                if(me.commentsList.length > 0){
                                    var i = getRandomArbitrary(0,items.length);
                                    me.commentsList.push(me.ZDcommentsList[i]);
                                }
                            },8000);
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        showComments: function () {
            var me = this;
            setInterval(function () {
                if(me.commentsList.length > 0){
                    var t = new simpleTpl();
                    var cls = getRandomArbitrary(0,5);
                    var cmt = me.commentsList.shift();
                    t._('<li><div class="'+me.clsList[cls]+'"><span class="ni">' + filterXSS(cmt.na) + '：</span><span class="con">' + filterXSS(cmt.co) + '</span></div></li>');
                    $("#comments_content").append(t.toString());
                    var n = $("#comments_content").find("li").length;
                    if(n >= 6){
                        $("#comments_content").find("li").first().remove();
                    }
                }
            },500);
        }
    };
    W.callbackCommentsTopicInfo = function(data){
        if(data.code == 0){
            var width = document.documentElement.clientWidth,
                height = document.documentElement.clientHeight;
            Img = new Image();
            Img.src = data.items[0].im;
            Img.onload = function(){
                $('.ad-box').css({
                    'background-image' : 'url('+Img.src+')' ,
                    'background-repeat': 'no-repeat',
                    'background-size': '100% 100%',
                    'background-position':'center',
                    'overflow': 'hidden',
                    'opacity': '1',
                    'width': width+'px',
                    'height': height+'px',
                    'z-index': '99',
                    'position': 'absolute'
                });
                $("#sec").parent().removeClass("none");
                $(".vote").removeClass("none");
                H.index.current_time();
                var sec = 3;
                $("#sec").text(sec);
                var interval = setInterval(function(){
                    sec --;
                    $("#sec").text(sec);
                    if(sec <= 0){
                        $(".ad-box").animate({"opacity":0},1000,"linear",function(){
                            $(this).addClass("none");
                        });
                        clearInterval(interval);
                    }
                },1000);
                $(".ad-box").tap(function () {
                    $(".ad-box").animate({"opacity":0},1000,"linear",function(){
                        $(this).addClass("none");
                    });
                    clearInterval(interval);
                });
            };
        }else{
            $(".ad-box").addClass("none");
            $(".vote").removeClass("none");
        }
    };
    W.callbackVoteguessGuessAnyHandler = function(data){
        if(data.code == 0){
            H.index.count = 0;
        }
    };
    W.callbackVoteguessTop10Handler = function (data) {
        if(data.code == 0){
            var items = data.items;
            var t = new simpleTpl();
            if(items && items.length > 0){
                for (var i = 0; i < 3; i ++){
                    if(items[i]){
                        var hi = items[i].hi ? items[i].hi : "images/danmu-head.jpg";
                        t._('<div class="item"><img src="' + hi + '"></div>');
                    }
                }
                $(".rank-list").append(t.toString());
            }
        }
    };
})(Zepto);
$(function(){
   H.index.init();
});

