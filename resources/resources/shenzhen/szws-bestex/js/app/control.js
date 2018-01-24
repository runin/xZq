/**
 * Created by Administrator on 2015/7/21.
 */
var winW,winH,btnrl,black,rl,rlcls,rltext,yy,st,yyindex,
    jj,ctrl,yybj,btntouchrl,yycls,
    yyQS,yyclsQS,rlQS,rlclsQS,btntouchrlQS,stQS,blackQS,
    btnin,scan;
var isload = false;
var isshow = false;
var bkisshow = false;
$(document).ready(function () {
    winW = $(window).width();
    winH = $(window).height();
    getel();
    blindevent();
});

function getel(){
    st = $(".st");
    yyQS = document.querySelector('.yy');
    yyclsQS = document.querySelector('.yy>img');
    rlQS = document.querySelector('.rl');
    rlclsQS = document.querySelector('.rl>img');
    btntouchrlQS = document.querySelector('.ctrls-down');
    stQS = document.querySelector('.st');
    blackQS = document.querySelector('.black');
    btnrl = $(".ctrls-down>a");
    btntouchrl = $(".ctrls-down");
    black = $(".black");
    rl = $(".rl");
    rlcls = $(".rl>img");
    rltext = $(".rl>div");
    yy = $(".yy");
    yycls = $(".yy>img");
    yyindex = $(".yy-index");
    yybj = $(".ctrls-up>a");
    ctrl = $(".ctrl");
    btnin = $(".btn-in");
    scan = $(".scan");
    $(".box").css("height",(winW * 0.07) + "px");
    ctrl.css({"height":(winW * 0.2)+"px","width":(winW * 0.28) + "px"});
    btnrl.css({"line-height":(winW * 0.09)+"px"});
    btnin.css("height",((winW * 0.22) * 1.5)+"px");
}

function blindevent(){
    btntouchrl.on("click", function () {
        btntouchrl.css({"-webkit-animation":"toggle 0.8s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"})
    });
    rlcls.on("click", function () {
        hidenewLoading();
        rl.css({"-webkit-animation":"disphide 0.7s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    });

    blackQS.addEventListener("webkitAnimationEnd", function () {
        if(bkisshow == false){
            black.css({"-webkit-animation":""});
            jj.css("display","block");
            bkisshow = true;
        }else{
            black.css("display","none");
            black.css({"-webkit-animation":""});
            bkisshow = false;
        }
    },false);


    btntouchrlQS.addEventListener("webkitAnimationEnd", function () {
        isshow = true;
        rl.css("display","block");
        black.css("display","block");
        rl.css({"-webkit-animation":"dispshow 0.7s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"})
        btntouchrl.css("-webkit-animation","");
    },false);

    rlQS.addEventListener("webkitAnimationEnd", function () {
        if(isshow == false){
            rl.css("display","none");
            black.css("display","none");
            rl.css({"-webkit-animation":""});
            rlcls.css({"-webkit-animation":""});
        }else{
            isshow = false;
            if(isload == false){
                isload = true;
                shownewLoading();
                applydata("common/rule","callbackRuleHandler",true);
            }
        }
    },false);
    btnin.on("touchstart", function () {
        scan.css("display","block").animate({
            height:"100%"
        },"linear",function(){
            scan.animate({height:"3%"},"linear", function () {
                window.location.href = "talk.html";
            })
        });
    });
    //    .on("touchend", function () {
    //    scan.css("display","none");
    //})
}

function callbackRuleHandler(data){
    if(data.code == 0){
        hidenewLoading();
        rltext.html(data.rule) ;
    }else if(data.code == 1){

    }
}

