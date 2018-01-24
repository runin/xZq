(function($) {
    H.shopCart = {
        $submit: $(".btn-submit"),
        checkflag: true,
        $cartBox: $(".cart-box"),
        $rpCount: $(".rp-count"),
        $goldCount: $(".gold-count"),
        $emptyCart: $(".cart-empty-tips"),
        $submitBtn: $(".tt-goods-submit"),
        requestFlag: true,
        init: function() {
            var me = this;
            //me.event();
            //me.jsonData();
            me.getShopCartList();
            me.eventSubmit();
            //me.periodDetail();
        },
        // 获取本期活动详情
        periodDetail: function() {
            getResult("indianaPeriod/detail", { appId: busiAppId, qid: uuid }, "indianaPeriodDetailCallBackHandler", true);
        },
        getShopCartList: function() {
            getResult("cart/listCart", { oid: openid }, "callBackListShoppingCartHandler", true);
        },
        jsonData: function(data) {
            var me = this;
            // var data = [{
            //     img: "http://onegoods.nosdn.127.net/goods/510/0c2f5cf26f9f0d939de2c60148234aea.png",
            //     gname: "Apple MacBook Pro 15.4英寸笔记本",
            //     pid: "219310230",
            //     needN: 342,
            //     needO: 102,
            //     qstep: 10,
            // }, {
            //     img: "http://onegoods.nosdn.127.net/goods/510/0c2f5cf26f9f0d939de2c60148234aea.png",
            //     gname: "Apple MacBook Pro 15.4英寸笔记本",
            //     pid: "219310230",
            //     needN: 342,
            //     needO: 102,
            //     qstep: 10,
            // }, {
            //     img: "http://cdn.holdfun.cn/tttj/mpAccount/resources/images/2016/01/23/454a7543de3d410fb8225251ff5c97a1.jpg",
            //     gname: "Apple MacBook Pro 15.4英寸笔记本",
            //     pid: "219310230",
            //     needN: 342,
            //     needO: 102,
            //     qstep: 10,
            // }, {
            //     img: "http://onegoods.nosdn.127.net/goods/510/0c2f5cf26f9f0d939de2c60148234aea.png",
            //     gname: "Apple MacBook Pro 15.4英寸笔记本",
            //     pid: "219310230",
            //     needN: 342,
            //     needO: 102,
            //     qdefault: 20,
            // }];

            var t = simpleTpl();
            for (var i = 0; i < data.length; i++) {
                var pinit = 1;
                var step = 0;
                var residue = data[i].pt - data[i].pj;
                if (data[i].ps) {
                    pinit = data[i].ps ? data[i].ps : "1";
                    pinit = parseInt(pinit);
                    step = pinit;

                } else if (data[i].pd) {
                    pinit = data[i].pd ? data[i].pd : "1";
                    if (pinit >= residue) {
                        pinit = residue;
                    }
                    step = 1;
                } else {
                    step = 1;
                };
                t._('<div class="item" data-maxNum="' + (Number(data[i].pl)) + '" data-pinit="' + step + '" data-puuid="' + data[i].pu + '">')
                    ._(' <div class="pic">')
                    ._(' <img src="' + data[i].pi + '" onerror="$(this).attr(\'src\',\'..\/..\/images/goods-snone.png\')">')
                    ._(' </div>')
                    ._(' <div class="text">')
                    ._(' <p class="font14"><span class="periods-id">(第' + data[i].pr + '期)</span><span class="goods-name">' + data[i].pn + '</span></p>')
                    ._(' <ul class="goods-rp">')
                    ._(' <li class="left-rp">总需：<strong class="txt-red">' + data[i].pt + '</strong>人次</li>')
                    ._(' <li class="right-rp">剩余：<strong class="txt-blue">' + data[i].pl + '</strong>人次</li>')
                    ._(' </ul>')
                    ._(' <div class="dm-count-chose font14">')
                    ._(' <span style="float:left;">参与人次&nbsp;&nbsp;</span>')
                    ._(' <a href="javascript:void(0)" class="db-reduce click-btn" id="db-reduce">-</a>')
                    ._(' <input id="db-num" type="number" class="db-text" value="' + data[i].pj + '" maxlength="8" min="1" title="请输入购买数量" onblur="blurFunction(this)"/><a href="javascript:void(0)" class="db-increase click-btn" id="db-increase">+</a>&nbsp;&nbsp;')
                    ._(' </div>')
                    ._(' <a href="javascript:void(0);" data-pro="del" class="del"><i class="ico ico-del"></i></a>')
                    ._('</div>')
                    ._(' </div>')
            };
            me.$cartBox.append(t.toString());
            me.event();
            me.prizeShow();
            me.deleteItem();
        },
        eventSubmit: function() {
            var me = this;
            this.$submit.on("click", function() {
             if (!me.checkflag) {
                    return;
                } else {
                    me.checkflag = false;
                }
                $(".btn-submit").html("提交中<span class='sp1'></span><span class='sp2'></span><span class='sp3'></span>");
                showLoading();

                // 调用订单详情
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    url: business_url + "indianaPeriod/submitMoreOrder",
                    jsonpCallback: 'indianaPeriodSubmitMoreOrderCallBackHandler',
                    data: {
                        appId: busiAppId,
                        openid: openid,
                        nk: encodeURI((nickname ? nickname : "匿名")),
                        hi: headimgurl
                    },
                    complete: function() {

                    },
                    success: function(data) {
                        if (data.result) {
                            if (data.wxPayFlag) {
                                location.href = data.payUrl + "&prefix=" + window.location.href.substr(0, window.location.href.indexOf('shopcart.html'));
                            } else {
                                toUrl("./goodspaymore.html?orderNo=" + data.ordeNos);
                            }

                        } else {
                            hideLoading();
                            showTips(data.message);
                            me.checkflag = true;
                        }
                    }
                })
            });
        },
        event: function(punit) {
            var me = this;
            // 数量处理
            $(".dm-count-chose a").tap(function() {
                var that = this;
                var name = $(this).attr("id");
                var maxNum = parseInt($(this).closest(".item").attr("data-maxNum"));
                var punit = parseInt($(this).closest(".item").attr("data-pinit"));
                var uuid = $(this).closest(".item").attr("data-puuid");
                if (H.shopCart.requestFlag) {
                    H.shopCart.requestFlag = false;
                } else {
                    return;
                }
                switch (name) {
                    //增加商品
                    case "db-increase":
                        me.checkflag = true;
                        var db_value = $(this).prev().val();
                        if (!check($(this).prev())) {
                            return;
                        }
                        if (db_value >= maxNum) {
                            showTips("已超本期最多人次");
                            db_value = maxNum;
                            H.shopCart.requestFlag = true;
                        } else {
                            db_value = parseInt(db_value) + 1 * punit;

                            // 加减时取得库存
                            $.ajax({
                                type: "GET",
                                dataType: "jsonp",
                                jsonp: "callback",
                                url: business_url + "cart/operateQuantity",
                                jsonpCallback: 'callBackOperateShopNumHandler',
                                data: {
                                    oid: openid,
                                    pid: uuid,
                                    num: db_value
                                },
                                complete: function() {
                                    // H.shopCart.requestFlag = true;
                                },
                                success: function(data) {
                                    if (data.result == 0) {
                                        H.shopCart.requestFlag = true;
                                        $(that).closest(".item").attr("data-maxNum", data.lf);
                                        $(that).closest(".item").find(".txt-blue").text(data.lf);
                                        $(that).prev().val(db_value);
                                        me.prizeShow();
                                    } else {
                                        showTips("增加失败，稍后再试试吧~");
                                        H.shopCart.requestFlag = true;
                                    }
                                },
                                error: function() {
                                    showTips("啊哦，网络在开小差噢，稍后再试试吧~");
                                }
                            })
                        }

                        break;
                        //减少商品
                    case "db-reduce":
                        me.checkflag = true;
                        var db_value = $(this).next().val();
                        if (!check($(this).next())) {
                            return;
                        }
                        if (parseInt(db_value) > 1 * punit) {
                            num = (parseInt(db_value) - 1 * punit);

                            // 加减时取得库存
                            $.ajax({
                                type: "GET",
                                dataType: "jsonp",
                                jsonp: "callback",
                                url: business_url + "cart/operateQuantity",
                                jsonpCallback: 'callBackOperateShopNumHandler',
                                timeout: 10000,
                                data: {
                                    oid: openid,
                                    pid: uuid,
                                    num: num
                                },
                                complete: function() {
                                    //H.shopCart.requestFlag = true;
                                },
                                success: function(data) {
                                    if (data.result == 0) {
                                        H.shopCart.requestFlag = true;
                                        $(that).closest(".item").attr("data-maxNum", data.lf);
                                        $(that).closest(".item").find(".txt-blue").text(data.lf);
                                        $(that).next().val(num);
                                        me.prizeShow();
                                    } else {
                                        showTips("删减失败，稍后再试试吧~");
                                        H.shopCart.requestFlag = true;
                                    }
                                    return;
                                },
                                error: function(XMLHttpRequest) {
                                    showTips("啊哦，网络在开小差噢，稍后再试试吧~");
                                }
                            })
                        } else {
                            num = punit;
                            H.shopCart.requestFlag = true;
                            // me.checkflag = false;
                        };
                        break;
                    default:
                        break;
                }
            });
        },
        deleteItem: function() {
            var me = this;
            $("body").delegate(".del", "click", function(e) {
                e.preventDefault();
                var that = this;
                var $item = $(this).closest(".item");
                var uuid = $(this).closest(".item").attr("data-puuid");
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    url: business_url + "cart/del",
                    jsonpCallback: 'callBackDelCartItemHandler',
                    data: {
                        oid: openid,
                        pid: uuid,
                    },
                    complete: function() {},
                    success: function(data) {
                        if (data.result == 0) {
                            $item.addClass("destroy");
                            $(that).closest(".item").on("webkitTransitionEnd", function() {
                                $item.remove();
                                me.prizeShow();
                            })
                        } else {
                            showTips("啊哦，网络在开小差噢，稍后再试试吧~");
                        }

                    },
                    error: function() {
                        showTips("啊哦，网络在开小差噢，稍后再试试吧~");
                    }
                })
            });

        },
        emptyCart: function() {
            this.$emptyCart.removeClass("none");
        },
        prizeShow: function() {
            var me = this;
            var prize = 0;
            me.$submitBtn.removeClass("none");
            $("body").find("input").each(function() {
                prize += parseInt($(this).val());
            })
            me.$rpCount.text($("body").find("input").length);
            me.$goldCount.text(prize);
            if (!$(".cart-box").has(".item").length) {
                $(".cart-empty-tips").removeClass("none");
                $(".btn-submit").addClass("btn-disabled").off();
            }

        },
    }
    W.blurFunction = function(that) {
        var maxNum = $(that).closest(".item").attr("data-maxNum");
        var punit = $(that).closest(".item").attr("data-pinit");
        var uuid = $(that).closest(".item").attr("data-puuid");
        if (H.shopCart.requestFlag) {
            H.shopCart.requestFlag = false;
        } else {
            return;
        }
        if (check(that)) {
            H.shopCart.checkflag = true;
            var db_value = $(that).val()
            if (parseInt(db_value) > maxNum) {
                showTips("已超本期最多人次");
                db_value = maxNum;
                $(that).val(maxNum);

            } else if (parseInt(db_value) < 1 * punit) {
                H.shopCart.checkflag = false;
                db_value = punit;
            }
            if (db_value % punit != 0) {
                db_value = Math.ceil(db_value / punit) * punit;

            }
            // 加减时取得库存
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                jsonp: "callback",
                url: business_url + "cart/operateQuantity",
                jsonpCallback: 'callBackOperateShopNumHandler',
                data: {
                    oid: openid,
                    pid: uuid,
                    num: db_value
                },
                complete: function() {
                    H.shopCart.requestFlag = true;
                },
                success: function(data) {
                    if (data.result == 0) {
                        H.shopCart.requestFlag = true;
                        $(that).closest(".item").attr("data-maxNum", data.lf);
                        $(that).closest(".item").find(".txt-blue").text(data.lf);
                        $(that).val(db_value);
                        H.shopCart.requestFlag = true;
                    } else {
                        H.shopCart.requestFlag = true;
                    }
                },
                error: function() {
                    showTips("啊哦，网络在开小差噢，稍后再试试吧~");
                }
            })

            H.shopCart.prizeShow();
        } else {
            H.shopCart.checkflag = false;
            $(that).focus();
        }
    }
    W.check = function(that) {
        var num = $(that).val();
        num = $.trim(num);
        if (/^0$/.test(num)) {
            return true;
        }
        if (!/^[1-9][0-9]*$/.test(num) || parseInt(num) < 0) {
            showTips("请输入正确的数量")
            return false;
        } else {
            return true;
        }
        return true;
    };
    W.callBackListShoppingCartHandler = function(data) {
        if (data.result == 0) {
            H.shopCart.jsonData(data.item);
        } else {

        }
    }
    W.callBackOperateShopNumHandler = function(data) {
        if (data.result == 0) {
            H.shopCart.requestFlag = true;

        } else {
            H.shopCart.requestFlag = true;
        }

    }

})(Zepto);

$(function() {
    H.shopCart.init();
});
