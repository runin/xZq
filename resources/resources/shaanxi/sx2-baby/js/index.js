/**
 * 萌宝首页
 */
(function($){

    H.index = {
        request_cls: 'requesting',
        init : function(){
            var me = this;
            me.event_handler();
            $.get("data.ss", indexCallback, "json");
        },
        event_handler: function() {
            var me = this;
        }
    }

    W.indexCallback = function(data){
        if(data.code == 0){
            $('title').text(data.tl);
        }
    }

})(Zepto);

H.index.init();