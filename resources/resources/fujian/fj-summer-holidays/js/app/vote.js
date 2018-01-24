(function ($) {

    H.vote = {
        $win: $('#audio_win'),

        imgRatio: 303 / 213,
        leftOffsetRatio: 32 / 640,
        topOffsetRatio: 98 / 1008,
        imgWidthRatio: 0.50,
        hongbaoRatio: 557 / 882,

        hongbaoTextRatio: 90 / 882,
        hongbaoImghRatio: 270 / 882,

        lotteryCount: 0,
        isVoted: false,

        guid0: 0,
        guid1: 0,
        guidSum: {},
        pid: 0,

        init: function () {
            this.resize();
            this.bindBtns(); //绑定事件

            showLoading();
            getResult('api/voteguess/inforoud', {//加载投票信息
                yoi: openid,
                temp: new Date().getTime()
            }, 'callbackVoteguessInfoHandler');
        },

        initInfo: function (data) {//加载投票信息回调
            this.pid = data.pid;
            this.isCanVote = false;


            for (var i = 0; i < data.items.length; i++) {
                data.items[i].st = data.items[i].gst;
                data.items[i].et = data.items[i].get;
            }
            $("#vote-downCount").countDown({timeArr: data.items,
                countDownFn: function (t, time, index) {//每次倒数回调

                    H.vote.lotteryCount = index;
                    H.vote.isCanVote = false;
                    var pitems = data.items[index].pitems; //每期的两个选手
                    var img0 = pitems[0].im || pitems[0].im2 || pitems[0].im3;
                    var img1 = pitems[1].im || pitems[1].im2 || pitems[1].im3;
                    $('#item_0 img').attr('src', img0); //每组图片
                    $('#item_1 img').attr('src', img1); //每组图片

                    $('.name-0').text(pitems[0].na); //标题
                    $('.name-1').text(pitems[1].na); //标题

                    var play0 = pitems[0].pid; //选手id
                    var play1 = pitems[1].pid; //选手id
                    H.vote.playtemp0 = play0 + H.vote.lotteryCount; //选手id
                    H.vote.playtemp1 = play1 + H.vote.lotteryCount; //选手id

                    $('.img-item').removeClass('selected');
                    $('.img-item').find('.click-tips').removeClass('none').text('支持');
                    //   $(".vote-wrapper").addClass("none");
                    if ($('#luck').hasClass("none")) {
                        $("#vote-tips").addClass("none");
                        $("#voted-tips").removeClass("none").html("离投票开始还有：" + time);
                    } else {
                        $("#voted-tips").addClass("none");
                    }

                }, atTimeFn: function (t, index, startTime, o, nowTime) {//在时间断内的回调函数 index 是倒到哪个时间断

                    H.vote.lotteryCount = index;
                    H.vote.isCanVote = true;
                    var pitems = data.items[index].pitems; //每期的两个选手
                    var play0 = H.vote.play0 = pitems[0].pid; //选手id
                    var play1 = H.vote.play1 = pitems[1].pid; //选手id
                    H.vote.guid = data.items[index].guid; //变成每回合id
                    var img0 = pitems[0].im || pitems[0].im2 || pitems[0].im3;
                    var img1 = pitems[1].im || pitems[1].im2 || pitems[1].im3;

                    $('#item_0 img').attr('src', img0); //每组图片
                    $('#item_1 img').attr('src', img1); //每组图片



                    H.vote.playtemp0 = play0 + H.vote.lotteryCount; //选手id
                    H.vote.playtemp1 = play1 + H.vote.lotteryCount; //选手id

                    $('#item_0').attr('play', play0); //点击的大项
                    $('#item_1').attr('play', play1); //点击的大项
                    $('#bar_0').attr('play', play0); //下面的百分比条
                    $('#bar_1').attr('play', play1); //下面的百分比条

                    $('.name-0').text(pitems[0].na); //标题
                    $('.name-1').text(pitems[1].na); //标题

                    if (!$.fn.cookie(H.vote.playtemp0) && !$.fn.cookie(H.vote.playtemp1)) {//如果两个没有选中过
                        H.vote.isVoted = false; //没有投票
                        $("#voted-tips").addClass("none")
                    } else {
                        H.vote.isVoted = true; //已经投票
                        if ($.fn.cookie(H.vote.playtemp1)) {//记录已经投票的id
                            H.vote.selectedPlay = play1;
                        } else {
                            H.vote.selectedPlay = play0;
                        }
                        H.vote.voteSuccess();
                    }

                    var guid = $.fn.cookie(mpappid + '_lastLotteryPid'); ;
                    if (guid == H.vote.guid) {
                        // 已经抽奖了
                        $('#voted-tips').removeClass('none');
                    } else {
                        if (H.vote.isVoted) {
                            // 已经投票但未抽奖
                            $('#luck').removeClass('none');
                        } else {
                            $('#vote-tips').removeClass('none');
                        }
                    }

                    if (H.vote.isVoted) {
                        if (startTime) {//还有下轮
                            if ($('#luck').hasClass("none")) {
                                $("#voted-tips").removeClass("none").html("离投票开始还有：" + o.showTime(startTime - nowTime));
                            }
                        } else {
                            if ($('#luck').hasClass("none")) {
                                $("#voted-tips").removeClass("none").html("本期已经结束");
                            }
                        }
                    }


                },
                endFn: function (t, index) {//整个倒计时结束的回调

                    H.vote.endMsg = "本期已经结束";
                    $("#voted-tips").removeClass("none").html("本期已经结束");
                    $(".vote-wrapper").removeClass("none");
                    $('#luck').addClass('none');
                    $("#vote-tips").addClass("none");


                    var pitems = data.items[index].pitems; //每期的两个选手
                    var img0 = pitems[0].im || pitems[0].im2 || pitems[0].im3;
                    var img1 = pitems[1].im || pitems[1].im2 || pitems[1].im3;
                    $('#item_0 img').attr('src', img0); //每组图片
                    $('#item_1 img').attr('src', img1); //每组图片
                    $('.name-0').text(pitems[0].na); //标题
                    $('.name-1').text(pitems[1].na); //标题
                    //                    var play0 = pitems[0].pid; //选手id
                    //                    var play1 = pitems[1].pid; //选手id
                    //                    $('#item_0').attr('play', play0); //点击的大项
                    //                    $('#item_1').attr('play', play1); //点击的大项
                    //                    if ($.fn.cookie(play0 + index)) {
                    //                        $('.img-item[play="' + (play0) + '"]').addClass('selected');
                    //                        $('.img-item[play="' + (play0) + '"]').find('.click-tips').removeClass('none').text('支持');
                    //                    } else {
                    //                        $('.img-item[play="' + (play1) + '"]').addClass('selected');
                    //                        $('.img-item[play="' + (play1) + '"]').find('.click-tips').removeClass('none').text('支持');
                    //                    }
                    getResult('api/voteguess/getplayersp/' + H.vote.pid + "?temp=" + new Date().getTime(), {}, 'callbackVoteguessAllSupportPlayerHandler'); //updateBars

                }
            });
            $('.img-item').unbind("click").click(function () {

                if (H.vote.endMsg) {
                    alert(H.vote.endMsg);
                    return false;
                }
                if (H.vote.isCanVote == false) {
                    alert('还没有到投票时间哦');
                    return false;
                }


                if (H.vote.isVoted) {
                    alert('您已经投过票了');
                    return false;
                }
                var play = $(this).attr('play');
                H.vote.selectedPlay = play;
                getResult('api/voteguess/guessplayer', {
                    yoi: openid,
                    guid: H.vote.guid,
                    pluids: play,
                    temp: new Date().getTime()
                }, 'callbackVoteguessGuessHandler');

            });
        },
        voteSuccess: function (data) {//投票成功

            $('#vote-tips').addClass('none'); //未投票提示
            $('#voted-tips').addClass('none'); //已投票提示

            $('.click-tips').addClass('none'); //投票的图片
            $('.img-item[play="' + H.vote.selectedPlay + '"]').addClass('selected');
            $('.img-item[play="' + H.vote.selectedPlay + '"]').find('.click-tips').removeClass('none').text('支持');

            $('.vote-wrapper').removeClass('none');
            if (H.vote.guid != H.vote.lastguid) {

                getResult('api/voteguess/getplayersp/' + this.pid + "?temp=" + new Date().getTime(), {}, 'callbackVoteguessAllSupportPlayerHandler'); //updateBars
                H.vote.lastguid = H.vote.guid;
            }


        },
        updateBars: function (data) {

            var items = data.items;
            var total = 0;
            for (var i = 0, len = items.length; i < len; i++) {
                total += items[i].cunt;
            }
            $('#bar_0').css('width', 100 * items[0].cunt / total + '%');
            $('#bar_1').css('width', 100 * items[1].cunt / total + '%');
        },
        bindBtns: function () {
            $('#luck').click(function () {
                showLoading();
                getResult('api/lottery/luck4Vote', {
                    oi: openid
                }, 'callbackLotteryLuck4VoteHandler');
            });

            $('#hongbao_submit').click(function () {
                var name = $.trim($('#name').val());
                var tel = $.trim($('#tel').val());
                var add = $.trim($('#add').val());
                getResult('api/lottery/award', {
                    oi: openid,
                    nn: encodeURIComponent(nickname),
                    hi: headimgurl,
                    ph: tel,
                    ad: encodeURIComponent(add),
                    rn: encodeURIComponent(name)
                }, 'callbackLotteryAwardHandler');

            });

            $('#hongbao_ok').click(function () {
                var name = $.trim($('#name').val());
                var tel = $.trim($('#tel').val());
                var add = $.trim($('#add').val());

                if (!tel) {
                    alert("手机号码不能为空");
                    return;
                } else if (!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(tel)) {
                    alert('这个手机号可打不通...');
                    return;
                }

                if (name.length <= 0) {
                    alert('请填写姓名');
                    return;
                }

                if (add.length <= 0) {
                    alert('请填写收货地址');
                    return;
                }

                $('#name_confirm').text('联系人：' + name);
                $('#tel_confirm').text('联系号码：' + tel);
                $('#add_confirm').text('收货地址：' + add);
                $('#ticket').addClass('none');
                $('#ticket_confirm').removeClass('none');

            });

            $('#success_ok').click(function () {
                $('#success').addClass('none');
            });

            $('.hongbao-close').click(function () {
                $(this).parent().parent().addClass('none');
            });

            $('#hongbao_back').click(function () {
                $('#ticket_confirm').addClass('none');
                $('#ticket').removeClass('none');
            });

            $('#fail_back').click(function () {
                $('#ticket_fail').addClass('none');
            });
        },
        luckAward: function (data) {
            this.$win[0].play();
            $('#luck').addClass('none');
            $('#vote-tips').addClass('none');
            $('#voted-tips').removeClass('none');

            $('#ticket .hongbao-title p').text('恭喜您，获得' + data.pn + data.pt + data.pu);
            $('.hongbao-ticket img').attr('src', data.pi);
            $('#name').val(data.rn ? data.rn : '');
            $('#tel').val(data.ph ? data.ph : '');
            $('#add').val(data.ad ? data.ad : '');
            $('#ticket').removeClass('none');
        },
        awardSuccess: function () {
            alert('领取成功！');
            $('.hongbao-wrapper').addClass('none');
        },

        resize: function () {
            var width = $(window).width();
            var height = $(window).height();

            $('.main').css({
                'height': height,
                'background-size': width + 'px ' + height + 'px'
            });

            $('.img-wrapper').css({
                'height': height * 0.55
            });

            $('.vote-wrapper').css({
                'height': height * 0.20
            });

            $('.btn-wrapper').css({
                'height': height * 0.25
            }).removeClass('none');

            var imgHeight = this.imgWidthRatio * width / this.imgRatio;
            $('#item_0').css({
                'left': this.leftOffsetRatio * width,
                'top': this.topOffsetRatio * height
            });

            $('#item_1').css({
                'right': this.leftOffsetRatio * width,
                'top': imgHeight + this.topOffsetRatio * height
            });

            var hongbaoHeight = width * 0.9 / this.hongbaoRatio;
            if (hongbaoHeight > height) {
                hongbaoHeight = height;
            }
            $('.hongbao').css({
                'height': hongbaoHeight,
                'top': (height - hongbaoHeight) / 2
            });

            $('.hongbao-title').css({
                'padding-top': hongbaoHeight * this.hongbaoTextRatio
            });

            $('.hongbao-ticket').css({
                'padding-top': hongbaoHeight * this.hongbaoImghRatio
            });
        }
    };

    W.callbackVoteguessInfoHandler = function (data) {
        hideLoading();
        if (data.code == 0) {
            H.vote.initInfo(data);
        } else {
            alert('网络错误，请刷新重试');
        }
    };

    W.callbackVoteguessGuessHandler = function (data) {

        hideLoading();
        if (data.code == 0) {
            alert('投票成功！');
            $('#luck').removeClass('none');
            H.vote.isVoted = true;
            $.fn.cookie(H.vote.selectedPlay + H.vote.lotteryCount, "true", expires_lottery); //保存已经投票的变量
            H.vote.voteSuccess(data);
        } else {
            alert(data.message);
        }
    };

    W.callbackVoteguessAllSupportPlayerHandler = function (data) {

        if (data.code == 0) {
            H.vote.updateBars(data);
        } else {
            // FIXME 未拉取数据提醒
        }
    };

    W.callbackLotteryLuck4VoteHandler = function (data) {
        hideLoading();
        $.fn.cookie(mpappid + '_lastLotteryPid', H.vote.guid);
        if (data.result) {
            H.vote.luckAward(data);
        } else {
            $('#ticket_fail').removeClass('none');
            $('#luck').addClass('none');
            $('#vote-tips').addClass('none');
            $('#voted-tips').removeClass('none');
        }
    };

    W.callbackLotteryAwardHandler = function (data) {
        hideLoading()
        if (data.result) {
            H.vote.awardSuccess();
        } else {

        }
    };

    H.vote.init();
    H.vote.down_count = function (obj) {//倒计时
        var p = $.extend({
            itemObj: "", //倒计时显示的元素
            activity: [], //活动的时间段
            cTime: this.systemTime, //当前时间
            eachShowFn: null, //每次倒计时回调
            canLotteryFn: null, //当前时间落在抽奖时间的回调
            endFn: null//结束事件 
        }, obj || {});

        var that = this;
        var wTime = 500;
        var cTime = p.cTime;
        window.t_count = 0;
        var showTime = function (rT, showTpl) {
            var s_ = Math.round((rT % 60000) / wTime);
            s_ = dateNum(Math.min(Math.floor(s_ / 1000 * wTime), 59));
            var m_ = dateNum(Math.floor((rT % 3600000) / 60000));
            var h_ = dateNum(Math.floor((rT % 86400000) / 3600000));
            var d_ = dateNum(Math.floor(rT / 86400000));
            p.itemObj.text(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
        };
        var runTime = function () {
            try {
                cTime += wTime;
                if (!p.activity[t_count]) {
                    if (window.progressTimeInterval) {
                        clearInterval(window.progressTimeInterval);
                    }
                    return;
                }
                var sorgT = parseInt(timestamp(p.activity[t_count].pd + " " + p.activity[t_count].st));
                var eorgT = parseInt(timestamp(p.activity[t_count].pd + " " + p.activity[t_count].et));
                var sT = isNaN(sorgT) ? 0 : sorgT - cTime;
                var eT = isNaN(eorgT) ? 0 : eorgT - cTime;

                if (sT > 0) {// 即将开始
                    showTime(sT, "%H%:%M%:%S%");
                    if (p.eachShowFn) {
                        p.eachShowFn(p.itemObj.text());
                    }
                } else if (eT > 0) {//显示，可以进行抽奖
                    if (p.canLotteryFn) {

                        p.canLotteryFn(p.activity[t_count]);
                    }
                } else {// 结束
                    t_count++;
                    if (t_count > p.activity.length) {
                        if (p.endFn) {
                            p.endFn();
                        }
                        if (window.progressTimeInterval) {
                            clearInterval(window.progressTimeInterval);
                        }
                    }
                }
            }
            catch (e) {
                if (window.progressTimeInterval) {
                    clearInterval(window.progressTimeInterval);
                }
            }
        }
        runTime();
        window.progressTimeInterval = setInterval(function () {
            runTime();
        }, wTime);
    };




})(Zepto);