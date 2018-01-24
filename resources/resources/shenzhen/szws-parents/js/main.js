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
        this.initParam = function () {
            this.scoreicon = $(".scoreicon"); //查看积分
            this.may_score = $(".may_score"); //我的积分
            this.may_rank = $(".may_rank"); //我的排名
            this.ranks = $(".ranks"); //排名容器
            this.comments = $(".comments"); //评论容器
            var img = new Image();
            img.src = "images/topicon.jpg";
            var that = this;
            img.onload = function () {
                that.comments.height($(window).height() - $(".top").height() - $(".c_sendDiv").height() + 4);
            };

            this.send = $("#send"); //发送
            this.c_input = $(".c_input"); //发送文本框
            this.lineNum = $(".lineNum"); //在线人数
            this.question = $("#question"); //问题容器
            window.STARTING_CLS = 'starting';
            window.STARTED_CLS = 'started';
            window.ENDED_CLS = 'ended';
            window.REQUEST_CLS = 'requesting';
            window.REPEAT_CLS = 'repeat';
            window.TIMETRUE_CLS = true;
            window.LIMITTIMEFALSE_CLS = false;
            this.answered = $('#answered');
            this.timebox = $('#time-box');
            this.currTime = new Date().getTime();
        };
        this.showTip = function (pn, m) {
            var s = $("<div></div>");
            s.addClass("showTip").addClass("fadein");
            s.text(m);
            if (pn) {
                pn.append(s);
                (function (s) {
                    setTimeout(function () {
                        s.remove();
                    }, 2000);
                })(s)
            }
        }
        this.initEvent = function () {
            var that = this;
            {
                var rank_arr = [];
                rank_arr.push('<div class="rankItem">');
                rank_arr.push('<i class="user_head"></i><span class="user_name"></span><span class="rank_num"></span>');
                rank_arr.push('</div>');
                this.rank_item = rank_arr.join("");
            }
            {
                var rank_con = [];
                rank_con.push('<div class="rankdiv">');
                rank_con.push(' <img src="images/close.png" class="rank_close" />');
                rank_con.push(' <img src="images/wbg.png" class="wbg" alt="" />');
                rank_con.push('<div class="r_content">');
                rank_con.push('<h2></h2><img src="images/line.png" alt="" class="rank_line" />');
                rank_con.push('<div class="may_rankdiv">');
                rank_con.push('我的积分:<span class="may_score">无</span> 我的排名:<span class="may_rank">无</span>');
                rank_con.push('</div>');
                rank_con.push('<div class="rank_tip">');
                rank_con.push('剧终积分前十名有大奖，具体参见活动规则');
                rank_con.push('</div>');
                rank_con.push('<div class="ranks">');
                rank_con.push('</div>');
                rank_con.push('</div>');
                rank_con.push('</div>');
                this.rank_con = rank_con;
            }
            this.scoreicon.click($.proxy(function () {
                var win = new N.showWin({
                    html: that.rank_con.join(""),
                    beforeOpenFn: function (w) {
                        w.find(".win_contain").css({ "height": "100%", "width": "100%", "background-color": "Transparent" });
                        var h = $(window).width() * 0.85 / 272 * 372;
                        w.find(".rankdiv").height(h);
                    },
                    afterOpenFn: function (w, t) {
                        w.cartoon({ duration: 1, content: function () {
                            var arr = [];
                            arr.push("0% { opacity:0; }");
                            arr.push("100% { opacity:1;}");
                            return arr.join("");
                        }, complete: function (t1) {
                            t1.find(".rank_close").click(function () {
                                t.close();
                            });
                        }
                        });
                        //加载自己的排名
                        debugger;
                        N.loadData({ url: domain_url + "api/lottery/integral/rank/self", callbackIntegralRankSelfRoundHandler: function (data) {

                            w.find(".may_score").text(data["in"] || 0);
                            w.find(".may_rank").text(data.rk || '暂无排名');
                        }, data: { oi: openid }, showload: false
                        });
                        //加载前十名称
                        N.loadData({ url: domain_url + "api/lottery/integral/rank/top10", callbackIntegralRankTop10RoundHandler: function (data) {

                            if (data.result) {
                                that.appendRankData(data.top10);
                            }
                        }, showload: false
                        });
                    }
                });
                win.init();
            }, this));
            this.send.click($.proxy(function () {
                var sendText = encodeURIComponent(this.c_input.val());
                N.loadData({ url: domain_url + "api/comments/save", callbackCommentsSave: function (data) {
                    if (data.code == 0) {
                        var mode = $("<div class='c_head_img'></div>");
                        if (headimgurl) {
                            mode.css({ "background": "url('" + headimgurl + "/64') no-repeat center center;", "background-size": "cover;" });
                        }
                        barrage.appendMsg(mode.get(0).outerHTML + that.c_input.val());
                        that.c_input.val("");
                        that.showTip($("#comments"), "发送成功");
                    } else {
                        if (data.message) {

                            alert(data.message);
                            that.c_input.val("");
                        } else {
                            alert("发表评论失败");
                        }
                    }
                }, data: {
                    co: sendText,
                    op: openid,
                    ty: 2,
                    nickname: nickname ? encodeURIComponent(nickname) : "",
                    headimgurl: headimgurl ? headimgurl : ""
                }
                });

            }, this));

            this.answeredfn = function (data) {
                this.question = $(".question");
                var $getQuestion = function (quid) {
                    return $('#question-' + quid);
                }
                this.question.addClass('none');
                this.answered.removeClass('none').addClass(data.rs === 1 ? '' : 'error');
                if (data.rs === 1) {//答对了
                    TIMETRUE_CLS = true;
                    $('#answer-tip').addClass('none');
                    that.openlottery();
                } else {//答错了
                    $('#answer-tip').removeClass('none');
                    if (LIMITTIMEFALSE_CLS) {
                        TIMETRUE_CLS = true;
                        LIMITTIMEFALSE_CLS = true;
                    } else {

                        $('header').css('overflow', 'visible');
                        showLoading($('header'));
                        setTimeout(function () {
                            hideLoading($('header'));
                            $('header').css('overflow', 'hidden');
                            TIMETRUE_CLS = true;
                            LIMITTIMEFALSE_CLS = true;
                        }, answer_delaytimer);
                    }
                }
                $('.q-item').removeClass(REPEAT_CLS);
                var $question = $getQuestion(data.quid);
                if ($question) {
                    $question.attr('data-qcode', data.rs);
                }
            };
            this.question.delegate('.q-item', 'click', function (e) {
                e.preventDefault();
                if ($(this).hasClass(REPEAT_CLS)) {
                    return;
                };
                N.loadData({ url: domain_url + "yiguan/answer", callbackYiguanAnswer: function (data) {
                    if (data.code == 0) {
                        that.answeredfn(data);
                        return;
                    } else {
                        alert(data.message);
                    }
                }, data: {
                    yoi: openid,
                    auid: $(this).attr('data-auid')
                }
                });
                TIMETRUE_CLS = false;
                $(this).addClass(REPEAT_CLS);
            });
            this.answered.delegate('h4', 'click', function (e) {
                e.preventDefault();
                var reserveId = $(this).attr('data-reserveid');
                if (!reserveId) {
                    return;
                }
                shaketv.reserve(yao_tv_id, reserveId, function (data) {

                });
            });
        };

        this.openlottery = function () {//打开抽奖
            var that = this;
            var winningArr = [];
            winningArr.push("<div class='winningWin'> <img src='./images/kongback.png' /><img src='./images/close.png' class='winningWin_close' />");
            winningArr.push("<div class='win_contain'> <div class='winning_tip'><span class='winning_msg'>恭喜你,获得大礼包一份<span></div><div class='winning_img'></div>");
            winningArr.push("<div class='winning_form'>");
            winningArr.push("<h2>请填写您的联系方式以便顺利领奖</h2>");
            winningArr.push("<input class='username' placeholder='姓名' />");
            winningArr.push("<input class='userphone'  placeholder='手机号码'  />");
            winningArr.push("<input class='useraddress'  placeholder='地址'  />");
            winningArr.push("<a href='#' class='winning_sureBtn'>确认</a>");
            winningArr.push("</div>");
            winningArr.push("<dl class='sure_after none'><dt>以下是您的联系方式<dt><dd>姓名：<span  class='username_a'>hejiawei</span></dd><dd>电话：<span class='userphone_a'>1357222545</span></dd><dd>地址：<span  class='useraddress_a'></span></dd><dd><a href='#' class='sureBtn_after' data-collect='true' data-collect-flag='sureBtn_after' data-collect-desc='提交确认'>确认</a></dd></dl>");
            winningArr.push("</div></div>");
            var winningWin = null; //中奖
            var nowinningWin = null; //不中奖
            var openLotWin = new N.showWin({//开始弹开抽奖按钮
                html: '<div class="open_winLot"><img src="./images/open.png" class="lotimg" /><a href="#" class="open_look"></a></div>',
                beforeOpenFn: function (w) {
                    w.find(".win_contain").css({ "height": "100%", "width": "100%", "background-color": "Transparent" });
                    var h = $(window).width() * 0.85 / 280 * 402;
                    w.find(".open_winLot").height(h);

                },
                afterOpenFn: function (w) {
                    w.find(".open_look").click(function () {
                        N.loadData({ url: domain_url + 'api/lottery/luck', callbackLotteryLuckHandler: function (data) { //开始抽奖



                            //                            data.result = true;


                            if (data.result) {//中奖
                                openLotWin.close();
                                winningWin = new N.showWin({
                                    html: winningArr.join(""),
                                    beforeOpenFn: function (w) {
                                        w.find(".win_contain").css({ "height": "100%", "width": "100%", "background-color": "Transparent" });
                                        var h = $(window).width() * 0.85 / 352 * 557;
                                        w.find(".winningWin").height(h);
                                    },
                                    afterOpenFn: function (w) {
                                        var wf = w.find(".winning_form");
                                        var username = wf.find(".username");
                                        var userphone = wf.find(".userphone");
                                        var useraddress = wf.find(".useraddress");
                                        var username_a = w.find(".username_a");
                                        var userphone_a = w.find(".userphone_a");
                                        var useraddress_a = w.find(".useraddress_a");
                                        if (data.pt === 1) { //实物奖品
                                            if (data.tt) {
                                                w.find('.winning_msg').html(data.tt);
                                            }
                                            w.find('.winning_img').css({ "background": "url('" + (data.pi || "../images/jifen.png") + "') no-repeat center center;", "background-size": "cover;" });
                                            username.val(data.rn || '');
                                            userphone.val(data.ph || '');
                                            useraddress.val(data.ad || '');

                                        } else if (data.pt === 2) { //积分
                                            if (data.tt) {
                                                w.find('.winning_msg').html(data.tt);
                                            }

                                            w.find('.winning_img').css({ "background": "url('" + (data.pi || "../images/jifen.png") + "') no-repeat center center;", "background-size": "cover;" });
                                            username.val(data.rn || '');
                                            userphone.val(data.ph || '');
                                            useraddress.val(data.ad || '');
                                        }

                                        wf.find(".winning_sureBtn").click(function () {
                                            if (username.val().trim() == "") {
                                                alert("请填写姓名");
                                                return;
                                            }
                                            if (userphone.val().trim() == "") {
                                                alert("请填写电话号码");
                                                return;
                                            }
                                            if (useraddress.val().trim() == "") {
                                                alert("请填写地址");
                                                return;
                                            }
                                            username_a.text(username.val());
                                            userphone_a.text(userphone.val());
                                            useraddress_a.text(useraddress.val());
                                            wf.addClass("none");
                                            w.find(".sure_after").removeClass("none");
                                        });
                                        w.find(".sureBtn_after").click(function () { //确认后提交领奖
                                            N.loadData({ url: domain_url + 'api/lottery/award', callbackLotteryAwardHandler: function (data) {
                                                if (data.result) {
                                                    // alert("领取成功");
                                                    winningWin.close();
                                                    return;
                                                } else {
                                                    alert('亲，服务君繁忙！稍后再试哦！');
                                                }
                                            }, data: {
                                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                                hi: headimgurl ? headimgurl : "",
                                                oi: openid,
                                                rn: encodeURIComponent(username.val()),
                                                ph: userphone.val()
                                            }
                                            });
                                        });
                                        w.find(".winningWin_close").click(function () {
                                            winningWin.close();
                                        });
                                    }
                                });
                                winningWin.init();

                            } else { //没有中奖
                                openLotWin.close();
                                nowinningWin = new N.showWin({
                                    html: "<div class='nowinningWin'><a href='#' class='nowinning_nextBtn'></a><img src='./images/nowin.png' class='nowin' /> <img src='./images/close.png' class='nowin_close' /> </div>",
                                    beforeOpenFn: function (w) {
                                        w.find(".win_contain").css({ "height": "100%", "width": "100%", "background-color": "Transparent" });
                                        var h = $(window).width() * 0.85 / 280 * 443;
                                        w.find(".nowinningWin").height(h);
                                    },
                                    afterOpenFn: function (w) {
                                        w.find(".nowin_close").click(function () {
                                            nowinningWin.close();
                                        });
                                        w.find(".nowinning_nextBtn").click(function () {
                                            nowinningWin.close();
                                        });
                                    }
                                });
                                nowinningWin.init();
                            }
                        }, data: { oi: openid }
                        });
                    });
                }
            });
            openLotWin.init();

        };
        this.appendRankData = function (items) {//append 排名数据

            var ranks = $(".ranks");
            for (var i = 0, len = items.length; i < len; i++) {
                var r = $(this.rank_item).clone(true);
                r.find(".user_head").css({ "background": "url('" + (items[i].hi || "./images/avatar.jpg") + "') no-repeat center center;", "background-size": "cover;" });
                r.find(".user_name").html(items[i].nn || "匿名");
                r.find(".rank_num").html("第" + items[i].rk + "名");
                ranks.append(r);
            }
        };
        this.load_comment = function () {//加载评论
            var that = this;
            that.maxid = 0;
            window.barrage = this.comments.barrage({ fontColor: ["6FC3EF", "FFF", "DE0E4E"] });
            barrage.start(1);
            function loadComments() {
                $.ajax({
                    type: 'GET',
                    async: true,
                    url: domain_url + "api/comments/room?temp=" + new Date().getTime(),
                    dataType: "jsonp",
                    data: { ps: 50, maxid: that.maxid },
                    jsonpCallback: 'callbackCommentsRoom',
                    success: function (data) {
                        if (data.code == 0) {
                            that.maxid = data.maxid;
                            var items = data.items || [];
                            for (var i = 0, len = items.length; i < len; i++) {
                                var hmode = $("<div class='c_head_img'></div>");
                                if (items[i].hu) {
                                    hmode.css({ "background": "url('" + items[i].hu + "/64') no-repeat center center;", "background-size": "cover;" });
                                }
                                if (i < 5) {
                                    $.fn.cookie('default_comment' + i, hmode.get(0).outerHTML + items[i].co, expires_in);
                                }
                                barrage.pushMsg(hmode.get(0).outerHTML + items[i].co);
                            }
                            setTimeout(function () {
                                loadComments();
                            }, 5000);
                        } else {
                            setTimeout(function () {
                                loadComments();
                            }, 5000);
                            if (data.message) {
                                //alert(data.message);
                            }
                        }
                    }
                });
            };
            loadComments();
        };
        this.pushCommentMas = function () {//默认评论条数
            function getComment(msg, imgIndex) {
                var item = $("<div class='c_head_img'></div>");
                item.css({ "background": "url('./images/d" + imgIndex + ".jpg')  no-repeat center center;", "background-size": "cover;" });
                return item.get(0).outerHTML + msg;
            }
            if ($.fn.cookie('default_comment0')) {
                window.CACHEMSG.push($.fn.cookie('default_comment0'));
            } else {
                window.CACHEMSG.push(getComment("虎妈猫爸挺好看", 1));
            }
            if ($.fn.cookie('default_comment1')) {
                window.CACHEMSG.push($.fn.cookie('default_comment1'));
            } else {
                window.CACHEMSG.push(getComment("赵薇也真是操碎了心", 2));
            }
            if ($.fn.cookie('default_comment2')) {
                window.CACHEMSG.push($.fn.cookie('default_comment2'));
            } else {
                window.CACHEMSG.push(getComment("现在小孩子的教育确实是问题", 3));
            }
            if ($.fn.cookie('default_comment3')) {
                window.CACHEMSG.push($.fn.cookie('default_comment3'));
            } else {
                window.CACHEMSG.push(getComment("说出了多少大城市上学的困境啊……", 4));
            }
            if ($.fn.cookie('default_comment4')) {
                window.CACHEMSG.push($.fn.cookie('default_comment4'));
            } else {
                window.CACHEMSG.push(getComment("爷爷奶奶也太宠爱小孩子了", 5));
            }
        };
        this.partInCount = function () {
            var that = this;
            this.loadLineNo = function () {
                $.ajax({
                    type: 'GET',
                    async: true,
                    url: domain_url + "log/serpv?temp=" + new Date().getTime(),
                    dataType: "jsonp",
                    jsonpCallback: 'callbackCountServicePvHander',
                    success: function (data) {
                        setTimeout(function () {
                            that.loadLineNo();
                        }, 5000);
                        if (data.code == 0) {
                            that.lineNum.text(data.c);
                        } else {
                            if (data.message) {
                                // alert(data.message);
                            }
                        }
                    }
                });
            };
            this.loadLineNo();
        };
        this.changeBg = function () { //换背景


        };
        this.load_answer = function () {
            function progress(data) {
                this.question = $(".question");
                this.answered = $(".answered");
                this.timebox = $("#time-box");
                var me = this,
		    	 server_time = new Date(data).getTime();
                this.question.find('li').each(function () {
                    var $me = $(this),
					result = $me.attr('data-ruid');

                    $me.progress({
                        cTime: me.currTime,
                        stpl: '<span>%H%</span><span>:</span><span>%M%</span><span>:</span><span>%S%</span>',
                        callback: function (state) {

                            if (TIMETRUE_CLS) {
                                var cls = '';
                                switch (state) {
                                    case 1:
                                        cls = STARTING_CLS + ' none';
                                        break;
                                    case 2:
                                        cls = STARTED_CLS;
                                        break;
                                    default:
                                        cls = ENDED_CLS + ' none';
                                }
                                $me.removeClass().addClass(cls);

                                var $started = me.question.find('li.' + STARTED_CLS).not(function () {
                                    return parseInt($(this).attr('data-qcode')) !== 2; // 未答题
                                }),
								$starting = me.question.find('li.' + STARTING_CLS);

                                if ($started.length > 0) {
                                    me.answered.addClass('none');
                                    $started.eq(0).removeClass('none');
                                    me.question.removeClass('none');
                                } else {
                                    me.question.addClass('none');
                                    me.answered.removeClass('none');
                                    if ($starting.length > 0) {
                                        // 上一题答错
                                        var $prev = $starting.eq(0).prev('li');
                                        if ($prev && parseInt($prev.attr('data-qcode')) === 0) {
                                            me.answered.addClass('error');
                                            $('#answer-tip').removeClass('none');
                                        } else {
                                            me.answered.removeClass('error');
                                            $('#answer-tip').addClass('none');
                                        }
                                        $("#time-box").html($starting.eq(0).attr('data-timestr')).removeClass('none');
                                        //me.timebox.html($starting.eq(0).attr('data-timestr')).removeClass('none');
                                        $('.timer').removeClass('none');
                                    } else if ($me.next('li').length == 0) {
                                        clearInterval(window.progressTimeInterval);
                                        $(".time-box").addClass('none');
                                        $('.timer-tips').removeClass('none').find('h4').html("<span class='wait-next'>本期答题已结束，请等待下期<span>");
                                        $('.timer').removeClass('none');
                                    }
                                }
                            }
                        }
                    });
                });
            };
            function appendData(data) {
                var t = simpleTpl(),
				qitems = data.qitems || [],
				length = qitems.length;
                this.currTime = timestamp(data.cut);
                this.tid = data.tid;
                t._('<ul>');
                for (var i = 0; i < length; i++) {
                    t._('<li data-qcode="' + qitems[i].qcode + '" data-ruid="' + qitems[i].ruid + '" data-stime="' + timestamp(qitems[i].qst) + '" data-etime="' + timestamp(qitems[i].qet) + '" id="question-' + qitems[i].quid + '" data-quid="' + qitems[i].quid + '">')
						._('<dl>')
							._('<dt>' + qitems[i].qt + '</dt>');
                    var aitems = qitems[i].aitems || [];
                    for (var j = 0, jlen = aitems.length; j < jlen; j++) {
                        t._('<dd><a href="#" class="q-item" data-auid="' + aitems[j].auid + '" data-collect="true" data-collect-flag="tv-yunnan-biancheng-answer-answer" data-collect-desc="答题页面-答案按钮">' + aitems[j].at + '</a></dd>');
                    }
                    t._('</dl>')
					._('</li>');
                }
                t._('</ul>');
                $(".question").html(t.toString());
                progress(data.cut);

            }
            N.loadData({ url: domain_url + '/yiguan/info', callbackYiguanInfo: function (data) {

                if (data.code == 0) {
                    appendData(data);
                    if (data.bm) {
                        $(".comments").css({ "background": "url('" + data.bm + "') no-repeat center center;", "background-size": "cover;" });
                    }
                }
            }
            });

        };
        this.loadLineDayDay = function () {
            N.loadData({ url: domain_url + 'api/common/promotion', commonApiPromotionHandler: function (data) {
                if (data.code == 0) {
                    $(".outer").attr("href", data.url).html(data.desc).removeClass("none");
                } else {
                    $(".outer").addClass("none");
                }
            }, data: { oi: openid }
            })

        };
        this.init = function () {
            this.initParam();
            this.initEvent();
            this.pushCommentMas();
            this.load_comment();
            this.partInCount(); //在线人数
            this.changeBg(); //加载背景
            this.load_answer();

            this.loadLineDayDay();

        };
        this.init();
    });
});