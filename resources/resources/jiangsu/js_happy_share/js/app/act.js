(function($) {
    H.act = {
        dec: 0,
        uuid: null,
        mainIMG: null,
        repeatCheck: true,
        registerFlag: false,
        init: function () {
            this.event();
            getResult('api/collectcard/activity/round', {matk: matk}, 'callbackCollectCardRoundHandler', true);
            if (!is_android()) $('body').addClass('is-ios');
        },
        event: function() {
            var me = this;
            $('body').delegate('', 'tap', function(e) {
                e.preventDefault();
            });

            $('.btn-la').click(function(e) {
                e.preventDefault();
                if (!me.registerFlag) {
                    showLoading(null, '正在拉起分享...');
                    $.ajax({
                        type : 'GET',
                        async : false,
                        url : domain_url + 'api/collectcard/activity/join' + dev,
                        data: {matk: matk, au: me.uuid},
                        dataType : "jsonp",
                        jsonpCallback : 'callbackCollectCardJoinHandler',
                        timeout: 5000,
                        complete: function() {
                            hideLoading();
                        },
                        success : function(data) {
                            if (data.result) {
                                if ($('#share').hasClass('none')) $('#share').removeClass('none');
                                me.registerFlag = true;
                            }
                        },
                        error : function(xmlHttpRequest, error) {
                        }
                    });
                } else {
                    if ($('#share').hasClass('none')) $('#share').removeClass('none');
                }
            });
            $('#share').click(function(e) {
                e.preventDefault();
                $('#share').addClass('none');
            });

            $('.btn-jieguo').click(function(e) {
                e.preventDefault();
                if ($('#jieguo').hasClass('none')) $('#jieguo').removeClass('none');
            });

            $('.btn-x, .btn-bye, .btn-hao').click(function(e) {
                e.preventDefault();
                $(this).parents('.pop-dialog').addClass('none');
            });

            $('.btn-back').click(function(e) {
                e.preventDefault();
                toUrl('answer.html');
            });

            $('.btn-lot').click(function(e) {
                e.preventDefault();
                me.getLuck();
            });
        },
        preFill: function(data) {
            var me = this,
                maskWidth = this.resizeMask(data.cn),
                nowTimeStr = timeTransform(parseInt(data.cud)),
                beginTimeStr = data.st,
                endTimeStr = data.et;
            if(comptime(nowTimeStr, beginTimeStr) <0 && comptime(nowTimeStr, endTimeStr) >=0) {
                me.countdown(endTimeStr);
                $('.mainer').attr('src', me.mainIMG);
                $('.intro').html(data.in || '');
                $('.lastcount').removeClass('hidden');
                for (var i = 0; i < data.ca.length; i++) $('.img-mask').append('<i data_id="' + data.ca[i].cud + '" style="width:' + maskWidth + '%"></i>');
                if (data.ls == 0) {
                    // 未抽奖
                    $('.btn-la').removeClass('none');
                    $('.c-left').text('1').parents('.lastcount').removeClass('hidden');
                } else {
                    // 已抽奖
                    me.afterLuck();
                }
                getResult('api/collectcard/activity/result', {openid: openid, au: me.uuid}, 'callbackCollectCardResultHandler');
            } else {
                // me.actOver();
                $('.container, .icon-reserve, .lastcount, .pop-dialog').remove();
                $('body').append('<h6><p>敬请期待</p><p>活动正在准备中</p></h6><p class="errcode">x_3</p>');
            }
        },
        checkVote: function(data) {
            for (var i = 0; i < data.ca.length; i++) {
                // $('#jieguo [data_id="' + data.ca[i].cud + '"]').attr('style', 'animation-delay:' + (0.3 + i*0.3).toFixed(2) + 's;-webkit-animation-delay:' + (0.3 + i*0.3).toFixed(2) + 's;').addClass('light');
                $('[data_id="' + data.ca[i].cud + '"]').attr('style', 'animation-delay:' + (0.3 + i*0.3).toFixed(2) + 's;-webkit-animation-delay:' + (0.3 + i*0.3).toFixed(2) + 's;').addClass('light');
            };
            if (data.cn == data.ca.length) {
                var delay = ((data.ca.length - 1) * 0.5).toFixed(2);
                $('.jg-tip').text('卡牌已集齐，试试手气吧~');
                $('.act-btn-chenggong').attr('style', 'animation-delay:' + delay + 's;-webkit-animation-delay:' + delay + 's;');
                // $('.act-btn-chenggong, .btn-lot, .btn-jieguo').removeClass('none');
                $('.act-btn-chenggong, .btn-jieguo').removeClass('none');
                if ($('.c-left').html() == '1') $('.btn-lot').removeClass('none');
                $('.main-tip').addClass('none');
            } else {
                $('.jg-tip').text('卡牌还未集齐，等下再来看看哦~');
                $('.btn-hao, .btn-jieguo').removeClass('none');
            }
        },
        resizeMask: function(n) {
            if (!n) return;
            return Math.floor((100 / n).toFixed(2) * 10) / 10;
        },
        countdown: function(endTimeStr){
            if (!endTimeStr) return;
            $('.detail-countdown').attr('etime', timestamp(endTimeStr) + this.dec);
            this.count_down();
            $(".countdown-tip").text("据本次助力结束还有").parents(".countdown").removeClass("none");
            this.repeatCheck = true;
        },
        count_down: function() {
            var that = this;
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '<label>%H%</label>' + '<span>:</span>'+'<label>%M%</label>' + '<span>:</span>' + '<label>%S%</label>' + '', // 还有...结束
                    stpl : '<label>%H%</label>' + '<span>:</span>'+'<label>%M%</label>' + '<span>:</span>' + '<label>%S%</label>' + '', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(that.repeatCheck){
                            that.repeatCheck = false;
                            that.actOver();
                        }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        actOver: function() {
            $('.container, .icon-reserve, .lastcount, .pop-dialog, .countdown').remove();
            $('body').append('<h6><p>本期活动已结束</p><p><span class="itime">5</span>s后进入答题互动</p></h6><p class="errcode">x_4</p>');
            var stime = setInterval(function(){
                if ($('.itime').text()*1 == 0) {
                    toUrl('answer.html');
                    clearInterval(stime);
                    stime = null;
                    return;
                }
                $('.itime').text($('.itime').text()*1 - 1);
            }, 1e3);
        },
        getLuck: function() {
            var me = this,
                sn = new Date().getTime() + '';
            showLoading(null, '抽奖中...');
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck4CollectCard' + dev,
                data: { oi: openid, matk: matk, sau: me.uuid, sn: sn },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuck4CollectCardHandler',
                timeout: 10000,
                complete: function() {
                   sn = new Date().getTime() + '';
                   hidenewLoading();
                   $('#jieguo').addClass('none');
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        me.thanks();
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            me.luckResult(data);
                        }else{
                            me.thanks();
                        }
                    }else{
                        me.thanks();
                    }
                },
                error : function() {
                    me.thanks();
                }
            });
        },
        luckResult : function(data){
            var me = this;
            if(data == null || data.result == false || data.pt == 0){
                me.thanks();
                return;
            }else{
                me.afterLuck();
                H.dialog.lottery.open(data,"lottery");
            }
        },
        thanks: function() {
            $('#sorry').removeClass('none');
        },
        afterLuck: function() {
            $('.btn-la, .btn-lot, .jg-tip').addClass('none');
            $('.btn-back, .end-tips').removeClass('none');
            $('.btn-jieguo').attr('style','display: none !important;');
            $('.c-left').text('0').parents('.lastcount').removeClass('hidden');
        }
    };

    W.callbackCollectCardRoundHandler = function(data){
        var me = H.act;
        hideLoading();
        if (data.result) {
            if (data.ca && data.ca[0] && data.ca[0].cbp) {
                if (data.cn == data.ca.length) {
                    $('.container, .icon-reserve').removeClass('none');
                    me.dec = new Date().getTime() - parseInt(data.cud);
                    me.mainIMG = data.ca[0].cbp;
                    me.uuid = data.ud;
                    me.preFill(data);
                    actData.link = getActsUrl(location.href, 'acts.html', data.ud || null);
                } else {
                    $('body').append('<h6><p>敬请期待</p><p>活动正在准备中</p></h6><p class="errcode">x_3</p>');
                }
            } else {
                $('body').append('<h6><p>敬请期待</p><p>活动正在准备中</p></h6><p class="errcode">x_2</p>');
            }
        } else {
            $('body').append('<h6><p>敬请期待</p><p>活动正在准备中</p></h6><p class="errcode">x_1</p>');
        }
    };

    W.callbackCollectCardResultHandler = function(data) {
        var me = H.act;
        if (data.result && data.ca) {
            me.checkVote(data);
        } else {
            $('.jg-tip').text('卡牌还未集齐，等下再来看看哦~');
            $('.btn-hao, .btn-jieguo').removeClass('none');
        }
    };

    H.jssdk = {
        wxIsReady: false,
        loadWXconfig: 5,
        init: function(){
            this.wxConfig();
        },
        wxConfig: function(){
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
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr:nonceStr,
                            signature:signature,
                            jsApiList: [
                                'addCard',
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
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        menuShare: function() {
            var me = this;
            wx.onMenuShareTimeline({
                title: actData.title,
                desc: actData.desc,
                link: actData.link,
                imgUrl: actData.imgUrl,
                trigger: function(res) {
                },
                success: function(res) {
                    me.shareSuccess();
                },
                cancel: function(res) {
                    me.shareFail();
                },
                fail: function(res) {
                    me.shareFail();
                }
            })
        },
        menuToFriend: function() {
            var me = this;
            wx.onMenuShareAppMessage({
                title: actData.title,
                desc: actData.desc,
                link: actData.link,
                imgUrl: actData.imgUrl,
                success: function(res) {
                    me.shareSuccess();
                },
                cancel: function(res) {
                    me.shareFail();
                },
                fail: function(res) {
                    me.shareFail();
                }
            });
        },
        hideMenuList: function() {
            wx.hideMenuItems({
                menuList: [
                    "menuItem:share:timeline",
                    "menuItem:share:qq",
                    "menuItem:copyUrl",
                    "menuItem:openWithQQBrowser",
                    "menuItem:openWithSafari",
                    "menuItem:share:email"
                ],
                success:function (res) {
                },
                fail:function (res) {
                }
            });
        },
        showMenuList: function() {
            wx.showMenuItems({
                menuList: [
                    "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:favorite",
                    "menuItem:copyUrl",
                    "menuItem:share:email"
                ],
                success:function (res) {
                },
                fail:function (res) {
                }
            });
        },
        shareSuccess: function() {
            var me = H.act;
            if (!me.registerFlag) {
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/collectcard/activity/join' + dev,
                    data: {matk: matk, au: me.uuid},
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCollectCardJoinHandler',
                    timeout: 5000,
                    complete: function() {
                    },
                    success : function(data) {
                        if (data.result) me.registerFlag = true;
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            }
        },
        shareFail: function() {
        }
    };
})(Zepto);

$(function(){
    window.actData = {
        "imgUrl": 'http://cdn.holdfun.cn/resources/images/4160bcaf21e9495f9cf17fe9689f5bbb/2015/03/05/eeda88d02e8c4d2388b9a542cf00f3fe.jpg',
        "link": getActsUrl(location.href, 'acts.html'),
        "desc": '好友' + nickname + '@了你，紧急求助，快点进来！',
        "title": '江苏卫视派大礼~'
    };

    H.act.init();
    H.jssdk.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard',
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
                H.jssdk.wxIsReady = true;
                H.jssdk.menuShare();
                H.jssdk.menuToFriend();
            }
        });
    });
    wx.error(function(res){
        H.jssdk.wxIsReady = false;
        if (H.jssdk.loadWXconfig != 0) {
            setTimeout(function(){
                H.jssdk.loadWXconfig--;
                H.jssdk.init();
            }, 6e3);
        }
    });
});