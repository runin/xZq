(function($) {
    H.lottery = {
        $goLottery: $("#go-lottery"),//投票页摇奖按钮状态
        $showTips: $("#show-tips"),//摇奖页摇奖状态提示
        delayTime:1000,
        SID:getQueryString("SID"),
        Simg:getQueryString("Simg"),
        isSelf:getQueryString("isSelf"),
        ssid:null,
        share_img:null,
        isGetSplit:false,
        wxData:{
            "imgUrl": share_img,
            "link": share_url,
            "desc": share_desc,
            "title": share_title
        },
        init: function() {
            if(this.SID){
                getResult('api/split/send',{oi:openid,lru:this.SID},'callbackSplitSendHandler');
                getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler');
            }
            if(this.Simg){
                $(".btn-box").before('<img src="' + filterXSS(this.Simg) + '" />');
            }
            if(!this.isSelf){
                recordUserOperate(openid, "通过裂变分享进入", "fromShareJoin");
            }
            this.event();
        },
        getsplit: function (sid) {
            getResult('api/split/record',{oi:openid,sid:sid},'callbackSplitRecordHandler');
        },
        event: function() {
            var me = this;
            $('body').delegate('#test', 'click', function(e) {
                e.preventDefault();
                me.wxCheck = true;
                me.lotteryTime = 1;
                me.shake_listener();
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        ping: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/common/time' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'commonApiTimeHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.t){
                        me.safeLotteryMode('off');
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        drawlottery: function(sid) {
            var me = this, sn = new Date().getTime()+'';
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/exec/luck4Split' + dev,
                data: { matk: matk , sn: sn,sau: sid},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryluck4SplitHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.flow && data.flow == 1){
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime()+'';
                            me.fill(data,sid);
                        }
                    }else{
                        sn = new Date().getTime()+'';
                        me.fill(null,sid);
                    }
                },
                error: function() {
                    sn = new Date().getTime()+'';
                    me.fill(null,sid);
                }
            });
            recordUserOperate(openid, "调用裂变抽奖接口", "doSplitLottery");
            recordUserPage(openid, "调用抽奖接口", 0);
        },
        fill: function(data,sid) {
            var me = this;
            if(data == null || data.result == false || data.pt == 0){
                if(me.delayTime <= 5000){
                    setTimeout(function(){
                        me.delayTime += 3000;
                        me.drawlottery(sid);
                    }, me.delayTime);
                }
                if(!H.lottery.isGetSplit){
                    H.lottery.getsplit(sid);
                    H.lottery.isGetSplit = true;
                }
                return;
            }else{
            }
            if (data.pt == 9) {
                //$(".touse").css("opacity","1").tap(function(e){
                //    e.preventDefault();
                //    me.btn_animate($(this));
                //    shownewLoading();
                //    setTimeout(function () {
                //        window.location.href = data.ru;
                //    },500);
                //});
                H.lottery.getsplit(sid);
            }else{

            }
        },
        fillshare: function (data) {
            var shareInfo='';
            for(var i=0;i<data.length;i++){
                shareInfo += '<div class="share-body"><div class="share-head"><img src="' + data[i].hu + '" /></div>'
                    + '<div class="share-info"><span class="share-info-name">' + data[i].nn + '</span>'
                    + '<span class="share-info-time">' + data[i].ct + '</span>'
                    + '<span class="share-info-numb">1个</span>'
                    + '<p>' + data[i].msg + '</p></div></div>';
            }
            $(".share-person").append(shareInfo);
        }
    };

    H.jssdk = {
        wxIsReady: false,
        loadWXconfig: 5,
        init: function(){
            this.ready();
            this.wxConfig();
            this.menuToFriend(H.lottery.wxData);
            this.menuShare(H.lottery.wxData);
        },
        ready: function() {
            var me = this;
            H.lottery.wxData = {
                "imgUrl": H.lottery.share_img?H.lottery.share_img:share_img,
                "link": getNewUrl(openid),
                "desc": "好东西就要和朋友一起分享，跟我一起去看直播送礼物，福利多多！",
                "title": "悄悄送你一个礼物，快打开看看吧！"
            };
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
                        me.wxIsReady = true;
                    }
                });
                wx.hideOptionMenu();
                me.showMenuList(H.lottery.wxData);
            });
            wx.error(function(res){
                me.wxIsReady = false;
                if (me.loadWXconfig == 0) {
                    setTimeout(function(){
                        me.loadWXconfig--;
                        H.jssdk.init();
                    }, 6000);
                }
            });
        },
        wxConfig: function(){
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'mp/jsapiticket' + dev,
                data: {appId: mpappid},
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
                            appId: mpappid,
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
        //朋友圈
        menuShare: function(wxData) {
            var me = this;
            wx.onMenuShareTimeline({
                title: wxData.title,
                desc: wxData.desc,
                link: wxData.link,
                imgUrl: wxData.imgUrl,
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
        //分享给好友
        menuToFriend: function(wxData) {
            var me = this;
            wx.onMenuShareAppMessage({
                title: wxData.title,
                desc: wxData.desc,
                link: wxData.link,
                imgUrl: wxData.imgUrl,
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
        showMenuList: function(wxData) {
            var me = this;
            wx.showMenuItems({
                menuList: [
                    "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:favorite",
                    "menuItem:copyUrl",
                    "menuItem:share:email"
                ],
                success:function (res) {
                    me.menuToFriend(wxData);
                    me.menuShare(wxData);
                },
                fail:function (res) {
                }
            });
        },
        shareSuccess: function() {
            recordUserOperate(openid, "分享给好友", "shareToFriends");
        },
        shareFail: function() {
        }
    };

    W.callbackSplitSendHandler = function (data) {
        if(data.code == 0){
            $(".btn-box").css("opacity","1");
            H.lottery.ssid = data.sid;
            getResult('api/split/left',{sid:H.lottery.ssid},'callbackSplitLeftHandler');
            $(".toshare").tap(function(e){
                e.preventDefault();
                //window['shaketv'] && shaketv.wxShare(
                //    H.lottery.share_img?H.lottery.share_img:share_img,
                //    "悄悄送你一个礼物，快打开看看吧！",
                //    "好东西就要和朋友一起分享，跟我一起去看直播送礼物，福利多多！",
                //    getNewUrl(openid)
                //);
                H.lottery.btn_animate($(this));
                $(".share-tips").removeClass('none');
                setTimeout(function () {
                    $(".share-tips").one("click",function () {
                        $(this).addClass('none');
                    });
                },500);
            });
        }
    };
    W.callbackSplitRecordHandler = function (data) {
        if(data.code == 0){
            //H.lottery.fillshare(data.self);
            H.lottery.fillshare(data.items);
        }
    };
    W.callbackSplitLeftHandler = function (data) {
        if(data.code == 0){
            if(parseInt(data.c)>0){
                $(".touse").css("opacity","1").tap(function(e){
                    e.preventDefault();
                    H.lottery.btn_animate($(this));
                    shownewLoading();
                    setTimeout(function () {
                        window.location.href = "http://statics.holdfun.cn/fandom/ysry/live-list.html?guid=50de9bdeba5c4faebaae6dff9837f996";
                    },500);
                });
                H.lottery.drawlottery(H.lottery.ssid);
            }else{
                showTips('奖品已经被领完啦，参与摇电视互动试试看吧！');
            }
        }
    };
    W.callbackLinesDiyInfoHandler = function (data) {
        if(data.code == 0){
            H.lottery.share_img = data.gitems[0].ib;
            H.lottery.wxData = {
                "imgUrl": H.lottery.share_img?H.lottery.share_img:share_img,
                "link": getNewUrl(openid),
                "desc": "好东西就要和朋友一起分享，跟我一起去看直播送礼物，福利多多！",
                "title": "悄悄送你一个礼物，快打开看看吧！"
            };
            H.lottery.menuToFriend(H.lottery.wxData);
            H.lottery.menuShare(H.lottery.wxData);
        }
    };
})(Zepto);

$(function() {
    H.lottery.init();
    H.jssdk.init();
});