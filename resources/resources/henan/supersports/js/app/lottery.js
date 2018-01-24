(function($) {
    H.lottery = {
        nowTime: null,
        time: 3e3,
        canJump: true,
        isCanShake: false,
        isTimeOver: false,
        lotteryImgList: [],
        init: function() {
            if (new Date().getTime() < getData('canlottery')*1) {
                this.nowCountdown(getData('canlottery')*1);
            } else {
                delData('canlottery');
                alert('参与分享进行摇奖哦~');
                toUrl('index.html');
                return;
            }
            this.event();
            this.shake();
            this.lotteryRound_port();
            this.tttj();
            // this.advertiseport();
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
                        me.currentPrizeAct(data);
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this, nowTimeStr = this.nowTime, prizeActListAll = data.la, prizeActList = [], day = nowTimeStr.split(" ")[0];
            if (prizeActListAll && prizeActListAll.length > 0) {
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if (prizeActListAll[i].pd == day) prizeActList.push(prizeActListAll[i]);
                };
            }
            if (prizeActList.length > 0) {
                for (var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + ' ' + prizeActList[i].st, endTimeStr = prizeActList[i].pd + ' ' + prizeActList[i].et;
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        if (prizeActList[i].bi.length > 0) me.lotteryImgList = prizeActList[i].bi.split(",");
                        me.downloadImg();
                    }
                };
            }
        },
        downloadImg: function(){
            var me = this, t = simpleTpl();
            if($('.preImg')) $('.preImg').remove();
            for(var i = 0; i < me.lotteryImgList.length; i++) t._('<img class="preload preImg" src="' + me.lotteryImgList[i] + '">');
            $('body').append(t.toString());
        },
        advertiseport: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/ad/get' + dev,
                data: {areaNo: 'lottery'},
                dataType: "jsonp",
                jsonpCallback: 'callbackAdGetHandler',
                timeout: 5e3,
                complete: function() {
                },
                success: function(data) {
                    if (data.code == 0 && data.ads) {
                        if (data.st) me.time = parseInt(data.st)*1e3;
                        me.fillAdvertise(data.ads);
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        fillAdvertise: function(data) {
            var items = data, tpl = '';
            for(i in items) {
                if (items[i].p) tpl += '<div class="swiper-slide"><a href="javascript:void(0);" data-url="' + (items[i].l || '') + '" data-collect="true" data-collect-flag="ad_' + items[i].u + '" data-collect-desc="广告' + (i*1+1) + '"><img data-src="' + items[i].p + '" class="swiper-lazy"></a><div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div></div>'
            };
            $('.swiper-wrapper').html(tpl);
            this.swiper();
        },
        swiper: function() {
            var me = this;
            var swiper = new Swiper('.swiper-container', {
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: me.time || 3e3,
                autoplayDisableOnInteraction: false,
                slidesPerView: 1,
                paginationClickable: true,
                keyboardControl: true,
                speed: 500,
                loop: true,
                iOSEdgeSwipeDetection: true,
                preloadImages: true,
                lazyLoading: true,
                lazyLoadingInPrevNext: true,
                onInit: function(swiper) {
                },
                onSlideChangeEnd: function(swiper) {
                }
            });
        },
        event: function() {
            var me = this;
            $('body').delegate('#test', 'click', function(e) {
                e.preventDefault();
                me.shake_listener();
            }).delegate('.swiper-slide a', 'click', function(e) {
                e.preventDefault();
                var me = this;
                if ($(me).attr('data-url')) {
                    setTimeout(function(){
                        location.href = $(me).attr('data-url');
                    }, 3e2);
                }
            });
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        shake_listener: function() {
            if(H.lottery.isCanShake){
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
            }else{
                return;
            }
            if(!$(".home-box").hasClass("yao")) {
                $("#audio-a").get(0).play();
                $(".m-t-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate3d(0,-190px,0)'
                });
                $(".m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate3d(0,190px,0)'
                });
                setTimeout(function(){
                    $(".m-t-b").css({
                        '-webkit-transform': 'translate3d(0,0,0)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                    $(".m-f-b").css({
                        '-webkit-transform': 'translate3d(0,0,0)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                }, 2000);
                $(".home-box").addClass("yao");
            }
            setTimeout(function(){
                H.lottery.drawlottery();
            }, 1500);
        },
        nowCountdown: function(time){
            var me = this;
            me.isCanShake = true;
            me.canJump = true;
            $('.detail-countdown').attr('etime',time).empty();
            $(".countdown-tip").html("距离摇奖结束还有");
            me.count_down();
            $('.countdown').removeClass('none');
        },
        count_down: function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H none"><i>%H%</i>' + '小时</span>' + '<i>%M%</i>' + '<span class="mao">:</span>' + '<i>%S%</i>', // 还有...结束
                    stpl: '<span class="fetal-H none"><i>%H%</i>' + '小时</span>' + '<i>%M%</i>' + '<span class="mao">:</span>' + '<i>%S%</i>', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.canJump){
                            if(!me.isTimeOver){
                                me.isTimeOver = true;
                                delData('canlottery');
                                setTimeout(function(){toUrl('index.html');}, 500);
                            }
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        drawlottery: function() {
            var me = this, sn = Math.sn();
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/exec/luck' + dev,
                data: { matk: matk , sn: sn},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryLuckHandler',
                timeout: 5e3,
                complete: function() {
                },
                success: function(data) {
                    if(data.flow && data.flow == 1){
                        sn = Math.sn();
                        me.lottery_point(null);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            sn = Math.sn();
                            me.lottery_point(data);
                        }
                    }else{
                        sn = Math.sn();
                        me.lottery_point(null);
                    }
                },
                error: function() {
                    sn = Math.sn();
                    me.lottery_point(null);
                }
            });
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            recordUserPage(openid, "调用抽奖接口", 0);
        },
        fill: function(data) {
            this.imgMath();
            $(".home-box").removeClass("yao");
            if(data == null || data.result == false || data.pt == 0){
                $("#audio-a").get(0).pause();
                H.dialog.thanks.open();
                return;
            }else{
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();    //中奖声音
            }
            if (data.pt == 1) {
                H.dialog.shiwuLottery.open(data);
            } else if (data.pt == 9) {
                H.dialog.linkLottery.open(data);
            } else {
                H.dialog.thanks.open();
            }
        },
        lottery_point: function(data) {
            var me = this;
            setTimeout(function() {me.fill(data);},1e3);
        },
        imgMath: function() {//随机背景
            var me = this;
            if(me.lotteryImgList.length >0){
                var i = Math.floor((Math.random() * me.lotteryImgList.length));
                $("body").css("background","url('" + me.lotteryImgList[i] + "') no-repeat center center");
            }
        },
        tttj: function() {
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };

    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0 && data.url) {
            $('#tttj').removeClass('none').text(data.desc || '活动规则');
            $('#tttj').click(function(e) {
                e.preventDefault();
                shownewLoading(null, '请稍后...');
                location.href = data.url;
            });
        }
    };
})(Zepto);

$(function() {
    H.lottery.init();
    H.jssdk.init();
});