/**
 * Created by Administrator on 2015/7/17.
 */
var hanicon,winW,winH,isshow,mygd,gdn1,gdn2,gdn3,username,gd,rank,fs,ss,ts,rankdiv,getmore,getmoreQS,
    numb1,numb1QS,numb2,numb2QS,numb3,numb3QS,yaogan,isscl,randn1,randn2,randn3;
var chkisload = 0;
$(document).ready(function () {
    onpageload();
    $("body").append('<img id="bottombg" class="bottombg" src="personimg/person-bg-bottom.jpg" />');
    winW = $(window).width();
    winH = $(window).height();
    isscl = true;
    isshow = false;
    fs = false;
    ss = false;
    ts = false;
    numb1QS = document.querySelector('.numall1');
    numb2QS = document.querySelector('.numall2');
    numb3QS = document.querySelector('.numall3');
    getmoreQS = document.querySelector('.bottom>img');
    hanicon = $(".hanicon");
    numb1 = $(".numall1");
    numb2 = $(".numall2");
    numb3 = $(".numall3");
    yaogan = $(".yaogan");
    mygd = $(".mygd");
    username = $(".name");
    rankdiv = $(".rank>div");
    getmore = $(".bottom>img");
    init();
    getmore.on("click", function () {
        getmore.css({"-webkit-animation":"btnpress 0.8s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    });
    document.getElementById("bottombg").onload = function () {
        if(chkisload == 1){
            startshowgold();
        }else{
            chkisload += 1;
        }
    };
    getmoreQS.addEventListener("webkitAnimationEnd", function () {
        window.location.href = "goldmission.html";
    },false);

    numb1QS.addEventListener("webkitAnimationEnd", function () {
        if(ss == false){
            numb1.css("display","none");
            setTimeout(function () {
                numb1.css("display","block");
            },0)
        }else{
            if(gdn1 == 0){
                gdn1 = 10;
            }
            randn1 = -5 - (gdn1 * 110);
            numb1.animate({
                bottom:randn1+"%"
            },1000,'ease-out', function () {
                mygd.html("我共有"+gd+"金币&nbsp;&nbsp;排名NO."+rank);
            })
        }
    },false);
    numb2QS.addEventListener("webkitAnimationEnd", function () {
        if(fs == false){
            numb2.css("display","none");
            setTimeout(function () {
                numb2.css("display","block");
            },0)
        }else{
            if(gdn2 == 0){
                gdn2 = 10;
            }
            randn2 = -3 - (gdn2 * 110);
            numb2.animate({
                bottom:randn2+"%"
            },1000,'ease-out', function () {
                ss = true;
            })
        }
    },false);
    numb3QS.addEventListener("webkitAnimationEnd", function () {
        if(isscl == true){
            numb3.css("display","none");
            setTimeout(function () {
                numb3.css("display","block");
            },0)
        }else{
            if(gdn3 == 0){
                gdn3 = 10;
            }
            randn3 = 0 - (gdn3 * 110);
            numb3.animate({
                bottom:randn3+"%"
            },1000,'ease-out', function () {
                fs = true;
            })
        }
    },false);
    //yaogan.on("click", function () {
    //    if(isshow == false){
    //        senduserlog("mygold-yaogan","显示金币");
    //        isshow = true;
    //        //yaogan.css({"animation":"rotat 1s","-webkit-animation":"rotat 1s"});
    //        numb1.css({"animation":"luck 1.5s","-webkit-animation":"luck 1.5s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    //        numb2.css({"animation":"luck 1.9s","-webkit-animation":"luck 1.9s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    //        numb3.css({"animation":"luck 1.7s","-webkit-animation":"luck 1.7s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    //        setTimeout(function () {
    //            isscl = false;
    //        },1000);
    //    }
    //});
    applyinfo();
});

function init(){
    hanicon.css("left",((winW - (winH * 0.12)) * 0.5)+"px");
    numb1.css("height",(winH*1.8)+"px");
    numb2.css("height",(winH*1.8)+"px");
    numb3.css("height",(winH*1.8)+"px");
}

function applyinfo(){
    $.ajax({
        type:"GET",
        dataType:"jsonp",
        jsonp: "callback",
        jsonpCallback:"callBackGoldInfoHandler",
        url: business_url+"mpAccount/mobile/user/goldInfo/"+busiAppId+"/"+openid,
        error: function () {
            delytime+=10000;
            setTimeout(function () {
                applyinfo();
            },delytime)
        }
    })
}

function callBackGoldInfoHandler(data){
    if (data.code == 1){
        rank = 0;
        gd = 0;
    }else{
        rank = data.result.goldRank;
        gd = data.result.goldNum.toString();
        var inr = "";
        $.each(data.result.rank10, function (index,el) {
            inr += '<div><span style="left: 5%;">第'+ el.rank +'名</span><p>'+ el.nickName +'</p><span style="right: 5%;">'+ el.goldNum +'金币</span></div>'
        });
        rankdiv.html(inr);
        $("body").scrollTop = 0;
    }
    if((data.result.goldNum >= 100) && ((data.result.goldNum < 999))){
        gdn1 = gd.substring(0,1);
        gdn2 = gd.substring(1,2);
        gdn3 = gd.substring(2,3);
    }else if((data.result.goldNum >= 10) && ((data.result.goldNum < 99))){
        gdn1 = 10;
        gdn2 = gd.substring(0,1);
        gdn3 = gd.substring(1,2);
    }else if((data.result.goldNum < 10) || (gd = 0)){
        gdn1 = 10;
        gdn2 = 10;
        gdn3 = gd.substring(0,1);
    }
    if(chkisload == 1){
        startshowgold();
    }else{
        chkisload += 1;
    }
}

function startshowgold(){
    if(isshow == false){
        senduserlog("mygold-yaogan","显示金币");
        isshow = true;
        //yaogan.css({"animation":"rotat 1s","-webkit-animation":"rotat 1s"});
        numb1.css({"animation":"luck 1.5s","-webkit-animation":"luck 1.2s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
        numb2.css({"animation":"luck 1.9s","-webkit-animation":"luck 1.1s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
        numb3.css({"animation":"luck 1.7s","-webkit-animation":"luck 1s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
        setTimeout(function () {
            isscl = false;
        },0);
    }
}

//function applyuserinfo(){
//    $.ajax({
//        type:"GET",
//        dataType:"jsonp",
//        jsonp: "callback",
//        jsonpCallback:"callBackUserInfoHandler",
//        url: business_url+"mpAccount/mobile/user/query/"+busiAppId+"/"+openid,
//        error: function () {
//            alert("请求数据失败，请刷新页面");
//        }
//    })
//}
//
//function callBackUserInfoHandler(data){
//    if(data.code == 0){
//        var img = data.result.headImg.toString();
//        hanicon.attr("src",img);
//        username.html(data.result.nickName);
//    }else if(data.code == 1){
//
//    }
//}

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