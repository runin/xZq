
var winW,winH,qiandao,qduid,alrt,serverT,ap,btncls,rbtncls, l,qdi;
$(document).ready(function () {
    winW = $(window).width();
    winH= $(window).height();
    qiandao = $(".qiandao");
    alrt = $(".alert");
    ap = $(".alert>p");
    btncls = $(".ok");
    rbtncls = $(".cls");
    l = $(".l");
    qdi = $(".qdi");
    $("body").css("height",winH);
    applydata("api/common/time","commonApiTimeHandler",true);
    applydata("api/linesdiy/info","callbackLinesDiyInfoHandler",true);
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
    even();
    $.ajax({
        type:"GET",
        url:domain_url+"api/common/promotion"+dev,
        dataType:"jsonp",
        jsonp: "callback",
        jsonpCallback:"commonApiPromotionHandler",
        data:{
            oi: openid
        },
        success: function (data) {
            if(data.code == 0){
                var jumpUrl = data.url;
                $(".linkout").removeClass("none");
                $("#alinkout").attr("href",jumpUrl);
            }else{
                $(".linkout").addClass("none");
            }
        },
        error: function () {
            //alert("请求数据失败，请刷新页面");
        }
    });
});
function even(){
    btncls.on("click", function () {
        alrt.css("display","none");
    });
    rbtncls.on("click", function () {
        alrt.css("display","none");
    });
    l.on("click", function () {
        toUrl("talk.html");
    })
}

function commonApiTimeHandler(data){
    if(data == undefined){

    }else{
        serverT = data.t;
        applydata("api/sign/round","callbackSignRoundHandler",true);
    }
}

function callbackSignRoundHandler(data){
    shownewLoading();
    if(data.code == 0){
        for(var i = 0;(i<=data.items.length - 1);i++){
            var st = timestamp(data.items[i].st);
            var et = timestamp(data.items[i].et);
            if((serverT>st)&&(serverT<et)){
                qduid = data.items[i].uid;
                $.ajax({
                    type:"GET",
                    url:domain_url+"api/sign/issign"+dev,
                    dataType:"jsonp",
                    jsonp: "callback",
                    jsonpCallback:callbackSignIsHandler,
                    async: false,
                    data:{
                        yoi:openid,
                        auid:qduid
                    },
                    error: function () {
                        //alert("请求数据失败，请刷新页面");
                    }
                });
            }
        }
    }else{

    }
}


function callbackSignIsHandler(data){
    if(data == undefined){

    }else{
        hidenewLoading();
        if(data.result == true){
            qiandao.css({"background":'url("images/btn-iss.png") no-repeat',"background-size":'100% 100%',"color":"#000000","display":"block"}).on("click", function () {
                showTips("今日已经签到");
            });
        }else if(data.result == false){
            qiandao.css({"display":"block"}).on("click", function () {
                shownewLoading();
                $.ajax({
                    type:"GET",
                    url:domain_url+"api/sign/signed"+dev,
                    dataType:"jsonp",
                    jsonp: "callback",
                    jsonpCallback:callbackSignSignedHandler,
                    async: false,
                    data:{
                        yoi:openid,
                        auid:qduid
                    },
                    error: function () {
                        //alert("请求数据失败，请刷新页面");
                    }
                });
            });
        }
    }
}

function callbackSignSignedHandler(data){
    if(data == undefined){

    }else{
        if(data.code == 0){
            hidenewLoading();
            if(data.signVal == undefined){

            }else{
                alrt.css("display","block");
                ap.html('恭喜您签到成功</br>送您'+data.signVal+'个积分');
                qiandao.css({"background":'url("images/btn-iss.png") no-repeat',"background-size":'100% 100%',"color":"#000000","display":"block"}).off();
            }
        }else if(data.code == 2){

        }
    }
}

function callbackLinesDiyInfoHandler(data){
    if(data == undefined){

    }else{
        if(data.code == 0){
            hidenewLoading();
            var gt = data.gitems;
            for(var i = 0;(i<gt.length);i++){
                switch (i){
                    case 0:
                        qdi.append('<img class="qdi-top" src="'+ gt[i].ib +'" />');
                        break;
                    case 1:
                        qdi.append('<img class="qdi-ltop" src="'+ gt[i].ib +'" />');
                        break;
                    case 2:
                        qdi.append('<img class="qdi-rtop" src="'+ gt[i].ib +'" />');
                        break;
                    case 3:
                        qdi.append('<img class="qdi-lbott" src="'+ gt[i].ib +'" />');
                        break;
                    case 4:
                        qdi.append('<img class="qdi-rbott" src="'+ gt[i].ib +'" />');
                        break;
                    case 5:
                        qdi.append('<img class="qdi-bott" src="'+ gt[i].ib +'" />');
                        break;
                    default :
                        break;
                }
            }
        }else{

        }
    }
}


function callbackArticledetailListHandler(data){
    if(data == undefined){

    }else{
        if(data.code == 0){
            hidenewLoading();
            if(data.arts[0].t == "3"){
                $("body").append('<img class="roundbg" id="roundbg" src="'+ data.arts[0].img +'" />');
            }else if(data.arts[1].t == "3"){
                $("body").append('<img class="roundbg" id="roundbg" src="'+ data.arts[1].img +'" />');
            }else if(data.arts[2].t == "3"){
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
