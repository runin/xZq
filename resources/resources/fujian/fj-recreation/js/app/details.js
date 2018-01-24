(function($){
    H.detail={
        periodUuid: getQueryString("periodUuid") || "",//期uuid
        guid: getQueryString("guid") || "",//组uuid
        pid: getQueryString("pid") || "",//选手uuid
        count:0,
        cunt:0,
        init: function(){
            var me = this;
            me.event();
            me.shake();
        },
        //获取某个组选手的票数
        groupplayertickets: function(){
            getResult('api/voteguess/groupplayertickets', {groupUuid: H.detail.guid}, 'callbackVoteguessGroupplayerticketsHandler');
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        shake: function() {
            W.addEventListener('shake', H.detail.shake_listener, false);
        },
        shake_listener: function() {
            var me = H.detail;
            $("#audio-a").get(0).play();
            me.count++;
            me.cunt++;
            $("#"+me.pid).find("span").text(me.cunt);

            W.localStorage.setItem("guid-"+ me.guid +"pid-"+ me.pid, me.cunt);

            var heart = getRandomArbitrary(1,7),
                cls = getRandomArbitrary(1,5),
                imgName = getRandomArbitrary(1,6),
                $heartAnimation = $("#heart-animation"),
                $staicHeart = $("#staic-heart");

                $staicHeart.addClass("none");
                $heartAnimation.removeClass("none").append("<img class='heart"+heart+" f"+cls+"' id='heart"+me.cunt+"' src='images/"+ imgName +".png'/>");
                $heartAnimation.find("img").one("webkitAnimationEnd", function () {
                    $staicHeart.animate(1500, function(){
                        $staicHeart.removeClass("none").addClass("zoomIn");
                    });
                $heartAnimation.addClass("none").empty();
            });

            recordUserOperate(openid, "调用投票接口", "doVote");
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/voteguess/guessplayer' + dev,
                data: {
                    yoi: openid,
                    guid: me.guid,
                    pluids: me.pid
                },
                dataType: "jsonp",
                jsonpCallback: 'callbackVoteguessGuessHandler',
                complete: function() {
                },
                success: function(data) {
                    if(data.code == 0){
                        H.detail.count = 0;
                    }
                },
                error: function(xmlHttpRequest, error) {}
            });
        },
        event: function(){
            var me = H.detail;
            var $barrage = $("#barrage"),
                $voteCountdownOut = $("#vote-countdown-out");
            $("#switch").click(function(e){
                e.preventDefault();
                if($(this).hasClass("zs")){
                    $barrage.addClass("none");
                    $voteCountdownOut.removeClass("none");
                    $(this).removeClass("zs").attr("src", "images/wyfy.png");
                    return;
                }
                $barrage.removeClass("none");
                $voteCountdownOut.addClass("none");
                $(this).addClass("zs").attr("src", "images/shou-dm.png");
                H.send.init();
            });

            $("#test").click(function(e){
                H.detail.shake_listener();
            });
        },
        spellHtml: function(data){
            var me = H.detail;
            $(".num").attr("id", data.pid);
            $(".body").css({
                "backgroundImage":"url("+ data.im2 +")",
                "background-repeat": "no-repeat",
                "background-size": "45% auto",
                "background-position": "center center"
            });

            me.groupplayertickets();
            setInterval(function () {
                me.groupplayertickets();
            },5000);
        }
    };
    H.voteCountDown = {
        $voteCountdown: $("#vote-countdown"),
        nowTime: null,
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        index: 0, // 当前抽奖活动在 list 中的下标
        pal: [],// 抽奖活动list
        dec: 0,//服务器时间与本地时间的差值
        type: 2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        isTimeOver: false,
        init: function() {
            var me = this;
            me.current_time();
            me.refreshDec();
        },
        refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time' + dev,
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            var nowTime = new Date().getTime();
                            H.voteCountDown.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {}
                });
            },dely);
        },
        //获取竞猜信息（最新）
        current_time: function(){
            var me = H.voteCountDown;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/voteguess/inforoud' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackVoteguessInfoHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.code == 0){
                        me.nowTime = timeTransform(parseInt(data.cud));
                        var nowTimeStemp = new Date().getTime();
                        me.dec = nowTimeStemp - parseInt(data.cud);
                        H.detail.periodUuid = data.pid;
                        me.currentPrizeAct(data);

                        var meDetails = H.detail;
                        $.each(data.items, function(i,item){
                            if(item.guid == meDetails.guid){
                                $.each(item.pitems, function(j,jtem){
                                    if(jtem.pid == meDetails.pid){
                                        /*console.log(j);
                                         console.log(jtem);*/
                                        meDetails.spellHtml(jtem);
                                    }
                                });
                            }
                        });
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.current_time();
                            },500);
                        }else{
                            me.change();
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {}
            });
        },
        currentPrizeAct:function(data){
            var nowTimeStr = H.voteCountDown.nowTime,
                me = H.voteCountDown;

            me.pal = data;
            //如果最后一轮结束
            if(comptime(data.pet,nowTimeStr) >= 0){
                me.type = 3;
                me.change();
                return;
            }
            //如果第一轮未开始
            if(comptime(data.pst,nowTimeStr) < 0){
                me.beforeShowCountdown(data);
                return;
            }

            var beginTimeStr = data.pst;
            var endTimeStr = data.pet;
            hidenewLoading();
            //在活动时间段内且可以抽奖
            if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                me.nowCountdown(data);
                return;
            }
        },
        // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            var me = H.voteCountDown,
                beginTimeStr = pra.pst;
            toUrl("rank.html?periodUuid="+ H.detail.periodUuid);
            me.type = 1;
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            me.countdown_domShow(beginTimeStr,"距投票开启还有");
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            var me = H.voteCountDown,
                endTimeStr = pra.pet;
            me.type = 2;
            me.countdown_domShow(endTimeStr,"距投票结束还有");
        },
        change: function(){
            var me = H.voteCountDown;
            //toUrl("rank.html?periodUuid="+ H.detail.periodUuid);
            me.type = 3;
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            me.$voteCountdown.removeClass("none").html('本期投票已结束，请等待下期!');
        },
        countdown_domShow: function(time, word){
            var me = H.voteCountDown,
                timeLong = timestamp(time);
            timeLong += me.dec;
            me.$voteCountdown.find('.detail-countdown').attr('etime',timeLong);
            me.$voteCountdown.find(".countdown-tip").html(word);
            me.count_down();
            me.$voteCountdown.find('.items-count').removeClass('none');
            me.$voteCountdown.find('.loading').addClass('none');
            me.$voteCountdown.removeClass("none");
            me.isTimeOver = false;
        },
        // 倒计时
        count_down : function() {
            var me = H.voteCountDown;
            me.$voteCountdown.find('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl : '%H%' + ':' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl : '%H%' + ':' + '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true
                        var $loading =  me.$voteCountdown.find(".loading"),
                            $items_count = me.$voteCountdown.find('.items-count');
                        if(!me.isTimeOver){
                            me.isTimeOver = true;
                            $items_count.addClass('none');
                            $loading.removeClass('none');

                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                me.nowCountdown(me.pal);
                            }else if(me.type == 2){
                                //距摇奖结束倒计时结束后显示距离下轮摇奖开始倒计时
                                me.change();
                            }
                        }
                    },
                    sdCallback :function(){
                        me.isTimeOver = false;
                    }
                });
            });
        }
    };
    W.callbackVoteguessGroupplayerticketsHandler = function(data){
        var me = H.detail;
        if(data.code == 0){
            var items = data.items;
            var storageCunt = W.localStorage.getItem("guid-"+ me.guid +"pid-"+ me.pid);
            if(items && items.length > 0){
                $.each(data.items, function(i,item){
                    if(item.puid == me.pid){

                        if(storageCunt && storageCunt >= item.cunt){
                            me.cunt = storageCunt;
                            $("#"+me.pid).find("span").text(me.cunt || 0);
                            $(".num").removeClass("visibility");
                        }
                        if(item.cunt >= me.cunt){
                            me.cunt = item.cunt;
                            $("#"+me.pid).find("span").text(me.cunt || 0);
                            $(".num").removeClass("visibility");
                        }
                    }
                });
            }

        }
    };
})(Zepto);

