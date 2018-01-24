(function($){
    H.index = {
        key: "",
        init: function(){
            this.initKey();
            this.event();
        },
        event: function(){
            var me = this,
                $key = $("#key");
            $(".go").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                if(!$key.val()){
                    showTips("您还没有输入口令~");
                }else if($key.val() == me.key){
                    sessionStorage.setItem("ttRedCheck","true");
                    toUrl("lottery.html");
                }else{
                    showTips("口令错误，请重新输入~");
                }
            });
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        initKey: function () {
            getResult('api/common/rule', {}, 'commonApiRuleHandler');
        }
    };

    W.commonApiRuleHandler = function(data) {
        if(data.code == 0){
            H.index.key = data.rule;
        }
    };
})(Zepto);
$(function(){
    H.index.init();
});
