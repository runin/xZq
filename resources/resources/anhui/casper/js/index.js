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
            if (p.showload) {
                W.showLoading();
            }
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
                    // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
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
                    p.beforeOpenFn(this.winObj, this);
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

    N.module("main", function () {
        var that = this;
        this.evenObj = {
            inbtnfn: function () {//点击进入话题讨论
                window.location.href = "talk.html";
            },
            down_loadfn: function () { //点击下载宝典
                window.open('http://www.xueba100.com/marketing/weishi.html', 'newwindow');
            },
            casper_lookfn: function () {//点击跳转到详细页面
                this.swiper1._slideNext();
            },
            addShake: function () {//添加摇事件的回调
                that.swiper1._slideNext();
                that.removeShake();

            },
            removeShake: function () { //移除摇事件的回调

            },
            buyBtnfn: function () { //点击购买按钮
                this.dimensionTwoWin = new N.showWin({
                    html: "<div class='twopic'><img src='./images/twopic.png' alt=''   /><img src='./images/close.png' alt='' class='close'  /></div>",
                    beforeOpenFn: function (win, t) {
                        win.find(".win_contain").css({ "background-color": "transparent" });
                        win.find(".close").click(function () {
                            t.close();
                        });
                    }
                });
                this.dimensionTwoWin.init();
            }
        };
        this.initParam = function () {
            this.inbtn = $(".in"); //进入讨论图片
            this.down_load = $(".down_load"); //宝典按钮
            this.casper_look = $(".casper_look"); //围观
            this.swiper_casper = $(".swiper_casper"); //滑动模块容器
            this.main_contain = $(".main_contain"); //学霸介绍
            this.buyBtn = $(".buyBtn"); //点击购买按钮
            this.div_subscribe_area = $("#div_subscribe_area");
            this.casper_bottom_name = $(".casper_bottom_name");
        };
        this.initEvent = function () {
            this.inbtn.click($.proxy(this.evenObj.inbtnfn, this));
            this.down_load.click($.proxy(this.evenObj.down_loadfn, this));
            this.casper_look.click($.proxy(this.evenObj.casper_lookfn, this));
            this.buyBtn.click($.proxy(this.evenObj.buyBtnfn, this));

            var img = new Image();
            img.src = "images/f_bbg.png";
            img.onload = function () {
                $(".middle").css({ "bottom": $(".f_bbg").height() - 95 + "px" });
                if ($(window).height() >= 667) {
                    $(".middle").css({ "bottom": $(".f_bbg").height() - 105 + "px" });
                }
                if ($(window).height() >= 736) {
                    $(".middle").css({ "bottom": $(".f_bbg").height() - 110 + "px" });
                }
            }
        };
        this.initShake = function () {
            this.addShake = function () {
                window.addEventListener('shake', this.evenObj.addShake, false);
            };
            this.addShake();
            this.removeShake = function () {
                window.removeEventListener('shake', this.evenObj.removeShake, false);
            }
        };
        this.initSwiper = function () {
            var that = this;
            this.initSwiper2 = function (items) {
                function appendData(items) {
                    var arr = [];
                    arr.push('<div class="swiper-slide">');
                    arr.push('<div class="userbg"></div>');
                    arr.push('<input class="casper_name" type="hidden" />  ');
                    arr.push('<input class="casper_uid" type="hidden" /> ');
                    arr.push('<input class="casper_i" type="hidden" /></div>');
                    var sdiv = $(arr.join(''));
                    var arr_str = [];
                    for (var i = 0, len = items.length; i < len; i++) {
                        var cdiv = sdiv.clone(true);
                        cdiv.find(".userbg").css({ "background": "url('" + items[i].img + "') no-repeat center center;", "background-size": "cover" });
                        cdiv.find(".casper_name").val(items[i].t);
                        cdiv.find(".casper_uid").val(items[i].uid);
                        cdiv.find(".casper_i").val(items[i].i);
                        arr_str.push(cdiv.get(0).outerHTML);
                    }
                    that.swiper_casper.append(arr_str.join(""));
                };
                appendData(items);
                that.initS2();
            };
            this.showIndexData = function (index) {
                if (this.items) {

                    this.main_contain.html(this.items[index].i);
                    this.casper_bottom_name.html(this.items[index].t);
                }

            };
            this.swiper_obj1 = {
                direction: 'vertical',
                onInit: function () {

                }, onSlideChangeEnd: function (s) {
                    var index = s.activeIndex;
                    if (index < 0) {
                        index = 0;
                    }
                    if (index > that.items.length - 1) {
                        index = that.items.length - 1;
                    }
                    if (index == 1) {
                        that.addShake();
                    }
                }
            }
            this.swiper1 = new Swiper('.swiper1', this.swiper_obj1);
            (function () {
                N.loadData({ url: domain_url + 'api/article/list', callbackArticledetailListHandler: function (data) {
                    if (data.code == 0) {
                        that.items = data.arts;
                        that.initSwiper2(data.arts);
                    } else {
                        alert("抱歉加载延迟");
                    }
                }
                });
            })();

            this.initS2 = function () {
                var that = this;
                this.swiper_obj2 = {
                    paginationClickable: true,
                    centeredSlides: true,
                    spaceBetween: 30,
                    slidesPerView: 2,
                    grabCursor: true,
                    calculateHeight: true,
                    cssWidthAndHeight: false,
                    noSwiping: true,
                    initialSlide: 1,
                    onInit: function () {
                        that.showIndexData(1)
                    }, onSlideChangeEnd: function (s) {
                        var index = s.activeIndex;
                        if (index < 0) {
                            index = 0;
                        }
                        if (index > that.items.length - 1) {
                            index = that.items.length - 1;
                        }
                        that.showIndexData(index);
                    }
                }
                this.swiper2 = new Swiper('.swiper2', this.swiper_obj2);
            };
        };
        this.init = function () {
            this.initParam();
            this.initEvent();
            this.initShake(); //初始化要事件
            this.initSwiper(); //初始化滑动
        };
        this.init();
    });
});