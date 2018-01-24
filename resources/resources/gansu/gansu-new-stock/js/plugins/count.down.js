/**
 * Created by xzq2 on 2015/7/15.
 */
(function ($) {
    W.question = null;
    $.fn.countdown = function (options) {
        $.fn.countdown.defaultVal = {
            start: 'start',// 存放开始时间 yyyy-mm-dd hh:mm:ss
            end: 'end', // 存放结束时间 yyyy-mm-dd hh:mm:ss
            offset: 'offset', // (客户端时间-服务器时间)时间差的毫秒数
            wTime: 500,// 以500毫秒为单位递增
            stpl: '%H%:%M%:%S%', // 还有...开始
            questions: [],//问答题数据
            index: 0,//问答数组的index
            callback: function () {
            }//回调函数
        };
        var opts = $.extend({}, $.fn.countdown.defaultVal, options),
            state = 3,
            those = $(this),
            serverTime = new Date().getTime() - opts.offset;

        var initTime = function (index) {
            index = index || 0;
            if (opts.questions && opts.questions.length > index) {
                W.question = opts.questions[index];
                opts.start = W.question.qst;
                opts.end = W.question.qet;
                runTime();
                if (index == 0) {
                    setInterval(function () {
                        runTime(opts.wTime);
                    }, opts.wTime);
                }
            }
            else {
                //已经结束
                opts.callback && opts.callback(state);
            }
        }

        var runTime = function (time) {
            serverTime += (time || 0);  // 服务器时间
            those.each(function () {
                //debugger;
                var that = $(this),
                    startTime = timestamp(opts.start),
                    endTime = timestamp(opts.end),
                    sT = isNaN(startTime) ? 0 : startTime - serverTime,
                    eT = isNaN(endTime) ? 0 : endTime - serverTime;

                var showTime = function (rT, showTpl) {
                    var s_ = Math.round((rT % 60000) / opts.wTime);
                    s_ = dateNum(Math.min(Math.floor(s_ / 1000 * opts.wTime), 59));
                    var m_ = dateNum(Math.floor((rT % 3600000) / 60000));
                    var h_ = dateNum(Math.floor((rT % 86400000) / 3600000));
                    var d_ = dateNum(Math.floor(rT / 86400000));
                    that.html(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
                };

                var dateNum = function (num) {
                    return num < 10 ? '0' + num : num;
                };

                if (sT > 0) {
                    // 还未开始
                    state = 1;
                    showTime(sT, opts.stpl);
                } else if (eT > 0) {
                    // 正在答题
                    state = 2;
                } else {
                    if (opts.questions.length - opts.index > 1) {
                        opts.index++;
                        initTime(opts.index);
                    } else {
                        // 已结束
                        state = 3;
                    }
                }
                opts.callback && opts.callback(state, opts.index);
            });
        };

        initTime();
    };
})(Zepto);
                        