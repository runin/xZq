(function($) {
	H.vote = {
        pid: null,
        guid: null,
        nowTime: null,
        isTimeOver: false,
        voteshowFlag: false,    //voteshowFlag:true 显示商品价格  voteshowFlag:false 不显示商品价格
        showEtime: null,
        serverTimePortFlag: true,  //服务接口的标识，true为可以在上次接口回调失败中再调一次接口，false为不能再调用接口
        inforoudPortFlag: true,    //主活动信息服务接口的标识，true为可以在上次接口回调失败中再调一次接口，false为不能再调用接口
        lottery4voteFlag: true,
        lotteryBack: getQueryString('lotteryBack'),
        dec: 0,
		init: function () {
            var me = this, delay = Math.ceil(700*Math.random() + 300), winW = $(window).width(), winH = $(window).height();
            shownewLoading();
            me.supportRandom();
            setTimeout(function(){
                me.event();
                me.showclose_port();
            }, delay);
            $('.detail-box').css({
                'width': winW,
                'height': winH
            });
		},
		event: function() {
			var me = this;
			$('.btn-go2record').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) {
                    return;
                }
                $(this).addClass('requesting');
                toUrl('goods.html');
			});
            $('.btn-go2jlf').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) {
                    return;
                }
                $(this).addClass('requesting');
                shownewLoading(null, '请稍后...');
                location.href = 'http://mp.weixin.qq.com/s?__biz=MjM5NDIwOTcyMA==&mid=205550649&idx=1&sn=6b3e32f2455fea8e42a321e3e684fcd0#wechat_redirect';
            });
            $('.btn-gift').click(function(e) {
                e.preventDefault();
                // var exp = new Date();
                // exp.setTime(exp.getTime() + 2*24*60*60*1000);
                // if (!$.fn.cookie(openid + '_giftStatus')) {
                    // $.fn.cookie(openid + '_giftStatus', 'true', {expires: exp});
                // }
                if ($(this).hasClass('requesting')) {
                    return;
                }
                $(this).addClass('requesting');
                toUrl('lottery.html');
            });
            $('.btn-care').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) {
                    return;
                }
                $(this).addClass('requesting');
                toUrl('hope.html');
            });
		},
        supportRandom: function() {
            var me = this, tipsRandom = getRandomArbitrary(1, 4), supportListLen = support_list.length;
            var supportRandom = getRandomArbitrary(0, supportListLen);
            // $('.icon-zan').attr('src', './images/icon-zantips' + tipsRandom + '.png').animate({'opacity':'1'}, 600);
            $('.icon-zan').attr('src', './images/icon-zantips.png').animate({'opacity':'1'}, 600);
            $('.support-box').text(support_list[supportRandom]);
            // if (!$.fn.cookie(openid + '_giftStatus')) {
            //     $('.btn-gift').removeClass('none');
            // } else {
            //     $('.btn-gift').addClass('none');
            // }
        },
        showclose_port: function() {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/common/servicetime' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'commonApiServicetimeHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if (data && data.st && data.pet && data.pbt && data.fq) {
                        var allday = timeTransform(parseInt(data.st));
                        var sshowTime = allday.split(" ")[0] + ' ' + data.pbt, eshowTime = allday.split(" ")[0] + ' ' + data.pet;
                        var day = new Date(str2date(allday)).getDay().toString();
                        if (day == '0') { day = '7'; }
                        if (data.fq.indexOf(day) >= 0) {
                            $('#btn-go2record').removeClass('none');
                            if (comptime(sshowTime,allday) < 0) {
                                H.vote.cookie4toUrl('lottery.html');
                            } else if (comptime(eshowTime,allday) >= 0) {
                                toUrl('over.html');
                            } else {
                                H.vote.getVoteinfo();
                            }
                        } else {
                            $('#btn-go2record').addClass('none');
                            toUrl('over.html');
                        }
                    } else {
                        if (H.vote.serverTimePortFlag) {
                            H.vote.serverTimePortFlag = false;
                            H.vote.showclose_port();
                        } else {
                            H.vote.cookie4toUrl('lottery.html');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    H.vote.cookie4toUrl('lottery.html');
                }
            });
        },
        getVoteinfo: function() {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud' + dev,
                data: { yoi: openid },
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    // alert(JSON.stringify(data));
                    if(data.code == 0){
                        if (data.items) {
                            H.vote.pid = data.pid;
                            H.vote.guid = data.items[0].guid;
                            H.vote.nowTime = timeTransform(parseInt(data.cud));
                            H.vote.dec = new Date().getTime() - parseInt(data.cud);
                            H.vote.fillVoteinfo(data);
                        } else {
                            H.vote.cookie4toUrl('lottery.html');
                        }
                    } else {
                        if (H.vote.inforoudPortFlag) {
                            H.vote.inforoudPortFlag = false;
                            setTimeout(function(){
                                H.vote.getVoteinfo();
                            }, 2000);
                        } else {
                            H.vote.cookie4toUrl('lottery.html');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    H.vote.cookie4toUrl('lottery.html');
                }
            });
        },
        getVote: function() {
            getResult('api/voteguess/isvoteall', { yoi: openid }, 'callbackVoteguessIsvoteAllHandler');
        },
        fillVoteinfo: function(data) {
            var me = this, t = simpleTpl(), items = data.items, voteSupportDelay = Math.ceil(700*Math.random() + 300), detailContent = '';
            if (data.iul && data.iul != '') {
                $('.guest-box').prepend('<img src="' + data.iul + '">');
            }
            if (items.length > 0) {
                for(var i = 0, len = items.length; i < len; i++) {
                    if (items[i].pitems) {
                        for(var h = 0, hLen = items[i].pitems.length; h < hLen; h++) {
                            var rdTickes = getRandomArbitrary(9157,21388);
                            if (items[i].pitems[h].in != '') {
                                var detailStatus = '';
                            } else {
                                var detailStatus = ' error';
                            }
                            if (items[i].pitems[h].im3 != '') {
                                var emptyPhoto = ' isempty';
                            } else {
                                var emptyPhoto = '';
                            }
                            t._('<li>')
                                ._('<div class="vote-img-box' + detailStatus + '" data-img-pid="' + items[i].pitems[h].pid + '"><img class="before" src="' + items[i].pitems[h].im + '">')
                                ._('<img class="after preload" src="' + items[i].pitems[h].im2 + '"></div>')
                                ._('<div class="hot-box' + emptyPhoto + '">')
                                    ._('<img src="./images/icon-hot.png">')
                                    ._('<span id="vote' + items[i].pitems[h].pid + '">' + rdTickes + '</span>')
                                ._('</div>')
                                ._('<a class="btn-vote none' + emptyPhoto + '" id="btn-vote-' + items[i].pitems[h].pid + '" href="#" data-guid="' + items[i].guid + '" data-pid="' + items[i].pitems[h].pid + '" data-collect="true" data-collect-flag="vote-voted-btn" data-collect-desc="投票页-投票按钮">我想要</a>')
                            ._('</li>');

                            detailContent += '<div id="detail-' + items[i].pitems[h].pid + '" class="none">'
                                                + '<a href="#" class="btn-detail-close" id="btn-detail-close"><img src="./images/btn-close.png"></a>'
                                                + '<div class="detail-content">'
                                                    + '<h1>' + items[i].pitems[h].ni + '</h1>'
                                                    + '<div class="main-content">' + items[i].pitems[h].in + '</div>'
                                                + '</div>'
                                            + '</div>';
                        };
                    }
                };
                $('.detail-box').html(detailContent);
                $('.main').removeClass('none').find('ul').append(t.toString());
                var winH = $(window).height();
                var imgW = $('ul li').width();
                var imgH = Math.ceil(imgW * 260 / 208);
                var detailH = Math.ceil(winH * 0.6 * 0.9);
                $('.vote-img-box').css('min-height', imgH);
                $('.detail-content').css('max-height', detailH);
                me.countdownInfo(data);
                me.voteEvent();
                me.getVote();
                setTimeout(function() { me.voteSupport(); }, voteSupportDelay);
            } else {
                H.vote.cookie4toUrl('lottery.html');
            }
        },
        countdownInfo: function(data) {
            var me = this, voteTimeListLength = 0, nowTimeStr = H.vote.nowTime, voteTimeList = [
            	{gst:data.pst, get:data.pet, stpl:'请稍后', etpl:'距大奖解锁还有 ', voteshowFlag:false},
            	{gst:data.pet, get:data.put, stpl:'请稍后', etpl:'距抢惊喜大奖还有 ', voteshowFlag:true}
            ];
            me.showEtime = data.put;
            voteTimeListLength = voteTimeList.length;
        	if (comptime(voteTimeList[voteTimeListLength-1].get,nowTimeStr) >= 0) {    //活动已结束
                $('header, .main').addClass('none');
        		// toUrl('lottery.html');
                if (H.vote.lotteryBack == 'lottery') {
                    if (H.vote.lottery4voteFlag) {
                        H.vote.lottery4voteFlag = false;
                        setTimeout(function(){
                            H.vote.getVoteinfo();
                        }, 2000);
                    } else {
                        me.cookie4toUrl('lottery.html');
                    }
                } else {
                    me.cookie4toUrl('lottery.html');
                }
                // me.cookie4toUrl('lottery.html');
        		return;
        	};
        	for (var i = 0; i < voteTimeListLength; i++) {
                var beginTimeStr = voteTimeList[i].gst, endTimeStr = voteTimeList[i].get;
                if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >= 0){    //活动正在进行
                    if (voteTimeList[i].voteshowFlag) {
                    	$('body').addClass('voted');
                        $('.after').removeClass('preload');
                        $('.luck-box').animate({'opacity':'0'}, 500, function(){
                            $('.luck-box').addClass('none');
                        });
                    } else {
                    	$('body').removeClass();
                        H.vote.luckLotteryShow(data.pst);
                        $('.luck-box').removeClass('none').animate({'opacity':'1'}, 300);
                    }
                    me.voteshowFlag = voteTimeList[i].voteshowFlag;
                    H.vote.do_count_down(endTimeStr, nowTimeStr, voteTimeList[i].stpl, voteTimeList[i].etpl, true);
                    hidenewLoading();
                    $('header, .main').removeClass('none').animate({'opacity':'1'}, 800);
                    $.fn.cookie('jumpNum', 0, {expires: -1});
                    return;
                }
                if(comptime(nowTimeStr,beginTimeStr) > 0){    //活动还未开始
                    $('header, .main').addClass('none');
                    // toUrl('lottery.html');
                    me.cookie4toUrl('lottery.html');
                    return;
                }
        	};
        },
        luckLotteryShow: function(sTime) {
            var me = this, nowTime = new Date().getTime() - H.vote.dec, eTime = timestamp(sTime) + 35*1000;
            if (nowTime >= eTime) {
                $('.luckLottery-time').addClass('none');
                $('.luckLottery-btn').removeClass('none');
            } else {
                var leftTime = Math.ceil((eTime - nowTime) / 1000);
                if (leftTime <= 1) {
                    $('.luckLottery-time').addClass('none');
                    $('.luckLottery-btn').removeClass('none');
                } else {
                    if (leftTime <= 9) {
                        leftTime = '0' + leftTime;
                    }
                    $('.luck-box .leftTime').html(leftTime);
                    var luckCountdown = setInterval(function(){
                        leftTime--;
                        if (leftTime <= 9) {
                            leftTime = '0' + leftTime;
                        }
                        $('.luck-box .leftTime').html(leftTime);
                        if (leftTime == 0) {
                            $('.luckLottery-time').addClass('none');
                            $('.luckLottery-btn').removeClass('none');
                            clearInterval(luckCountdown);
                        };
                    }, 1000);
                    $('.luckLottery-btn').addClass('none');
                    $('.luckLottery-time').removeClass('none');
                }
            }
        },
        voteEvent: function() {
            $('.btn-vote').click(function(e) {
                e.preventDefault();
                var me = this;
                if ($(me).hasClass('requesting')) {
                    return;
                }
                if ($(me).hasClass('vote-ok')) {
                    showTips('亲，您已经投过票了!');
                    return;
                }
                $(me).addClass('requesting');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/voteguess/guessplayer' + dev,
                    data: { yoi: openid, guid: $(me).attr('data-guid'), pluids: $(me).attr('data-pid') },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackVoteguessGuessHandler',
                    complete: function() {
                    },
                    success : function(data) {
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
                setTimeout(function(){
                    $(me).removeClass('requesting');
                }, 1000);
                var nowVotes = parseInt($(me).parent('li').find('.hot-box span').text()) || 0;
                $(me).addClass('vote-ok').parent('li').find('.hot-box span').html(nowVotes + 1);
            });
            $('.vote-img-box').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('error')) {
                    showTips('该商品还没有详情呢~');
                    return;
                }
                if ($(this).hasClass('flag')) {
                    return;
                }
                $(this).addClass('flag');
                var pid = $(this).attr('data-img-pid');
                $('.detail-box').removeClass('none').animate({'opacity':'1'}, 300);
                $('#detail-' + pid).removeClass('none').addClass('bounceIn');
                setTimeout(function(){
                    $('#detail-' + pid).removeClass('bounceIn');
                }, 1000);
            });
            $('.btn-detail-close').click(function(e) {
                e.preventDefault();
                var me = this;
                $(this).parent('div').addClass('bounceOut');
                $('.detail-box').animate({'opacity':'0'}, 1000, function() {
                    $(me).parent('div').removeClass().addClass('none');
                    $('.detail-box').addClass('none');
                    $('.vote-img-box').removeClass('flag');
                });
            });
        },
        voteSupport: function() {
            var me = this;
            getResult('api/voteguess/groupplayertickets', { groupUuid: me.guid }, 'callbackVoteguessGroupplayerticketsHandler');
        },
        do_count_down: function(endTimeStr, nowTimeStr, stpl, etpl, isStart){
            if(isStart){
                H.vote.isLotteryTime = true;
                $(".countdown-tip").html(etpl || '');
            }else{
                H.vote.isLotteryTime = false;
                $(".countdown-tip").html(stpl || '');
            }
            var endTimeLong = timestamp(endTimeStr);
            endTimeLong += H.vote.dec;
            $('.detail-countdown').attr('etime',endTimeLong);
            H.vote.count_down();
            $(".countdown").removeClass("none");
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '<span class="fetal-H">%H%' + '时</span>' + '%M%' + '分' + '%S%'+'秒',
                    stpl : '<span class="fetal-H">%H%' + '时</span>' + '%M%' + '分' + '%S%'+'秒',
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(!H.vote.isTimeOver){
                            H.vote.isTimeOver = true;
                            shownewLoading(null,'请稍后...');
                            if (H.vote.voteshowFlag) {
                                $(".countdown-tip").html('请稍后');
                                $('header, .main').animate({'opacity':'0'}, 800, function() {
                                    $('header, .main').addClass('none');
                                    $('body').removeClass('voted');
                                    toUrl('lottery.html');
                                });
                            } else {
                                $(".countdown-tip").html('请稍后');
                                $('header, .main').animate({'opacity':'0'}, 800, function() {
                                    $('header, .main').addClass('none');
                                });
                                $('.luck-box').animate({'opacity':'0'}, 500, function(){
                                    $('.luck-box').addClass('none');
                                });
                                setTimeout(function() {
                                    $('.countdown-tip').html('距抢惊喜大奖还有 ');
                                    $('.detail-countdown').attr('etime',timestamp(H.vote.showEtime) + H.vote.dec);
                                    $('header, .main').removeClass('none').animate({'opacity':'1'}, 800);
                                    H.vote.voteshowFlag = true;
                                    $('body').addClass('voted');
                                    $('.after').removeClass('preload');
                                    hidenewLoading();
                                }, 1500);
                            }
                        }
                        return;
                    },
                    sdCallback :function(){
                        H.vote.isTimeOver = false;
                    }
                });
            });
        },
        cookie4toUrl: function(page) {//cookie中的jumpNum值，0为正常，当值超过3时页面跳转至yaoyiyao.html
            var exp = new Date();
            exp.setTime(exp.getTime() + 60*1000);
            if ($.fn.cookie('jumpNum')) {
                if ($.fn.cookie('jumpNum') >= 0 && $.fn.cookie('jumpNum') < 4) {
                    var jumpNum = parseInt($.fn.cookie('jumpNum')) + 1;
                    $.fn.cookie('jumpNum', jumpNum, {expires: exp});
                    toUrl(page);
                } else if($.fn.cookie('jumpNum') >= 4) {
                    $.fn.cookie('jumpNum', 0, {expires: -1});
                    toUrl('yaoyiyao.html');
                }
            } else {
                $.fn.cookie('jumpNum', 1, {expires: exp});
                toUrl(page);
            }
        }
	};

    W.callbackVoteguessGroupplayerticketsHandler = function(data) {
        if (data.code == 0 && data.items) {
            var items = data.items, length = data.items.length;
            for (var i = 0; i < length; i++) {
                $('#vote' + data.items[i].puid).text(data.items[i].cunt);
                if (length - 1 == i) {
                    $('.hot-box').animate({'opacity':'1'}, 300);
                }
            };
        } else {
            $('.hot-box').animate({'opacity':'1'}, 300);
        }
    };

    // 2015年8月21日14:17:02 因集群缓存同步问题，容错暂时让按钮全部显示
    // W.callbackVoteguessIsvoteAllHandler = function(data) {
    //     if (data.code == 0) {
    //         if (data.items) {
    //             var items = data.items, length = data.items.length;
    //             for (var i = 0; i < length; i++) {
    //                 if (data.items[i].so) {
    //                     var soList = data.items[i].so.split(',');
    //                     var soLength = soList.length;
    //                     for (var j = 0; j < soLength; j++) {
    //                         $('#btn-vote-' + soList[j]).addClass('vote-ok');
    //                         if (j == soLength - 1) {
    //                             $('.btn-vote').removeClass('none');
    //                         }
    //                     };
    //                 } else {
    //                     $('.btn-vote').removeClass('none');
    //                 }
    //             };
    //         } else {
    //             $('.btn-vote').addClass('none');
    //         }
    //     } else {
    //         $('.btn-vote').addClass('none');
    //     }
    // };


    W.callbackVoteguessIsvoteAllHandler = function(data) {
        if (data.code == 0) {
            if (data.items) {
                var items = data.items, length = data.items.length;
                for (var i = 0; i < length; i++) {
                    if (data.items[i].so) {
                        var soList = data.items[i].so.split(',');
                        var soLength = soList.length;
                        for (var j = 0; j < soLength; j++) {
                            $('#btn-vote-' + soList[j]).addClass('vote-ok');
                            if (j == soLength - 1) {
                                $('.btn-vote').removeClass('none');
                            }
                        };
                    } else {
                        $('.btn-vote').removeClass('none');
                    }
                };
            } else {
                $('.btn-vote').removeClass('none');
            }
        } else {
            $('.btn-vote').removeClass('none');
        }
    };
})(Zepto);

$(function(){
	H.vote.init();
});