(function ($) {

    W.barrage = null;

    H.main = {
        $body: $("body"),
        $header: $("header"),
        $countDown: this.$("header").find('.count-down'),
        $gameOn: this.$("header").find('.game-on'),
        $gameOver: this.$("header").find('.game-over'),
        $content: $(".content"),
        $footer: $('footer'),
        $topicText: $("#topic-text"),
        $noprise: $('.noprise'),
        $redpack: $('.redpack'),
        $redpackOpen: $('.redpack-open'),
        $redpackOver: $('.redpack-over'),
        textTemplet: '<section class="text-group"><section class="img-wrapper"><img src="@href@" onerror="this.src=\'images/avatar.jpg\'"/></section><span class="text">@text@</span></section>',
        textTempletSelf: '<section class="text-group"><section class="img-wrapper"><img src="@href@"/></section><span class="text text-self">@text@</span></section>',
        commentMaxId: 0,
        periodId: 0,
        questionIndex: -1,
        questions: [],
        letterArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        init: function () {
            H.main.resize();
            H.main.initCountUser();
            H.main.initRedpack();
            H.main.initCountDown();
            H.main.initBarrage();
            H.main.initComment();
            H.main.initTttj();
        },

        initCountUser: function () {
            getResult("log/serpv", {}, "W.callbackCountServicePvHander");
        },

        initRedpack: function () {
            H.main.$noprise.find('.button').click(function () {
                H.main.$noprise.addClass('none');
            });
            H.main.$noprise.find('.close').click(function () {
                H.main.$noprise.addClass('none');
            });

            H.main.$redpackOpen.find('.close').click(function () {
                H.main.$redpackOpen.addClass('none');
            });

            H.main.$redpackOpen.find('.button').click(function () {
                var name = $.trim($("#name").val());
                var mobile = $.trim($("#mobile").val());
                var address = $.trim($("#address").val());
                if (name == null || name == "undefined" || name == "") {
                    alert("请填写姓名！");
                    return false;
                }
                if (mobile == null || mobile == "undefined" || mobile == "") {
                    alert("请填写手机号码！");
                    return false;
                }
                if (address == null || address == "undefined" || address == "") {
                    alert("请填写收件地址！");
                    return false;
                }
                showLoading();
                getResult("api/lottery/award", {
                    oi: openid,
                    nn: encodeURIComponent(nickname),
                    hi: headimgurl,
                    ph: mobile,
                    rn: encodeURIComponent(name),
                    ad: address
                }, "W.callbackLotteryAwardHandler");
            });

            H.main.$redpackOver.find('.close').click(function () {
                H.main.$redpackOver.addClass('none');
            });

            H.main.$redpackOver.find('.button').click(function () {
                H.main.$redpackOver.addClass('none');
            });
        },


        initCountDown: function () {
            showLoading();
            getResult("api/question/round", {}, "W.callbackQuestionRoundHandler");
        },

        initBarrage: function () {
            barrage = this.$content.barrage({fontSize: [14, 18, 22], fontColor: ["FFFFFF"]});
            barrage.start();
            showLoading();
            getResult("api/comments/room", {ps: 50, maxid: H.main.commentMaxId}, "W.callbackCommentsRoom");
            H.main.rollingBarrage();
        },

        initComment: function () {
            //初始化话题
            getResult("api/comments/topic/round", {}, "W.callbackCommentsTopicInfo");

            //发送按钮绑定事件
            this.$footer.find('.send').click(function () {
                var topicText = $.trim(H.main.$topicText.val());
                if (topicText == null || topicText == "undefined" || topicText == "") {
                    alert("内容不能为空哦~");
                }
                else {
                    showLoading();
                    getResult("api/comments/save", {
                        co: encodeURIComponent(topicText),
                        op: openid,
                        ty: 2,
                        nickname: encodeURIComponent(nickname),
                        headimgurl: headimgurl
                    }, "W.callbackCommentsSave");
                }
            });
        },

        initTttj: function () {
            getResult("api/common/promotion", {oi: openid}, "W.commonApiPromotionHandler");
        },

        initQuestion: function (index) {
            if (H.main.questionIndex < index) {
                H.main.questionIndex = index
                getResult("api/question/record", {quid: W.question.quid, yoi: openid}, "W.callbackQuestionRecordHandler");
            }
        },

        showQuestion: function () {
            H.main.$gameOn.find('.game-question').removeClass('none');
            H.main.$gameOn.find('.game-choujiang').addClass('none');
            H.main.$gameOn.find('.question').text(W.question.qt);
            if (W.question.aitems && W.question.aitems.length > 0) {
                var answers = "";
                $(W.question.aitems).each(function (i, item) {
                    answers += "<section class='answer-item'>" +
                        "<input type='hidden' value='" + item.auid + "'/>" +
                        "<label>" + H.main.letterArr[i] + "、" + item.at + "</label>" +
                        "</section>";
                });
                H.main.$gameOn.find('.answer').html(answers);
                H.main.bindClickEvent();
            }
        },

        bindClickEvent: function () {
            var items = H.main.$gameOn.find('.answer-item');
            items.each(function () {
                var item = $(this);
                item.click(function () {
                    items.each(function () {
                        $(this).removeClass('select');
                    });
                    item.addClass('select');
                });
            });
            var button = H.main.$gameOn.find('.submit');
            button.click(function () {
                var auid = H.main.$gameOn.find('.answer').find('.answer-item.select').find('input').val();
                if (auid) {
                    showLoading();
                    getResult("api/question/answer", {
                        yoi: openid,
                        suid: W.question.quid,
                        auid: auid
                    }, "W.callbackQuestionAnswerHandler");
                }
                else {
                    alert('请先选择要投票的选项~');
                }
            });
        },

        showResult: function () {
            H.main.$gameOn.find('.game-question').addClass('none');
            H.main.$gameOn.find('.game-choujiang').removeClass('none');
            H.main.$gameOn.find('.question').text(W.question.qt);
            if (W.question.aitems && W.question.aitems.length > 0) {
                var answers = "";
                $(W.question.aitems).each(function (i, item) {
                    answers += "<section class='vote-item'>" +
                        "<label>" + H.main.letterArr[i] + "、" + item.at + "</label>" +
                        "<section id='" + item.auid + "'></section>" +
                        "</section>";
                });
                H.main.$gameOn.find('.vote').html(answers);
            }
            showLoading();
            getResult("api/question/support/" + W.question.quid, {}, "W.callbackQuestionSupportHandler");

            var button = H.main.$gameOn.find('.choujiang');
            button.removeClass('none');
            var chouJiangId = $.fn.cookie(openid + '_question');
            if (chouJiangId == W.question.quid) {
                button.addClass('invalid');
            }
            else {
                button.removeClass('invalid');
            }
            button.click(function () {
                if (!$(this).hasClass('invalid')) {
                    showLoading();
                    getResult("api/lottery/luck", {oi: openid, sau: H.main.periodId}, "W.callbackLotteryLuckHandler")
                }
            });
        },

        rollingBarrage: function () {
            setInterval(function () {
                getResult("api/comments/room", {ps: 50, maxid: H.main.commentMaxId}, "W.callbackCommentsRoom");
            }, 5000);
        },

        resize: function () {
            var w = $(W).width();
            var h = $(W).height();
            this.$body.css("background-size", w + "px " + h + "px");
            this.$header.css("height", h / 3 + 'px');
            this.$content.css("height", (h * 2 / 3 - 75) + 'px');
            this.$footer.find('.input-wrapper').css("background-size", (w - 60) + "px " + 40 + "px");
            this.$footer.find('input').css("width", (w - 60) + "px");

            this.$noprise.find('.noprise-bg').css("background-size", w + "px " + h + "px");
            this.$noprise.find('.noprise-text').css("top", h * 0.4);

            this.$redpack.find('.redpack-bg').css("background-size", w + "px " + h * 0.9 + "px");
            this.$redpack.find('.redpack-text').css("top", h * 0.6);

            this.$redpackOpen.find('.redpack-open-bg').css("background-size", w + "px " + h + "px");
            this.$redpackOpen.find('.redpack-open-title').css("top", h * 0.18);
            this.$redpackOpen.find('.redpack-open-text').css("top", h * 0.3);

            this.$redpackOver.find('.redpack-over-bg').css("background-size", w + "px " + h + "px");
            this.$redpackOver.find('.redpack-over-text').css("top", h * 0.5);
        }
    };

    W.callbackCountServicePvHander = function (data) {
        if (data.code == 0) {
            $("#count-span").text(data.c);
        }
    }

    W.callbackQuestionRoundHandler = function (data) {
        hideLoading();
        if (data.code == 0) {
            H.main.periodId = data.tid;
            H.main.questions = data.qitems;
            getResult("api/common/time", {}, "W.commonApiTimeHandler");
        }
        else {
            alert("网络错误，请稍后重试");
        }
    }

    W.commonApiTimeHandler = function (data) {
        var $countDownText = H.main.$countDown.find('strong');
        $countDownText.countdown({
            offset: (new Date().getTime() - data.t),
            questions: H.main.questions,
            callback: W.callbackQuestionInfo
        });
    }

    W.callbackQuestionRecordHandler = function (data) {
        if (data.code == 0) {

            if (data.anws) {
                H.main.showResult();
            } else {
                H.main.showQuestion();
            }
        } else {
            H.main.showQuestion();
        }
    }

    W.callbackQuestionInfo = function (state, index) {
        if (state) {
            if (state == 1) {
                H.main.$countDown.removeClass('none');
                H.main.$gameOn.addClass('none');
                H.main.$gameOver.addClass('none');
            }
            else if (state == 2) {
                H.main.$countDown.addClass('none');
                H.main.$gameOn.removeClass('none');
                H.main.$gameOver.addClass('none');
                H.main.initQuestion(index);
            }
            else if (state == 3) {
                H.main.$countDown.addClass('none');
                H.main.$gameOn.addClass('none');
                H.main.$gameOver.removeClass('none');
            }
            else {
                H.main.$countDown.addClass('none');
                H.main.$gameOn.addClass('none');
                H.main.$gameOver.removeClass('none');
            }
        } else {
            H.main.$countDown.addClass('none');
            H.main.$gameOn.addClass('none');
            H.main.$gameOver.removeClass('none');
        }
    }

    W.callbackQuestionAnswerHandler = function (data) {
        hideLoading();
        if (data.code == 0) {
            H.main.showResult();
        }
        else {
            alert("网络错误，请稍后重试");
        }
    }

    W.callbackQuestionSupportHandler = function (data) {
        hideLoading();
        if (data.code == 0) {
            if (data.aitems && data.aitems.length > 0) {
                var allCount = 0;
                $(data.aitems).each(function (i, item) {
                    allCount += item.supc;
                });
                if (allCount <= 0) {
                    $(data.aitems).each(function (i, item) {
                        var htmlText = "<section class='outer'><section class='inner' style='width: " + '0.00 %' + "'></section></section></section><label>0.00%</label>";
                        $("#" + item.auid).html(htmlText);
                    });
                } else {
                    $(data.aitems).each(function (i, item) {
                        var rate = (item.supc * 100.00 / allCount).toFixed(2) + "%";
                        var htmlText = "<section class='outer'><section class='inner' style='width: " + rate + "'></section></section></section><label>" + rate + "</label>";
                        $("#" + item.auid).html(htmlText);
                    });
                }
            }
        }
        else {
            alert("网络错误，请稍后重试");
        }
    }

    W.callbackLotteryLuckHandler = function (data) {
        hideLoading();
        $.fn.cookie(openid + '_question', W.question.quid, {expires: 1});
        var button = H.main.$gameOn.find('.choujiang');
        button.addClass('invalid');
        if (data.result) {
            H.main.$redpack.removeClass('none');
            H.main.$redpack.find('.redpack-bg').addClass('fadeIn');
            H.main.$redpack.find('.button').click(function () {
                H.main.$redpack.addClass('none');
                H.main.$redpackOpen.removeClass('none');
                H.main.$redpackOpen.find('.redpack-open-bg').addClass('fadeIn');
                H.main.$redpackOpen.find('.redpack-open-bg').find('.redpack-open-text').find('img').attr('src', data.pi);
                data.rn && $.trim($("#name").val(data.rn));
                data.ph && $.trim($("#mobile").val(data.ph));
                data.ad && $.trim($("#address").val(data.ad));
            });
        }
        else {
            H.main.$noprise.removeClass('none');
            H.main.$noprise.find('.noprise-bg').addClass('fadeIn');
        }
    }

    W.callbackLotteryAwardHandler = function (data) {
        hideLoading();
        if (data.result) {
            H.main.$redpackOpen.addClass('none');
            H.main.$redpackOver.removeClass('none');
        }
        else {
            alert("领奖失败！");
        }
    }

    W.callbackCommentsRoom = function (data) {
        hideLoading();
        if (data.code == 0) {
            H.main.commentMaxId = data.maxid;
            if (data.items && data.items.length > 0) {
                $(data.items).each(function (index, item) {
                    barrage.pushMsg(H.main.textTemplet.replace("@href@", item.hu ? item.hu + '/64' : "images/avatar.jpg").replace("@text@", item.co));
                });
            }
        }
    }

    W.callbackCommentsSave = function (data) {
        hideLoading();
        if (data.code == 0) {
            barrage.appendMsg(H.main.textTempletSelf.replace("@href@", headimgurl ? headimgurl + '/64' : "images/avatar.jpg").replace("@text@", $.trim(H.main.$topicText.val())));
            H.main.$topicText.val("");
        }
        else {
            alert("网络错误，请稍后重试");
        }
    };

    W.callbackCommentsTopicInfo = function (data) {
        if (data.code == 0) {
            if (data.items && data.items.length > 0) {
                var item = data.items[0];
                var $topic = $("#topic-content");
                item.c && $topic.attr("href", item.c);
                $topic.text(item.t);
            }
        }
    }

    W.commonApiPromotionHandler = function (data) {
        if (data.code == 0) {
            var $tttj = $(".tttj");
            $tttj.removeClass('none');
            $tttj.attr('href', data.url);
            $tttj.html(data.desc);
        }
    }

    $(W).resize(function () {
        H.main.resize();
    });

    H.main.init();

})
(Zepto);