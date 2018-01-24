(function($) {
	H.vote = {
        pid : null,
        inforoudRepeat: true,    //主活动信息服务接口的标识，true为可以在上次接口回调失败中再调一次接口，false为不能再调用接口
        roundList: [],
        countDownType: 0, // 倒计时类型，1：距离投票开始倒计时，0：距离投票结束倒计时
        index: 0,
        countDownEnd: true,
        userVoteNum: 0,
        voteNumLimit: 4,
        defaultSwiper:null,
		init: function () {
            var me = this;
            me.getVoteinfo();
            me.event();
		},
		event: function() {
			var me = this;
            $("body").delegate(".vote-btn","click",function(e){
                e.preventDefault();
                if($(this).hasClass("before")){
                    showTips("投票还未开始");
                    return;
                }
                if($(this).hasClass("full")){
                    showTips("您的投票次数已用完");
                    return;
                }
                if($(this).hasClass("voted")){
                    showTips("您已经投过票");
                    return;
                }
                if($(this).hasClass("over")){
                    showTips("投票已结束");
                    return;
                }
                var guid = $(this).attr('data-guid');
                var pid = $(this).attr('data-pid');
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
                $(this).addClass("voted");
                H.vote.userVoteNum ++;
                $.fn.cookie(openid+ guid, H.vote.userVoteNum,{expires:1});
                var storage = window.localStorage;
                var val = storage.getItem(guid + openid) == null ? "0":storage.getItem(guid + openid);
                storage.setItem(guid + openid, val + "," + pid);
                $(".vote-left").find("span").text(H.vote.voteNumLimit - H.vote.userVoteNum);
                if(H.vote.userVoteNum >= H.vote.voteNumLimit){
                    $(".vote-btn").each(function(){
                        if(!$(this).hasClass("voted")){
                            $(this).addClass("full");
                        }
                    });
                }
                var id = pid+"-vote-num";
                $("#"+id).text(parseInt($("#"+id).text()) + 1);
            }).delegate(".sp-img","click",function(e){
                e.preventDefault();
                var gIndex = $(this).attr("data-index");
                var data = me.roundList[me.index].pitems[gIndex];
                $("#detail").find(".detail-img").attr("src",data.im2);
                $("#detail").find(".detail-text").html(data.in);
                $("#detail").removeClass("none");
                $("#detail").animate({'opacity': '1'},500);
                setTimeout(function(){
                    $("#detail").removeClass("none");
                },500);
            });
            $(".detail-back").click(function(e){
                e.preventDefault();
                $("#detail").animate({'opacity': '0'},500);
                setTimeout(function(){
                    $("#detail").addClass("none");
                },500);
            });
            $(".icon-down").click(function(e){
                e.preventDefault();
                if(!$(this).hasClass("clicked")){
                    $(this).addClass("clicked");
                    toUrl("cjl.html?openid="+openid);
                }
            });
            $(".icon-jlf").click(function(e){
                e.preventDefault();
                if(!$(this).hasClass("clicked")){
                    $(this).addClass("clicked");
                    location.href = "http://mp.weixin.qq.com/s?__biz=MjM5NDIwOTcyMA==&mid=402284095&idx=1&sn=3006d25a2f6cd513beabe7ccbd7e52ce#rd";
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
                    if(data.code != 0 || data.flow == 1){
                        if (H.vote.inforoudRepeat) {
                            H.vote.inforoudRepeat = false;
                            setTimeout(function(){
                                H.vote.getVoteinfo();
                            }, 2000);
                        } else {
                            // 数据出错，结束页
                            H.common.showOver();
                        }
                    } else {
                        if (data.items && data.items.length > 0) {
                            H.vote.fillVoteinfo(data);
                        } else {
                            // 数据出错，结束页
                            H.common.showOver();
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    if (H.vote.inforoudRepeat) {
                        H.vote.inforoudRepeat = false;
                        setTimeout(function(){
                            H.vote.getVoteinfo();
                        }, 2000);
                    } else {
                        toUrl('yaoyiyao.html');
                    }
                }
            });
        },
        fillVoteinfo: function(data) {
            var me = this;
            H.vote.pid = data.pid;
            var nowTimeStemp = new Date().getTime();
            var nowTimeStr = timeTransform(nowTimeStemp - H.common.dec);
            if(comptime(data.pet,nowTimeStr) >= 0){
                // 如果本期投票结束，结束页
                H.common.showOver();
                return;
            }
            var roundItems = data.items;
            H.vote.roundList = roundItems;
            if(!roundItems || roundItems.length == 0 ){
                // 数据出错，结束页
                H.common.showOver();
                return;
            }
            if(comptime(nowTimeStr,roundItems[roundItems.length - 1].get) < 0){
                // 如果本期投票结束，摇奖页
                H.common.showLottery();
                return;
            }
            for (var i = 0; i < roundItems.length; i++) {
                var beginTimeStr = roundItems[i].gst, endTimeStr = roundItems[i].get;
                if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                    me.index = i;
                    // 距离投票结束倒计时
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
            beginTimeLong += H.common.dec;
            $('.vote-countdown').attr('etime',beginTimeLong).empty();
            $(".vote-tip").html('距投票开始还有');
            me.count_down();
            me.tplVoteInfo(data);
            $(".vote-countdown").removeClass("none");
            $('.vote-cd').removeClass('none');
            $("header").animate({'opacity': '1'},500);
            hidenewLoading();
        },
        voteEndCD: function(data){
            var me = this;
            me.countDownType = 0;
            me.countDownEnd = true;
            var beginTimeStr = data.get;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.common.dec;
            $('.vote-countdown').attr('etime',beginTimeLong).empty();
            $(".vote-tip").html('距投票结束还有');
            me.count_down();
            me.tplVoteInfo(data);
            $(".vote-countdown").removeClass("none");
            $('.vote-cd').removeClass('none');
            $("header").animate({'opacity': '1'},500);
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            $('.vote-countdown').each(function() {
                $(this).countDown({
                    etpl: '<label>%M%</label>' + ':' + '<label>%S%</label>', // 还有...结束
                    stpl: '<label>%M%</label>' + ':' + '<label>%S%</label>', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.countDownEnd){
                            me.countDownEnd = false;
                            shownewLoading(null,"请稍候...");
                            $(".vote-tip").html('请稍候...');
                            $(".vote-countdown").addClass("none");
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
                                H.common.showLottery();
                                if(me.index >= (me.roundList.length - 1)){
                                    // 最后一轮投票结束，终止倒计时
                                    $(".vote-tip").html('本期投票已结束，请下期再来');
                                    $('.vote-countdown').html("");
                                    $(".vote-btn").addClass("over");
                                    hidenewLoading();
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
        swiper: function() {
            var me = this;
            me.defaultSwiper = new Swiper('.swiper-container', {
                nextButton: '.swiper-button-next-vote',
                prevButton: '.swiper-button-prev-vote',
                pagination: '.swiper-pagination',
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                effect : 'coverflow',
                slidesPerView: 1,
                centeredSlides: true,
                coverflow: {
                    rotate: 0,
                    stretch: H.common.stretch,
                    depth: 80,
                    modifier: 2,
                    slideShadows : false
                }
            });
        },
        tplVoteInfo: function(data){
            var me = this;
            $("#mainContainer").empty();
            var t = simpleTpl();
            var items = data.pitems;
            var before = "";
            if(me.countDownType == 1){
                before = "before";
                $(".vote-left").addClass("none");
                $(".vote-tips").addClass("none");
            }else{
                $(".vote-left").removeClass("none");
                $(".vote-tips").removeClass("none");
            }
            if(items && items.length > 0){
                var cookie = $.fn.cookie(openid+ data.guid);
                me.userVoteNum = cookie ? parseInt(cookie):0;
                var isVoteFull = "";
                if(me.userVoteNum >= me.voteNumLimit){
                    isVoteFull = "full";
                }
                t._('<div class="swiper-container" id="swiperContainer">')
                 ._('<div class="swiper-wrapper" id="vote-list">');
                for(var i = 0;i < items.length;i ++){
                    var rdTickes = getRandomArbitrary(9157,21388);
                    t._('<div class="swiper-slide swiper-back" id="'+items[i].pid+'">')
                        ._('<p class="card-num">'+(i+1)+'号门'+'</p>')
                        ._('<div style="padding-top: 25%;"></div>')
                        ._('<div class="goods-img"><img src="./images/default-vote.png" data-src="'+items[i].im+'" class="swiper-lazy sp-img" data-index="' + i + '" data-collect="true" data-collect-flag="vote-detail-btn" data-collect-desc="投票页-商品详情"></div>')
                        ._('<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>')
                        ._('<table class="cont">')
                        ._('<tr>')
                            ._('<td rowspan="2" class="na"><span class="goods-na">'+items[i].na+'</span></td>')
                            ._('<td class="zan-btn"><a href="javascript:void(0);" id="like-' + items[i].pid + '" data-pid="' + items[i].pid + '" data-guid="' + data.guid + '" class="none vote-btn '+before+' '+isVoteFull+'" data-collect="true" data-collect-flag="vote-vote-btn" data-collect-desc="投票页-投票按钮"></a></td>')
                        ._('</tr>')
                        ._('<tr>')
                            ._('<td>')
                                ._('<span class="vote-num none"><span id="'+items[i].pid+'-vote-num">'+rdTickes+'</span>票</span>')
                            ._('</td>')
                        ._('</tr>')
                        ._('</table>')
                        ._('</div>');
                }
                t._('</div>')
                    ._('<div class="swiper-button-prev swiper-button-prev-vote swiper-button-white" data-collect="true" data-collect-flag="vote-swiper-btn-prev" data-collect-desc="投票页-点击左箭头"><img src="./images/icon-arrow-left.png"></div>')
                    ._('<div class="swiper-button-next swiper-button-next-vote swiper-button-white" data-collect="true" data-collect-flag="vote-swiper-btn-next" data-collect-desc="投票页-点击右箭头"><img src="./images/icon-arrow-right.png"></div>')
                    ._('</div>');
                $("#mainContainer").html(t.toString());
                if(!$("#vote").hasClass("none")){
                    H.vote.swiper();
                }
                $(".main,.swiper-container").animate({'opacity': '1'},500);
                if(me.countDownType == 0) {
                    me.isVote(data.guid);
                }
                me.voteNum(data.guid);
            }
        },
        isVote: function(guid){
            var storage = window.localStorage;
            var val = storage.getItem(guid + openid);
            if(val){
                var valList = val.split(",");
                for(var i = 0; i < valList.length; i++){
                    if($("#like-"+valList[i])){
                        $("#like-"+valList[i]).removeClass("full").addClass("voted");
                    }
                }
                $(".vote-left").find("span").text(H.vote.voteNumLimit - H.vote.userVoteNum);
                $(".vote-left").removeClass("none");
                $(".vote-tips").removeClass("none");
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
                            H.vote.userVoteNum = list.length;
                            $.fn.cookie(openid+ guid, H.vote.userVoteNum,{expires:1});
                            for(var i = 0; i < list.length; i++){
                                $("#like-"+list[i]).removeClass("full").addClass("voted");
                            }
                            $(".vote-left").find("span").text(H.vote.voteNumLimit - H.vote.userVoteNum);
                            $(".vote-left").removeClass("none");
                            $(".vote-tips").removeClass("none");
                        }else{
                            $(".vote-left").find("span").text(H.vote.voteNumLimit);
                            $(".vote-left").removeClass("none");
                            $(".vote-tips").removeClass("none");
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
                timeout: 11000,
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
                }
            });
        }
	};


})(Zepto);