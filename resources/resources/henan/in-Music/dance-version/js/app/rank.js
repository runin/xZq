(function($) {
    H.rank = {
        guid: getQueryString("guid"),
        periodUuid: getQueryString("periodUuid"),
        pid: getQueryString("pid"),
        showMode: getQueryString("showMode"),
        init: function() {
            this.event();
            this.loadImg();
            this.voteSupport();
            this.share();
        },
        share: function(){
            var name = W.localStorage.getItem("nameStar-"+ openid),
            count = W.localStorage.getItem("voteCountStar-"+ openid),
            base = W.localStorage.getItem("guid-"+ this.guid +"pid-"+ this.pid)*1 || 0;
            if (base && base > 0) {
                $('.s-name').html(name);
                $('.s-num').html(base);
            } else {
                if (H.rank.showMode == '1') {
                    $('.myinfo').html('<label style="font-size:17px;">本期演唱会助威活动已结束!</label>');
                } else {
                    $('.myinfo').html('<label style="font-size:19px;">您还未进行任何投票</label>');
                }
            }
            console.log(name);
            console.log(count);
            var title = nickname + '与' + name + '一起给你拜年啦',
                share_info = "我在2016广东春晚摇大奖，快来和我一起参与吧！";
            window['shaketv'] && shaketv.wxShare(share_img, title, share_info, getUrl(openid));
        },
        //获取竞猜信息（最新）
        getCurrentInfo: function(){
            getResult('api/voteguess/inforoud', {}, 'callbackVoteguessInfoHandler', true);
        },
        voteSupport: function() {
            var me =  H.rank;
            getResult('api/voteguess/allplayertickets', { periodUuid: me.periodUuid }, 'callbackVoteguessAllplayerticketsHandler');
        },
        loadImg: function(){
            var imgs = [
                "images/item-bg.jpg",
                "images/rank-tlt.png",
                "images/rank-li-bg.png"
            ];
            loadImg = function () {
                for (var i = 0; i < imgs.length; i++) {//图片预加载
                    var img = new Image();
                    img.style = "display:none";
                    img.src = imgs[i];
                    img.onload = function () {
                        $("body").animate({'opacity':'1'}, 100);
                    }
                }

            };
            loadImg();
        },
        event: function() {
            var me = this;
            $("#live").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                window.location.href = "https://www.baidu.com/index.php?tn=02049043_33_pg";
            });
            $("#share-div").tap(function(e){
                e.preventDefault();
                H.jssdk.menuShare();
                H.jssdk.menuToFriend();
                me.btn_animate($(this));
                $("#mask").removeClass("none");

            });
            $("#mask").tap(function(e){
                e.preventDefault();
                $(this).addClass("none");
            });


            $('body').delegate('.content .left img', 'tap', function(e) {
                e.preventDefault();
                toUrl('details.html?periodUuid=' + me.periodUuid + '&guid=' + me.guid + '&pid=' + $(this).parents('li').attr('id'));
            })
        },
        swap: function(i, j,itema)
        {
            var temp = itema[i];
            itema[i] = itema[j];
            itema[j] = temp;
        },
        bubbleSort: function(itema)
        {
            var me = H.rank;
            for (var i = itema.length - 1; i > 0; --i)
            {
                for (var j = 0; j < i; ++j)
                {
                    var base1 = W.localStorage.getItem("guid-"+ me.guid +"pid-"+ itema[j].puid)*1 || 0;
                    var base2 = W.localStorage.getItem("guid-"+ me.guid +"pid-"+ itema[j + 1].puid)*1 || 0;
                    if ((itema[j].cunt + base1) < (itema[j + 1].cunt + base2)) {
                        me.swap(j, j + 1,itema);
                    }
                }
            }
        },
        tpl: function(data){
            var me = H.rank,
                t = simpleTpl(),
                attrs = data.items || [];

            me.bubbleSort(attrs);
            $.each(attrs, function(i, item){
                var base = W.localStorage.getItem("guid-"+ me.guid +"pid-"+ item.puid)*1 || 0;
                t._('<li id="'+item.puid+'">')
                     ._(' <div class="left"><img src="'+ item.img1 +'" /><span>'+ item.name +'</span></div>')
                     ._('<div class="right">'+ (base + item.cunt*1) +'赞</div>')
                 ._('</li>')
            });
            $('#content ul').append(t.toString());
            $('#content').removeClass("none");
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        }
    };
    W.callbackVoteguessAllplayerticketsHandler = function(data) {
        if (data.code == 0 && data.items) {
            H.rank.tpl(data);
        }
    };

    H.jssdk = {
        wxIsReady: false,
        loadWXconfig: 5,
        init: function(){
            this.wxConfig();
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
                            ]
                        });
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        menuShare: function() {
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
        menuToFriend: function() {
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
        },
        shareFail: function() {
        }
    };
})(Zepto);

$(function() {
    window.shareData = {
        "imgUrl": 'http://cdn.holdfun.cn/resources/images/2016/12/06/a331a11f93044018af0e1c1eaed13a45.jpg',
        "link": getActsShareUrl(location.href, 'details.html'),
        "desc": '好友' + ((getQueryString('nickname') || nickname) || '') + '邀请您一起为爱豆' + (W.localStorage.getItem("nameStar-"+ openid) || '') + '投票！',
        "title": '【邀请函】恭喜你获得“炫舞梦工厂in-Music群星盛典”邀请函'
    };
    H.rank.init();
    H.jssdk.init();
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
            }, 6e3);
        }
    });
});