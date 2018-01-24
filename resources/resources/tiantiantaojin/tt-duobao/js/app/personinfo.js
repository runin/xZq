/**
 * Created by E on 2015/11/9.
 */
$(document).ready(function () {
    S.info.init();
});
S.info = {
    init: function () {
        var me = S.info;
        me.el.addPh = $(".addph");
        me.el.infoPhone = $(".info-phone");
        me.el.phoneCancel = $(".phone-cancel");
        me.el.phoneSave = $(".phone-save");
        me.el.phoneChknumberbtn = $(".phone-chknumber-btn");
        me.el.addAdds = $(".addadds");
        me.el.phoneNumberinput = $(".phone-number-input");
        me.el.phoneChknumberinput = $(".phone-chknumber-input");
        me.el.infoID = $(".ID>span");
        me.el.infoNick = $(".nick>span");
        me.el.infoPhonenumb = $(".phone>span");
        me.el.head = $(".head>img");
        me.el.btnBacktohome = $(".btn-backtohome");
        me.even();
        me.applydata();
    },
    el:{
        addPh:null,
        infoPhone:null,
        head:null,
        phoneCancel:null,
        phoneChknumberbtn:null,
        phoneSave:null,
        addAdds:null,
        phoneNumberinput:null,
        phoneChknumberinput:null,
        infoID:null,
        infoNick:null,
        infoPhonenumb:null,
        btnBacktohome:null
    },
    applydata: function () {
        showLoading();
        getResult('user/query/'+busiAppId+"/"+openid, {},'callBackUserInfoHandler');
    },
    even: function () {
        S.info.el.btnBacktohome.on("click", function () {
            toUrl("personcenter.html");
        });
        S.info.el.addPh.on("click", function () {
            S.info.el.infoPhone.css({"display":"block","-webkit-animation":"popup 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("webkitAnimationEnd", function () {
                S.info.el.infoPhone.css({"display":"block","-webkit-animation":""})
            });
        });
        S.info.el.phoneCancel.on("click", function () {
            S.info.el.infoPhone.css({"display":"block","-webkit-animation":"popdown 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).on("webkitAnimationEnd", function () {
                S.info.el.infoPhone.css({"display":"none","-webkit-animation":""})
            });
        });
        S.info.el.phoneSave.on("click", function () {
            S.info.chkinfo();
        });
        S.info.el.addAdds.on("click", function () {
            toUrl("address.html");
        })
    },
    chkinfo: function () {
        var phone = S.info.el.phoneNumberinput.val();
        if (!/^((1[0-9]{2})+\d{8})$/.test(phone)) {
            showTips('这手机号，可打不通...');
            return false;
        }else{
            showLoading();
            getResult('user/modify/mobile', {
                appId:busiAppId,
                openId:openid,
                mobile:phone
            },'callBackModifyMobileHandler');
        }
    }
};

function callBackUserInfoHandler(data){
    hideLoading();
    if(data.code == 0){
        var tel = data.result.telPhone;
        var name = data.result.nickName;
        var headImg = data.result.headImg;
        if(name==undefined||name==""){name="匿名"}
        if(tel==undefined||(tel=="")){tel="请输入电话号码"}
        if(headImg==undefined||headImg==""){headImg="../../images/head-none.png"}
        S.info.el.head.attr("src",headImg);
        S.info.el.infoID.text(data.result.userId);
        S.info.el.infoNick.text(name);
        S.info.el.addPh.text(tel);
    }
}

function callBackModifyMobileHandler(data){
    if(data.result == true){
        hideLoading();
        S.info.el.infoPhone.css({"display":"block","-webkit-animation":"popdown 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).on("webkitAnimationEnd", function () {
            S.info.el.infoPhone.css({"display":"none","-webkit-animation":""})
        });
        S.info.el.addPh.text(S.info.el.phoneNumberinput.val());
    }else{

    }
}