(function($){
    H.index = {
        request_cls: 'requesting',
        init: function(){
            var me = this;
            me.resize();
            me.event();
        },
        event: function(){
            var me = this;
            $('#btn-begin').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                };
                $(this).addClass(me.request_cls);
                toUrl('yao.html');
            });
            $('#btn-bao').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                };
                $(this).addClass(me.request_cls);
                toUrl('baoliao.html');
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