(function($) {
    H.operaDetail = {
        operaSort: getQueryString("operaSort"),
        $container: $(".container"),
        $content: $(".content"),
        uuid: null,
        init: function() {
            this.event();
            this.dataArticle();

        },
        initResize: function() {

        },
        event: function() {
            $("#btn-back").on("touchend", function(e) {
                e.preventDefault();
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    shownewLoading();
                    toUrl('opera.html');
                }
            })
        },
        dataArticle: function() {
            getResult("api/article/list", {}, "callbackArticledetailListHandler", true)
        },
        loadOperaList: function(uuid) {
            getResult("api/article/section", { uuid: uuid }, "callbackArticledetailDetailSectionHandler", true);
        },
        fillDom: function(item) {
            var me = this;
            me.$container.empty().append(item.ct.toString()).removeClass("none");
            $("img").parent().css("padding","0!important");
        }
    };
    W.callbackArticledetailListHandler = function(data) {
        if (data.code == 0) {
            H.operaDetail.uuid = data.arts[2].uid;
            H.operaDetail.loadOperaList(data.arts[2].uid);

        }
    }
    W.callbackArticledetailDetailSectionHandler = function(data) {
        if (data.code == 0) {
            H.operaDetail.fillDom(data.items[H.operaDetail.operaSort * 1])
        }
    }
    H.operaDetail.init();
})(Zepto);
