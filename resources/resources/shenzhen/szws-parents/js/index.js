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
        //        hashchange: (function () {
        //            $(window).bind("hashchange", function () {
        //                var pname = window.location.hash.slice(1);
        //                if (pname) {
        //                    if (N.page[pname]) {
        //                        N.page[pname]();
        //                    }

        //                } else {
        //                    pname = "firstPage";
        //                    if (N.page[pname]) {
        //                        N.page[pname]();
        //                    }

        //                }
        //                if (N[pname].goIntoFn) {
        //                    N[pname].goIntoFn();
        //                }
        //            });
        //            return {};
        //        })(),
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

    N.module("index", function () {

        var event = {
            pre_btnFn: function () {
                var reserveId = window.reserveId_t;
                var dateT = window.date_t;
                if (!reserveId) {
                    return;
                }
                shaketv.reserve_v2({ tvid: yao_tv_id, reserveid: reserveId, date: dateT }, function (data) { });
            },
            ruleFn: function () {
                var arr = [];
                arr.push("<img src='./images/rule.png' />");
                arr.push("<img src='./images/close.png' class='close_rule' />");
                arr.push("<p class='rule_centent'></p>");
                var win = new N.showWin({
                    html: arr.join(""),
                    beforeOpenFn: function (w) {
                        w.find(".win_contain").css({ "background-color": "Transparent", "width": "280px", "height": "350px" });
                    },
                    afterOpenFn: function (w, t) {
                        w.cartoon({ duration: 1, content: function () {
                            var arr = [];
                            arr.push("0% { opacity:0; }");
                            arr.push("100% { opacity:1;}");
                            return arr.join("");
                        }, complete: function (t) {
                        }
                        });
                        w.find(".close_rule").click(function () {
                            t.close();
                        });
                        N.loadData({ url: domain_url + "api/common/rule", commonApiRuleHandler: function (data) {
                            if (data.code == 0) {
                                w.find(".rule_centent").html(data.rule);
                            }
                        }
                        });
                    }
                });
                win.init();
            },
            participateFn: function () {
                window.location.href = "main.html";
            }
        };
        this.initParam = function () {
            this.pre_btn = $(".pre_btn"); //预约按钮
            this.rule = $(".rule"); //规则按钮
            this.participate = $(".participate"); //点击进去按钮
            $(".middle_tip").hide();
        };
        this.initEvent = function () {
            this.pre_btn.click($.proxy(event.pre_btnFn, this));
            this.rule.click($.proxy(event.ruleFn, this));
            this.participate.click($.proxy(event.participateFn, this));
        };
        this.loadPre = function () {//加载预约信息
            var that = this;
            N.loadData({ url: domain_url + "program/reserve/get", callbackProgramReserveHandler: function (data) {
                if (!data.reserveId) {
                    that.pre_btn.hide();
                    return;
                } else {
                    window.reserveId_t = data.reserveId;
                    window.date_t = data.date;
                    window['shaketv'] && shaketv.preReserve_v2({ tvid: yao_tv_id, reserveid: data.reserveId, date: data.date }, function (resp) {
                        if (resp.errorCode == 0) {
                            that.pre_btn.show();
                        }
                    });
                }
            }
            });

        };
        this.popWin = function () {
            $(".middle_tip").show();
            $(".middle_tip").cartoon({ duration: 1, content: function () {
                var arr = [];
                arr.push("0% { opacity:0; }");
                arr.push("100% { opacity:1;}");
                return arr.join("");
            }, complete: function (t) {
                t.css("opacity", 1);
                t.find(".close").click(function () {
                    t.remove();
                });
                t.find(".sureBtn").click(function () {
                    t.remove();
                });
            }
            });

        };
        this.init = function () {
            this.initParam();
            this.initEvent();
            this.loadPre(); //加载预约信息
            if (window.location.href.indexOf('cb41faa22e731e9b') == -1) {
                $('#div_subscribe_area').css('height', '0');
            } else {
                $('#div_subscribe_area').css('height', '50px');
            };
            if (window.location.href.indexOf('cb41faa22e731e9b') == -1) {
                this.popWin(); //弹出引导页
            }
        };
        this.init();
    });
});