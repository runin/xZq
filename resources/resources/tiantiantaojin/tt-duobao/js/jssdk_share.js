(function($) {
    H.jssdk = {
        wxConfig: function() {
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
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem', 'hideMenuItems', 'showMenuItems', 'hideOptionMenu', 'showOptionMenu']
                    });
                    
                },
                error: function(xhr, type) {
                    // alert('获取微信授权失败！');
                }
            });
        },
        // 分享给朋友
        menuToFriend: function() {
            var me = this;
            var timestamp = new Date().getTime();
            wx.onMenuShareAppMessage({
                title: "有土豪发礼券，快抢！",
                desc: "抢完礼券夺好货，iphone只需一元闪亮夺到手！",
                link: share_url.substr(0,share_url.indexOf('html/'))+"redshare.html?timestamp="+timestamp+"&shareOpenid="+hex_md5(openid)+"&resopenid="+hex_md5(openid),
                imgUrl:"http://cdn.holdfun.cn/tttj/mpAccount/resources/images/2016/02/26/787f8423704b457db69a4d8eb0079314.jpg",
                success: function(res) {
                    $(".modal").addClass("none");
                    wx.hideAllNonBaseMenuItem();
                    getResult("user/share/log/add",{appId:busiAppId,openId:openid,operateType:state},"callbackAddUserShareLogHandler");
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
        showMenuList:function()
        {
            var me = this;
            // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
            wx.showMenuItems({
                menuList: [
                    "menuItem:share:appMessage",
                ],
                success:function (res) {
                    me.menuToFriend();
                },
                fail:function (res) {
                    //alert(JSON.stringify(res));
                },

            });
        }
    }  
})(Zepto);

$(function() {
   H.jssdk.wxConfig(); 
   wx.ready(function() {
        wx.hideOptionMenu();
        H.jssdk.showMenuList();
    });
});