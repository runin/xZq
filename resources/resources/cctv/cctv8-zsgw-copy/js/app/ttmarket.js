(function($) {
    H.ttMarket = {
        $banner:$(".top-box").find("section"),
        $goodsList: $(".goods-list"),
        $btnDialogClose: $(".btn-dialog-close"),
        $btnDialogLottery: $(".btn-dialog-lottery"),
        $meunTab: $(".meun-box").find("a"),
        furniture: [],
        food: [],
        dress: [],
        jewel: [],
        uuid: null,
        banner: null,
        type: true,
        classfiyType: 1,
        init: function() {
            this.scrollMax();
            this.eventHander();
            this.dataArticle();
            this.eventHander();
            $(".top-box").find("img").css("width", $(window).width());
        },
        eventHander: function() {
            var me = this;
            me.$btnDialogClose.on("touchend", function(e) {
                e.preventDefault();
                $(".modal-yao").closest(".modal-yao").addClass("none");
            })
            me.$btnDialogLottery.on("touchend", function(e) {
                e.preventDefault();
                toUrl("lottery.html");
            })

            $(".furniture").on("touchend", function() {
                if ($(this).hasClass("check")) {
                    return
                }
                H.ttMarket.classfiyType = 1;
                H.ttMarket.furniture = [];
                me.loadGoodList(H.ttMarket.uuid);

            });
            $(".food").on("touchend", function() {
                if ($(this).hasClass("check")) {
                    return
                }
                H.ttMarket.classfiyType = 2;
                H.ttMarket.food = [];
                me.loadGoodList(H.ttMarket.uuid);

            })
            $(".dress").on("touchend", function() {
                if ($(this).hasClass("check")) {
                    return
                }
                H.ttMarket.classfiyType = 3;
                H.ttMarket.jewel = [];
                me.loadGoodList(H.ttMarket.uuid);

            })
            $(".jewel").on("touchend", function() {
                if ($(this).hasClass("check")) {
                    return
                }
                H.ttMarket.classfiyType = 4;
                H.ttMarket.dress = [];
                me.loadGoodList(H.ttMarket.uuid);
            })
            me.$meunTab.on("touchend", function(e) {
                e.preventDefault();
                $(this).addClass("check").siblings().removeClass("check");
            })
        },
        dataArticle: function() {

            getResult("api/article/list", {}, "callbackArticledetailListHandler")
        },
        loadGoodList: function(uuid) {
            H.ttMarket.type = 2,
                getResult("api/article/section", { uuid: uuid }, "callbackArticledetailDetailSectionHandler", true)
        },
        bannderList: function(uuid) {
            H.ttMarket.type = 1,
                getResult("api/article/section", { uuid: uuid }, "callbackArticledetailDetailSectionHandler", true)
        },
        bannderFill: function(uuid) {
            var me = this;
            var t = simpleTpl();
        },
        domFill: function(items) {
            var me = this;
            var t = simpleTpl();
            for (var i = 0; i < items.length; i++) {

                t._('<li><a href="' + ((items[i].gu != undefined && items[i].gu != "") ? items[i].gu : "javascript:void(0)") + '" data-collect="true" data-collect-flag="dialog-ttmarket-' + i + '" data-collect-desc="商品-天天低价-' + items[i].n + '"><img src="' + items[i].img + '" alt="" onerror="$(this).closest(\'li\').addClass(\'none\')"></a></li>')
            }
            me.$goodsList.find("ul").empty();
            me.$goodsList.find("ul").append(t.toString());
        },
        scrollMax: function() {
            var me = this;
            me.$goodsList.css("min-height", $(window).height() - $(".top-box").height());
        },
        swiperBanner: function(items) {
            var me = this;
            var t = simpleTpl();
            t._('<div class="swiper-container">')
            t._('<div class="swiper-wrapper">')
            for (var i = 0; i < items.length; i++) {
                t._('<div class="swiper-slide"><a href="' + ((items[i].gu != undefined && items[i].gu != "") ? items[i].gu : "javascript:void(0)") + '" data-collect="true" data-collect-flag="dialog-ttBannder-' + i + '" data-collect-desc="商品-天天轮播-' + items[i].n + '"><img src="' + items[i].img + '" alt="" onerror="$(this).closest(\'li\').addClass(\'none\')"></a></div>')
            }
            t._('</div><div class="swiper-pagination"></div></div>');
            me.$banner.append(t.toString());
            var mySwiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                autoplay: 3000,
                speed: 300,
            })
            
        }
    };
    W.callbackArticledetailListHandler = function(data) {
        if (data.code == 0) {
            H.ttMarket.uuid = data.arts[1].uid;
            if(typeof data.arts[3] !="undefined")
            {
                H.ttMarket.banner = data.arts[3].uid;
                H.ttMarket.bannderList(data.arts[3].uid);
            }
            else
            {
                H.ttMarket.type = 2;
                // $(".goods-list").css("padding-top","10px")
                H.ttMarket.loadGoodList(H.ttMarket.uuid);
            }
            
        }
    }
    W.callbackArticledetailDetailSectionHandler = function(data) {
        if (data.code == 0) {
            //var count = 1;
            if (H.ttMarket.type == 1) {
                H.ttMarket.type = 2;
                H.ttMarket.loadGoodList(H.ttMarket.uuid);
                H.ttMarket.swiperBanner(data.items);
            } else {
                H.ttMarket.domFill(data.items);
            }

            // $.each(data.items, function(index, el) {
            //     count++; 
            //     if (el.tt == "居家") {
            //         H.ttMarket.furniture.push(el);

            //     } else if (el.tt == "营养") {
            //         H.ttMarket.food.push(el);
            //     } else if (el.tt == "服装") {
            //         H.ttMarket.dress.push(el);
            //     } else if (el.tt == "珠宝") {
            //         H.ttMarket.jewel.push(el);
            //     }

            // })
            // if (count >= data.items.length) {
            //     if (H.ttMarket.classfiyType == 1) {
            //         H.ttMarket.domFill(H.ttMarket.furniture);
            //         console.log(H.ttMarket.furniture);
            //     } else if (H.ttMarket.classfiyType == 2) {
            //         console.log(H.ttMarket.food);
            //         H.ttMarket.domFill(H.ttMarket.food);
            //     } else if (H.ttMarket.classfiyType == 3) {
            //         console.log(H.ttMarket.dress);
            //         H.ttMarket.domFill(H.ttMarket.dress);
            //     } else if (H.ttMarket.classfiyType == 4) {
            //         console.log(H.ttMarket.jewel);
            //         H.ttMarket.domFill(H.ttMarket.jewel);
            //     }
            // }
        } else {
            if (H.ttMarket.type == 1) {
                H.ttMarket.type = 2;
                H.ttMarket.loadGoodList(H.ttMarket.uuid);
                H.ttMarket.swiperBanner(data.items);
            } else {
                H.ttMarket.domFill(data.items);
            }
        }
    }
    H.ttMarket.init();
})(Zepto);
