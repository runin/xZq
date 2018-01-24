(function($){
    H.index = {
        request_cls: 'requesting',
        from: getQueryString('from'),
        init: function(){
            var me = this;
            me.resize();
            me.event();
        },
        event: function(){
            var me = this;
            $('#btn-go2show').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                };
                $(this).addClass(me.request_cls);
                toUrl('photo.html');
            });
            $('#btn-go2lottery').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                };
                $(this).addClass(me.request_cls);
                toUrl('wall.html');
            });
            $('#btn-go2record').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                };
                $(this).addClass(me.request_cls);
                toUrl('record.html');
            });
            $('#btn-rule').click(function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            });
        },
        resize: function() {
            var winW = $(window).width(),
                winH = $(window).height();
            $('body').css({
                'width': winW,
                'height': winH
            });
        }
    };
})(Zepto);

$(function(){
    H.index.init();
});