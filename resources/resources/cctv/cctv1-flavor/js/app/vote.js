(function($) {
    H.vote = {
        guid: '',
        pluids: '',
        endTime: '',
        nextTime: '',
        voteInfo_data: '',
        dec: 0,
        lotteryDec: 0,
        index: 0,
        istrue: true,
        nowTime: null,
        lotteryNowTime: null,
        showinfoFlag: true,
        infoPortFlag: true,
        beforeShowFlag: false,
        voteTimeList: [],
        roundData:null,
        repeat_load: true,
        tips: '您已经加过油了~',
        init: function () {
            shownewLoading();
            this.showinfo_port();
            this.event();
        },
        event: function() {
            var me = this;
            $('body').delegate('.btn-zan', 'tap', function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) {
                    showTips(me.tips);
                    return;
                }
                if ($(this).hasClass('voted')) {
                    showTips(me.tips);
                    return;
                }
                $(this).addClass('requesting');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/voteguess/guessplayer' + dev,
                    data: { yoi: openid, guid: me.guid, pluids: me.pluids },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackVoteguessGuessHandler',
                    complete: function() {
                        $('.btn-zan').removeClass('requesting');
                    },
                    success : function(data) {
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
                var num =parseInt($('.zan-num label').text());
                $('.zan-num label').html(num * 1 + 1);
                $(".btn-zan").removeClass('voting').addClass("voted").html('已加油');
                showTips('投票成功！');
            }).delegate('#btn-comment', 'tap', function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) {
                    return;
                }
                var comment = $.trim($("#input-comment").val()) || '', comment = comment.replace(/<[^>]+>/g, ''), len = comment.length;
                if (len < 1) {
                    showTips('说说你的看法吧~');
                    $("#input-comment").focus();
                    return;
                } else if (len > 21) {
                    showTips('看法不能超过20字哦~');
                    $("#input-comment").focus();
                    return;
                }
                $(this).addClass('requesting');
                shownewLoading(null, '发射中...');
                setTimeout(function(){
                    $("#btn-comment").removeClass('requesting');
                    showTips('发射成功');
                    var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar/default-avatar.jpg';
                    barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-content">' + comment + '</div></div>');
                    $('.isme').parent('div').addClass('me');
                    $("#input-comment").removeClass('error').val('');
                    hidenewLoading();
                }, 300);
                // shownewLoading();
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/comments/save' + dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        ty: 1,
                        tid: H.vote.guid,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : '',
                        headimgurl: headimgurl ? headimgurl : ''
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackCommentsSave',
                    complete: function() {
                        // hidenewLoading();
                    },
                    success : function(data) {
                        // $("#btn-comment").removeClass('requesting');
                        // if (data.code == 0) {
                        //     showTips('发射成功');
                        //     var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar/default-avatar.jpg';
                        //     barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-content">' + comment + '</div></div>');
                        //     $('.isme').parent('div').addClass('me');
                        //     $("#input-comment").removeClass('error').val('');
                        //     return;
                        // }
                        // showTips("评论失败");
                    }
                });
            });
        },
        resize: function(){
            var winH = $(window).height();
            $('.container').css('min-height', Math.ceil(winH - 200));
            $('article').css('height', Math.ceil(winH - 200));
            $('#comments').css('height', Math.ceil(winH - 250));
        },
        showinfo_port: function() {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/common/servicetime' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'commonApiServicetimeHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if (data && data.st && data.pet && data.pbt && data.fq) {
                        var allday = timeTransform(parseInt(data.st));
                        var sshowTime = allday.split(" ")[0] + ' ' + data.pbt, eshowTime = allday.split(" ")[0] + ' ' + data.pet;
                        var day = new Date(str2date(allday)).getDay().toString();
                        if (day == '0') { day = '7'; }
                        if (data.fq.indexOf(day) >= 0) {
                            if (comptime(eshowTime, allday) >= 0) {
                                cookie4toUrl('over.html');
                            } else {
                                H.vote.voteInfo_port();
                                H.vote.lotteryRound_port();
                            }
                        } else {
                            cookie4toUrl('over.html');
                        }
                    } else {
                        if (H.vote.showinfoFlag) {
                            H.vote.showinfoFlag = false;
                            H.vote.showinfo_port();
                        } else {
                            cookie4toUrl('answer.html');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    cookie4toUrl('answer.html');
                }
            });
        },
        voteInfo_port: function() {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        if (data.items) {
                            H.vote.voteInfo_data = data;
                            H.vote.nowTime = timeTransform(parseInt(data.cud));
                            H.vote.dec = new Date().getTime() - parseInt(data.cud);
                            H.vote.countdownInfo(data);
                        } else {
                            cookie4toUrl('answer.html');
                        }
                    } else {
                        if (H.vote.infoPortFlag) {
                            H.vote.infoPortFlag = false;
                            setTimeout(function(){
                                H.vote.voteInfo_port();
                            }, 2000);
                        } else {
                            cookie4toUrl('answer.html');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    cookie4toUrl('answer.html');
                }
            });
        },
        lotteryRound_port: function(){
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.result == true){
                        H.vote.lotteryNowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        H.vote.lotteryDec = nowTimeStemp - data.sctm;
                        H.vote.roundData = data;
                        H.vote.currentPrizeAct(data);
                    }else{
                        if(H.vote.repeat_load){
                            H.vote.repeat_load = false;
                            setTimeout(function(){
                                H.vote.lotteryRound_port();
                            },500);
                        }else{
                            $('body').addClass('lottertError');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    $('body').addClass('lottertError');
                }
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.vote.lotteryNowTime,
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
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    $('body').addClass('lottertError');
                    return;
                }
                //第一轮摇奖开始之前，显示倒计时
                if(comptime(prizeActList[0].pd + " " + prizeActList[0].st,nowTimeStr) < 0){
                    $('body').removeClass('lottertError');
                    H.vote.lotteryCountdown(prizeActList[0]);
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        $('body').removeClass('lottertError');
                        H.vote.lotteryCountdown(prizeActList[i]);
                        return;
                    }
                }
            }else{
                $('body').addClass('lottertError');
                return;
            }
        },
        countdownInfo: function(data) {
            var me = this, voteTimeListLength = 0, nowTimeStr = timeTransform(parseInt(data.cud));
            me.voteTimeList = data.items;
            me.dec = new Date().getTime() - data.cud;
            me.updateDec();
            voteTimeListLength =  me.voteTimeList.length;
            me.endTime =  me.voteTimeList[voteTimeListLength-1].get;
            //最后一轮结束  
            if (comptime(me.voteTimeList[voteTimeListLength-1].get, nowTimeStr) >=0) { 
                me.guid = me.voteTimeList[voteTimeListLength-1].guid;
                me.change();
                return;
            };
            //第一轮开始之前
            if(comptime(me.voteTimeList[0].gst, nowTimeStr) < 0) {
                $('body').addClass('no-show');
                me.index = 0;
                me.guid = me.voteTimeList[0].guid;
                me.fillVoteinfo(me.voteTimeList[0]);
                me.beforeShowCountdown(me.voteTimeList[0]);
                me.beforeShowFlag = true;
                me.defaultCom_port();
                me.tttj();
                $.fn.cookie('jumpNum', 0, {expires: -1});
                return;
            }
            for (var i = 0; i < voteTimeListLength; i++) {
                $('body').removeClass('no-show');
                var beginTimeStr =  me.voteTimeList[i].gst, endTimeStr = me.voteTimeList[i].get;
                 //活动正在进行
                if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0) {
                    me.index = i;
                    me.fillVoteinfo(me.voteTimeList[i]);
                    me.nowCountdown(me.voteTimeList[i]);
                    me.guid = me.voteTimeList[i].guid;
                    me.defaultCom_port();
                    me.tttj();
                    $.fn.cookie('jumpNum', 0, {expires: -1});
                    return;
                }
                if(comptime(nowTimeStr, beginTimeStr) > 0){    //活动还未开始
                    me.index = i;
                    cookie4toUrl('answer.html');
                    return;
                }
            };
        },
        fillVoteinfo: function(data) {
            var me = this;
            if (data.pitems.length == 1) {
                me.guid = data.guid;
                me.pluids = data.pitems[0].pid;
                me.tips = '感谢您为 ' + data.pitems[0].na + ' 加油~';
                $('.player-box').append('<img class="player" src="./images/icon-player-load.gif" onload="$(this).attr(\'src\',\'' + data.pitems[0].im + '\')" onerror="$(this).addClass(\'none\')">');
                $('.player-box .player-name label').text(data.pitems[0].na);
                $('.player-box .btn-zan').text(data.pitems[0].ni || '加油').addClass('btn-' + H.vote.pluids);
                $('.player-box .zan-num').addClass('vote-' + H.vote.pluids).addClass('none');
                me.resize();
                me.isVote_port();
                me.voteSupport_port();
                $('header, .container, footer .ctrls').removeClass('none').animate({'opacity':'1'}, 300, function(){
                    H.comment.init();
                });
            } else {
                cookie4toUrl('answer.html');
            }
        },
        defaultCom_port: function() {
            getResult('api/comments/last', { anys: this.guid, zd: 1 }, 'callbackCommentsLast');
        },
        isVote_port: function() {
            getResult('api/voteguess/isvote', { yoi: openid, guid: this.guid }, 'callbackVoteguessIsvoteHandler');
        },
        voteSupport_port: function() {
            getResult('api/voteguess/groupplayertickets', { groupUuid: this.guid }, 'callbackVoteguessGroupplayerticketsHandler');
        },
        updateDec: function() {
            var delay = Math.ceil(60000 * 5 * Math.random() + 60000 * 3);
            setInterval(function() {
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
                            H.vote.dec = new Date().getTime() - data.t;
                        }
                    },
                    error: function(xmlHttpRequest, error) {
                    }
                });
            },delay);
        },
        // 摇奖开启倒计时
        lotteryCountdown: function(pra) {
            var beginTimeStr = pra.pd + " " + pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.vote.lotteryDec;
            $('.detail-countdown-key').attr('etime',beginTimeLong);
            H.vote.lottery_count_down();
            $(".countdown-tip-key").html("距离摇奖开始还有");
        },
        // 开启倒计时
        beforeShowCountdown: function(pra) {
            var beginTimeStr = pra.gst;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.vote.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.vote.count_down();
            $(".countdown-tip").html('距离摇奖开始还有');
            H.vote.istrue = true;
            H.vote.guid = pra.guid;
            $(".zan-box").css('opacity', '0');
            hidenewLoading();
        },
        // 结束倒计时
        nowCountdown: function(pra){
            var endTimeStr = pra.get;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.vote.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.vote.count_down();
            $(".countdown-tip").html("距离本轮投票结束还有");
            H.vote.istrue = true;
            H.vote.guid = pra.guid;
            $(".time-box").removeClass("hidden");
            $(".zan-box").css('opacity', '1');
            H.vote.index ++;
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl : '<span class="fetal-H">%H%'+':</span>'+'%M%' + ':' + '%S%',
                    stpl : '<span class="fetal-H">%H%'+':</span>'+'%M%' + ':' + '%S%',
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.vote.istrue){
                            H.vote.istrue = false;
                            if (H.vote.beforeShowFlag) {
                                $('body').removeClass('no-show');
                                H.vote.beforeShowFlag = false;
                                shownewLoading(null, '请稍后...');
                                $('header, .container, footer .ctrls').animate({'opacity':'0'}, 300);
                                setTimeout(function(){
                                    H.vote.nowCountdown(H.vote.voteTimeList[0]);
                                    $('header, .container, footer .ctrls').animate({'opacity':'1'}, 300);
                                }, 1200);
                            } else {
                                H.vote.change();
                            }
                        }
                    },
                    sdCallback :function() {
                        H.vote.istrue = true;
                    }
                });
            });
        },
        lottery_count_down: function() {
            $('.detail-countdown-key').each(function() {
                $(this).countDown({
                    etpl : '<span class="fetal-H">%H%'+':</span>'+'%M%' + ':' + '%S%',
                    stpl : '<span class="fetal-H">%H%'+':</span>'+'%M%' + ':' + '%S%',
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {},
                    sdCallback :function() {}
                });
            });
        },
        change: function(data){
            $(".countdown-tip").html('请稍后');
            $('header, .container, footer .ctrls').animate({'opacity':'0'}, 800);
            cookie4toUrl('answer.html');
        },
        tttj: function() {
            $('#tttj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
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
            getResult('api/comments/room?temp=' + new Date().getTime(), {
                anys: H.vote.guid,
                ps: me.pageSize,
                maxid: me.maxid
            }, 'callbackCommentsRoom');
        }
    };

    W.callbackCommentsRoom = function(data) {
        if (data.code == 0) {
            H.comment.maxid = data.maxid;
            var items = data.items || [];
            for (var i = 0, len = items.length; i < len; i++) {
                var hmode = "<div class='c_head_img'><img src='./images/avatar/default-avatar.jpg' class='c_head_img_img'></div>";
                if (items[i].hu) {
                    if (items[i].hu.indexOf('.jpg') || items[i].hu.indexOf('.jepg') || items[i].hu.indexOf('.png')) {
                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + " class='c_head_img_img'></div>";
                    } else {
                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img'></div>";
                    }
                }
                barrage.pushMsg(hmode + items[i].co);
            };
        }
    };

    W.callbackVoteguessGroupplayerticketsHandler = function(data) {
        if (data.code == 0 && data.items) {
            var items = data.items, length = data.items.length;
            for (var i = 0; i < length; i++) {
                $('.vote-' + data.items[i].puid).removeClass('none').find('label').html(data.items[i].cunt);
            };
        }
    };

    W.callbackVoteguessIsvoteHandler = function(data) {
        if (data.code == 0) {
            if (data.so) {
                $('.btn-' + H.vote.pluids).addClass('voted').html('已加油');
                $('.btn-' + H.vote.pluids).removeClass('voting');
            } else {
                $('.btn-zan').addClass('voting');
                $('.btn-zan').removeClass('voted');
            }
        } else {
            $('.btn-zan').addClass('voted').html('已加油');
            $('.btn-zan').removeClass('voting');
        }
    };

    W.callbackCommentsLast = function(data) {
        if (data.code == 0 && data.items) {
            var items = data.items, length = data.items.length;
            for (var i = 0; i < length; i++) {
                window.CACHEMSG.push("<div class='c_head_img'><img src='" + items[i].im + "'></div>" + items[i].co);
            };
        }
    };

    W.commonApiPromotionHandler = function(data) {
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

$(function(){
    H.vote.init();
});