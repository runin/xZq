/**
 * Created by E on 2015/11/10.
 */
$(document).ready(function () {
    S.chkadds.init();
});

S.chkadds = {
    init: function () {
        var me = S.chkadds;
        me.el.addsBtn = $(".adds-btn");
        me.el.body = $(".chkaddress-label");
        me.el.chkUuid = getQueryString("rid");
        me.applydata(0);
        me.el.chooseAdd = $(".choose-add");
        me.el.chooseChsaddrs = $(".choose-chsaddrs");
        me.el.chooseSure = $(".choose-sure");
        me.el.chooseTip = $(".choose-tip");
        me.el.chooseIssure = $(".choose-issure");
        me.el.addsLabel = $(".adds-label");
        me.el.btnBacktohome = $(".btn-backtohome");
        me.el.winW = $(window).width();
        S.chkadds.even();
        S.chkadds.el.chooseIssure.off();
    },
    el:{
        addsBtn:null,
        body:null,
        pzList:null,
        pzlistShai:null,
        chkUuid:null,
        chooseAdd:null,
        chooseChsaddrs:null,
        chooseSure:null,
        chooseTip:null,
        addsLabel:null,
        addsId:null,
        chooseIssure:null,
        chkaddsData:null,
        btnBacktohome:null,
        isLoad:false
    },
    applydata: function (type) {
        showLoading();
        if(type == 0){
            getResult('indianaPeriod/detailmywinperiod', {
                ruuid: S.chkadds.el.chkUuid,
                openid:openid
            },'indianaPeriodDetailMyWinPeriodCallBackHandler');
        }else if(type == 1){
            getResult('consignee/query', {
                appId:busiAppId,
                openId:openid
            },'callBackQueryConsigneeHandler');
        }else if(type == 2){
            getResult('indianaPeriod/surewinadd', {
                rid:S.chkadds.el.chkUuid,
                aid:S.chkadds.el.addsId
            },'indianaPeriodSureWinAddCallBackHandler');
        }
    },
    even: function () {
        S.chkadds.el.btnBacktohome.on("click", function () {
            toUrl("personcenter.html");
        });
        S.chkadds.el.chooseChsaddrs.on("click", function () {
            S.chkadds.el.body.css({"display":"block","-webkit-animation":"popup 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                S.chkadds.el.body.css({"-webkit-animation":""})
            });
        });
        S.chkadds.el.chooseSure.on("click", function () {
            S.chkadds.applydata(2);
        });
        S.chkadds.el.addsBtn.on("click", function () {
            toUrl("addressadd.html?type="+ S.chkadds.el.chkUuid);
        });
        S.chkadds.el.chooseAdd.on("click", function () {
            toUrl("addressadd.html?type="+ S.chkadds.el.chkUuid);
        });
    },
    chooseadds: function (data) {
        S.chkadds.el.addsId = data.id;
        S.chkadds.el.body.css({"display":"block","-webkit-animation":"popdown 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).one("webkitAnimationEnd", function () {
            S.chkadds.el.body.css({"display":"none","-webkit-animation":""})
        });
        //S.chkadds.el.body.css("display","none");
        S.chkadds.el.chooseIssure.css("display","block");
        S.chkadds.info(S.chkadds.el.chkaddsData,2);
        S.chkadds.el.chooseTip.css("display","none");
        //S.chkadds.el.chooseChsaddrs.css("display","none");
        S.chkadds.el.chooseAdd.css("display","none");
        S.chkadds.el.chooseSure.css("display","block");
    },
    info: function (data,type) {
        if(type == 0){
            if(S.chkadds.el.chkUuid == data.rid){
                var infoData = "";
                var infoLabel = data.pn;
                var infoImg = data.pi;
                var infoWhitch ="(第" + data.pt + "期)";
                var infoNumberall = data.pc;
                var infoLucknumb = data.pw;
                var infoLuckdate = data.ptime;
                var infoJointime = data.c;
                var infoStatu = data.rs;
                var infoAdd = data.puuid;
                infoData += '<div class="his-label isover">';
                //infoData += '<a href="#" class="pzlist-chgaddrs" uuid="' + infoAdd + '" data-collect="true" data-collect-flag="pzlist-chgaddrs" data-collect-desc="中奖纪录-确认地址">></a>';
                infoData += '<img src=' + infoImg + ' onload="S.chkadds.resize(this)" onerror="$(this).attr("src","../../images/avatar.png")" />';
                infoData += '<div class="his-label-r ' + infoAdd + '">';
                infoData += '<div><h2 class="red">' + infoWhitch + '</h2>' + infoLabel + '</div>';
                infoData += '<p>总需：' + infoNumberall + '</p>';
                infoData += '<p>幸运号码：' + infoLucknumb + '</p>';
                infoData += '<h5>本期参与：' + infoJointime + '人次</h5>';
                infoData += '<p>揭晓时间：' + infoLuckdate + '</p>';
                //if(infoStatu == "已收货"){
                //    infoData += '<p>商品状态：' + infoStatu + '<a href="#" class="pzlist-shai" data-collect="true" data-collect-flag="pzlist-shai" data-collect-desc="中奖纪录-晒单">晒单</a></p>';
                //}else{
                    infoData += '<p>商品状态：' + infoStatu + '</p>';
                //}
                infoData += '</div>';
                infoData += '</div>';
                S.chkadds.el.pzList = $(".pzlist");
                if(S.chkadds.el.pzList.children().length==0){
                    S.chkadds.el.pzList.append(infoData.toString());
                }else{
                    S.chkadds.el.pzList.children().first().before(infoData.toString());
                }
                var thisLabel = $("."+infoAdd);
                //console.log(thisLabel.find("div").html());
                thisLabel.css("height",(thisLabel.find("div").height() + 80) + "px");
                thisLabel.parent().css("height",(thisLabel.find("div").height() + 80) + "px");
                thisLabel.parent().find("img").css("top",((thisLabel.find("div").height() -2)* 0.5 )  + "px");
            }
        }else{
            for(var a = 0; a < data.message.length;a++){
                var infoData = "";
                var userName = data.message[a].consignee;
                var userTel = data.message[a].telphone;
                var userID = data.message[a].id;
                var isNormal = "";
                var userAdds = data.message[a].address;
                if((type == 2) && (S.chkadds.el.addsId == userID)){
                    infoData += '<div class="adds-label" id="' + userID + '">';
                }else if(data.message[a].isDefault == 1){
                    infoData += '<div class="adds-label" onclick="S.chkadds.chooseadds(this)" id="' + userID + '">';
                }else{
                    infoData += '<div class="adds-label" onclick="S.chkadds.chooseadds(this)" id="' + userID + '">';
                }
                infoData += '<span>' + userName + '</span>';
                infoData += '<h5>' + userTel + '</h5>';
                infoData += '<div>' + isNormal + userAdds + '</div>';
                infoData += '</div>';
                S.chkadds.el.addsLabel = $(".adds-label");
                if((type == 2) && (S.chkadds.el.addsId == userID)){
                    S.chkadds.el.chooseIssure.html(infoData.toString());
                }else if(type == 1){
                    if(S.chkadds.el.body.children().length==0){
                        S.chkadds.el.body.append(infoData.toString());
                    }else{
                        S.chkadds.el.body.children().first().before(infoData.toString());
                    }
                }
                if(S.chkadds.el.isLoad == false){
                    if(data.message[a].isDefault == 1){
                        S.chkadds.el.chooseIssure.html(infoData.toString());
                        S.chkadds.el.chooseIssure.find(".adds-label").removeAttr("onclick");
                        S.chkadds.el.chooseIssure.css("display","block");
                        S.chkadds.el.chooseTip.css("display","none");
                        S.chkadds.el.chooseAdd.css("display","none");
                        S.chkadds.el.chooseSure.css("display","block");
                        S.chkadds.el.addsId = userID;
                        S.chkadds.el.isLoad = true;
                    }
                }
            }
        }
        $(".his-label-r").css("width", (S.chkadds.el.winW - 102) + "px");
    },
    resize: function (self) {
        var thisLabel = $(self).parent().find('.his-label-r');
        thisLabel.css("height",(thisLabel.find("div").height() + 80) + "px");
        thisLabel.parent().css("height",(thisLabel.find("div").height() + 80) + "px");
        thisLabel.parent().find("img").css("top",((thisLabel.find("div").height() -2)* 0.5 )  + "px");
    }
};

function callBackQueryConsigneeHandler(data){
    if(data.result == true){
        S.chkadds.el.chkaddsData = data;
        S.chkadds.el.chooseChsaddrs.css("display","block");
        S.chkadds.info(data,1);
    }else{
        S.chkadds.el.chooseTip.css("display","block");
        S.chkadds.el.chooseAdd.css("display","block");
        S.chkadds.el.body.children().first().before('<div class="label-none">您还没有收货地址</div>');
    }
    hideLoading();
}

function indianaPeriodDetailMyWinPeriodCallBackHandler(data){
    if(data.result == true){
        S.chkadds.info(data,0);
        if(data.sureadd == true){
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
            S.chkadds.el.addsLabel = $(".adds-label");
            S.chkadds.el.chooseIssure.html(infoData.toString());
            S.chkadds.el.chooseTip.css("display","none");
            hideLoading();
        }else{
            S.chkadds.applydata(1);
        }
    }
}

function indianaPeriodSureWinAddCallBackHandler(data){
    if(data.result == true){
        hideLoading();
        S.chkadds.el.chooseChsaddrs.css("display","none");
        S.chkadds.el.chooseSure.css("display","none");
    }
}
