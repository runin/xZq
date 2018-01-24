(function ($) {

    H.card = {
        $cardList : $('#card_list'),
        $cardTmpl: $('#tmpl_card_item'),
        $videoTmpl: $('#tmpl_video'),

        cardData : null,
        unLockingCards : [],
        
        videoWidth: 0,
        videoHeight: 0,

        lastX: 0,
        lastY: 0,
        card2Left: 0,
        card3Left: 0,

        cardX: 0,
        cardY: 0,
        cardWidth:0,

        videoCounter: 0,

        init: function(){
            H.card.resize();
        },

        getCards: function(){
            getResult('api/greetingcard/material/all',null, 'callbackGreetingcardMaterialAllHandler', null, null, null, 15000, function(){
                H.card.initDefaultCards();
            });
        },

        initCards: function(data){
            H.card.cardData = data;
            H.card.fillCards(true);

            H.card.initUnlockingCards();
            H.card.unlockCountdown();

            H.vip.init();
        },

        initDefaultCards: function(data){
            H.card.cardData = callbackGreetingcardMaterialAllHandlerData;
            H.card.fillCards(false);
        },

        fillCards: function(isNormal){
            var data = H.card.cardData.ml;
            var cardHtml = '';
            for(var i in data){
                
                var isUnlocked = localStorage.getItem(openid + LS_KEY_CARD_PREFIX + data[i].ud);

                if(!H.card.isActiveCard(i, isUnlocked)){
                    continue;
                }

                
                if(!isUnlocked || isUnlocked == false){
                    // 未解锁
                    cardHtml += H.card.$cardTmpl.tmpl({
                        'index': i,
                        'lockClass': 'locked',
                        'id': data[i].ud,
                        'img': data[i].lsi,
                        'unlock' : data[i].ulsi,
                        'title': data[i].tt
                    });
                }else{
                    // 已解锁
                    cardHtml += H.card.$cardTmpl.tmpl({
                        'index': i,
                        'lockClass': 'unlocked',
                        'id': data[i].ud,
                        'img': data[i].ulsi,
                        'unlock' : data[i].ulsi,
                        'title': data[i].tt
                    });
                }
            }

            H.card.$cardList.html(cardHtml);
            H.card.initSlick();

            if(isNormal){
                H.card.bindCardEvents();    
            }else{
                H.card.bindLiukongEvents();
            }
            
        },

        addCard: function(ud){
            var data = H.card.cardData.ml;
            var index = 0;
            for(var i in data){
                if(data[i].ud == ud){
                    index = i;
                    break;
                }
            }
            if(jQuery('.index-cards-content-inner').length > 0){
                jQuery('.index-cards-content-inner').slick('slickAdd',
                H.card.$cardTmpl.tmpl({
                    'lockClass': 'unlocked',
                    'id': data[index].ud,
                    'img': data[index].ulsi,
                    'title': data[index].tt
                }));
                jQuery('.index-cards-content-inner').slick('slickGoTo', 99);
            }
            
            H.card.arrowResize();
            H.card.bindCardEvents();
        },

        isActiveCard: function(index, isUnlocked){
            var cardData = H.card.cardData.ml[index];

            if(isUnlocked){
                return true;
            };

            var cur = new Date().getTime() - H.countdown.serverOffset;
            if(cur > timestamp(cardData.uet)){
                return true;
            }else{
                return false;
            }
        },

        initSlick: function(){
            jQuery('.index-cards-content-inner').slick({
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 3,
                swipe: true,
                
                infinite: false
            });
            H.card.arrowResize();
        },

        bindCardEvents: function(){
            $('.index-cards-item').unbind('tap').tap(function(e){
                showLoading(null, '努力加载中');
                getResult('api/greetingcard/material/get', {
                    oi : openid,
                    mu : $(this).attr('data-id')
                }, 'callbackGreetingcardMaterialGetHandler');
            });

            $('.index-cards-item').bind('touchstart', function(e){
                H.card.lastX = e.touches[0].pageX;
                H.card.lastY = e.touches[0].pageY;
                return true;
            });
        },

        bindLiukongEvents: function(){
            $('.index-cards-item').unbind('tap').tap(function(e){
                var index = $(this).attr('data-index');
                var ud = $(this).attr('data-id');
                var isUnlocked = localStorage.getItem(openid + LS_KEY_CARD_PREFIX + ud);
                if(isUnlocked){
                    H.cardView.showLiukong(index);
                }else{
                    H.cardUnlock.showLiukong(index);
                }
            });

            $('.index-cards-item').bind('touchstart', function(e){
                H.card.lastX = e.touches[0].pageX;
                H.card.lastY = e.touches[0].pageY;
                return true;
            });
        },

        getTapIndex: function(x, y){
            if(x < H.card.card2Left){
                return 0;
            }else if(x > H.card.card3Left){
                return 2;
            }else{
                return 1;
            }
        },

        openCard: function(data){
            if(data.gs == false){
                if(data.fl){
                    H.cardUnlocking.show(data);
                }else{
                    H.cardUnlock.show(data);
                }
            }else{
                localStorage.setItem(openid + LS_KEY_CARD_PREFIX + data.ud , true);
                $('.index-cards-item[data-id="'+data.ud+'"] img').attr('src', data.ulsi);
                H.cardView.show(data);
            }
        },

        arrowResize: function(){
            var width = $(window).width();
            var height = $(window).height();
            var cardArrowWidthRatio = 640 / 16;
            var cardArrowHeightRatio = 640 / 42;

            $('#index .index-cards .slick-arrow').css({
                'width': width / cardArrowWidthRatio,
                'height': height / cardArrowHeightRatio,
                'margin-top': ( H.index.cardItemHeight - height / cardArrowHeightRatio ) / 2
            });
        },

        beginCountdown: function(){
            var cur = new Date().getTime() - H.countdown.serverOffset;
            if(H.card.cardData && H.card.cardData.ml){
                var data = H.card.cardData.ml;
                for(var i in data){
                    var isUnlocked = localStorage.getItem(openid + LS_KEY_CARD_PREFIX + data[i].ud);
                    if(timestamp(data[i].ubt) < cur && cur < timestamp(data[i].uet) && !isUnlocked){
                        H.cardGet.show(data[i]);    
                        return true;
                    }
                }
            }

            setTimeout(function(){
                H.card.beginCountdown();
            }, 5000);
        },

        initUnlockingCards: function(){
            var data = H.card.cardData.ml;
            for(var i in data){
                var isUnlocked = localStorage.getItem(openid + LS_KEY_CARD_PREFIX + data[i].ud);
                if(!isUnlocked){
                    var isUnlocking = localStorage.getItem(openid + LS_KEY_UNLOCKING_PREFIX + data[i].ud);
                    if(isUnlocking){
                        H.card.unLockingCards.push(data[i].ud);
                    }
                }
            }
        },

        unlockCountdown: function(){
            if(H.card.unLockingCards.length > 0){
                getResult('api/greetingcard/material/confirm', {
                    oi : openid,
                    mus: H.card.unLockingCards.join(',')
                }, 'callbackGreetingcardMaterialConfirmHandler');    
            }

            setTimeout(function(){
                H.card.unlockCountdown();  
            }, 5000);
        },

        hasUnlocked: function(data){
            var isChanged = false;
            var unlockSum = 0;
            for(var i in data){
                if(i == 'result'){
                    continue;
                }
                localStorage.setItem(openid + LS_KEY_CARD_PREFIX + i, true);
                localStorage.removeItem(openid + LS_KEY_UNLOCKING_PREFIX + i);

                var $image = $('.index-cards-item[data-id="'+i+'"] img');
                $image.attr('src', $image.attr('data-src'));
                isChanged = true;
                unlockSum++ ;
            }

            if(isChanged){
                showTips('您的' + unlockSum + '张贺卡已解锁');
                H.card.unLockingCards = [];
                H.card.initUnlockingCards();
            }
        },

        initVideoEvents: function(src, poster, wrapper){
            H.card.videoCounter++;

            var videoHtml = H.card.$videoTmpl.tmpl({
                'id': 'cardVideo' + H.card.videoCounter,
                'src' : src,
                'poster' : poster,
                'width' : H.card.videoWidth,
                'height' : H.card.videoHeight
            });

            $(wrapper).html(videoHtml);

            if(!isAndroid){
                videojs("#cardVideo" + H.card.videoCounter).ready(function(){
                    // alert('ready');
                });
            }
            
        },

        closeVideo: function(wrapper){
            $(wrapper).empty();
        },

        resize: function(){
            var width = $(window).width();
            var height = $(window).height();
            var videoTopRatio = 67 / 1009;
            var bigDialogTopRatio = 70 / 1009;
            var dialogBigRatio = 864 / 640 ;
            var smallDialogTopRatio = 103 / 1009;
            var dialogSmallRatio = 702 / 640 ;

            // 视频容器大小
            var videoWidth = width * 0.68 - 12;
            H.card.videoWidth = videoWidth;
            H.card.videoHeight = videoWidth / 4 * 3;

            $('.dialog .video-wrapper').css({
                'width' : videoWidth,
                'height' : videoWidth / 4 * 3,
                'background-size' : videoWidth + 'px ' + videoWidth / 4 * 3 + 'px'
            });

            
            // 小卡片样式
            var smallDialogHeight = dialogSmallRatio * width
            $('.small-dialog').css({
                'width': width,
                'height': smallDialogHeight,
                'background-size' : width + 'px ' + smallDialogHeight + 'px',
                'padding-top' : videoTopRatio * height
            });

            // 大卡片样式
            var bigDialogHeight = dialogBigRatio * width;
            $('.big-dialog').css({
                'width': width,
                'height': bigDialogHeight,
                'background-size' : width + 'px ' + bigDialogHeight + 'px',
                'padding-top' : videoTopRatio * height
            });


            // 卡片上边距
            if(height > 500){
                $('.small-dialog').parent().css({
                'padding-top' : smallDialogTopRatio * height
                });
                $('.big-dialog').parent().css({
                    'padding-top' : bigDialogTopRatio * height
                });
            }else{
                $('.small-dialog').parent().css({
                    'padding-top' : ( height - smallDialogHeight ) / 2
                });
                $('.big-dialog').css({
                    'padding-top' : ( height - bigDialogHeight ) / 2
                });
                $('.big-dialog .btn-close').css({
                    'top' : '-10px',
                    'right' : '-10px'
                });
            }

            moveYSmall = smallDialogTopRatio * height + smallDialogHeight / 2 - H.card.cardY;
            moveYBig = bigDialogTopRatio * height + bigDialogHeight / 2 - H.card.cardY;
            // 定义动画
            moveX1 = width / 2 - ( H.card.cardX + H.card.cardWidth / 2 );
            $.keyframe.define({
                name: 'smallcard-0-open',
                from: {
                    'opacity': 0,
                    '-webkit-transform': 'translate(' + -1 * moveX1 + 'px,' + -1 * moveYSmall + 'px) scale(0.2) scaleX(0.1)'
                },
                to: {
                    '-webkit-transform': 'translate(' + 0 + 'px,' + 0 + 'px) scale(1.0)'
                }
            });
            $.keyframe.define({
                name: 'smallcard-0-close',
                to: {
                    'opacity': 0,
                    '-webkit-transform': 'translate(' + -1 * moveX1 + 'px,' + -1 * moveYSmall + 'px) scale(0.2) scaleX(0.1)'
                },
                from: {
                    '-webkit-transform': 'translate(' + 0 + 'px,' + 0 + 'px)'
                }
            });
            $.keyframe.define({
                name: 'bigcard-0-open',
                from: {
                    'opacity': 0,
                    '-webkit-transform': 'translate(' + -1 * moveX1 + 'px,' + -1 * moveYBig + 'px) scale(0.2) scaleX(0.1)'
                },
                to: {
                    '-webkit-transform': 'translate(' + 0 + 'px,' + 0 + 'px) scale(1.0)'
                }
            });
            $.keyframe.define({
                name: 'bigcard-0-close',
                to: {
                    'opacity': 0,
                    '-webkit-transform': 'translate(' + -1 * moveX1 + 'px,' + -1 * moveYBig + 'px) scale(0.2) scaleX(0.1)'
                },
                from: {
                    '-webkit-transform': 'translate(' + 0 + 'px,' + 0 + 'px)'
                }
            });

            moveX2 = width / 2 - ( H.card.cardX + H.card.cardWidth + H.card.cardWidth / 2 );
            $.keyframe.define({
                name: 'smallcard-1-open',
                from: {
                    'opacity': 0,
                    '-webkit-transform': 'translate(' + -1 * moveX2 + 'px,' + -1 * moveYSmall + 'px) scale(0.2) scaleX(0.1)'
                },
                to: {
                    '-webkit-transform': 'translate(' + 0 + 'px,' + 0 + 'px) scale(1.0)'
                }
            });
            $.keyframe.define({
                name: 'smallcard-1-close',
                to: {
                    'opacity': 0,
                    '-webkit-transform': 'translate(' + -1 * moveX2 + 'px,' + -1 * moveYSmall + 'px) scale(0.2) scaleX(0.1)'
                },
                from: {
                    '-webkit-transform': 'translate(' + 0 + 'px,' + 0 + 'px)'
                }
            });
            $.keyframe.define({
                name: 'bigcard-1-open',
                from: {
                    'opacity': 0,
                    '-webkit-transform': 'translate(' + -1 * moveX2 + 'px,' + -1 * moveYBig + 'px) scale(0.2) scaleX(0.1)'
                },
                to: {
                    '-webkit-transform': 'translate(' + 0 + 'px,' + 0 + 'px) scale(1.0)'
                }
            });
            $.keyframe.define({
                name: 'bigcard-1-close',
                to: {
                    'opacity': 0,
                    '-webkit-transform': 'translate(' + -1 * moveX2 + 'px,' + -1 * moveYBig + 'px) scale(0.2) scaleX(0.1)'
                },
                from: {
                    '-webkit-transform': 'translate(' + 0 + 'px,' + 0 + 'px)'
                }
            });

            moveX3 = width / 2 - (H.card.cardX + 2 * H.card.cardWidth + H.card.cardWidth / 2);
            $.keyframe.define({
                name: 'smallcard-2-open',
                from: {
                    'opacity': 0,
                    '-webkit-transform': 'translate(' + -1 * moveX3 + 'px,' + -1 * moveYSmall + 'px) scale(0.2) scaleX(0.1)'
                },
                to: {
                    '-webkit-transform': 'translate(' + 0 + 'px,' + 0 + 'px) scale(1.0)'
                }
            });
            $.keyframe.define({
                name: 'smallcard-2-close',
                to: {
                    'opacity': 0,
                    '-webkit-transform': 'translate(' + -1 * moveX3 + 'px,' + -1 * moveYSmall + 'px) scale(0.2) scaleX(0.1)'
                },
                from: {
                    '-webkit-transform': 'translate(' + 0 + 'px,' + 0 + 'px)'
                }
            });
            $.keyframe.define({
                name: 'bigcard-2-open',
                from: {
                    'opacity': 0,
                    '-webkit-transform': 'translate(' + -1 * moveX3 + 'px,' + -1 * moveYBig + 'px) scale(0.2) scaleX(0.1)'
                },
                to: {
                    '-webkit-transform': 'translate(' + 0 + 'px,' + 0 + 'px) scale(1.0)'
                }
            });
            $.keyframe.define({
                name: 'bigcard-2-close',
                to: {
                    'opacity': 0,
                    '-webkit-transform': 'translate(' + -1 * moveX3 + 'px,' + -1 * moveYBig + 'px) scale(0.2) scaleX(0.1)'
                },
                from: {
                    '-webkit-transform': 'translate(' + 0 + 'px,' + 0 + 'px)'
                }
            });

            H.cardView.resize(width, bigDialogHeight, smallDialogHeight, videoTopRatio * height, videoWidth / 4 * 3);
            H.cardUnlock.resize(smallDialogHeight, videoTopRatio * height, videoWidth / 4 * 3);
            H.cardUnlocking.resize(width, bigDialogHeight, videoTopRatio * height, videoWidth / 4 * 3);
            H.cardGet.resize(smallDialogHeight, videoTopRatio * height, videoWidth / 4 * 3);
            H.cardSend.resize(bigDialogHeight);
            H.cardAccept.resize(bigDialogHeight);
        }
    };

    W.callbackGreetingcardMaterialAllHandler = function(data){
        if(data.result == true && data.ml && data.ml.length > 0){
            H.card.initCards(data);
        }else{
            // FIX ME 处理拉取失败情况
            H.card.initDefaultCards();
        }
    };

    W.callbackGreetingcardMaterialGetHandler = function(data){
        hideLoading();
        if(data.result == true){
            H.card.openCard(data);
        }
    };

    W.callbackGreetingcardMaterialConfirmHandler = function(data){
        if(data.result == true){
            H.card.hasUnlocked(data);
        }
    };

})(Zepto);