(function(){
    // 弹幕_S
    H.send =
    {
        $comments: $('#comments'),
        $inputCmt: $('#input-comment'),
        $btnCmt: $('#btn-comment'),
        REQUEST_CLS: 'requesting',
        init: function() {
            var me = this;
            me.resize();
            H.comment.init();
            me.event();
        },
        resize: function(){
            var me = this;
            var width = $(window).width();
            var height = $(window).height();
            me.$comments.css({
                'width': width,
                'height': height*0.55
            });

            $(".container").css({
                'width': width,
                'height': height
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        event: function() {
            var me = this;

            this.$btnCmt.click(function(e) {
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
                } else if (len > 15) {
                    showTips('观点字数超出了15字');
                    me.$inputCmt.removeClass('error').addClass('error');
                    return;
                }

                $(this).addClass(me.REQUEST_CLS);

                shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid:null,
                        ty: 2,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                            showTips('发射成功');
                            /*var h= headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/avatar.png';
                            barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-cor">'+comment+'</div></div>');*/
                            var  hu = headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/avatar.png',
                                name = nickname ? nickname : '匿名用户';
                            var hmode = "<div class='c_head_img isme'><imgclass='c_head_img_img' src='"+ hu +"' /></div>" +
                                "<div class='ron'><p>"+ filterXSS(name) +"</p>" +
                                "<span class='triangle'></span><div class='article'>"+ filterXSS(comment) +"</div></div>";
                            barrage.pushMsg(hmode);
                            $('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                        showTips("评论失败");
                    }
                });

            });
        }
    };
    H.comment = {
        timer: 5000,
        maxid: 0,
        pageSize: 50,
        $comments: $('#comments'),
        init: function() {
            var me = this;
            W['barrage'] = this.$comments.barrage();
            W['barrage'].start(1);
            setInterval(function() {
                me.flash();
            }, me.timer);
        },
        flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + "api/comments/room"+dev,
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
                    if (data.code == 0) {
                        me.maxid = data.maxid;
                        var items = data.items || [];
                        for (var i = 0, len = items.length; i < len; i++) {
                            var  hu = items[i].hu ? items[i].hu + "/64" : './images/avatar.png';
                            var hmode = "<div class='c_head_img'><img src='"+ hu +"' class='c_head_img_img' /></div>" +
                                "<div class='ron'><p>"+ filterXSS(items[i].na) +"</p>" +
                                "<span class='triangle'></span><div class='article'>"+ filterXSS(items[i].co) +"</div></div>";
                            barrage.pushMsg(hmode);
                        }
                    } else {
                        return;
                    }
                }
            });
        }
    };
})(Zepto);

$(function(){
    H.detail.init();
    H.voteCountDown.init();
});