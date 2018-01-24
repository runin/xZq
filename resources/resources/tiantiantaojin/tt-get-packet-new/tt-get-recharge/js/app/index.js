 var wxData = {
     "appId": busiAppId,
     "imgUrl": share_img,
     "link": window.location.href.split("#")[0],
     "desc": share_desc,
     "title": share_title
 };
 (function($) {
     H.index = {
         init: function() {
             var height = $(window).height();
             var width = $(window).width();
             $("body").css({
                 "height": height,
                 "width": width
             });
             this.event();
             this.useLog();
             this.getCardId();
             this.wxConfig();
         },
         useLog: function() {
             onpageload();
         },
         event: function() {
             // $("#btn-join").click(function(e) {
             // });
         },
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
                         jsApiList: ["chooseCard", "openCard", 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems', 'hideOptionMenu', 'showOptionMenu']
                     });
                     
                 },
                 error: function(xhr, type) {
                     alert('获取微信授权失败！');
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
                 success: function(res) {}
             });
         },
         //获得卡卷信息
         getCardId: function() {
             getResult("wx/getCardId", {kind: 2 }, "cardIdCallBackHandler", true);
         },
         //拉起卡卷信息
         wxChooseCard: function(cardId) {
             getResult("wx/cardInfo1/" + busiAppId + "/" + cardId, {}, "cardInfo1CallBackHandler", false);
         },
         hideMenuList: function() {
             // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
             wx.hideMenuItems({
                 menuList: [
                     "menuItem:share:appMessage",
                     "menuItem:share:timeline",
                     "menuItem:share:qq"
                 ],
                 success: function(res) {
                     //alert("隐藏成功");
                 },
                 fail: function(res) {
                     //alert(JSON.stringify(res));
                 },

             });
         }
     }
     W.cardIdCallBackHandler = function(data) {
         if(data.result) {
             if (data.cardId) {
                 wx.ready(function() {
                     H.index.wxChooseCard(data.cardId);
                 });
             }
         } else {
            showTips("网络不好哟!");
         }
     };
     //拉起卡卷列表
     W.cardInfo1CallBackHandler = function(data) {
         if (data.result) {
             var timestamp = data.message.timestamp;
             var nor_sr = data.message.nonr_str;
             var sigature = data.message.signature;
             var cardId = data.message.cardId;
             //拉起卡卷列表
             $("#btn-join").bind("click", function() {
                 $("#btn-join").css({
                     "-webkit-animation-name": "rotateOut",
                     "-webkit-animation-iteration-count": "1",
                     "-webkit-animation-duration": ".6s"
                 });
             });
             $("#btn-join").on("webkitAnimationEnd", function() {
                 $("#btn-join").css({
                     "-webkit-animation": ""
                 });
                 //核销卡卷
                 wx.chooseCard({
                     timestamp: timestamp, // 卡券签名时间戳
                     nonceStr: nor_sr, // 卡券签名随机串
                     cardSign: sigature, // 卡券签名
                     cardId: cardId, // 卡券签名
                     success: function(res) {
                         var cardInfo = JSON.parse(res.cardList);
                         var code = cardInfo[0].encrypt_code; //获取用户卡卷code
                         getResult("wx/recharge", {
                             appId: busiAppId,
                             openId: openid,
                             code: encodeURIComponent(code)
                         }, "rechargeCallBackHandler", false);
                     }
                 });
             });
             //拉起卡卷结束
         } else {
             showTips("获取卡卷信息失败");
         }
     };
     W.rechargeCallBackHandler = function(data) {
         if (data.result) {
             showTips("充值金币成功!");
         } else {
             showTips(data.message);
         }
     };
 })(Zepto);

 $(function() {
     H.index.init();
     wx.ready(function() {
        H.index.hideMenuList();
    });
 });
