/**
 * 萌宝-列表
 */
(function($) {

    H.list = {
        init : function(){
            var me = this;
            me.event_handler();
            $.get("data.ss", listCallback, "json");
        },
        event_handler: function() {
        }
    }

    W.listCallback = function(data){
        if(data.code == 0){
            var t = simpleTpl(),
                items = data.items || [];

            for (var i = 0, len = items.length; i < len; i++) {
                var url = "javascript:toUrl('details.html?babyInfoUuid=" + items[i].uuid + "');"
                t._('<figure><a href="'+ url +'">')
                    ._('<h1>'+ items[i].bbtl +'</h1>')
                    ._('<img src="'+ items[i].lg +'">')
                    ._('<p>'+ items[i].ps +'票</p>')
                ._('</a></figure>');
            }
            $('#list-bb').append($(t.toString()));

        }
    }

})(Zepto);

H.list.init();