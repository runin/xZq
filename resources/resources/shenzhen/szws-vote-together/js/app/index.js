(function($){
    H.index = {
        request_cls: 'requesting',
        from: getQueryString('from'),
        init: function(){
            var me = this;
            me.event();
        },
        event: function(){
            var me = this;
            $('#btn-dan').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                };
                $(this).addClass(me.request_cls);
                toUrl('comment.html');
            });
     		$('#btn-pro').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                };
                $(this).addClass(me.request_cls);
                toUrl('vote.html');
            });
              $('#btn-rule').click(function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            });
     
        }
    };
})(Zepto);

$(function(){
    H.index.init();
});