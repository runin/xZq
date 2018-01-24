/**
 * Created by E on 2015/11/10.
 */
$(document).ready(function () {
    S.adds.init();
});

S.adds = {
    init: function () {
        var me = S.adds;
        me.el.addsBtn = $(".adds-btn");
        me.el.body = $("body");
        me.el.btnBacktohome = $(".btn-backtohome");
        me.applydata();
        S.adds.el.addsBtn.on("click", function () {
            toUrl("addressadd.html");
        });
    },
    el:{
        addsBtn:null,
        body:null,
        btnBacktohome:null,
        addsLabel:null
    },
    applydata: function () {
        showLoading();
        getResult('consignee/query', {
            appId:busiAppId,
            openId:openid
        },'callBackQueryConsigneeHandler');
    },
    even: function () {
        S.adds.el.btnBacktohome.on("click", function () {
            toUrl("personcenter.html");
        });
        S.adds.el.addsLabel.on("click", function () {
            var me = this;
            toUrl("addressadd.html?fixid="+me.id);
        });
    },
    info: function (data) {
        for(var i = 0; i < data.message.length;i++){
            var infoData = "";
            var userName = data.message[i].consignee;
            var userID = data.message[i].telphone;
            var addrID = data.message[i].id;
            var isNormal = "";
            var userAdds = data.message[i].address;
            if(data.message[i].isDefault == 1){isNormal = "<span>[默认]</span>"}else{isNormal = ""}
            infoData += '<div class="adds-label" id="' + addrID + '">';
            infoData += '<span>' + userName + '</span>';
            infoData += '<h5>' + userID + '</h5>';
            infoData += '<div>' + isNormal+ userAdds + '</div>';
            infoData += '<img src="../../images/chg.png" />';
            infoData += '</div>';
            if(S.adds.el.body.children().length==0){
                S.adds.el.body.append(infoData.toString());
            }else{
                S.adds.el.body.children().first().before(infoData.toString());
            }
        }
        S.adds.el.addsLabel = $(".adds-label");
        S.adds.even();
    }
};

function callBackQueryConsigneeHandler(data){
    hideLoading();
    if(data.result == true){
        S.adds.info(data);
    }else{
        S.adds.el.body.children().first().before('<div class="label-none">您还没有收货地址</div>');
        S.adds.el.btnBacktohome.on("click", function () {
            toUrl("personcenter.html");
        });
    }
}