/**
 * Created by E on 2015/11/9.
 */
$(document).ready(function () {
    S.pzlist.init();
});
S.pzlist = {
    init: function () {
        var me = S.pzlist;
        me.el.btnBacktohome = $(".btn-backtohome");
        me.el.noMore = $(".nomore");
        me.el.body = $(".body");
        me.el.winW = $(window).width();
        me.el.section = $(".section");
        me.el.outsec = $(".outsec");
        me.el.black = $(".black");
        me.el.pzBtnSure = $(".pz-btn-sure");
        me.el.pzBtnCls = $(".pz-btn-cls");
        me.applydata(1);
        S.pzlist.el.btnBacktohome.on("click", function () {
            toUrl("personcenter.html");
        });
        me.el.outsec.css({"height":"150px","top":($(window).height()-150)*0.5+"px"});
    },
    el:{
        pzList:null,
        pzlistShai:null,
        pzlistChgaddrs:null,
        btnBacktohome:null,
        noMore:null,
        section:null,
        outsec:null,
        black:null,
        body:null,
        pzBtnSure:null,
        pzBtnCls:null
    },
    applydata: function (type,rid) {
        if(type == 1){
            getResult('indianaPeriod/mywinperiod', {
                appId:busiAppId,
                openid:openid,
                pageSize:100
            },'indianaPeriodMyWinPeriodCallBackHandler');
        }else{
            getResult('indianaPeriod/surerecive', {
                rid:rid
            },'indianaPeriodSureReciveCallBackHandler');
        }
    },
    even: function () {
        S.pzlist.el.pzlistShai.on("click", function () {
            var me = this;
            if($(me).attr("iss") == "1"){
                S.pzlist.el.black.css({"display":"block","-webkit-animation":"secup 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                    S.pzlist.el.black.css({"opacity":"0.5","-webkit-animation":""});
                    S.pzlist.el.pzBtnSure.one("click", function () {
                        S.pzlist.makesure($(me));
                    });
                });
                S.pzlist.el.outsec.css({"display":"block","-webkit-animation":"popup 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                    S.pzlist.el.outsec.css({"-webkit-animation":""})
                });
            }else{
                toUrl("share.html?rid="+$(me).attr("rid"));
            }
        });
        S.pzlist.el.pzBtnCls.on("click", function () {
            S.pzlist.el.black.css({"display":"block","-webkit-animation":"secdown 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).one("webkitAnimationEnd", function () {
                S.pzlist.el.black.css({"display":"none","-webkit-animation":""});
            });
            S.pzlist.el.outsec.css({"display":"block","-webkit-animation":"popdown 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).one("webkitAnimationEnd", function () {
                S.pzlist.el.outsec.css({"display":"none","-webkit-animation":""});
            });
        });
        S.pzlist.el.pzlistChgaddrs.on("click", function () {
            var me = this;
            toUrl("chkaddress.html?rid="+$(me).attr("rid"));
        });
    },
    floatshow: function () {
        S.pzlist.el.body.children().first().before('<div class="pzlist-tips"><p><span>中奖收货之后别忘了晒单哦，晒单完成系统审核成功后奖励夺宝代金券！</span><span>中奖收货之后别忘了晒单哦，晒单完成系统审核成功后奖励夺宝代金券！</span></p></div>');
        $(".pzlist-tips>p").css({"-webkit-animation":"floatshow 12s infinite","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).on("webkitAnimationEnd", function () {});
    },
    makesure: function (self) {
        showLoading("","正在提交");
        S.pzlist.applydata(2,self.attr("id"));
    },
    info: function (data) {
        for(var i = 0 ; i < data.item.length ; i++){
            var infoData = "";
            var infoLabel = data.item[i].pn;
            var infoImg = data.item[i].pi;
            var infoWhitch ="(第" + data.item[i].pt + "期)";
            var infoNumberall = data.item[i].pc;
            var infoLucknumb = data.item[i].pw;
            var infoLuckdate = data.item[i].ptime;
            var infoJointime = data.item[i].c;
            var infoStatu = data.item[i].rs;
            var infoFlag = data.item[i].shareflag;
            var infoAdd = data.item[i].puuid;
            var infoRid = data.item[i].rid;
            infoData += '<div class="his-label isover list">';
            infoData += '<a href="#" class="pzlist-chgaddrs" rid="' + infoRid + '" data-collect="true" data-collect-flag="pzlist-chgaddrs" data-collect-desc="中奖纪录-确认地址">></a>';
            infoData += '<img src=' + infoImg + ' onload="S.pzlist.resize(this)" onerror="$(this).attr(\'src\',\'../../images/goods-snone.png\')" />';
            infoData += '<div class="his-label-r ' + infoAdd + '">';
            infoData += '<div><h2 class="red">' + infoWhitch + '</h2>' + infoLabel + '</div>';
            infoData += '<p>总需：' + infoNumberall + '</p>';
            infoData += '<p>幸运号码：' + infoLucknumb + '</p>';
            infoData += '<h5>本期参与：' + infoJointime + '人次</h5>';
            infoData += '<p>揭晓时间：' + infoLuckdate + '</p>';
            if(data.item[i].sureresult == false && (data.item[i].sure == true)){
                infoData += '<p>商品状态：' + infoStatu + '<a href="#" rid="' + infoAdd + '" id="' + infoRid + '" class="pzlist-shai" style="width:60px" iss="1" data-collect="true" data-collect-flag="pzlist-shai" data-collect-desc="中奖纪录-晒单">确认收货</a></p>';
            }else if(infoFlag == true){
                infoData += '<p>商品状态：' + infoStatu + '<a href="#" rid="' + infoAdd + '" class="pzlist-shai" iss="2" data-collect="true" data-collect-flag="pzlist-shai" data-collect-desc="中奖纪录-晒单">晒单</a></p>';
            }else{
                infoData += '<p>商品状态：' + infoStatu + '</p>';
            }
            //infoData += '<p>商品状态：' + infoStatu + '</p>';
            infoData += '</div>';
            infoData += '</div>';
            S.pzlist.el.pzList = $(".pzlist");
            //if(S.pzlist.el.pzList.children().length==0){
            //    S.pzlist.el.pzList.append(infoData.toString());
            //}else{
            //    S.pzlist.el.pzList.children().first().before(infoData.toString());
            //}
            S.pzlist.el.pzList.append(infoData.toString());
            var thisLabel = $("."+infoAdd);
            thisLabel.css("height",(thisLabel.find("div").height() + 80) + "px");
            thisLabel.parent().css("height",(thisLabel.find("div").height() + 80) + "px");
            thisLabel.parent().find("img").css("top",((thisLabel.find("div").height() -2)* 0.5 )  + "px");
        }
        $(".his-label-r").css("width", (S.pzlist.el.winW - 102) + "px");
        S.pzlist.el.pzlistShai = $(".pzlist-shai");
        S.pzlist.el.pzlistChgaddrs = $(".pzlist-chgaddrs");
        S.pzlist.even();
    },
    resize: function (self) {
        var thisLabel = $(self).parent().find('.his-label-r');
        thisLabel.css("height",(thisLabel.find("div").height() + 80) + "px");
        thisLabel.parent().css("height",(thisLabel.find("div").height() + 80) + "px");
        thisLabel.parent().find("img").css("top",((thisLabel.find("div").height() -2)* 0.5 )  + "px");
    }
};

function indianaPeriodMyWinPeriodCallBackHandler(data){
    if(data.result == true){
        S.pzlist.info(data);
        S.pzlist.floatshow();
    }else{
        S.pzlist.el.noMore.css({"height":"80px","line-height":"30px","margin-top":"20px"}).html("您还没有中奖记录，<br/>只需一元即有机会获得大奖哦，赶紧参与吧");
        S.pzlist.el.body.append('<a href="#" class="toindex click-btn" data-collect="true" data-collect-flag="priz-toindex" data-collect-desc="中奖记录-去首页">立即夺宝</a>');
        $(".toindex").one("click", function () {
            toUrl("../../index.html");
        })
    }
}

function indianaPeriodSureReciveCallBackHandler(data){
    hideLoading();
    if(data.result == true){
        showLoading("","提交成功");
        setTimeout(function () {
            toUrl("prizelist.html");
        },2000);
    }
}