(function($){
    H.record = {
        page: 1,
        pageSize: 20,
        beforePage: 0,
        loadmore: true,
        firstLoad: true,
        rankOpen: false,
        request_cls: 'requesting',
        init: function(){
            this.event();
            this.scrollEvent();
            this.getRecord();
            this.getRank(this.page);
        },
        event: function(){
            var me = this;
            $('#btn-go2index').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                $(this).addClass(me.request_cls);
                toUrl('jfbk.html');
            });
            $('#btn-record').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('active')) {
                    return;
                }
                $('.tab-box a').removeClass('active');
                $(this).addClass('active');
                me.rankOpen = false;
                $('.content-record').removeClass('none');
                $('.content-rank').addClass('none');
            });
            $('#btn-rank').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('active')) {
                    return;
                }
                $('.tab-box a').removeClass('active');
                $(this).addClass('active');
                me.rankOpen = true;
                $('.content-record').addClass('none');
                $('.content-rank').removeClass('none');
            });
        },
        scrollEvent: function() {
            var me = this, range = 10, maxpage = 100, totalheight = 0, fixedStep = 100;
            $(window).scroll(function(){
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos) - fixedStep;
                if (me.rankOpen && ($(document).height() - range - fixedStep) <= totalheight && me.page < maxpage && me.loadmore) {
                    if ($('#spinner').length > 0) {
                        return;
                    };
                    me.getRank(me.page);
                }
            });
        },
        getRecord: function() {
            getResult('api/lottery/record', {oi: openid}, 'callbackUserPrizeHandler', true);
        },
        getRank: function(page) {
            if(page - 1 == this.beforePage) {
                getResult('api/lottery/allrecord', {pn: this.page, ps: this.pageSize}, 'callbackLotteryAllRecordHandler', true);
            }
        },
        fillRecord: function(data) {
            var t = simpleTpl(), items = data.rl || [], len = items.length;
            for (var i = 0; i < len; i ++) {
                t._('<li>')
                    ._('<div class="gift-icon"></div>')
                    ._('<div class="gift-time">' + items[i].lt.split(" ")[0] + '</div>')
                    ._('<div class="gift-content">')
                        ._('<p class="gift-name">您在老三热线节目中赢得' + items[i].pn + '</p>')
                        if(items[i].rl){
                        t._('<p class="gift-check"><a href="'+ items[i].rl +'">查看</a></p>')
                        }
                        if (items[i].aw) {
                            t._('<p class="gift-type">领奖方式: ' + items[i].aw + '</p>')
                        }
                        if (items[i].aa) {
                            t._('<p class="gift-addr">领奖地址: ' + items[i].aa + '</p>')
                        }
                        if (items[i].al) {
                            t._('<p class="gift-phone">咨询电话: ' + items[i].al + '</p>')
                        }
                    t._('</div>')
                ._('</li>')
            };
            $('.content-record ul').append(t.toString());
        },
        fillRank: function(data) {
            var me = this, t = simpleTpl(), items = data.rl || [], len = items.length;
            for (var i = 0; i < len; i ++) {
                t._('<li>')
                  ._('<section>')
                    ._('<img src="' + (items[i].hi || './images/avatar.png') + '">')
                    ._('<p>' + (items[i].un || '匿名用户') + '</p>')
                  ._('</section>')
                  ._('<section><p>' + (items[i].pn || '') + '</p></section>')
                ._('</li>')
            };
            $('.content-rank ul').append(t.toString());
            if(me.firstLoad) {
                me.firstLoad = false;
            }
        },

        getNextPn: function(page) {
            var me = this;
            if((page - 1)  == me.nowPn){
                if (me.nextTrue) {
                    me.nextTrue = false;
                    getResult('api/lottery/allrecord', {pn: me.pn, ps: me.ps}, 'callbackLotteryAllRecordHandler', true);
                };
            };
        }
    };

    W.callbackLotteryRecordHandler = function(data) {
        if (data.result) {
            H.record.fillRecord(data);
        } else {
            $(".content-record").empty().append('<p class="empty">亲，您还没有中奖哦~<br>继续加油</p>');
            return;
        }
    };

    W.callbackLotteryAllRecordHandler = function(data) {
        if (data.result) {
            if (data.rl.length < H.record.pageSize) {
                H.record.loadmore = false;
            } else if (data.rl.length == H.record.pageSize) {
                if(H.record.page == 1){
                    H.record.beforePage = 1;
                    H.record.page = 2;
                }else{
                    H.record.beforePage = H.record.page;
                    H.record.page++;
                }
                H.record.loadmore = true;
            }
            H.record.fillRank(data);
        } else {
            if (H.record.page == 1) {
                $(".content-rank").empty().append('<p class="empty">积极参与互动<br>您的大名就会出现在这里</p>');
            }
            H.record.loadmore = false;
        }
    };
})(Zepto);

$(function(){
    H.record.init();
});