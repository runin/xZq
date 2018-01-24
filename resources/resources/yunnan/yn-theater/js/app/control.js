/**
 * Created by E on 2015/7/21.
 */
var winW,winH,btnrl,black,rl,rlcls,rltext,yy,carwinW,cx,cy,isret,toucha,isgetpic,
    ctrl,btntouchrl,btnin,midlogo;
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
    toucha = $(".touch");
    $(".box").css("height",(winW * 0.07) + "px");
    ctrl.css({"height":(winW * 0.2)+"px","width":(winW * 0.28) + "px"});
    btnrl.css({"line-height":(winW * 0.09)+"px"});
    //btnin.css("height",((winW * 0.8) * 0.3)+"px");
    $("header").css("display","block");
    carwinW = winW * 0.2;
    //applydata("api/article/list","callbackArticledetailListHandler",true);
    $.ajax({
        type:"GET",
        url:domain_url+"api/article/list"+dev,
        dataType:"jsonp",
        jsonp: "callback",
        jsonpCallback:callbackArticledetailListHandler,
        async: false,
        data:{},
        error: function () {
            if(isgetpic == false){
                $("body").append('<img class="roundbg" id="roundbg" src="images/roundbg.jpg" />');
                $(".roundbg").css("opacity","1");
            }
            //alert("请求数据失败，请刷新页面");
        }
    });
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
                btnin.css({"opacity":"1","-webkit-animation":"rshow 2s","animation-timing-function":"linear", '-webkit-animation-timing-function': 'ease-out'});
                $(".handsw").css({"display":"block","-webkit-animation":"handswap 3s infinite","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"});
            });
        },1000);
    };
    toucha.on("touchstart", function (ts) {
        if (ts.targetTouches.length == 1) {
            ts.preventDefault();
            var touch = ts.targetTouches[0];
        }
        $(".handsw").css({"display":"none","-webkit-animation":"","animation":""});
        var constx = touch.pageX;
        toucha.on("touchmove", function (e) {
            e.preventDefault;
            e = e.changedTouches[0];
            var x = e.pageX;
            if(!isret){
                btnin.css({"width":((winW*0.05)+constx - x)+"px","height":((winH*0.05)+constx - x)+"px"});
                cx = ((winW*0.05)+constx - x);
                cy = ((winH*0.05)+constx - x);
                if(x<(winW*0.05)){
                    btnin.css({"width":constx+"px","height":constx+"px"});
                    cx = cy = constx;
                }
            }
        }).on("touchend", function () {
            if(cx > (winW *0.1)){
                btnin.animate({"width":(winW*1.3)+"px","height":(winH*1.3)+"px"},2000,'ease-out',function () {
                    isret = false;
                });
                toUrl("talk.html");
            }else{
                isret = true;
                btnin.animate({"width":(winW*0.05)+"px","height":(winH*0.05)+"px"},400,'ease-out',function () {
                    isret = false;
                });
                $(".handsw").css({"display":"block","-webkit-animation":"handswap 3s infinite","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"});
            }
        })
    })
}

function callbackArticledetailListHandler(data){
    if(data == undefined){

    }else{
        if(data.code == 0){
            hidenewLoading();
            $("body").append('<img class="roundbg" id="roundbg" src="'+ data.arts[0].img +'" />');
            isgetpic = true;
            document.getElementById("roundbg").onload = function(){
                $(".roundbg").css("opacity","1");
            }
        }else if(data.code == 1){
            if(isask == false){
                applydata("api/article/list","callbackArticledetailListHandler",true);
                isask = true;
            }else{
                hidenewLoading();
                $("body").append('<img class="roundbg" id="roundbg" src="images/roundbg.jpg" />');
                $(".roundbg").css("opacity","1");
            }
        }
    }
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
