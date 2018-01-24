(function($) {
	H.split = {
        sau:getQueryString("sau"),
        wxCheck : false,
        isError : false,
        haveRecord : true,
        havaLeft : true,
        init: function () {
            shownewLoading();
            var me = this;
            me.event();
            if(me.sau){
                me.init_userinfo();
                me.left_num();
                me.receive_record();
            }else{
                toUrl("index.html");
            }
        },
        event: function () {
            $("#back").click(function(){
                toUrl("index.html");
            });
        },
        init_userinfo : function(){
            $(".head").attr("src",headimgurl? headimgurl : 'images/avatar.jpg');
            $(".username").text(nickname? nickname : "匿名用户");
            $(".content").removeClass("none");
        },
        left_num : function(){
            var me = this;
            getResult("api/split/left",{
                sid : me.sau
            },"callbackSplitLeftHandler");
        },
        receive_record : function(){
            var me = this;
            getResult("api/split/record",{
                sid : me.sau,
                oi : openid
            },"callbackSplitRecordHandler",true);
        },
        lottery : function(){
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck4Split' + dev,
                data: { oi: openid,sau : me.sau },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryluck4SplitHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        me.thanks();
                    }
                    if(data.result){
                        $("#redleft").text($("#redleft").text() * 1 - 1);
                        if(data.pt == 17){
                            me.thanks();
                        }else{
                            me.fill(data);
                        }
                    }else{
                        me.thanks();
                    }
                },
                error : function() {
                    me.thanks();
                }
            });
        },
        thanks : function(){
            $(".rednum").text("别灰心，金子迟早会到碗里来！");
            $(".rednum").removeClass("none");
        },
        fill : function(data){
            $("#chai").removeClass("none");
            $(".rednum").removeClass("none");
            $("#mop").addClass("mop");
            $("#chai").click(function(){
                if(data.pt == 1){
                    H.dialog.shiwuLottery.open(data);
                }else if(data.pt == 7){
                    H.dialog.wxcardLottery.open(data);
                }
            });
        },
        wxConfig: function() {
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
                        //权限校验
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr:nonceStr,
                            signature:signature,
                            jsApiList: [
                                "addCard",
                                "checkJsApi"
                            ]
                        });
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        }
    };

    W.callbackSplitRecordHandler = function(data){
        if(data.code == 0){
            // 加载其他人的中奖纪录
            if(data.items && data.items.length > 0){
                var t = simpleTpl();
                for(var i = 0;i < data.items.length; i++){
                    var item = data.items[i];
                    t._('<li>')
                        ._('<img src="'+(item.hu? item.hu : 'images/avatar.jpg')+'">')
                        ._('<p class="username">'+(item.nn? item.nn : '匿名用户')+'</p>')
                        ._('<p class="desc">'+item.msg+'</p>')
                        ._('<p class="redenv">'+item.pn+'</p>')
                        ._('</li>');
                }
                $("#record").html(t.toString());
            }

            if(data.self && data.self.length > 0){
                // 本人已经抽过奖
                $(".rednum").text("贪心会变胖的哦！");
                $(".rednum").removeClass("none");
            }else{
                // 本人没有参与
                // 抽奖
                if(H.split.wxCheck && H.split.havaLeft){
                    H.split.lottery();
                }else{
                    H.split.thanks();
                }
            }
        }else{
            H.split.haveRecord = false;
            // 抽奖
            if(H.split.wxCheck && H.split.havaLeft){
                H.split.lottery();
            }else{
                H.split.thanks();
            }
        }
    };

    W.callbackSplitLeftHandler = function(data){
        if(data.code == 0){
            if(data.c > 0){
                $("#redleft").text(data.c);
            }else{
                H.split.havaLeft = false;
                $(".redleft").text("红包都被瓜分了，一个也没剩");
            }
            $(".redleft").removeClass("none");
        }else{
            H.split.havaLeft = false;
            $(".redleft").text("红包都被瓜分了，一个也没剩");
            $(".redleft").removeClass("none");
        }
        if(!H.split.havaLeft && !H.split.haveRecord){
            // 既没有中奖纪录也没有领取次数
            // 造假数据
            var t = simpleTpl();
                t._('<li>')
                    ._('<img src="images/7.jpg">')
                    ._('<p class="username">有一颗土豆</p>')
                    ._('<p class="desc">客观留步，这里有黄金万两</p>')
                    ._('<p class="redenv">转运珠</p>')
                    ._('</li>');
            $("#record").html(t.toString());
        }
    };
})(Zepto);

$(function() {
    H.split.wxConfig();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.split.isError){
                    H.split.wxCheck = true;
                    //wx.config成功
                    H.split.init();
                }
            }
        });
    });

    wx.error(function(res){
        H.split.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});