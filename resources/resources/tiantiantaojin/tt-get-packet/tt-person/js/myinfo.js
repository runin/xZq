/**
 * Created by root on 15-7-19.
 */
var inp1,inp2,inp3,butt,butf,winW,winH,bg,load,
    p1,p2,p3,p1QS,p2QS,p3QS;
$(document).ready(function () {
    askinfo();
    winW = $(window).width();
    winH = $(window).height();
    p1QS = document.querySelector('.p1');
    p2QS = document.querySelector('.p2');
    p3QS = document.querySelector('.p3');
    p1 = $(".p1");
    p2 = $(".p2");
    p3 = $(".p3");
    bg = $(".bg");
    inp1 = $(".inp1");
    inp2 = $(".inp2");
    inp3 = $(".inp3");
    butt = $(".butt");
    butf = $(".butf");
    load = $(".load");
    bg.css("height",winH+"px");
    onpageload();
    replay(p1QS,p1);
    replay(p2QS,p2);
    replay(p3QS,p3);
    butt.on("click",chkmsg);
    butf.on("click",resume);
});
function chkmsg(){
    if((inp1.val() == "点击填写信息")||inp2.val() == "点击填写信息"||inp3.val() == "点击填写信息"){
        showTips("请填写正确信息");
    }else{
        senduserlog("myinfo-sendmsg","发送信息");
        load.text("loading......");
        changeinfo();
    }
}

function resume(){
    senduserlog("myinfo-resume","重新信息");
    butf.css("display","none");
    butt.css("display","block");
    inp1.removeAttr("disabled");
    inp2.removeAttr("disabled");
    inp3.removeAttr("disabled");
}

function changeinfo(){
    $.ajax({
        type:"GET",
        dataType:"jsonp",
        jsonp: "callback",
        jsonpCallback:"callbackModifyUserInfoHandler",
        url: business_url+"mpAccount/mobile/user/modify/"+busiAppId+"/"+openid,
        data:{
            name:encodeURIComponent(inp1.val()),
            phone:inp2.val(),
            address:encodeURIComponent(inp3.val())
        },
        error: function () {
            delytime+=10000;
            setTimeout(function () {
                changeinfo();
            },delytime)
        }
    })
}

function callbackModifyUserInfoHandler(data){
    butt.css("display","none");
    butf.css("display","block");
    inp1.attr("disabled","disabled");
    inp2.attr("disabled","disabled");
    inp3.attr("disabled","disabled");
    load.text("");
    //alert(data.code+"   "+data.result.goldNum+"   "+data.result.goldRank);
    showTips(data.message);
}
function replay(el,elQS){
    el.addEventListener("webkitAnimationEnd", function () {
        elQS.css("display","none");
        setTimeout(function () {
            elQS.css("display","block");
        },0)
    },false);
}

function onpageload(){
    $.ajax({
        type:"GET",
        dataType:"jsonp",
        jsonp: "callback",
        url: business_url + "mpAccount/mobile/user/log/add",
        data: {
            appId: busiAppId,
            openId: openid,
            eventDesc: "",
            eventId: "",
            operateType:9,
            isPageLoad: true
        },
        showload: false
    })
}

function askinfo(){
    $.ajax({
        type:"GET",
        dataType:"jsonp",
        jsonp: "callback",
        jsonpCallback:"callBackQueryAddressHandler",
        url: business_url+"mpAccount/mobile/user/address/"+busiAppId+"/"+openid,
        error: function () {
            delytime+=10000;
            setTimeout(function () {
                askinfo();
            },delytime)
        }
    })
}

function senduserlog(btid,CNbtid){
    $.ajax({
        type:"GET",
        dataType:"jsonp",
        jsonp: "callback",
        url: business_url + "mpAccount/mobile/user/log/add",
        callbackAddUserOperateLogHandler: function (data) {},
        data: {
            appId: busiAppId,
            openId: openid,
            eventDesc: encodeURIComponent(CNbtid),
            eventId: btid,
            operateType:9,
            isPageLoad: false
        },
        showload: false
    })
}

function callbackAddUserOperateLogHandler (){

}

function callBackQueryAddressHandler(data){
    if(data.code == 0){
        inp1.val(data.name);
        inp2.val(data.phone);
        inp3.val(data.address);
        inp1.attr("disabled","disabled");
        inp2.attr("disabled","disabled");
        inp3.attr("disabled","disabled");
    }else if(data.code == -1){

    }else{
        delytime+=10000;
        setTimeout(function () {
            askinfo();
        },delytime)
    }
}