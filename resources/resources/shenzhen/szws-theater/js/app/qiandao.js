var qiandao = $(".qiandao");
var qduid ="";
(function($) {
    H.qiandao = {
        light_position: 0,
        init: function() {
            //getResult("api/linesdiy/info",{},"callbackLinesDiyInfoHandler",false); 
            this.init_dom();
            this.signTime();
            this.myrecord_sign();
            this.event();
        },
        init_dom: function() {
            var height = $(window).height(),
                width = $(window).width();
            $('body').css({
                'width': width,
                'height': height
            });
            $('.headimgurl img').attr('src', headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/danmu-head.jpg');
            $('.nikename').text(nickname ? nickname : '匿名观众');
        },
        //获取签到活动
        signTime: function() {
            getResult("api/common/time", {}, "commonApiTimeHandler", false);
        },
        //获取签到记录
        myrecord_sign: function() {
            getResult("api/sign/myrecord", {
                yoi: openid
            }, "callbackSignMyRecordHandler", true);
        },
        light_print: function(data) {
            var t = simpleTpl();
            for (var k = 1; k <= 5; k++) {

                t._('<ul class="round round' + k + '">');
                for (var j = 1 + 6 * (k - 1); j <= 6 * k; j++) {
                    t._('<li class="light' + j + '"></li>');
                }
                t._('</ul>');
            }

            $(".qian-round").append(t.toString());

            for (var i = 1; i <= data; i++) {
                $(".light" + i).css({
                    "background": "#ff568f",
                    "border-color": "#ffcfdf"
                });
            }
            H.qiandao.light_position = data;
        },
        event: function() {

            $('.l').on("click", function() {
                toUrl("talk.html");
            })
        }
    };
    W.commonApiTimeHandler = function(data) {
        if (data == undefined) {
            
        } else {
            serverT = data.t;
            getResult("api/sign/round",{},"callbackSignRoundHandler", false);
        }
    }
    W.callbackSignRoundHandler = function(data) {
        // shownewLoading();
        if (data.code == 0) {
            for (var i = 0;
                (i <= data.items.length - 1); i++) {
                var st = timestamp(data.items[i].st);
                var et = timestamp(data.items[i].et);
                if ((serverT > st) && (serverT < et)) {
                    qduid = data.items[i].uid;
                    $.ajax({
                        type: "GET",
                        url: domain_url + "api/sign/issign" + dev,
                        dataType: "jsonp",
                        jsonp: "callback",
                        jsonpCallback: callbackSignIsHandler,
                        async: false,
                        data: {
                            yoi: openid,
                            auid: qduid
                        },
                        error: function() {
                            //alert("请求数据失败，请刷新页面");
                        }
                    });
                }
            }
            if(qduid == "")
            {
                qiandao.css({
                        "background": '#B3637E',
                        "color": "#6f6f6f",
                        "display": "block"
                    }).on("click", function() {
                        showTips("活动未开始");
                });
            }
        } else {
            qiandao.css({
                    "background": '#B3637E',
                    "color": "#6f6f6f",
                    "display": "block"
                }).on("click", function() {
                    showTips("活动未开始");
            });
        };
    };

    W.callbackSignIsHandler = function(data) {
        if (data == undefined) {

        } else {
            hidenewLoading();
            if (data.result == true) {
                qiandao.css({
                    "background": '#B3637E',
                    "color": "#6f6f6f",
                    "display": "block"
                }).on("click", function() {
                    showTips("已签到");
                });

            } else if (data.result == false) {
                qiandao.css({
                    "display": "block"
                }).on("click", function() {
                    shownewLoading();
                    $.ajax({
                        type: "GET",
                        url: domain_url + "api/sign/signed" + dev,
                        dataType: "jsonp",
                        jsonp: "callback",
                        jsonpCallback: callbackSignSignedHandler,
                        async: false,
                        data: {
                            yoi: openid,
                            auid: qduid
                        },
                        error: function() {
                            //alert("请求数据失败，请刷新页面");
                        }
                    });
                });
            }
        }
    }
    W.callbackSignSignedHandler = function(data) {
        if (data == undefined) {

        } else {
            if (data.code == 0) {
                hidenewLoading();
                if (data.signVal == undefined) {

                } else {
                    $(".rank-tips").html('签到成功,恭喜您获得' + data.signVal + '个积分').removeClass("none");
                    qiandao.css({
                        "background": '#B3637E',
                        "color": "#6f6f6f",
                        "display": "block"
                    }).off();
                    qiandao.text("已签到");
                    var light = ".light" + (H.qiandao.light_position + 1);
                    $(light).css({
                        "background": "#ff568f",
                        "border-color": "#ffcfdf"
                    });
                }
            } else if (data.code == 2) {

            }
        }
    }
    W.callbackSignMyRecordHandler = function(data) {
        if (data.code == 0) {
            H.qiandao.light_print(data.items.length);
        }
        else
        {
            H.qiandao.light_print(0);

        }
    }
})(Zepto);
$(function() {
    H.qiandao.init();
});
