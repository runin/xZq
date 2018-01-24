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
                $(".footer").show();
                $(".bottom_tip").show();
                N.showPage("firstPage", function () {

                    if (fn) {
                        fn();
                    }
                })
            },
            starPage: function (fn) {
                window.location.hash = "starPage";

                $(".footer").hide();
                N.showPage("starPage", function () {
                    if (fn) {
                        fn();
                    }
                })
            }
        }

    };
    N.module("mainPage", function () {

        this.initParam = function () {
            this.nowPlay = $(".nowPlay"); //正在播放
            this.nextPlay = $(".nextPlay"); //将要播放
            this.a_issue = $(".a_issue"); //有奖互动的题目
            this.activity = $(".activity"); //问题页面
            this.activity_result = $(".activity_result"); //答案页面
            this.a_sub = $(".a_sub"); //提交按钮
            this.mainPage = $(".mainPage"); //
            this.body = $("body");
            this.content = $(".content");
            this.down_comment_img = $(".down_comment_img");
            this.s_item = $(".s_item")

        };
        this.initEvent = function () {

            var that = this;
            $("body").append('<audio preload="auto" loop="loop"  class="audio none" src="audio/audio.mp3"></audio>');



            that.win_scroll = function () {
                this.s_tag = true;
                $(window).scroll(function (e) {
                    if (document.body.scrollTop > 300) {
                        if (that.s_tag == true) {
                            $(window).scrollTop(99999);
                            that.s_tag = false;
                        }
                    }
                    if (document.body.scrollTop < 300) {
                        that.s_tag = true;
                    }
                });

            }
            that.win_scroll();


            this.down_comment_img.click(function () {
                that.showContent();
            })

            setTimeout(function () {
                that.nextPlay.addClass("play_a");
            }, 3000);

            this.showContent = function () {
                that.content.removeClass("none");
                that.content.addClass("show_up_comment");
                that.content.removeClass("show_down_comment");
                $(".c_main").height(400);
                $(".c_main").scrollTop(999999999999);
            }
            var ww = $(window).width();
            $(".swcon").height(ww / 290 * 185);

            this.envet = {
                a_subFn: function () {

                    if ($(".issue_select").length == 0) {
                        alert("请先选择项");
                        return;
                    }
                    var auid = "";
                    for (var i = 0; i < $(".issue_select").length; i++) {
                        auid += $($(".issue_select")[i]).attr("auid");
                        if (i < $(".issue_select").length - 1) {
                            auid += ",";
                        }
                    };
                    var that = this;
                    N.loadData({ url: domain_url + "api/question/answer", callbackQuestionAnswerHandler: function (data) {

                        //                        data.code = 0;
                        //                        data.rs = 2


                        if (data.code == 0) {
                            if (data.rs == 2 || data.rs == null) {//可以抽奖
                                that.win_cover = new that.showWin($.proxy(that.envet.lot_cover, that)())
                                that.win_cover.init(function () {
                                    function finditem(id, supc) {
                                        for (var j = 0; j < supc.length; j++) {
                                            if (supc[j].auid == id) {
                                                return supc[j];
                                                break;
                                            }
                                        }
                                    }
                                    that.activity.hide();
                                    that.activity_result.show();
                                    var totalw = parseInt($(".a_result_progess").width());

                                    function load_proc() {
                                        N.loadData({ url: domain_url + "api/question/support/" + that.quid + "&temp=" + new Date().getTime(), callbackQuestionSupportHandler: function (data) {
                                            if (data.code == 0) {

                                                that.activity_result.find(".a_result").empty();
                                                var supct = data.aitems;
                                                var item = that.aitems;


                                                var all_count = 0;
                                                for (var j = 0; j < data.aitems.length; j++) {
                                                    all_count += parseInt(data.aitems[j].supc);
                                                }


                                                for (var i = 0; i < item.length; i++) {
                                                    var rt = $('<div class="a_result_item"><div class="a_result_answer">A.房价</div><div class="a_result_progess"> &nbsp;</div><div class="progess_no">30%</div></div>');
                                                    rt.find(".a_result_answer").text(item[i].at);
                                                    var c = finditem(item[i].auid, supct).supc;
                                                    var prog = parseInt(c / all_count * 100).toFixed(0);
                                                    rt.find(".progess_no").text(prog + "%");
                                                    that.activity_result.find(".a_result").append(rt);
                                                    rt.find(".a_result_progess").width(totalw * parseInt(prog) / 100);


                                                }

                                            }
                                        }, data: { subjectUuid: that.quid }, showload: false
                                        });

                                    }
                                    load_proc();
                                    setInterval(function () {
                                        load_proc();
                                    }, 5000);


                                });
                            } else {
                                alert("抱歉暂不能抽奖");
                            }
                        } else if (data.code == 1) {
                            alert("答题失败");
                        }
                        else if (data.code == 2) {
                            alert("答题已经结束");
                        }
                        else if (data.code == 3) {
                            alert("答题还没有开始");
                        }
                        else if (data.code == 4) {
                            alert("您已经答过了");
                        } else {
                        }
                    }, error: function () {
                        alert("抱歉抽奖失败");

                    }, data: { yoi: openid, suid: this.quid, auid: auid }
                    });
                },
                lot_cover: function () {
                    var that = this;
                    var p = {
                        html: '<div class="beforea_div"><img class="cover_tip" src="images/cover_tip.png" class="hook" /><img src="images/hook.png" class="hook" /></div>', //内部html
                        beforeOpenFn: null, //打开之前
                        afterOpenFn: function (win) {
                            var img = win.find(".hook");


                            $(".beforea_div").unbind("touchstart").bind("touchstart", function (event) {
                                var touch = event.targetTouches[0];
                                that.cx = touch.clientX;
                                that.cy = touch.clientY;
                                that.offset = $(that.thatTemp).offset();
                                that.x = that.cx - that.thatTemp.offsetLeft;
                                that.y = that.cy - that.thatTemp.offsetTop;
                                that.thatTemp.style.left = that.touchTemp.clientX - (that.x || 0) + 'px';
                                that.thatTemp.style.top = that.touchTemp.clientY - (that.y || 0) + 'px';
                            });
                            img.bind("touchstart", function (e) {
                                that.thatTemp = this;
                                that.touchTemp = event.targetTouches[0];

                            });
                            img.bind("touchmove", function (event) {
                                event.preventDefault();
                                $(".audio")[0].play();
                                if (event.targetTouches.length == 1) {
                                    var touch = event.targetTouches[0];  // 把元素放在手指所在的位置

                                    this.style.left = touch.clientX - (that.x || 0) + 'px';
                                    if (parseInt(this.style.left) < 0) {
                                        this.style.left = "0px";
                                    }
                                    var dw = $(".beforea_div").width() - img.width();
                                    if (parseInt(this.style.left) > dw) {
                                        this.style.left = dw + "px";
                                    }
                                    this.style.top = touch.clientY - (that.y || 0) + 'px';

                                    if (parseInt(this.style.top) < 0) {
                                        this.style.top = "0px";
                                    }

                                    var dh = $(".beforea_div").height() - img.height();
                                    if (parseInt(this.style.top) > dh) {
                                        this.style.top = $(".beforea_div").height() - img.height() + "px";
                                    }
                                }
                            });
                            img.bind("touchend", function (event) {
                                $(".audio")[0].pause();
                                $(".beforea_div").unbind("touchstart");
                                var rtr = new Date().getTime();
                                N.loadData({ url: domain_url + "api/lottery/exec/luck", callbackLotteryLuckHandler: function (data) {

                                    if (data.result) {
                                        that.win = new that.showWin($.proxy(that.envet.lot_success, that)(data)).init();
                                    } else {//不中奖
                                        var lot_no_win = new that.showWin(that.envet.lot_no());
                                        lot_no_win.init();
                                        lot_no_win.closeFn = function () {
                                            that.win_cover.close();
                                        }
                                    }
                                }, data: { matk: matk, sn: "1" }
                                });
                            });
                        }
                    }
                    return p;
                },
                lot_success: function (data) {

                    var that = this;
                    var arr = [];
                    arr.push('<div class="w_tip" style="margin-top:15px;"> 太棒了！恭喜你获得' + data.pn + "一" + data.pu + '！</div><img src="' + data.pi + '" class="a_img" /> <h2>');
                    arr.push('请填写您的联系方式以便顺利领奖</h2><input class="w_name"  placeholder="姓名" />');
                    arr.push('<input class="w_ph"  placeholder="手机号码 " /><input  class="w_addr" placeholder="收件地址" /><input  class="w_postcode" placeholder="邮编" />');
                    arr.push('<a href="javascript:void(0)" class="s_submit">提交</a>');
                    var p = {
                        html: arr.join(''), //内部html
                        afterOpenFn: function (win, thatT) {

                            win.find(".s_submit").unbind("click").click(function () {
                                var rn = win.find(".w_name").val();
                                var ad = win.find(".w_addr").val();
                                var ph = win.find(".w_ph").val();
                                var pc = win.find(".w_postcode").val();
                                if (!rn) {
                                    alert("请填写名称");
                                    return;
                                }
                                if (!ad) {
                                    alert("请填写地址");
                                    return;
                                }
                                if (!ph) {
                                    alert("请填写电话");
                                    return;
                                }
                                N.loadData({ url: domain_url + "api/lottery/award", callbackLotteryAwardHandler: function (data) {
                                    if (data.result) {
                                        thatT.closeFn = function () {

                                            that.win_cover.close();
                                        }
                                        thatT.close();
                                        alert("领取成功");
                                    } else {
                                        alert("抱歉领取失败，请检查网络");
                                    }
                                }, data: { oi: openid, rn: rn, ad: ad + "(邮编：" + pc + ")", ph: ph }

                                });
                            });
                        }
                    };
                    return p;
                },
                lot_no: function () {
                    var p = {
                        html: '<div class="w_tip2">谢谢参与，祝您下次好运</div><img src="images/noa_img.png" class="noa_img" /><a href="javascript:void(0)" class="s_submit">确定</a><a href="https://mp.weixin.qq.com/s?__biz=MzA3MjkyMDU2MQ==&mid=209888758&idx=1&sn=e84428ad5f2582ddde42ec027df908fc#rd" data-collect="true" data-collect-flag="tttj" class="tttj none" data-collect-desc="天天淘金">更多奖品</a>', //内部html
                        afterOpenFn: function (win, that) {
                            win.find(".s_submit").unbind("click").click(function () {
                                that.close();
                            });
                        }
                    };
                    return p;
                }
            };
            this.a_sub.unbind("click").click($.proxy(this.envet.a_subFn, this)); //提交点击事件

            this.s_item.unbind("click").click(function () {
                window.location.href = "./show.html";

            });


            //天天淘金
            N.loadData({ url: domain_url + "api/common/promotion", commonApiPromotionHandler: function (data) {
                var t = $(".tttj");
                if (data.code == 0) {
                    t.removeClass("none");
                    t.attr("href", data.url);
                    t.click(function () {
                        window.location.href = data.url;
                    })
                    t.html(data.desc);
                } else {
                    t.addClass("none");
                }

            }, data: { oi: openid }
            });
        }
        this.initPlugins = function () {
            this.showWin = function (obj) {
                var p = $.extend({
                    html: "", //内部html
                    beforeOpenFn: null, //打开之前
                    afterOpenFn: null//打开之后执行的函数

                }, obj || {});
                this.winObj = $('<div class="win"><div class="win_model"></div><div class="win_contain"><img src="images/close.png" class="win_close" />   <div class="win_html"></div></div></div>"');
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
                var that = this;
                this.winObj.find(".win_close").unbind("click").click(function () {
                    that.close();
                });
                this.init = function (fn) {
                    this.setHtml();
                    if (p.beforeOpenFn) {
                        p.beforeOpenFn(this.winObj);
                    }
                    $("body").append(this.winObj);
                    this.winObj.find(".win_contain").addClass("show_slow");
                    if (p.afterOpenFn) {
                        p.afterOpenFn(this.winObj, this);
                    }
                    if (fn) {
                        fn();
                    }
                }
            };
            (function () { //扩展zepto
                var _getScript = function (url, callback) {
                    var head = document.getElementsByTagName('head')[0],
                js = document.createElement('script');
                    js.setAttribute('type', 'text/javascript');
                    js.setAttribute('src', url);
                    head.appendChild(js);
                    //执行回调
                    var callbackFn = function () {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    };
                    if (document.all) { //IE
                        js.onreadystatechange = function () {
                            if (js.readyState == 'loaded' || js.readyState == 'complete') {
                                callbackFn();
                            }
                        }
                    } else {
                        js.onload = function () {
                            callbackFn();
                        }
                    }
                }
                //如果使用的是zepto，就添加扩展函数
                if (Zepto) {
                    $.getScript = _getScript;
                }
            })();
            ; $(function () { //手机图片轮播

                window.Carousel = function (o) {

                    if (!o || !o.contain) { return; }
                    this.contain = ""; //容器对象
                    this.contain = ""; //总容器
                    this.sContainer = ""; //swiper容器
                    this.swiper = null; //swiper对象
                    this.slist = []; //滑动图片list swiper的每项
                    this.url = domain_url + "api/ad/get?areaNo=ad_homepage_index"; //加载图片的url
                    this.init(o);
                }
                Carousel.prototype.init = function (o) {

                    this.initParam(o);
                    this.initSwiperCon();
                    this.loadImg();
                }
                Carousel.prototype.initParam = function (o) {//初始化容器
                    var cn = $("." + o.contain);
                    if (cn.length == 0) {
                        $("body").append("<div class='" + o.contain + "' ></div>");
                        this.contain = $("." + o.contain);
                    } else {
                        this.contain = cn;
                    }
                }
                Carousel.prototype.initSwiperCon = function () {
                    this.sContainer = $('<div class="swiper-container scontainer2"><div class="swiper-wrapper"></div></div>');
                    this.contain.append(this.sContainer);

                }
                Carousel.prototype.loadImg = function () {
                    var that = this;
                    N.loadData({ url: this.url, callbackAdGetHandler: function (data) {
                        if (data.code == 0) {
                            that.st = data.st;

                            that.ads = data.ads
                            for (var i = 0; i < data.ads.length; i++) {
                                var imgDiv = $('<div class="swiper-slide"></div>');

                                imgDiv.append("<div style='width:100%;height:100%;background:url(" + data.ads[i].p + ") no-repeat center center; background-size: cover;'></div>");
                                that.sContainer.find(".swiper-wrapper").append(imgDiv);

                                that.slist.push(imgDiv);
                            }
                            that.initSwiper();
                        }
                    }
                    });

                }
                Carousel.prototype.initSwiper = function () {
                    var that = this;
                    this.swiperParam = {
                        direction: 'horizontal',
                        loop: true,
                        pagination: '.item_point_sub',
                        paginationClickable: true,
                        autoplay: that.st * 1000,
                        onInit: function (s) {
                        },
                        onClick: function (swiper) {
                            window.location.href = "./show.html"
                        },
                        onSlideChangeEnd: function (s) {

                            var index = $(".swiper-pagination-bullet-active").index();
                            if (index < 0) {
                                index = 0;
                            }
                            that.contain.find('.program').text(that.ads[index].t);
                            that.contain.find('.program_time1').html(that.ads[index].c);



                        }
                    };
                    this.swiper = new Swiper('.scontainer2', this.swiperParam);
                }
                //new Carousel({ contain: "containSwiper" }); //初始化


            });
            ; (function () {
                $.fn.drag = function (obj) {

                    var p = $.extend({
                        dowmCallBack: null, //鼠标点下后的回调，方便操作
                        timeDrag: 1, //拖动跟尾延迟时间
                        parentContainDrag: null//对于窗口类型的拖动，应该只有标题表示可以拖动，但实际是整个容器的拖动
                    }, obj || {});
                    var that = this;
                    if (p.parentContainDrag) {
                        that = p.parentContainDrag;
                    }
                    $(this).mousedown(function (e) {
                        $(this).css("cursor", "move");
                        var offset = $(that).offset();
                        var x = e.pageX - offset.left;
                        var y = e.pageY - offset.top;
                        $(document).bind("mousemove.drag", function (ev) {
                            $(that).stop(); //加上这个之后  
                            var _x = ev.pageX - x; //获得X轴方向移动的值  
                            var _y = ev.pageY - y; //获得Y轴方向移动的值  
                            if (_x < 0) _x = 0;
                            if (_y < 0) _y = 0;
                            if (_x > $(window).width() - $(that).width()) _x = $(window).width() - $(that).width();
                            if (_y > $(window).height() - $(that).height()) _y = $(window).height() - $(that).height();
                            $(that).animate({ left: _x + "px", top: _y + "px" }, p.timeDrag);
                        });
                        if (p.dowmCallBack) {
                            p.dowmCallBack(that);
                        }
                        return;
                    });
                    $(document).mouseup(function () {
                        $(this).css("cursor", "default");
                        $(this).unbind("mousemove.drag");
                        if (p.upCallBack) {
                            p.upCallBack(that);
                        }
                    });
                    return this;
                };
            })();

        }
        this.initMainSwiper = function () {
            this.swiperMParam = {
                direction: 'vertical',
                onInit: function (s) {
                }

            };
            this.swiperM = new Swiper('.scontainer1', this.swiperMParam);

        }
        this.initSwiper = function () {

            //this.initMainSwiper();

            this.swiper = new Carousel({ contain: "swcon" });

        }

        this.initPreplay = function () {
            var that = this;
            var d = new Date();
            var y = d.getFullYear();
            var m = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : "0" + (d.getMonth() + 1);
            var da = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();
            var pjson_path = "https://cdn.holdfun.cn/resources/programlist/" + stationUuid + "/" + channelUuid + "/programlist-" + y + "-" + m + "-" + da + ".js?temp=" + new Date().getTime();

            $.getScript(
                 pjson_path, function () {
                     var a = l;
                     that.setNowAndNext(l);
                 });
            this.setNowAndNext = function (l) {
                if (l) {
                    setText(l);
                    setInterval(function () {
                        setText(l);
                    }, 5000);
                }
                function setText(l) {
                    var p = l.p;
                    var date = new Date();
                    var time = date.getTime();
                    var dtemp = y + "-" + m + "-" + da;
                    var nextPlayD = 0;
                    var isshow = false;
                    for (var i = 0, len = p.length; i < len; i++) {
                        var btime = timestamp(dtemp + " " + p[i].b);
                        var etime = btime + parseInt(p[i].d * 1000);

                        if (btime < time && time < etime) {
                            that.nowPlay.find(".s_item_m").html("正在播出《" + p[i].n + "》");
                            try {
                                if (p[i + 1]) {
                                    that.nextPlay.find(".s_item_m").html("即将播出《" + p[i + 1].n + "》");
                                } else {
                                    that.nextPlay.hide();
                                }
                            } catch (e) {
                                that.nextPlay.hide();
                            }

                            isshow = true;
                            break;
                        }
                    }
                    if (!isshow) {
                        that.nowPlay.hide();
                        that.nextPlay.hide();
                    }
                }
            }
        }
        this.lottery = function () {
            var that = this;
            this.activity.removeClass("none");
            this.activity_result.addClass("none");
            N.loadData({ url: domain_url + "api/question/info", callbackQuestionInfoHandler: function (data) {

                if (data.code == 0 && !data.qitems[0].anws) {
                    if (window.showq_interval) {
                        clearInterval(window.showq_interval);
                    }

                    var time = new Date().getTime();
                    for (var i = 0; i < data.qitems.length; i++) {
                        if (timestamp(data.qitems[i].qst) < time && time < timestamp(data.qitems[i].qet)) {
                            that.ShowIssue(that, data, i);
                            break;
                        }
                    }

                } else {

                    that.aitems = data.qitems[0].aitems;
                    $(".a_issue").text(data.qitems[0].qt);
                    function finditem(id, supc) {
                        for (var j = 0; j < supc.length; j++) {
                            if (supc[j].auid == id) {
                                return supc[j];
                                break;
                            }
                        }
                    }
                    $(".activity").hide();
                    $(".activity_result").show();

                    var totalw = parseInt($(".a_result_progess").width());

                    function load_pro() {

                        N.loadData({ url: domain_url + "api/question/support/" + data.qitems[0].quid + "&temp=" + new Date().getTime(), callbackQuestionSupportHandler: function (data1) {
                            var dataTemp = data1;

                            if (dataTemp.code == 0) {

                                that.activity_result.find(".a_result").empty();
                                var supct = dataTemp.aitems;
                                var item = that.aitems;

                                var all_count = 0;
                                for (var j = 0; j < dataTemp.aitems.length; j++) {
                                    all_count += parseInt(dataTemp.aitems[j].supc);
                                }

                                for (var i = 0; i < item.length; i++) {
                                    var rt = $('<div class="a_result_item"><div class="a_result_answer">A.房价</div><div class="a_result_progess"> &nbsp;</div><div class="progess_no">30%</div></div>');
                                    rt.find(".a_result_answer").text(item[i].at);
                                    var c = finditem(item[i].auid, supct).supc;
                                    var prog = parseInt(c / all_count * 100).toFixed(0);
                                    rt.find(".progess_no").text(prog + "%");
                                    that.activity_result.find(".a_result").append(rt);
                                    rt.find(".a_result_progess").width(totalw * parseInt(prog) / 100);


                                }

                            }
                        }, data: { subjectUuid: data.qitems[0].quid }, showload: false
                        });


                    }
                    load_pro();
                    setInterval(function () {
                        load_pro();
                    }, 5000);

                }
            }, data: { yoi: openid }
            });
            this.ShowIssue = function (that, data, i) {
                that.quid = data.qitems[i].quid;
                that.qt = data.qitems[i].qt;
                that.ty = data.qitems[i].ty;

                that.aitems = data.qitems[i].aitems;
                that.setQitems(that.qt);
                that.setAitems(that.aitems);
            };
            this.setQitems = function (qt) {
                this.a_issue.text(qt);
            };
            this.setAitems = function (aitems) {
                this.anwList = [];
                this.activity.find(".issue_items").empty();
                for (var i = 0, len = aitems.length; i < len; i++) {
                    this.anwList.push('<div auid=' + aitems[i].auid + ' class="issue_item">' + aitems[i].at + '</div>');
                }
                this.activity.find(".issue_items").append(this.anwList.join(''));
                this.initIssueEvent();
            };
            this.initIssueEvent = function () {
                var that = this;
                this.activity.find(".issue_item").unbind("toggle").click(function () {
                    if (that.ty == 1) {
                        $(".issue_item").removeClass("issue_select");
                    }
                    if (!$(this).hasClass("issue_select")) {
                        $(this).addClass("issue_select");
                    } else {
                        $(this).removeClass("issue_select");
                    }

                });

            }
        }
        this.init = function () {
            this.initParam();
            this.initEvent();
            this.initPlugins(); //初始化弹窗插件
            this.initSwiper(); //初始化头部广位置
            this.initPreplay(); //初始化预播放
            this.lottery(); //抽奖

        }
        this.init();
    });

    N.module("comment", function () {
        this.initParam = function () {
            this.sendBtn = $(".sendBtn"); //发送按钮
            this.send_input = $(".send_input"); //评论输入框
            this.user_head = $(".user_head"); //头像
            this.c_foor_point = $(".c_foor_point"); //头像上面的点
            this.c_main = $(".c_main"); //评论容器
            this.up_comment_img = $(".up_comment_img");

            this.arr_sendHtml = [];
            this.arr_sendHtml.push('<div class="c_item"><input class="uuid" type="hidden" /><div class="c_item_head_r"><img class="headimgurl" src="./images/avatar.jpg" alt=""></div>');
            this.arr_sendHtml.push('<div class="c_item_main_r"><div class="c_item_name_r nickname">匿名</div>');
            this.arr_sendHtml.push('<div class="c_item_con_r"><img src="images/arrow_said_right.png" class="arrow_said_right">');
            this.arr_sendHtml.push('<div class="c_item_comment"></div></div></div></div>');


            this.arr_otherHtml = [];
            this.arr_otherHtml.push('<div class="c_item"><input class="uuid" type="hidden" /><div class="c_item_head"><img class="headimgurl"  src="./images/avatar.jpg" alt=""> </div>');
            this.arr_otherHtml.push('<div class="c_item_main"><div class="c_item_name nickname">匿名</div>');
            this.arr_otherHtml.push('<div class="c_item_con"><img src="images/arrow_said_left.png" class="arrow_said_left">');
            this.arr_otherHtml.push('<div class="c_item_comment"></div></div></div></div>');

            $(".c_main").height(400);



        }
        this.initEvent = function () {

            var that = this;
            this.upPageIndex = 2;


            this.up_comment_img.click(function () {
                $(window).scrollTop(0);
            })
            $(".c_right span").click(function () {
                $(window).scrollTop(0);
            });
            this.showMain = function () {
                $(".content").removeClass("show_up_comment");
                $(".content").addClass("show_down_comment");


            }

            var append_other = function (data, pendType, down) {
                for (var i = 0; i < data.items.length; i++) {
                    var send_o = $(that.arr_otherHtml.join(''));
                    if (data.items[i].im) {
                        send_o.find(".headimgurl").attr("src", data.items[i].im + "/64");
                    }
                    if (data.items[i].na) {
                        send_o.find(".nickname").text(data.items[i].na);
                    }
                    if (data.items[i].co) {
                        send_o.find(".c_item_comment").text(data.items[i].co);
                    }

                    if (data.items[i].uid) {
                        send_o.find(".uuid").val(data.items[i].uid);
                    }

                    if (!pendType || pendType == "append") {
                        that.c_main.append(send_o);
                    } else {
                        that.c_main.prepend(send_o);
                    }
                }
                if (!pendType || pendType == "append" || down) {
                    that.c_main.scrollTop(999999999999);
                } else {
                    that.c_main.scrollTop(100);
                }
            }

            { //先加载
                this.load_comment_down = function () {
                    N.loadData({ url: domain_url + "api/comments/list", callbackCommentsList: function (data) {
                        if (data.code == 0) {

                            append_other(data, "prepend", true);
                            that.c_main.scrollTop(999999999999);
                        }
                    }, data: { page: 1, ps: 10, op: openid, zd: 0, kind: 0 }
                    });
                };
                this.load_comment_down();

            }
            {//当向上拉的时候
                that.c_main.scroll(function () {
                    if (this.scrollTop == 0) {
                        that.load_comment_up();
                        $(window).unbind('scroll');
                    }
                });
                this.load_comment_up = function () {
                    N.loadData({ url: domain_url + "api/comments/list", callbackCommentsList: function (data) {
                        if (data.code == 0) {
                            append_other(data, "prepend");
                            that.upPageIndex++;
                        }
                    }, data: { page: that.upPageIndex, ps: 10, op: openid, zd: 0, kind: 0 }
                    });
                };
            }

            {//动态更新最前10条 


                this.load_comment_dynamic = function () {

                    N.loadData({ url: domain_url + "api/comments/list", callbackCommentsList: function (data) {
                        if (data.code == 0) {
                            var c_items = $(".c_item");
                            var al = c_items.length;
                            if (al == 0) {
                                return;
                            }
                            var i_index = al - 10;
                            if (i_index < 0) {
                                that.c_main.empty();
                                for (var j = data.items.length - 1; j >= 0; j--) {
                                    var send_o = $(that.arr_otherHtml.join(''));
                                    if (isInUuids(data.items[j].uid)) {
                                        send_o = $(that.arr_sendHtml.join(''));
                                    }
                                    if (data.items[j].im) {
                                        send_o.find(".headimgurl").attr("src", data.items[j].im + "/64");
                                    }
                                    if (data.items[j].na) {
                                        send_o.find(".nickname").text(data.items[j].na);
                                    }
                                    if (data.items[j].co) {
                                        send_o.find(".c_item_comment").text(data.items[j].co);
                                    }
                                    if (data.items[j].uid) {
                                        send_o.find(".uuid").val(data.items[j].uid);
                                    }
                                    that.c_main.append(send_o);
                                }
                            } else {
                                if (that.uuids && !inUuidArr(data.items)) {
                                    return;
                                }
                                for (var i = i_index, j = data.items.length - 1; i < al, j >= 0; i++, j--) {
                                    var send_o = $(that.arr_otherHtml.join(''));
                                    if (isInUuids(data.items[j].uid)) {
                                        send_o = $(that.arr_sendHtml.join(''));
                                    }
                                    if (data.items[j].im) {
                                        send_o.find(".headimgurl").attr("src", data.items[j].im + "/64");
                                    }
                                    if (data.items[j].na) {
                                        send_o.find(".nickname").text(data.items[j].na);
                                    }
                                    if (data.items[j].co) {
                                        send_o.find(".c_item_comment").text(data.items[j].co);
                                    }
                                    if (data.items[j].uid) {
                                        send_o.find(".uuid").val(data.items[j].uid);
                                    }

                                    c_items[i].innerHTML = send_o.html();
                                }
                            }
                        }
                    }, data: { page: 1, ps: 10, op: openid, zd: 0, kind: 0 }, showload: false
                    });
                };

                setInterval(function () {
                    that.load_comment_dynamic();
                }, 5000);
                function isInUuids(uuid) {

                    var tag = false;
                    if (!that.uuids) {
                        return false;
                    }
                    for (var i = 0; i < that.uuids.length; i++) {
                        if (that.uuids[i] == uuid) {
                            tag = true;
                            break;
                        }
                    }
                    return tag;
                }
                function inUuidArr(items) {
                    var tag = true;
                    var arr = [];
                    for (var i = 0; i < items.length; i++) {
                        arr.push(items[i].uid);
                    }
                    for (var j = 0; j < that.uuids.length; j++) {
                        if (arr.indexOf(that.uuids[j]) == -1) {
                            tag = false;
                            break;
                        }

                    }
                    return tag;
                }

            }

            this.eventObj = {
                sendBtnFn: function () {
                    if (this.send_input.val().trim() == "") {
                        alert("请填写评论");
                        return;
                    }
                    var that = this;




                    N.loadData({ url: domain_url + "api/comments/save", callbackCommentsSave: function (data) {
                        if (data.code == 0) {
                            var uuid = data.uid;
                            if (!that.uuids) {
                                that.uuids = [];
                            }

                            that.uuids.push(uuid);
                            var send_s = $(that.arr_sendHtml.join(''));

                            if (headimgurl) {
                                send_s.find(".headimgurl").attr("src", headimgurl + "/64");
                            }

                            if (nickname) {
                                send_s.find(".nickname").text(nickname);
                            }
                            if (uuid) {
                                send_s.find(".uuid").val(uuid);
                            }
                            send_s.find(".c_item_comment").text(that.send_input.val());
                            that.c_main.append(send_s);
                            that.c_main[0].scrollTop = 9999999;
                            that.send_input.val("");
                        } else {
                            if (data.message) {
                                alert(data.message);
                                that.send_input.val("");
                            } else {
                                alert("发表评论失败");
                            }
                        }
                    }, data: {
                        co: encodeURIComponent(that.send_input.val()),
                        op: openid,
                        ty: 2,
                        nickname: nickname ? encodeURIComponent(nickname) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    }
                    });
                }
            }

            this.sendBtn.unbind("click").click($.proxy(this.eventObj.sendBtnFn, this));
            window.hInter = setInterval(function () {
                if (headimgurl) {
                    $(".user_head").attr("src", headimgurl + "/64");
                    if (window.hInter) {
                        clearInterval(window.hInter)
                    }
                }

            }, 500);


        }
        this.init = function () {
            this.initParam();
            this.initEvent();
        }
        this.init();
    });

});