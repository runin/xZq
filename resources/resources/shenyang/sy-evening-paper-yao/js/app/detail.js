
(function($) {
    H.detail = {
        uid: getQueryString('uid'),
        init: function(){
            this.event();
            this.getDetail();
        },
        getDetail: function(){
            getResult('api/article/detail', {
                uuid: H.detail.uid
            },'callbackArticledetailDetailHandler');
        },
        event: function(){
            $('.back-home').click(function(e){
                e.preventDefault();
                toUrl('list.html');
            });
        }
    }
    W.callbackArticledetailDetailHandler = function(data){
        if(data.code == 0){
            $('header h1').text(data.t || '');
            $('section').html(data.c || '');
        }
    }
})(Zepto);
$(function(){
    H.detail.init();
});