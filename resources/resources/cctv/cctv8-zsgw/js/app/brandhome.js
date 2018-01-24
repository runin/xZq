(function($) {
    H.brandhome = {
    	$brandlist:$(".brand-list"),
        $btnDialogClose:$(".btn-dialog-close"),
        $btnDialogLottery:$(".btn-dialog-lottery"),
        
        
        init: function() {
            this.scrollMax();
            this.eventHander();
            this.dataArticle();
        },
        dataArticle:function()
        {
            getResult("api/article/list",{},"callbackArticledetailListHandler")
        },
        loadGoodList:function(uuid)
        {
            getResult("api/article/section",{uuid:uuid},"callbackArticledetailDetailSectionHandler",true)
        },
        domFill:function(data)
        {
            var me = this;
            var t = simpleTpl();
            t._("<ul>")
            for(var i=0;i<data.length;i++)
            {
                t._('<li><a href="'+((data[i].gu != undefined && data[i].gu != "") ? data[i].gu:"javascript:void(0)")+'" data-collect="true" data-collect-flag="dialog-brand-'+i+'" data-collect-desc="商品-品牌馆-'+data[i].n+'"><img src="'+data[i].img+'" alt="" onerror="$(this).closest(\'li\').addClass(\'none\')"></a></li>')
            }
            t._("</ul>")
            me.$brandlist.append(t.toString());
        },
        eventHander: function() {
            var me = this;
            me.$btnDialogClose.on("touchend",function(e)
            {
                e.preventDefault();
                $(".modal-yao").closest(".modal-yao").addClass("none");
            })
            me.$btnDialogLottery.on("touchend",function(e)
            {
                e.preventDefault();
                toUrl("lottery.html");
            })
        },
        scrollMax: function() {
        	var me = this;
        	me.$brandlist.css("height",$(window).height()-$(".top-box").height());
        }
    };
    W.callbackArticledetailListHandler=function(data)
    {
        if(data.code==0)
        {
            console.log(data.arts);
            H.brandhome.loadGoodList(data.arts[0].uid);
            
        }
    }
    W.callbackArticledetailDetailSectionHandler=function(data)
    {
        if(data.code==0)
        {
             H.brandhome.domFill(data.items);
        }
    }
    H.brandhome.init();
})(Zepto);
