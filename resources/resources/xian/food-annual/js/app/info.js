(function($) {

    H.info = {
        init: function() {
            getResult('vote/detail', {
                attrUuid: getQueryString('au')
            }, 'detailHandler', true);
            var height = $(window).height();
            $('.main').css('minHeight', height);
        }
    };

    W.detailHandler =function(data) {
        if(data.code == 0){
            $('.info').html(data.ad);
        }
    };

})(Zepto);
$(function(){
	H.info.init();
});