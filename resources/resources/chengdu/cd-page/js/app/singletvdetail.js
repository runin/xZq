(function($) {
    H.singletvdetail = {
        $swiperData: $(".swiper-wrapper"),
        $swiperText: $(".content-box"),
        $detailBack: $(".detail-back"),
        $scrollBox: $(".scroll-box"),

        idNum: getQueryString("uid"),
        init: function() {
            this.eventHander();
            this.getTimeImgFn();
        },
        contextFill: function(imgList, context) {
            var t = simpleTpl();
            for (var i = 0; i < imgList.length; i++) {
                t._('<div class="swiper-slide">')
                    ._('<img src="' + imgList[i] + '">')
                    ._('</div>')
            }
            H.singletvdetail.$swiperData.empty().append(t.toString());
            H.singletvdetail.$swiperText.empty().append(context.toString());

            var mySwiper = new Swiper('.swiper-container', {
                pagination: '.pagination',
                autoplay: 4000, //可选选项，自动滑动
                loop: true, //可选选项，开启循环
            })
            H.singletvdetail.$scrollBox.removeClass("none");
        },
        getTimeImgFn: function() { //节目管理(首页滚动图片)
            getResult('api/recommendpro/programlist', {}, 'callbackApiRedProlistHandler');
        },
        eventHander: function() {
            this.$detailBack.click(function() {

                toUrl("menu.html");
            })
        },

    }
    W.callbackApiRedProlistHandler = function(data) {
            if (data && data.code == 0) {
                var item = data.items[H.singletvdetail.idNum];
                var imgList = item.ib;
                var context = item.rdc;
                if (imgList.length > 1) {
                    imgList = imgList.split(",");
                } else if (imgList == undefined || imgList == "") {
                    showTips("暂无图形简介");
                }
                H.singletvdetail.contextFill(imgList, context);
            } else {
                showTips("暂无简介");
            }
        },
        H.singletvdetail.init();
})(Zepto);
