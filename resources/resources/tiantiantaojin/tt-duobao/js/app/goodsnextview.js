var goods_id = getQueryString("goods_id");
var goods_ppuuid = null;
var Interval = null;
var page = 1,
    pageSize = 20,
    loadmore = true;
(function($) {
    H.goodsnextview = {
        $particle: $(".btn-particle"),
        $next_join: $(".next-join-btn"),
        timeflag: false,
        dec: 0,
        type: 1,
        isTimeOver: false,
        init: function() {
            var me = this;
            me.event();
            me.userJoinState();
            me.scrolling();
        },

        // 查询用户是否购买过
        userJoinState: function() {
            getResult("indianaPeriod/check", { openid: openid, qid: goods_id }, "indianaPeriodCheckCallBackHandler", false);
        },

        // 获取本期活动详情
        periodDetail: function() {
            getResult("indianaPeriod/detail", { appId: busiAppId, qid: goods_id }, "indianaPeriodDetailCallBackHandler", true);
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

        //判断个人是否是开奖后
        prizeTime: function(data) {
            var me = this;
            var barP = data.qjc / data.qjp * 100;
            var residue = data.qjp - data.qjc;
            //acitiviIsOver为flase标示可以正常买，true标示已经开奖
            var acitiviIsOver = data.qre;
            var pbi = data.pbi.split(",");
            var t = simpleTpl();
            // 录播图片	

            if (data.qstep == "10") {
                $(".ico-label").removeClass("none");
            }

            if (H.goodsnextview.type != 2) {
                for (var i = 0; i < pbi.length; i++) {
                    t._('<div><img src="' + pbi[i] + '" class="goods-img" onerror="$(this).attr(\'src\',\'..\/..\/images\/goods-bnone.png\')"></div>')
                }
                $(".goods-warp").find("#slider").append(t.toString());
                $(".goods-warp").find(".periods-id").text("（第" + data.qpq + "期）");
                $(".goods-warp").find(".goods-name").text(data.ppn);
                $(".goods-warp").find(".num-needs").text(data.qjp);
                $(".goods-warp .left-rp").find("strong").text(data.qjc);
                $(".goods-warp .right-rp").find("strong").text(residue);
                $(".join-during .num-bar").css("width", barP + "%");
                $(".btn-particle").attr("data-collect-desc", "商品详情(" + data.ppn + ")");
                $(".btn-particle").attr("data-collect-flag", "particle(" + data.ppuuid + ")");
            }
            if (!acitiviIsOver) {

                if (residue == 0) {
                    // 显示下一期
                    $(".canbuy").addClass("none");
                    $(".buyforbidden").removeClass("none");
                    $(".btn-wap").addClass("none");
                    $(".next-editor").removeClass("none");
                } else {
                    $(".canbuy").removeClass("none");
                    $(".buyforbidden").addClass("none");
                    $(".btn-wap").removeClass("none");
                    $(".next-editor").addClass("none");
                }
                $('#slider').slider({ imgZoom: true });
            }


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
    };
    // 查询所有参与者的信息
    W.getList = function(showloading) {

        getResult("indianaRecord/list", { appId: busiAppId, qid: goods_id, page: page }, 'indianaRecordListCallBackHandler', showloading);
    }
    W.indianaRecordListCallBackHandler = function(data) {

            $('#mallSpinner').removeClass('loading-space');
            $('#mallSpinner').addClass('none');
            if (data.result) {
                var items = data.items || [],
                    len = items.length;

                if (len < pageSize) {
                    loadmore = false;
                    $('.loading-space').html(' --已到达列表底部--');
                } else {
                    $('.loading-space').html(' --下拉显示更多--');
                }
                //调用用户列表函数
                H.goodsnextview.userRecord(items);
                $(".wrap-duobao-detail").find(".begin-time").text(data.bds);


            } else {
                $('.loading-space').html(' --你是第一个快来抢沙发--');
            }

        }
        //获取用户是否参与过此期
    W.indianaPeriodCheckCallBackHandler = function(data) {
        if (data.result) {
            $(".duobao-states").removeClass("state-no").addClass("state-have");
            $(".duobao-states").find("strong").text(data.c);

            var listArr = data.n.split(",");
            H.goodsnextview.numList(listArr);
        } else {
            $(".duobao-states").removeClass("state-have").addClass("state-no");
        }
    };
    // 获取本期详细活动
    W.indianaPeriodDetailCallBackHandler = function(data) {
        if (data.result) {
            $(".content").removeClass("none");
            goods_ppuuid = data.ppuuid;
            H.goodsnextview.prizeTime(data);
        } else {
            showTips("网络不好");
        }
    }
})(Zepto);

$(function() {
    H.goodsnextview.init();
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
