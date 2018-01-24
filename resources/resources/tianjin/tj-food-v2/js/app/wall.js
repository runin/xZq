(function($){
    H.wall = {
        pid: null,
        wxCheck: false,
        isError: false,
        cacheData: null,
        canLottery: true,
        swiperFlag: getQueryString('flag'),
        init: function(){
            this.ddtj();
            this.event();
            this.getInfo();
            this.wxConfig();
        },
        event: function() {
            var me = this;
            $('.detail-box').css({'width': $(window).width(),'height': $(window).height()});
            $('#btn-go2index').click(function(e) {
                e.preventDefault();
                toUrl('index.html');
            });
            $('body').delegate('.btn-ans', 'click', function(e) {
                e.preventDefault();
                $(this).parent('.ans-box').find('.btn-ans').removeClass('checked');
                $(this).addClass('checked');
            }).delegate('.btn-submit', 'click', function(e) {
                e.preventDefault();
                if ($('.swiper-slide-active .checked').length == 0) {
                    showTips('请选择一个答案进行提交');
                    return;
                }
                me.answered($('.swiper-slide-active').attr('data-quid'), $('.swiper-slide-active .checked').attr('data-auid'));
            }).delegate('.intro-img', 'click', function(e) {
                e.preventDefault();
                me.fillDetail($(this).attr('data-quid'));
            }).delegate('.btn-deback', 'click', function(e) {
                e.preventDefault();
                $('.detail-box').addClass('none');
            });
        },
        fillDetail: function(quid) {
            var me = this, t = '<section class="detail-foot"><a href="javascript:;" class="btn-deback">返   回</a><p class="copyright">页面由天津广播电视台提供<br>掌视科技技术支持&amp;Powered by holdfun.cn</p></section>';
            if (!quid) return;
            for (var i = 0; i < me.cacheData.length; i++) {
                if (quid == me.cacheData[i].quid) {
                    $('.detail-main').html(me.cacheData[i].dc + t);
                    $('.detail-box').addClass('fadeInRight').removeClass('none');
                    return;
                }
            };
        },
        wxConfig: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'mp/jsapiticket',
                data: {appId: shaketv_appid},
                dataType: 'jsonp',
                jsonpCallback: 'callbackJsapiTicketHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.code == 0){
                        var url = window.location.href.split('#')[0],
                            nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361',
                            timestamp = Math.round(new Date().getTime() / 1000),
                            signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
                        //权限校验
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr: nonceStr,
                            signature: signature,
                            jsApiList: [
                                'addCard',
                                'checkJsApi',
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
                error : function(xmlHttpRequest, error) {}
            });
        },
        getInfo: function() {
            shownewLoading(null, '题目加载中...');
            getResult('api/question/round', {}, 'callbackQuestionRoundHandler');
        },
        answered: function(suid, auid) {
            if (!suid && !auid) return;
            shownewLoading(null, '答案提交中...');
            getResult('api/question/answer', {
                yoi: openid,
                suid: suid,
                auid: auid
            }, 'callbackQuestionAnswerHandler');
        },
        fillList: function(data) {
            var me = this, t = simpleTpl(), items = data.qitems || [];
            for(var i = 0, len = items.length; i < len; i++) {
                console.log(items[i].quid);
                t._('<div class="swiper-slide" id="' + items[i].quid + '" data-quid="' + items[i].quid + '">')
                    ._('<div class="food-box">')
                        ._('<div class="intro-img" data-flag="' + i + '" data-quid="' + items[i].quid + '">')
                            ._('<img src="./images/load.png" data-src="' + items[i].bi + '" class="swiper-lazy food-img">')
                            ._('<i></i>')
                        ._('</div>')
                        ._('<div class="intro-box">')
                            ._('<p class="food-name">' + items[i].qt + '</p>')
                            ._('<div class="ans-box" data-qriu="' + items[i].qriu + '">')
                                for(var j = 0, jlen = items[i].aitems.length; j < jlen; j++) {
                                    t._('<a href="javascript:;" class="btn-ans" id="' + items[i].aitems[j].auid + '" data-auid="' + items[i].aitems[j].auid + '">' + items[i].aitems[j].at + '</a>')
                                };
                            t._('</div>')
                        ._('</div>')
                    ._('</div>')
                    ._('<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>')
                    ._('<a class="btn-submit" href="javascript:;">提  交</a>')
                ._('</div>')
            }
            $('.swiper-wrapper').append(t.toString());
            setTimeout(function(){
                me.swiper();
            }, 1000);
            me.allrecord();
        },
        allrecord: function() {
            var me = this;
            getResult('api/question/allrecord', {
                yoi: openid,
                tid: me.pid
            }, 'callbackQuestionAllRecordHandler');
        },
        swiper: function() {
            $('.swiper-container').removeClass('none');
            var me = this;
            swiper = new Swiper('.swiper-container', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                pagination: '.swiper-pagination',
                paginationClickable: true,
                preloadImages: true,
                lazyLoading: true,
                autoHeight: true
            });
            if (me.swiperFlag != '' && me.swiperFlag > 0) {
                swiper.slideTo(me.swiperFlag, 1000, false);
            }
            hidenewLoading();
        },
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
        fillRecord: function(data) {
            var me = this, items = data.items;
            for(var i = 0, len = items.length; i < len; i++) {
                if (items[i].anws) {
                    $('#' + items[i].quid).addClass('ased');
                    $('#' + items[i].anws).addClass('checked');
                }
            };
        }
    };

    W.callbackQuestionRoundHandler = function(data) {
        if(data.code == 0){
            H.wall.pid = data.tid;
            H.wall.cacheData = data.qitems;
            H.wall.fillList(data);
        } else {
            hidenewLoading();
            showTips('今日没有题目！')
        }
    };

    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    };

    W.callbackQuestionAnswerHandler = function(data) {
        if (data.code == 0) {
            if (data.rs == 2) {
                if (H.wall.canLottery)
                    H.dialog.getLottery.open();
                else
                    H.dialog.lottery.open(null);
            } else {
                H.dialog.thanks.open('answer');
            }
            $('#' + data.suid).addClass('ased');
        } else {
            showTips('非答题时间，请留意节目中的提示！');
        }
        hidenewLoading();
    };

    W.callbackQuestionAllRecordHandler = function(data) {
        if (data.code == 0) {
            H.wall.fillRecord(data);
        } else {
            H.wall.canLottery = false;
        }
    };         
})(Zepto);

$(function(){
    H.wall.init();
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
                var t = res.checkResult.addCard;
                if(t && !H.wall.isError){
                    H.wall.wxCheck = true;
                }
            }
        });
    });

    wx.error(function(res){
        H.wall.isError = true;
    });
});