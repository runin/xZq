(function($) {
    
    H.pv = {
        $wrapper: $('.pv-wrapper'),

        htmlTpl: "",

        init: function() {
            H.pv.$wrapper.addClass('none');
            this.loadPv();
            
        },

        loadPv: function(){
            getResult('api/common/servicepv',{},'commonApiSPVHander');
            
        },

        fillpv: function(data){

            if(H.pv.htmlTpl == ""){
                H.pv.htmlTpl = H.pv.$wrapper.find('p').html();
            }

            H.pv.$wrapper.find('p').html(H.pv.htmlTpl.replace("%XXXXX%", data.c));
            H.pv.$wrapper.removeClass('none');

            setTimeout(function(){
                H.pv.loadPv();
            }, 5000);
        }

    };

    W.commonApiSPVHander = function(data){
        if(data.code == 0){
            H.pv.fillpv(data);
        }
    };

    //H.pv.init();

})(Zepto);