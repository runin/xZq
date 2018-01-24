var page = 1,
    pageSize = 10,
    loadmore = true,
    lastlength = 0;
(function($) {
    H.secKillRecord = {
            btnBacktohome: $(".btn-backtohome"),
            noMore: $(".nomore"),
            body: $(".body"),
            winW: $(window).width(),
            section: $(".section"),
            outsec: $(".outsec"),
            black: $(".black"),
            pzBtnSure: $(".pz-btn-sure"),
            pzBtnCls: $(".pz-btn-cls"),
            imglist: null,
            pzList: null,
            pzlistShai: null,
            pzlistChgaddrs: null,
            section: null,
            black: null,
            requestFlag: true,
            init: function() {
                var me = this;
                me.scrolling();
                me.backPercenter();
                //me.applydata(1);
            },
            applydata: function(type, rid) {
                if (type == 1) {
                    getResult('seckill/myseckillorder', {
                        appId: busiAppId,
                        openid: openid,
                        pageSize: 100
                    }, 'indianaPeriodMyWinPeriodCallBackHandler');
                } else {
                    getResult('seckill/surerecive', {
                        rid: rid
                    }, 'sureReciveCallBackHandler');
                }
            },
            backPercenter: function() {
                var me = this;
                me.btnBacktohome.on("click", function() {
                    toUrl("../user/personcenter.html");
                });
            },
            scrolling: function() {
                getList(true);
                page++;
                var range = 180, //距下边界长度/单位px
                    maxpage = 100, //设置加载最多次数
                    totalheight = 0;

                $(".body").scroll(function() {
                    $('.loading-space').addClass('none');
                    var srollPos = $(window).scrollTop();
                    totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                    if (($(document).height() - range) <= totalheight && page < maxpage && loadmore) {
                        if (!$('.loading-space').hasClass('none')) {
                            console.log(!$('.loading-space').hasClass('none'));
                            return;
                        }
                        loadmore = false;
                        getList(true);
                        page++;
                    }
                    $('.loading-space').removeClass('none');
                });
            },
            even: function() {
                var me = this;
                me.outsec.css({ "height": "150px", "top": ($(window).height() - 150) * 0.5 + "px" });
                me.pzlistShai.on("click", function() {
                    var me = this;
                    if ($(me).attr("iss") == "1") {
                        me.black.css({ "display": "block", "-webkit-animation": "secup 0.3s", "animation-timing-function": "ease-out", "-webkit-animation-timing-function": "ease-out" }).one("webkitAnimationEnd", function() {
                            me.black.css({ "opacity": "0.5", "-webkit-animation": "" });
                            me.pzBtnSure.one("click", function() {
                                S.pzlist.makesure($(me));
                            });
                        });
                        me.outsec.css({ "display": "block", "-webkit-animation": "popup 0.3s", "animation-timing-function": "ease-out", "-webkit-animation-timing-function": "ease-out" }).one("webkitAnimationEnd", function() {
                            me.outsec.css({ "-webkit-animation": "" })
                        });
                    } else {
                        if (H.secKillRecord.requestFlag) {
                            H.secKillRecord.requestFlag = false;
                        } else {
                            return
                        }
                        $.ajax({
                                type: "GET",
                                dataType: "jsonp",
                                jsonp: "callback",
                                url: business_url + "seckorder/detail",
                                jsonpCallback: 'seckOrderDetailCallBackHandler',
                                data: {
                                    orderNo: $(me).attr("orderNo")
                                },
                                complete: function() {},
                                success: function(data) {
                                    if (data.result) {
                                        if (data.wxPayFlag) {
                                            location.href = data.payUrl + "&prefix=" + window.location.href.substr(0, window.location.href.indexOf('seckillrecord.html'));
                                        } else {
                                            toUrl("./seckillpay.html?orderNo=" + $(me).attr("orderNo"));
                                        }

                                    } else {
                                        hideLoading();
                                        showTips(data.message);
                                        setInterval(function() {
                                            H.secKillRecord.requestFlag = true;
                                        }, 500)
                                    }
                                }
                            })
                            // toUrl("share.html?rid=" + $(me).attr("rid"));
                    }
                });
                me.imglist.on("click", function() {
                    var me = this;
                    //toUrl("seckillview.html?data_uuid=" + $(me).attr("data-uuid"));
                });
                me.pzBtnCls.on("click", function() {
                    me.black.css({ "display": "block", "-webkit-animation": "secdown 0.3s", "animation-timing-function": "ease-in", "-webkit-animation-timing-function": "ease-in" }).one("webkitAnimationEnd", function() {
                        me.black.css({ "display": "none", "-webkit-animation": "" });
                    });
                    me.outsec.css({ "display": "block", "-webkit-animation": "popdown 0.3s", "animation-timing-function": "ease-in", "-webkit-animation-timing-function": "ease-in" }).one("webkitAnimationEnd", function() {
                        me.outsec.css({ "display": "none", "-webkit-animation": "" });
                    });
                });
                me.pzlistChgaddrs.on("click", function() {
                    var me = this;
                    if($(this).attr("stateflag") == "0") {
                        if (H.secKillRecord.requestFlag) {
                            H.secKillRecord.requestFlag = false;
                        } else {
                            return
                        }
                        $.ajax({
                            type: "GET",
                            dataType: "jsonp",
                            jsonp: "callback",
                            url: business_url + "seckorder/detail",
                            jsonpCallback: 'seckOrderDetailCallBackHandler',
                            data: {
                                orderNo: $(me).attr("orderNo")
                            },
                            complete: function() {},
                            success: function(data) {
                                if (data.result) {
                                    if (data.wxPayFlag) {
                                        location.href = data.payUrl + "&prefix=" + window.location.href.substr(0, window.location.href.indexOf('seckillrecord.html'));
                                    } else {
                                        toUrl("./seckillpay.html?orderNo=" + $(me).attr("orderNo"));
                                    }

                                } else {
                                    hideLoading();
                                    showTips(data.message);
                                    setInterval(function() {
                                        H.secKillRecord.requestFlag = true;
                                    }, 500)
                                }
                            }
                        })
                        return;
                    }
                    toUrl("seckilladdresscheck.html?rid=" + $(me).attr("rid"));
                });
            },
            floatshow: function() {
                var me = this;
                me.body.children().first().before('<div class="pzlist-tips"><p><span>中奖收货之后别忘了晒单哦，晒单完成系统审核成功后奖励夺宝代金券！</span><span>中奖收货之后别忘了晒单哦，晒单完成系统审核成功后奖励夺宝代金券！</span></p></div>');
                $(".pzlist-tips>p").css({ "-webkit-animation": "floatshow 12s infinite", "animation-timing-function": "linear", "-webkit-animation-timing-function": "linear" }).on("webkitAnimationEnd", function() {});
            },
            makesure: function(self) {
                var me = this;
                showLoading("", "正在提交");
                me.applydata(2, self.attr("id"));
            },
            info: function(data) {
                var me = this;
                for (var i = 0; i < data.items.length; i++) {
                    var infoData = "";
                    var infoLabel = data.items[i].pn;
                    var infoImg = data.items[i].pi;
                    // var infoWhitch = "(第" + data.items[i].pt + "期)";
                    var infoNumberall = data.items[i].rn; //秒杀价
                    var infoLucknumb = data.nk; //秒杀人
                    var infoLuckdate = data.items[i].crt; //秒杀时间
                    var infoJointime = data.items[i].c;
                    var infoStatu = data.items[i].rs; //秒杀状态
                    var infoFlag = data.items[i].ps; //订单支付状态
                    var infoAdd = data.items[i].puuid;
                    var infoRid = data.items[i].rid; //秒杀订单id
                    var orderNo = data.items[i].orderNo; //秒杀订单号

                    infoData += '<div class="his-label isover list">';
                    infoData += '<a href="#" class="pzlist-chgaddrs" stateflag="' + infoFlag + '" orderNo="' + orderNo +'" rid="' + infoRid + '" data-collect="true" data-collect-flag="pzlist-chgaddrs" data-collect-desc="秒杀纪录-确认地址">></a>';
                    infoData += '<img src=' + infoImg + ' onload="H.secKillRecord.resize(this)" onerror="$(this).attr(\'src\',\'../../images/goods-snone.png\')" data-uuid=' + infoAdd + ' class="imglist"/>';
                    infoData += '<div class="his-label-r ' + infoAdd + '">';
                    // infoData += '<div><h2 class="red">' + infoWhitch + '</h2>' + infoLabel + '</div>';
                    infoData += '<p>' + infoLabel + '</p>';
                    infoData += '<p>秒杀价：<span class="txt-red">' + infoNumberall + '</span>元</p>';
                    infoData += '<p>秒杀人：' + infoLucknumb + '</p>';
                    infoData += '<p>揭晓时间：' + infoLuckdate + '</p>';
                    if (data.items[i].sureresult == false && (data.items[i].sure == true)) {
                        infoData += '<p>商品状态：' + infoStatu + '<a href="#" rid="' + infoAdd + '" id="' + infoRid + '" class="pzlist-shai" style="width:60px" iss="1" data-collect="true" data-collect-flag="pzlist-shai" data-collect-desc="秒杀纪录-确认收货地址">确认收货</a></p>';
                    } else if (infoFlag == 0) {
                        infoData += '<p>商品状态：' + infoStatu + '<a href="#" orderNo="' + orderNo + '" class="pzlist-shai" iss="2" data-collect="true" data-collect-flag="pzlist-shai" data-collect-desc="秒杀纪录-去付款">去付款</a></p>';
                    } else {
                        infoData += '<p>商品状态：' + infoStatu + '</p>';
                    }

                    infoData += '</div>';
                    infoData += '</div>';
                    me.pzList = $(".pzlist");

                    me.pzList.append(infoData.toString());
                    var thisLabel = $("." + infoAdd);
                    // thisLabel.css("height", (thisLabel.find("div").height() + 80) + "px");
                    // thisLabel.parent().css("height", (thisLabel.find("div").height() + 80) + "px");
                    // thisLabel.parent().find("img").css("top", ((thisLabel.find("div").height() - 2) * 0.5) + "px");
                }
                // $(".his-label-r").css("width", (me.winW - 102) + "px");
                me.imglist = $(".imglist");
                me.pzlistShai = $(".pzlist-shai");
                me.pzlistChgaddrs = $(".pzlist-chgaddrs");
                me.even();

            },
            resize: function(self) {
                var thisLabel = $(self).parent().find('.his-label-r');
                $(self).css("margin-top", (thisLabel.height() - 80) / 2 + "px");
                // thisLabel.parent().css("height", (thisLabel.find("div").height() + 80) + "px");
                // thisLabel.parent().find("img").css("top", ((thisLabel.find("div").height() - 2) * 0.5) + "px");
            },

        }
        // 查询所有参与者的信息
    W.getList = function(showloading) {
        getResult('seckill/myseckillorder', {
            appId: busiAppId,
            openid: openid,
            pageSize: pageSize,
            page: page,
        }, 'mySeckillOrderCallBackHandler');
    }
    W.mySeckillOrderCallBackHandler = function(data) {

        if (data.result) {
            $('.loading-space').removeClass('none');
            var items = data.items || [],
                len = items.length;
            lastlength = len;
            if (len < pageSize) {
                loadmore = false;
                $('.loading-space').html(' --已到达列表底部--');
            } else {
                loadmore = true;
                $('.loading-space').html(' --上拉显示更多--');
            }
            //调用用户列表函数
            H.secKillRecord.info(data);

        } else {
            loadmore = false;
            if (lastlength == pageSize) {
                $('.loading-space').removeClass('none');
                $('.loading-space').html(' --已到达列表底部--');
            } else {

                $('.loading-space').removeClass('none');
                $('.loading-space').css("line-height", "100px")
                $('.loading-space').html(' --您还没有秒杀记录--');
                // H.secKillRecord.noMore.css({ "height": "80px", "line-height": "30px", "margin-top": "20px" }).html("您还没有中奖记录，<br/>只需一元即有机会获得大奖哦，赶紧参与吧");
                // H.secKillRecord.body.append('<a href="#" class="toindex click-btn" data-collect="true" data-collect-flag="priz-toindex" data-collect-desc="中奖记录-去首页">立即夺宝</a>');
                // $(".toindex").one("click", function() {
                //     toUrl("../../index.html");
                // })
            }
        }
    }

    W.sureReciveCallBackHandler = function(data) {
        hideLoading();
        if (data.result == true) {
            showLoading("", "提交成功");
            setTimeout(function() {
                toUrl("seckillrecord.html");
            }, 2000);
        }
    }
    H.secKillRecord.init();
})(Zepto)
