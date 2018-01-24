var orderNo = getQueryString("orderNo");
var pname = getQueryString("pname");
var count = getQueryString("count");
(function($) {
    H.goodsPay = {
        $submit: $(".pay-submit"),
        init: function() {
            var me = this;
            //me.event();
            //me.dataFill();
            me.detailOrderInfor();
        },
        detailOrderInfor: function() {
            getResult("indianaPeriod/detailorder", {
                orderNo: orderNo
            }, "indianaPeriodDetailOrderCallBackHandler", true);
        },
        event: function() {
            var me = this;
            this.$submit.on("click", function() {
                $(".pay-button").html("支付中<span class='sp1'></span><span class='sp2'></span><span class='sp3'></span>");
                me.$submit.off();
                showLoading();
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    url: business_url + "indianaPeriod/pay",
                    jsonpCallback: 'indianaPeriodPayCallBackHandler',
                    data: {
                        orderNo: orderNo
                    },
                    complete: function() {
                       
                    },
                    success: function(data) {
                        if (data.result) {
                             toUrl("./gdsbuysuccess.html?orderNo=" + data.orderNo);
                        } else {
                            hideLoading();
                            showTips(data.message);
                            setInterval(function() {
                                me.event();
                                $(".pay-button").text("确认支付");
                            }, 500)
                        }

                    }
                })


            });

        },
        dataFill: function(data) {
            var t = simpleTpl();
                count = data.jc;
            $(".pay-content").find(".goods-name").text(data.jt);
            $(".pay-content .goods-times").find("strong").text(data.jc);
            $(".pay-content").find(".gold-account").text(data.jc + "元宝");
            $(".pay-content .pay-pocket").find("strong").text(data.account);
            $(".pay-content .li-first").css("padding-right", $(".goods-times").width() + 20);
            
            if (data.proUuid) {
                $(".pay-submit").attr("data-collect-desc", "夺宝-支付(" + data.jt + ")");
                $(".pay-submit").attr("data-collect-flag", "pay" + data.proUuid);
            }
            for (var i = 0; i < data.redItems.length; i++) {
                $(".red-show").removeClass("none");
                t._('<p>')
                    ._('<input type="radio" id="radio1" prize="' + data.redItems[i].redAccount + '" name="radio" class="regular-radio big-radio" date_uuid="' + data.redItems[i].redUuid + '"/>')
                    ._(' <label for="radio1"></label><span class="name">' + data.redItems[i].redname + '</span> <span class="prize">余额：' + data.redItems[i].redAccount + '元宝</span> <span class="timeout txt-grey font12">  (有效期：' + data.redItems[i].deadTime + ')</span>')

            }
            $(".button-holder").append(t.toString());
            if(data.redItems.length>=1)
            {
                var $defaultbtn = $(".button-holder p:first-child").find(".regular-radio");
                    $defaultbtn.attr("checked", "checked").addClass("ischecked");
                var discount = $defaultbtn.attr("prize");
                var rid = $defaultbtn.attr("date_uuid");
                     getResult("indianaPeriod/choseRed", {
                            no: orderNo,
                            rid: rid
                    }, "indianaPeriodChoseRedCallBackHandler", true);
                    H.goodsPay.event();
            };
            $(".button-holder p").click(function(e) {
                e.preventDefault();
                var discount = $(this).find(".regular-radio").attr("prize");
                var rid = $(this).find(".regular-radio").attr("date_uuid");

                if (!$(this).find(".regular-radio").hasClass("ischecked")) {
                    $(".button-holder p").each(function() {
                        $(this).find(".regular-radio").attr("checked", "false").removeClass("ischecked");
                    })
                    getResult("indianaPeriod/choseRed", {
                        no: orderNo,
                        rid: rid
                    }, "indianaPeriodChoseRedCallBackHandler", true)
                    $(this).find(".regular-radio").attr("checked", "checked").addClass("ischecked");
                }
                return;
            });
            H.goodsPay.event();
            // 点击流
        }
    }
    W.indianaPeriodDetailOrderCallBackHandler = function(data) {
        if (data.result) {
            H.goodsPay.dataFill(data);
        }
    }
    W.indianaPeriodChoseRedCallBackHandler = function(data) {
        if (data.result) {
            $(".discount-number>strong").text(data.redAccount + "元宝");
            $(".pay-content").find(".gold-account").text((parseFloat(data.jc)-parseFloat(data.redAccount)).toFixed(2) + "元宝");
            H.goodsPay.event();
        } else {
            $(".discount-number>strong").text("");
            $(".pay-content").find(".gold-account").text(parseInt(count) + "元宝");
            H.goodsPay.event();
        }
    };

})(Zepto);

$(function() {
    H.goodsPay.init();
});
