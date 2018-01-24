+(function ($) {
    var index = {
        initParam: function () {
            this.car = $(".car"); //车子
            this.swpie_car = $(".swpie_car"); //车子的路径
            this.lastdistance = 0; //上一次走的距离
            this.lastdeltax = 0; //用于判断步伐 大于30 用动画走完全程
            this.allwidth = this.swpie_car.width() - this.car.width(); //总路程
            this.episodeBtn = $(".episode"); //剧情介绍
            this.episodeDialog = $("#episode"); //剧情介绍 弹框
            this.dialogClose = $(".dialog-close");
            this.dx = 0;
        },
        initEvent: function () {
            var that = this;
            $(document).delegate(".episode", "touchstart", function (e) {
                e.preventDefault();
                that.episodeDialog.removeClass("none");
                return false;
            });
            $(document).delegate("#episode .dialog-close", "touchstart", function (e) {
                e.preventDefault();
                that.episodeDialog.addClass("none");
                return false;
            });
            $(document).delegate("#episode .dialog-sure", "touchstart", function (e) {
                e.preventDefault();
                that.episodeDialog.addClass("none");
                return false;
            });
            function goToComment() {//跳到评论页
                setTimeout(function () {
                    showLoading();
                    setTimeout(function () {
                        window.location.href = "comment.html";
                    }, 300)
                }, 300);
            }
            function setContainerOffset(deltaX, animate) { //控制小车移动
                that.car.removeClass("animate");
                if (animate) {
                    that.car.addClass("animate");
                }
                that.lastdeltax = deltaX;
                that.car.css("-webkit-transform", "translateX(" + (deltaX) + "px)");
                if (deltaX >= that.allwidth) {
                    goToComment();
                }
            };
            that.car.bind("touchstart", function (e) {
                e.preventDefault();
                var offset = that.car.offset();
                that.dx = e.changedTouches[0].clientX - offset.left;
            });
            document.addEventListener("touchmove", function (e) { //移动事件  
                if (!$(e.target).hasClass("car") && !$(e.target).hasClass("finger")) {
                    return;
                }
                e.preventDefault(); //防止mousemove 事件
                if (that.lastdistance) {
                    setContainerOffset(that.lastdistance + e.touches[0].pageX - that.dx);
                    return;
                }
                var pageX = e.touches[0].pageX;
                setContainerOffset(pageX - that.dx);
            }, false);
            document.addEventListener("touchend", function (e) {//手指放开事件
                e.preventDefault(); //防止mousemove 事件
                if (Math.abs(that.lastdeltax) > 30) {//移动距离大于某个数值的时候，用动画走完全程
                    setContainerOffset(that.allwidth, true);
                } else {
                    if (that.lastdistance) {
                        that.lastdistance = that.lastdistance + e.touches[0].pageX - that.dx;
                        setContainerOffset(that.lastdistance);
                    } else {
                        setContainerOffset(0, true);
                    }
                }
            }, false);
        },
        loadEpisode: function () {//加载剧集信息
            loadData({ url: domain_url + "api/article/list", callbackArticledetailListHandler: function (data) {
                if (data.code == 0) {
                    var art = data.arts[0];
                    var uuid = art.uid;
                    loadData({ url: domain_url + "api/article/detail", callbackArticledetailDetailHandler: function (data2) {
                        if (data2.code == 0) {
                            $(".episode_con").html(data2.i);
                        }

                    }, data: { uuid: uuid }, showload: false
                    });
                }
            }, showload: false
            });
        },
        init: function () {
            this.initParam();
            this.initEvent();
            this.loadEpisode();
        }
    };
    index.init();
})(Zepto);