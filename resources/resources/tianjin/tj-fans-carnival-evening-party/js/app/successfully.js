(function($){
    H.successfully = {
        init: function(){
            this.event();
            this.spell();
        },
        event: function(){
            var me = this;
            $("#back").tap(function(e) {
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("lottery.html")
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        spell: function(){
            var data = JSON.parse(W.localStorage.getItem("luckData"));
            $(".pi").attr("src", data.pi);
            $("h4").text(data.tt);
            if(data.pd){
                $(".content").html(data.pd);
                $(".details").removeClass("none");
            }

        }
    }
})(Zepto);
$(function(){
    H.successfully.init();
});