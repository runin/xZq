(function($){
    H.answer = {
        request_cls: 'requesting',
        init: function(){
            var me = this;
            me.event();
            if(W.localStorage.getItem("go-"+ openid)){
                $(".voted").show();
            }else{
                $(".vote").show();
            }
        },
        //计数器
        incrCount: function(key){
            getResult('api/servicecount/incrcount',{key: key},'callbackIncrCountHandler');
        },
        event: function(){
            var me = this;
            $(".head-img").attr("src", headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar.png');
            $(".nickname").text(nickname || "匿名用户");
            $('#btn-go2index').click(function(e) {
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('lottery.html');
            });

            $("#satisfaction").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                W.localStorage.setItem("go-"+ openid, true);
                me.incrCount(satisfaction);
                toUrl("lottery.html");
            });
            $("#yawp").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                W.localStorage.setItem("go-"+ openid, true);
                me.incrCount(yawp);
                toUrl("lottery.html");
            });
            $("#go").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("lottery.html");
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        }
    };

    W.callbackServiceCountIncrHandler = function(data) {
    };
})(Zepto);

$(function(){
    H.answer.init();
});