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
        },
        page: {
            firstPage: function (fn) {
                window.location.hash = "firstPage";
                N.showPage("firstPage", function () {
                    if (fn) {
                        fn();
                    }
                })
            },
            newsDisclose: function (fn) {//
                window.location.hash = "newsDisclose";
                N.showPage("news-disclose", function () {
                    if (fn) {
                        fn();
                    }
                })
            },
            Lottery: function (fn) {//抽奖页面
                window.location.hash = "Lottery";
                N.showPage("Lottery", function () {
                    $(".Lottery-success").addClass("none");
                    $(".Lottery-success-fillout").addClass("none");
                    $(".Lottery-success-tip").addClass("none");
                    $(".Lottery-success-no").addClass("none");
                    if (fn) {
                        fn();
                    }
                })
            },
            Lottery_success_fillout: function (fn) {//中奖页面填写资料
                window.location.hash = "Lottery";
                N.showPage("Lottery", function () {
                    $(".Lottery-success").removeClass("none");
                    $(".Lottery-success-fillout").removeClass("none");
                    $(".Lottery-success-tip").addClass("none");
                    $(".Lottery-success-no").addClass("none");
                    if (fn) {
                        fn();
                    }
                })
            },
            Lottery_success_tip: function (fn) {//中奖页面
                window.location.hash = "Lottery";
                N.showPage("Lottery", function () {
                    $(".Lottery-success").removeClass("none");
                    $(".Lottery-success-fillout").addClass("none");
                    $(".Lottery-success-tip").removeClass("none");
                    $(".Lottery-success-no").addClass("none");
                    if (fn) {
                        fn();
                    }
                })
            },
            Lottery_no: function (fn) {//不中奖页面
                window.location.hash = "Lottery";
                N.showPage("Lottery", function () {
                    $(".Lottery-success").addClass("none");
                    $(".Lottery-success-no").removeClass("none");
                    $(".Lottery-success-tip").removeClass("none");
                    if (fn) {
                        fn();
                    }
                })
            }
        }
    };
    N.module("firstPage", function () {//首页
        this.initParam = function () {
            this.golotteryBtn = $(".golotteryBtn"); //去抽奖页面
            this.firstPageBtn = $(".firstPage-btn"); //新闻爆料
            this.firstPageRule = $(".firstPage-rule"); //活动规则
            this.preBtn = $(".preBtn"); //预约活动
        };
        this.initEvent = function () {
            this.firstPageBtn.click(function () {
                N.page.newsDisclose();
                if ($.fn.cookie("app_phone")) {
                    $(".news-input").val($.fn.cookie("app_phone"));
                }
            });
            { //预约活动的代码
                N.loadData({ url: domain_url + "program/reserve/get", callbackProgramReserveHandler: function (data) {
                    if (!data.reserveId) {
                        $(".preBtn").addClass("none");
                        return;
                    } else {
                        window.reserveId_t = data.reserveId;
                        window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function (resp) {
                            if (resp.errorCode == 0) {
                                $(".preBtn").removeClass("none");
                            }
                        });
                    }
                }
                });
                this.preBtn.click(function () {
                    var reserveId = window.reserveId_t;
                    if (!reserveId) {
                        return;
                    }
                    shaketv.reserve(yao_tv_id, reserveId, function (data) {
                    });
                });
            };
            { //天天红包连接
                N.loadData({ url: domain_url + "api/common/promotion", commonApiPromotionHandler: function (data) {
                    var t = $("#tttj");
                    if (data.code == 0) {
                        t.removeClass("none");
                        t.attr("href", data.url);
                        t.html(data.desc);
                    } else {
                        t.addClass("none");
                    }

                }, data: { oi: openid }
                });
            };
            //            {//一键关注
            //                $(function () {
            //                    if (window.location.href.indexOf('cb41faa22e731e9b') == -1) {
            //                        $('#div_subscribe_area').css('height', '0');
            //                    } else {
            //                        $('#div_subscribe_area').css('height', '50px');

            //                    };
            //                });
            //                shaketv.subscribe({
            //                    appid: appid,
            //                    selector: "#div_subscribe_area",
            //                    type: 2
            //                }, function (returnData) {
            //                    alert(JSON.stringify(returnData));
            //                });

            //            }
            this.firstPageRule.click(function () {
                N.loadData({ url: domain_url + "common/rule", callbackRuleHandler: function (data) {
                    H.dialog.showWin.open("", function (w) {
                        $(".activities-btn", w).text("确定");
                    }, function () {//关闭回调

                    }, function (that) { //自定义内容
                        var arr = [];
                        arr.push('<section class="modal" id="rule-dialog">');
                        arr.push('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dn-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>');
                        arr.push('<div class="dialog rule-dialog"><h2></h2>');
                        arr.push('<div class="content border">');
                        arr.push('<div class="rule">');
                        if (data.code == 0) { //成功
                            arr.push('<div style="color:black;" >');
                            arr.push(data.rule);
                            arr.push('</div>');
                        }
                        else {
                            arr.push("<p>对不起，暂无活动规则！</p>");
                        }
                        arr.push("</div></div>")
                        arr.push('<p class="dialog-copyright">本活动最终解释权归湖南经视所有</p></div></section>');
                        return arr.join("");
                    });
                }
                });
            });

            this.golotteryBtn.click(function () {
                N.page.Lottery();

            });


        };
        this.loadIndex = function () {
            var that = this;
            N.loadData({ url: domain_url + "api/newsclue/info?yp=" + openid, callbackClueIndexHandler: function (data) {
                that.pet = data.pet; //每期结束时间
                that.pst = data.pst; //每期开始时间
                that.t = data.t; //每期标题
                that.uid = data.uid; //每期的uuid
                that.ml = baoliaoCount ? data.ml : -1; // data.ml; //-1 代表不限制
                if (data.ph) {
                    $(".news-input").val(data.ph);
                }
                localStorage.setItem(that.uid, that.ml);
            }
            });
        };
        this.init = function () {
            this.initParam();
            this.initEvent();
            this.loadIndex();
        };
        this.init();
    });
    N.module("newsDisclose", function () {//新闻爆料
        this.initParam = function () {
            this.newsTextarea = $(".news-textarea"); //新闻线索
            this.newsSubmit = $(".news-submit"); //提交按钮
            this.newsBlack = $(".news-black"); //返回按钮
            this.newsInput = $(".news-input"); //电话号码
            this.news_disclose_top = $(".news-disclose-top");
            this.newsDiscloseCount = 0; //爆料次数
        }
        this.initEvent = function () {
            var that = this;
            this.newsSubmit.click(function () {
                if (that.checkForm()) {
                    var phone = that.newsInput.val();
                    $.fn.cookie("app_phone", phone, expires_in);
                    var content = that.newsTextarea.val();
                    var imgs = that.fileUrls.join(',');
                    N.loadData({ url: domain_url + "api/newsclue/save", callbackClueSaveHandler: function (data) {
                        if (data.code == 0) {//成功
                            N.page.Lottery(function () {
                                N["news-disclose-success"].setlotteryCount(function () {
                                    if (N["news-disclose-success"].lCount <= 0) {//如果次数为0，区最后一次中奖的记录
                                        N.page.Lottery_success_tip(function () {
                                            var tip = $.fn.cookie("success_tip");
                                            if (tip) {
                                                $(".Lottery-success-tip .fillout").text("您最近一次获得了" + tip);
                                                $("#success-tip-phone").text($.fn.cookie("app_phone"));
                                                setTimeout(function () {
                                                    $(".Lottery-success").removeClass("none");
                                                    $(".Lottery-success-tip").removeClass("none");
                                                }, 100);
                                            } else {
                                                N.page.Lottery();
                                            }
                                        });
                                    }
                                });
                            });
                        } else {
                            if (data.message) {
                                H.dialog.showWin.open(data.message);
                            } else {
                                H.dialog.showWin.open("抱歉网络延迟");
                            }
                        }
                    }, data: { nickname: nickname, openid: openid, avatar: headimgurl, phone: phone, title: "", content: content, imgs: imgs, videos: "" }
                    });
                }
            });
            this.newsBlack.click(function () {
                N.page.firstPage();
            });
            this.news_disclose_top.click(function () {
                window.location.href = "https://wap.hn.10086.cn/wap/wapMall/index.jsp";
            });
        };
        this.checkForm = function () {
            if (this.newsTextarea.val().trim() == "") {
                H.dialog.showWin.open("请填写新闻线索");
                return false;
            }
            if (this.newsInput.val().trim() == "") {
                H.dialog.showWin.open("请填写联系电话");
                return false;
            }
            if (!/^[1][358]\d{9}$/.test(this.newsInput.val().trim())) {
                H.dialog.showWin.open("请填写正确的联系电话");
                return false;
            }
            //爆料次数控制
            var c = localStorage.getItem(N.firstPage.uid + "_ck");
            if (!c) {
                c = 0;
            }
            localStorage.setItem(N.firstPage.uid + "_ck", parseInt(c) + 1);
            var currentC = localStorage.getItem(N.firstPage.uid + "_ck");
            var ml = localStorage.getItem(N.firstPage.uid);
            if (parseInt(currentC) > parseInt(ml) && parseInt(ml) != -1) {
                H.dialog.showWin.open("抱歉，爆料次数已达到上限！");
                return;
            }
            return true;
        };
        this.initUpload = function () {//图片上传
            this.fileUrls = [];
            this.imgids = [];
            var that = this;
            $('#upload-box').upload({
                url: domain_url + 'fileupload/image', 	// 图片上传路径
                numLimit: 5, 						// 上传图片个数
                formCls: 'upload-form', 				// 上传form的class
                successFn: function (fileurl, form, id) {
                    that.fileUrls.push(fileurl);
                    that.imgids.push(id);
                },
                cancelFn: function (id) {
                    if (that.imgids.length == 1) {
                        that.imgids = [];
                        that.fileUrls = [];
                        return;
                    }
                    for (var i = 0; i < that.imgids.length; i++) {
                        if (that.imgids[i] == id) {
                            that.imgids = that.imgids.del(i, 1);
                            that.fileUrls = that.fileUrls.del(i, 1);
                            break;
                        }
                    }
                }
            });
        }
        this.init = function () {
            this.initParam();
            this.initEvent();
            this.initUpload();
            Array.prototype.del = function (n) {
                if (n < 0)
                    return this;
                else
                    return this.slice(0, n).concat(this.slice(n + 1, this.length));
            }
        };
        this.init();


    });
    N.module("news-disclose-success", function () {
        this.initParam = function () {

            this.$canvas = $canvas = $('#canvas'); //转盘
            this.$btn_lottery = $('#lottery-btn')[0]; //抽奖按钮
            this.lotteryCount = $("#lotteryCount");
            this.filloutSubmit = $(".fillout-submit"); //确认领奖按钮
            this.downCountNum = $(".downCountNum"); //倒计时显示div
            this.not_start_tip = $(".not_start_tip"); //提示
            this.Lottery_tip = $(".Lottery-tip");
            this.container = $(".container"); //canvas 的容器
            this.container_layer = $(".container_layer"); //canvas 的蒙层
            this.lottery_btn = $("#lottery_btn"); //抽奖按钮
            this.Lottery_success_fillout = $(".Lottery-success-fillout");


            this.lotteryData = []; //抽奖的转盘数据
            this.texts = []; //奖品描述
            this.images = []; //奖品图片路径
            this.font_size = 10;
            this.image_size = 45;
            this.lCount = 0; //还有抽奖次数
            this.initDataTime = function () {
                var dt = new Date();
                var y = dt.getFullYear();
                var m = dt.getMonth() + 1;
                var d = dt.getDate();
                var timestr = y + (m < 10 ? ("0" + m) : m) + (d < 10 ? ("0" + d) : d);
                if (!$.fn.cookie(timestr)) {//如果是新进来的话，默认3次机会
                    if ($.fn.cookie(timestr) != 0) {
                        $.fn.cookie(timestr, LotteryNumber, expires_lotteryCount); //默认三次数
                        this.lCount = parseInt($.fn.cookie(timestr));
                    } else {
                        this.lCount = 0;
                    }

                } else {
                    this.lCount = parseInt($.fn.cookie(timestr)); //赋值
                }
            };
            this.initDataTime(); //初始化时间cookie

        }
        this.lotteryCountFn = function (lc) {
            this.lotteryCount.text(lc);
        };
        this.setlotteryCount = function (fn) {
            this.lotteryCountFn(this.lCount);
            if (fn) {
                fn();
            }

        };
        this.decrease = function () {//递减抽奖次数
            this.lCount--;
            if (this.lCount < 0) {
                this.lCount == 0;
            }
            var dt = new Date();
            var y = dt.getFullYear();
            var m = dt.getMonth() + 1;
            var d = dt.getDate();
            var timestr = y + (m < 10 ? ("0" + m) : m) + (d < 10 ? ("0" + d) : d);
            $.fn.cookie(timestr, this.lCount, expires_lotteryCount);
            this.lotteryCountFn(this.lCount);
        };
        this.winning = function (data) { //中奖逻辑填写资料
            var that = this;
            N.page.Lottery_success_fillout(function () {
                //pn 名称  pt 数量  pu 单位
                var tip = data.pn + "一" + data.pu;
                if (data.pt == 2) {
                    tip = data.pn;
                }
                $.fn.cookie("success_tip", tip, expires_in);
                $(".Lottery-success-fillout .fillout").text("恭喜您获得了" + tip);
                $(".Lottery-success-tip .fillout").text("恭喜您获得了" + tip);
                $(".fillout-input").val($(".news-input").val());
                window.hasClick = false;
                that.filloutSubmit.unbind("click").click(function () {//领奖
                    if (hasClick) {
                        return;
                    }
                    hasClick = true;
                    var p = $(".fillout-input").val().trim();
                    if (p.trim() == "") {
                        H.dialog.showWin.open("请填写联系电话");
                        return false;
                    }
                    if (!/^[1][358]\d{9}$/.test(p.trim())) {
                        H.dialog.showWin.open("请填写正确的联系电话");
                        return false;
                    }
                    N.loadData({ url: domain_url + "api/lottery/hnjs/award?ph=" + p + "&oi=" + openid + "&nn=" + nickname + "&hi=" + headimgurl, callbackLotteryAwardHandler: function (data) {
                        hasClick = false;
                        if (data.result) {
                            if (data.pt == 12) {
                                window.location.href = data.redirectUrl

                            } else {
                                N.page.Lottery_success_tip(function () {
                                    $("#success-tip-phone").text(p);
                                });
                            }


                        } else {
                            H.dialog.showWin.open("抱歉，领奖失败！");
                        }
                    }, error: function () {
                        hasClick = false;
                    }
                    });
                });
            });
        };
        this.nowinning = function (ganxie) { //不中奖逻辑
            N.page.Lottery_no();
            if (ganxie) {
                $(".Lottery-success-no .fillout").text(" 很遗憾，您没有中奖，谢谢参与");
            } else {
                $(".Lottery-success-no .fillout").text(" 很遗憾，您没有中奖");
            }
        };
        this.getAwardIndex = function (uid) {
            var t = -1;
            if (!uid) {
                return t;
            }
            for (var i = 0; i < this.lotteryData.length; i++) {
                if (this.lotteryData[i].id == uid) {
                    t = i;
                    return t + 1;
                    break;
                }
            }
            return t;
        };

        this.dowmCount = function () {
            var that = this;
            var d = new Date();
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
            var d = d.getDate();
            var dateTime = y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d);
            var arr = [{ st: dateTime + " 12:00:00", et: dateTime + " 12:45:00" }, { st: dateTime + " 17:00:00", et: dateTime + " 18:00:00" },
                                        { st: dateTime + " 18:00:00", et: dateTime + " 18:30:00" }, { st: dateTime + " 22:50:00", et: dateTime + " 23:40:00"}];

            $(".downDiv").countDown({ timeArr: arr,
                countDownFn: function (t, time, index) {//每次倒数回调
                    if (that.Lottery_success_fillout.hasClass("none")) {
                        if (index == 0) {
                            that.downCountNum.removeClass("none").text("离抽奖开始还有：" + time);
                        } else {
                            that.downCountNum.removeClass("none").text("离下次抽奖开始还有：" + time);
                        }
                        that.Lottery_tip.addClass("none"); //中奖的次数
                        that.not_start_tip.addClass("none"); //没有开始的提示
                        //that.container.addClass("visibility_hidden");
                        that.container_layer.removeClass("none");
                        that.lottery_btn.attr("src", "./images/no_lottery_btn.png");
                        $(".Lottery-success-fillout").addClass("visibility_hidden");
                        $(".Lottery-success-tip").addClass("none");
                    }
                }, atTimeFn: function (t, index) {//在时间断内的回调函数 index 是倒到哪个时间断
                    if (that.Lottery_success_fillout.hasClass("none")) {
                        that.downCountNum.addClass("none");
                        that.not_start_tip.addClass("none"); //没有开始的提示
                        that.Lottery_tip.removeClass("none");
                        //that.container.removeClass("visibility_hidden");
                        that.container_layer.addClass("none");
                        that.lottery_btn.attr("src", "./images/lottery_btn.png");
                        $(".Lottery-success-fillout").removeClass("visibility_hidden");
                    }

                }, inQuantumFn: function (t, index) {

                    if (that.Lottery_success_fillout.hasClass("none")) {
                        that.lCount = LotteryNumber;
                        var dt = new Date();
                        var y = dt.getFullYear();
                        var m = dt.getMonth() + 1;
                        var d = dt.getDate();
                        var timestr = y + (m < 10 ? ("0" + m) : m) + (d < 10 ? ("0" + d) : d);
                        if (!$.fn.cookie("pre_" + index + "_" + timestr)) {
                            $.fn.cookie("pre_" + index + "_" + timestr, LotteryNumber, expires_lotteryCount);
                            $.fn.cookie(timestr, LotteryNumber, expires_lotteryCount);
                            that.Lottery_tip.removeClass("none"); //中奖的次数
                            that.Lottery_tip.find("#lotteryCount").text(that.lCount);
                        } else {
                            that.lCount = 0;
                            $.fn.cookie(timestr, 0, expires_lotteryCount);
                            that.Lottery_tip.find("#lotteryCount").text(0);
                        }
                    }
                }, endFn: function (t) {//整个倒计时结束的回调
                    that.Lottery_tip.addClass("none"); //中奖的次数
                    that.not_start_tip.addClass("none"); //没有开始的提示
                    that.downCountNum.removeClass("none").text("本期抽奖已结束");
                }
            })
        }
        this.dowmCount();

        this.turntable = function () {

            var that = this;
            this.initTurntable = function (datas) {

                for (var i = 0, len = datas.length; i < len; i++) {
                    var item = {};
                    item.u = datas[i] && datas[i].pn;
                    item.n = datas[i] && datas[i].pn;
                    item.i = datas[i] && datas[i].pi;
                    item.id = datas[i] && datas[i].id;
                    this.lotteryData.push(item);
                    this.texts.push(item.n);
                    this.images.push(item.i);
                }
                this.image_size = image_size ? image_size : (45 * 360 / datas.length) / 51;
                this.$canvas.lottery({
                    colors: ['#FFE327', '#FFFF98', '#FBE69F'],
                    texts: this.texts,
                    images: this.images,
                    btn_needle: this.$btn_lottery,
                    canvas_size: 270,
                    font_size: this.font_size,
                    image_size: this.image_size,
                    outsideRadius: 230,
                    textRadius: 105,
                    imageRadius: 98,
                    callBackFn: function (index, o, isLottery, data, ganxie) {
                        if (isLottery) {
                            if (ganxie) {
                                that.nowinning(ganxie);
                                return;
                            }
                            that.winning(data);
                        } else {
                            that.nowinning();
                        }

                    },
                    clickFn: function (fn) {
                        var result = false;
                        if (that.lCount <= 0) {
                            H.dialog.showWin.open("您好，本期抽奖次数已用完！");
                            result = false;
                            if (fn)
                                fn(result);
                            return;
                        }
                        if (!$(".Lottery-success-fillout").hasClass("none")) {
                            H.dialog.showWin.open("请先领奖再进行抽奖！");
                            result = false;
                            if (fn)
                                fn(result);
                            return;
                        }
                        N.page.Lottery(); //回到抽奖页面
                        N.loadData({ url: domain_url + "api/lottery/luck?oi=" + openid + "&temp=" + new Date().getTime(), callbackLotteryLuckHandler: function (data) {
                            that.decrease(); //抽奖次数递减1;

                            if (data.result) {//中奖
                                that.data = data;
                                localStorage.setItem("lastData", JSON.stringify(data));
                                if (data.pt == 0) {//谢谢参与
                                    result = { prize_index: that.getAwardIndex(data.id), isLottery: true, data: data, ganxie: true };
                                    if (fn)
                                        fn(result);
                                    return;
                                }

                                result = { prize_index: that.getAwardIndex(data.id), isLottery: true, data: data };
                            } else {//未中奖
                                result = false;
                                N.page.Lottery_no();
                            }
                            if (fn)
                                fn(result);
                        }
                        });
                    }
                });
            };

            N.loadData({ url: domain_url + "api/lottery/prizes?at=1", callbackLotteryPrizesHandler: function (data) {

                if (data.result) {//成功
                    if (data.pa.length == 0) {
                        $(".Lottery-tip").addClass("none");
                        $(".not_start_tip").removeClass("none");
                        $(".lottery_btn_img").addClass("none");
                    } else {
                        that.initTurntable(data.pa);
                        $(".Lottery-tip").removeClass("none");
                        $(".not_start_tip").addClass("none");
                    }
                } else {
                    // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
                    $(".Lottery-tip").addClass("none");
                    $(".not_start_tip").removeClass("none");
                    $(".lottery_btn_img").addClass("none");
                }
            }, error: function () {
                $(".Lottery-tip").addClass("none");
                $(".not_start_tip").removeClass("none");
                $(".lottery_btn_img").addClass("none");
            }
            });
        }
        this.init = function () {
            this.initParam(); //初始化参数
            this.turntable(); //初始化转盘
            this.setlotteryCount();
        };
        this.init();

    });
    N.module("Lottery", function () {//新闻爆料
        this.initParam = function () {
            this.lsuccessBlack = $(".lsuccess-black"); //新闻线索
            this.LotteryBlack = $(".Lottery-black");
        }
        this.initEvent = function () {
            this.lsuccessBlack.click(function () {
                N.page.firstPage();
            });
            this.LotteryBlack.click(function () {
                N.page.firstPage();
            });
        };
        this.init = function () {
            this.initParam();
            this.initEvent();
        };
        this.init();
    });
});
