(function($){
    H.program = {
        type: getQueryString("type"),
        init: function(){
          this.event();
            this.spellDom();
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        event: function(){
            var me = H.program;
            $('header img:last-child').tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                if(me.type == "lottery"){
                    toUrl("lottery.html");
                }else if(me.type == "card"){
                    toUrl("card.html");
                }

            });
        },
        spellDom: function(){
            var me = H.program, t = simpleTpl();
            $.each(programDatas, function(i, item){
                t._('<li>')
                    ._('<p><label>'+ item.id +'</label></p>')
                    ._('<section>')
                        ._('<div class="kc">'+ item.name +'</div>')
                        ._('<div class="byz">'+ item.message +'</div>')
                    ._('</section>')
                ._('</li>');
            });
            $("ul").append(t.toString());
        }
    }
})(Zepto);
$(function(){
    H.program.init();
});