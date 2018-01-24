/**
 * Created by Administrator on 2015/7/17.
 */
var winW,winH,gdmis,gdmissi,black,mygold,mine,close,gdmissiQS,p1,p2,p3,p4,p5,p1QS,p2QS,p3QS,p4QS,p5QS,bttm,
    usersex,pcBg,gdtext,gdnumb,gdrank,myrank,gdmisQS,mygoldQS,mineQS;
var nickname,hicon;
var apptype = 7;
var ins = "";
ins += '<img class="pc-mgd" src="personimg/personcenter-icon-mygold.png" alt=""/>';
ins += '<img class="pc-gmi" src="personimg/personcenter-icon-goldmission.png" alt=""/>';
ins += '<img class="pc-mine" src="personimg/personcenter-icon-mine.png" alt=""/>';
ins += '<img class="pc-pice1" src="personimg/personcenter-pice1.png" alt=""/>';
ins += '<img class="pc-pice2" src="personimg/personcenter-pice2.png" alt=""/>';
ins += '<img class="pc-pice3" src="personimg/personcenter-pice3.png" alt=""/>';
ins += '<img class="pc-pice4" src="personimg/personcenter-pice4.png" alt=""/>';
ins += '<img class="pc-pice5" src="personimg/personcenter-pice5.png" alt=""/>';
$(document).ready(function () {
    winW = $(window).width();
    winH = $(window).height();
    onpageload();
    bttm = $(".bottom");
    applyuserinfo();
    //asksex();
});
function init(){
    //gdmissiQS = document.querySelector('.gdmissi');
    p1QS = document.querySelector('.pc-pice1');
    p2QS = document.querySelector('.pc-pice2');
    p3QS = document.querySelector('.pc-pice3');
    p4QS = document.querySelector('.pc-pice4');
    p5QS = document.querySelector('.pc-pice5');
    gdmisQS = document.querySelector('.pc-gmi');
    mygoldQS = document.querySelector('.pc-mgd');
    mineQS = document.querySelector('.pc-mine');
    p1 = $(".pc-pice1");
    p2 = $(".pc-pice2");
    p3 = $(".pc-pice3");
    p4 = $(".pc-pice4");
    p5 = $(".pc-pice5");
    gdmis = $(".pc-gmi");
    gdmissi = $(".gdmissi");
    gdtext = $(".gdmissi div");
    black = $(".black");
    mygold = $(".pc-mgd");
    mine = $(".pc-mine");
    pcBg =$(".pc-bg");
    hicon = $(".hicon");
    nickname = $(".nickname");
    hicon.css({"width":(winH * 0.12),"height":(winH * 0.12),"bottom":(winH * 0.84)});
    nickname.css({"bottom":(winH * 0.87),"left":((winH * 0.12)+(winW * 0.16))});
    gdmisQS.addEventListener("webkitAnimationEnd", function () {
        senduserlog("goldmission-btn","金币任务");
        ToURL("goldmission.html");
    },false);
    mygoldQS.addEventListener("webkitAnimationEnd", function () {
        senduserlog("goldmission-btn","金币任务");
        ToURL("mygold.html");
    },false);
    mineQS.addEventListener("webkitAnimationEnd", function () {
        senduserlog("goldmission-btn","金币任务");
        ToURL("myinfo.html");
    },false);
    gdmis.on("click", function () {
        gdmis.css({"-webkit-animation":"toggle 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    });
    mygold.on("click", function () {
        mygold.css({"-webkit-animation":"toggle 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    });
    mine.on("click", function () {
        mine.css({"-webkit-animation":"toggle 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    });
    replay(p1QS,p1);
    replay(p2QS,p2);
    replay(p3QS,p3);
    replay(p4QS,p4);
    replay(p5QS,p5);
}
function preinit(){
    nickname = $(".nickname");
    hicon = $(".hicon");
    myrank = $(".myrank");
    hicon.css({"width":(winH * 0.12),"height":(winH * 0.12),"bottom":(winH * 0.84)});
    nickname.css({"bottom":(winH * 0.87),"left":((winH * 0.12)+(winW * 0.16))});
}
function ToURL(url){
    window.location.href = url;
}
function replay(el,elQS){
    el.addEventListener("webkitAnimationEnd", function () {
        elQS.css("display","none");
        setTimeout(function () {
            elQS.css("display","block");
        },0)
    },false);
}

//function asksex(){
//    $.ajax({
//        type:"GET",
//        dataType:"jsonp",
//        jsonp: "callback",
//        jsonpCallback:"callBackQuerySexHandler",
//        url: business_url+"mpAccount/mobile/user/querySex/"+busiAppId+"/"+openid,
//        error: function () {
//            delytime+=10000;
//            setTimeout(function () {
//                asksex();
//            },delytime)
//        }
//    })
//}

//function askrl(){
//    $.ajax({
//        type:"GET",
//        dataType:"jsonp",
//        jsonp: "callback",
//        jsonpCallback:"callGoldTaskInfoHandler",
//        url: business_url+"mpAccount/mobile/userSign/goldTask/info/"+busiAppId+"/"+apptype,
//        error: function () {
//            askrl();
//        }
//    })
//}

//function callBackQuerySexHandler(data){
//    if(data.code == 0){
//        usersex = data.result.sex;
//        //alert(usersex);
//        if(usersex == 2){
//            bttm.append("<img id='pc-bg' class='pc-bg' src='personimg/personcenter-bottom-girl.jpg' alt=''/>");
//        }else{
//            bttm.append("<img id='pc-bg' class='pc-bg' src='personimg/personcenter-bottom.jpg' alt=''/>");
//        }
//        document.getElementById("pc-bg").onload = function () {
//            bttm.append(ins);
//            init();
//        };
//    }
//}

function callGoldTaskInfoHandler(data){
    if(data.code == 0){
        gdtext.html(data.result);
        black.css("display","block");
        gdmissi.css("display","block");
    }else{
        gdtext.text("获取服务器信息失败   请重试");
        black.css("display","block");
        gdmissi.css("display","block");
    }
}

function applyuserinfo(){
    $.ajax({
        type:"GET",
        dataType:"jsonp",
        jsonp: "callback",
        jsonpCallback:"callBackUserInfoHandler",
        url: business_url+"mpAccount/mobile/user/query/"+busiAppId+"/"+openid,
        error: function (e) {
            //alert(JSON.stringify(e));
            delytime+=10000;
            setTimeout(function () {
                applyuserinfo();
            },delytime)
        }
    })
}

function callBackUserInfoHandler(data){
    if(data.code == 0){
        preinit();
        usersex = data.result.sex;
        if(usersex == 2){
            bttm.append("<img id='pc-bg' class='pc-bg' src='personimg/personcenter-bottom-girl.jpg' alt=''/>");
        }else{
            bttm.append("<img id='pc-bg' class='pc-bg' src='personimg/personcenter-bottom.jpg' alt=''/>");
        }
        document.getElementById("pc-bg").onload = function () {
            bttm.append(ins);
            init();
        };
        gdnumb = data.result.goldNum;
        gdrank = data.result.goldRank;
        myrank.html("我的金币："+ gdnumb +"&nbsp;&nbsp;&nbsp;&nbsp;我的排名：NO."+gdrank);
        var img = data.result.headImg.toString();
        hicon.attr("src",img);
        nickname.html(data.result.nickName);
    }else if(data.code == 1){

    }
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

function callbackAddUserOperateLogHandler (){

}