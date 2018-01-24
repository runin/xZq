(function($) {
    H.over = {
        init: function () {
            this.tttj();
            $.fn.cookie('jumpNum', 0, {expires: -1});
        },
        tttj: function() {
            $('#tttj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };

    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0 && data.desc && data.url) {
            $('#tttj').removeClass('none').find('p').text(data.desc || '');
            $('#tttj').click(function(e) {
                e.preventDefault();
                shownewLoading(null, '请稍后...');
                location.href = data.url;
            });
        } else {
            $('#tttj').remove();
        };
    };
})(Zepto);

$(function(){
    H.over.init();
});