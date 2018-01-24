(function($) {
    H.jssdk = {
        init: function(wxData) {
            this.wxConfig(wxData);
        },
        useLog: function() {
            onpageload();
        },
        wxConfig: function(wxData) {
            var me = this;
            $.ajax({
                type: "GET",
                url: business_url + "wx/apiTicket/" + busiAppId + "/jsapi",
                data: {},
                async: true,
                dataType: "jsonp",
                jsonpCallback: "ApiTicketCallBackHandler",
                success: function(data) {
                    if (!data.result) {
                        return;
                    }
                    var timestamp = Math.round(new Date().getTime() / 1000),
                        nonceStr = "df51d5cc9bc24d5e86d4ff92a9507361",
                        url = window.location.href.split('#')[0],
                        signature = hex_sha1("jsapi_ticket=" + data.apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url);
                    wx.config({
                        debug: false,
                        appId: busiAppId,
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: ["chooseCard", "openCard", 'onMenuShareTimeline', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem','onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems', 'hideOptionMenu', 'showOptionMenu']
                    });
                    wx.ready(function() {
                        //me.wxChooseCard();
                        //me.hideMenuList();
                        wx.hideOptionMenu();
                        //wx.hideAllNonBaseMenuItem();
                        me.showMenuList(wxData);
                        
                    });
                },
                error: function(xhr, type) {
                    // alert('获取微信授权失败！');
                }
            });
        },
        //分享朋友圈
        menuShare: function(wxData) {
            wx.onMenuShareTimeline({
                title: wxData.title,
                link: wxData.link,
                imgUrl: wxData.imgUrl,
                trigger: function(res) {
                    // alert('用户点击分享到朋友圈');
                },
                success: function(res) {
                    //alert(wxData.link);
                    // alert('已分享');
                },
                cancel: function(res) {
                    // alert('已取消');
                },
                fail: function(res) {
                    alert(JSON.stringify(res));
                }
            })
        },
        // 分享给朋友
        menuToFriend: function(wxData) {
            wx.onMenuShareAppMessage({
                title: wxData.title,
                desc: wxData.desc,
                link: wxData.link,
                imgUrl: wxData.imgUrl,
                success: function(res) {
                    // alert('已分享');
                }
            });
        },
        hideMenuList:function()
        {
            // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
            wx.hideMenuItems({
                menuList: [
                    // "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:share:qq",
                    "menuItem:copyUrl",
                    "menuItem:openWithQQBrowser",
                    "menuItem:openWithSafari",
                    "menuItem:share:email"
                ],
                success:function (res) {
                    //alert("隐藏成功");
                },
                fail:function (res) {
                    //alert(JSON.stringify(res));
                },

            });
        },
        showMenuList:function(wxData)
        {
            var me = this;
            // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
            wx.showMenuItems({
                menuList: [
                    "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:favorite"
                ],
                success:function (res) {
                    me.menuToFriend(wxData);
                    me.menuShare(wxData);
                    //alert("显示成功");
                },
                fail:function (res) {
                    //alert(JSON.stringify(res));
                },

            });
           
        }
    }    
})(Zepto);

// $(function() {
//     H.jssdk.init(wxData);
// });