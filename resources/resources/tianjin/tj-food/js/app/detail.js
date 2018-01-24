(function($){
    H.detail = {
        request_cls: 'requesting',
        pid: getQueryString('pid'),
        guid: getQueryString('guid'),
        flag: getQueryString('flag'),
        init: function(){
            var me = this;
            if(me.pid == '' || me.guid == ''){
                toUrl('wall.html');
                return;
            }
            me.event();
            me.getInfo();
        },
        getInfo: function() {
            getResult('api/voteguess/info', { yoi: openid }, 'callbackVoteguessInfoHandler', true);
        },
        event: function(){
            var me = this;
            $('#btn-go2wall').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                $(this).addClass(me.request_cls);
                toUrl('wall.html?flag=' + me.flag);
            });
        },
        fillDetail: function(data) {
            var me = this, t = simpleTpl(), items = data.items;
            for(var i = 0, len = items.length; i < len; i++) {
                if (items[i].guid == me.guid) {
                    for(var j = 0, jlen = items[i].pitems.length; j < jlen; j++) {
                        if (items[i].pitems[j].pid == me.pid) {
                            $('.detail-box img').attr('src', (items[i].pitems[j].im2 || './images/wait.png'));
                            $('.detail-box .content-box .food-name').text(items[i].pitems[j].na || '');
                            $('.detail-box .content-box .intro-box').html(items[i].pitems[j].in || '');
                        }
                    }
                }
            }
        }
    };

    W.callbackVoteguessInfoHandler = function(data) {
        if (data.code == 0) {
            H.detail.fillDetail(data);
        }
    };
})(Zepto);

$(function(){
    H.detail.init();
});