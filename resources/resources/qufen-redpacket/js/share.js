+(function() {
    var openid = $.fn.cookie(KEY_OPENID);
    var baseOpenid = $.fn.cookie(KEY_BASEOPENID);
    var codeOpenid = $.fn.cookie(window.mpAppId + "_codeOpenid");
    var headimgurl = $.fn.cookie(KEY_HEAD_IMG);
    var nickname = $.fn.cookie(KEY_NICKNAME);
    var shareOpenid = getQueryString("shareOpenid");
    var href = location.href;
    href = add_param(href, 'userUuid', null, true);
    href = add_param(href, 'codeUserUuid', null, true);
    href = add_param(href, 'nickname', null, true);
    href = add_param(href, 'headimgurl', null, true);
    href = add_param(href, 'shareOpenid', null, true);
    href = add_param(href, 'sharenickname', null, true);
    href = add_param(href, 'shareheadimgurl', null, true);
    href = add_param(href, 'fromms', null, true);
    href = add_param(href, 'rid', null, true);
    href = add_param(href, 'isShare', null, true);
    if (href.indexOf("index.html") != -1) {
        href = href.substring(0, href.split("?")[0].lastIndexOf("/")) + "/getpacket.html?shareOpenid=" + openid + "&sharenickname=" +
            encodeURIComponent(nickname) + "&shareheadimgurl=" + encodeURIComponent(headimgurl);
    } else if (href.indexOf("getpacket.html") != -1) {
        if (shareOpenid == openid) { //自己的
            href = location.href;
        } else { //他人的
            href = href.substring(0, href.split("?")[0].lastIndexOf("/")) + "/metoosend.html?snickname=" + encodeURIComponent(nickname) + "&sheadimgurl=" + encodeURIComponent(headimgurl);
        }
    } else {
        href = location.href;
    }
    href = add_param(href, 'resopenid', baseOpenid, true);

    if (window.rid) {
        href = add_param(href, 'rid', window.rid);
    }
    href = add_param(href, 'isShare', "1");
    window.share_title = "答题红包";
    window.share_desc = "快开玩吧";
    window.share_img = "http://cdn.holdfun.cn/resources/images/2016/02/24/b9a890d7d71640d9af92fd9714282782.jpg";

    function shareOpeater() {
        var appid = "wx44594ea0f94677ae"; //正式的
        var ou = '4e15301d547e41e3a88ce1e25e0d2b52';//正式的
        if (domain_url.indexOf("test.holdfun.cn") != -1) { //测试的
            appid = "wxc5d930ea846a40e1";
             ou  = "11111111111111111111111111111111";
        }
        $.ajax({
            type: 'GET',
            url: domain_url + 'api/weixin/auth/jsapiticket',
            data: {
                ou: ou
            },
            async: true,
            dataType: 'jsonp',
            jsonpCallback: 'callbackJsapiTicketHandler',
            success: function(data) {
                if (data.code == 1) {
                    return;
                }
                var nonceStr = 'da7d7ce1f499c4795d7181ff5d045760',
                    timestamp = Math.round(new Date().getTime() / 1000),
                    shareurl = window.location.href.split('#')[0],
                    signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + shareurl);

                wx.config({ 
                    appId: appid,
                    timestamp: timestamp,
                    nonceStr: nonceStr,
                    signature: signature,
                    jsApiList: [
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone',
                        'hideMenuItems'
                    ]
                });
                wx.ready(function() {
                    wx.onMenuShareAppMessage({ //发送到朋友
                        title: share_title,
                        desc: share_desc,
                        link: href,
                        imgUrl: share_img,
                        success: function() {

                        }
                    });
                    if (location.href.indexOf("getpacket.html") != -1) {
                        if (shareOpenid == openid) {} else {

                        }
                    }
                    if (location.href.indexOf("index.html") != -1) {
                        window.indexShareFn = function(rid, name, question) {
                            href = add_param(href, 'rid', rid);
                            wx.onMenuShareAppMessage({ //发送到朋友
                                title: "问：" + question, //(name||"好友")+share_title,
                                desc: share_desc, //share_desc+(question||""),
                                link: href,
                                imgUrl: share_img,
                                success: function() {}
                            });
                        }
                        if (window.index_fromms && window.index_rid && window.index_obj) {
                            window.indexShareFn(window.index_rid, window.nickname, window.index_qc);
                            window.index_obj.$popwin.removeClass("none");

                        }
                    }
                    wx.hideMenuItems({
                        menuList: [
                            'menuItem:share:timeline', // 分享到朋友圈
                            'menuItem:share:qq', //分享到qq
                            'menuItem:share:weiboApp', //分享到微博
                            'menuItem:favorite', //收藏
                            'menuItem:openWithQQBrowser', //在QQ浏览器中打开
                            'menuItem:openWithSafari', //在Safari中打开
                            'menuItem:exposeArticle' //举报
                        ],
                        success: function(res) {
                            //alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
                        },
                        fail: function(res) {
                            //alert(JSON.stringify(res));
                        }
                    });
                });
            },
            error: function(xhr, type) {
                // alert('获取微信授权失败');
            }
        });
    };
    loadData({
        url: domain_url + "api/system/shareinfo",
        callbackShareInfoHandler: function(data) {
            if (data.code == 0) {
                share_title = data.stitle;
                share_desc = data.sdesc;
                // share_img = data.simg;
                shareOpeater();
            } else {
                shareOpeater();
            }
        },
        data: {
            op: openid,
            cop: codeOpenid,
            sid: "c65780da126b416ab09ba93e0f36f4c9"
        },
        error: function() {
            shareOpeater();
        }
    })
})();
