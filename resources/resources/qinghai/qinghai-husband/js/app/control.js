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
    //$("body").append('<img class="midlogo" id="midlogo" src="images/index-midlogo.png" />');
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
    if(openid){
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
        toUrl("talk.html");
    });
}

function callbackArticledetailListHandler(data){
    if(data == undefined){

    }else{
        if(data.code == 0){
            hidenewLoading();
            if(data.arts[0].t == "1"){
                $("body").append('<img class="roundbg" id="roundbg" src="'+ data.arts[0].img +'" />');
            }else if(data.arts[1].t == "1"){
                $("body").append('<img class="roundbg" id="roundbg" src="'+ data.arts[1].img +'" />');
            }else if(data.arts[2].t == "1"){
                $("body").append('<img class="roundbg" id="roundbg" src="'+ data.arts[2].img +'" />');
            }else{
                hidenewLoading();
                $("body").append('<img class="roundbg" id="roundbg" src="images/roundbg.jpg" />');
                $(".roundbg").css("opacity","1");
            }
            isgetpic = true;
            document.getElementById("roundbg").onload = function(){
                $(".roundbg").css("opacity","1");
            }
        }else if(data.code == 1){
            hidenewLoading();
            $("body").append('<img class="roundbg" id="roundbg" src="images/roundbg.jpg" />');
            $(".roundbg").css("opacity","1");
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
