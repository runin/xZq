(function($) {
    H.seckilladdresscheck = {
        addsBtn: $(".adds-btn"),
        body: $(".chkaddress-label"),
        chkUuid: getQueryString("rid"),
        chooseAdd: $(".choose-add"),
        chooseChsaddrs: $(".choose-chsaddrs"),
        chooseSure: $(".choose-sure"),
        chooseTip: $(".choose-tip"),
        chooseIssure: $(".choose-issure"),
        addsLabel: $(".adds-label"),
        btnBacktohome: $(".btn-backtohome"),
        winW: $(window).width(),
        isLoad:false,
        init: function() {
            var me = this;
            me.even();
            me.chooseIssure.off();
            me.applydata(0);
        },
        applydata: function(type) {
            showLoading();
            var me = this;
            if (type == 0) {
                getResult('seckorder/detailmywinorder', {
                    rid: me.chkUuid,
                    openid: openid
                }, 'seckillDetailMyWinOrderCallBackHandler');
            } else if (type == 1) {
                getResult('consignee/query', {
                    appId: busiAppId,
                    openId: openid
                }, 'callBackQueryConsigneeHandler');
            } else if (type == 2) {
                getResult('seckorder/sureadd', {
                    rid: me.chkUuid,
                    aid: me.addsId
                }, 'seckillSureAddCallBackHandler');
            }
        },
        even: function() {
            var me = this;
            me.btnBacktohome.on("click", function() {
                toUrl("../user/personcenter.html");
            });
            me.chooseChsaddrs.on("click", function() {
                me.body.css({ "display": "block", "-webkit-animation": "popup 0.3s", "animation-timing-function": "ease-out", "-webkit-animation-timing-function": "ease-out" }).one("webkitAnimationEnd", function() {
                    me.body.css({ "-webkit-animation": "" })
                });
            });
            me.chooseSure.on("click", function() {
                H.seckilladdresscheck.applydata(2);
            });
            me.addsBtn.on("click", function() {
                toUrl("seckilladdressadd.html?type=" + me.chkUuid);
            });
            me.chooseAdd.on("click", function() {
                toUrl("seckilladdressadd.html?type=" + me.chkUuid);
            });
        },
        chooseadds: function(data) {
            var me = this;
            me.addsId = data.id;
            me.body.css({ "display": "block", "-webkit-animation": "popdown 0.3s", "animation-timing-function": "ease-in", "-webkit-animation-timing-function": "ease-in" }).one("webkitAnimationEnd", function() {
                me.body.css({ "display": "none", "-webkit-animation": "" })
            });
            //me.body.css("display","none");
            me.chooseIssure.css("display", "block");
            H.seckilladdresscheck.info(me.chkaddsData, 2);
            me.chooseTip.css("display", "none");
            //me.chooseChsaddrs.css("display","none");
            me.chooseAdd.css("display", "none");
            me.chooseSure.css("display", "block");
        },
        info: function(data, type) {
            var me = this;
            if (type == 0) {
                // if (me.chkUuid == data.rid) {
                    var infoData = "";
                    var infoLabel = data.pn;
                    var infoImg = data.pi;
                    // var infoWhitch = "(第" + data.pt + "期)";
                    var infoNumberall = data.rn;//秒杀价格
                    var infoLucknumb = data.pw;
                    var infoLuckdate = data.crt;
                    var infoJointime = data.c;
                    var infoStatu = data.rs;
                    var infoAdd = data.puuid;
                    infoData += '<div class="his-label isover">';
                    //infoData += '<a href="#" class="pzlist-chgaddrs" uuid="' + infoAdd + '" data-collect="true" data-collect-flag="pzlist-chgaddrs" data-collect-desc="中奖纪录-确认地址">></a>';
                    infoData += '<img src=' + infoImg + ' onload="H.seckilladdresscheck.resize(this)" onerror="$(this).attr("src","../../images/avatar.png")" />';
                    infoData += '<div class="his-label-r ' + infoAdd + '">';
                    infoData += '<p>' + infoLabel + '</p>';
                    infoData += '<p>秒杀价：<span class="txt-red">' + infoNumberall + '</span>元</p>';
                    infoData += '<p>揭晓时间：' + infoLuckdate + '</p>';
                    infoData += '<p>商品状态：' + infoStatu + '</p>';
                    infoData += '</div>';
                    infoData += '</div>';
                    me.pzList = $(".pzlist");
                    if (me.pzList.children().length == 0) {
                        me.pzList.append(infoData.toString());
                    } else {
                        me.pzList.children().first().before(infoData.toString());
                    }
                    // var thisLabel = $("." + infoAdd);
                    // thisLabel.css({"height":(thisLabel.find("div").height() + 80) + "px","padding":"6px 0px"});
                    // thisLabel.parent().css("height", (thisLabel.find("div").height() + 80) + "px");
                    // thisLabel.parent().find("img").css("top", ((thisLabel.find("div").height() - 2) * 0.5) + "px");
                //}
            } else {
                for (var a = 0; a < data.message.length; a++) {
                    var infoData = "";
                    var userName = data.message[a].consignee;
                    var userTel = data.message[a].telphone;
                    var userID = data.message[a].id;
                    var isNormal = "";
                    var userAdds = data.message[a].address;
                    if ((type == 2) && (me.addsId == userID)) {
                        infoData += '<div class="adds-label" id="' + userID + '">';
                    } else if (data.message[a].isDefault == 1) {
                        infoData += '<div class="adds-label" onclick="H.seckilladdresscheck.chooseadds(this)" id="' + userID + '">';
                    } else {
                        infoData += '<div class="adds-label" onclick="H.seckilladdresscheck.chooseadds(this)" id="' + userID + '">';
                    }
                    infoData += '<span>' + userName + '</span>';
                    infoData += '<h5>' + userTel + '</h5>';
                    infoData += '<div>' + isNormal + userAdds + '</div>';
                    infoData += '</div>';
                    me.addsLabel = $(".adds-label");
                    if ((type == 2) && (me.addsId == userID)) {
                        me.chooseIssure.html(infoData.toString());
                    } else if (type == 1) {
                        if (me.body.children().length == 0) {
                            me.body.append(infoData.toString());
                        } else {
                            me.body.children().first().before(infoData.toString());
                        }
                    }
                    if (me.isLoad == false) {
                        if (data.message[a].isDefault == 1) {
                            me.chooseIssure.html(infoData.toString());
                            me.chooseIssure.find(".adds-label").removeAttr("onclick");
                            me.chooseIssure.css("display", "block");
                            me.chooseTip.css("display", "none");
                            me.chooseAdd.css("display", "none");
                            me.chooseSure.css("display", "block");
                            me.addsId = userID;
                            me.isLoad = true;
                        }
                    }
                }
            }
           // $(".his-label-r").css("width", (me.winW - 102) + "px");
        },
        resize: function(self) {
            var thisLabel = $(self).parent().find('.his-label-r');
                $(self).css("margin-top", (thisLabel.height() - 80) / 2 + "px");
            // var thisLabel = $(self).parent().find('.his-label-r');
            // thisLabel.css("height", (thisLabel.find("div").height() + 80) + "px");
            // thisLabel.parent().css("height", (thisLabel.find("div").height() + 80) + "px");
            // thisLabel.parent().find("img").css("top", ((thisLabel.find("div").height() - 2) * 0.5) + "px");
        }
    }
    W.callBackQueryConsigneeHandler = function(data) {
        if (data.result == true) {
            H.seckilladdresscheck.chkaddsData = data;
            H.seckilladdresscheck.chooseChsaddrs.css("display", "block");
            H.seckilladdresscheck.info(data, 1);
        } else {
            H.seckilladdresscheck.chooseTip.css("display", "block");
            H.seckilladdresscheck.chooseAdd.css("display", "block");
            H.seckilladdresscheck.body.children().first().before('<div class="label-none">您还没有收货地址</div>');
        }
        hideLoading();
    }

    W.seckillDetailMyWinOrderCallBackHandler = function(data) {
        if (data.result == true) {
            H.seckilladdresscheck.info(data, 0);
            if (data.sureadd == true) {
                var infoData = "";
                var userName = data.consignee;
                var userTel = data.telphone;
                var userID = data.id;
                var isNormal = "";
                var userAdds = data.address;
                infoData += '<div class="adds-label" id="' + userID + '">';
                infoData += '<span>' + userName + '</span>';
                infoData += '<h5>' + userTel + '</h5>';
                infoData += '<div>' + isNormal + userAdds + '</div>';
                infoData += '</div>';
                H.seckilladdresscheck.addsLabel = $(".adds-label");
                H.seckilladdresscheck.chooseIssure.html(infoData.toString());
                H.seckilladdresscheck.chooseTip.css("display", "none");
                hideLoading();
            } else {
                H.seckilladdresscheck.applydata(1);
            }
            $(".content").removeClass("none");
        }
        else
        {
            hideLoading();
             showTips("啊哦，网络在开小差噢，稍后再试试吧~");
        }
    }

    W.seckillSureAddCallBackHandler = function(data) {
        if (data.result == true) {
            hideLoading();
            H.seckilladdresscheck.chooseChsaddrs.css("display", "none");
            H.seckilladdresscheck.chooseSure.css("display", "none");
        }
    }
    H.seckilladdresscheck.init();
})(Zepto)
