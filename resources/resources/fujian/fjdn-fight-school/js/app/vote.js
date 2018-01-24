(function($) {
    H.vote = {
        pid: null,
        nowTime: null,
        isTimeOver: false,
        voteSelector: null,
        r2Flag: false,
        guid: null,
        voteFlag: null,
        bloodBarFlag: true,
        totalVotes: 0,
        init: function(){
            var me = this;
            me.get_port();
            me.event();
            var winW = $(window).width(),
                winH = $(window).height();
            $('body').css({
                'width': winW,
                'height': winH
            });
            var winW = $(window).width(),
                winH = $(window).height();
            $('body').css({
                'width': winW,
                'height': winH
            });
        },
        get_port: function(){
            getResult('api/voteguess/info', { yoi: openid }, 'callbackVoteguessInfoHandler', true);
        },
        event: function(){
            var me = this;
            $('#btn-go2talk').click(function(e){
                e.preventDefault();
                toUrl("comments.html");
            });
            $('#btn-go2lottery').click(function(e){
                e.preventDefault();
                if (me.guid) {
                    var guid = me.guid;
                } else {
                    var guid = '';
                }
                toUrl("lottery.html?guid=" + guid);
            });
            $('#btn-go2next').click(function(e){
                e.preventDefault();
                $('.next').removeClass('none');
            });
            $('.next').click(function(e) {
                e.preventDefault();
                $(this).addClass('none');
            });
            $('.guest-thanks').click(function(e) {
                e.preventDefault();
                $(this).addClass('none');
            });
        },
        fillVote: function(data){
            var me = this, t = simpleTpl(), s = simpleTpl(), items = data.items;
            $('header').removeClass();
            $('#guest-box').empty();
            for(var i = 0,len = items.length; i < len; i++) {
                var guestLength = items[i].pitems.length;
                if (guestLength == 1) {
                    if (items[i].so && items[i].so != '') {
                        if (items[i].pitems[0].pid == items[i].so) {
                            var voteState = ' vote-ok requesting';
                        } else {
                            var voteState = ' requesting';
                        }
                        var voted = ' voted';
                    } else {
                        var voteState = '';
                        var voted = '';
                    }
                    t._('<div class="guest-1 round round' + i + ' none ' + voted + '">')
                        ._('<img src="./images/preload.png" data-original="' + items[i].pitems[0].im + '" data-guid="' + items[i].guid + '" data-pid="' + items[i].pitems[0].pid + '">')
                        ._('<div class="guest-intro">')
                            ._('<p class="guest-name">' + items[i].pitems[0].na + '</p>')
                            ._('<p class="guest-vote">票数:<label class="votes ' + items[i].pitems[0].pid + '"></label></p>')
                            ._('<i id="zanr' + items[i].pitems[0].pid + '"></i>')
                        ._('</div>')
                        ._('<a href="#" class="btn-vote btn-vote1' + voteState + '" data-flag="' + i + '" data-guid="' + items[i].guid + '" data-pid="' + items[i].pitems[0].pid + '" data-collect="true" data-collect-flag="fjdn-fight-school-vote-zan" data-collect-desc="投票页-给选手点赞"></a>')
                    ._('</div>')
                    $('.guest' + i).css({
                        'background': 'url(' + items[i].pitems[0].im2 + ') no-repeat',
                        'background-size': 'cover'
                    });
                } else {
                    t._('<div class="guest-2 round round' + i + ' none">')
                        ._('<ul>')
                            for(var j = 0,jlen = items[i].pitems.length; j < jlen; j++) {
                                var winner = '';
                                if (i + 1 == len) {
                                    if (items[i].pitems[j].re == 1) {
                                        var winner = '<img class="winner none" src="./images/icon-winner.png">';
                                    } else {
                                        var winner = '';
                                    }
                                }
                                if (items[i].so && items[i].so != '') {
                                    if (items[i].pitems[j].pid == items[i].so) {
                                        var voteState = ' vote-ok requesting';
                                    } else {
                                        var voteState = ' requesting';
                                    }
                                    var voted = ' voted';
                                } else {
                                    var voteState = '';
                                    var voted = '';
                                }
                                t._('<li class="' + voted + '">')
                                    ._('<img src="./images/preload.png" data-original="' + items[i].pitems[j].im + '" data-guid="' + items[i].guid + '" data-pid="' + items[i].pitems[j].pid + '">')
                                    ._(winner)
                                    ._('<div class="guest-intro">')
                                        ._('<p class="guest-name">' + items[i].pitems[j].na + '</p>')
                                        ._('<p class="guest-vote none">票数:<label class="votes ' + items[i].pitems[j].pid + '"></label></p>')
                                        ._('<a href="#" class="btn-vote btn-vote2' + voteState + '" data-flag="' + i + '" data-guid="' + items[i].guid + '" data-pid="' + items[i].pitems[j].pid + '" data-collect="true" data-collect-flag="fjdn-fight-school-vote-zan" data-collect-desc="投票页-给选手点赞"></a>')
                                    ._('</div>')
                                ._('</li>')
                            }
                        t._('</ul>')
                    ._('</div>')
                };
                if (H.vote.bloodBarFlag && guestLength == 2) {
                    H.vote.bloodBarFlag = false;
                    s._('<div class="blood-bar" id="blood-bar">')
                        ._('<div class="cover-bar">')
                            ._('<span class="mask-bar blood' + items[i].pitems[0].pid + '" style="width:50%" data-pid="' + items[i].pitems[0].pid + '"></span>')
                        ._('</div>')
                        ._('<div class="guest-info">')
                        for(var n = 0,nlen = items[i].pitems.length; n < nlen; n++) {
                            s._('<span class="guest-zan">' + items[i].pitems[n].na + '<i id="zan' + items[i].pitems[n].pid + '"></i></span>')
                        }
                        s._('</div>')
                    ._('</div>')
                };
            }
            $('#guest-box').append(t.toString());
            $('.round-b').append(s.toString());
            me.resize();
            me.voteInfo(data);
            me.voteEvent();
            me.voteSupport();
            $("img").lazyload({container: $("#guest-box")});
        },
        voteInfo: function(data) {
            var me = this, voteLength = 0,
                voteActListAll = data.items,
                nowTimeStr = H.vote.nowTime,
                voteActList = [];
            var day = nowTimeStr.split(" ")[0];
            if(voteActListAll && voteActListAll.length > 0) {
                for ( var i = 0; i < voteActListAll.length; i++) {
                    if(voteActListAll[i].get.split(" ")[0] == day) {
                        voteActList.push(voteActListAll[i]);
                    }
                }
            }
            voteLength = voteActList.length;
            if(voteActList.length > 0) {
                if(comptime(voteActList[voteLength-1].get,nowTimeStr) >= 0){
                    H.vote.change(data);
                    me.guid = data.items[voteLength-1].guid;
                    return;
                }
                for ( var i = 0; i < voteActList.length; i++) {
                    var beginTimeStr = voteActList[i].gst;
                    var endTimeStr = voteActList[i].get;
                    if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >= 0){
                        H.vote.do_count_down(endTimeStr, nowTimeStr, true);
                        $('.btn-vote').removeClass('none');
                        if (data.items[i].pitems.length == 1) {
                            $('body').removeClass().addClass('r1');
                        } else {
                            $('body').removeClass().addClass('r2');
                        }
                        if (data.items[i].hlo == 0) {
                            me.guid = data.items[i].guid;
                        } else {
                            me.guid = data.items[i].guid;
                            if ($('.round' + i + ' .btn-vote').hasClass('vote-ok')) {
                                $('#btn-go2talk').removeClass('swing');
                                $('#btn-go2lottery').addClass('swing');
                                $('header').addClass('lottery');
                            };
                        }
                        $('.round').addClass('none');
                        $('.round' + i).removeClass('none');
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.vote.do_count_down(beginTimeStr, nowTimeStr, false);
                        me.guid = data.items[i].guid;
                        $('header').removeClass('lottery');
                        $('.btn-vote').addClass('none');
                        if (data.items[i].pitems.length == 1) {
                            $('body').removeClass().addClass('r1');
                        } else {
                            $('body').removeClass().addClass('r2');
                        }
                        $('.round').addClass('none');
                        $('.round' + i).removeClass('none').find('.btn-vote').addClass('vote-ok');
                        return;
                    }
                }
            }else{
                H.vote.change(null);
                return;
            }
        },
        voteSupport: function() {
            var me = this;
            getResult('api/voteguess/supportplayer/' + me.guid , {}, 'callbackVoteguessSupportPlayerHandler');
        },
        voteEvent: function() {
            var me = this;
            $('.btn-vote1').click(function(e){
                e.preventDefault();
                if ($(this).hasClass('requesting') || $(this).hasClass('vote-ok')) {
                    return;
                };
                $(this).addClass('requesting');
                H.vote.voteFlag = $(this).attr('data-flag');
                H.vote.voteSelector = $(this);
                H.vote.r2Flag = false;
                getResult('api/voteguess/guessplayer', {
                    yoi: openid,
                    guid: $(this).attr('data-guid'),
                    pluids: $(this).attr('data-pid')
                }, 'callbackVoteguessGuessHandler', true);
            });
            $('.btn-vote2').click(function(e){
                e.preventDefault();
                if ($(this).hasClass('requesting') || $(this).hasClass('vote-ok')) {
                    return;
                };
                $(this).parent('.guest-intro').parent('li').parent('ul').find('.btn-vote').addClass('requesting');
                H.vote.voteSelector = $(this);
                H.vote.r2Flag = true;
                getResult('api/voteguess/guessplayer', {
                    yoi: openid,
                    guid: $(this).attr('data-guid'),
                    pluids: $(this).attr('data-pid')
                }, 'callbackVoteguessGuessHandler', true);
            });
        },
        change: function(data) {
            if (data && data.code == 0) {
                var me = this, voteLength = 0,
                    voteActListAll = data.items,
                    nowTimeStr = H.vote.nowTime,
                    voteActList = [];
                var day = nowTimeStr.split(" ")[0];
                if(voteActListAll && voteActListAll.length > 0) {
                    for ( var i = 0; i < voteActListAll.length; i++) {
                        if(voteActListAll[i].get.split(" ")[0] == day) {
                            voteActList.push(voteActListAll[i]);
                        }
                    }
                }
                voteLength = voteActList.length;
                if(voteActList.length > 0) {
                    if(comptime(voteActList[voteLength-1].get,nowTimeStr) >= 0){
                        $('.round' + (voteLength-1)).removeClass('none');
                        $('body').addClass('show-over');
                    }
                }
                $(".countdown").removeClass("none");
                $(".countdown-tip").html('');
                $('.detail-countdown').html('');
                $('header').removeClass('lottery').addClass('over');
                $('#btn-go2talk').removeClass('swing');
                $('#btn-go2lottery').removeClass('swing');
                $('#btn-go2next').addClass('swing');
                $('.btn-vote').addClass('none');
                $('.next').append('<div class="next-scroll" style="width:100%;height:100%;overflow-y:scroll;background-color:#18342c;"><img src="' + data.iul + '"></div>');
            } else {
                $(".countdown").removeClass("none");
                $(".countdown-tip").html('');
                $('.detail-countdown').html('');
                $('header').removeClass('lottery');
                $('.btn-vote').addClass('none');
            }
        },
        do_count_down: function(endTimeStr, nowTimeStr, isStart){
            if(isStart){
                H.vote.isLotteryTime = true;
                $(".countdown-tip").html('距本轮投票结束还有 ');
            }else{
                H.vote.isLotteryTime = false;
                $(".countdown-tip").html('距投票开始还有 ');
            }
            var endTimeLong = timestamp(endTimeStr);
            var nowTime = Date.parse(new Date())/1000;
            var serverTime = timestamp(nowTimeStr);
            if(nowTime > serverTime){
                endTimeLong += (nowTime - serverTime);
            }else if(nowTime < serverTime){
                endTimeLong -= (serverTime - nowTime);
            }
            $('.detail-countdown').attr('etime',endTimeLong);
            H.vote.count_down();
            $(".countdown").removeClass("none");
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
                    stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(!H.vote.isTimeOver){
                            H.vote.isTimeOver = true;
                            $(".countdown-tip").html('');
                            shownewLoading(null,'请稍后...');
                            var delay = Math.ceil(2500*Math.random() + 1700);
                            setTimeout(function(){
                                hidenewLoading();
                                getResult('api/voteguess/info', { yoi: openid }, 'callbackVoteguessInfoHandler', true);
                            }, delay);
                        }
                        return;
                    },
                    sdCallback :function(){
                        H.vote.isTimeOver = false;
                    }
                });
            });
        },
        resize: function() {
            var winH = $(window).height();
            var containerH = winH - $('header').height();
            var footerBoxH = $('.footer-box').height();
            $('.container').css('height', containerH - footerBoxH);
            $('.next').css('height', winH - footerBoxH);
        }
    };

    W.callbackVoteguessInfoHandler =function(data){
        if(data.code == 0){
            H.vote.pid = data.Pid;
            H.vote.nowTime = timeTransform(data.cud);
            H.vote.fillVote(data);
        }
    };

    W.callbackVoteguessGuessHandler = function(data) {
        if (data.code == 0) {
            $('#btn-go2talk').removeClass('swing');
            $('#btn-go2lottery').addClass('swing');
            if (H.vote.r2Flag) {
                H.vote.r2Flag = false;
                var nowVotes = parseInt($(H.vote.voteSelector).parent('.guest-intro').find('.votes').text());
                $(H.vote.voteSelector).addClass('vote-ok').parent('.guest-intro').addClass('show-vote').find('.votes').html(nowVotes + 1);
                $('header').addClass('lottery');
                var thisVote = $(H.vote.voteSelector).attr('data-pid');
                if ($('.mask-bar').attr('data-pid') == $(H.vote.voteSelector).attr('data-pid')) {
                    var percentVote = ((nowVotes + 1) / (H.vote.totalVotes + 1)).toFixed(3) * 100;
                    $('.mask-bar').css('width', percentVote + '%');
                } else {
                    var percentVote = ((nowVotes + 1) / (H.vote.totalVotes + 1)).toFixed(3) * 100;
                    $('.mask-bar').css('width', (100 - percentVote) + '%');
                }
                $('#zan' + thisVote).addClass('zan');
            } else {
                var thisVote = $(H.vote.voteSelector).attr('data-pid');
                $('.guest-thanks').addClass('none');
                $('header').addClass('lottery');
                setTimeout(function() {
                    $('.guest' + H.vote.voteFlag).removeClass('none');
                }, 1300);
                setTimeout(function() {
                    $('.guest-thanks').addClass('none');
                }, 4300);
                var nowVotes = parseInt($(H.vote.voteSelector).parent('.round').find('.guest-vote .votes').text());
                $(H.vote.voteSelector).addClass('vote-ok').parent('.round').find('.guest-intro').addClass('show-vote').find('.votes').html(nowVotes + 1);
                $('#zanr' + thisVote).addClass('zanr');
            }
        } else if (data.code == 4) {
            showTips('亲，您已经投过票了!');
        }
    };

    W.callbackVoteguessSupportPlayerHandler = function(data) {
        if (data.items && data.code == 0) {
            var items = data.items, length = data.items.length;
            H.vote.totalVotes = 0;
            for (var i = 0; i < length; i++) {
                $('.' + data.items[i].puid).text(data.items[i].cunt);
                H.vote.totalVotes = H.vote.totalVotes + data.items[i].cunt;
            };
            var percentVote = (data.items[0].cunt / H.vote.totalVotes).toFixed(3) * 100;
            $('.blood' + data.items[0].puid).css('width', percentVote + '%');
            $('.guest-vote').removeClass('none');
        };
    };

})(Zepto);

$(function(){
    H.vote.init();
});