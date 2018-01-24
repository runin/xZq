/**
 * Created by E on 2015/11/9.
 */
$(document).ready(function () {
    S.perc.init();
});
S.perc = {
    init: function () {
        var me = S.perc;
        me.el.toIndex = $(".toindex");
        me.el.toGoodsshare = $(".togoodsshare");
        me.el.toCharge = $(".tocharge");
        me.el.toPersoninfo = $(".topersoninfo");
        me.el.toredpacket = $(".toredpacket");
        me.el.toHistory = $(".tohistory");
        me.el.toPrize = $(".toprize");
        me.el.tosecKillRecord = $(".toseckillrecord");
        me.el.toChargehist = $(".tochargehist");
        me.el.toLinkus = $(".tolinkus");
        me.el.toAllgoods = $(".toallgoods");
        me.el.toMessage = $(".tomessage");
        me.el.headL = $(".head-l");
        me.el.headLp = $(".head-l>p");
        me.el.headR = $(".head-r");
        me.el.headRp = $(".head-r>p");
        me.el.headM = $(".head-m");
        me.el.headMp = $(".head-m>p");
        me.el.headA = $(".head-a");
        me.el.headAp = $(".head-a>p");
        me.el.centerInfoname = $(".center-info>p");
        me.el.centerInfogold = $(".center-info>span");
        me.el.centerHead = $(".center-head");
        me.el.body = $(".body");
        me.even();
        me.applydata();
    },
    el:{
        toIndex:null,
        toGoodsshare:null,
        toCharge:null,
        toPersoninfo:null,
        toHistory:null,
        toPrize:null,
        toChargehist:null,
        toLinkus:null,
        toAllgoods:null,
        headL:null,
        headLp:null,
        headR:null,
        headRp:null,
        headM:null,
        headMp:null,
        headA:null,
        headAp:null,
        centerInfoname:null,
        centerInfogold:null,
        centerHead:null,
        body:null
    },
    applydata: function () {
        showLoading();
        getResult('user/query/'+busiAppId+"/"+openid, {},'callBackUserInfoHandler');
    },
    even: function () {
        S.perc.el.toIndex.on("click", function () {
            toUrl("../../index.html");
            S.perc.el.headLp.css({"color":"#f91546"});
            S.perc.el.headRp.css({"color":"black"});
        });
        S.perc.el.toGoodsshare.on("click", function () {
            toUrl("../goods/goodsshare.html");
            S.perc.el.headMp.css({"color":"#f91546"});
            S.perc.el.headRp.css({"color":"black"});
        });
        S.perc.el.toAllgoods.on("click", function () {
            toUrl("../../allgoods.html");
            S.perc.el.headAp.css({"color":"#f91546"});
            S.perc.el.headRp.css({"color":"black"});
        });
        S.perc.el.toCharge.on("click", function () {
            toUrl("recharge.html");
        });
        S.perc.el.toPersoninfo.on("click", function () {
            toUrl("personinfo.html");
        });
        S.perc.el.toredpacket.on("click", function () {
            toUrl("redpacket.html");
        });
        S.perc.el.toHistory.on("click", function () {
            toUrl("historylist.html");
        });
        S.perc.el.toPrize.on("click", function () {
            toUrl("prizelist.html");
        });
        S.perc.el.toChargehist.on("click", function () {
            toUrl("chargelist.html");
        });
        S.perc.el.toLinkus.on("click", function () {
            toUrl("call.html");
        });
        S.perc.el.toMessage.on("click", function () {
            toUrl("message.html");
        });
        S.perc.el.tosecKillRecord.on("click", function () {
            toUrl("../seckill/seckillrecord.html");
        });
        S.perc.el.body.css("height",($(window).height()-36)+"px");
    }
};

function callBackUserInfoHandler(data){
    hideLoading();
    if(data.code == 0){
        var name = data.result.nickName;
        var headImg = data.result.headImg;
        if(name==undefined){name="匿名"}
        S.perc.el.centerInfoname.text(name);
        S.perc.el.centerInfogold.text("余额：" + data.result.indianaAmount + "元宝");
        if(headImg==undefined||headImg==""){headImg="../../images/head-none.png"}
        S.perc.el.centerHead.css({"background":"url('" + headImg + "') no-repeat","background-size":"100% 100%"});
    }
}