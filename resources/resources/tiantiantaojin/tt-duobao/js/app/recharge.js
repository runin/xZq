/**
 * Created by E on 2015/11/9.
 */
$(document).ready(function () {
    S.chg.init();
});
S.chg = {
    init: function () {
        var me = S.chg;
        me.el.numb = $(".head>div>span");
        me.el.another = $(".another");
        me.el.rechargeSubmit = $(".recharge-submit");
        me.el.rechargeOkl = $(".recharge-ok-l");
        me.el.rechargeOkr = $(".recharge-ok-r");
        me.el.rechargeOk = $(".recharge-ok");
        me.el.rechargeOkp = $(".recharge-ok p");
        me.el.btnBacktohome = $(".btn-backtohome");
        me.even();
    },
    el:{
        numb:null,
        lastNumb:null,
        another:null,
        constAnother:null,
        submitNumber:null,
        isJump:false,
        rechargeSubmit:null,
        rechargeOkl:null,
        rechargeOkr:null,
        rechargeOk:null,
        rechargeOkp:null,
        btnBacktohome:null
    },
    even: function () {
        S.chg.el.btnBacktohome.on("click", function () {
            toUrl("personcenter.html");
        });
        if(S.chg.el.rechargeOkl.text() == "返回首页"){
            S.chg.success();
        }
        S.chg.el.numb.on("click", function () {
            var me = this;
            S.chg.el.another.val("");
            if(S.chg.el.lastNumb !== null){
                S.chg.el.lastNumb.css("border","1px solid #c6c6c7");
            }
            $(me).css("border","1px solid #f91546");
            S.chg.el.lastNumb = $(me);
            S.chg.el.submitNumber = me.id;
            S.chg.charge();
        });
    },
    success: function () {
        S.chg.el.rechargeOkl.on("click", function () {
            toUrl("../../index.html");
        });
        S.chg.el.rechargeOkr.on("click", function () {
            toUrl("chargelist.html");
        });
        S.chg.el.rechargeOk.css("display","block");
        var numb = getQueryString("payAmount");
        S.chg.el.rechargeOkp.text("恭喜获得"+(numb*0.01)+"个元宝");
    },
    inpfocus: function (data) {
        if(data == 0){
            if(S.chg.el.another.val() == "" || (S.chg.el.another.val() == "0")){
                S.chg.el.rechargeSubmit.css("background-color","darkgray").off();
            }else{
                S.chg.charge();
            }
            if(S.chg.el.lastNumb !== null){
                S.chg.el.lastNumb.css("border","1px solid #c6c6c7");
            }
            S.chg.el.submitNumber = null;
        }else{
            if(isNaN(S.chg.el.another.val())){
                showTips("请输入正确数值");
                S.chg.el.another.val(S.chg.el.constAnother);
            }else if(S.chg.el.another.val() == 0){
                S.chg.el.another.val(S.chg.el.constAnother);
                S.chg.el.rechargeSubmit.css("background-color","darkgray").off();
                S.chg.el.another.val("0");
            }else if(S.chg.el.another.val() == ""){
                S.chg.el.rechargeSubmit.css("background-color","darkgray").off();
            }else{
                S.chg.el.submitNumber = S.chg.el.constAnother = Math.ceil(S.chg.el.another.val());
                S.chg.el.another.val(S.chg.el.submitNumber);
                S.chg.charge();
            }
        }
    },
    inpblur: function () {
        //console.log("333");
    },
    charge: function () {
        S.chg.el.rechargeSubmit.css("background-color","#f91546").one("click", function () {
            if(S.chg.el.isJump == false){
                S.chg.el.isJump = true;
                showLoading();
                getResult('indiana/order', {
                    appId:busiAppId,
                    openId:openid,
                    amount:S.chg.el.submitNumber
                },'callBackIndianaRechargeHandler');
            }
        });
    }
};

function callBackIndianaRechargeHandler(data){
    if(data.result == true){
        hideLoading();
        window.location.href = data.commonPayPage+"&prefix="+window.location.href.substr(0,window.location.href.indexOf('recharge.html'));
    }
}