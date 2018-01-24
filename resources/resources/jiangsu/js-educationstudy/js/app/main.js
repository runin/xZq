+(function () {
    var main = {
        initParam: function () {
            this.nav_topic = $(".nav_topic"); //话题按钮
            this.nav_lottery = $(".nav_lottery"); //抽奖答题按钮
            this.back = $(".back"); //返回首页
            this.comment = $("#comment"); //评论模块
            this.lottery = $("#lottery"); //抽奖模块
            this.tab_pane = $(".tab_pane"); //显示的模块
            this.question = $(".question"); //问题
            this.answer = $(".answer"); //选项
            this.nostart = $(".nostart"); //没有开始
            this.count_end = $(".count_end"); //结束
            this.answer = $(".answer"); //选项
            this.answer_percent = $(".answer_percent"); //答案百分比
            this.start_count = $(".start_count"); //显示离下次还有多少时间
            this.tip_msg_down = $(".tip_msg_down"); //结束的时候离下次开始时间
            this.topic = $(".topic"); //话题评论
            this.send_btn = $(".send_btn"); //发送按钮
            this.send_input = $(".send_input"); //发送按钮
            this.comment_contain = $(".comment_contain"); //评论容器
            this.comment_count = $(".comment_count"); //评论人数
            this.footer = $("footer");
            this.contain = $(".contain");
            this.contain.height($(window).height() - 64);
            this.footer.css({ "margin-bottom": "0px" });

        },
        showPane: function (type) { //显示对应的pane
            this.tab_pane.removeClass("active_tab").removeClass("in").removeClass("fade");
            if (type == "comment") {
                this.comment.addClass("fade");
                this.comment.addClass("active_tab");
                this.comment[0].offsetWidth;
                this.comment.addClass("in");
                this.footer.removeClass("none");
                return;
            }
            if (type == "lottery") {
                this.lottery.addClass("fade");
                this.lottery.addClass("active_tab");
                this.comment[0].offsetWidth;
                this.lottery.addClass("in");
                this.footer.addClass("none");
                return;
            }
        },
        initEvent: function () {
            var that = this;
            this.nav_topic.click(function () {//切换tab
                $(this).addClass("active");
                that.nav_lottery.removeClass("active");
                that.showPane("comment");
            });
            this.nav_lottery.click(function () {//切换tab
                $(this).addClass("active");
                that.nav_topic.removeClass("active");
                that.showPane("lottery");
            });
            this.back.click(function () {
                window.location.href = "index.html";
            });
        },
        loadQuestion: function () {//加载问题
            var that = this;
            loadData({ url: domain_url + "api/question/round", callbackQuestionRoundHandler: function (data) {
                if (data.code == 0) {
                    that.downCount.initDownCount(data); //开启倒计时
                } else {
                    //alert("抱歉暂时没有话题");
                }
            }
            });
        },
        downCount: {  //倒计时模块
            initDownCount: function (data) {

                var nextQTime = data.nex; //下轮开始时间
                var isAfterAnswer = false; //是否已经答完题
                var that = main;
                var timeArr = []; //时间数组
                for (var i = 0; i < data.qitems.length; i++) {
                    var time = {};
                    time.st = data.qitems[i].qst;
                    time.et = data.qitems[i].qet;
                    timeArr.push(time);
                }
                var qitems = data.qitems; //问题列表
                function nostart(time) {//第一次还没有开始
                    that.nostart.html("离答题开始还有：" + time);
                };
                function startcoun(time) {  //答完题倒计时状态
                    that.question.addClass("none");
                    that.answer.addClass("none");
                    that.nostart.addClass("none");
                    that.answer_percent.addClass("none"); //答案百分比
                    that.start_count.removeClass("none"); //离下次还有多少时间
                    that.count_end.addClass("none"); //结束模块
                    that.start_count.html("离下次答题还剩下：" + time);
                };
                function attime(isAfterAnswer, time, index) {//显示答题
                    that.answer.data("index", index);
                    that.question.removeClass("none");
                    if ($.fn.cookie('suid_' + qitems[index].quid)) {//已经答过了刷新再进来的
                        if (!attime["loadPerent" + qitems[index].quid]) {
                            loadPerent(index);
                            attime["loadPerent" + qitems[index].quid] = true;
                        }
                        that.answer.addClass("none"); //答题完成之后就显示百分比，和下次开始的倒计时
                        that.answer_percent.removeClass("none"); //答案百分比
                        that.start_count.removeClass("none"); //倒计时
                        if (index > data.length - 1) {
                            that.start_count.html("离下次答题还剩下：" + time);
                        } else {
                            that.start_count.html("离活动结束还有：" + time);
                        }
                        that.nostart.addClass("none");
                        that.count_end.addClass("none"); //结束模块
                        return;
                    }

                    if (!isAfterAnswer || $.fn.cookie("")) {//没有答题
                        that.answer.removeClass("none");
                        that.answer_percent.addClass("none"); //答案百分比
                        that.start_count.addClass("none");
                    } else {
                        that.answer.addClass("none"); //答题完成之后就显示百分比，和下次开始的倒计时
                        that.answer_percent.removeClass("none"); //答案百分比
                        that.start_count.removeClass("none"); //倒计时
                        if (index > data.length - 1) {
                            that.start_count.html("离下次答题还剩下：" + time);
                        } else {
                            that.start_count.html("离活动结束还有：" + time);
                        }
                    }
                    that.nostart.addClass("none");
                    that.count_end.addClass("none"); //结束模块
                };
                function inQuantum(index) { //进入时段的时候赋值数据
                    that.answer.data("index", index);
                    that.question.html(qitems[index].qt);
                    that.question.data("suid", qitems[index].quid);
                    for (var i = 0; i < qitems[index].aitems.length; i++) {
                        var aitem = $('<div class="answer_item"><input type="radio" name="answer" /><span class="an_text"><span></div>');
                        aitem.find(".an_text").html(qitems[index].aitems[i].at);
                        aitem.data("auid", qitems[index].aitems[i].auid);
                        that.answer.append(aitem);
                        that.answer_percent.append(aitem.clone());
                        var progress = $('<div class="progress"><div class=" progress-bar" style="width: 0%;"><span class="progress_text">0%</span></div><div class="people_num"></div></div>');
                        progress.addClass("p_auid" + qitems[index].aitems[i].auid);
                        that.answer_percent.append(progress);
                    }
                    initClick();
                };
                function loadPerent(index) {
                    loadData({ url: domain_url + "api/question/eachsupport", callbackQuestionSupportHandler: function (data) {//获取支持数量
                        if (data.code == 0) {
                            var totalnum = 0;
                            for (var j = 0; j < data.aitems.length; j++) {
                                totalnum += data.aitems[j].supc;
                            }
                            for (var i = 0; i < data.aitems.length; i++) {
                                var supc = data.aitems[i].supc;
                                var perent = parseInt(supc / totalnum * 100).toFixed(0);
                                var target = $(".p_auid" + data.aitems[i].auid);
                                target.find(".people_num").html(supc + "人");
                                target.find(".progress-bar").css({ width: perent + "%" });
                                target.find(".progress_text").html(perent + "%");
                            }
                        } else {
                        }
                    }, data: { quid: qitems[index].quid }, showload: false
                    });
                };
                function initClick() {
                    that.answer.find(".answer_item").click(function () {
                        $(this).find("input[type='radio']").attr("checked", "checked");
                        var auid = $(this).data("auid");
                        var suid = that.question.data("suid");
                        that.answer.find(".answer_item").unbind("click"); //解除绑定
                        isAfterAnswer = true;
                        $.fn.cookie('suid_' + suid, suid, expires_in);

                        loadData({ url: domain_url + "api/question/answer", callbackQuestionAnswerHandler: function (data) {
                            if (data.code == 0) {
                                if (data.rs == 1) { //答错
                                    main.downCount.answerRight(data);
                                } else if (data.rs == 2) { //答对
                                    main.downCount.answerError(data);
                                } else {//不用验证对错 
                                    main.downCount.answerRight(data);
                                }
                            } else {
                                main.downCount.answerError(data);
                            }
                            loadPerent(that.answer.data("index") || 0);
                        }, data: {
                            yoi: openid,
                            suid: suid,
                            auid: auid
                        }
                        });
                    });
                };
                function end(time) { //整个倒计时结束
                    that.question.addClass("none");
                    that.answer.addClass("none");
                    that.nostart.addClass("none");
                    that.answer_percent.addClass("none"); //答案百分比
                    that.start_count.addClass("none"); //离下次还有多少时间
                    that.count_end.removeClass("none"); //结束模块
                    that.tip_msg_down.html("距离下轮答题还有：" + time);
                };
                $("<div></div>").countDown({ timeArr: timeArr,
                    countDownFn: function (t, time, index) {//
                        if (index == 0) { //没有开始的情况
                            nostart(time);
                            return;
                        }
                        startcoun(time);
                    }, atTimeFn: function (dt, index, startTime, obj, nowTime, endTime) {
                        attime(isAfterAnswer, obj.showTime(endTime - nowTime), index);
                    }, inQuantumFn: function (t, index) {
                        inQuantum(index);
                    }, endFn: function (dt, index, obj, noTime) {
                        setInterval(function () {
                            if (obj.timestamp(nextQTime) - new Date().getTime()) {
                                end(obj.showTime(obj.timestamp(nextQTime) - new Date().getTime()));
                            } else {
                                that.tip_msg_down.html("敬请期待，下期更精彩" );
                            }
                        }, 1000);
                    }
                });
            },
            answerRight: function (data) { //答对了
                function showLottery(isLottery, data) {//中奖的界面
                    switch (data.pt) {
                        case 0: //谢谢参与
                            break;
                        case 4: //红包
                            break;
                        case 7: //微信卡劵
                            weixinka(data);
                            break;
                        case 9: //外链奖品
                            outsidelink(data);
                            break;
                        default:
                    };
                    function outsidelink(data) {  //外链奖品
                        var htmlarr = [];
                        htmlarr.push('<img src="images/lottry.png" class="lottry_img" />');
                        htmlarr.push('<div class="closebtn"></div>');
                        htmlarr.push('<div class="get_btn_link"></div>');
                        htmlarr.push('<div class="outsidelink_div"></div>');
                        var win = new showWin({
                            html: htmlarr.join(''),
                            beforeOpenFn: function (winobj) {
                                var win_contain = winobj.find(".win_contain");
                                win_contain.css({ width: $(window).width() * 0.8, height: $(window).width() * 0.8 * 483 / 485 });
                                win_contain.find(".outsidelink_div").css({ "background": "url(" + data.pi + ") no-repeat center center", "background-size": "contain" });
                            },
                            afterOpenFn: function (winobj) {
                                var win_contain = winobj.find(".win_contain");
                                win_contain.addClass("out").removeClass("go");
                                win_contain.find(".get_btn_link").click(function () {
                                    if (data.ru) {
                                        window.location.href = data.ru;
                                    }
                                });
                                win_contain.find(".closebtn").click(function () {
                                    winobj.find(".win_contain").addClass("go").removeClass("out");
                                    setTimeout(function () {
                                        win.close();
                                    }, 500);
                                });
                            }
                        });
                        win.init();
                    }
                    function weixinka(data) {//中得微信卡卷的函数
                        var htmlarr = [];
                        htmlarr.push('<img src="images/lottry.png" class="lottry_img" />');
                        htmlarr.push('<div class="closebtn"></div>');
                        htmlarr.push('<div class="get_btn"></div>');
                        htmlarr.push('<div class="weixinka_div"></div>');
                        var win = new showWin({
                            html: htmlarr.join(''),
                            beforeOpenFn: function (winobj) {
                                var win_contain = winobj.find(".win_contain");
                                win_contain.css({ width: $(window).width() * 0.8, height: $(window).width() * 0.8 * 483 / 485 });
                                win_contain.find(".weixinka_div").css({ "background": "url(" + data.pi + ") no-repeat center center", "background-size": "contain" });
                            },
                            afterOpenFn: function (winobj) {
                                var win_contain = winobj.find(".win_contain");
                                win_contain.addClass("out").removeClass("go");
                                win_contain.find(".get_btn").click(function () {
                                    wx.addCard({
                                        cardList: [{
                                            cardId: data.ci,
                                            cardExt: "{\"timestamp\":\"" + data.ts + "\",\"signature\":\"" + data.si + "\"}"
                                        }], // 需要添加的卡券列表
                                        success: function (res) {
                                            win.close();
                                        },
                                        fail: function (res) {
                                            win.close();
                                        },
                                        complete: function () {
                                            win.close();
                                        }
                                    });
                                });
                                win_contain.find(".closebtn").click(function () {
                                    winobj.find(".win_contain").addClass("go").removeClass("out");
                                    setTimeout(function () {
                                        win.close();
                                    }, 500);
                                });
                            }
                        });
                        win.init();
                    }
                }
                var win = new showWin({
                    html: '<img src="images/answerRight.png" class="answerRight" /><div class="closebtn"></div><div class="openlink"></div>',
                    beforeOpenFn: function (winobj) {
                        var win_contain = winobj.find(".win_contain");
                        win_contain.css({ width: $(window).width() * 0.8, height: $(window).width() * 0.8 * 483 / 485 });
                    },
                    afterOpenFn: function (winobj) {
                        var win_contain = winobj.find(".win_contain");
                        win_contain.addClass("out").removeClass("go");
                        win_contain.find(".closebtn").click(function () {
                            winobj.find(".win_contain").addClass("go").removeClass("out");
                            setTimeout(function () {
                                win.close();
                            }, 500);
                        });
                        win_contain.find(".openlink").click(function () {
                            loadData({ url: domain_url + "api/lottery/luck", callbackLotteryLuckHandler: function (data) {
                                if (data.result == true) {
                                    showLottery(true, data); //中奖
                                    win.close();
                                } else {
                                    win.close();
                                    alert("抱歉没有中奖");
                                }
                            }, data: { oi: openid }
                            });
                        });
                    }
                });
                win.init();
            },
            answerError: function (data) { //答错了

                var win = new showWin({
                    html: '<img src="images/answerError.png" class="answerError" /><div class="closebtn"></div><div class="contine"></div>',
                    beforeOpenFn: function (winobj) {
                        var win_contain = winobj.find(".win_contain");
                        win_contain.css({ width: $(window).width() * 0.8, height: $(window).width() * 0.8 * 483 / 485 });
                    },
                    afterOpenFn: function (winobj) {
                        winobj.find(".win_contain").addClass("out").removeClass("go");
                        $(".closebtn,.contine").click(function () {
                            winobj.find(".win_contain").addClass("go").removeClass("out");
                            setTimeout(function () {
                                win.close();
                            }, 500);
                        });
                    }
                });
                win.init();
            }
        },
        commentModule: {//评论模块
            loadTopic: function () { //加载评论
                var that = main;
                that.topicid = "";
                function goLoadTopic() {
                    loadData({ url: domain_url + "api/comments/topic/round", callbackCommentsTopicInfo: function (data) {
                        if (data.code == 0) {
                            if (data.items.length > 0) {
                                var timeArr = [];
                                that.topicid = data.items[0].uid;
                                for (var i = 0; i < data.items.length; i++) {
                                    var time = {};
                                    time.st = data.items[i].st;
                                    time.et = data.items[i].et;
                                    timeArr.push(time);
                                }
                                $("<div></div>").countDown({ timeArr: timeArr, useSystemTime: false,
                                    countDownFn: function (t, time, index) {// 
                                        if (index == 0) {
                                            that.topic.html(data.items[0].t);
                                            that.topicid = data.items[0].uid;
                                        }
                                    }, atTimeFn: function (dt, index, startTime, obj, nowTime, endTime) {
                                        that.topic.html(data.items[index].t);
                                        that.topicid = data.items[index].uid;
                                    }, inQuantumFn: function (t, index) {
                                        that.topic.html(data.items[index].t);
                                        that.topicid = data.items[index].uid;
                                    }, endFn: function (dt, index, obj, noTime) {
                                    }
                                });
                            }
                        } else {
                            that.topic.html("暂时没有话题");
                        }
                    }, showload: false
                    });
                }
                goLoadTopic();
            },
            loadComment: function () {//加载评论
                var arr = [];
                arr.push('<article class="comment_con">');
                arr.push('<input type="hidden" class="user_uid" />');
                arr.push('<div class="user_img">');
                arr.push('</div>');
                arr.push('<div class="user_text_con">');
                arr.push('<div class="user_name">');
                arr.push('匿名');
                arr.push('</div>');
                arr.push('<div class="comment_text">');
                arr.push('</div>');
                arr.push('<div class="nosupport">');
                arr.push('<div class="nosupport_img">');
                arr.push('</div>');
                arr.push('<div class="support_num">');
                arr.push('0</div>');
                arr.push('</div>');
                arr.push('</div>');
                arr.push('</article>');

                var that = main;
                that.isload = true;
                that.talk_item = $(arr.join('')); ;
                that.maxid = 0;
                that.loadCount = 0;
                that.comment_contain.empty();
                that.talk_say = that.comment_contain;
                that.uids = [];
                var ts = $(window);
                var tshh = ts.height();
                var pageIndex = 2;
                var lastuid = "";
                var pagesize = 50;

                that.comment_contain.delegate(".nosupport_img", "click", function (e) { //点赞事件
                    var t = $(this);
                    var uuid = t.parent().parent().parent().find(".user_uid").val();
                    if ($.fn.cookie("uuid_" + uuid)) {
                        alert("你已经赞过啦");
                        return;
                    }
                    if (t.hasClass("support_img")) {
                        alert("你已经赞过啦");
                        return;
                    }
                    t.addClass("support_img");
                    var n = parseInt(t.next().html());
                    t.next().html(n + 1);
                    $.fn.cookie("uuid_" + uuid, uuid, expires_in);
                    loadData({ url: domain_url + "api/comments/praise", callbackCommentsPraise: function (data) {
                    }, data: { uid: uuid, op: openid
                    }
                    });
                });
                that.send_btn.click(function (e) {
                    if (that.send_input.get(0).value == "") {
                        alert("请填写内容");
                        return;
                    }

                    loadData({ url: domain_url + "api/comments/save", callbackCommentsSave: function (data) {
                        if (data.code == 0) {
                            var uid = data.uid;
                            that.talk_item_t = that.talk_item.clone(true);
                            if (nickname) {
                                that.talk_item_t.find(".user_name").html(nickname);
                            }
                            if (headimgurl) {
                                that.talk_item_t.find(".user_img").css({ "background": "url('" + (headimgurl + "/64") + "') no-repeat center center", "background-size": "cover" });
                            }
                            that.talk_item_t.find(".comment_text").html(that.send_input.val());
                            that.talk_item_t.find(".user_uid").val(uid);
                            that.uids.push(uid);
                            that.talk_say.prepend(that.talk_item_t);
                            $(window).scrollTop(0);
                            that.send_input.val("");
                            that.talk_say.scrollTop(0);
                            getCommentCount(function () {
                                var tc = parseInt(that.comment_count.html());
                                that.comment_count.html(tc + 1);
                            });
                        } else {
                            if (data.message) {
                                alert(data.message);
                                //that.send_input.val("");
                            } else {
                                alert("发表评论失败");
                            }
                        }
                    }, data: {
                        co: encodeURIComponent(that.send_input.val()),
                        op: openid,
                        tid: that.topicid,
                        ty: that.topicid ? 1 : 2,
                        nickname: nickname ? encodeURIComponent(nickname) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    }
                    });
                    return false;
                });
                function getCommentCount(fn) { //获取评论总数
                    loadData({ url: domain_url + "api/comments/count", callbackCommentsCount: function (data) {
                        if (data.code == 0) {
                            that.comment_count.html(data.tc);
                            if (fn) {
                                fn();
                            }

                        } else {
                        }
                    }
                    });
                };
                getCommentCount();
                var lastScrollTop = 0;
                var isLoadAll = false; //是否加载完毕
                that.contain.scroll(function () {
                    var scrollTop = $(this).scrollTop();
                    if (lastScrollTop > scrollTop) {
                        return;
                    } else {
                        lastScrollTop = scrollTop;
                    }
                    if (isLoadAll) {
                        return;
                    }
                    var scrollHeight = $(".top").height() + $("nav").height() + $(".main").height();
                    var windowHeight = $(window).height();

                    if (scrollTop + windowHeight - 64 >= scrollHeight - 30) {
                        loadData({ url: domain_url + "api/comments/list?temp=" + new Date().getTime(), callbackCommentsList: function (data) {
                            if (data.code == 0) {
                                if (pagesize > data.items.length) {
                                    isLoadAll = true;
                                }
                                if (pageIndex == 2) {
                                    lastuid = data.items[data.items.length - 1].uid;
                                } else {
                                    if (lastuid == data.items[data.items.length - 1].uid) {
                                        return;
                                    } else {
                                        lastuid = data.items[data.items.length - 1].uid;
                                    }
                                }
                                pageIndex++;
                                if (that.isload) {
                                    window.appendData(data.items, 0);
                                }
                            } else {
                                isLoadAll = true;
                            }
                        }, error: function () {

                        }, data: { ps: pagesize, page: pageIndex }
                        });
                    }
                });
                window.appendData = function (items, loadCount) {
                    for (var i = 0, len = items.length; i < len; i++) {
                        var item = $(arr.join(""));
                        if (items[i].hu) {
                            item.find(".user_img").css({ "background": "url('" + (items[i].hu + "/64") + "') no-repeat center center;", "background-size": "cover" });
                        } else {
                            if (items[i].im) {
                                item.find(".user_img").css({ "background": "url('" + (items[i].im + "/64") + "') no-repeat center center;", "background-size": "cover" });
                            } else {
                                item.find(".user_img").css({ "background": "url('" + "./images/avatar.jpg" + "') no-repeat center center;", "background-size": "cover" });
                            }
                        }
                        item.find(".user_name").html(items[i].na || "匿名");
                        item.find(".push_time").text(items[i].ats);
                        item.find(".comment_text").html(items[i].co);
                        item.find(".support_num").html(items[i].pc || 0);
                        if (items[i].isp) {
                            item.find(".nosupport_img").addClass("support_img");
                        }
                        item.find(".user_uid").val(items[i].uid);
                        if (that.uids.indexOf(items[i].uid) == -1) {
                            if (loadCount == 0) {
                                that.talk_say.append(item);
                            } else {
                                that.talk_say.prepend(item);
                                var tc = parseInt(that.comment_count.html());
                                that.comment_count.html(tc + 1);
                            }
                        }
                    };
                };
                function loadFunction() {
                    loadData({ url: domain_url + "api/comments/room?temp=" + new Date().getTime(), callbackCommentsRoom: function (data) {
                        if (data.code == 0) {
                            that.maxid = data.maxid;
                            that.items = data.items || [];
                            if (that.isload) {
                                appendData(that.items, that.loadCount);
                            }
                            that.loadCount++;
                            setTimeout(function () {
                                loadFunction();
                            }, 5000);
                        } else {
                            setTimeout(function () {
                                loadFunction();
                            }, 5000);
                        }
                    }, error: function () {
                        setTimeout(function () {
                            loadFunction();
                        }, 5000);
                    }, data: { ps: pagesize, maxid: that.maxid, op: openid }, showload: false
                    });
                };
                loadFunction();
            },
            init: function () {
                main.commentModule.loadTopic(); //加载话题
                main.commentModule.loadComment();
            }
        },
        init: function () {
            this.initParam();
            this.initEvent();
            this.loadQuestion();
            this.commentModule.init();
        }
    };
    main.init();
})(Zepto);