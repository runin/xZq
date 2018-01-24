(function($) {
    H.newactive = {
        $index_ok: $("#index-ok"),
        $gift_ok: $("#gift-ok"),
        $award_ok: $("#award-ok"),
        init: function() {
            var wid = $(window).width();
            var height = $(window).height();
            var lef = (wid - 88) / 2;
            var imgrdw = (wid - 20);
            $("body").css({
                "width": wid,
                "height": height
            });
            $(".record-infor").css({
                "width": wid * 0.8,
                "margin-left": -wid * 0.4
            });

            var me = this;
            //调用用户日志
            me.userlog();
            //调用ajax 加载数据
            me.DataShow();
            //触发的跳转事件
            me.event();
            //页面的规则
            me.ruleinfo();
        },
        //调用ajax 加载数据
        DataShow: function() {

            var keypass = "";
            $("#index-ok").click(function() {

                if ($(this).hasClass('botton-ok')) {
                    //获取口令密码并加密
                    keypass = encodeURI($(".input-entry").val());
                    if ($.trim(keypass) == "") {
                        showTips("亲，你没有输入额!");
                    } else {
                        //获取服务器请求
                        getResult("robe/redpack/lottery", {
                            appId: busiAppId,
                            openId: openid,
                            key: keypass
                        },
                        'callBackLotteryHandler', true, $('body'));
                        $(this).removeClass('botton-ok').addClass('botton-ok-after');
                    }
                };
            });
        },

        //抽奖请求
        awardsucess: function() {
            $(".rockpacket-section").removeClass("none");
            setTimeout("locationUrl('award')", 2000);
            //中奖跳转页面        
        },
        //错误处理
        awarderror: function(step) {
            //alert(step);
            switch (step) {
            case 2:
                H.dialog.rule.open();
                $('.rule-dialog h3').text("活动不存在");
                $('.rule-dialog h4').text("先参与天天淘金其他活动吧!");
                break;
            case 3:
                H.dialog.rule.open();
                $('.rule-dialog h3').text("红包密码错误 ");
                $('.rule-dialog h4').text("先参与天天淘金其他活动吧!");
                break;
            case 4:
                H.dialog.rule.open();
                $('.rule-dialog h3').text("活动还没有开始");
                $('.rule-dialog h4').text("先参与天天淘金其他活动吧!");
                break;
            case 5:
                H.dialog.rule.open();
                $('.rule-dialog h3').text("你已经参与过今天的活动了");
                $('.rule-dialog h4').text("先参与天天淘金其他活动吧!");
                break;
            case 6:
                H.dialog.rule.open();
                $('.rule-dialog h3').text("已领取红包");
                $('.rule-dialog h4').text("先参与天天淘金其他活动吧!");
                break;
            case 7:
                H.dialog.rule.open();
                $('.rule-dialog h3').text("红包被领光了");
                $('.rule-dialog h4').text("先参与天天淘金其他活动吧!");
                setTimeout("locationUrl('gift')", 2000);
                //不中奖跳转页面 
                break;
            case 8:
                showTips("亲，您的微信授权失败");
                $('#index-ok').removeClass('botton-ok-after').addClass('botton-ok');
                // H.dialog.rule.open();
                // $('.rule-dialog h3').text("微信认证");
                // $('.rule-dialog h4').text("先参与天天淘金其他活动吧!");
                //不中奖跳转页面 
                break;
            }          
        },
        //获取公告信息
        ruleinfo: function() {
            getResult("robe/redpack/info/" + busiAppId + "/10", {},
            'callBackLotteryInfoHandler', true);
        },
        //中奖跳转
        event: function() {
            $("#award-ok").click(function(e) {
                e.preventDefault();

                getResult("robe/redpack/award?openId=" + openid + "&appId=" + busiAppId, {},
                'callBackAwardHandler', true);
            });

            $("#gift-ok").click(function(e) {
                e.preventDefault();
                window.location.href = "http://m.dianping.com/thirdlogin/auth?aType=1&np=2&rurl=http%3a%2f%2fevt.dianping.com%2fbonus%2fyyy%2fbonus.html";
            });
        },
        //用户日志
        userlog: function() {
            onpageload();
        }
    }

    //抽红包
    W.callBackLotteryHandler = function(data) {

        if (data.code == 0) {
            H.newactive.awardsucess();
        } else {
            H.newactive.awarderror(data.err_code);
        }
    }
    //中奖页面
    W.callBackAwardHandler = function(data) {
        if (data.code == 0) {
            window.location.href = "./index.html";

        } else {
            window.location.href = "./index.html";
        }
    }
    //公告介绍
    W.callBackLotteryInfoHandler = function(data) {
        if (data.code == 0) {
            $(".con-htm").html(data.message);
        } else {
            showTips("亲，等了你好久了，在等等吧");
        }
    }

})(Zepto);

$(function() {
    H.newactive.init();
});

function locationUrl(url) {
    window.location.href = "./" + url + '.html';
}