
var winW,winH,qiandao,qduid,alrt,serverT,ap,btncls,rbtncls,l;
$(document).ready(function () {
    winW = $(window).width();
    winH= $(window).height();
    qiandao = $(".qiandao");
    alrt = $(".alert");
    ap = $(".alert>p");
    btncls = $(".ok");
    rbtncls = $(".cls");
    l = $(".l");
    $("body").css("height",winH);
    applydata("api/common/time","commonApiTimeHandler",true);
    even();
});
function even(){
    btncls.on("click", function () {
        alrt.css("display","none");
    });
    rbtncls.on("click", function () {
        alrt.css("display","none");
    });
    l.on("click", function () {
        window.location.href = "talk.html";
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
            qiandao.css({"background-color":"#abb1b4","color":"#17717f","display":"block"}).on("click", function () {
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
                qiandao.css({"background-color":"#abb1b4","color":"#17717f","display":"block"}).off();
            }
        }else if(data.code == 2){

        }
    }

}