var goods_id = getQueryString("goods_id");
var goods_ppuuid = null;
var goods_qpq = null;
var Interval = null;
var erropen = false;
var page = 1,
    pageSize = 20,
    lastlength = 0,
    loadmore = true;
(function($) {
    H.goodsview = {
        $particle: $(".btn-particle"),
        $next_join: $(".next-join-btn"),
        timeflag: false,
        dec: 0,
        type: 1,
        getflag: false,
        isTimeOver: false,
        init: function() {
            var me = this;
            //me.beforeShowCountdown();     
            me.event();
            me.userJoinState();
            me.periodDetail();
            me.scrolling();
            me.periodCheckTime();
            //每分钟调用一次,直到true以后开始倒计时，不再调用
            if ($.fn.cookie(goods_id)) {
                me.periodCheckTime();
            } else {
                Interval = setInterval(function() {
                    me.periodCheckTime();
                }, 60000);
            }
            $(window).scrollTop(0);
        },

        // 查询用户是否购买过
        userJoinState: function() {
            getResult("indianaPeriod/check", { openid: openid, qid: goods_id }, "indianaPeriodCheckCallBackHandler", false);
        },

        // 获取本期活动详情
        periodDetail: function() {
            showLoading($("body"), "努力加载中");
            getResult("indianaPeriod/detail", { appId: busiAppId, qid: goods_id }, "indianaPeriodDetailCallBackHandler", true);
        },
        // 查询倒计时时间
        periodCheckTime: function() {
            getResult("indianaPeriod/checkTime", { qid: goods_id }, "indianaPeriodCheckTimeCallBackHandler", false);
        },
        // 查询下一期时间
        periodNextTime: function(period) {
            getResult("indianaPeriod/checkNextPeriod", { uuid: goods_ppuuid, period: period }, "indianaPeriodCheckNextPeriodCallBackHandler", false);
        },
        // 参加用户列表
        userRecord: function(data) {
            var $fix = $('.btn-rule');
            var scroH = 0;
            var initHeight = 0;
            var scinterval = null;
            $(window).scroll(function() {
                scroH = $(this).scrollTop();
                if (scroH > 0) {
                    $fix.addClass('none');
                } else {
                    $fix.removeClass('none');

                }
                initHeight = scroH;
                if (scinterval == null) {
                    scinterval = setInterval(function() {

                        if (initHeight == scroH) {
                            $fix.removeClass('none');
                            clearInterval(scinterval);
                            scinterval = null;
                        }
                    }, 1500);
                }

            });

            var t = simpleTpl();
            for (var i = 0; i < data.length; i++) {
                t._('<li id="user-id"' + i + '">')
                    ._('<div class="avatar">')
                    ._('<img width="40" height="40" src="' + data[i].hi + '" onerror="$(this).attr(\'src\',\'..\/..\/images\/avatar.png\')">')
                    ._('</div>')
                    ._('<div class="text">')
                    ._('<p class="text-breakword">')
                    ._('<span class="user-name">' + data[i].nk + '</span> <span class="address">(' + data[i].ad + 'IP' + data[i].ip + ')</span>')
                    ._('</p>')
                    ._('<p>')
                    ._('<span class="num">参与了<span class="txt-red">' + data[i].rc + '</span>人次</span> <time>' + data[i].rtb + '</time>')
                    ._('</p>')
                    ._('</div> ')
                    ._('</li>')
            };
            $(".duobao-detail-list ul").append(t.toString());
        },

        event: function() {
            var me = this;
            this.$particle.click(function() {
                toUrl("./goodsbuy.html?goods_id=" + goods_id);
            });


            // 查看计算详情
            $(".viewcalcu").click(function() {
                toUrl("./goodscalcu.html?goods_id=" + goods_id);
            });

            // 图文详情
            $(".duobao-detail-image").click(function() {
                toUrl("./goodsimgdetail.html?goods_id=" + goods_id);
            });


            // 晒单分享
            $(".duobao-history-share").click(function() {
                toUrl("./goodsppshare.html?goods_ppuuid=" + goods_ppuuid);
            });

            // 进入时给的动画
            $(".btn-rule").css({ "-webkit-animation-name": "bounceInRight", "-webkit-animation-duration": "1s" });
            $(".btn-rule").on("webkitAnimationEnd", function() {
                $(".btn-rule").css({ "-webkit-animation": "" });
            });

            // 活动规则
            $(".btn-rule").click(function() {
                $(this).css({ "-webkit-animation-name": "bounceOutRight", "-webkit-animation-duration": "1s" });
                $(this).on("webkitAnimationEnd", function() {
                    $(".btn-rule").css({ "-webkit-animation": "", "display": "none" });
                });
                toUrl("./goodsrule.html");
            });

            //中奖用户信息弹层
            $("body").delegate(".dialog-lucker .btn-close", "click", function() {
                $(this).closest(".modal").remove();
            });

        },

        //判断活动是否是开奖后
        prizeTime: function(data) {
            var me = this;
            var barP = data.qjc / data.qjp * 100;
            var residue = data.qjp - data.qjc;
            //acitiviIsOver为flase标示可以正常买，true标示已经开奖
            var acitiviIsOver = data.qre;
            var pbi = data.pbi.split(",");
            var t = simpleTpl();

            if (data.qstep == "10") {
                $(".ico-label").removeClass("none");
            }
            // 录播图片         
            if (H.goodsview.type != 2) {
                for (var i = 0; i < pbi.length; i++) {
                    t._('<div><img src="' + pbi[i] + '" class="goods-img" onerror="$(this).attr(\'src\',\'..\/..\/images\/goods-bnone.png\')"></div>')
                }
                $(".goods-warp").find("#slider").append(t.toString());
                $(".goods-warp").find(".periods-id").text("(第" + data.qpq + "期)  ");
                $(".goods-warp").find(".goods-name").text(data.ppn);
                $(".goods-warp").find(".num-needs").text(data.qjp);
                $(".goods-warp .left-rp").find("strong").text(data.qjc);
                $(".goods-warp .right-rp").find("strong").text(residue);
                $(".join-during .num-bar").css("width", barP + "%");

                // 立即前往和前往下一期添加点击流
                $(".btn-particle").attr("data-collect-desc", "商品详情(" + data.ppn + ")");
                $(".btn-particle").attr("data-collect-flag", "particle" + data.ppuuid);
                $(".next-editor").attr("data-collect-desc", "商品详情(" + data.ppn + ")");
                $(".next-editor").attr("data-collect-flag", "next" + data.ppuuid);
            }

            //test
            if (!acitiviIsOver) {

                if (residue == 0) {
                    // 显示下一期
                    me.periodNextTime(data.qpq);
                    $(".canbuy").addClass("none");
                    $(".buyforbidden").removeClass("none");
                    $(".btn-wap").addClass("none");
                    $(".next-editor").removeClass("none");
                    $(".ico-noopen").addClass("none");
                } else {
                    $(".ico-noopen").addClass("none");
                    $(".canbuy").removeClass("none");
                    $(".buyforbidden").addClass("none");
                    $(".btn-wap").removeClass("none");
                    $(".next-editor").addClass("none");
                }
                // 倒计时结束后，数据未正常返回，则重复调用接口
                if (new Date().getTime() > (timestamp(data.t) + H.goodsview.dec)) {
                    erropen = setInterval(function() {
                        getResult("indianaPeriod/detail", { appId: busiAppId, qid: goods_id }, "indianaPeriodDetailCallBackHandler", false);
                    }, 3000);
                    $(".buyforbidden #user-need-times").after("<p style='color:#fff;height: 30px;line-height: 30px;background-color:#f91546;' class='font13'>努力开奖中<span class='sp1'></span><span class='sp2'></span><span class='sp3'></span></p>")
                };
                $('#slider').slider({ imgZoom: true });
                $(".ui-slider-dots").css("margin-left", -$(".ui-slider-dots").width() / 2);
            } else {
                // 服务器时间小于开奖时间，则继续倒计时
                if (data.now < timestamp(data.t)) {
                    $(".join-over").addClass("none");
                    $(".open-countdown").removeClass("none");
                    H.goodsview.dec = new Date().getTime() - data.now;
                    H.goodsview.beforeShowCountdown(data);

                } else {
                    //如果接口调起数据则，关闭接口
                    if (erropen) {
                        clearInterval(erropen);
                    }
                    // 如果人数未满，则不正常开奖
                    if (!data.qln) {
                        $(".open-countdown").addClass("none");
                        $(".join-over").addClass("none");
                        $(".ico-noopen").removeClass("none");
                        $(".duobao-states").css("padding-left", " 25px");
                        $(".buyforbidden #user-need-times").after("<p style='color:#f91546' class='font13'>商品未开奖，参与者参与所消费的元宝已退回余额。请到个人中心查看</p>")
                    } else {
                        //显示中奖用户
                        $(".ico-noopen").addClass("none");
                        $(".open-countdown").addClass("none");
                        $(".join-over").removeClass("none");
                    }

                    $(".join-over").find("img").attr("src", (data.qhi ? data.qhi : "../../images/avatar.png"));
                    $(".winner-infor").find(".user-name").text(data.qnk ? data.qnk : "匿名");
                    $(".winner-infor").find(".address").text(data.qare);
                    $(".winner-infor").find(".user-times").text(data.qcount ? data.qcount : "0");
                    $(".winner-infor").find(".local-times").text(data.qlt);
                    $(".winner-num").find(".luck-id").text(data.qln);
                }
                // 显示下一期
                $(".btn-wap").addClass("none");
                $(".next-editor").removeClass("none");

                // 判断是否有下一期
                me.periodNextTime(data.qpq);

                //显示揭奖倒计时或者显示中奖用户
                $(".canbuy").addClass("none");
                $(".buyforbidden").removeClass("none")

                $(".view-user-num").click(function() {
                    me.luckerDialog(data);
                });
                $('#slider').slider({ imgZoom: true });
                $(".ui-slider-dots").css("margin-left", -$(".ui-slider-dots").width() / 2);
            };
            // 往期揭晓
            $(".duobao-history-record").click(function() {
                toUrl("./goodshistoryrecord.html?goods_id=" + data.ppuuid);
            });
        },
        //若用户已经参与显示的夺宝号码
        numList: function(data) {
            var t = simpleTpl();
            var label = '<li>夺宝记录：</li>';
            for (var i = 0; i < data.length; i++) {
                t._('<li>' + data[i] + '</li>')
            };
            $(".num-list").append(label + t.toString());
        },

        //夺宝结束后查看中奖用户参与的号码信息
        luckerDialog: function(data) {
            var me = this;
            var luck_list = data.qcnum.split(",");
            var t = simpleTpl();
            var t1 = simpleTpl();
            var t2 = simpleTpl();
            t._('<section class="modal">')
                ._('<div class="dialog-lucker font14">')
                ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="luck-closebtn" data-collect-desc="中奖者信息弹层-关闭按钮"><span>x</span></a>')
                ._('<ul class="goods-label">')
                ._('<li class="goods-name">(第' + data.qpq + '期)  ' + data.ppn + '</li>')
                ._('<li class="join-times"><span class="txt-red">' + data.qcount + '</span>人次</li>')
                ._('</ul>')
                ._('<div class="luck-block">')
                ._('<p>以下是商品获奖者的所有夺宝号码：</p>')
                ._('<ul class="luck-list">')

            t2._('</ul>')
                ._('</div>')
                ._('</div>')
                ._('</section>')

            for (var i = 0; i < luck_list.length; i++) {
                if (data.qln == luck_list[i]) {
                    t1._('<li class="txt-red">' + luck_list[i] + '</li>')
                } else {
                    t1._('<li>' + luck_list[i] + '</li>')
                }

            };
            $("body").append(t.toString() + t1.toString() + t2.toString());

        },
        // 开奖开启倒计时
        beforeShowCountdown: function(pra) {
            var me = this;
            me.cookieSave(goods_id);
            $(".join-over").addClass("none");
            $(".open-countdown").removeClass("none");
            var beginTimeLong = pra.t;
            beginTimeLong = timestamp(beginTimeLong);
            beginTimeLong += H.goodsview.dec;

            $(".countdown-tip").html('揭晓倒计时 ');
            $('.detail-countdown').attr('etime', beginTimeLong);
            H.goodsview.count_down();
            $('.countdown').removeClass('none');
        },
        count_down: function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl: '%H%' + ':' + '%M%' + ':' + '%S%' + '.' + '%ms%', // 还有...结束
                    stpl: '%H%' + ':' + '%M%' + ':' + '%S%' + '.' + '%ms%', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if (!H.goodsview.isTimeOver && H.goodsview.type == 1) {
                            H.goodsview.isTimeOver = true;
                        } else if (H.goodsview.type == 2) {
                            return;
                        } else {
                            H.goodsview.type = 2;
                            //$(".open-countdown").addClass("none");
                            // $(".join-over").removeClass("none");
                            getResult("indianaPeriod/detail", { appId: busiAppId, qid: goods_id }, "indianaPeriodDetailCallBackHandler", false);
                        }

                    },
                    sdCallback: function() {
                        H.goodsview.isTimeOver = false;
                    }
                });
            });
        },

        // 设置弹层的高度
        relocate: function() {
            var height = $(window).height(),
                width = $(window).width();
            var luckH = $(".dialog-lucker").height();

            $(".dialog-lucker").css({
                'margin-top': (height - luckH) / 2,
            });
        },
        scrolling: function() {
            getList(true);
            page++;
            var range = 180, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;

            $(window).scroll(function() {
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if (($(document).height() - range) <= totalheight && page < maxpage && loadmore) {
                    if (!$('#mallSpinner').hasClass('none')) {
                        console.log(!$('.mallSpinner').hasClass('none'));
                        return;
                    }
                    $('#mallSpinner').removeClass('none');
                    $('#mallSpinner').addClass('loading-space');
                    getList();
                    page++;
                }
            });
        },
        cookieSave: function(data) {
            if ($.fn.cookie(data)) {

                return false;

            } else {
                var exp = new Date();
                exp.setTime(exp.getTime() + 60 * 1000 * 20);
                $.fn.cookie(data, 1, {
                    expires: exp
                });
                return true;
            }
        }

    };
    // 查询所有参与者的信息
    W.getList = function(showloading) {

            getResult("indianaRecord/list", { appId: busiAppId, qid: goods_id, page: page }, 'indianaRecordListCallBackHandler', showloading);
        }
        /*===================================
        获取参与用户列表
    ====================================*/
    W.indianaRecordListCallBackHandler = function(data) {
            $('#mallSpinner').removeClass('loading-space');
            $('#mallSpinner').addClass('none');
            if (data.result) {
                var items = data.items || [],
                    len = items.length;
                lastlength = len;
                if (len < pageSize) {
                    loadmore = false;
                    $('.loading-space').html(' --已到达列表底部--');
                } else {
                    $('.loading-space').html(' --下拉显示更多--');
                }
                //调用用户列表函数
                H.goodsview.userRecord(items);
                $(".wrap-duobao-detail").find(".begin-time").text(data.bds);


            } else {
                if (lastlength == pageSize) {
                    loadmore = false;
                    $('.loading-space').html(' --已到达列表底部--');
                }
                $('.loading-space').html(' --你是第一个快来抢沙发--');
            }

        }
        /*===================================
            获取参与过的夺宝号码
        ====================================*/
    W.indianaPeriodCheckCallBackHandler = function(data) {
        if (data.result) {
            $(".duobao-states").removeClass("state-no").addClass("state-have");
            $(".duobao-states").find("strong").text(data.c);
            var listArr = data.n.split(",");
            H.goodsview.numList(listArr);
        } else {
            $(".duobao-states").removeClass("state-have").addClass("state-no");
        }
    };
    /*===================================
        获取本期商品详情
    ====================================*/
    W.indianaPeriodDetailCallBackHandler = function(data) {
            if (data.result) {
                $(".content").removeClass("none");
                hideLoading();
                H.goodsview.getflag = true;
                goods_ppuuid = data.ppuuid;
                H.goodsview.prizeTime(data);
            } else {
                showTips("啊哦，网络在开小差噢，稍后再试试吧~");
            }
        }
        /*===================================
        获取倒计时接口数据
    ====================================*/
    W.indianaPeriodCheckTimeCallBackHandler = function(data) {
            if (data.result) {
                $(".canbuy").addClass("none");
                $(".buyforbidden").removeClass("none")

                // 显示下一期
                $(".btn-wap").addClass("none");
                $(".next-editor").removeClass("none");

                // 判断是否有下一期
                goods_ppuuid = data.ppuuid;
                H.goodsview.periodNextTime(data.period);

                H.goodsview.dec = new Date().getTime() - data.now;
                H.goodsview.beforeShowCountdown(data);
                H.goodsview.timeflag = false;
                clearInterval(Interval);
            } else {
                H.goodsview.timeflag = true;
            }

        }
        /*==============================================================
            获取下一期商品状态，true标示有下一期，false则调回首页
        ================================================================*/
    W.indianaPeriodCheckNextPeriodCallBackHandler = function(data) {
        if (data.result) {
            $(".next-join-btn").click(function() {
                toUrl("./goodsnextview.html?goods_id=" + data.nextuuid);
            });
        } else {
            $(".next-join-btn").click(function() {
                toUrl("../../index.html");
            });
        }

    }
})(Zepto);

