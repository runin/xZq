/**
 * Created by Administrator on 2015/7/21.
 */
var winW,winH,btnrl,black,rl,rlcls,rltext,yy,carwinW,
    jj,ctrl,btntouchrl,btnin,midlogo;
var isload = false;
var isask = false;
$(document).ready(function () {
    winW = $(window).width();
    winH = $(window).height();
    getel();
    blindevent();
});

function getel(){
    $("body").append('<img class="midlogo" id="midlogo" src="images/index-midlogo.png" />');
    btnrl = $(".ctrls-down>a");
    btntouchrl = $(".ctrls-down");
    black = $(".black");
    rl = $(".rl");
    rlcls = $(".rl>img");
    rltext = $(".rl>div");
    ctrl = $(".ctrl");
    btnin = $(".btn-in");
    midlogo = $(".midlogo");
    $(".box").css("height",(winW * 0.07) + "px");
    ctrl.css({"height":(winW * 0.2)+"px","width":(winW * 0.28) + "px"});
    btnrl.css({"line-height":(winW * 0.09)+"px"});
    btnin.css("height",((winW * 0.8) * 0.3)+"px");
    $("header").css("display","block");
    carwinW = winW * 0.75;
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
    document.getElementById("midlogo").onload = function () {
        setTimeout(function () {
            midlogo.css({"opacity":"0.6","-webkit-animation":"popshow 1s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).one("webkitAnimationEnd", function () {
                midlogo.css({"opacity":"1","-webkit-animation":""});
                //btnin.css({"opacity":"1","-webkit-animation":"carin 1.5s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                //    btnin.css({"opacity":"1","-webkit-animation":""});
                //});
                btnin.css({"opacity":"1","left":"100%",'-webkit-transform': 'translate(-'+carwinW+'px,0px)', '-webkit-transition': '-webkit-transform 1s ease-out'});
            });
        },1000);
    };
    btnin.on("click", function () {
        btnin.css({'-webkit-transform': 'translate(-'+(carwinW * 2)+'px,0px)', '-webkit-transition': '-webkit-transform 1s ease-in'});
        toUrl("talk.html");
        //btnin.css({"-webkit-animation":"carout 1.5s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).one("webkitAnimationEnd", function () {
        //    window.location.href = "talk.html";
        //});
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
