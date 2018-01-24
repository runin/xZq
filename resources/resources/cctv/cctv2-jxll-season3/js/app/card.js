(function($) {
    H.card = {
        cardList: [],
        prizeImg: null,
        ru: null,
        pu: null,
        cardState: [],
        canLottery: true,
        cardIndex: 0,
        continueLoop: false,
        cardIds:"",
    init: function () {
            this.event();
            this.initCardList();
        },
        event: function() {
            var me = this;
            $("body").delegate(".card-send-btn","click",function(e){
                shownewLoading();
                //显示赠送分享浮层；
                var pu = $(this).attr("data-pu");
                getResult('api/lottery/dramacard/presented', {
                    matk: matk,
                    pu: pu
                }, 'callbackLotteryDramacardPresentedHandler');
            }).delegate(".card-demand-btn","click",function (e) {
                //显示索要分享浮层；
                //修改分享链接地址以及分享文案
                shownewLoading();
                var pu = $(this).attr("data-pu");
                getResult('api/lottery/dramacard/demand', {
                    matk: matk,
                    pu: pu
                }, 'callbackLotteryDramacardDemanHandler');
            });
            $(".dialog-card-share").click(function (e) {
                //取消索要
                //修改分享链接地址以及分享文案
                if($(".dialog-card-share").attr("data-type") == "send"){
                    me.rollBackCard(me.ru);
                }
                $('.dialog-card-share').addClass('none');
                H.jssdk.menuToFriend(wxData);
                H.jssdk.menuShare(wxData);
            });
            $(".card-rule-btn").click(function (e) {
                e.preventDefault();
                location.href = "http://statics.holdfun.cn/photo/jingxilianlian7/index.html?hi=" + encodeURIComponent(headimgurl) + "&un=" + encodeURIComponent(nickname);
            });
        },
        initCardList: function () {
            var me = this;
            shownewLoading();
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
                        var cl = data.cl;
                        if(cl && cl.length > 0){
                            me.cardList = cl;
                            var t = new simpleTpl();
                            for(var i = 0; i < cl.length; i++){
                                t._('<div class="swiper-slide card'+i+'" id="' + cl[i].pu +'" data-port="no">')
                                    ._('<div class="card-none-cover"></div>')
                                    ._('<p class="card-num none">0张</p>')
                                    ._('<img src="' + cl[i].pi + '">')
                                    ._('<a class="card-btn none" data-pu="' + cl[i].pu + '" data-collect="true" data-collect-flag="" data-collect-desc=""></a>')
                                    ._('</div>');
                            }
                            $("#card-list").html(t.toString());
                            me.swiper();
                            var flag = $.fn.cookie("card-prize-cancle-flag");
                            if(flag != "true"){
                                setTimeout(function () {
                                    me.getPrizeRule();
                                },300);
                            }
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        swiper: function() {
            var me = this;
            me.defaultSwiper = new Swiper('.swiper-container', {
                slidesPerView: 1,
                centeredSlides: true,
                spaceBetween: 20,
                speed: 600,
                effect: 'coverflow',
                coverflow: {
                    stretch: 0,
                    depth: 300,
                    modifier: 1,
                    rotate: -30,
                    slideShadows : false
                },
                iOSEdgeSwipeDetection : true,
                preloadImages: false,
                lazyLoading: true,
                lazyLoadingInPrevNext : true,
                onInit: function(swiper){
                    me.getCardNumPort(0);
                    me.getCardNumPort(1);
                },
                onSlideChangeEnd: function(swiper) {
                    var index = parseInt(swiper.activeIndex);
                    if(!swiper.isEnd){
                        me.getCardNumPort(index+1);
                    }
                }
            });
        },
        getPrizeRule: function () {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/sign/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackSignRoundHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        me.continueLoop = true;
                        var items = data.items;
                        me.cardState = {
                            stm: items[0].st,
                            etm: items[0].et,
                            prizeImg: items[0].i
                        };
                        me.checkPrizeTime();
                    }else{
                        hidenewLoading();
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        getCardNumPort: function(i) {
            if ($('.card' + i).attr('data-port') == 'no') {
                $('.card' + i).attr('data-num', '0');
                var pu = $('.card' + i).attr('id');
                getResult('api/lottery/dramacard/gainCount', {
                    oi: openid,
                    pu: pu
                }, 'callbackLotteryDramacardGainCountHandler');
            }
        },
        checkPrizeTime: function () {
            var me = this;
            var nowTimeStr = timeTransform(new Date().getTime());
            var beginTimeStr = me.cardState.stm;
            var endTimeStr = me.cardState.etm;
            if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                me.prizeImg = me.cardState.prizeImg;
                me.checkCardNum();
            }else{
                hidenewLoading();
            }
        },
        checkCardNum: function () {
            var me = this;
            if(me.canLottery){
                me.getCardNumPort(me.cardIndex);
            }else{
                hidenewLoading();
            }
        },
        prizeDialog:{
            name: '',
            mobile: '',
            ru:'',
            open: function() {
                var me = this;
                me.tpl();
                me.event();
            },
            event: function () {
                var me = this;
                $(".dialog-card-prize").find(".prize-btn").click(function(e){
                    e.preventDefault();
                    if(me.check()) {
                        if(!$(this).hasClass("flag")){
                            $(this).addClass("flag");
                            shownewLoading();
                            getResult('api/lottery/award', {
                                oi: openid,
                                nn: nickname ? encodeURIComponent(nickname) : "",
                                hi: headimgurl ? headimgurl : "",
                                rn: me.name ? encodeURIComponent(me.name) : "",
                                ph: me.mobile ? me.mobile : ""
                            }, 'callbackLotteryAwardHandler');
                            setTimeout(function(){
                                hidenewLoading();
                                showTips("领取成功");
                                me.close();
                            },300);
                            $.fn.cookie("card-prize-cancle-flag","true",{exprise:1});
                        }
                    }
                });
                $(".dialog-card-prize").find(".prize-accept-btn").click(function(e){
                    e.preventDefault();
                    shownewLoading();
                    $.ajax({
                        type : 'GET',
                        async : false,
                        url : domain_url + 'api/lottery/exec/luck4DramaCard' + dev,
                        data: { matk: matk},
                        dataType : "jsonp",
                        jsonpCallback : 'callbackLotteryLuck4DramaCardHandler',
                        timeout: 11000,
                        complete: function() {
                            hidenewLoading();
                        },
                        success : function(data) {
                            if(data.result){
                                me.update(data);
                            }else{
                                showTips("兑换出错，请刷新页面重试");
                                me.close();
                            }
                        },
                        error : function() {
                            showTips("兑换出错，请刷新页面重试");
                            me.close();
                        }
                    });
                });
                $(".dialog-card-prize").find(".icon-prize-close").click(function(e){
                    me.close();
                });
                $(".dialog-card-prize").find(".prize-cancel-btn").click(function(e){
                    me.close();
                    $.fn.cookie("card-prize-cancle-flag","true",{exprise:1});
                });
            },
            close: function () {
                $(".dialog-card-prize").remove();
            },
            update: function (data) {
                var me = this;
                me.ru = data.ru;
                $(".username").attr("value",data.rn);
                $(".phone").attr("value",data.ph);
                $(".confirm-box").addClass("none");
                $(".info-box").removeClass("none");
            },
            check: function(){
                var me = this, name = $.trim($('.username').val()), mobile = $.trim($('.phone').val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖！');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                }
                me.name = name;
                me.mobile = mobile;
                return true;
            },
            tpl: function (data) {
                var t = new simpleTpl();
                t._('<div class="dialog-card-prize">')
                    ._('<div class="dialog-content">')
                    ._('<a class="icon-prize-close" data-collect="true" data-collect-flag="card-prize-close-btn" data-collect-desc="卡牌页-奖品关闭按钮"><img src="images/icon-prize-close.png"></a>')
                    ._('<img class="prize-img" src="' + H.card.prizeImg + '">')
                    ._('<div class="info-box none">')
                    ._('<p class="prize-tips">请填写您的联系方式,以便兑奖</p>')
                    ._('<p>姓名：<input type="text" class="username" value=""/></p>')
                    ._('<p>电话：<input type="text" class="phone" value=""/></p>')
                    ._('<a class="prize-btn">立即领取</a>')
                    ._('</div>')
                    ._('<div class="confirm-box">')
                    ._('<p class="exchange-tips">您已集齐12张惊喜券<br/>可获得由一汽丰田提供的<br/>新卡罗拉汽车一年使用权<br/>是否确认领取？</p>')
                    ._('<a class="prize-cancel-btn" data-collect="true" data-collect-flag="card-prize-cancel-btn" data-collect-desc="卡牌页-奖品放弃按钮">放弃</a>')
                    ._('<a class="prize-accept-btn" data-collect="true" data-collect-flag="card-prize-accept-btn" data-collect-desc="卡牌页-奖品兑换按钮">兑换</a>')
                    ._('</div>')
                    ._('</div>')
                    ._('</div>');
                $("body").append(t.toString());
            }
        },
        getShareUrl: function(ru,pu,method) {
            var href = window.location.href;
            href = add_param(href.replace(/[^\/]*\.html/i, 'share.html'), 'friUid', hex_md5(openid), true);
            href = add_param(href, 'from', 'share', true);
            href = add_param(href, 'method', method, true);
            href = add_param(href, 'ru', ru, true);
            href = add_param(href, 'pu', pu, true);
            href = add_param(href, 'un', encodeURIComponent(nickname), true);
            href = delQueStr(href, "openid");
            href = delQueStr(href, "headimgurl");
            href = delQueStr(href, "nickname");
            href = delQueStr(href, "matk");
            href = delQueStr(href, "sex");
            return add_yao_prefix(href);
        },
        rollBackCard: function (ru) {
            var me = this;
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/lottery/dramacard/receive' + dev,
                data: {matk: matk,ru: ru},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryDramacardReceiveHandler',
                timeout: 15000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.result){
                        var cardNum = $("#"+me.pu).attr("data-num")*1;
                        $("#"+me.pu).find(".card-num").text((cardNum + 1) + "张");
                        $("#"+me.pu).attr("data-num",cardNum+1);
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        }
    };

    H.jssdk = {
        wxIsReady: false,
        loadWXconfig: 5,
        init: function(){
            this.wxConfig();
            this.initWxData();
        },
        initWxData: function () {
            window.sendWxData = {
                "imgUrl": share_img,
                "link": share_url,
                "desc": '我在CCTV2《惊喜连连》里向你送出一张惊喜券，集齐12张就能获得一汽丰田汽车使用权，快来领取吧！',
                "title": '您的好友向赠送了一张惊喜券'
            };
            window.demandWxData = {
                "imgUrl": share_img,
                "link": share_url,
                "desc": '我正在CCTV2《惊喜连连》里缺一张惊喜券，集齐12张就能获得一汽丰田汽车使用权，快来帮我集齐吧!',
                "title": '您的好友向索要了一张惊喜券'
            };
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
        menuShare: function(shareData) {
            var me = this;
            wx.onMenuShareTimeline({
                title: shareData.title,
                desc: shareData.desc,
                link: shareData.link,
                imgUrl: shareData.imgUrl,
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
        menuToFriend: function(shareData) {
            var me = this;
            wx.onMenuShareAppMessage({
                title: shareData.title,
                desc: shareData.desc,
                link: shareData.link,
                imgUrl: shareData.imgUrl,
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
            $('.dialog-card-share').addClass('none');
            this.menuToFriend(wxData);
            this.menuShare(wxData);
        },
        shareFail: function() {
            $('.dialog-card-share').addClass('none');
            this.menuToFriend(wxData);
            this.menuShare(wxData);
        }
    };
    W.callbackLotteryDramacardGainCountHandler = function(data) {
        var me = H.card;
        if (data.result) {
            $('#' + data.pu).attr('data-port', 'yes');
            if(me.cardIds.indexOf(data.pu) < 0){
                me.cardIndex ++;
                me.cardIds += (data.pu+";");
            }
            if (data.gc > 0) {
                $('#' + data.pu).find('.card-none-cover').addClass("none");
                $('#' + data.pu).find('.card-num').text(data.gc + '张').removeClass('none');
                $('#' + data.pu).attr("data-num",data.gc);
                $('#' + data.pu).find('.card-btn').text('赠送').addClass("card-send-btn").removeClass('none');
                $('#' + data.pu).find('.card-btn').attr('data-collect-flag','card-send-btn');
                $('#' + data.pu).find('.card-btn').attr('data-collect-desc','卡牌页-卡牌赠送按钮');
                if(me.cardIndex == me.cardList.length && me.canLottery){
                    hidenewLoading();
                    me.prizeDialog.open();
                }else{
                    if(me.continueLoop)
                    me.checkCardNum();
                }
            } else {
                me.canLottery = false;
                $('#' + data.pu).find('.card-num').removeClass('none');
                $('#' + data.pu).find('.card-num').text('0张').removeClass('none');
                $('#' + data.pu).attr("data-num",'0');
                $('#' + data.pu).find('.card-btn').text('索要').addClass("card-demand-btn").removeClass('none');
                $('#' + data.pu).find('.card-btn').attr('data-collect-flag','card-demand-btn');
                $('#' + data.pu).find('.card-btn').attr('data-collect-desc','卡牌页-卡牌索要按钮');
            }
        }
    };

    W.callbackLotteryDramacardPresentedHandler = function(data) {
        if (data.result && data.ru) {
            //赠送修改分享链接地址以及分享文案
            H.card.ru = data.ru;
            H.card.pu = data.pu;
            var url = H.card.getShareUrl(data.ru,data.pu,"send");
            var cardNum = $("#"+data.pu).attr("data-num")*1;
            $("#"+data.pu).find(".card-num").text((cardNum - 1) + "张");
            $("#"+data.pu).attr("data-num",cardNum-1);
            if(cardNum-1 == 0){
                $('#' + data.pu).find('.card-btn').text('索要').attr("class","card-btn card-demand-btn");
                $('#' + data.pu).find('.card-none-cover').removeClass("none");
                $('#' + data.pu).find('.card-btn').attr('data-collect-flag','card-demand-btn');
                $('#' + data.pu).find('.card-btn').attr('data-collect-desc','卡牌页-卡牌索要按钮');
            }
            sendWxData.link = url;
            H.jssdk.menuShare(sendWxData);
            H.jssdk.menuToFriend(sendWxData);
            $(".dialog-card-share").find("img").attr("src","images/card-share-send.png");
            $(".dialog-card-share").attr("data-type","send").removeClass("none");
        } else {
            showTips('貌似出了点问题，请刷新后重试~', 2000);
        }
        hidenewLoading();
    };

    W.callbackLotteryDramacardDemanHandler = function(data) {
        if (data.result && data.ru) {
            //赠送修改分享链接地址以及分享文案
            var url = H.card.getShareUrl(data.ru,data.pu,"demand");
            demandWxData.link = url;
            H.jssdk.menuShare(demandWxData);
            H.jssdk.menuToFriend(demandWxData);
            $(".dialog-card-share").find("img").attr("src","images/card-share-demand.png");
            $(".dialog-card-share").attr("data-type","demand").removeClass("none");
        } else {
            showTips('貌似出了点问题，请刷新后重试~', 2000);
        }
        hidenewLoading();
    };
    W.callbackLotteryAwardHandler = function(data) {};
})(Zepto);

$(function(){
    H.card.init();
    H.jssdk.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
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
            }
        });
    });
    wx.error(function(res){
        H.jssdk.wxIsReady = false;
        if (H.jssdk.loadWXconfig != 0) {
            setTimeout(function(){
                H.jssdk.loadWXconfig--;
                H.jssdk.init();
            }, 6000);
        }
    });
});