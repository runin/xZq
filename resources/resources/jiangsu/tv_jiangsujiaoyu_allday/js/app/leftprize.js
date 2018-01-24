(function($) {
    
    H.leftprize = {
        $wrapper: $('.leftprize-wrapper'),
        $content: $('.leftprize-wrapper p'),
        htmlTpl: "",

        init: function() {
            H.leftprize.$wrapper.addClass('none');
            H.leftprize.loadLeftPrize();
        },

        loadLeftPrize: function(){
             getResult('api/lottery/leftLimitPrize',{
                at : 1
            },'callbackLeftLimitPrizeHandler');
        },

        fillLeftPrize: function(data){
            if(data.lc > 0){
                H.leftprize.$wrapper.removeClass('none');
                if(H.leftprize.htmlTpl == ""){
                    H.leftprize.htmlTpl = H.leftprize.$wrapper.find('p').html();
                }
                H.leftprize.$content.html(H.leftprize.htmlTpl.replace("%XXXXX%", data.lc));
            }else{
                H.leftprize.$wrapper.addClass('none');
            }
            
            setTimeout(function(){
                H.leftprize.loadLeftPrize();
            }, 5000);
        }

    };

    W.callbackLeftLimitPrizeHandler = function(data){
        if(data.result == true){
            H.leftprize.fillLeftPrize(data);
        }

        setTimeout(function(){
           H.leftprize.loadLeftPrize();
        }, 5000);
    };

    H.leftprize.init();

})(Zepto);