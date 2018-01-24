(function($) {
    H.secKillView = {
        pid: getQueryString("data_uuid"),
        $body: $("body"),
        $particleMessage: $(".btn-message"),
        $btnSecKill: $(".btn-seckill"),
        $nextJoin: $(".next-editor"),
        $detailCountdown: $(".detail-countdown"),
        $joinOver: $(".join-over"),
        $btnWrap: $(".btn-wap"),
        $beforeSeckill: $(".before-seckill"),
        $openCountdown: $(".open-countdown"),
        $detailImage: $(".duobao-detail-image"),
        $canbuy: $(".canbuy"),
        requestFlag: true,
        timeflag: false,
        dec: 0,
        type: 1,
        index: 0,
        isTimeOver: false,
        paycount: 0,
        init: function() {
            var me = this;
            //showLoading($("body"), "努力加载中");
            //me.eventHander();
            me.periodDetail();
            me.seckillticketList();
            $(window).scrollTop(0);
        },
        // 获取本期活动详情
        periodDetail: function() {
            var me = this;

            getResult("seckill/detail", { infouid: me.pid }, "callBackSeckillDetailHandler", true);
        },
        periodNextTime: function(period) {
            getResult("indianaPeriod/checkNextPeriod", { uuid: goods_ppuuid, period: period }, "indianaPeriodCheckNextPeriodCallBackHandler", false);
        },
        seckillticketList: function() {
            var me = this;
            getResult("seckorder/list", { pid: me.pid, pageSize: 20, page: 1 }, "seckOrderListCallBackHandler");
        },
        // 预约接口
        secKillOrder: function(uuid) {
            getResult("seckill/orderwarn", { appId: busiAppId, openid: openid, pid: uuid }, "seckillOrderWarnCallBackHandler");
        },
        // 中奖用户列表
        userRecord: function(data) {
            var me = this;
            var t = simpleTpl();
            for (var i = 0; i < data.length; i++) {
                t._('<li>')
                    ._('<div class="winner-box">')
                    ._('<i class="ico ico-label ico-label-winner"></i>')
                    ._('<div class="avatar">')
                    ._('<img width="40" height="40" onerror="this.src=\'..\/..\/images/avatar.png\'" src="' + data[i].hi + '">')
                    ._('</div>')
                    ._('<div class="winner-infor">')
                    ._('<p><span>秒杀者：</span><span class="user-name">' + data[i].nk + '</span><span class="address txt-grey">' + data[i].ad + '</span>(' + data[i].ip + ')</p>')
                    ._('<p><span>秒杀时间：</span><span class="local-times">' + data[i].ct + '</span></p>')
                    ._('</div> </div></li>')
            };
            me.$joinOver.removeClass("none");
            me.$joinOver.empty();
            me.$joinOver.append(t.toString());
        },
        eventHander: function() {
            var me = this;
            me.$particleMessage.on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                var beginTime = me.$detailCountdown.attr("etime");
                var nowTime = new Date().getTime();
                var timeDesc = (parseInt(beginTime) + me.dec) - nowTime;
                if (timeDesc >= 5 * 60 * 1000) {
                    me.secKillOrder(me.pid);
                } else if (timeDesc >= 0) {
                    me.dialogShow(1);
                }
            })

            me.$beforeSeckill.click(function() {
                showTips("秒杀尚未开始");

            });
            // 图文详情
            me.$detailImage.click(function() {
                toUrl("./seckillimgdetail.html?data_uuid=" + me.pid);
            });
            // 图文详情
            me.$nextJoin.click(function() {
                toUrl("../../index.html");
            });
            me.$btnSecKill.click(function() {
                me.$btnSecKill.html("秒杀中<span class='sp1'></span><span class='sp2'></span><span class='sp3'></span>");
                showLoading();
                if (me.requestFlag) {
                    me.requestFlag = false;
                } else {
                    return;
                }

                // 调用订单详情
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    url: business_url + "seckill/submitOrder",
                    jsonpCallback: 'seckillSubmitOrderCallBackHandler',
                    data: {
                        appId: busiAppId,
                        openid: openid,
                        qid: me.pid,
                        paycount: me.paycount,
                        nk: encodeURI((nickname ? nickname : "匿名")),
                        hi: headimgurl,
                        procount: "1",
                    },
                    complete: function() {

                    },
                    success: function(data) {
                        if (data.result) {
                            if (data.wxPayFlag) {
                                location.href = data.payUrl + "&prefix=" + window.location.href.substr(0, window.location.href.indexOf('seckillview.html'));
                            } else {
                                toUrl("../seckill/seckillpay.html?orderNo=" + data.ordreNo);
                            }
                            me.requestFlag = true;
                        } else {
                            hideLoading();
                            showTips(data.message);
                            setTimeout(function() {
                                me.requestFlag = true;
                                $(".btn-submit").text("立即秒杀");
                            }, 500);
                        }
                    }
                })
            });
        },
        //判断活动是否是开奖后
        prizeTime: function(data) {
            var me = this;
            var t = simpleTpl();
            var infor = [];
            var pbi = data.bigimg.split(",");
            if (!$('#slider').hasClass("ui-slider")) {
                for (var i = 0; i < pbi.length; i++) {
                    t._('<div><img src="' + pbi[i] + '" class="goods-img" onerror="$(this).attr(\'src\',\'..\/..\/images\/goods-bnone.png\')"></div>')
                }
                $(".goods-warp").find("#slider").append(t.toString());
                $('#slider').slider({ imgZoom: true });
                $(".ui-slider-dots").css("margin-left", -$(".ui-slider-dots").width() / 2);

                infor.push('<p><span class="goods-name">' + data.pdName + '</span></p>')
                infor.push('<p class="font13"><strong class="num-needs txt-red">秒杀价：' + data.killprice + '元</strong>&nbsp;&nbsp;&nbsp;&nbsp;<del class="num-needs">原价：' + data.origprice + '元</del></p>')
                me.$canbuy.append($(infor.join("")));
            }
            // var pbi = ["http://cdn.holdfun.cn/tttj/mpAccount/resources/images/2016/03/01/ce148f29714c41c2b41642ffcf98dacc.jpg", "http://cdn.holdfun.cn/tttj/mpAccount/resources/images/2016/03/01/ce148f29714c41c2b41642ffcf98dacc.jpg"]

            if (data.state == 0) {
                me.beforeShowCountdown(data.stime);
            } else if (data.state == 1) {
                me.nowCountdown(data.totalend);
            } else {
                me.change();
            }
            me.eventHander();

        },
        // 开奖开启倒计时
        beforeShowCountdown: function(pra) {
            var me = this;
            var beginTimeLong = 0;
            H.secKillView.type = 1;

            beginTimeLong = timestamp(pra);
            beginTimeLong += H.secKillView.dec;

            $(".countdown-tip").html('距离本场秒杀开始   ');
            $('.detail-countdown').attr('etime', beginTimeLong);
            H.secKillView.count_down();
            me.$openCountdown.removeClass("none");
            me.$joinOver.addClass("none");
            me.$btnWrap.removeClass("none");
            me.$btnSecKill.addClass("none");
            me.$nextJoin.addClass("none");
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra) {
            var me = this;
            var beginTimeLong = 0;
            H.secKillView.type = 2;
            beginTimeLong = timestamp(pra);
            beginTimeLong += H.secKillView.dec;
            $('.detail-countdown').attr('etime', beginTimeLong);
            $('.detail-countdown').removeAttr('stime');
            $(".countdown-tip").html("距离秒杀结束还有   ");
            H.secKillView.count_down();
            me.$openCountdown.removeClass("none");
            me.$joinOver.addClass("none");
            me.$btnWrap.addClass("none");
            me.$btnSecKill.removeClass("none");
            me.$nextJoin.addClass("none");

        },
        change: function() {
            var me = this;
            me.$openCountdown.addClass("none");
            me.$joinOver.removeClass("none");
            me.$btnSecKill.addClass("none");
            me.$btnWrap.addClass("none");
            me.$nextJoin.removeClass("none");
            me.seckillticketList();
        },
        count_down: function() {
            var that = this;
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%</span>' + ':' + '<span class="fetal-H">%M%</span>' + ':' + '<span class="fetal-H">%S%</span>' + '.' + '<span class="fetal-H">%ms%</span>', // 还有...结束
                    stpl: '<span class="fetal-H">%H%</span>' + ':' + '<span class="fetal-H">%M%</span>' + ':' + '<span class="fetal-H">%S%</span>' + '.' + '<span class="fetal-H">%ms%</span>', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if (!H.secKillView.isTimeOver && H.secKillView.type == 1) {
                            $('.countdown-tip').html('请稍后');
                            H.secKillView.periodDetail();
                            H.secKillView.isTimeOver = true;
                            console.log("1");
                            H.secKillView.type == 3;
                        } else if (!H.secKillView.isTimeOver && H.secKillView.type == 2) {
                            $('.countdown-tip').html('请稍后');
                            H.secKillView.isTimeOver = true;
                            H.secKillView.periodDetail();
                            H.secKillView.type == 3;
                        } else if (H.secKillView.type == 3) {
                            return;
                        }

                    },
                    sdCallback: function() {
                        H.secKillView.isTimeOver = false;
                    }
                });
            });
        },
        statusShow: function(status) {
            var me = this;
            //0(开始5分钟之前),1(开始5分钟之内),2(正在秒杀或秒杀结束)
            switch (status) {
                case 0:
                    me.dialogShow(0);
                    break;
                case 1:
                    me.dialogShow(1);
                    break;
                case 2:
                    break;
                default:
                    break;
            }
        },
        dialogShow: function(status) {
            var t = simpleTpl();
            if (status == 0) {
                t._('<section class="modal">')
                    ._('<div class="msgbox" >')
                    ._('<div class="msgbox-bd">')
                    ._('<p class="msgbox-title">秒杀提醒设置成功！</p>')
                    ._('<p>我们将提前5分钟提醒您！</p>')
                    ._('<p>请注意查看公众号通知。&nbsp;&nbsp;</p>')
                    ._('</div>')
                    ._('</div>')
                    ._('</section>')
            } else {
                t._('<section class="modal">')
                    ._('<div class="msgbox" onclick="$(this).closest(\'.modal\').remove()">')
                    ._('<div class="msgbox-bd">')
                    ._('<p>秒杀马上开始,</p>')
                    ._('<p>请不要离开哦~</p>')
                    ._('</div>')
                    ._('</div>')
                    ._('</section>')
            }

            H.secKillView.$body.append(t.toString());
            var height = $(window).height(),
                MsgH = $(".msgbox").height();
            $(".msgbox").css({
                'top': (height - MsgH) / 2,
            });
            $(".msgbox").click(function() {
                $(this).closest('.modal').remove();
            })
        },
    };

    W.seckillOrderWarnCallBackHandler = function(data) {
            if (data.result) {
                if (data.ro) {
                    if (data.order) {
                        H.secKill.statusShow(1);
                    } else {
                        H.secKill.statusShow(0);
                    }
                } else {
                    showTips("您已经预约过了！")
                }
            } else {

            }
        }
        /*===================================
            获取本期商品详情
        ====================================*/
    W.callBackSeckillDetailHandler = function(data) {
        if (data.result) {
            $(".content").removeClass("none");
            H.secKillView.prizeTime(data);
            H.secKillView.dec = new Date().getTime() - data.time;
            H.secKillView.paycount = data.killprice;
            hideLoading();
        } else {
            showTips("啊哦，网络在开小差噢，稍后再试试吧~");
        }
    }
    W.seckOrderListCallBackHandler = function(data) {
        if (data.result) {
            H.secKillView.userRecord(data.items);
        } else {
            //showTips("啊哦，网络在开小差噢，稍后再试试吧~");
        }
    }
})(Zepto);

$(function() {
    H.secKillView.init();
});
