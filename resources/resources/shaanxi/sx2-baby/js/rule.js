/**
 * 萌宝-活动规则
 */
(function($) {

    H.rule = {
        init : function(){
            $.get("data.ss", ruleCallback, "json");
        }
    }

    W.ruleCallback = function(data){
        if(data.code == 0){
            $('#rule-content').empty().text(data.con);
        }
    }

})(Zepto);

H.rule.init();
