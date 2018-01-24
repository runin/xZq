/**
 * Created by Administrator on 2015/7/13.
 */
var img1,imgz1,img2,imgz2,img3,imgz3,img4,imgz4,roul,openr,openrqs,bg,openrlp,
    black,close,sign,issign,qd,qdcls,qdpic,qdpicz,signani,blink,blinkz,goldnumb,
    winW,roulH,
    sdbacisS,sdbacid,sdbacmsg,
    rdopenS;
var apptype = 5;
$(document).ready(function () {
    sdbacisS = null;
    sdbacmsg = null;
    rdopenS = false;
    winW = $(window).width();
    blinddom();
    initcss();
    addevent();
    getrl();
    $("body").append("<img id='main-bg' class='main-bg' src='bacimg/main-pic1.jpg' alt=''/>");
    document.getElementById("main-bg").onload = function () {
        imgz1.css("display","block");
        imgz2.css("display","block");
        imgz3.css("display","block");
        sendchk();
        onpageload();
    }
});
function blinddom(){
    img1 = document.querySelector('.main-img1');
    img2 = document.querySelector('.main-img2');
    img3 = document.querySelector('.main-img3');
    img4 = document.querySelector('.main-img4');
    qdpic = document.querySelector('.main-qd div');
    blink = document.querySelector('.blink');
    signani = document.querySelector('.sign');
    openrqs = document.querySelector('.main-openrl');
    bg = $(".main-bg");
    imgz1 = $(".main-img1");
    imgz2 = $(".main-img2");
    imgz3 = $(".main-img3");
    imgz4 = $(".main-img4");
    roul = $(".main-roul");
    openr = $(".main-openrl");
    openrlp = $(".main-openrl div");
    black = $(".black");
    close = $(".close");
    sign = $(".sign");
    issign = $(".issign");
    qd = $(".main-qd");
    blinkz = $(".blink");
    qdcls = $(".main-qd img");
    qdpicz = $(".main-qd div");
}
function initcss(){
    roulH = winW * 0.125;
    roul.css({"width":"25%","height":roulH + "px"});
    qdcls.css({"width":"12%","height":(winW * 0.12) + "px"});
}
function addevent(){
    img1.addEventListener("webkitAnimationEnd", function () {
        imgz1.css({"top":"30%","left":"10%","width":"22%","height":"12%"});
    },false);
    img2.addEventListener("webkitAnimationEnd", function () {
        imgz2.css({"top":"17%","right":"15%","width":"22%","height":"12%"});
    },false);
    img3.addEventListener("webkitAnimationEnd", function () {
        imgz3.css({"top":"3%","left":"35%","width":"22%","height":"12%"});
    },false);
    openrqs.addEventListener("webkitAnimationEnd", function () {
        close.css("z-index","5");
        sign.css("z-index","50");
        openr.css("display","none");
        black.css("display","none");
        openr.css({"animation": "luck 2s","-webkit-animation":""});
    },false);
    signani.addEventListener("webkitAnimationEnd", function () {
        if(rdopenS == true){
            sdbacisS = true;
            sign.css("display","block");
            opensign();
        }else{
            rdopenS = true;
        }
    },false);
    roul.on("click", openrl);
    close.on("click",clsrl);
    sign.on("click",signaddani);
    qdcls.on("click",clssign);
}
function qdianiend(){
    qdpicz.css({"right":"30%","bottom":"45%","width": "20%" , "height": "15%"});
}
function openrl(){
    openr.css("z-index","50");
    close.css("z-index","50");
    sign.css("z-index","5");
    openr.css("display","block");
    black.css("display","block");
}
function clsrl(){
    openr.css({"animation": "flyover 1s","-webkit-animation":"flyover 1s"});
}
function opensign(){
    if(goldnumb == 3){
        goldnumb = "icon/main-qd-top3.png";
    }else if(goldnumb == 5){
        goldnumb = "icon/main-qd-top5.png";
    }else if(goldnumb == 10){
        goldnumb = "icon/main-qd-top10.png";
    }else if(goldnumb == 15){
        goldnumb = "icon/main-qd-top15.png";
    }else if(goldnumb == 20){
        goldnumb = "icon/main-qd-top20.png";
    }else if(goldnumb == 50){
        goldnumb = "icon/main-qd-top50.png";
    }else{
        goldnumb = "icon/main-qd-top50.png";
    }
    sign.css("display","none");
    qd.css("display","block");
    black.css("display","block");
    blinkz.attr("src",goldnumb);
    blinkz.css({"display":"block"});
    console.log(sdbacmsg);
}
function clssign(){
    sign.css({"display":"block","animation": "", "-webkit-animation": ""});
    sign.css("display","none");
    issign.css("display","block");
    qd.css("display","none");
    black.css("display","none");
    blinkz.css("display","none");
}
function signaddani(){
    if(sdbacisS == false){
        sign.css({ "animation": "press 0.5s", "-webkit-animation": "press 0.5s"});
        sendsign();
    }else if(sdbacisS == true){
        issign.css("display","block");
    }
}

function sendchk(){
    $.ajax({
        type:"GET",
        url:business_url+"mpAccount/mobile/userSign/checkSign/"+busiAppId+"/"+openid,
        dataType:"jsonp",
        jsonp: "callback",
        jsonpCallback:"callBackCheckSignHandler",
        async: true,
        error: function () {
            alert("请求查询是否签到数据失败，请刷新页面");
        }
    });
}

function sendsign(){
    $.ajax({
        type:"GET",
        url:business_url+"mpAccount/mobile/userSign/sign/"+busiAppId+"/"+openid+"?id="+sdbacid,
        dataType:"jsonp",
        jsonp: "callback",
        jsonpCallback:"callBackSignHandler",
        async: false,
        error: function () {
            alert("请求签到数据失败，请刷新页面");
        }
    });
}

function senduserlog(btid){
    $.ajax({
        type:"GET",
        dataType:"jsonp",
        jsonp: "callback",
        url: business_url + "mpAccount/mobile/user/log/add",
        data: {
            appId: busiAppId,
            openId: openid,
            eventDesc: encodeURIComponent("签到"),
            eventId: btid,
            operateType:5,
            isPageLoad: false
        },
        showload: false
    })
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
            operateType:5,
            isPageLoad: true
        },
        showload: false
    })
}

function callbackAddUserOperateLogHandler(){

}

function getrl(){
    $.ajax({
        type:"GET",
        dataType:"jsonp",
        jsonp: "callback",
        jsonpCallback:"callBackSignInfoHandler",
        url: business_url+"mpAccount/mobile/userSign/ruleInfo/"+busiAppId+"/"+apptype
    })
}

function callBackSignInfoHandler(data){

    openrlp.html(data.result);

}

function callBackSignHandler(data){
    sdbacmsg = data.code;
    if(sdbacmsg === 0){
        if(rdopenS == true){
            sdbacisS = true;


            sign.css("display","block");
            opensign();
            senduserlog("daily-sign");
        }else{
            goldnumb = data.goldNum;
            rdopenS = true;
        }
    }else if(sdbacmsg === 1){
        alert("签到失败，请刷新页面");
    }
}

function callBackCheckSignHandler(data){
    sdbacisS = data.isSign;
    sdbacid = data.id;
    if(sdbacisS == true){
        issign.css("display","block");
    }else if(sdbacisS == false){
        sign.css("display","block");
    }else{
        alert("出现错误，请刷新页面");
    }
}


