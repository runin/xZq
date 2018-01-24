(function($){
    H.confirm = {
        init : function(){
            this.event();
            $('img').attr('src',$.fn.cookie("src-"+ openid) || $.fn.cookie("si-"+ openid + '0'));
        },
        event : function(){
            $(".btn-red").click(function(e){console.log(1);
                e.preventDefault();
                toUrl("index.html");
            });
        }
    }
})(Zepto);
$(function(){
    H.confirm.init();
});