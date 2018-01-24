(function ($) {

    H.rule = {
        $open: $('#to_rule'),
        $close: $('#rule_close'),
        $wrapper: $('#rule'),

        isLoaded: false,

        init: function(){
            this.bindBtns();
        },

        bindBtns: function(){
            H.rule.$open.tap(function(){
                H.rule.$wrapper.removeClass('none');
                H.rule.$wrapper.find('.dialog').addClass('transparent');
                setTimeout(function(){
                    H.rule.$wrapper.find('.dialog').removeClass('transparent');
                    H.rule.$wrapper.find('.dialog').addClass('bounceInUp');
                },100);

                
                if(!H.rule.isLoaded){
                    showLoading();
                    getResult('api/common/rule',null, 'commonApiRuleHandler');
                }
            
            });

            H.rule.$close.tap(function(){
                H.rule.close();
            });
        },

        fillRule: function(data){
            H.rule.$wrapper.find('.rule-content').html(data.rule);
            H.rule.isLoaded = true;
        },

        ruleError: function(){
            showTips('大家太热情了，请稍后再试');
            H.rule.close();
        },

        close: function(){
            H.rule.$wrapper.find('.dialog').removeClass('bounceInUp').addClass('bounceOutDown');
            setTimeout(function(){
                H.rule.$wrapper.addClass('none');
                H.rule.$wrapper.find('.dialog').removeClass('bounceOutDown');
            }, 500);
        }
    };

    W.commonApiRuleHandler = function(data){
        hideLoading();
        if(data.code == 0){
            H.rule.fillRule(data);
        }else{
            H.rule.ruleError();
        }
    };

    H.rule.init();
    
})(Zepto);