var orderNo = getQueryString("orderNo");
(function($) {
    H.goodspaymore = {
        requestFlag: true,
        $payMain: $(".pay-main"),
        $submit: $(".pay-submit"),
        $itemsShow:$(".pay-content").find("li:first"),
        $payContent:$(".pay-content"),
        $allAccount:0,
        init: function() {
            var me = this;
            //me.event();
            //me.dataFill();
            me.initDateList();
            me.detailOrderInfor();
        },
        initDateList: function() {
          //评论模版
            var arr = [];
            arr.push('<li class="li-item">');
            arr.push('<p class="line-limit">');
            arr.push('<span class="goods-name"></span> </p>');
            arr.push('<span class="goods-times"><strong class="txt-red"></strong>人次</span></li>');
            this.$citem = $(arr.join(""));
        },
        detailOrderInfor: function() {
            getResult("indianaPeriod/detailordermore", {
                orderNos: orderNo
            }, "indianaPeriodDetailOrderMoreCallBackHandler", true);
        },
        event: function() {
            var me = this;
            this.$submit.on("click", function() {
                $(".pay-button").html("支付中<span class='sp1'></span><span class='sp2'></span><span class='sp3'></span>");
                if (me.requestFlag) {
                    me.requestFlag = false;
                } else {
                    return;
                }
                showLoading();
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    url: business_url + "indianaPeriod/payMore",
                    jsonpCallback: 'indianaPeriodPayMoreCallBackHandler',
                    data: {
                        orderNos: orderNo
                    },
                    complete: function() {
                       
                    },
                    success: function(data) {
                        if (data.result) {
                            me.requestFlag = false;
                             toUrl("./gdsbuysuccess.html?orderNo=" + orderNo);
                        } else {

                            hideLoading();
                            showTips(data.message);
                            setInterval(function() {
                                me.requestFlag = true;
                                $(".pay-button").html("确认支付");
                            }, 500)
                        }

                    }
                })
            });

        },
        dataFill: function(data) {
            var that=this;
            var t = simpleTpl();
                count = data.jc;
            for (var i = 0; i < data.items.length; i++) {
                    var citem = this.$citem.clone();
                    citem.find(".goods-name").text(data.items[i].jt); //商品名称
                    citem.find(".goods-times").find("strong").text(data.items[i].jc);; //商品次数
                    this.$itemsShow.before(citem);
            };


            that.$allAccount = data.jcAll;
            that.$payContent.find(".gold-account").text(data.jcAll + "元宝");
            that.$payMain.removeClass("none");
            $(".pay-content .pay-pocket").find("strong").text(data.account);
        
            if (data.proUuid) {
                that.$submit.attr("data-collect-desc", "夺宝-支付(" + data.jt + ")");
                that.$submit.attr("data-collect-flag", "pay" + data.proUuid);
            }
            for (var i = 0; i < data.redItems.length; i++) {
                $(".red-show").removeClass("none");
                t._('<p>')
                    ._('<input type="radio" id="radio1" prize="' + data.redItems[i].redAccount + '" name="radio" class="regular-radio big-radio" data_uuid="' + data.redItems[i].redUuid + '" data_no="'+data.redItems[i].no +'"/>')
                    ._(' <label for="radio1"></label><span class="name">' + data.redItems[i].redname + '</span> <span class="prize">余额：' + data.redItems[i].redAccount + '元宝</span> <span class="timeout txt-grey font12">  (有效期：' + data.redItems[i].deadTime + ')</span>')

            }
            $(".button-holder").append(t.toString());
            if(data.redItems.length>=1)
            {
                var $defaultbtn = $(".button-holder p:first-child").find(".regular-radio");
                    $defaultbtn.attr("checked", "checked").addClass("ischecked");
                var discount = $defaultbtn.attr("prize");
                var rid = $defaultbtn.attr("data_uuid");
                var data_no = $defaultbtn.attr("data_no");
                     getResult("indianaPeriod/choseRed", {
                            no: data_no,
                            rid: rid
                    }, "indianaPeriodChoseRedCallBackHandler", true);
                    H.goodspaymore.event();
            };
            $(".button-holder p").click(function(e) {
                e.preventDefault();
                var discount = $(this).find(".regular-radio").attr("prize");
                var rid = $(this).find(".regular-radio").attr("data_uuid");
                var data_no = $defaultbtn.attr("data_no");
                if (!$(this).find(".regular-radio").hasClass("ischecked")) {
                    $(".button-holder p").each(function() {
                        $(this).find(".regular-radio").attr("checked", "false").removeClass("ischecked");
                    })
                    getResult("indianaPeriod/choseRed", {
                        no: data_no,
                        rid: rid
                    }, "indianaPeriodChoseRedCallBackHandler", true)
                    $(this).find(".regular-radio").attr("checked", "checked").addClass("ischecked");
                }
                return;
            });
            H.goodspaymore.event();
            // 点击流
        }
    }
    W.indianaPeriodDetailOrderMoreCallBackHandler = function(data) {
        if (data.result) {
            H.goodspaymore.dataFill(data);
        }
        else
        {
             showTips("啊哦，网络在开小差噢，稍后再试试吧~");
        }
    }
    W.indianaPeriodChoseRedCallBackHandler = function(data) {
        if (data.result) {
            $(".discount-number>strong").text(data.redAccount + "元宝");
            H.goodspaymore.$payContent.find(".gold-account").text((parseFloat(H.goodspaymore.$allAccount)-parseFloat(data.redAccount)).toFixed(2) + "元宝");
            H.goodspaymore.event();
        } else {
            $(".discount-number>strong").text("");
            H.goodspaymore.$payContent.find(".gold-account").text(parseInt(H.goodspaymore.$allAccount) + "元宝");
            H.goodspaymore.event();
        }
    };

})(Zepto);

$(function() {
    H.goodspaymore.init();
});
