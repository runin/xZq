(function($) {
    H.vote = {
        dec: 0,
        index: 0,
        isEndShow: 1,
        setIntervalFlag: 0,
        pid: null,
        guid: null,
        nowTime: null,
        isShow: false,
        wxCheck: false,
        isError: false,
        safeFlag: false,
        isTimeOver: false,
        inforoudPortFlag: true,
        voteTimeList: [],
        votePlayerList: [],
        voteSupportTime: Math.ceil(5000*Math.random() + 5000),
        roundData: null,
        repeat_load: true,
        pal: null,
        endType: 1,
        lastRound: false,
        nextPrizeAct: null,
        type: 2,
        isLotteryTimeOver: false,
        showFlag: false,
        lottery_index: 0,
        init: function() {
            shownewLoading();
            this.event();
            this.getVoteinfo();
            this.prereserve();
            this.lotteryRound_port();
        },
        prereserve: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackProgramReserveHandler',
                success : function(data) {
                    if (!data.reserveId) {
                        $("#btn-reserve").addClass('none');
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                        tvid:yao_tv_id,
                        reserveid:data.reserveId,
                        date:data.date},
                    function(resp){
                        if (resp.errorCode == 0) {
                            $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                        } else {
                            $("#btn-reserve").addClass('none');
                        }
                    });
                }
            });
        },
        event: function() {
            var me = this, winW = $(window).width();
            $('body').css('width', winW);
            $('body').delegate('#btn-reserve', 'click', function(e) {
                e.preventDefault();
                var that = this, reserveId = $(this).attr('data-reserveid'), date = $(this).attr('data-date');
                if (!reserveId || !date) {
                    return;
                };
                window['shaketv'] && shaketv.reserve_v2({
                    tvid:yao_tv_id,
                    reserveid:reserveId,
                    date:date},
                function(d){
                    if(d.errorCode == 0){
                        $("#btn-reserve").addClass('none');
                    }
                });
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    setTimeout(function(){
                        $(that).removeClass('requesting');
                    }, 1000);
                };
            }).delegate('.btn-like', 'click', function(e) {
                e.preventDefault();
                var thisMonkey = $(this).parent('.info-vote-box').find('.vote-num i');
                if ($(this).hasClass('close-liked')) {
                    showTips('点赞已结束，敬请期待下期<br><p style="font-size:16px;font-weight:bolder;">每周日晚19:30锁定CCTV3</p>');
                    return;
                }
                if ($(this).hasClass('over-liked')) {
                    showTips('点赞已结束，敬请期待下期<br><p style="font-size:16px;font-weight:bolder;">每周日晚19:30锁定CCTV3</p>');
                    return;
                }
                if ($(this).hasClass('off-liked')) {
                    showTips('嘉宾表演才能点赞哦~');
                    return;
                }
                if ($(this).hasClass('liked')) {
                    showTips('您已经赞过了~');
                    return;
                }
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/voteguess/guessplayer' + dev,
                    data: { yoi: openid,
                            guid: $(this).parent('.info-vote-box').attr('data-guid'),
                            pluids: $(this).parent('.info-vote-box').attr('data-pid') },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackVoteguessGuessHandler',
                    timeout: 5000,
                    complete: function() {
                    },
                    success : function(data) {
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
                var nowVotes = parseInt($(this).parent('.info-vote-box').find('.vote-num label').text()) || 0;
                $(this).addClass('liked').find('label').html('已&nbsp;&nbsp;&nbsp;赞');
                $(this).parent('.info-vote-box').find('.vote-num label').html(nowVotes + 1).parents('.player').attr('data-num', nowVotes + 1);
                thisMonkey.removeClass('none');
                setTimeout(function(){
                    thisMonkey.addClass('none');
                }, 1000);
                var exp = new Date(), data4pid = $(this).parent('.info-vote-box').attr('data-pid');
                exp.setTime(exp.getTime() + 24*60*60*1000);          
                if($.fn.cookie(openid + '_' + data4pid) == null) {
                    $.fn.cookie(openid + '_' + data4pid, true, {expires: exp});
                }
            }).delegate('.btn-go2lottery', 'click', function(e) {
                e.preventDefault();
                toUrl('lottery.html');
            }).delegate('.btn-go2talk', 'click', function(e) {
                e.preventDefault();
                toUrl('talk.html');
            }).delegate('.icon-gift', 'click', function(e) {
                e.preventDefault();
                var exp = new Date();
                exp.setTime(exp.getTime() + 24*60*60*1000);         
                if($.fn.cookie(openid + '_' + H.vote.pid + '_sufei') == null) {
                    $('.luck-box').animate({'opacity':'0', '-webkit-transform':'scale(1.3)'}, 300, function(){
                        $(this).addClass('none');
                    });
                    setTimeout(function(){
                        if(!openid || openid=='null'){
                            me.voteLottery_show(null);
                        }else{
                            me.voteLottery_port();
                        }
                    }, 200);
                    $.fn.cookie(openid + '_' + H.vote.pid + '_sufei', true, {expires: exp});
                } else {
                    $('.luck-box').animate({'opacity':'0', '-webkit-transform':'scale(1.3)'}, 300, function(){
                        $(this).addClass('none');
                    });
                    me.voteLottery_show(null);
                }
            });
        },
        voteLottery_port: function() {
            var me = this, sn = new Date().getTime() + '';
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck4Vote' + dev,
                data: { oi: openid , sn : sn },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuck4VoteHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        sn = new Date().getTime() + '';
                        me.voteLottery_show(null);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime() + '';
                            me.voteLottery_show(data);
                        }
                    }else{
                        sn = new Date().getTime() + '';
                        me.voteLottery_show(null);
                    }
                },
                error : function() {
                    sn = new Date().getTime() + '';
                    me.voteLottery_show(null);
                }
            });
            recordUserOperate(openid, "调用投票抽奖接口", "doVoteLottery");
            recordUserPage(openid, "调用投票抽奖接口", 0);
        },
        voteLottery_show: function(data) {
            if(data == null || data.result == false || data.pt == 0){
                H.dialog.thanks4vote.open();
                return;
            }else{
                $("#audio-b").get(0).play();
            }
            if (data.pt == 1) {
                H.dialog.shiwuLottery4vote.open(data);
            } else if (data.pt == 9) {
                H.dialog.linkLottery4vote.open(data);
            } else {
                H.dialog.thanks4vote.open();
            }
        },
        getVoteinfo: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud' + dev,
                data: { yoi: openid },
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        if (data.items) {
                            me.pid = data.pid;
                            me.nowTime = timeTransform(parseInt(data.cud));
                            me.dec = new Date().getTime() - parseInt(data.cud);
                            me.countdownInfo(data);
                        } else {
                            me.safeVoteMode();
                        }
                    } else {
                        if (me.inforoudPortFlag) {
                            me.inforoudPortFlag = false;
                            setTimeout(function(){
                                me.getVoteinfo();
                            }, 2000);
                        } else {
                            me.safeVoteMode();
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    me.safeVoteMode();
                }
            });
        },
        safeVoteMode: function(flag) {
            var me = this;
            me.safeFlag = true;
            me.pid = localVoteData.pid;
            me.nowTime = timeTransform(new Date().getTime());
            me.countdownInfo(localVoteData);
            hidenewLoading();
        },
        countdownInfo: function(data) {
            var me = this, voteTimeListLength = data.items.length;
            me.voteTimeList = data.items;
            if (me.safeFlag) {
                // 假数据
                var nowTimeStr = timeTransform(parseInt(new Date().getTime()));
                me.dec = 0;
            } else {
                // 真数据
                var nowTimeStr = timeTransform(parseInt(data.cud));
                me.dec = new Date().getTime() - data.cud;
            }
            //最后一轮结束
            if (comptime(me.voteTimeList[voteTimeListLength-1].get, nowTimeStr) >=0) {
                $('body').removeClass().addClass('overshow');
                me.index = voteTimeListLength;
                me.isShow = false;
                me.showFlag = false;
                if (me.voteTimeList[voteTimeListLength-1].put != '' && me.voteTimeList[voteTimeListLength-1].put2 != '') {
                    // 整个节目都已经结束
                    if (comptime(me.voteTimeList[voteTimeListLength-1].put2, nowTimeStr) >= 0) {
                        me.isEndShow = 3;   //投票+摇奖全部结束
                        me.fillVoteinfo(data, -10);
                        me.change();
                        return;
                    }
                    // 投票结束，显示投票抽奖开始倒计时
                    if(comptime(me.voteTimeList[voteTimeListLength-1].put, nowTimeStr) < 0) {
                        me.isEndShow = 2;
                        me.fillVoteinfo(data, -6);
                        me.VLBeginCountdown(me.voteTimeList[voteTimeListLength-1].put);
                        return;
                    }
                    if(comptime(nowTimeStr, me.voteTimeList[voteTimeListLength-1].put) < 0 && comptime(nowTimeStr, me.voteTimeList[voteTimeListLength-1].put2) >= 0) {
                        me.isEndShow = 3;
                        me.fillVoteinfo(data, -8);
                        me.VLCloseCountdown(me.voteTimeList[voteTimeListLength-1].put2);
                        return;
                    }
                } else {
                    me.change();
                    return;
                }
            };
            for (var i = 0; i < voteTimeListLength; i++) {
                var beginTimeStr =  me.voteTimeList[i].gst;
                var endTimeStr = me.voteTimeList[i].get;
                // 开始
                if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0) {
                    me.index = i;
                    me.isShow = true;
                    me.showFlag = false;
                    me.fillVoteinfo(data, i);
                    me.nowCountdown(endTimeStr);
                    $('body').removeClass().addClass('nowshow');
                    return;
                }
                // 未开始
                if(comptime(beginTimeStr, nowTimeStr) < 0) {
                    me.index = i;
                    me.isShow = true;
                    me.showFlag = true;
                    me.fillVoteinfo(data, -1);
                    me.showbeginCountdown(me.voteTimeList[i]);
                    $('body').removeClass().addClass('noshow');
                    return;
                }
            };
        },
        fillVoteinfo: function(data, flag) {
            var me = this, t = simpleTpl(), items = data.items, voteSupportDelay = Math.ceil(700*Math.random() + 300), detailContent = '';
            if (items.length > 0) {
                for(var i = 0, len = items.length; i < len; i++) {
                    if (items[i].pitems) {
                        if (i < flag) {
                            likeStatus = ' over-liked';
                            likeTips = '已结束';
                        } else if (i == flag) {
                            likeStatus = '';
                            likeTips = '点&nbsp;&nbsp;&nbsp;赞';
                        } else if (i > flag) {
                            likeStatus = ' off-liked';
                            likeTips = '未开始';
                        } else {
                            likeStatus = ' query-liked';
                            likeTips = '查询中';
                        }
                        for(var h = 0, hLen = items[i].pitems.length; h < hLen; h++) {
                            if (me.safeFlag) {
                                var rdTickes = getRandomArbitrary(9157,21388);
                            } else {
                                var rdTickes = 0;
                            }
                            t._('<section id="player' + (i + 1) + '" class="player" data-num="' + rdTickes + '" data-guid="' + items[i].guid + '" data-pid="' + items[i].pitems[h].pid + '">')
                                ._('<img class="player-avatar" src="./images/icon-player-load.png" onload="$(this).attr(\'src\',\'' + items[i].pitems[h].im + '\')" onerror="$(this).addClass(\'none\')">')
                                ._('<section class="info-box">')
                                    ._('<p class="player-name">' + items[i].pitems[h].na + '</p>')
                                    ._('<section class="info-vote-box" data-guid="' + items[i].guid + '" data-pid="' + items[i].pitems[h].pid + '">')
                                        ._('<a href="javascript:void(0);" class="btn btn-like none' + likeStatus + '" id="like-' + items[i].pitems[h].pid + '" data-pid="' + items[i].pitems[h].pid + '" data-collect="true" data-collect-flag="vote-toVote" data-collect-desc="选手投票按钮"><label>' + likeTips + '</label><i class="icon-light-top"><img src="./images/icon-light-top.png"></i><i class="icon-light-bottom"><img src="./images/icon-light-bottom.png"></i></a>')
                                        ._('<p class="vote-num btn none" id="like-num-' + items[i].pitems[h].pid + '">点赞数：<label>' + rdTickes + '</label><i class="none"></i></p>')
                                    ._('</section>')
                                ._('</section>')
                            ._('</section>')
                        };
                    }
                };
                $('.vote-box').html(t.toString());
                me.getVote();
                me.voteSupport(flag);
                if (!me.safeFlag) {
                    var a = self.setInterval(function(){me.voteSupport();}, me.voteSupportTime);
                    me.setIntervalFlag = a;
                }
            } else {
                me.safeVoteMode();
            }
        },
        showbeginCountdown: function(pra) {
            $('body').removeClass().addClass('noshow');
            $('.detail-countdown').attr('etime', timestamp(pra.gst) + H.vote.dec);
            $(".countdown-tip label").html('距离点赞开始还有');
            H.vote.count_down();
            $('.countdown').removeClass('none');
            hidenewLoading();
        },
        nowCountdown: function(time) {
            $('body').removeClass().addClass('nowshow');
            $('.detail-countdown').attr('etime', timestamp(time) + H.vote.dec);
            $(".countdown-tip label").html('距离本轮点赞结束还有');
            for (var i = 0; i <= H.vote.index; i++) {
                $('#player' + (i + 1)).find('.vote-num').removeClass('none');
            };
            H.vote.count_down();
            H.vote.voteListFix(H.vote.index);
            H.vote.index++;
            $('.countdown').removeClass('none');
            hidenewLoading();
        },
        VLBeginCountdown: function(time) {
            $('body').removeClass().addClass('overshow');
            $('.detail-countdown').attr('etime', timestamp(time) + H.vote.dec);
            $(".countdown-tip label").html('距点赞抽奖开始还有');
            H.vote.count_down();
            $('.countdown').removeClass('none');
            $('.btn-like').each(function() {
                if (!$(this).hasClass('liked')) {
                    $(this).removeClass('off-liked over-liked').addClass('close-liked').find('label').html('已结束');
                }
            });
            hidenewLoading();
        },
        VLCloseCountdown: function(time) {
            $('body').removeClass().addClass('overshow');
            $('.detail-countdown').attr('etime', timestamp(time) + H.vote.dec);
            $(".countdown-tip label").html('距点赞抽奖结束还有');
            H.vote.count_down();
            $('.countdown').removeClass('none');
            setTimeout(function(){
                H.vote.rankSort('ok');
            }, 1000);
            hidenewLoading();
        },
        count_down : function() {
            var that = this, voteTimeListLength = that.voteTimeList.length;
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '<span class="fetal-H">%H%' + '<i>时</i></span>' + '%M%' + '<i>分</i>' + '%S%'+'<i>秒</i>',
                    stpl : '<span class="fetal-H">%H%' + '<i>时</i></span>' + '%M%' + '<i>分</i>' + '%S%'+'<i>秒</i>',
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(!that.isTimeOver){
                            that.isTimeOver = true;
                            if (that.index == that.voteTimeList.length) {
                                if (that.voteTimeList[voteTimeListLength-1].put != '' && that.voteTimeList[voteTimeListLength-1].put2 != '') {
                                    if (that.isEndShow == 1) {
                                        that.isShow = false;
                                        that.isEndShow = 2;
                                        that.VLBeginCountdown(that.voteTimeList[voteTimeListLength-1].put);
                                        return;
                                    } else if (that.isEndShow == 2) {
                                        that.isShow = false;
                                        that.isEndShow = 3;   //投票+摇奖全部结束
                                        that.VLCloseCountdown(that.voteTimeList[voteTimeListLength-1].put2);
                                        return;
                                    } else {
                                        that.isShow = false;
                                        that.change();
                                        return;
                                    }
                                } else {
                                    that.isShow = false;
                                    that.change();
                                    return;
                                }
                            }
                            if (that.showFlag) {
                                $(".countdown-tip label").html('距离本轮点赞结束还有');
                                $('.detail-countdown').attr('etime', timestamp(that.voteTimeList[that.index].get) + that.dec);
                                $('.btn-like').each(function(index, el) {
                                    if (!$(this).hasClass('over-liked')) {
                                        $(this).removeClass('disabled-liked').addClass('off-liked').find('label').html('未开始');
                                    }
                                });
                                if (!$('#player' + (that.index + 1)).hasClass('liked')) {
                                    $('#player' + (that.index + 1)).find('.btn-like').removeClass('disabled-liked, off-liked').find('label').html('点&nbsp;&nbsp;&nbsp;赞');
                                }
                                $('#player' + (that.index + 1)).find('.vote-num').removeClass('none');

                                H.vote.voteListFix(H.vote.index);

                                that.index++;
                                that.showFlag = false;
                            } else {
                                $(".countdown-tip label").html('距离本轮点赞开始还有');
                                console.log(that.voteTimeList[that.index].gst);
                                $('.detail-countdown').attr('etime', timestamp(that.voteTimeList[that.index].gst) + that.dec);
                                $('.btn-like').each(function(index, el) {
                                    if (!$(this).hasClass('liked')) {
                                        $(this).removeClass('disabled-liked').addClass('off-liked').find('label').html('未开始');
                                    }
                                });
                                if (!$('#player' + (that.index)).hasClass('liked')) {
                                    $('#player' + (that.index)).find('.btn-like').removeClass('disabled-liked, off-liked').addClass('over-liked').find('label').html('已结束');
                                }
                                that.showFlag = true;
                            }
                        }
                    },
                    sdCallback :function(){
                        that.isTimeOver = false;
                    }
                });
            });
        },
        voteSupport: function(flag) {
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/allplayertickets' + dev,
                data: { periodUuid: me.pid },
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessAllplayerticketsHandler',
                timeout: 5000,
                complete: function() {
                },
                success : function(data) {
                    if (data.code == 0 && data.items) {
                        var items = data.items, length = data.items.length;
                        for (var i = 0; i < length; i++) {
                            var oldPlayerCount = parseInt($('#like-num-' + data.items[i].puid).find('label').text());
                            if(oldPlayerCount < data.items[i].cunt || oldPlayerCount == 0){
                                $('#like-num-' + data.items[i].puid).find('label').html(data.items[i].cunt).parents('.player').attr('data-num', data.items[i].cunt);
                            }
                        };
                        if (flag == -10) {
                            me.rankSort();
                        } else if (flag == -8) {
                            me.rankSort('ok');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        getVote: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/isvoteall' + dev,
                data: { yoi: openid },
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessIsvoteAllHandler',
                timeout: 5000,
                complete: function() {
                },
                success : function(data) {
                    if (data.code == 0) {
                        if (data.items) {
                            var items = data.items, length = data.items.length;
                            for (var i = 0; i < length; i++) {
                                if (data.items[i].so) {
                                    var soList = data.items[i].so.split(',');
                                    var soLength = soList.length;
                                    for (var j = 0; j < soLength; j++) {
                                        $('#like-' + soList[j]).removeClass('close-liked off-liked').addClass('liked').find('label').html('已&nbsp;&nbsp;&nbsp;赞');
                                        if (j == soLength - 1) {
                                            $('.btn-like').removeClass('none');
                                        }
                                    };
                                } else {
                                    $('.btn-like').removeClass('none');
                                }
                            };
                        } else {
                            $('.btn-like').removeClass('none');
                        }
                    } else {
                        $('.btn-like').removeClass('none');
                    }
                },
                error : function(xmlHttpRequest, error) {
                    $('.btn-like').removeClass('none');
                }
            });
        },
        rankSort: function(flag) {
            var me = this, player = $('.player'), arr = [];
            me.closeVoteInterval();
            for(var i = 0; i < player.length; i++) {
                arr.push(player[i]);
            };
            arr.sort(function(a,b){return b.getAttribute('data-num') - a.getAttribute('data-num')});
            $('.vote-box').empty();
            for(var i = 0; i< arr.length; i++) {
                $('.vote-box').append(arr[i]);
            };
            $('.btn-like').each(function() {
                if (!$(this).hasClass('liked')) {
                    $(this).removeClass('off-liked over-liked').addClass('close-liked').find('label').html('已结束');
                }
            });
            $('.vote-box').addClass('rank');
            if (flag == 'ok') {
                var bestPlayer = $('.vote-box .player:eq(0)').attr('data-pid');
                if($.fn.cookie(openid + '_' + bestPlayer)) {
                    if ($.fn.cookie(openid + '_' + H.vote.pid + '_sufei') == null) {
                        $('.luck-box').removeClass('none').animate({'opacity':'1', '-webkit-transform':'scale(1)'}, 300);
                    }
                }
            }
        },
        voteListFix: function(flag) {
            var me = this, player = $('.player'), arr = [];
            if (flag > 0 && flag < player.length) {
                for(var i = 0; i < player.length; i++) {
                    arr.push(player[i]);
                };
                var target = arr[flag];
                arr.splice(flag,1);
                arr.unshift(target);
                $('.vote-box').empty();
                for(var i = 0; i< arr.length; i++) {
                    $('.vote-box').append(arr[i]);
                };
            }

        },
        closeVoteInterval: function() {
            var me = this;
            if (!me.safeFlag) {
                me.setIntervalFlag = window.clearInterval(me.setIntervalFlag);
                me.voteSupportTime = 86400000;
            }
        },
        change: function() {
            var me = this;
            me.closeVoteInterval();
            $('body').removeClass().addClass('overshow');
            $(".countdown-tip label").html('本期点赞已结束，下期再战！');
            hidenewLoading();
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
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.lotteryRound_port();
                            },500);
                        }else{
                            me.lotteryChange();
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    me.lotteryChange();
                }
            });
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
                    me.lotteryChange();
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    me.lottery_index = i;
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
                        me.lottery_nowCountdown(prizeActList[i]);
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        me.lottery_beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            }
        },
        // 摇奖开启倒计时
        lottery_beforeCountdown: function(prizeActList) {
            var me = this;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.lottery-countdown').attr('etime',beginTimeLong).empty();
            $(".lottery-tip").html('还有');
            $(".shake-tip").removeClass("none");
            me.lotteryCount_down();
            $('.lotteryCountdown').removeClass('none');
            hidenewLoading();
        },
        // 摇奖结束倒计时
        lottery_nowCountdown: function(prizeActList){
            var me = this;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.lottery-countdown').attr('etime',beginTimeLong).empty();
            $(".lottery-tip").html("摇奖进行中...");
            $(".shake-tip").addClass("none");
            me.lotteryCount_down();
            $('.lotteryCountdown').removeClass('none');
            $(".lottery-countdown").addClass("none");
            me.lottery_index++;
            hidenewLoading();
        },
        lotteryCount_down: function() {
            var me = this;
            $('.lottery-countdown').each(function() {
                $(this).countDown({
                    etpl: '%M%' + ':' + '%S%', // 还有...结束
                    stpl: '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.type == 1){
                            //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                            if(!me.isLotteryTimeOver){
                                me.isLotteryTimeOver = true;
                                $(".shake-tip").addClass("none");
                                $('.lottery-tip').html('请稍后');
                                shownewLoading(null,'请稍后...');
                                setTimeout(function() {
                                    me.lottery_nowCountdown(me.pal[me.lottery_index]);
                                }, 1000);
                            }
                        }else if(me.type == 2){
                            //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                            if(!me.isLotteryTimeOver){
                                me.isLotteryTimeOver = true;
                                if(me.lottery_index >= me.pal.length){
                                    me.lotteryChange();
                                    me.type = 3;
                                    return;
                                }
                                $('.lottery-tip').html('请稍后');
                                shownewLoading(null,'请稍后...');
                                var i = me.lottery_index - 1;
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
                                        me.lottery_nowCountdown(me.pal[me.lottery_index]);
                                    }else if(me.endType == 1){
                                        me.lottery_beforeCountdown(me.pal[me.lottery_index]);
                                    } else {
                                        me.lotteryChange();
                                    }
                                },1000);
                            }
                        }
                    },
                    sdCallback: function(){
                        me.isLotteryTimeOver = false;
                    }
                });
            });
        },
        lotteryChange : function(){
            hidenewLoading();
            $(".lottery-tip").html('今日摇奖已结束，请明天再来');
            $('.lottery-countdown').html("");
            $(".shake-tip").addClass("none");
            $('.lotteryCountdown').addClass('none');
        }
    };
})(Zepto);

$(function() {
    H.vote.init();
});