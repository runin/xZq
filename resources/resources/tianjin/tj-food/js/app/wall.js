(function($){
    H.wall = {
        pid: null,
        guid: null,
        nowTime: null,
        voteSelector: null,
        swiperFlag: getQueryString('flag'),
        request_cls: 'requesting',
        from: getQueryString('from'),
        init: function(){
            var me = this;
            me.resize();
            me.getInfo();
            me.event();
            me.ddtj();
        },
        event: function() {
            var me = this;
            $('#btn-go2index').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                };
                $(this).addClass(me.request_cls);
                toUrl('index.html');
            });
            $('.swiper-container').delegate('.btn-zan', 'click', function(e) {
                e.preventDefault();
                me.voteSelector = this;
                if ($(this).hasClass(me.request_cls)) {
                    return;
                };
                $(this).addClass(me.request_cls);
                getResult('api/voteguess/guessplayer', {
                    yoi: openid,
                    guid: $(this).parent('.swiper-slide').attr('data-guid'),
                    pluids: $(this).parent('.swiper-slide').attr('data-pid')
                }, 'callbackVoteguessGuessHandler', true);
            }).delegate('.btn-lottery', 'click', function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                };
                $(this).addClass(me.request_cls);
                me.voteSelector = this;
                me.guid = $(this).parent('.swiper-slide').attr('data-guid')
                $(this).addClass(me.request_cls);
                H.dialog.getLottery.open();
            }).delegate('.food-box', 'click', function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                };
                $(this).addClass(me.request_cls);
                toUrl('detail.html?guid=' + $(this).parent('.swiper-slide').attr('data-guid') + '&pid=' + $(this).parent('.swiper-slide').attr('data-pid') + '&flag=' + $(this).attr('data-flag'));
            });
        },
        getInfo: function() {
            getResult('api/voteguess/info', { yoi: openid }, 'callbackVoteguessInfoHandler', true);
        },
        fillList: function(data) {
            var me = this, t = simpleTpl(), items = data.items, flagCount = 0;
            for(var i = 0, len = items.length; i < len; i++) {
                for(var j = 0, jlen = items[i].pitems.length; j < jlen; j++) {
                    if (items[i].so) {
                        var voted = ' zaned';
                        var btnStatus = 'btn-zaned';
                        var tips = '查询中';
                    } else {
                        var voted = '';
                        var btnStatus = 'btn-zan';
                        var tips = '点赞';
                    }
                    t._('<div class="swiper-slide" data-guid="' + items[i].guid + '" data-pid="' + items[i].pitems[j].pid + '">')
                        ._('<div class="food-box" data-flag="' + (flagCount++) + '" data-collect="true" data-collect-flag="tj-food-wall-go2detail-btn" data-collect-desc="投票页-进入卡片详情页">')
                            ._('<div class="intro-img">')
                                ._('<img src="./images/load.png" data-src="' + items[i].pitems[j].im + '" class="swiper-lazy food-img">')
                                ._('<i></i>')
                            ._('</div>')
                            ._('<div class="intro-box">')
                                ._('<p class="food-name">' + items[i].pitems[j].na + '</p>')
                                ._('<div class="zan' + voted + '" id="zan' + items[i].pitems[j].pid + '">')
                                    ._('<span></span>')
                                    ._('<i></i>')
                                ._('</div>')
                            ._('</div>')
                        ._('</div>')
                        ._('<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>')
                        ._('<a class="' + btnStatus + '" id="btn-guid-' + items[i].guid + '" href="#" data-collect="true" data-collect-flag="tj-food-wall-card-btn" data-collect-desc="投票页-点击投票按钮">' + tips + '</a>')
                    ._('</div>')
                }
            }
            $('.swiper-wrapper').append(t.toString());
            me.voteSupport();
            me.checkLottery(data);
        },
        voteSupport: function() {
            var me = this;
            getResult('api/voteguess/getplayersp/' + H.wall.pid, {}, 'callbackVoteguessAllSupportPlayerHandler');
        },
        fillVote: function(data) {
            var me = this, items = data.items;
            for(var i = 0, len = items.length; i < len; i++) {
                $('#zan' + items[i].puid).find('span').text(items[i].cunt);
            }
        },
        checkLottery: function(data) {
            var me = this, items = data.items, length = items.length;
            for (var i = 0; i < length; i ++) {
                if (items[i].so) {
                    getResult('api/lottery/leftChance', {
                        oi: openid,
                        pu: items[i].guid
                    }, 'callbackLotteryLeftChanceHandler');
                }
            };
            $('.swiper-container').removeClass('none');
            me.swiper();
        },
        resize: function() {
            var winW = $(window).width(),
                winH = $(window).height();
            $('body').css({
                'width': winW,
                'height': winH
            });
        },
        swiper: function() {
            var me = this, swiper = new Swiper('.swiper-container', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                pagination: '.swiper-pagination',
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true
            });
            if (me.swiperFlag != '' && me.swiperFlag > 0) {
                swiper.slideTo(me.swiperFlag, 1000, false);
            }
        },
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };

    W.callbackVoteguessInfoHandler = function(data) {
        if(data.code == 0){
            H.wall.pid = data.pid;
            H.wall.nowTime = timeTransform(data.cud);
            H.wall.fillList(data);
        }
    };

    W.callbackVoteguessAllSupportPlayerHandler = function(data) {
        if (data.code == 0) {
            H.wall.fillVote(data);
        }
    };

    W.callbackLotteryLeftChanceHandler = function(data) {
        if (data.result) {
            if (data.lc > 0) {
                $('#btn-guid-' + data.pu).removeClass().addClass('btn-lottery').text('我要抽奖');
            } else {
                $('#btn-guid-' + data.pu).removeClass().addClass('btn-zaned').text('已赞');
            }
        }
    };

    W.callbackVoteguessGuessHandler = function(data) {
        if (data.code == 0) {
            $(H.wall.voteSelector).removeClass().addClass('btn-lottery').text('我要抽奖');
            var zanVotes = parseInt($(H.wall.voteSelector).parent('.swiper-slide').find('.zan span').text());
            $(H.wall.voteSelector).parent('.swiper-slide').find('.zan').addClass('zaned').find('span').text(zanVotes + 1);
        } else {
            showTips("投票还未开始~<br>请留意节目提示");
        }
        $(H.wall.voteSelector).removeClass('requesting');
    };

    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    }
})(Zepto);

$(function(){
    H.wall.init();
});