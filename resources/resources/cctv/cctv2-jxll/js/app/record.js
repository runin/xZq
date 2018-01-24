(function($){
    H.record = {
        page: 1,
        pageSize:6,
        beforePage: 0,
        loadmore: true,
        firstLoad: true,
        jumpFrom: getQueryString('jumpFrom'),
        init: function(){
            this.event();
            this.getRecord(this.page);
            $.fn.cookie('jumpNum', 0, {expires: -1});
        },
        event: function(){
            var me = this, range = 10, maxpage = 100, totalheight = 0, fixedStep = 100;
            $(window).scroll(function(){
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos) - fixedStep;
                if (($(document).height() - range - fixedStep) <= totalheight && H.record.page < maxpage && H.record.loadmore) {
                    if ($('#spinner').length > 0) {
                        return;
                    };
                    H.record.getRecord(H.record.page);
                }
                if (($(document).height() - range - fixedStep) <= totalheight) {
                    $('footer').css({'background':'rgba(0,0,0,0)'});
                } else {
                    $('footer').css({'background':'rgba(0,0,0,.3)'});
                }
            });
            $('#btn-go2vote').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) {
                    return;
                }
                $(this).addClass('requesting');
                if (me.jumpFrom == 'over') {
                    toUrl('over.html?jumpFrom=over');
                } else if (me.jumpFrom == 'vote') {
                    toUrl('vote.html?jumpFrom=vote');
                } else {
                    toUrl('vote.html');
                }
            });
        },
        getRecord: function(page) {
            var me = this, bd = ed = timeTransform(new Date().getTime()).split(" ")[0];
            shownewLoading();
            if(page - 1 == me.beforePage){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/lottery/allrecord' + dev,
                    data: { pn: me.page, ps: me.pageSize, bd: bd, ed: ed, ol: 1 },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackLotteryAllRecordHandler',
                    timeout: 15000,
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        if (data.result) {
                            if (data.rl.length < me.pageSize) {
                                me.loadmore = false;
                            } else if(data.rl.length == me.pageSize){
                                if(me.page == 1){
                                    me.beforePage = 1;
                                    me.page = 2;
                                }else{
                                    me.beforePage = me.page;
                                    me.page++;
                                }
                                me.loadmore = true;
                            }
                            me.fillRecord(data);
                            $('body').removeClass('over');
                        } else {
                            if (me.page == 1) {
                                $(".content").empty();
                                $('body').addClass('over');
                            }
                            me.loadmore = false;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                        me.loadmore = false;
                        if (me.beforePage == 0) {
                            me.fillSaferecord(20);
                        }
                        hidenewLoading();
                    }
                });
            }
        },
        fillRecord: function(data) {
            var t = simpleTpl(), items = data.rl || [], len = items.length;
            for (var i = 0; i < len; i ++) {
                t._('<li>')
                    ._('<div class="award-box"><img class="img-award" src="' + (items[i].qc || '') + '"></div>')
                    ._('<div class="info-box">')
                        ._('<div class="img-avatar">')
                            ._('<img src="' + (items[i].hi || './images/avatar-default.png') + '">')
                        ._('</div>')
                        ._('<div class="info-award">')
                            ._('<label class="nn">' + (items[i].un || '匿名用户') + '</label>')
                            ._('<span>拿走了</span>')
                            ._('<label class="pn">' + items[i].pn + '</label>')
                        ._('</div>')
                    ._('</div>')
                ._('</li>')
            };
            $('.content ul').append(t.toString());
            if(H.record.firstLoad) {
                H.record.firstLoad = false;
            }
        },
        fillSaferecord: function(len) {
            var me = this, t = simpleTpl(), items = allrecord.rl || [], recordRandom = getRandomArbitrary(0,30);
            for (var i = recordRandom; i < recordRandom + len; i++) {
                t._('<li>')
                    ._('<div class="award-box"><img class="img-award" src="' + (items[i].qc || '') + '"></div>')
                    ._('<div class="info-box">')
                        ._('<div class="img-avatar">')
                            ._('<img src="' + (items[i].hi || './images/avatar-default.png') + '">')
                        ._('</div>')
                        ._('<div class="info-award">')
                            ._('<label class="nn">' + (items[i].un || '匿名用户') + '</label>')
                            ._('<span>拿走了</span>')
                            ._('<label class="pn">' + items[i].pn + '</label>')
                        ._('</div>')
                    ._('</div>')
                ._('</li>')
            };
            $('.content ul').append(t.toString());
        }
    };
})(Zepto);

$(function(){
    H.record.init();
});