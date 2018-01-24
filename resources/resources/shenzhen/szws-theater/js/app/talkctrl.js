/**
 * Created by Administrator on 2015/8/13.
 */
var queshowimg,winW,winH,quesq,goque,bd,non,talkbg,goque;
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
    queshowimg.css("height",(winW * 0.30));
    quesq.css({"top":((winW * 0.30) - 30) * 0.5});
    goque.css({"top":((winW * 0.30) - 50) * 0.5});
    bd.css({"top":((winW*0.30) + 76),"height":(winH - (((winW*0.30) + 76) + 90))});
    $("body").on("click", function () {
        $(".lottery-none").css("display","none");
    })
});