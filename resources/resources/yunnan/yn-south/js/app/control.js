/**
 * Created by Administrator on 2015/7/21.
 */
var winW,winH,btnrl,black,rl,rlcls,rltext,yy,AD,
    jj,ctrl,btntouchrl,btnin;
var isload = false;
var isask = false;
$(document).ready(function () {
    winW = $(window).width();
    winH = $(window).height();
    getel();
    blindevent();
});

function getel(){
    btnrl = $(".ctrls-down>a");
    btntouchrl = $(".ctrls-down");
    black = $(".black");
    rl = $(".rl");
    rlcls = $(".rl>img");
    rltext = $(".rl>div");
    ctrl = $(".ctrl");
    btnin = $(".btn-in");
    AD = $(".AD");
    $(".box").css("height",(winW * 0.07) + "px");
    ctrl.css({"height":(winW * 0.2)+"px","width":(winW * 0.28) + "px"});
    btnrl.css({"line-height":(winW * 0.09)+"px"});
    btnin.css("height",((winW * 0.4) * 0.3)+"px");
    $("header").css("display","block");
    AD.css("width",(winW - (winW * 0.33 + 130))+"px");
}

function blindevent(){
    btntouchrl.on("click", function () {
        btntouchrl.css({"-webkit-animation":"toggle 0.3s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).one("webkitAnimationEnd", function () {
            btntouchrl.css("-webkit-animation","");
            black.css({"display":"block","-webkit-animation":"beshow 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).one("webkitAnimationEnd", function () {
                black.css("-webkit-animation","");
            });
            rl.css({"display":"block","-webkit-animation":"dispshow 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).one("webkitAnimationEnd", function () {
                rl.css("-webkit-animation","");
                if(isload == false){
                    shownewLoading();
                    applydata("common/rule","callbackRuleHandler",true);
                }
            });
        })
    });
    rlcls.on("click", function () {
        hidenewLoading();
        black.css({"display":"block","-webkit-animation":"behide 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
            black.css({"-webkit-animation":"","display":"none"});
        });
        rl.css({"display":"block","-webkit-animation":"disphide 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
            rl.css({"-webkit-animation":"","display":"none"});
        });
    });
    btnin.on("click", function () {
        btnin.css({"-webkit-animation":"toggle 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).on("webkitAnimationEnd", function () {
            window.location.href = "talk.html";
        });
    });
}

function callbackRuleHandler(data){
    if(data.code == 0){
        hidenewLoading();
        rltext.html(data.rule);
        isload = true;
    }else if(data.code == 1){
        if(isask == false){
            applydata("common/rule","callbackRuleHandler",true);
            isask = true;
        }
    }
}

