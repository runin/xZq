(function($) {
    H.jssdk = {
        wxIsReady: false,
        loadWXconfig: 5,
        init: function(){
            this.wxConfig();
        },
        initShare: function (share_desc, share_title) {
            var me = this,share_desc = '', share_title = '';
            switch ($("body").attr("data-type")){
                case 'index':
                    share_desc = '这里有个超级厉害的比赛，你要了解一下嘛';
                    share_title = '【易赛】'+ (H.index.name || '易赛') +'开始报名啦!';
                    break;
                case 'event-details':
                    share_desc = '超详细的比赛资料图，请仔细观看哟~';
                    share_title = '【易赛】'+ (getData('eventDetailsName') || '易赛')  +'赛事详情';
                    break;
                case 'product':
                    share_desc = '快来跟大家玩音乐~';
                    share_title = '【易赛】音乐赛事专家，超多国内外音乐赛事~';
                    break;
                case 'diploma':
                    share_desc = '想知道我的奖状长啥样~点开看啦~';
                    share_title = 'hi,我获的了'+ (H.diploma.cpname || '易赛') +'的'+ (H.diploma.awname || '好名次') +'啦~';
                    break;
                case 'user':

                    if(H.user.type == 'child') {
                        share_desc = H.user.childFirst;
                        share_title = 'hi，这是'+ (H.user.username || '易赛') +'在易赛的个人主页,快来看看吧~';
                    }else if(H.user.type == 'teacher') {
                        share_desc = H.user.resume;
                        share_title = 'hi，这是'+ (H.user.username || '易赛') +'老师的个人主页,快来看看吧~';
                    }else if(H.user.type == 'organization') {
                        share_desc = H.user.institutionFirst;
                        share_title = 'hi，这是我在易赛的主页，快来看看吧~';
                    }

                    break;
                case 'works':
                    share_desc = '成绩公布啦,快来看看成绩吧~';
                    share_title = '【易赛】'+ (H.works.cpname || '易赛') +'排行榜';
                    break;
                case 'works-details':
                    share_desc = '刚刚分享的新作品，快来看看吧~';
                    if(H.worksDetails.title){
                        share_title = 'hi,我在易赛上面发布了新作品《'+ H.worksDetails.title +'》';
                    }else{
                        share_title = 'hi,我在易赛上面发布了新作品';
                    }

                    break;
                default:
                    break;
            }
            shareData = {
                "imgUrl": 'http://cdn.holdfun.cn/lottery/prize/images/201741/44415947868643dd9aece6cd626dcd0e.png',
                "link": location.href,
                "desc": share_desc,
                "title": share_title
            };
            H.jssdk.menuToFriend(shareData);
            H.jssdk.menuShare(shareData);
            H.jssdk.ShareQQ(shareData);
            H.jssdk.ShareQZone(shareData);
        },
        wxConfig: function(){
            $.ajax({
                type: 'GET',
                async: true,
                url: 'https://yaotv.holdfun.cn/portal/' + 'mp/jsapiticket' + dev,
                data: {appId: mpappid},
                dataType: "jsonp",
                jsonpCallback: 'callbackJsapiTicketHandler',
                timeout: 1e4,
                complete: function() {},
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
                                'startRecord',
                                'stopRecord',
                                'onVoiceRecordEnd',
                                'playVoice',
                                'stopVoice',
                                'pauseVoice',
                                'onVoicePlayEnd',
                                'uploadVoice',
                                'downloadVoice',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'hideAllNonBaseMenuItem',
                                'onMenuShareQQ',
                                'onMenuShareQZone',
                                'onMenuShareWeibo',
                                'hideMenuItems',
                                'showMenuItems',
                                'hideOptionMenu',
                                'showOptionMenu',
                                'addCard'
                            ],
                            success: function (res) {
                                H.jssdk.initShare();
                        }
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
        ShareQQ: function () {
            var me = this;
            wx.onMenuShareQQ({
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
        ShareQZone: function () {
            var me = this;
            wx.onMenuShareQZone({
                title: shareData.title,
                desc: shareData.desc,
                link: shareData.link,
                imgUrl: shareData.imgUrl,
                success: function () {
                    me.shareSuccess();
                },
                cancel: function () {
                    me.shareFail();
                },
                fail: function(res) {
                    me.shareFail();
                }
            });
        },
        shareSuccess: function() {},
        shareFail: function() {}
    };
})(Zepto);

$(function() {
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'hideAllNonBaseMenuItem',
                'onMenuShareQQ',
                'onMenuShareQZone',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideOptionMenu',
                'showOptionMenu',
                'addCard'
            ],
            success: function (res) {
                H.jssdk.wxIsReady = true;
               /* H.jssdk.menuShare();
                H.jssdk.menuToFriend();*/
                H.jssdk.initShare();
            }
        });

        //wx.config成功
    });
    wx.error(function(res){
        H.jssdk.wxIsReady = false;
        if (H.jssdk.loadWXconfig != 0) {
            setTimeout(function(){
                H.jssdk.loadWXconfig--;
                H.jssdk.init();
            }, 5e3);
        }
    });
});