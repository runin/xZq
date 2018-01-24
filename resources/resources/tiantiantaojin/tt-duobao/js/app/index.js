/*===================================
调整底部位置和轮播图按钮的位置
====================================*/
window.onload = function() {
    $("footer").removeClass("none");
    $(".ui-slider-dots").css("margin-left", -$(".ui-slider-dots").width() / 2);
    if ($("footer").height() + $(".section1").height() + $(".section2").height() + $(".section3").height() + 80 < $(window).height()) {
        $("footer").css({ "position": "absolute", "bottom": "0px", "width": "100%" })
    } else {
        $(".loading-space").removeClass("none");
        $("footer").css({ "position": "relative", "bottom": "auto" })
    }
};

(function($) {
    H.index = {
        isTimeOver: [null, null, null],
        type: [1, 1, 1],
        dec: 0,
        flag: 1,
        timeInterval: [],
        timeError: [],
        $ruleSection:$(".rule-section"),
        init: function() {
            var me = this;
            me.event();
            me.getHotList();
            me.indexImgList();
            me.newOpen(true);
            me.isLucker();
            me.userGuige();
        },
        // 商品列表
        getHotList: function() {
            getResult("indianaPeriod/hotIndex", { appId: busiAppId }, "indianaPeriodHotIndexCallBackHandler", true)
        },
        // 轮播图片
        indexImgList: function() {
            getResult("indianaPeriod/topIndex", { appId: busiAppId }, "indianaPeriodTopIndexCallBackHandler", true)
        },
        // 判断用户是否中奖
        isLucker: function() {
            getResult("indianaPeriod/checkWin", { openid: openid, appId: busiAppId }, "indianaPeriodCheckWinCallBackHandler", true)
        },
        // 最新揭晓
        newOpen: function(loading) {
            getResult("indianaPeriod/newOpen", { appId: busiAppId }, "indianaPeriodNewOpenCallBackHandler", loading)
        },
        // 活动引导层
        userGuige: function() {
            var me = this;
            if (me.cookieSave(openid + "xx")) {
                me.$ruleSection.parent().removeClass("none");
                me.$ruleSection.addClass("bounceInDown");
                me.$ruleSection.on("webkitAnimationEnd", function() {
                    me.$ruleSection.removeClass("bounceInDown");

                });
            }
            // 活动规则
            $(".rule-close").click(function() {
                me.$ruleSection.addClass("bounceOutDown");
                me.$ruleSection.on("webkitAnimationEnd", function() {
                    me.$ruleSection.removeClass("bounceOutDown");
                    $(".modal").remove();
                });
            });
        },
        // 揭奖失败倒计时
        errorDeal: function() {
            var me = this;
            for (var i = 0; i < me.timeError.length; i++) {
                if (me.timeError[i]) {
                    if (me.timeInterval[i]) {
                        return;
                    }
                    me.timeInterval[i] = setInterval(function() {
                        me.newOpen(false);
                    }, 4000);
                } else {
                    clearInterval(me.timeInterval[i]);
                }
            }
        },
        // 商品倒计时
        getGoodsTime: function(data) {
            var me = this;
            var t = simpleTpl();
            var dataItem = data.item;

            //test 
            for (var i = 0; i < dataItem.length; i++) {
                if (dataItem[i].staus) {

                    if (new Date().getTime() > (timestamp(dataItem[i].lotterytime) + H.index.dec)) {
                        t._('<li>')
                            ._('<div class="w-goods grey-click-bg">')
                            ._('<i class="ico-more timeing" title="揭晓状态"></i>')
                            ._('<div class="w-goods-pic" data-uid="' + dataItem[i].uuid + '">')
                            ._('<img src="' + dataItem[i].simg + '">')
                            ._('</div>')
                            ._('<div class="countdown">')
                            ._('<span class="errtext txt-red">努力揭晓中<span class="sp1"></span><span class="sp2"></span><span class="sp3"></span></span>')
                            ._('</div>')
                            ._('</div>')
                            ._('</li>')
                        H.index.timeError[i] = true;
                        console.log(i);
                        me.errorDeal();
                    } else {
                        if (me.timeInterval[i]) {
                            clearInterval(me.timeInterval[i]);
                        }
                        t._('<li>')
                            ._('<div class="w-goods grey-click-bg">')
                            ._('<i class="ico-more timeing" title="揭晓状态"></i>')
                            ._('<div class="w-goods-pic" data-uid="' + dataItem[i].uuid + '">')
                            ._('<img src="' + dataItem[i].simg + '">')
                            ._('</div>')
                            ._('<div class="countdown">')
                            ._('<span class="countdown-tip ">倒计时:</span>')
                            ._('<span class="detail-countdown " etime="' + (timestamp(dataItem[i].lotterytime) + H.index.dec) + '"></span>')
                            ._('</div>')
                            ._('</div>')
                            ._('</li>')
                    }
                } else if (data.now <= timestamp(dataItem[i].lotterytime)) {
                    t._('<li>')
                        ._('<div class="w-goods grey-click-bg">')
                        ._('<i class="ico-more timeing" title="揭晓状态"></i>')
                        ._('<div class="w-goods-pic" data-uid="' + dataItem[i].uuid + '">')
                        ._('<img src="' + dataItem[i].simg + '">')
                        ._('</div>')
                        ._('<div class="countdown">')
                        ._('<span class="countdown-tip ">倒计时:</span>')
                        ._('<span class="detail-countdown " etime="' + (timestamp(dataItem[i].lotterytime) + H.index.dec) + '"></span>')
                        ._('</div>')
                        ._('</div>')
                        ._('</li>')
                } else {
                    t._('<li>')
                        ._('<div class="w-goods grey-click-bg">')
                        ._('<i class="ico-more timeover" title="揭晓状态"></i>')
                        ._('<div class="w-goods-pic" data-uid="' + dataItem[i].uuid + '">')
                        ._('<img src="' + dataItem[i].simg + '">')
                        ._('</div>')
                        ._('<p class="w-goods-user font12 ">恭喜<span class="txt-red pname">' + (dataItem[i].nk ? dataItem[i].nk : "") + '</span>获得<span class="txt-red">' + (dataItem[i].pname ? dataItem[i].pname : "") + '</span></p>')
                        ._('</div>')
                        ._('</li>')
                    H.index.timeError[i] = false;
                    if (me.timeInterval[i]) {
                        clearInterval(me.timeInterval[i]);
                    }
                }
            }

            $(".new-opened-goods ul").empty();
            $(".new-opened-goods ul").append(t.toString());

            // 调用倒计时函数
            H.index.count_down();
            $(".w-goods").tap(function(e) {
                var data_uid = $(this).find(".w-goods-pic").attr("data-uid");
                toUrl("./html/goods/goodsview.html?goods_id=" + data_uid);
            });
        },

        goodsList: function(data) {
            var me = this;
            var t = simpleTpl();
            var length = data.length;
            var barP;
            var tempDate = data;
            var stringName = "";
            var goodsName = "";

            for (var i = 0; i < Math.floor(length / 2) * 2; i++) {
                // 状态条
                barP = tempDate[i].qjc / tempDate[i].qjp * 100;
                if (barP < 50) {
                    barP = Math.ceil(barP);
                };

                // 十元专区
                if (tempDate[i].syflag) {
                    visible = "visible";
                } else {
                    visible = "none";
                }

                t._('<li>')
                    ._('<div class="tt-goods grey-click-bg" data-uuid="' + tempDate[i].qid + '">')
                    ._('<div class="tt-goods-img">')
                    ._('<i class="ico ico-label ico-special ' + visible + '" ></i>')
                    ._('<img src="' + tempDate[i].psi + '" onerror="$(this).attr(\'src\',\'.\/images\/goods-snone.png\')">')
                    ._('<div class="shine" data-collect="true" data-collect-desc="商品(' + (tempDate[i].ppn ? tempDate[i].ppn : "") + ')"  data-collect-flag="' + (tempDate[i].proUuid ? tempDate[i].proUuid : i) + '"></div>')
                    ._('</div>')
                    ._('<div class="tt-goods-infor" data-collect="true" data-collect-desc="商品(' + (tempDate[i].ppn ? tempDate[i].ppn : "") + ')"  data-collect-flag="' + (tempDate[i].proUuid ? tempDate[i].proUuid : i) + '">')
                    ._('<p class="font13 txt-grey-main"><span class="periods-id">(第' + tempDate[i].qpq + '期)  </span><span class="goods-name">' + (tempDate[i].ppn ? tempDate[i].ppn : "") + '</span></p>')
                    ._('<div class="progressBar">')
                    ._('<p class="txt font12" style="margin-bottom: 3px;">开奖进度<strong class="txt-blue">' + parseInt(barP) + '%</strong></p>')
                    ._('<p class="bar">')
                    ._('<span class="num-bar" style="width:' + barP + '%;"><i class="color"></i></span>')
                    ._('</p>')
                    ._('</div>')
                    ._('</div>')
                    ._('<div class="button-round click-btn btn-addCart" id="tt-goods-particle" data-collect="true" data-collect-desc="商品(' + (tempDate[i].ppn) + ')" data-collect-flag="' + (tempDate[i].proUuid ? tempDate[i].proUuid : i) + '"></div>')
                    ._('</div>')
                    ._('</li>')
            };
            $(".goods-list ul").append(t.toString());

            // 根据参与宽度调整状态条的位置
            $(".tt-goods-particle").each(function() {
                $(this).prev().find(".progressBar").css("margin-right", $(this).width() + 15);
            });
            //图片详情
            $(".tt-goods").delegate(".shine", "click", function() {
                // $(this).css("background-position","-99px 0"); 
                // $(this).animate({backgroundPosition: '99px 0'},1000);
                var goods_id = $(this).closest(".tt-goods").attr("data-uuid");
                toUrl("./html/goods/goodsview.html?goods_id=" + goods_id);
            });
            
        },
        luckCheck: function(data) {
            var me = this;
            var isLucker = true;
            data = { tt: "恭喜您获奖了，请及时确认收货地址，以便商品发放！" }
            if (isLucker) {
                var t = simpleTpl();
                t._('<section class="modal">')
                    ._('<div class="lucker-section bounceInDown">')
                    ._('<div class="con">')
                    ._('<h1><img src="./images/lucker-tips.png"></h1>')
                    ._('<p class="con-tt">' + data.tt + '</p>')
                    ._('<div class="con-tab">')
                    ._('<a href="javascript:void(0)" data-collect="true" class="duobao-close click-btn"  data-collect-flag="tt-duobao-lucker-close" ')
                    ._(' data-collect-desc="天天夺宝-中奖-知道了" id="duobao-close">')
                    ._('知道了')
                    ._('</a>')
                    ._(' <a href="javascript:void(0)" data-collect="true" class="confirm-now click-btn" ')
                    ._(' data-collect-flag="tt-duobao-confirm-now"')
                    ._(' data-collect-desc="天天夺宝-立即确认" id="confirm-now">')
                    ._(' 立即确认')
                    ._(' </a>')
                    ._(' </div>')
                    ._(' </div>')
                    ._(' </div>')
                    ._(' </section>')
                $("body").append(t.toString());
                me.relocate();
            }
        },
        event: function() {
            // 全部尚品
            $(".all-goods").click(function() {
                $(".fix-tab-div a").removeClass("focus");
                $(this).addClass("focus");
                toUrl("allgoods.html");
            });
            // 晒单
            $(".show-prize").click(function() {
                $(".fix-tab-div a").removeClass("focus")
                $(this).addClass("focus");
                toUrl("./html/goods/goodsshare.html");
            });
            // 个人中心
            $(".user-center").click(function() {
                $(".fix-tab-div a").removeClass("focus")
                $(this).addClass("focus");
                toUrl("./html/user/personcenter.html");
            });

            // 活动规则
            $(".footer-bar").click(function() {
                location.href = "./html/goods/goodsrule.html";
            });


            // 中奖弹层关闭
            $("body").delegate(".duobao-close", "click", function() {
                $(".lucker-section").removeClass("bounceInDown").addClass("bounceOutDown");
                $(".lucker-section").on("webkitAnimationEnd", function() {
                    $(".lucker-section").parent().remove();
                });
            });
            // 中奖弹层确认地址
            $("body").delegate(".confirm-now", "click", function() {
                $(".lucker-section").removeClass("bounceInDown").addClass("bounceOutDown");
                $(".lucker-section").on("webkitAnimationEnd", function() {
                    $(".lucker-section").parent().remove();
                    toUrl("./html/user/prizelist.html");
                });

            });

            // 更多全部商品
            $(".wrap-goods-title label,.loading-space").click(function() {
                toUrl("allgoods.html");
            });

            // 更多倒计时揭晓
            $(".new-opened-title label").click(function() {
                toUrl("./html/goods/goodsreveal.html");
            })


        },
        // 设置弹层的高度
        relocate: function() {
            var height = $(window).height(),
                width = $(window).width();
            var modalH = $('.lucker-section').height();
            $('.lucker-section').css({
                'margin-top': (height - modalH) / 2,
            });
        },
        // 纪录用户最近是否访问过
        cookieSave: function(data) {
            if ($.fn.cookie(data)) {
                return false;

            } else {
                var exp = new Date();
                exp.setTime(exp.getTime() + 60 * 1000 * 60 * 24 * 30 * 12);
                $.fn.cookie(data, 1, {
                    expires: exp
                });
                return true;
            }
        },
        count_down: function() {
            var meOut = this;
            $('.detail-countdown').each(function(index, el) {
                var $me = $(this);
                $(this).countDown({
                    etpl: '%M%' + ':' + '%S%' + '.' + '%ms%', // 还有...结束
                    stpl: '%M%' + ':' + '%S%' + '.' + '%ms%', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if (!H.index.isTimeOver[index] && H.index.type[index] == 1) {
                            H.index.isTimeOver[index] = true;
                        } else if (H.index.type[index] == 2) {
                            return;
                        } else {
                            meOut.newOpen(false);
                            H.index.type[index] = 2;
                            H.index.flag = 2;
                        }

                    },
                    sdCallback: function() {
                        H.index.isTimeOver[index] = false;
                    }
                });
            });
        }
    };
    /*===================================
    	获取热门产品
    ====================================*/
    W.indianaPeriodHotIndexCallBackHandler = function(data) {
        if (data.result) {
            $(".wrap-goods-title").removeClass("none");
            H.index.goodsList(data.items);
        } else {
            showTips("目前没有热门商品");
        }
    }

    /*===================================
		获取首页轮播图
	====================================*/
    W.indianaPeriodTopIndexCallBackHandler = function(data) {
        if (data.result) {
            var t = simpleTpl();
            var t1 = simpleTpl();
            // t1._('<div><a href="./html/user/girlday.html"><img src="./images/logo/eletriclogo.jpg" class="redrule"></a></div>')
            //     ._('<div><a href="./html/user/logistics.html"><img src="./images/logistics.jpg" class="redrule"></a></div>')
            for (var i = 0; i < data.items.length; i++) {
                t._('<div><img src="' + data.items[i].img + '" data_uid="' + data.items[i].qid + '" ></div>')
            }
            $(".slider").append(t1.toString()+t.toString());
            $('#slider').slider({ imgZoom: true });
            $(".slider").find("img").on("click", function(e) {
                if ($(this).hasClass("redrule")) {
                    return;
                };
                var goods_id = $(this).attr("data_uid");
                toUrl("./html/goods/goodsview.html?goods_id=" + goods_id);
            });
        } else {
            //showTips("两只小熊.....");
        }
    };
    /*===================================
		最新揭晓倒计时
	====================================*/
    W.indianaPeriodNewOpenCallBackHandler = function(data) {
        if (data.result) {
            $(".new-opened-title").removeClass("none");
            H.index.dec = new Date().getTime() - data.now;
            H.index.getGoodsTime(data);

        }
    }
    // 是否中奖
    W.indianaPeriodCheckWinCallBackHandler = function(data) {
        if (data.result) {
            H.index.luckCheck();
        }
    }
})(Zepto);

$(function() {
    H.index.init();
});
