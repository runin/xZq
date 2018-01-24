/**
 * 加油好少年-抽奖
 */
(function($) {
    H.lottery = {
        ruuid : 0,
        redpack : '',
        $rule_close: $('.rule-close'),
        $thank: $('#thank'),
        puid: getQueryString('puid'),
        init : function(){
            $("#img_lottery_bg").attr("src", lottery_bg);
            this.event();
        },
        event: function() {
            var me = this;
            $("#btn-lottery").click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('disabled')) {
                    return;
                }
                $(this).addClass('disabled');
                if(openid){
                    H.lottery.drawlottery();
                }
            });

            $('#confirm').click(function(e) {
                e.preventDefault();
                if($(this).hasClass('.loading-btn')){
                    return;
                }
                $(this).addClass('loading-btn');
                showLoading();
                setTimeout(function(){
                    location.href = me.redpack;
                }, 500);
            });

            this.$rule_close.click(function(e){
                e.preventDefault();
                showLoading();
                setTimeout(function(){
                    location.href = 'vote.html';
                }, 500);
            });

        },
        drawlottery:function(){
            getResult('vote/lottery', {
                openid: openid,
                actUid: this.puid,
                attrUuid:  $.fn.cookie("attrUuid-"+ openid)
            }, 'lotteryHandler', true);
        },
        isShow : function($target, isShow){
            var $target = $('.' + $target);
            $target.removeClass('none');
            isShow ? $target.show() : $target.hide();
        },
        fill : function(data){
            this.redpack = data.redpack;
            /*this.redpack = 'vote.html';*/
            //pt=4 为红包奖品类型
            //pt=1 为普通奖品类型
            //pt=2 为谢谢参与类型
            if(data.pt == 1 || data.pt == 4){
                $(".award h1").html(data.ltp);
                $(".award img").attr('src', data.piu);
                $(".box").addClass("none");
                $(".award").removeClass("none");
            }else if(data.pt == 2){
                H.lottery.isShow('thank', true);
            }
        },
        lottery_point : function(data){
            // 奖项列表
            awards = data.luckyWheel;
            // 初始化大转盘
            var lw = new luckWheel(
                {
                    items : awards,
                    // 回调函数
                    callback : function() {
                        H.lottery.fill(data);
                    }
                });

            lw.run(awards[data.prizeIndex]);
        }
    };

    W.luckWheel = function(opt) {
        var _opt = {
            // 奖项列表
            items : [],
            // 时间长度
            duration : 7500,
            // 重复转圈次数
            repeat : 2,
            // 回调函数
            callback : function() {
            }
        };

        for ( var key in _opt) {
            this[key] = opt[key] || _opt[key];
        }

        this.run = function(v) {
            var bingos = [], index, me = this;
            for ( var i = 0, len = this.items.length; i < len; i++) {
                if (this.items[i] == v) {
                    bingos.push(i);
                }
            }

            index = bingos[(new Date()).getTime() % bingos.length];
            var amount = 360 / len, fix = amount / 5, low = index * amount + fix, top = (index + 1)
                * amount - fix, range = top - low, turnTo = low
                + (new Date()).getTime() % range;

            $("#btn-lottery").rotate({
                angle : 0,
                animateTo : turnTo + this.repeat * 360,
                duration : this.duration,
                callback : function() {
                    me.callback(index);
                }
            });
        };
    };

    W.lotteryHandler = function(data) {
        if (data.code == 0) {
             H.lottery.lottery_point(data);
        } else {
            H.lottery.isShow('thank', true);
        }
    };
})(Zepto);

$(function() {
    H.lottery.init();
});