$(function() {
    H.goodsview.init();
    H.cartSet.init();
});

(function($) {
    H.cartSet = {
        $body: $("body"),
        finishFlag: true,
        init: function() {

            this.eventHander();
        },
        eventHander: function() {
            var me = this;
            var uuid = goods_id;
            me.$body.delegate(".btn-addCart", "click", function() {
                var t = simpleTpl();
                t._('<section class="modal">')
                    ._('<div class="msgbox">')
                    ._('<div class="msgbox-bd">')
                    ._('<h3 class="msgbox-title">已成功添加至清单！</h3>')
                    ._('</div>')
                    ._('<div class="msgbox-btn">')
                    ._('<div class="pro-btn" onclick="location.href=\'./shopcart.html\'"><span>查看清单</span></div>')
                    ._('<div class="pro-btn" onclick="$(this).closest(\'.modal\').remove()"><span>再逛一逛</span></div>')
                    ._('</div>')
                    ._('</div>')
                    ._('</section>')
                H.cartSet.$body.append(t.toString());
                var height = $(window).height(),
                    MsgH = $(".msgbox").height();
                $(".msgbox").css({
                    'top': (height - MsgH) / 2,
                });

                if (H.cartSet.finishFlag) {
                    H.cartSet.finishFlag = false;
                } else {
                    return;
                }
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    url: business_url + "cart/add",
                    jsonpCallback: 'callBackAddCartItemHandler',
                    data: {
                        oid: openid,
                        pid: uuid,
                    },
                    complete: function() {
                        //H.cartSet.finishFlag = true;
                    },
                    success: function(data) {
                        if (data.result == -1) {
                            showTips("添加失败");
                        }
                        H.cartSet.finishFlag = true;
                    }
                })
            });
            me.$body.delegate(".btn-particle", "click", function() {
                if (H.cartSet.finishFlag) {
                    H.cartSet.finishFlag = false;
                } else {
                    return;
                }
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    url: business_url + "cart/add",
                    jsonpCallback: 'callBackAddCartItemHandler',
                    data: {
                        oid: openid,
                        pid: uuid,
                    },
                    complete: function() {
                        //H.cartSet.finishFlag = true;
                    },
                    success: function(data) {
                        if (data.result == -1) {
                            return
                        }
                        H.cartSet.finishFlag = true;
                    }
                })
            })
        },
    }
})(Zepto)
