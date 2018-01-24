(function($) {
    H.question = {
        tid: null,
        wxCheck: false,
        qArray: [],
        qData: null,
        throwNum: 1,
        bingoNum: 0,
        nowTime: new Date().getTime(),
        isShare: false,
        cookieTime: 48*60*60*1000,
        qItemFlag: null,
        dec: 0,
        init: function () {
            this.event();
            this.resize();
            this.wxConfig();
            this.fillUserinfo();
            getResult('api/question/round', {yoi: openid}, 'callbackQuestionRoundHandler', true);
        },
        event: function() {
            var me = this;
            $("#btn-throw").click(function(e) {
                e.preventDefault();
                var nowTimeStr = timeTransform(new Date().getTime() - me.dec);
                // console.log(nowTimeStr);
                var beginTimeStr = $('.ask-wrapper ul li').eq(0).attr('data-start');
                var endTimeStr = $('.ask-wrapper ul li').eq(0).attr('data-end');
                if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0) {
                    $('.icon-moon').removeClass('wobble');
                    if ($('body').hasClass('share')) {
                        if (me.isShare) {
                            $("#dice").addClass("shake");
                            me.getLottery();
                        } else {
                            $('#popup-share .share-tips').addClass('bounceInDown');
                            $('.popup-share').removeClass('none');
                        }
                    } else {
                        $("#dice").addClass("shake");
                        me.getLottery();
                    }
                } else {
                    showTips('不在答题时间段内，请留意节目提示！');
                }
            });
            $('body').delegate('.q-item', 'click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')){
                    return;
                }
                me.qItemFlag = this;
                getResult('api/question/answer', {
                    yoi: openid,
                    suid: $(this).closest('li').attr('data-quid'),
                    auid: $(this).attr('data-auid')
                }, 'callbackQuestionAnswerHandler');
                $(this).closest('li').find('.q-item').addClass('requesting');
                $('.ask-container').addClass('none');
                $(this).closest('li').remove();
                if ($(this).hasClass('bingo')) {
                    $('.score label').html($('.score label').html()*1 + me.throwNum);
                    $('.result-container').removeClass('error').addClass('ok').removeClass('none');
                    $('.result-wrapper').find('p').html('恭喜您答对了，获得了' + me.throwNum + '积分!');
                    me.getAward();
                    var exp = new Date(); 
                    exp.setTime(exp.getTime() + me.cookieTime);
                    if ($.fn.cookie(W.openid + '_' + H.question.tid + '_bingo') == null) {
                        me.bingoNum = 1;
                    } else {
                        me.bingoNum = $.fn.cookie(W.openid + '_' + H.question.tid + '_bingo') * 1 + 1;
                    }
                    $.fn.cookie(W.openid + '_' + H.question.tid + '_bingo', me.bingoNum, {expires: exp});
                } else {
                    var exp = new Date(); 
                    exp.setTime(exp.getTime() + me.cookieTime);
                    if ($.fn.cookie(W.openid + '_' + H.question.tid + '_bingo') == null) {
                        me.bingoNum = 0;
                    } else {
                        me.bingoNum = $.fn.cookie(W.openid + '_' + H.question.tid + '_bingo') * 1;
                    }
                    $('.result-container').removeClass('ok').addClass('error').removeClass('none');
                    $('.result-wrapper').find('p').html('正确答案是<span class="correct">' + $(this).closest('li').find('.bingo').html() + '</span>，继续努力吧！');

                }
            }).delegate('#btn-tt', 'click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')){
                    return;
                }
                $(this).addClass('requesting');
                $('#popup, .result-container').addClass('none');
                $('.ask-container').removeClass('none');

                if ($('.ask-wrapper ul li').length <= 0) {
                    $('.dice-wrapper').addClass('none');
                    $('body').removeClass('share');
                } else if ($('.ask-wrapper ul li').length == 1) {
                    $('.dice-wrapper').removeClass('none');
                    $('body').addClass('share');
                } else {
                    $('.dice-wrapper').removeClass('none');
                    $('body').removeClass('share');
                }
                $('#icon-people').removeClass().addClass('step' + me.bingoNum);
                $('.icon-moon').addClass('wobble');
            });
            $('.popup-share').click(function(e) {
                e.preventDefault();
                $('.popup-share').addClass('none');
                $('#popup-share .share-tips').removeClass('bounceInDown');
                $('.icon-moon').addClass('wobble');
            });
            $('.popup-lottery .btn-golottery2 .btn-close').click(function(e) {
                e.preventDefault();
                $('#popup-lottery').addClass('none');
            });
            $('.popup-lottery .btn-golottery2 .btn-go').click(function(e) {
                e.preventDefault();
                toUrl('lottery.html');
            });
            $('.btn-go2l').click(function(e) {
                e.preventDefault();
                toUrl('lottery.html');
            });
            $('#btn-talk').click(function(e) {
                e.preventDefault();
                toUrl('talk.html');
            });
            $('#btn-jifen').click(function(e) {
                e.preventDefault();
                toUrl('jifen.html');
            });
        },
        getAward: function() {
            var me = this;
            getResult('api/lottery/award',{
                oi : openid,
                nn : encodeURIComponent(nickname),
                hi : headimgurl,
                pv : me.throwNum,
                pu : me.tid
            },'callbackLotteryAwardHandler');
        },
        getLottery: function() {
            var me = this, sn = new Date().getTime() + '';
            me.throwNum = Math.floor(Math.random()*6 + 1);
            $('#btn-tt').removeClass('requesting');
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck4Vote' + dev,
                data: { matk: matk , sn : sn , sau: me.tid },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuck4VoteHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        sn = new Date().getTime() + '';
                        me.throwNum = 1;
                        me.badLottery(1);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime() + '';
                            me.badLottery(me.throwNum);
                        }
                    }else{
                        sn = new Date().getTime() + '';
                        me.throwNum = 1;
                        me.badLottery(1);
                    }
                },
                error : function() {
                    sn = new Date().getTime() + '';
                    me.throwNum = 1;
                    me.badLottery(1);
                }
            });
        },
        badLottery: function(num) {
            setTimeout(function() {
                $("#dice").removeClass("dice_t shake dice_1 dice_2 dice_3 dice_4 dice_5 dice_6").addClass("dice_" + num);
                $('.jifen-tips label').html(num);
                setTimeout(function() {
                    $('#popup').removeClass('none');
                }, 200);
            }, 1000);
            
        },
        resize: function() {
            var me = this, winW = $(window).width(), winH = $(window).height();
            $('body').css({
                'width': winW,
                'min-height': winH
            });
            $('#popup').css({
                'width': winW,
                'height': winH
            });
        },
        fillUserinfo: function() {
            var username = (nickname || '匿名用户');
            if (username.length >= 8) {
                username = username.substring(0, 7) + '...';
            }
            $('.name label').html(username);
            $('#avatar, .host-avatar').attr('src', (headimgurl ? (headimgurl + '/' + yao_avatar_size) : "./images/avatar-default.png"));
        },
        fill: function(data) {
            var me = this, t = simpleTpl(), qitems = data.qitems || [], length = qitems.length;
            me.nowTime = timeTransform(parseInt(data.cud));
            me.dec = new Date().getTime() - parseInt(data.cud);
            for (var i = 0; i < length; i++) {
                if (me.qArray.indexOf(qitems[i].quid) < 0) {
                    t._('<li data-quid="' + qitems[i].quid + '" data-start="' + qitems[i].qst + '" data-end="' + qitems[i].qet + '">')
                        ._('<h1>'+ qitems[i].qt +'</h1>')
                        ._('<section class="items">')
                            var aitems = qitems[i].aitems || [];
                            for (var j = 0, jlen = aitems.length; j < jlen; j++) {
                                if (aitems[j].auid == qitems[i].qriu) {
                                    var bingo = ' bingo';
                                } else {
                                    var bingo = '';
                                }
                                t._('<a href="javascript:void(0);" class="q-item' + bingo + '" data-auid="'+ aitems[j].auid +'" data-collect="true" data-collect-flag="btn-item" data-collect-desc="答案按钮">' + aitems[j].at + '</a>');
                            };
                        t._('</section>')
                    ._('</li>');
                }
            };
            $('.ask-wrapper ul').html(t.toString());
            if ($('.ask-wrapper ul li').length <= 0) {
                $('.dice-wrapper').addClass('none');
                $('body').removeClass('share');
            } else if ($('.ask-wrapper ul li').length == 1) {
                $('.dice-wrapper').removeClass('none');
                $('body').addClass('share');
            } else {
                $('.dice-wrapper').removeClass('none');
                $('body').removeClass('share');
            }
        },
        wxConfig: function(){
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'mp/jsapiticket' + dev,
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
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr: nonceStr,
                            signature: signature,
                            jsApiList: [
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'hideAllNonBaseMenuItem',
                                'onMenuShareQQ',
                                'onMenuShareWeibo',
                                'hideMenuItems',
                                'showMenuItems',
                                'hideOptionMenu',
                                'showOptionMenu'
                            ]
                        });
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        menuShare: function(wxData) {
            var me = this;
            wx.onMenuShareTimeline({
                title: wxData.title,
                link: wxData.link,
                imgUrl: wxData.imgUrl,
                trigger: function(res) {
                },
                success: function(res) {
                    me.shareSuccess();
                },
                cancel: function(res) {
                },
                fail: function(res) {
                }
            })
        },
        menuToFriend: function(wxData) {
            var me = this;
            wx.onMenuShareAppMessage({
                title: wxData.title,
                desc: wxData.desc,
                link: wxData.link,
                imgUrl: wxData.imgUrl,
                success: function(res) {
                    me.shareSuccess();
                },
                cancel: function(res) {
                },
                fail: function(res) {
                }
            });
        },
        hideMenuList:function() {
            // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
            wx.hideMenuItems({
                menuList: [
                    // "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:share:qq"
                ],
                success:function (res) {
                },
                fail:function (res) {
                }
            });
        },
        showMenuList:function(wxData) {
            var me = this;
            // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
            wx.showMenuItems({
                menuList: [
                    "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:favorite",
                    "menuItem:copyUrl",
                    "menuItem:openWithQQBrowser",
                    "menuItem:openWithSafari",
                    "menuItem:share:email"
                ],
                success:function (res) {
                    me.menuToFriend(wxData);
                    me.menuShare(wxData);
                },
                fail:function (res) {
                }
            });
        },
        shareSuccess: function() {
            var me = this;
            me.isShare = true;
            $('.popup-share').addClass('none');
            // showTips('恭喜您获得一次额外摇骰子机会！');
        }
    };
    W.callbackQuestionRoundHandler = function(data) {
        if (data.code == 0) {
            H.question.tid = data.tid;
            H.question.qData = data;
            getResult('api/question/allrecord',{
                yoi : openid,
                tid : data.tid
            },'callbackQuestionAllRecordHandler');
            if ($.fn.cookie(W.openid + '_' + data.tid + '_bingo') != null) {
                H.question.bingoNum = $.fn.cookie(W.openid + '_' + H.question.tid + '_bingo') * 1;
                $('#icon-people').removeClass().addClass('step' + H.question.bingoNum);
            }
            getResult('api/lottery/integral/rank/self',{
                oi : openid,
                pu : data.tid
            }, 'callbackIntegralRankSelfRoundHandler');
            $.fn.cookie(W.openid + '_tid', data.tid, {expires: 1});
        }
    };

    W.callbackQuestionAllRecordHandler = function(data) {
        if (data.code == 0) {
            var qitems = data.items || [];
            for(var i = 0; i < qitems.length; i++){
                if (qitems[i].anws) {
                    H.question.qArray.push(qitems[i].quid);
                }
            }
            H.question.fill(H.question.qData);
        }
    };

    W.callbackIntegralRankSelfRoundHandler = function(data) {
        if (data.result) {
            $('.score').removeClass('none').find('label').html(data.in);
        } else {
            $('.score').addClass('none');
        }
    };

    W.callbackLotteryAwardHandler = function(data) {
    };

    W.callbackQuestionAnswerHandler = function(data) {
    };
})(Zepto);

$(function(){
    H.question.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'hideAllNonBaseMenuItem',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideOptionMenu',
                'showOptionMenu'
            ],
            success: function (res) {
            }
        });
        wx.hideOptionMenu();
        H.question.showMenuList(wxData);
    });
    wx.error(function(res){
    });
});