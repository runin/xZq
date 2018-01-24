(function($) {
    H.sign = {
        dec: 0,
        signList: [],
        signListFlag: 0,
        nowSignFlag: null,
        nowTime: timeTransform(new Date().getTime()),
        init: function() {
            this.event();
            this.signRoundPort();
        },
        signRoundPort: function() {
            getResult('api/sign/round', {
                page: 1,
                pageSize: 50
            }, 'callbackSignRoundHandler');
        },
        signMycountPort: function(uuid) {
            if (!uuid) return;
            getResult('api/sign/mycount', {
                yoi: openid,
                puid: uuid
            }, 'callbackSignMyRecordCountHandler');
        },
        signIssignPort: function(auid) {
            if (!auid) return;
            getResult('api/sign/issign', {
                yoi: openid,
                auid: auid
            }, 'callbackSignIsHandler');
        },
        signSignedPort: function(auid) {
            if (!auid) return;
            getResult('api/sign/signed', {
                yoi: openid,
                auid: auid,
                wxnn: nickname ? nickname : "匿名用户",
                wxurl: headimgurl ? headimgurl : ""
            }, 'callbackSignSignedHandler');
        },
        event: function() {
            var me = this;
            $('body').delegate('.sign-wrapper a', 'click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('sign-x')) {
                    showTips('签到未开始');
                    return;
                }
                if ($(this).hasClass('sign-off')) {
                    showTips('签到已过期');
                    return;
                }
                if ($(this).hasClass('active')) {
                    showTips('今日已签到');
                    return;
                }
                me.nowSignFlag = $(this).attr('data-uid');
                me.signSignedPort(me.nowSignFlag);
            });

            $('.btn-back').click(function(e) {
                e.preventDefault();
                toUrl('vote.html');
            });
        },
        fillSignRound: function(data) {
            // sign-ed || active ---- 已签到
            // sign-off --- 签到已过期
            // sign-ing --- 可以签到
            // sign-x --- 签到未开始
            var me = this, t = simpleTpl(), items = data.items || [], length = items.length, signStatus;
            this.nowTime = timeTransform(parseInt(data.cud));
            this.dec = new Date().getTime() - parseInt(data.cud);
            this.signMycountPort(data.puid);
            for (var i = length - 1; i >= 0; i--) {
                var nowTimeStr = timeTransform(parseInt(data.cud)), beginTimeStr = items[i].st, endTimeStr = items[i].et;
                if(comptime(nowTimeStr, beginTimeStr) > 0) {
                    // sign-x --- 签到未开始
                    signStatus = 'sign-x';
                } else if (comptime(nowTimeStr, endTimeStr) < 0) {
                    // sign-off --- 签到已过期
                    signStatus = 'sign-off';
                    me.signList.push(items[i].uid);
                } else {
                    // sign-ing --- 可以签到
                    signStatus = 'sign-ing';
                    me.signList.push(items[i].uid);
                }
                t._('<a href="javascript:;" class="' + signStatus + '" data-uid="' + items[i].uid + '" id="sign-' + items[i].uid + '" data-bv="' + items[i].bv + '" data-iv="' + items[i].iv + '">')
                    ._('<i>?</i>')
                    ._('<p>' + items[i].t + '</p>')
                ._('</a>')
            };
            $('.sign-wrapper').html(t.toString());
            me.signIssignPort(me.signList[me.signListFlag]);
        }
    };

    W.callbackSignRoundHandler = function(data) {
        var me = H.sign;
        if (data.code == 0) me.fillSignRound(data);
    };

    W.callbackSignMyRecordCountHandler = function(data) {
        var me = H.sign;
        if (data.code == 0) {
            $('#J_signBox h1').append('<p>本期签到次数：' + data.count + '次</p>');
        }
    };

    W.callbackSignIsHandler = function(data) {
        var me = H.sign;
        if (data.result) {
            $('#sign-' + me.signList[me.signListFlag]).addClass('active');
            if ($('#sign-' + me.signList[me.signListFlag]).prev().hasClass('active')) {
                $('#sign-' + me.signList[me.signListFlag]).find('i').text($('#sign-' + me.signList[me.signListFlag]).attr('data-iv') + '积分');
            } else {
                $('#sign-' + me.signList[me.signListFlag]).find('i').text($('#sign-' + me.signList[me.signListFlag]).attr('data-bv') + '积分');
            }
        }
        if (me.signListFlag < me.signList.length) {
            me.signListFlag++;
            me.signIssignPort(me.signList[me.signListFlag]);
        }
        if (me.signListFlag == me.signList.length) {
            $('.sign-wrapper').animate({'opacity' : '1'}, 1000);
        }
    };

    W.callbackSignSignedHandler = function(data) {
        var me = H.sign;
        if (data.code == 0) {
            $('#sign-' + me.nowSignFlag).addClass('active').find('i').text(data.signVal + '积分');
        }
        showTips(data.message);
    };
})(Zepto);

$(function() {
    H.sign.init();
});