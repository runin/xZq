(function($){
    H.card = {
        init: function(){
            this.event();
            this.spellDom(cards);
        },
        event: function(){
            var me = this;
            $('.back').tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("comment.html");
            });
            $('ul').delegate('li div', 'click', function(e) {
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("make.html?id="+ $(this).attr('id'));
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        spellDom: function(data){
            var me = H.card,
                t = simpleTpl();

            var newItems = [],screenNum = 0;
            for(var i=0,len=data.length;i<len;i+=2){
                newItems.push(data.slice(i,i+2));
            }

            screenNum = newItems.length;
            if(screenNum){
                $.each(newItems, function(i, item){
                    t._('<li>');
                    $.each(item, function(j, jtem){
                        t._('<div id="'+ jtem.id +'" data-collect="true" data-collect-flag="hn-party-card-go-'+ jtem.id +'" data-collect-desc="进入制作贺卡页"><img src="'+ jtem.hkyImg +'" /></div>');
                    });
                    t._('</li>');
                });
                $("ul").append(t.toString());
            }
        }
    };
})(Zepto);
$(function(){
    H.card.init();
});
