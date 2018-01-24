/**
 * 加油好少年--首页.
 */
(function($){
    H.index = {
        $rule_btn: $('.rule-btn'),
        $rule: $('#rule'),
        $rule_close: $('.rule-close'),
        $vote_btn: $('.vote-btn'),
        request_cls: 'requesting',
        init: function(){
            this.event();
            getResult('common/rule', {}, 'callbackRuleHandler', true);
        },
        event: function(){
            var me = this;
            this.$rule_btn.click(function(e){
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                me.$rule.removeClass('none');
            });
            this.$rule_close.click(function(e){
                e.preventDefault();
                me.$rule.addClass('none');
            });

            if(!openid){
                $('.is-openid').addClass(this.request_cls);
            }else{
                this.$vote_btn.attr('href', 'vote.html');
            }
            $('.is-openid').click(function(e){
                e.preventDefault();
                if($(this).hasClass(me.request_cls)){
                    alert('拼命加载中....');
                }
            });
        }
    };
    W.callbackRuleHandler = function(data){
        if (data.code == 0 && data.rule) {
            $('#rule .rule-data').html(data.rule);
        }
    };
    var cbUrl = window.location.href;
			if(cbUrl.indexOf('cb41faa22e731e9b') < 0 ){
				$('#div_subscribe_area').css('height', '0');
			} else {
				$('#div_subscribe_area').css('height', '50px');
			};
})(Zepto);
$(function(){
    H.index.init();
});