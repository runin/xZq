/**
 * 第一时间-新闻图片页
 */
(function(){
    H.new = {
        init: function(){
            this.pre_document();
            this.event();
            this.get_gg();
        },
        pre_document: function(){
            $('body').css('min-height',$(window).height());
        },
        get_gg: function(){
            getResult('api/article/list', {}, 'callbackArticledetailListHandler', true);
        },
        event: function(){
            var me = H.new;
            $('.back').click(function(e){
                toUrl('index.html');
            });
        },
        spellHtml: function(data){
            var t = simpleTpl(),
                qitems = data.arts || [];
            $.each(qitems,function(i,item){
                t._('<li>')
                    ._('<h2>'+ item.t +'</h2>')
                    ._('<div>')
                        ._('<img data-original="'+ item.img +'" src="images/xw-mrtp.jpg" />')
                    ._('</div>')
                 ._('</li>');
            });
            $('ul').html(t.toString());
            $("img").lazyload({container: $("ul")});
        }
    };
    W.callbackArticledetailListHandler = function(data) {
        if(data.code == 0 && data.arts){
            H.new.spellHtml(data);
        }
    }
})(Zepto);
$(function(){
    H.new.init();
});