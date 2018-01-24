(function($) {
   H.index = {
       href: "barrage.html",
        init: function () {
            var me = this;
            me.checkPuzzle();
            me.event();
        },
       event: function() {
           var me = this;
           $(".btn-join").click(function(e){
               e.preventDefault();
               toUrl(me.href);
           });
       },
       checkPuzzle: function () {
           getResult("api/puzzle/activity/round",{},"callbackPuzzleRoundHandler");
       }
   };

    W.callbackPuzzleRoundHandler = function (data) {
        if(data.result){
            var la = data.la;
            if(la && la.length > 0){
                var nowTime = timeTransform(new Date().getTime());
                for (var i = 0; i < la.length; i ++){
                    if(comptime(nowTime,la[i].st) <0 && comptime(nowTime,la[i].et) >=0){
                        localStorage.setItem("href","game.html");
                        H.index.href = "game.html";
                        return;
                    }
                }
            }
        }
    }
})(Zepto);
$(function () {
    var hei = $(window).height();
    $("body").css("height",hei+"px");
   H.index.init();
});
