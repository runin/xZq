/**
 * Created by E on 2015/10/10.
 */
$(document).ready(function () {
    $(".tovote").on("click", function () {
        toUrl("vote.html");
    });
    $(".btnover").on("click", function () {
        window.location.href = "http://www.fjtv.net/3g/";
    }).css("left",(($(window).width()-80)*0.5)+"px");
    if($(".in").text() == "首页"){
        var sub = getQueryString("cb41faa22e731e9b");
        $(".btnin").on("click", function () {
            toUrl("main.html?cb41faa22e731e9b="+sub);
        });
        setTimeout(function () {
            toUrl("main.html?cb41faa22e731e9b="+sub);
        },3000);
    }else{
        $(".btnin").on("click", function () {
            toUrl("main.html");
        });
    }
});