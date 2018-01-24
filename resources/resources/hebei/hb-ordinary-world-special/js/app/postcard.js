(function($) {
	H.postcard = {
        ruid: getQueryString("ruid"),
		init: function() {
            var me = this;
            me.event();
            me.cardList();
            if(me.ruid != null && me.ruid.length > 0){
                getResult("api/linesdiy/recorddiy",{uuid:me.ruid},"callbackLinesDiyRecordHandler",true);
            }
		},
        event: function(){
        	$(".back-btn").click(function(e){
        		e.preventDefault();
        		toUrl("enter.html")
        	})
        },
        cardList: function(){
            getResult("api/linesdiy/info",{},'callbackLinesDiyInfoHandler',true);
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            var items = data.gitems;
            var t = simpleTpl();
            for(var i = 0;i < items.length;i++){
                t._('<li id="'+items[i].uid+'">')
                    ._('<img src="images/load.jpg" class="fr lazy" data-original="'+items[i].ib+'">')
                    ._('<div class="ron">')
                        ._('<p class="to">To:<input disabled="disabled" type="text"></p>')
                        ._('<textarea disabled="disabled" type="text">在明信片相应位置点击即可填写</textarea>')
                        ._('<p class="from">From:<input disabled="disabled" type="text"></p>')
                    ._('</div>')
                ._('</li>');
            }
            $(".card-list").html(t.toString());
            $("img.lazy").picLazyLoad({effect: "fadeIn"});
            $("li").click(function(){
                var img = $(this).find("img").attr("src");
                var uid = $(this).attr("id");
                H.dialog.postcard.open(img,uid);
            });
        }
    }

    W.callbackLinesDiyRecordHandler = function(data){
        if(data.code == 0){
            H.dialog.postcard.open(data.ib, H.postcard.ruid);
            H.dialog.postcard.update(data.jd);
        }
    }

})(Zepto);

$(function(){
	H.postcard.init();
});