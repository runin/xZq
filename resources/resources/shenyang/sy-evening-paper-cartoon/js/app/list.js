(function($){
    H.list = {
        init: function(){
            this.newList();
            this.event();
        },
        newList: function(){
            getResult('api/ article /list', {}, 'callbackArticledetailListHandler', true);
        },
        fillNewTilt: function(data){
            var t = simpleTpl(),
                items = data.arts,
                $ul = $('ul');
            for(i = 0, len = items.length; i< len; i++){
                t._('<li data-uid = "'+ items[i].uid +'" data-gu="'+ items[i].gu +'"><span>'+ items[i].t +'</span><span><img src="'+ items[i].img +'"></span></li>')
            }
            $ul.append(t.toString());
        },
        event: function(){
            $('.btn-back').click(function(e){
                e.preventDefault();
                toUrl('index.html');
            });
            $('ul').delegate('li', 'click', function(e){
                e.preventDefault();
                if($(this).attr('data-gu')){
                    toUrl($(this).attr('data-gu'));
                }else{
                    toUrl('detail.html?uid=' + $(this).attr('data-uid'));
                }
            });
        }
    };
    W.callbackArticledetailListHandler = function(data) {
        if(data.code == 0){
            H.list.fillNewTilt(data);
        }
    };
})(Zepto);
$(function(){
    H.list.init();
});
