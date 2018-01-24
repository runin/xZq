(function($) {
    H.index = {
        nowTime: null,
        from: getQueryString('from'),
        $btnJoin: $('#btn-join'),
        $btnReserve: $('#btn-reserve'),
        $btnrule: $('#btn-rule'),
        flag: false,
        pal: null,
        init: function() {
            var winW = $(window).width(),
                winH = $(window).height();
            this.event();
            //this.prereserve();
        },
        event: function() {
            var bgH = $(window).width()*1.8;
            $(".bg").css("height",(bgH));
            $(".out-link1").css("top",(bgH*0.2)).on("click", function () {
                shownewLoading();
                setTimeout(function () {
                    window.location.href = "http://yhq.yuanbenyun.net/Coupon/ReceiveCoupon";
                },2000);
            });
            $(".out-link2").css("top",(bgH*0.2)).on("click", function () {
                shownewLoading();
                setTimeout(function () {
                    window.location.href = "http://yhq.yuanbenyun.net/ClientInfo/cardbag";
                },2000);
            });
            $(".out-label1").css("top",(bgH*0.43));
            $(".out-label2").css("top",(bgH*0.68));
            $(".copyright").css("top",(bgH - 35));
            $(".AD1").on("click", function () {
                shownewLoading();
                setTimeout(function () {
                    window.location.href = "http://mp.weixin.qq.com/s?__biz=MjM5ODg0MjgzNA==&mid=400755330&idx=1&sn=bd481bf04533d6497dd76f73359d1895#rd"
                },2000);
            });
            $(".AD2").on("click", function () {
                shownewLoading();
                setTimeout(function () {
                    window.location.href = "http://mp.weixin.qq.com/s?__biz=MjM5ODg0MjgzNA==&mid=400764584&idx=1&sn=b5627bd41befe0d378aecaa852184229#rd";
                },2000);
            });
            $(".AD3").on("click", function () {
                shownewLoading();
                setTimeout(function () {
                    window.location.href = "http://mp.weixin.qq.com/s?__biz=MjM5ODg0MjgzNA==&mid=400764803&idx=1&sn=386bfd33427d4e185aad8c0d702d9c29#rd";
                },2000);
            });
            this.$btnReserve.click(function(e) {
                e.preventDefault();
                var reserveId = $(this).attr('data-reserveid');
                var date = $(this).attr('data-date');
                if (!reserveId || !date) {
                    return;
                };
                window['shaketv'] && shaketv.reserve_v2({
                    tvid: yao_tv_id,
                    reserveid: reserveId,
                    date: date
                }, function(d) {
                    if (d.errorCode == 0) {
                        H.index.$btnReserve.addClass('none');
                    }
                });
            });
        },
        prereserve: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'api/program/reserve/get',
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackProgramReserveHandler',
                success: function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                        tvid: yao_tv_id,
                        reserveid: data.reserveId,
                        date: data.date
                    }, function(resp) {
                        if (resp.errorCode == 0) {
                            me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                        }
                    });
                }
            });
        },
        cookieSave: function(data) {
            if($.fn.cookie(data))
             {
                 showTips("你已经参与次摇奖");
                 return false;

             }
             else
             {
                var exp = new Date();
                exp.setTime(exp.getTime() + 60 * 1000 * 60 * 6);
                $.fn.cookie(data, 1, {
                    expires: exp
                });
                return true;
            }
        }
    };
})(Zepto);
$(function() {
    H.index.init();
});