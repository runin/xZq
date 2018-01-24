var countNum = 0;
var interval = null;
(function($) {
    H.seckillsuccess = {
        $sduobaoContinue: $(".duobao-continue"),
        $viewRecord: $(".view-record"),
        orderNo:getQueryString("orderNo"),
        init: function() {
            var me = this;
            me.event();
            me.successDateGet(true);
        },
        successDateGet: function(showloading) {
            var me = this;
            getResult("seckorder/detail", {orderNo:me.orderNo}, "seckOrderDetailCallBackHandler", showloading);
        },

        //获取购买的夺宝号码
        num_list: function(data) {
            var t = simpleTpl();
            var label = '<li>夺宝号码：</li>';
            for (var i = 0; i < data.length; i++) {
                t._('<li>' + data[i] + '</li>')
            };
            $(".num-list").append(label + t.toString());
        },
        event: function() {
            var me = this;
            me.$sduobaoContinue.click(function() {

                toUrl("../../index.html");
            });
            me.$viewRecord.click(function() {

                toUrl("../seckill/seckillrecord.html");
            });
        }
    }
    W.seckOrderDetailCallBackHandler = function(data) {
        if (data.result) {
            hideLoading();
            if (interval) {
                clearInterval(interval);
            }
           
            $(".prizelist").find(".goods-name").text(data.pn);
            $(".prizelist").find(".txt-red").text(data.jc);
            $(".prize-infor").removeClass("none");
            $(".tt-link-tips").removeClass("none");
            $(".tt-phone-tips").addClass("none");

        } else {
            showLoading();
            interval = setInterval(function() {
                if (countNum++ > 2) {
                    hideLoading();
                    clearInterval(interval);
                } else {
                    H.seckillsuccess.successDateGet(false);
                }

            }, 1000);
            $(".tt-link-tips").removeClass("none").html("网络在开小差哦...请稍后再试");
            $(".prize-infor").addClass("none");
        }
    }

})(Zepto);

$(function() {
    H.seckillsuccess.init();
});
