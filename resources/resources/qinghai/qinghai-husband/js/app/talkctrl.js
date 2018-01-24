/**
 * Created by Administrator on 2015/8/13.
 */
var queshowimg,winW,winH,quesq,goque,bd,non,talkbg;
var isgetpic = false;
$(document).ready(function () {
    winW = $(window).width();
    winH = $(window).height();
    queshowimg = $(".queshow>img");
    quesq = $(".queshow-que");
    goque = $(".goque");
    bd = $(".body");
    non = $(".back");
    talkbg = $(".talkbg");
    talkbg.css({"width":winW,"height":winH});
    queshowimg.css("height",(winW * 0.228));
    quesq.css({"top":((winW * 0.228) - 30) * 0.5});
    goque.css({"top":((winW * 0.228) - 30) * 0.5});
    bd.css({"top":((winW*0.228) + 76),"height":(winH - (((winW*0.228) + 76) + 90))});
    $("body").on("click", function () {
        $(".lottery-none").css("display","none");
    });
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
                $("body").append('<img id="talkbg" class="talkbg" src="images/index-bg.jpg" />');
                $(".talkbg").css("opacity","1");
                //$("body").append('<div class="talkbg"></div>');
                //$(".talkbg").css({"opacity":"1","background":"url(../images/index-bg.jpg) 0 0 no-repeat 100% 100%"});
            }
            //alert("请求数据失败，请刷新页面");
        }
    });
});

function callbackArticledetailListHandler(data){
    if(data == undefined){

    }else{
        if(data.code == 0){
            hidenewLoading();
            if(data.arts[0].t == "2"){
                $("body").append('<img id="talkbg" class="talkbg" src="'+ data.arts[0].img +'" />');
            }else if(data.arts[1].t == "2"){
                $("body").append('<img id="talkbg" class="talkbg" src="'+ data.arts[1].img +'" />');
            }else if(data.arts[2].t == "2"){
                $("body").append('<img id="talkbg" class="talkbg" src="'+ data.arts[2].img +'" />');
            }else{
                hidenewLoading();
                $("body").append('<img id="talkbg" class="talkbg" src="images/index-bg.jpg" />');
                $(".talkbg").css("opacity","1");
            }
            isgetpic = true;
            document.getElementById("talkbg").onload = function(){
                $(".roundbg").css("opacity","1");
            }
        }else if(data.code == 1){
            hidenewLoading();
            $("body").append('<img id="talkbg" class="talkbg" src="images/index-bg.jpg" />');
            $(".talkbg").css("opacity","1");
        }
    }
}
