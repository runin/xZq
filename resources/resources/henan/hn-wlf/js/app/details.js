(function($){
    H.detail={
        guid: getQueryString("guid"),
        pid: getQueryString("pid"),
        init: function(){
            this.event();
            this.query_info();
        },
        //查询投票信息
        query_info: function(){
            getResult('api/voteguess/inforoud', {}, 'callbackVoteguessInfoHandler', true);
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        event: function(){
            var me = H.detail;
            $(".back-btn").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("vote.html");
            });
        },
        spellHtml: function(data){
            var me = H.detail, t = simpleTpl();
            t._('<label class="label-img">')
                ._('<img src="'+ data.im +'"></label>')
            ._('</label>')
            ._('<span class="na">姓名：'+ data.na +'</span>')
            ._('<div class="in">'+ data.in +'</div>');

            $("section.deta").html(t.toString());
        }
    };
    W.callbackVoteguessInfoHandler = function(data){
        var me = H.detail;
        if(data.code == 0){
            $.each(data.items, function(i,item){
                if(item.guid == me.guid){
                    $.each(item.pitems, function(j,jtem){
                        if(jtem.pid == me.pid){
                            /*console.log(j);
                            console.log(jtem);*/
                            me.spellHtml(jtem);
                        }
                    });
                }
            });
        }
    };
})(Zepto);
$(function(){
    H.detail.init();
});
