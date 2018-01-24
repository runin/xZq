(function($) {
    H.vote = {
        dec: 0,
        index: 0,
        pid: null,
        swiper: null,
        safeFlag: false,
        countDownEnd: true,
        inforoudRepeat: true,
        countDownType: 0,
        setIntervalFlag: 0,
        roundList: [],
        voteSupportTime: Math.ceil(5000*Math.random() + 5000),
        init: function () {
            this.event();
            this.getVoteinfo();
        },
        ping: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'api/common/time' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback: 'commonApiTimeHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.t){
                        H.vote.dec = new Date().getTime() - data.t*1;
                    }
                }
            });
        },
        event: function() {
            var me = this;
            $('body').delegate('.vote-btn', 'click', function(e){
                e.preventDefault();
                var guid = $(this).attr('data-guid'), pid = $(this).attr('data-pid');
                if($(this).hasClass('before')){
                    showTips('投票还未开始');
                    return;
                }
                if($(this).hasClass('voted')){
                    showTips('您已经投过票');
                    return;
                }
                if($(this).hasClass('over')){
                    showTips('投票已结束');
                    return;
                }
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/voteguess/guessplayer' + dev,
                    data: {
                        yoi: openid,
                        guid: guid,
                        pluids: pid
                    },
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
                showTips('投票成功!');
                $(this).addClass('voted').next('.goldmonkey').addClass('show');
                setTimeout(function(){$('.goldmonkey').removeClass('show')}, 2000);
                var storage = window.localStorage;
                var val = storage.getItem(guid + openid) == null ? '0' : storage.getItem(guid + openid);
                storage.setItem(guid + openid, val + ',' + pid);
                var id = pid + '-vote-num';
                $('#' + id).text(parseInt($('#'+id).text()) + 1);
            }).delegate('#btn-lottery', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('lottery.html');
                }
            });
        },
        getVoteinfo: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud' + dev,
                data: { yoi: openid },
                dataType : 'jsonp',
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code != 0 || data.flow == 1){
                        if (me.inforoudRepeat) {
                            me.inforoudRepeat = false;
                            setTimeout(function(){
                                me.getVoteinfo();
                            }, 2000);
                        } else {
                            // 数据出错，结束页
                            me.safeVoteMode();
                        }
                    } else {
                        if (data.items && data.items.length > 0) {
                            me.fillVoteinfo(data);
                        } else {
                            // 数据出错，结束页
                            me.safeVoteMode();
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    if (me.inforoudRepeat) {
                        me.inforoudRepeat = false;
                        setTimeout(function(){
                            me.getVoteinfo();
                        }, 2000);
                    } else {
                        // 数据出错，结束页
                        me.safeVoteMode();
                    }
                }
            });
        },
        safeVoteMode: function() {
            this.dec = 0;
            this.safeFlag = true;
            this.pid = localVoteData.pid;
            this.nowTime = timeTransform(new Date().getTime());
            this.fillVoteinfo(localVoteData);
            hidenewLoading();
        },
        fillVoteinfo: function(data) {
            var me = this, nowTimeStr = timeTransform(new Date().getTime() - this.dec), roundItems = data.items;
            me.pid = data.pid;
            me.roundList = roundItems;
            if(comptime(data.pet,nowTimeStr) >= 0){
                // 最后一轮投票结束，终止倒计时
                me.change();
                return;
            }
            if(!roundItems || roundItems.length == 0 ){
                // 数据出错，结束页
                me.safeVoteMode();
                return;
            }
            if(comptime(nowTimeStr,roundItems[roundItems.length - 1].get) < 0){
                // 如果本期投票结束，摇奖页
                me.change();
                return;
            }
            for (var i = 0; i < roundItems.length; i++) {
                var beginTimeStr = roundItems[i].gst, endTimeStr = roundItems[i].get;
                if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0) {
                    // 距离投票结束倒计时
                    me.index = i;
                    me.countDownType = 0;
                    me.voteEndCD(roundItems[i]);
                    return;
                }
                if(comptime(nowTimeStr, beginTimeStr) > 0){
                    // 活动还未开始 未开始倒计时
                    me.index = i;
                    me.countDownType = 1;
                    me.voteStartCD(roundItems[i]);
                    return;
                }
            }
        },
        voteStartCD: function(data){
            var me = this;
            me.countDownType = 1;
            me.countDownEnd = true;
            var beginTimeStr = data.gst;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.count_down();
            me.tplVoteInfo(data);
            $('.btn-wrapper').addClass('none');
            $('.countdown-tip').html('距投票开始还有');
            $('.detail-countdown').removeClass('none');
            $('.countdown-wrapper').removeClass('none');
            $('.countdown').removeClass('hide');
            hidenewLoading();
        },
        voteEndCD: function(data){
            var me = this;
            me.countDownType = 0;
            me.countDownEnd = true;
            var beginTimeStr = data.get;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.count_down();
            me.tplVoteInfo(data);
            $('.countdown').addClass('hide');
            $('.btn-wrapper').removeClass('none');
            $('.countdown-tip').html('距投票结束还有');
            $('.detail-countdown').removeClass('none');
            $('.countdown-wrapper').removeClass('none');
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-D">%D%天</span><span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl: '<span class="fetal-D">%D%天</span><span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.countDownEnd){
                            me.countDownEnd = false;
                            shownewLoading(null,"请稍候...");
                            $(".countdown-tip").html('请稍候...');
                            $(".detail-countdown").addClass("none");
                            if(me.countDownType ==1){
                                // 距离投票开始倒计时结束后，距离投票结束倒计时
                                $(".swiper-container").animate({'opacity': '0'},500);
                                setTimeout(function(){
                                    me.voteEndCD(me.roundList[me.index]);
                                },1000);
                            }else{
                                var guid = me.roundList[me.index].guid;
                                var storage = window.localStorage;
                                storage.removeItem(guid + openid);
                                // 距离投票结束倒计时结束后，距离投票开始倒计时
                                if(me.index >= (me.roundList.length - 1)){
                                    // 最后一轮投票结束，终止倒计时
                                    me.change();
                                }else{
                                    $(".swiper-container").animate({'opacity': '0'},500);
                                    me.index++;
                                    setTimeout(function(){
                                        me.voteStartCD(me.roundList[me.index]);
                                    },1000);
                                }
                            }
                        }
                    }
                });
            });
        },
        swiperInit: function() {
            var me = this;
            me.swiper = new Swiper('.swiper-container', {
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                lazyLoadingInPrevNext : true,
                lazyLoadingInPrevNextAmount : 2,
                slidesPerView: 1,
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: 2000,
                speed: 500,
                autoplayDisableOnInteraction: false,
                effect : 'coverflow',
                coverflow: {
                    rotate: 0,
                    stretch: 0,
                    modifier: 1,
                    slideShadows : false
                }
            });
        },
        tplVoteInfo: function(data){
            var me = this, t = simpleTpl(), items = data.pitems, voteStatus = '';
            $('#swiper-box').empty();
            if(me.countDownType == 1){
                voteStatus = 'before';
            }
            if(items && items.length > 0){
                var cookie = $.fn.cookie(openid + data.guid);
                t._('<section class="swiper-container"><section class="swiper-wrapper">');
                for(var i = 0;i < items.length;i ++){
                    var rdTickes = getRandomArbitrary(10157, 21388);
                    t._('<section class="swiper-slide swiper-back" id="'+items[i].pid+'">')
                        ._('<section class="pic-wrapper">')
                            ._('<img src="./images/bg-load.jpg" data-src="'+items[i].im+'" class="swiper-lazy sp-img" data-index="' + i + '" data-collect="true" data-collect-flag="vote-detail-btn" data-collect-desc="投票页-商品详情">')
                            ._('<section class="swiper-lazy-preloader swiper-lazy-preloader-white"></section>')
                            ._('<section class="vote-wrapper">')
                                ._('<p class="name">'+items[i].na+'</p>')
                                ._('<section class="btn-wrapper">')
                                    ._('<a href="javascript:void(0);" id="like-' + items[i].pid + '" data-pid="' + items[i].pid + '" data-guid="' + data.guid + '" class="none vote-btn ' + voteStatus + '" data-collect="true" data-collect-flag="btn-vote" data-collect-desc="投票按钮"></a>')
                                    ._('<span class="goldmonkey"></span>')
                                    ._('<p class="vote-num none"><span id="'+items[i].pid+'-vote-num">'+rdTickes+'</span>票</p>')
                                ._('</section>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>');
                };
                t._('</section></section>');
                $("#swiper-box").html(t.toString());
                me.swiperInit();
                $(".swiper-container").animate({'opacity': '1'},500);
                if(me.countDownType == 0) {
                    me.isVote(data.guid);
                }
                me.voteNum(data.guid);
                if (!me.safeFlag) {
                    var a = self.setInterval(function(){me.voteNum(data.guid);}, me.voteSupportTime);
                    me.setIntervalFlag = a;
                }
            }
        },
        isVote: function(guid){
            var storage = window.localStorage;
            var val = storage.getItem(guid + openid);
            if(val){
                var valList = val.split(",");
                for(var i = 0; i < valList.length; i++){
                    if($("#like-"+valList[i])){
                        $("#like-"+valList[i]).addClass("voted");
                    }
                }
                $(".vote-btn").removeClass("none");
                return;
            }
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/isvote' + dev,
                data: { yoi: openid, guid: guid },
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessIsvoteHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        var so = data.so;
                        if(so){
                            var list = so.split(",");
                            for(var i = 0; i < list.length; i++){
                                $("#like-"+list[i]).addClass("voted");
                            }
                        }else{
                        }
                    }
                    $(".vote-btn").removeClass("none");
                },
                error : function(xmlHttpRequest, error) {
                    $(".vote-btn").removeClass("none");
                }
            });
        },
        voteNum: function(guid){
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/voteguess/groupplayertickets' + dev,
                data: { yoi: openid, groupUuid: guid },
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessGroupplayerticketsHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        var list = data.items;
                        for(var i = 0; i < list.length; i++){
                            $("#"+list[i].puid+"-vote-num").text(list[i].cunt);
                        }
                    }
                    $(".vote-num").removeClass("none");
                },
                error : function(xmlHttpRequest, error) {
                    $(".vote-num").removeClass("none");
                }
            });
        },
        closeVoteInterval: function() {
            var me = this;
            if (!me.safeFlag) {
                me.setIntervalFlag = window.clearInterval(me.setIntervalFlag);
                me.voteSupportTime = 86400000;
            }
        },
        change: function() {
            this.closeVoteInterval();
            $(".countdown-tip").html('投票已结束，去摇奖看看吧！');
            $('.countdown-wrapper').removeClass('none');
            $('.detail-countdown').html("");
            $(".vote-btn").addClass("over");
            $('.countdown').removeClass('hide');
            hidenewLoading();
        }
    };
})(Zepto);

$(function(){
    H.vote.init();
});