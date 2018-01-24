
$(function () {
    var W = window;
    ; (function () {//工具类
        W.loadData = function (param) {
            W.showLoading();
            var p = $.extend({ url: "", type: "get", async: false, cache: false, dataType: "jsonp", jsonp: "callback" }, param);
            var connt = 0;
            var cbName = "";
            var cbFn = null;
            for (var i in param) {
                connt++;
                if (connt == 2) {
                    cbName = i;
                    cbFn = param[i];
                    break;
                }
            }
            if (cbName && cbFn && !W[cbName]) { W[cbName] = cbFn; }
            $.ajax({ type: p.type, async: p.async, url: p.url, dataType: p.dataType, jsonp: p.jsonp, jsonpCallback: cbName,
                success: function () {
                    W.hideLoading();
                },
                error: function () {
                    if (param.error) { param.error() };
                    W.hideLoading();
                }
            });
        }
        W.showPage = function (pageName, fn) {
            $(".cover").addClass("none");
            $(".main-contain").addClass("none");

            if (pageName == "cover") {//首页
                $(".cover").removeClass("none");
                $(".main-contain").addClass("none");
                if (fn) {
                    fn();
                }
                return;
            }
            if (pageName == "main-contain") {//主页
                $(".cover").addClass("none");
                $(".main-contain").removeClass("none");
                if (fn) {
                    fn();
                }
                return;
            }
        }
    })();
    ; (function () {//一键关注

        window['shaketv'] && shaketv.subscribe(weixin_appid, function (returnData) { });
    
    })()
    ; (function ($) {//节目预约
        H.index = {
            $btnReserve: $('#btn-reserve'),
            init: function () {
                this.event();
                this.prereserve();
            },
            // 检查该互动是否配置了预约功能
            prereserve: function () {
                var me = this;
                $.ajax({
                    type: 'GET',
                    async: true,
                    url: domain_url + 'program/reserve/get',
                    data: {},
                    dataType: "jsonp",
                    jsonpCallback: 'callbackProgramReserveHandler',
                    success: function (data) {
                        if (!data.reserveId) {
                            return;
                        }
                        // yao_tv_id: 微信为电视台分配的id
                        window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function (resp) {
                            if (resp.errorCode == 0) {
                                me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId);
                            }
                        });
                    }
                });
            },
            event: function () {
                this.$btnReserve.click(function (e) {
                    e.preventDefault();
                    var reserveId = $(this).attr('data-reserveid');
                    if (!reserveId) {
                        return;
                    }
                    shaketv.reserve(yao_tv_id, reserveId, function (data) { });
                });
            }
        };
        H.index.init();
    })(Zepto);
    ; (function () { //首页逻辑


        showPage("cover");
        W.imgReady(index_bg, function () {//加载首页背景
            $('html').css('background-color', '#250002');
            $('body').css('background-size', document.documentElement.clientWidth + 'px auto');
            $('body').css('background-image', 'url(' + index_bg + ')');
            $('.h-trophy body').css('background-image', 'url(' + trophy_bg + ')');
            $('#tab').removeClass('none').addClass('bounce-in-up');
            imgReady(title_img, function () {
                $('#logo').css('background-image', 'url(' + title_img + ')').addClass('swing');
            });
        });
        loadData({ url: domain_url + "common/time?temp=" + new Date().getTime(), callbackTimeHandler: function (data) {//获取系统时间和设置按钮文字
            W.sysytemTime = data.t; //获取系统时间
            $.ajax({ url: domain_url + "ceremony/period", type: "get", async: false, dataType: "jsonp", jsonp: "callback", jsonpCallback: "callbackPeriodHandler",
                success: function () { }, error: function () { alert("人太多了，稍后再试试呗~") }
            });
        }
        });
        W.callbackPeriodHandler = function (data) {
            if (data.result == 0) {
                $("#stat-btn").text("马上参与");
            } else {//
                if (data.result == -3) {
                    return;
                  //  $("#stat-btn").text("活动没开始");
                } else if (data.result == -4) {
                    //  $("#stat-btn").text("活动已结束");
                    return;
                } else {
                    return;
                }
            }
            $("#stat-btn").removeClass("none");
        }
        $("#stat-btn").click(function () {
            var t = $(this).text();
            if (!t || t == "活动没开始" || t == "活动已结束") {
                return;
            }
            var lastClickTime = parseInt($.fn.cookie("lastClickBoxTime"));
            if (!lastClickTime) {
                showPage("main-contain");
            } else {
                if (W.sysytemTime - time_span < lastClickTime) {//特定的时间间隔
                    W.showDPage();
                    W.downCount(W.sysytemTime, W.sysytemTime + (lastClickTime + time_span - W.sysytemTime));
                } else {
                    showPage("main-contain");
                }
            }
        });
        $(".btn-rule").click(function () {
            loadData({ url: domain_url + "common/rule?temp=" + new Date().getTime(), callbackRuleHandler: function (data) {//获取系统时间和设置按钮文字
                H.dialog.showWin.open("", function () { }, function () { }, function (that) {
                    var arr = [];
                    arr.push('<section class="modal" id="rule-dialog">');
                    arr.push('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dn-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>');
                    arr.push('<div class="dialog rule-dialog"><h2></h2>');
                    arr.push('<div class="content border">');
                    arr.push('<div class="rule">');
                    if (data.rule) {
                        arr.push(data.rule);
                    } else {
                        arr.push("");
                    }
                    arr.push("</div></div>")
                    arr.push('<p class="dialog-copyright">本活动最终解释权归CCTV7频道所有</p></div></section>');
                    return arr.join("");
                });
            }
            });
        });
    })();
    ; (function () {//主页

        $(".told-friends").click(function () {//分享弹层
            $("#share_wrapper").removeClass("none");
        });
        $("#share_wrapper").click(function () {//点击分享层隐藏
            $("#share_wrapper").addClass("none");
        });

        if (localStorage.getItem("hasWinning") == "true") {//中奖之后就显示
            $("#my-award").removeClass("none");
            $("#my-award2").removeClass("none");
        } else {
            $("#my-award").addClass("none");
            $("#my-award2").addClass("none");
        }
        $("#my-award").click(function () {
            loadData({ url: domain_url + "ceremony/mylottery?oi=" + openid + "&temp=" + new Date().getTime(), callbackMylotteryHandler: function (data) {
                H.dialog.showWin.open("抱歉领取不成功！", function (w) {
                    $(".activities-btn", w).text("确定");
                }, function () {//关闭回调

                }, function (that) { //自定义内容
                    var arr = [];
                    arr.push('<section class="modal" id="rule-dialog">');
                    arr.push('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dn-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>');
                    arr.push('<div class="dialog rule-dialog"><div class="award-message">奖品信息</div>');
                    arr.push('<div class="content border">');
                    arr.push('<div class="rule">');
                    if (data.result == true) { //成功
                        if (data.rl && data.rl.length > 0) {
                            for (var i = 0; i < data.rl.length; i++) {
                                var pn = data.rl[i].pn;
                                var cc = data.rl[i].cc;
                                if (pn) {
                                    arr.push("<p >奖品：&nbsp;&nbsp;" + pn + "</p>");
                                }
                                if (cc) {
                                    arr.push("<p>&nbsp;&nbsp;" + cc + "</p>");
                                }
                            }
                        } else {
                            arr.push("<p></p>");
                        }
                    }
                    else {
                        arr.push("<p></p>");
                    }
                    arr.push("</div></div>")
                    arr.push('<p class="dialog-copyright">本活动最终解释权归CCTV7频道所有</p></div></section>');
                    return arr.join("");
                });

            }
            });
        });
        $("#my-award2").click(function () {
            $("#my-award").trigger("click");
        });
        $(".magic-box").click(function () { //打开百宝箱

            if ($.fn.cookie("WinningTag") == "true") {//中奖之后就不能再中了
                W.isWinning(false);
                return;
            }
            if (Math.random() >= 0.5) {//只有50%的可以进后台请求
                W.isWinning(false);
                return
            }
            loadData({ url: domain_url + "ceremony/lottery/cctv7?oi=" + openid + "&temp=" + new Date().getTime(), callbackLotteryHandler: function (data) {

                if (!data.result) {//不中奖
                    W.isWinning(false);

                } else {//中奖
                    localStorage.setItem("hasWinning", "true"); //记录是否中奖
                    $.fn.cookie("WinningTag", "true", expires_in); //记录是否中奖
                    W.isWinning(true);
                    (function () {//中奖后的赋值
                        if (data.pn) {
                            $(".trophy-award").text(data.pn);
                        }
                        if (data.pp) {
                            $("#trophyimg").empty();
                            if (!data.cc) {
                                $("#trophyimg").append("<img style='width:100px;' src='" + data.pp + "' />");
                            } else {
                                $("#trophyimg").append("<img style='width:230px;' src='" + data.pp + "' />");
                            }

                        } else {
                            $("#trophyimg").html("");
                        }
                        if (data.cc) {
                            $(".spend-psw").text("" + data.cc);
                            $(".p-address").hide();
                        }
                        else {
                            $(".spend-psw").hide();
                            $(".p-address").show();
                        }
                        setTimeout(function () {
                            $("#my-award").removeClass("none"); //显示我的奖品按钮
                            $("#my-award2").removeClass("none"); //显示我的奖品按钮
                        }, 1000);
                    })();
                }
            }
            });
        });
        $(".click-open").click(function () {
            $(".magic-box").trigger("click");
        });
        $(".btn-receive-black").click(function () {//不中奖的返回按钮
            W.showDaoCountPage();
        });
        H.dialog.receiveFn = function () {//点击领取
            var tname = $("#text-name"),
            realName = tname.val();
            var tphone = $("#text-hpone"),
            phone = tphone.val();
            var taddress = $("#text-address"),
            address = taddress.val();
            if (!/^\d{11}$/.test(phone)) {
                H.dialog.showWin.open('这手机号，可打不通...');
                tphone.focus();
                return false;
            }
            if ($(".p-address").css("display") != "none") {
                if (address.length < 5 || address.length > 60) {
                    H.dialog.showWin.open('地址长度为5~60个字符');
                    taddress.focus();
                    return false;
                }
            };
            $(".copyright").removeClass("none");
            $(".copyright-receive").addClass("none");
            //领奖
            loadData({ url: domain_url + "ceremony/award?oi=" + openid + "&ph=" + phone + "&rn=" + realName + "&ad=" + address, callbackAwardHandler: function (data) {
                if (data.result == "0") {//领取不成功
                    H.dialog.showWin.open("抱歉领取不成功！", function (w) {
                        $(".activities-btn", w).text("确定");
                    }, function () {//关闭回调

                    });
                }
                if (data.result == "1") {//领奖成功  
                    H.dialog.showWin.open("领取成功！", function (w) {
                        $(".activities-btn", w).text("确定");
                    }, function () {//领奖成功 关闭回到倒计时
                        W.showDaoCountPage();
                    });
                }
            }, async: false
            });
        }
    })();

    ; (function () {//方法
        W.showDaoCountPage = function () {//显示到倒计时的页面
            W.showDPage();
            W.downCounFn();
        };
        W.showDPage = function () {
            var e = $("html");
            e.attr("class", "");
            imgReady(index_bg, function () {
                $('html').css('background-color', '#fce310');
                $('body').css('background-image', 'url(' + index_bg + ')');
                $(".trophy-told").show();
            });
            $(".main-contain").removeClass("none");
            $(".cover").addClass("none");

            $("#magic-countdown").show();
            $("#trophy-box").hide();
            $("#none-winners").hide();
            $("#magic-box").hide();
        }
        W.downCount = function (st, et) {
            $(".countdown").attr("data-stime", st);
            $(".countdown").attr("data-etime", et);
            $(".countdown").countdown({
                stpl: '<span class="state1"></span>',
                etpl: '<span class="state2">正在进行：%D%天%H%:%M%:%S%</span>',
                etpl: '<i>%M%</i>:<i>%S%</i>',
                otpl: '<span class="state3"></span>',
                callback: function (state) {
                    if (state == 1) { }
                    if (state == 2) {
                        $("#magic-countdown").show();
                        $("#trophy-box").hide();
                        $("#none-winners").hide();
                        $("#magic-box").hide();
                    }
                    if (state == 3) {
                        $("#magic-countdown").hide();
                        $("#trophy-box").hide();
                        $("#none-winners").hide();
                        $("#magic-box").show();

                    }
                }
            });
        }
        W.downCounFn = function () {
            var $this = $(".magic-box");
            loadData({ url: domain_url + "common/time", callbackTimeHandler: function (data) {
                W.sysytemTime = data.t;
                $.ajax({ url: domain_url + "ceremony/period", type: "get", async: false, dataType: "jsonp", jsonp: "callback", jsonpCallback: "callbackPeriodHandler",
                    success: function () { }, error: function () { }
                });
            }
            });
            W.callbackPeriodHandler = function (data) {
                if (data.result == 0) {
                    $.fn.cookie("lastClickBoxTime", W.sysytemTime, expires_in); //点击宝箱记录时间
                    var st = timestamp(data.sa);
                    var et = timestamp(data.ea);
                    if (et - W.sysytemTime > time_span) {
                        W.downCount(W.sysytemTime, W.sysytemTime + time_span);
                    } else {//提示要结束
                        H.dialog.showWin.open("活动已结束！", function (w) {
                            $(".activities-btn", w).text("确定");
                        }, function () {//关闭回调
                            showPage("cover");
                            $("#stat-btn").text("活动已结束");
                        });
                    }
                } else {
                    showPage("cover");
                    $("#stat-btn").text("活动已结束");
                }
            }
        }
        W.isWinning = function (isW) { //是否中奖
            $(".magic-box").addClass("magic-light");
            if (!isW) {//不中
                if (W.setTimeTemp) {
                    clearTimeout(W.setTimeTemp);
                }
                W.setTimeTemp = setTimeout(function () {
                    var e = $("html");
                    $("#magic-countdown").hide();
                    $("#none-winners").show();
                    $("#magic-box").hide();
                    $("#trophy-box").hide();
                    e.attr("class", "h-trophy");
                    imgReady(index_bg, function () {
                        $('html').css('background-color', '#fce310');
                        $('.h-trophy body').css('background-image', 'url(' + trophy_bg + ')');
                        $(".trophy-told").show();

                    });
                    $(".magic-box").removeClass("magic-light");

                }, 400);

            } else {//中奖
                $(".copyright").addClass("none");
                $(".copyright-receive").removeClass("none");
                if (W.setTimeTemp) {
                    clearTimeout(W.setTimeTemp);
                }
                W.setTimeTemp = setTimeout(function () {
                    var e = $("html");
                    $("#magic-countdown").hide();
                    $("#none-winners").hide();
                    $("#magic-box").hide();
                    $("#trophy-box").show();

                    e.attr("class", "h-trophy");
                    imgReady(index_bg, function () {
                        $('html').css('background-color', '#fce310');
                        $('.h-trophy body').css('background-image', 'url(' + trophy_bg + ')');
                        $(".trophy-told").show();

                    });
                    $(".magic-box").removeClass("magic-light");

                }, 400);

            }

        }

    })();

});





	

	
