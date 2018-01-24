(function ($) {

    H.index = {
        cardItemHeight: 0,
        $countDownTips: $('#tips_countdown'),
        $tangyuan: $('.index-header-link'),
        $defaultTangyuan: $('#default_tangyuan'),
        $selectedTangyuan: $('#selected_tangyuan'),
        $tangyuanType: $('.icon-tangyuan-bg'),
        $tangyuanFace: $('.icon-tangyuan-face'),
        $tangyuanVoice: $('.index-tangyuan-voice'),

        init: function(){
            H.topic.init();
            H.index.bindBtns();
            H.index.initTangyuan();
            H.card.getCards();
        },
        

        initTangyuan: function(){
            var petId = localStorage.getItem(openid + LS_KEY_PET_ID);
            H.index.updateTangyuan(petId);
        },

        updateTangyuan: function(petId){
            if(petId){
                var v = 'a';
                if(petId == 1){
                    v = 'a';
                }else if(petId == 2){
                    v = 'b';
                }else if(petId == 3){
                    v = 'c';
                }else{
                    v = 'd';
                }
                H.index.$defaultTangyuan.addClass('none');
                H.index.$selectedTangyuan.removeClass('none');
                H.index.$tangyuanType.attr('src', 'http://yaotv.qq.com/shake_tv/auto2/2016/01/957pprijv1qnhi/images/tangyuan/yuan_'+v+'_01.png');
                H.index.$tangyuan.removeClass('noEgg');
            }else{
                H.index.$tangyuan.addClass('noEgg');
            }
        },

        bindBtns: function(){
            $('#index .index-countdown').tap(function(){
                if($(this).hasClass('active')){
                    H.router.slideTo('yao');
                    return false;
                }else{
                    H.index.$countDownTips.removeClass('none');
                    setTimeout(function(){
                        H.index.$countDownTips.addClass('none');
                    }, 3000);
                }
            });

            $('#btn_yao').tap(function(){
                if(H.countdown.isYaoActive){
                    H.router.slideTo('yao');
                    return false;
                }
            });

            H.vip.$btnOpen.tap(function(){
                if($(this).hasClass('ready')){
                  H.vip.show();  
                }else{
                  showTips('终极抽奖准备中');
                }
            });

            H.index.$tangyuan.tap(function(){

                if(!H.index.$tangyuan.hasClass('moving')){
                    H.index.$tangyuan.addClass('moving');
                    var ran = Math.floor(Math.random() * 4);
                    var ani = 'click-' + ran;
                    $(this).addClass(ani);


                    var ranFace = Math.floor(Math.random() * 8);
                    H.index.$tangyuanFace.attr('src', 'http://yaotv.qq.com/shake_tv/auto2/2016/01/957pprijv1qnhi/images/tangyuan/yuan_bq_0'+ (ranFace + 1) +'.png');

                    setTimeout(function(){
                        H.index.$tangyuan.removeClass(ani);
                        H.index.$tangyuan.removeClass('moving');
                    }, 1000);

                    var voiceArgs = [
                        '养我养我',
                        '节目好看不？',
                        '嘿嘿嘿',
                        '新年快乐',
                        '嗝~',
                    ];
                    var ranVoice = Math.floor(Math.random() * 5);

                    H.index.$tangyuanVoice.removeClass('zoom-out').addClass('zoom-in').text(voiceArgs[ranVoice]);
                    setTimeout(function(){
                        H.index.$tangyuanVoice.removeClass('zoom-in');
                        setTimeout(function(){
                            H.index.$tangyuanVoice.addClass('zoom-out')
                        }, 800);
                    },500);
                }

                if($(this).hasClass('noEgg')){
                    H.tangyuan.show();
                }else{
                    setTimeout(function(){
                        H.tangyuan.showEgg(localStorage.getItem(openid + LS_KEY_PET_ID));    
                    }, 800);
                }
            });

            if(!H.index.$tangyuan.hasClass('noEgg')){
                setInterval(function(){
                    

                    if(!H.index.$tangyuan.hasClass('moving')){
                        H.index.$tangyuan.addClass('moving');
                        var ran = Math.floor(Math.random() * 4);
                        var ani = 'click-' + ran;
                        H.index.$tangyuan.addClass(ani);


                        var ranFace = Math.floor(Math.random() * 8);
                        H.index.$tangyuanFace.attr('src', 'http://yaotv.qq.com/shake_tv/auto2/2016/01/957pprijv1qnhi/images/tangyuan/yuan_bq_0'+ (ranFace + 1) +'.png');

                        setTimeout(function(){
                            H.index.$tangyuan.removeClass(ani);
                            H.index.$tangyuan.removeClass('moving');
                        }, 1000);

                        var voiceArgs = [
                            '养我养我',
                            '节目好看不？',
                            '嘿嘿嘿',
                            '新年快乐',
                            '嗝~',
                        ];
                        var ranVoice = Math.floor(Math.random() * 5);

                        H.index.$tangyuanVoice.removeClass('zoom-out').addClass('zoom-in').text(voiceArgs[ranVoice]);
                        setTimeout(function(){
                            H.index.$tangyuanVoice.removeClass('zoom-in');
                            setTimeout(function(){
                                H.index.$tangyuanVoice.addClass('zoom-out')
                            }, 800);
                        },500);
                    }


                }, 20000);
            }

            $('#btn_suning').tap(function(){
                location.href = 'http://c.m.suning.com/channel/2016xinnian.html';
            });

            $('#btn_didi').tap(function(){
                location.href = 'http://community.xiaojukeji.com/market/stars_jiangsu/';
            });

            $('#btn_biaoqing').tap(function(){
                location.href = 'http://w.url.cn/s/Aq3Ca9G#wechat_redirect';
            });
        },

        resize: function(){
        	var width = $(window).width();
            var height = $(window).height();

            var verticalOffset = 11 + 16;

        	var cardsRatio = 640 / 187;
        	var countDownRatio = 577 / 66;
        	var commentNavRatio = 640 / 50;
            var commentPaddingRatio = 640 / 32;
            var topicPadding = 8;
            var commentNavPadding = 17;

        	var headerHeight = 40;
        	var cardsHeight = width / cardsRatio;
            var countDownPadding = width / commentPaddingRatio;
        	var countDownHeight = (width - 2* countDownPadding) / countDownRatio;
        	var topicHeight = 22;
        	var commentNavHeight = width / commentNavRatio + commentNavPadding;
        	var commentInputHeight = 62;
        	var commentListHeight = height - headerHeight - cardsHeight - countDownHeight - topicHeight - commentNavHeight - commentInputHeight - verticalOffset;

            // 计算各框架高度
        	$('#index .index-header').css({
        		'height': headerHeight + 'px',
        		'background-size': width + 'px ' + headerHeight + 'px'
        	}).bind('touchmove', function(){
                return false;
            });

        	$('#index .index-cards').css({
        		'height': cardsHeight + 'px',
        		'background-size': width + 'px ' + cardsHeight + 'px'
        	});

        	$('#index .index-countdown').css({
                'width': width - countDownPadding * 2,
        		'height': countDownHeight + 'px',
        		'background-size': width - countDownPadding * 2 + 'px ' + countDownHeight + 'px',
                'margin': '0 auto'
        	}).bind('touchmove', function(){
                return false;
            });

        	$('#index .index-topic').css({
        		'height': topicHeight,
                'padding-left': topicPadding,
                'padding-right': topicPadding
        	}).bind('touchmove', function(){
                return false;
            });

        	$('#index .index-comment-nav').css({
        		'height': commentNavHeight
        	}).bind('touchmove', function(){
                return false;
            });

        	$('#index .index-comment-list').css({
        		'height': commentListHeight
        	});

        	$('#index .index-comment-input').css({
        		'height': commentInputHeight
        	});

            $('#index .index-comment-bg').css({
                'height': commentInputHeight + commentListHeight,
                'width': width
            });


            // 计算卡片容器大小
            var cardBtnRatio = 640 / 70;
            var cardBtnLeftRatio = 640 / 34;
            var cardContainLeftRatio = 640 / 60;
            var cardContainRightRatio = 640 / 46;
            var cardItemMarginRatio = 640 / 5;
            var cardBtnSize = width / cardBtnRatio;
            var cardBtnMargin = 5;
            var cardContentWidth = width - cardBtnSize - width / cardBtnLeftRatio;

            $('#index .index-cards .index-cards-btns').css({
                'padding-top': (cardsHeight - 2 * cardBtnSize - cardBtnMargin) / 2
            });

            $('#index .index-cards .index-cards-btn').css({
                'width': cardBtnSize,
                'height': cardBtnSize,
                'background-size': cardBtnSize + 'px ' + cardBtnSize + 'px'
            });

            var cardInnerMarginLeft = width / cardContainLeftRatio;
            var cardInnerMarginRight = width / cardContainRightRatio;
            $('#index .index-cards .index-cards-content-inner').css({
                'margin-left': cardInnerMarginLeft,
                'margin-right': cardInnerMarginRight,
                'width': cardContentWidth - cardInnerMarginLeft - cardInnerMarginRight
            });

            $('#index .index-cards .index-cards-item').css({
                'margin-right': width / cardItemMarginRatio,
                'margin-left': width / cardItemMarginRatio
            });

            var cardItemHeight = H.index.cardItemHeight = ( cardContentWidth - cardInnerMarginLeft - cardInnerMarginRight - 6 * (width / cardItemMarginRatio) ) / 3;
            $('#index .index-cards .index-cards-content').css({
                'width': cardContentWidth,
                'padding-top': ( cardsHeight - cardItemHeight ) / 2
            });


            H.card.cardY = 40 + 3 + ( cardsHeight - cardItemHeight ) / 2 + cardItemHeight / 2;
            H.card.cardX = cardInnerMarginLeft;
            H.card.cardWidth = cardItemHeight + width / cardItemMarginRatio * 2;
            H.card.card2Left = H.card.cardX + H.card.cardWidth;
            H.card.card3Left = H.card.cardX + 2 * H.card.cardWidth;
            


            // 计算倒计时容器
            var barTopRatio = 640 / 27;
            var barLeftRatio = 640 / 37;
            var barRightRatio = 640 / 75;
            var barHeightRatio = 640 / 12;
            var barWidthRatio = 640 / 520;
            var barBlinkRatio = 38 / 10;
            var barBlinkOffset = 38 / 13;

            $('#bar_countdown').css({
                'top': ( width - 2 * countDownPadding ) / barTopRatio,
                'left': ( width - 2 * countDownPadding ) / barLeftRatio,
                'height': ( width - 2 * countDownPadding ) / barHeightRatio,
                'width' : ( width - 2 * countDownPadding ) / barWidthRatio
            });
            $('#bar_countdown .bar-blink-wrapper').css({
                '-webkit-border-radius': ( width - 2 * countDownPadding ) / barHeightRatio / 2,
                'border-radius': ( width - 2 * countDownPadding ) / barHeightRatio / 2
            });
            $('.index-countdown .bar-yao-btn').css({
                width: countDownHeight * 1.2,
                height: countDownHeight * 1.2
            });
            var barBlinkWidth = ( width - 2 * countDownPadding ) / barHeightRatio * barBlinkRatio;
            var barBlinkHeight = ( width - 2 * countDownPadding ) / barHeightRatio
            $('#bar_countdown .bar-blink').css({
                'height': barBlinkHeight,
                'width': barBlinkWidth,
                'background-size': barBlinkWidth + 'px ' + barBlinkHeight + 'px',
                'right' : -1 * ( barBlinkWidth / barBlinkOffset )
            });
            $('.index-countdown .bar-tips-arrow').css({
                'left' : (width - countDownPadding * 2 - 20 ) / 2
            });

            // 计算评论导航容器
            var navWidthRatio = 640 / 160;
            var navHeightRatio = 640 / 50;
            var navSperWidthRatio = 640 / 63;
            var navSperHeghtRatio = 640 / 50;

            var navWidth = width / navWidthRatio;
            var navHeight = width / navHeightRatio;
            var navSperWidth = width / navSperWidthRatio;
            var navSperHeight = width / navSperHeghtRatio;

            $('.nav-list-item').css({
                'width' : navWidth,
                'height' : navHeight,
                'line-height' : navHeight + 'px',
                'background-size': navWidth + 'px ' + navHeight + 'px'
            });

            $('.index-comment-nav-list .sper').css({
                'width' : navSperWidth,
                'height' : navSperHeight,
                'background-size': navSperWidth + 'px ' + navSperHeight + 'px'
            });

            var navLength = $('.nav-list-item').length;
            $('.index-comment-nav-list').css({
                width: navLength * navWidth + ( navLength - 1 ) * navSperWidth
            });


            H.guide.doorWidth = cardBtnSize;
            H.guide.doorHeight = cardBtnSize;
            H.guide.doorLeft = cardContentWidth;
            H.guide.doorTop = cardBtnSize + (cardsHeight - 2 * cardBtnSize - cardBtnMargin) / 2 + 6 + 3 + 40;

            H.guide.countDownWidth = width - countDownPadding * 2;
            H.guide.countDownHeight = countDownHeight;
            H.guide.countDownLeft = countDownPadding;
            H.guide.countDownTop = 40 + 3 + 8 + cardsHeight;

            H.guide.unlockWidth = cardItemHeight;
            H.guide.unlockHeight = cardItemHeight;
            H.guide.unlockLeft = cardInnerMarginLeft;
            H.guide.unlockTop = 40 + 3 + ( cardsHeight - cardItemHeight ) / 2 ;

            H.guide.resize();
        }
    };


})(Zepto);