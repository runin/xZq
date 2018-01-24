(function($) {
    H.share = {
        method: getQueryString("method"),
        ru: getQueryString("ru"),
        pu: getQueryString("pu"),
        shareUserName: getQueryString("un"),
        cardList: null,
        init: function () {
            this.event();
            this.initCardList();
        },
        event: function() {
            var me = this;
            $(".send-btn").click(function(e){
                e.preventDefault();
                if(!$(this).hasClass("flag")){
                    $(this).addClass("flag");
                    shownewLoading();
                    $.ajax({
                        type : 'GET',
                        async : true,
                        url : domain_url + 'api/lottery/dramacard/directpresented' + dev,
                        data: {matk: matk,ru: me.ru},
                        dataType : "jsonp",
                        jsonpCallback : 'callbackLotteryDramacardDirectPresentedHandler',
                        timeout: 15000,
                        complete: function() {
                            hidenewLoading();
                        },
                        success : function(data) {
                            if(data.result){
                                showTips("赠送成功");
                                setTimeout(function () {
                                    location.href = "card.html";
                                },1000);
                            }else{
                                showTips("赠送失败，请重新打开页面试试");
                            }
                        },
                        error : function(xmlHttpRequest, error) {
                            showTips("赠送失败，请重新打开页面试试");
                        }
                    });
                }
            });

            $(".accept-btn").click(function(e){
                e.preventDefault();
                if(!$(this).hasClass("flag")){
                    $(this).addClass("flag");
                    shownewLoading();
                    $.ajax({
                        type : 'GET',
                        async : true,
                        url : domain_url + 'api/lottery/dramacard/receive' + dev,
                        data: {matk: matk,ru: me.ru},
                        dataType : "jsonp",
                        jsonpCallback : 'callbackLotteryDramacardReceiveHandler',
                        timeout: 15000,
                        complete: function() {
                            hidenewLoading();
                        },
                        success : function(data) {
                            if(data.result){
                                showTips("领取成功");
                                setTimeout(function () {
                                    location.href = "card.html";
                                },1000);
                            }else{
                                showTips("领取失败，该张卡牌已经被领取");
                                $(".share-send-btn").addClass("none");
                                shownewLoading();
                                setTimeout(function () {
                                    location.href = "card.html";
                                },1000);
                            }
                            $.fn.cookie("receive-card-"+me.ru,"true",{expires:5});
                        },
                        error : function(xmlHttpRequest, error) {
                            showTips("领取失败，该张卡牌已经被领取");
                            $(".share-send-btn").addClass("none");
                            $.fn.cookie("receive-card-"+me.ru,"true",{expires:5});
                            shownewLoading();
                            setTimeout(function () {
                                location.href = "card.html";
                            },1000);
                        }
                    });
                }
            });
            $(".card-rule-btn").click(function (e) {
                e.preventDefault();
                location.href = "http://statics.holdfun.cn/photo/jingxilianlian7/index.html?hi=" + encodeURIComponent(headimgurl) + "&un=" + encodeURIComponent(nickname);
            });
        },
        initCardList: function () {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/lottery/dramacard/all' + dev,
                data: {oi: openid},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryDramacardAllHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.result){
                        me.cardList = data.cl;
                        me.initPage();
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        getCardById: function (id) {
            var me = this;
            for (var i = 0; i < me.cardList.length; i++){
                var card = me.cardList[i];
                if(card.pu == id){
                    return card;
                }
            }
            return null;
        },
        initPage: function () {
            var me = this;
            if(me.method == "send"){
                //别人赠送
                if(!me.ru || !me.pu){
                    //数据出错，跳回卡牌页
                    toUrl("card.html");
                    return;
                }
                var card = me.getCardById(me.pu);
                if(!card){
                    //找不到对应卡牌，跳回卡牌页
                    toUrl("card.html");
                    return;
                }
                $(".card-img").attr("src",card.pi);
                $("#userName").text(decodeURIComponent(me.shareUserName));
                $("#userWay").text('赠送');
                $(".share-tips").removeClass("none");
                var flag = $.fn.cookie("receive-card-"+me.ru);
                if(flag == "true"){
                    $(".card-state-tip").text("这张惊喜券已领完").removeClass("none");
                    $(".card-btn").removeClass("none");
                }else{
                    me.checkCanReceive(me.ru);
                }

            }else if (me.method == "demand"){
                //别人索要
                if(!me.ru || !me.pu){
                    //数据出错，跳回卡牌页
                    toUrl("card.html");
                    return;
                }
                var card = me.getCardById(me.pu);
                if(!card){
                    //找不到对应卡牌，跳回卡牌页
                    toUrl("card.html");
                    return;
                }
                me.getCardNumById(me.pu);
                $(".card-img").attr("src",card.pi);
                $("#userName").text(decodeURIComponent(me.shareUserName));
                $("#userWay").text('索要');
                $(".share-tips").removeClass("none");
            }else{
                //数据出错，跳回卡牌页
                toUrl("card.html");
            }
        },
        getCardNumById: function (id) {
            getResult('api/lottery/dramacard/gainCount', {
                oi: openid,
                pu: id
            }, 'callbackLotteryDramacardGainCountHandler');
        },
        checkCanReceive: function (ru) {
            getResult('api/lottery/dramacard/canreceive', {
                matk: matk,
                ru: ru
            }, 'callbackLotteryDramacardCanReceiveHandler');
        }
    };
    W.callbackLotteryDramacardGainCountHandler = function (data) {
        if (data.result && data.gc) {
            if (data.gc > 0) {
                $(".card-state-tip").find("span").text(data.gc+"张");
                $(".card-state-tip").removeClass("none");
                if(H.share.method == "demand"){
                    //索要的情况，有此卡 显示赠送，拒绝按钮
                    $(".share-demand-btn").removeClass("none");
                }else if(H.share.method == "send"){
                    //赠送情况的情况，有此卡 显示领取，放弃按钮
                    $(".share-send-btn").removeClass("none");
                }else{
                    $(".card-btn").removeClass("none");
                }
            } else {
                $(".card-state-tip").find("span").text("0张");
                $(".card-state-tip").removeClass("none");
                if(H.share.method == "demand"){
                    //索要的情况，没有此卡 显示集卡按钮
                    $(".card-btn").removeClass("none");
                }else if(H.share.method == "send"){
                    //赠送情况的情况，有此卡 显示领取，放弃按钮
                    $(".share-send-btn").removeClass("none");
                }else{
                    $(".card-btn").removeClass("none");
                }
            }
        }
    };

    W.callbackLotteryDramacardCanReceiveHandler = function (data) {
        var me = H.share;
        if(data.result){
            if(!data.cr){
                $(".card-state-tip").text("这张惊喜券已领完").removeClass("none");
                $(".card-btn").removeClass("none");
                $.fn.cookie("receive-card-"+me.ru,"true",{expires:5});
                return;
            }
        }
        me.getCardNumById(me.pu);
    }
})(Zepto);

$(function(){
    H.share.init();
});