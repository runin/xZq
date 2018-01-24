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
            me.ddtj();
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
                $(this).html("<i></i>已赞过");
                $(this).addClass("voted");
                H.vote.userVoteNum ++;
                $.fn.cookie(openid+ guid, H.vote.userVoteNum,{expires:1});
                var val = localStorage.getItem(guid + openid) == null ? "0":localStorage.getItem(guid + openid);
                localStorage.setItem(guid + openid, val + "," + pid);
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
            $("#ddtj").click(function(e){
                e.preventDefault();
                if(!$(this).hasClass("clicked")){
                    $(this).addClass("clicked");
                    shownewLoading(null,"请稍候...");
                    var url = $(this).attr("data-href");
                    setTimeout(function(){
                        location.href = url;
                    },300);
                }
            });
		},
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
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
                            H.common.safeShowOver();
                        }
                    } else {
                        if (data.items && data.items.length > 0) {
                            H.vote.fillVoteinfo(data);
                        } else {
                            // 数据出错，结束页
                            H.common.safeShowOver();
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
                        H.common.safeShowOver();
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
                    etpl: '<label>%H%</label>' + ':' + '<label>%M%</label>' + ':' + '<label>%S%</label>', // 还有...结束
                    stpl: '<label>%H%</label>' + ':' + '<label>%M%</label>' + ':' + '<label>%S%</label>', // 还有...开始
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
                                localStorage.removeItem(guid + openid);
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
                preloadImages: true,
                lazyLoading: true,
                slidesPerView : 1.3,
                centeredSlides: false,
                spaceBetween : 15,
                freeMode : true
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
                        ._('<div class="goods-img"><img src="./images/default-vote.png" data-src="'+items[i].im+'" class="swiper-lazy sp-img" data-index="' + i + '"></div>')
                        ._('<div class="vote-div">')
                        ._('<p class="vote-num none">票数:<span id="'+items[i].pid+'-vote-num">'+rdTickes+'</span></p>')
                        ._('<p class="goods-na">'+items[i].na+'</p>')
                        ._('</div>')
                        ._('<div class="goods-detail">'+items[i].in+'</div>')
                        ._('<a href="javascript:void(0);" id="like-' + items[i].pid + '" data-pid="' + items[i].pid + '" data-guid="' + data.guid + '" class="none vote-btn '+before+' '+isVoteFull+'" data-collect="true" data-collect-flag="vote-vote-btn" data-collect-desc="投票页-投票按钮"><i></i>点个赞</a>')
                        ._('</div>');
                }
                t._('</div>')
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
            var val = localStorage.getItem(guid + openid);
            if(val){
                var valList = val.split(",");
                for(var i = 0; i < valList.length; i++){
                    if($("#like-"+valList[i])){
                        $("#like-"+valList[i]).removeClass("full").html("<i></i>已赞过").addClass("voted");
                    }
                }
                $(".vote-left").find("span").text(H.vote.voteNumLimit - H.vote.userVoteNum);
                $(".vote-left").removeClass("none");
                $(".vote-tips").removeClass("none");
                $(".vote-btn").removeClass("none");
                return;
            }else{
                $(".vote-left").find("span").text(H.vote.voteNumLimit);
                $(".vote-left").removeClass("none");
                $(".vote-tips").removeClass("none");
                $(".vote-btn").removeClass("none");
            }
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

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.url) {
            $('#ddtj').attr('data-href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        }
    }

})(Zepto);