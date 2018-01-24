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
        loadImg: function (img) {//预加载图片
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
        showWin: function (obj) {//弹框函数
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
    N.module("pre_mainPage", function () {
        this.event = {//事件集合对象

        }
        this.initParam = function () {
            this.pre_btn = $(".pre_btn "); //预约按钮
            this.pre_mainPage = $(".pre_mainPage"); //容器
            $.fn.cookie("cookie_openId", openid);
            $.fn.cookie("cookie_appId", mpappid);
        }
        this.initEvent = function () {//初始化事件
        }
        this.loadData = function () {//加载列表数据 
            var that = this;
            N.loadData({ url: business_url + "mpAccount/mobile/redpack/list", callbackRedPackListHandler: function (data) {
                if (data.code == 0) {
                    that.appendData(data.activities);
                }
            }
            });
        }
        this.appendData = function (data) {//初始化列表
            this.pre_mainPage.empty(); //先清空
            var arr = [];
            arr.push('<div class="pre_item">');
            arr.push('<div class="pre_img_div">');
            arr.push('<a class="pre_link" href="#"></a>');
            arr.push('<div class="pre_tip">');
            arr.push('<span class="activityName">《喜乐街》</span> <span class="channelName"></span>');
            arr.push('</div>');
            arr.push('</div>');
            arr.push('<div class="pre_play">');
            arr.push(' <span class="play_type">播出时间 </span>：<span class="period">每周五19：20</span></div>');
            arr.push('<div class="pre_btn">');
            arr.push('预 约</div>');
            arr.push('</div>');

            for (var i = 0; i < data.length; i++) {
                var item = $(arr.join(''));
                var img = $("<img class='targat_img" + i + " item_img'   />");
                img.attr("xsrc", data[i].activityImgUrl);
                item.find(".pre_img_div").append(img);
                item.find(".activityName").text("《" + data[i].activityName + "》");
                item.find(".channelName").text(data[i].channelName);
                item.find(".period").text(data[i].period);
                item.find(".play_type").text(data[i].type == 1 ? "抽奖时间" : "播出时间");
                item.find(".pre_link").attr("href", "javascript:void(0)");
                item.find(".pre_link").attr("hrefTarget", data[i].activityUrl);
                var pl = item.find(".pre_link");
                pl.attr("data-collect", 'true');
                pl.attr("data-collect-desc", "《" + data[i].activityName + "》" + data[i].channelName);
                pl.attr("data-collect-flag", data[i].channelName);
                item.find(".pre_btn").text(data[i].reserveBtnName || "预 约");
                item.find(".pre_btn").addClass("none");
                this.pre_mainPage.append(item);
            }
            var itemCount = 0;
            var items = $(".pre_item")
            function SetPre_btn() {
                if (!data[itemCount]) return;
                var tvId = data[itemCount].tvId;
                var reserveId = data[itemCount].reserveId;
                var playDate = data[itemCount].playDate;
                if (!tvId || !reserveId || !playDate) {
                    itemCount++;
                    SetPre_btn();
                    return;
                }
                window['shaketv'] && shaketv.preReserve_v2({
                    tvid: tvId,
                    reserveid: reserveId,
                    date: playDate
                },
                function (resp) {
                    if (itemCount <= data.length - 1) {
                        var item = $(items.get(itemCount));
                        var pre_btn = item.find(".pre_btn");
                        if (resp.errorCode == 0) { //表示已经预约
                            pre_btn.removeClass("none");
                            pre_btn.append("<input class='tvId' type='hidden' value='" + tvId + "' /><input class='reserveId' type='hidden' value=" + reserveId + " /><input class='playDate' type='hidden' value=" + playDate + " />")
                            pre_btn.addClass("pre_btn_select");

                        } else if (resp.errorCode == -1007) {
                            pre_btn.removeClass("none");
                            pre_btn.text("已预约");
                        } else {
                            pre_btn.addClass("none");
                        }
                        itemCount++;
                        SetPre_btn();
                    }
                });
            }
            SetPre_btn();
            this.initPreBtnEvent();
        }
        this.initPreBtnEvent = function () {//初始化列表事件
            var thattemp = this;
            $(".pre_btn").click(function () {
                if ($(this).text() == "已预约") {
                    return;
                }
                var tvId = $(this).find(".tvId").val();
                var reserveId = $(this).find(".reserveId").val();
                var playDate = $(this).find(".playDate").val();
                var that1 = $(this);
                that1.attr("data-collect", 'true');
                that1.attr("data-collect-desc", "预约按钮");
                that1.attr("data-collect-flag", "pre_btn_select");
                var eventDesc = $(this).attr("data-collect-desc");
                var eventId = $(this).attr("data-collect-flag");
                thattemp.userlog.add(openid, eventDesc, eventId);
                shaketv.reserve_v2({
                    tvid: tvId,
                    reserveid: reserveId,
                    date: playDate
                },
                    function (data) {
                        if (data.errorCode != -1002) {
                            that1.text("已预约").removeClass("pre_btn_select");
                            $.fn.cookie("pre" + tvId + reserveId, "true", expires_in);
                        }
                    });
            });
            var that = this;
            $(".pre_link").click(function (e) {
                if ($(e.target).hasClass("pre_link")) {
                    var eventDesc = $(this).attr("data-collect-desc");
                    var eventId = $(this).attr("data-collect-flag");
                    that.userlog.add(openid, eventDesc, eventId);
                    window.location.href = $(this).attr("hrefTarget");
                }
            });
            var item_imgs = $(".item_img");
            var len = item_imgs.length;
            function scrollLoading() {
                var pre_items = $(".pre_item");
                var st = $(window).scrollTop(), sth = st + $(window).height();
                for (var i = 0; i < len; i++) {
                    var item_img = item_imgs.eq(i);
                    var ah = 0;
                    for (var k = 0; k <= ((i - 2) < 0 ? 0 : (i - 2)); k++) {
                        ah += $(pre_items.get(k)).height();
                    }
                    if (sth >= ah) {
                        var url = item_img.attr("xsrc");
                        if (url != "") {
                            item_img.attr("src", url);
                            item_img.attr("xsrc", "");
                            (function (img) {
                                img.onload = function () {
                                    $(this).parent(".pre_img_div").height($(this).height());
                                };

                            })(item_img.get(0));
                        }
                    }
                }
            };
            scrollLoading();
            $(window).bind("scroll", scrollLoading);
            this.userlog.in_page(); //用户进入页面加载
        };
        this.userlog = {//用户日记
            add: function (openid, eventDesc, eventId) {
                N.loadData({ url: business_url + "mpAccount/mobile/user/operate/log/add", callbackAddUserOperateLogHandler: function (data) {
                }, data: {
                    appId: busiAppId,
                    openId: openid,
                    eventDesc: encodeURIComponent(eventDesc),
                    eventId: eventId,
                    isPageLoad: false
                }, showload: false
                });
            },
            in_page: function () {
                N.loadData({ url: business_url + "mpAccount/mobile/user/operate/log/add", callbackAddUserOperateLogHandler: function (data) {
                }, data: {
                    appId: busiAppId,
                    openId: openid,
                    eventDesc: "",
                    eventId: "",
                    isPageLoad: true
                }, showload: false
                });
            }
        }
        this.init = function () {
            this.initParam(); //初始化参数
            this.initEvent(); //初始化事件
            this.loadData();
        };
        this.init();
    });
});
