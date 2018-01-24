$(function () {
    var N = {
        showPage: function (pageName, fn, pMoudel) {
            var mps = $(".page");
            mps.addClass("none");
            mps.each(function (i, item) {
                var t = $(item);
                if (t.attr("id") == pageName) {
                    t.removeClass("none");
                    N.currentPage = t;
                    if (fn) {
                        fn(t);
                    };
                    return false;
                }
            });
        },
        hashchange: (function () {
            $(window).bind("hashchange", function () {
                var pname = window.location.hash.slice(1);
                if (pname) {
                    N.page[pname]();
                } else {
                    pname = "firstPage";
                    N.page[pname]();
                }
                if (N[pname].goIntoFn) {
                    N[pname].goIntoFn();
                }
            });
            return {};
        })(),
        loadData: function (param) {
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", showload: true }, param);
            if (p.showload) { W.showLoading(); }
            var connt = 0;
            var cbName = "";
            var cbFn = null;
            for (var i in param) {
                connt++;
                if (connt == 2) {
                    cbName = i;
                    cbFn = param[i];
                    break;
                }
            }
            if (/test/.test(domain_url)) {
                if (!param.data) {
                    param.data = {};
                }
                param.data.dev = "jiawei";
            }
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonpCallback: cbName,
                success: function (data) {
                    W.hideLoading();
                    cbFn(data);
                },
                error: function () {
                    if (param.error) { param.error() };
                    W.hideLoading();
                }
            });
        },
        loadImg: function (img) {
            if (!this.images) {
                this.images = [];
            }
            if (img && !(img instanceof Array)) {
                img.isLoad = false;
                this.images.push(img);
            } else if ((img instanceof Array)) {
                for (var i = 0; i < img.length; i++) {
                    img[i].isLoad = false;
                    this.images.push(img[i]);
                }
            }
            for (var j = 0; j < this.images.length; j++) {
                var that = this;
                if (!this.images[j].isLoad) {
                    var im = new Image();
                    im.src = this.images[j].src;
                    this.images[j].isLoad = true;
                    im.onload = function () {

                    }
                }
            }
        },
        showWin: function (obj) {

            var p = $.extend({
                html: "", //内部html
                beforeOpenFn: null, //打开之前
                afterOpenFn: null//打开之后执行的函数
            }, obj || {});
            this.winObj = $('<div class="win"><div class="win_model"></div><div class="win_contain"><div class="win_html"></div></div></div>');
            this.close = function (fn) {
                this.winObj.remove();
                if (fn) {
                    fn()
                }
                if (this.closeFn) {
                    this.closeFn();
                }
            }
            this.setWidth = function (w) {
                this.winObj.css("width", w);
            }
            this.setHeight = function (h) {
                this.winObj.css("height", h);
            }
            this.setHtml = function (html) {
                this.winObj.find(".win_html").append(html || p.html);

            }

            this.initEvent = function () {
                var that = this;
                this.winObj.find(".win_close").unbind("click").click(function () {
                    that.close();
                });
            }
            this.init = function (fn) {
                this.setHtml();
                if (p.beforeOpenFn) {
                    p.beforeOpenFn(this.winObj);
                }
                $("body").append(this.winObj);
                this.initEvent();
                this.winObj.find(".win_contain").addClass("show_slow");
                if (p.afterOpenFn) {
                    p.afterOpenFn(this.winObj, this);
                }
                if (fn) {
                    fn();
                }
            }
        },
        module: function (mName, fn, fn2) {
            !N[mName] && (N[mName] = new fn());
            if (fn2) {
                $(function () {
                    fn2();
                });
            }
        }
    };

    N.module("firstPage", function () {

        this.initParam = function () {
            this.swiper_wrapper = $(".swiper-wrapper");
            var that = this;
            this.center_title = $(".center_title"); //底部标题
            this.center_playtime = $(".center_playtime"); //底部播放时间
            this.center_pre_btn = $(".center_pre_btn"); //底部预约按钮

            function showBg(index) {
                if (that.items[index]) {
                    $('.f_img').remove();
                    $("body").append($("<div class='f_img' ></div>").css({ "background": "url('" + that.items[index].is + "') no-repeat center center", "background-size": "cover" }).addClass("fadein"));
                }
                show_message(index);
            }
            function show_message(index) {
                if (that.items[index]) {
                    that.center_title.html(that.items[index].n);
                    that.center_playtime.html(that.items[index].pd);
                    var bbtn = $($(".pre_btn").get(index)).clone();
                    bbtn.index = index;

                    that.center_pre_btn.empty().append(bbtn);
                    bbtn.unbind("click").click(function (e) {
                        if ($(this).text() == "已预约") {
                            return;
                        }
                        if ($(this).hasClass("gay")) {
                            return;
                        }
                        var reserveId = $(this).attr("reserveId");
                        var date = $(this).attr("date");
                        if (!reserveId) {
                            return;
                        }
                        var that = $(this);
                        shaketv.reserve_v2({
                            tvid: yao_tv_id,
                            reserveid: reserveId,
                            date: date
                        },
                            function (d) {
                                if (d.errorCode == 0) {
                                    bbtn.addClass("gay").text("已预约");
                                    $($(".pre_btn").get(bbtn.index)).addClass("gay").text("已预约");
                                   
                                } else {
                                    console.log(d.errorCode + ":" + d.errorMsg);
                                }

                            });
                    });

                }
            }
            this.swiper_f_param = {  //滑块配置项
                direction: 'horizontal',
                pagination: '.item_point_sub',
                paginationClickable: true,
                centeredSlides: true,
                spaceBetween: 0,
                slidesPerView: 2,
                onInit: function () {
                    showBg(0);
                }, onSlideChangeEnd: function (s) {
                    var index = $(".swiper-active-switch").index();
                    if (index < 0) {
                        index = 0;
                    }
                    showBg(index);
                }
            };
        };
        this.preload = function (items) {//预加载图片
            var arr = [];
            for (var i = 0, len = items.length; i < len; i++) {
                var o = {};
                o.src = items[i].is;
                arr.push(o);
            }
            N.loadImg(arr);
        };
        this.appendData = function (items) { //构造数据
            var arr = [];
            arr.push("<div class='swiper-slide'>");
            arr.push("<div class='bg_img'><img class='show_img'  src='#' /></div>");
            arr.push("<div class='b_swiper_bg'><img class='swiper_img' src='#' />");
            arr.push("<a href='#' class='jumpa' ></a>");
            arr.push("<div class='bottomDiv none'>");
            arr.push("<div class='title'></div>");
            arr.push("<div class='playtime'></div>");
            arr.push("<div class='pre_btn'>预 约</div>");
            arr.push("</div>");
            arr.push("</div></div>");
            for (var i = 0, len = items.length; i < len; i++) {
                var sitem = $(arr.join(''));
                sitem.find(".swiper_img").attr("src", items[i].is); //设置图片

                sitem.find(".show_img").attr("src", items[i].is);
                sitem.find(".title").html(items[i].n); //设置节目名称
                sitem.find(".playtime").html(items[i].pd); //设置文字

                (function (yao_tv_id, reserveId, sitem, items, i, date) {
                    if (!items[i].reserveId || !date) {
                        sitem.find(".pre_btn").addClass("none");
                        return;
                    }
                    shaketv.preReserve_v2({
                        tvid: yao_tv_id,
                        reserveid: reserveId,
                        date: date
                    }, function (resp) {
                        if (resp.errorCode == 0) {
                            sitem.find(".pre_btn").attr("reserveId", reserveId); //预约
                            sitem.find(".pre_btn").attr("date", date); //预约
                            items[i].iscanPre = true;
                        } else if (resp.errorCode == -1007) {
                            sitem.find(".pre_btn").addClass("gay").text("已预约");
                            items[i].iscanPre = true;
                        }
                        else {
                            sitem.find(".pre_btn").addClass("none");
                        }
                    });
                })(yao_tv_id, items[i].reserveId, sitem, items, i, items[i].date);

                sitem.find(".jumpa").attr("href", items[i].url || items[i].gourl); //跳转
                this.swiper_wrapper.append(sitem);
            }
        };
        this.loadData = function (fn) {//加载数据
            var that = this;
            N.loadData({ url: domain_url + "index/programlist", callbackRcommendProgramlistHander: function (data) {
                if (data.code == 0) {
                    var items = data.items;
                    that.preload(items);
                    that.items = items;
                    that.appendData(items);
                    if (fn) {
                        fn();
                    }
                } else {
                    alert("抱歉网络延迟");
                }
            }, error: function () {
                alert("抱歉网络延迟");
            }
            });
        };
        this.initWrapper = function () { //初始化滑块
            this.swiper_f = new Swiper('.swiper_f', this.swiper_f_param);


        };
        this.initEvent = function () {



        };
        this.init = function () {
            this.initParam(); //参数初始化
            this.loadData($.proxy(function () { //加载数据
                this.initWrapper(); //初始化滑块
                this.initEvent(); //初始化事件
            }, this));
        };
        this.init();

    });

});