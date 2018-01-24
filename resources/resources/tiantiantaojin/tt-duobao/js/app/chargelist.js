/**
 * Created by E on 2015/11/9.
 */
$(document).ready(function () {
    S.chlist.init();
});
S.chlist = {
    init: function () {
        var me = S.chlist;
        me.el.chName = $(".label>p");
        me.el.chTime = $(".label>span");
        me.el.chNumb = $(".label>h4");
        me.el.body = $("body");
        me.el.btnBacktohome = $(".btn-backtohome");
        me.applydata();
        me.even();
    },
    el:{
        chName:null,
        chTime:null,
        chNumb:null,
        body:null,
        btnBacktohome:null,
        isAsk:false,
        page:2
    },
    applydata: function () {
        getResult('indiana/rechargeOrder', {
            appId:busiAppId,
            openId:openid
        },'callBackOrderListHandler');
    },
    even: function () {
        S.chlist.el.btnBacktohome.on("click", function () {
            toUrl("personcenter.html");
        });
    },
    info: function (data) {
        for(var i = 0 ; i<data.message.length ; i++){
            var infoData = "";
            var infoType = data.message[i].payType;
            var infoTime = data.message[i].payTime;
            var infoNumber = data.message[i].payAmount;
            infoData += '<div class="label">';
            infoData += '<p>' + infoType + '</p>';
            infoData += '<span>' + infoTime + '</span>';
            infoData += '<h4>￥' + infoNumber + '</h4>';
            infoData += '</div>';
            if(S.chlist.el.body.children().length==0){
                S.chlist.el.body.append(infoData.toString());
            }else{
                S.chlist.el.body.children().first().before(infoData.toString());
            }
        }
    }
};

function callBackOrderListHandler(data){
    if(data.result == true){
        S.chlist.info(data);
    }
}