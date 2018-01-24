(function($) {
    var state = 0;
    var page = 1;
    var ps = 10;
    var pageSize = 10;
    H.redpacket = {

        init: function() {
            var me = this;
            me.navEvent();
            me.scrolling(0);
            //me.getCardId();
            // me.ticketListFill();
        },
        navEvent: function() {
            var me = this;
            $(".nav-item-left").click(function() {
                page = 1;
                if ($(this).hasClass("nav-item-on")) {
                    return
                }
                $(this).addClass("nav-item-on");
                $(".nav-item-right").removeClass("nav-item-on")
                me.scrolling(0);
            });
            $(".nav-item-right").click(function() {
                page = 1;
                if ($(this).hasClass("nav-item-on")) {
                    return
                }
                me.scrolling(3);
                $(this).addClass("nav-item-on");
                $(".nav-item-left").removeClass("nav-item-on");
                $(".nav-item-left").find("span").removeClass("txt-red");
            });
            $(".btn-backtohome").click(function() {
                toUrl("personcenter.html");
            });
        },
        ticketListFill: function(data) {
            var t = simpleTpl(),
                redState = "",
                stateValid = "",
                redType0 = "",
                redType1 = "";
            for (var i = 0; i < data.length; i++) {
                // 判断红包状态
                if (parseInt(data[i].rs) == 0) {
                    stateValid = "valid";
                    redState = "马上使用";
                } else
                if (parseInt(data[i].rs) == 1) {
                    redState = "已使用";
                    stateValid = "";
                } else if (parseInt(data[i].rs) == 2) {
                    redState = "已过期";
                    stateValid = "";
                } else {
                    redState = "已过期";
                    stateValid = "";
                }
                // 判断红包类型 
                if (data[i].tp == "0" || data[i].tp == undefined) {
                    redType0 = "show";
                    redType1 = "none";
                } else {
                    redType0 = "none";
                    redType1 = "show";
                }
                t._('<li data-ticketId="' + data[i].ruid + '" class="grey-click-bg ' + stateValid + '">')
                    ._('<div class="left-box">')
                    ._('<img src="' + data[i].ri + '" onerror="$(this).attr(\'src\',\'..\/..\/images\/goods-snone.png\')">')
                    ._('</div>')
                    ._('<div class="right-box">')
                    ._('<p class="ticket-name font14">' + data[i].rn + '</p>')
                    ._('<p class="ticket-prize font12 ' + redType0 + '">余额：<strong class="txt-red">' + data[i].ra + '元宝</strong></p>')
                    ._('<p class="ticket-prize font12 ' + redType1 + '">折扣：<strong class="txt-red">' + parseFloat(data[i].dc) / 10.0 + '折</strong></p>')
                    ._('<p class="ticket-time font12">有效期：' + data[i].rd + '</p>')
                    ._('<p class="ticket-infor txt-goldy font12">' + data[i].rr + '</p>')
                    ._(' <p><a href="#" class="status status-valid font14" data-collect="true" data-collect-flag="tt-duobao-my-redpacket-exchange" data-collect-desc="天天夺宝-我的代金券-马上兑换" >' + redState + '</a></p>')
                    ._('</div>')
                    ._('</li>')

            }
            $(".red-list ul").append(t.toString());
            $(".red-list ul li").each(function(index) {
                var me = this;
                $(me).find(".left-box").css("margin-top", ($(me).height() - $(me).find(".left-box").height()) / 2 - 8)

            })
            $(".red-list li").click(function() {
                if (!$(this).hasClass("valid")) {
                    return;
                } else {
                    redId = $(this).attr("data-ticketId");
                    toUrl("../../allgoods.html?redId=" + redId);
                }

            })

        },
        scrolling: function(state) {
            var me = this;
            ticketListGet(state, true);
            page++;

            var range = 180, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;
            lastlength = 0;
            loadmore = true;
            $(".red-list ul").empty();
            $('.loading-space').addClass('none');
            $(window).scroll(function() {
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if (($(document).height() - range) <= totalheight && page < maxpage && loadmore) {
                    if ($('.loading-space').hasClass('none')) {
                        console.log($('.loading-space').hasClass('none'));
                        return;
                    }
                    if ($(".nav-item-right").hasClass("nav-item-on")) {
                        ticketListGet(3, true);
                    } else {
                        ticketListGet(0, true);
                    }
                    page++;
                    $('.loading-space').addClass('none');
                }
            });
        },
        //获得卡卷信息
        getCardId: function() {
            getResult("wx/getCardId", { kind: 1 }, "cardIdCallBackHandler", true);
        },
        //拉起卡卷信息
        wxChooseCard: function() {
            getResult("wx/cardInfo/" + busiAppId, {}, "cardInfoCallBackHandler", false);
        }
    }
    W.cardIdCallBackHandler = function(data) {
        if (data.result) {
            if (data.cardId) {
                wx.ready(function() {
                    H.redpacket.wxChooseCard(data.cardId);
                });
            } else {
                showTips("稍后再试试吧~");
            }
        } else {
            showTips("啊哦，网络在开小差噢，稍后再试试吧~");
        }
    };
    W.ticketListGet = function(state, loading) {
        getResult("indianaredpack/record/list", {
            page: page,
            ps: ps,
            appId: busiAppId,
            openid: openid,
            state: state
        }, "indianaRedpackRecordListCallBackHandler", loading);
    };
    W.indianaRedpackRecordListCallBackHandler = function(data) {
        if (data.cnt) {
            $(".red-title .nav-item-left").find(".num").text("(" + data.cnt + ")");
        }

        $('.loading-space').removeClass('none');
        if (data.result) {
            var items = data.items || [],
                len = items.length,
                t = simpleTpl();
            lastlength = len;
            if (len < pageSize) {
                loadmore = false;
                $('.loading-space').html(' --没有更多了--');
            } else {
                $('.loading-space').html(' --上拉显示更多--');
            }
            H.redpacket.ticketListFill(data.items);

        } else {
            if (lastlength == pageSize) {
                loadmore = false;
                $('.loading-space').html(' --没有更多了--');
            } else {
                $('.loading-space').html(' --没有代金券--').css("top", "36px");
            }

        }
    }
    W.cardInfoCallBackHandler = function(data) {
        if (data.result) {
            var timestamp = data.message.timestamp;
            var nor_sr = data.message.nonr_str;
            var sigature = data.message.signature;
            //var cardId = data.message.cardId;
            // alert(cardId);
            //拉起卡卷列表
            $(".ticketCard").bind("click", function(e) {
                e.preventDefault();
                $(".ticketCard").css({
                    "-webkit-animation-name": "ft",
                    "-webkit-animation-iteration-count": "1",
                    "-webkit-animation-duration": ".6s"
                });
            });
            $(".ticketCard").on("webkitAnimationEnd", function() {
                $(".ticketCard").css({
                    "-webkit-animation": ""
                });
                //核销卡卷
                wx.chooseCard({
                    timestamp: timestamp, // 卡券签名时间戳
                    nonceStr: nor_sr, // 卡券签名随机串
                    cardSign: sigature, // 卡券签名
                    // cardId: cardId, // 卡券签名
                    success: function(res) {
                        var cardInfo = JSON.parse(res.cardList);
                        var code = cardInfo[0].encrypt_code; //获取用户卡卷code
                        var cardId = cardInfo[0].card_id;
                        getResult("wx/rechargeRedNew", {
                            appId: busiAppId,
                            openId: openid,
                            qfOpenid:tttj_openid,
                            code: encodeURIComponent(code),
                            cardId:cardId
                        }, "rechargeRedNewCallBackHandler", false);
                    }
                });
            });
            //拉起卡卷结束
        } else {
            showTips("获取卡卷信息失败");
        }
    };
    W.rechargeRedNewCallBackHandler = function(data) {
        if (data.result) {
            showTips("代金券兑换成功!");
            page = 1;
            state = 0;
            H.redpacket.scrolling(0);
        } else {
            showTips("啊哦，网络在开小差噢，稍后再试试吧~");
        }
    };


})(Zepto);

$(function() {
    H.redpacket.init();
    wx.ready(function() {
        H.redpacket.wxChooseCard();
    });
});
