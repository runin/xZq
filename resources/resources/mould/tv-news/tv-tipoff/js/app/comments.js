/**
 * 沈阳沈视早报-评论页
 */
(function($) {
    H.lottery={isCanShake:true};
    H.comments = {
        $main: $('#main'),
        $topicBox: $(".topic-box"),
        $top_back: $(".top-back"),
        $goSpeak: $(".go-speak"),
        $yaoShow: $(".yao-show"),
        actUid: null,
        page: 0,
        beforePage: 0,
        pageSize: 5,
        lastlength: 0,
        item_index: 0,
        commActUid: null,
        loadmore: true,
        isCount: true,
        resultMap: {},
        currentQuestion: {},
        sumCount: 0,
        isCanShake: false,
        times: 0,
        isToLottey: true,
        isTimeOver: false,
        first: true,
        yaoBg: [],
        pal: [],
        istrue: false,
        canJump: true,
        repeat_load: true, //用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        dec: 0, //服务器时间和本地时间的时差
        firstPra: null, //第一轮摇奖活动 用来重置倒计时
        type: 2, //判断倒计时形式 1为抽奖开始之前，2为抽奖正在播出 默认为2
        init: function() {
            var me = this;
            me.currentCommentsAct();
            me.event_handler();
            me.current_time();
            me.refreshDec();
            // me.fill_masking();
        },
        event_handler: function() {
            var me = this;
            this.$main.delegate('.show-all', 'click', function(e) {
                e.preventDefault();
                var $class_all = $(this).parent('div').find('.all-con');

                $class_all.find('span').toggleClass('all');
                if ($class_all.find('span').hasClass('all')) {
                    $(this).text('^显示全部');
                } else {
                    $class_all.css('height', 'auto');
                    $(this).text('^收起');
                }
            });
            this.$top_back.click(function(e) {
                e.preventDefault();
                $(window).scrollTop(0);
                $(this).addClass('none');
            });

            this.$goSpeak.click(function() {
                toUrl("baoliao.html");
            });
            H.comments.getList(H.comments.page);
            $(window).scroll(function() {
                var scroH = $(this).scrollTop(),
                    $fix = $('.fix');
                if (scroH > 0) {
                    $fix.removeClass('none');
                    me.$top_back.removeClass('none');
                } else if (scroH == 0) {
                    $fix.addClass('none');
                    me.$top_back.addClass('none');
                }
            });

            var range = 55, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;
            $(window).scroll(function() {
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if (($(document).height() - range) <= totalheight && H.comments.page < maxpage && H.comments.loadmore) {
                    if (!$('#mallSpinner').hasClass('none')) {
                        return;
                    }
                    H.comments.getList(H.comments.page);
                } else {
                    $('.loading-space').html(' --已到达列表底部--');
                }
            });

            $("#send").click(function() {
                var com_infor = $.trim($("#comments-info").val());
                if (com_infor.length > 30 || com_infor.length == 0) {
                    alert('请填写评论,不要超过30字哦!');
                    $("#comments-info").focus();
                    return;
                }
                if (openid != null) {
                    $("#send").attr("disabled", "disabled");
                    $("#comments-info").attr("disabled", "disabled");
                    if (headimgurl != null && headimgurl.indexOf("./images/avatar.jpg") > 0) {
                        headimgurl = '';
                    }
                    getResult('comments/save', {
                        co: encodeURIComponent($("#comments-info").val()),
                        op: openid,
                        tid: H.comments.commActUid,
                        ty: 1,
                        pa: null,
                        nickname: encodeURIComponent(nickname || ''),
                        headimgurl: headimgurl || ''
                    }, 'callbackCommentsSave', true);
                }
            });

        },
        getList: function(page) {
            if (page - 1 == this.beforePage) {
                $('#mallSpinner').removeClass('none');
                getResultAsync('comments/list', { page: page, ps: this.pageSize, anys: H.comments.commActUid, op: openid, zd: 0, kind: 0 }, 'callbackCommentsList');
            }
        },
        bindClick: function() {
            var me = this;
            $("#sup").find('.support').click(function() {
                var attrUuid = $(this).attr("data-uuid");
                getResult('api/question/answer', {
                    auid: attrUuid,
                    suid: me.currentQuestion.quid,
                    yoi: openid
                }, 'callbackQuestionAnswerHandler', true);
                $.fn.cookie(me.currentQuestion.quid + openid, "true", { expires: 1 });
                me.fill_masking("vote");

            });
        },
        bindZanClick: function(cls) {
            $("." + cls).click(function() {
                if ($(this).hasClass('z-ed')) {
                    return;
                }
                $(this).addClass("curZan").addClass('z-ed');
                getResult('comments/praise', {
                    uid: $(this).parent().parent().attr("data-uuid"),
                    op: openid
                }, 'callbackCommentsPraise', true);
            });
        },
        is_show: function(i) {
            var $all_con = $('#all-con' + i);
            var height = $all_con.height(),
                inner_height = $all_con.find('span').height();
            if (inner_height > height) {
                $all_con.find('span').addClass('all');
                $('#show-all' + i).removeClass('none');
            }
        },
        isAnswer: function(quid) {
            var me = this;
            // 判断cookie
            var answerCookie = $.fn.cookie(quid + openid);
            if (answerCookie && answerCookie == "true") {
                // 答过题
                me.answerResult(quid);
            } else {
                // 判断接口
                getResult('api/question/record', { quid: quid, yoi: openid }, 'callbackQuestionRecordHandler');
            }
        },
        answerResult: function(quid) {
            //获取每个选项的数据
            getResult('api/question/eachsupport', { quid: quid }, 'callbackQuestionSupportHandler');
        },
        tplQuestion: function() {
            var me = this,
                t = simpleTpl(),
                $sx_ul = $('#sup'),
                attrs = me.currentQuestion.aitems;
            for (var i = 0, len = attrs.length; i < len; i++) {
                t._('<a class="btn support" data-uuid = "' + attrs[i].auid + '"><label>' + attrs[i].at + '</label></a>');
            }
            $('#progress').addClass("none");
            $sx_ul.html(t.toString());
            $sx_ul.removeClass("none");
            H.comments.bindClick();
        },
        tplResult: function() {
            var me = this;
            var sumCount = me.sumCount;
            //console.log(sumCount);
            var sumPercent = 0;
            var result = me.currentQuestion.aitems;
            var t = simpleTpl(),
                $sx_ul = $('#progress');
            for (var i = 0, len = result.length; i < len; i++) {
                var percent = (me.resultMap[result[i].auid] / sumCount * 100).toFixed(0);

                if (i == result.length - 1) {
                    percent = (100.00 - sumPercent).toFixed(0);
                }
                t._('<p>')
                    ._('<label>' + result[i].at + '</label>')
                    ._('</p>')
                    ._('<p>')
                    ._('<i class="support-pro"><span style="background:' + colors[i] + '" data-width="' + percent + '%"></span></i>')
                    ._('<span class="lv" style="color:' + colors[i] + '" data-value="' + percent + '">0</span><span style="color:' + colors[i] + '">%</span>')
                    ._('</p>');
                sumPercent += percent * 1;
            }
            me.$topicBox.addClass("topic-show-progress");
            $('#sup').addClass("none");
            $sx_ul.html(t.toString());
            $sx_ul.removeClass("none");

            // 动画
            setTimeout(function() {
                $sx_ul.find(".support-pro").each(function() {
                    $(this).find("span").css("width", $(this).find("span").attr("data-width"));
                });
            }, 100);

            var interVal = [];
            $sx_ul.find(".lv").each(function(index, el) {
                var that = this;
                interVal[index] = setInterval(function() {
                    if ($(that).text() * 1 >= $(that).attr("data-value") * 1) {
                        clearInterval(interVal[index]);
                    } else {
                        $(that).text($(that).text() * 1 + 1);
                    }
                }, (200 / $(that).attr("data-value") * 1 + 1))
            });
        },
        tpl: function(data) {
            var me = this,
                t = simpleTpl(),
                item = data.items || [],
                $top_comment = $('#top-comment'),
                $nor_comment = $('#nor-comment');
            for (var i = 0, len = item.length; i < len; i++) {
                var isZan = item[i].isp ? "z-ed" : "";
                t._('<li data-uuid = "' + item[i].uid + '">')
                    ._('<img src="' + (item[i].im ? (item[i].im + '/' + yao_avatar_size) : './images/avatar.jpg') + '"/>')
                    ._('<div>')
                    ._('<label class="zan ' + isZan + '" data-collect="true" data-collect-flag="comments-zan" data-collect-desc="点赞" ><span style="color:#333;padding:0px 2px 0px 10px;">' + item[i].pc + '</span>顶</label>')
                    ._('<p>' + (item[i].na || '匿名用户') + '</p>')
                    ._('<p class="all-con" id="all-con' + me.item_index + '">')
                    ._('<span>' + item[i].co + '</span>')
                    ._('</p>')
                    ._('<a class="show-all none" id="show-all' + me.item_index + '" data-collect="true" data-collect-flag="comments-show" data-collect-desc="评论收缩显示" >^显示全部</a>')
                    ._('</div>')
                    ._('</li>');
                ++me.item_index;
            }
            if (data.kind == 1) {
                $top_comment.append(t.toString());
            } else {
                $nor_comment.append(t.toString());
            }
            for (var i = 0, len = me.item_index; i < len; i++) { me.is_show(i); }
            H.comments.bindZanClick("zan");
        },
        fill_masking: function(type) {
            var t = simpleTpl();
            t._('<div class="masking-box">')
                ._('<div class="giftbox">')
                ._('<div class="box-bar"></div>')
                ._('<p class="p-showTips">投票成功!</p>')
                ._('<a class="go-luck"  data-collect="true" data-collect-flag="go-luck" data-collect-desc="投票成功-去抽奖">去抽奖</a>')
                ._('</div>')
                ._('</div>');
            // if (type == "vote") {
            //     t._('<span class="click-txt">恭喜您投票成功<br>请点击礼盒抽奖</span>')
            // } else {
            //     t._('<span class="click-txt">感谢您积极评论<br>请点击礼盒抽奖</span>');
            // }
            t._('</div>');
            $('body').append(t.toString());
            $(".go-luck").on("click", function(e) {
                e.preventDefault();
                if ($(this).hasClass("flag")) {
                    return
                } else {
                    $(this).addClass("flag");
                }
                var sn = new Date().getTime() + '';
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/lottery/exec/luck4Vote' + dev,
                    data: { matk: matk, sn: sn },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackLotteryLuck4VoteHandler',
                    timeout: 10000,
                    complete: function() {
                        $('.masking-box').addClass('none').remove();
                    },
                    success: function(data) {
                        if (data.flow && data.flow == 1) {
                            sn = new Date().getTime() + '';
                            H.dialog.lottery.open(null);
                            return;
                        }
                        if (data.result) {
                            if (data.sn == sn) {
                                sn = new Date().getTime() + '';
                                if (data.pt == 0) {
                                    return;
                                } else if (data.pt == 1) {
                                    //兑换码或者实物奖
                                    H.dialog.Entlottery.open(data);
                                } else if (data.pt == 4) {
                                    H.dialog.Redlottery.open(data);
                                } else
                                if (data.pt == 9 || data.pt == 7) {
                                    H.dialog.lottery.open(data);
                                }
                            }
                        } else {
                            sn = new Date().getTime() + '';
                            H.dialog.lottery.open(null);
                        }
                    },
                    error: function() {
                        sn = new Date().getTime() + '';
                        H.dialog.lottery.open(null);
                    }
                });
                recordUserOperate(openid, "调用投票抽奖接口", "doLotteryVote");
                recordUserPage(openid, "调用投票抽奖接口", 0);
                return false;
            });

            $(".giftbox").on("click", function(e) {
                e.preventDefault();
                $(this).closest("masking-box").remove();
                return false;
            });


        },

        currentCommentsAct: function() {
            getResult('api/question/round', {}, 'callbackQuestionRoundHandler', true);
        },
        currentComments: function(commActUid) {
            getResult('comments/count', { anys: commActUid }, 'callbackCommentsCount', true);
            getResult('comments/list', { page: 1, ps: this.pageSize, anys: commActUid, op: openid, dt: 1, zd: 1, kind: 1 }, 'callbackCommentsList', true);
            getResult('comments/list', { page: 1, ps: this.pageSize, anys: H.comments.commActUid, op: openid, zd: 0, kind: 0 }, 'callbackCommentsList');
        },
        //查抽奖活动接口
        current_time: function() {
            shownewLoading();
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryRoundHandler',
                timeout: 11000,
                complete: function() {},
                success: function(data) {
                    if (data.result == true) {
                        H.comments.nowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        H.comments.dec = nowTimeStemp - data.sctm;
                        H.comments.currentPrizeAct(data);
                    } else {
                        if (H.comments.repeat_load) {
                            H.comments.repeat_load = false;
                            setTimeout(function() {
                                H.comments.current_time();
                            }, 5000);
                        } else {
                            hidenewLoading();
                            $(".countdown").removeClass("none");
                            $('.countdown-tip').text("活动尚未开始");
                            $('.detail-countdown').text("");
                            H.comments.isCanShake = false;
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    hidenewLoading();
                    $(".countdown").removeClass("none");
                    $('.countdown-tip').text("活动尚未开始");
                    $('.detail-countdown').text("");
                    H.comments.isCanShake = false;
                }
            });
        },
        currentPrizeAct: function(data) {
            var me = this,
                nowTimeStr = H.comments.nowTime,
                prizeActListAll = data.la,
                prizeLength = 0,
                prizeActList = [];
            var day = nowTimeStr.split(" ")[0];
            if (prizeActListAll && prizeActListAll.length > 0) {
                for (var i = 0; i < prizeActListAll.length; i++) {
                    if (prizeActListAll[i].pd == day) {
                        prizeActList.push(prizeActListAll[i]);
                    }
                };
            }
            H.comments.pal = prizeActList;
            prizeLength = prizeActList.length;
            if (prizeActList.length > 0) {
                if (comptime(prizeActList[prizeLength - 1].pd + " " + prizeActList[prizeLength - 1].et, nowTimeStr) >= 0) { //如果最后一轮结束
                    H.comments.change();
                    return;
                }
                //config微信jssdk
                me.wxConfig();
                for (var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if (comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0) {
                        H.comments.index = i;
                        H.comments.yaoBg = prizeActList[i].bi.split(",");
                        H.comments.nowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                    if (comptime(nowTimeStr, beginTimeStr) > 0) {
                        H.comments.index = i;
                        H.comments.beforeShowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                }
            } else {
                return;
            }

        },
        change: function() {
            hidenewLoading();
            $(".countdown").addClass("none");
        },
        // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {

            H.comments.type = 1;
            H.comments.isCanShake = false;
            var beginTimeStr = pra.pd + " " + pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.comments.dec;
            H.comments.istrue = true;

            $(".countdown-tip").html('距摇奖开启还有 ');
            $('.detail-countdown').attr('etime', beginTimeLong);
            H.comments.count_down();
            $('.countdown').removeClass('none');
            hidenewLoading();
            H.comments.$yaoShow.off();
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra) {
            H.comments.isCanShake = true;
            H.comments.type = 2;

            H.comments.istrue = true;
            var endTimeStr = pra.pd + " " + pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.comments.dec;

            $('.detail-countdown').attr('etime', beginTimeLong);
            $(".countdown-tip").html("距摇奖结束还有");
            H.comments.count_down();
            H.comments.index++;
            $(".countdown").removeClass("none");
            hidenewLoading();
            H.comments.$yaoShow.on("click", function() {
                toUrl("yaoyiyao.html");
            })

        },
        refreshDec: function() {
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000 * 5 * Math.random() + 60000 * 3);
            setInterval(function() {
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/common/time',
                    data: {},
                    dataType: "jsonp",
                    jsonpCallback: 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {},
                    success: function(data) {
                        if (data.t) {
                            var nowTime = Date.parse(new Date());
                            H.comments.dec = nowTime - data.t;
                        }
                    },
                    error: function(xmlHttpRequest, error) {}
                });
            }, dely);
        },
        count_down: function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl: '%H%' + ':' + '%M%' + ':' + '%S%' + '', // 还有...结束
                    stpl: '%H%' + ':' + '%M%' + ':' + '%S%' + '', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        // istrue 用来进行重复判断默认为false，第一次进入之后变为true

                        if (H.comments.istrue) {
                            H.comments.istrue = false;
                            if (H.comments.type == 1) {
                                H.comments.nowCountdown(H.comments.pal[H.comments.index]);
                            } else if (H.comments.type == 2) {
                                //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
                                if (H.comments.index >= H.comments.pal.length) {
                                    // 如果已经是最后一轮摇奖倒计时结束 则显示 今日摇奖结束
                                    H.comments.change();
                                    H.comments.type = 3;
                                    return;
                                }
                                H.comments.beforeShowCountdown(H.comments.pal[H.comments.index]);
                            }
                        }

                    },
                    sdCallback: function() {
                        H.comments.istrue = true;
                    }
                });
            });
        },
        wxConfig: function() {
            //后台获取jsapi_ticket并wx.config
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'mp/jsapiticket' + dev,
                data: {
                    appId: shaketv_appid
                },
                dataType: "jsonp",
                jsonpCallback: 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {},
                success: function(data) {
                    if (data.code == 0) {
                        var url = window.location.href.split('#')[0];
                        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
                        var timestamp = Math.round(new Date().getTime() / 1000);
                        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
                        //权限校验
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr: nonceStr,
                            signature: signature,
                            jsApiList: ["addCard", "checkJsApi"]
                        });
                    }
                },
                error: function(xmlHttpRequest, error) {}
            });
        },
    };

    W.callbackQuestionAnswerHandler = function(data) {
        if (data.code == 0) {
            H.comments.answerResult(H.comments.currentQuestion.quid);
        }
    };

    W.callbackQuestionRoundHandler = function(data) {
        hidenewLoading();
        if (data.code == 0) {
            var question = data.qitems[0];
            if (!question) {
                return;
            }
            H.comments.commActUid = question.quid;
            H.comments.currentQuestion = question;
            $("#comm-title").text(question.qt);
            H.comments.currentComments(question.quid);
            // 判断是否答过题
            H.comments.isAnswer(question.quid);
        }
    }

    W.callbackQuestionSupportHandler = function(data) {
        if (data.code == 0 && data.aitems) {
            var aitems = data.aitems;
            var sumCount = 0;
            for (var i = 0; i < aitems.length; i++) {
                H.comments.resultMap[aitems[i].auid] = aitems[i].supc;
                sumCount += parseInt(aitems[i].supc);
            }
            H.comments.sumCount = sumCount;
            H.comments.tplResult();
        } else {
            // 拼接题目
            H.comments.tplQuestion();
        }
    };
    W.callbackCommentsCount = function(data) {
        if (data.code == 0) {
            $('.people-count').find("i").html(data.tc);
        }
    };

    W.callbackQuestionRecordHandler = function(data) {
        if (data.code == 0 && data.anws) {
            // 答过题
            H.comments.answerResult(H.comments.currentQuestion.quid);
        } else {
            // 没答过题
            // 拼接题目
            H.comments.tplQuestion();
        }
    };
    W.callbackCommentsList = function(data) {
        $('.loading-space').removeClass('none');
        $('#mallSpinner').addClass('none');
        if (data.code == 0) {
            var items = data.items || [],
                len = items.length;
            H.comments.lastlength = len;
            if (data.items.length < H.comments.pageSize && data.kind == 0) {
                H.comments.loadmore = false;
            }
            if (data.items.length == H.comments.pageSize) {
                if (H.comments.page == 0) {
                    H.comments.beforePage = 1;
                    H.comments.page = 2;
                } else {
                    H.comments.beforePage = H.comments.page;
                    H.comments.page++;
                }
            }
            if (H.comments.lastlength < H.comments.pageSize) {
                H.comments.loadmore = false;
                $('.loading-space').html(' --已到达列表底部--');
            } else {
                $('.loading-space').html(' --查看更多>>--');
            }
            H.comments.tpl(data);
        } else {
            if (H.comments.lastlength == H.comments.pageSize) {
                H.comments.loadmore = false;
                $('.loading-space').html(' --已到达列表底部--');
            } else {
                if (data.code != 1) {
                    $('.loading-space').html(' --没有评论--');
                }

            }

        }

    };
    W.callbackCommentsSave = function(data) {
        if (data.code == 0) {
            var headImg = null;
            if (headimgurl == null || headimgurl == '') {
                headImg = './images/avatar.jpg';
            } else {
                headImg = headimgurl + '/' + yao_avatar_size;
            }
            var t = simpleTpl(),
                $nor_comment = $('#nor-comment');
            t._('<li id="' + data.uid + '" data-uuid = "' + data.uid + '">')
                ._('<img src="' + headImg + '"/>')
                ._('<div>')
                ._('<label class="zan-' + data.uid + '" class="zan" data-collect="true" data-collect-flag="comments-zan" data-collect-desc="点赞" ><span style="color:#333;padding:0px 2px 0px 10px;">' + 0 + '</span>顶</label>')
                ._('<p>' + (nickname || '匿名用户') + '</p>')
                ._('<p class="all-con" id="all-con' + data.uid + '">')
                ._('<span>' + $("#comments-info").val() + '</span>')
                ._('</p>')
                ._('<a class="show-all none" id="show-all' + data.uid + '" data-collect="true" data-collect-flag="comments-show" data-collect-desc="评论收缩显示">^显示全部</a>')
                ._('</div>')
                ._('</li>');

            if ($nor_comment.children().length == 0) {
                $nor_comment.append(t.toString());
            } else {
                $nor_comment.children().first().before(t.toString());
            }
            H.comments.is_show(data.uid);
            $("#comments-info").val("");
            H.comments.bindZanClick("zan-" + data.uid);
            $('.people-count').find("i").html($('.people-count').find("i").html() * 1 + 1);

            var navH = $("#" + data.uid).offset().top;
            $(window).scrollTop(navH);

            $("#send").removeAttr("disabled");
            $("#comments-info").removeAttr("disabled");
        } else {
            $("#comments-info").val("");
            $("#send").removeAttr("disabled");
            $("#comments-info").removeAttr("disabled");
        }
        $('.loading-space').addClass("none");
    }

    W.callbackCommentsPraise = function(data) {
        if (data.code == 0) {
            $(".curZan span").text($(".curZan span").text() * 1 + 1);
            $(".curZan").removeClass("curZan");
        }
    }
})(Zepto);
$(function() {
    H.comments.init();
    wx.ready(function() {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function(res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if (t && !H.lottery.isError) {
                    H.lottery.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });
    wx.error(function(res) {
        H.lottery.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});
