/**
 * 中华好民歌--投票页
 */
(function($) {
    H.vote = {
        $swiper: $('.swiper-wrapper'),
        $count: $('.count'),
        $count_down: $('.count-down'),
        request_cls: 'requesting',
        istrue: true,
        //islottery: true,定时器
        puid: null,//主活动uuid
        attr_uuid: null,//选项uuid（选手uuid）
        vu: null,//活动时间段uuid
        as: null,//积分排行顶部文案
        init: function(){
            this.event();
            this.get_port();
            this.jump();
        },
        get_port: function(){
            getResult('goodsong/index', { openid: openid }, 'songIndexHandler', true);
        },
        jump: function(){
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        event: function(){
            var me = this;
            $('#comments').click(function(e){
                e.preventDefault();
                toUrl("comments.html?as=" + me.as + '&actUid=' + me.puid);
            });
            this.$swiper.delegate('label', 'click', function(e){
                e.preventDefault();
                var me =  $(this);
                attr_uuid = $(this).closest('.swiper-slide').attr('data-au');
                if ($(this).hasClass(me.request_cls)|| $(this).hasClass('btn-disabled')) {
                    return;
                }
                $(this).addClass(me.request_cls).parent().siblings().find('label img').addClass('select');
                showLoading();
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'goodsong/vote',
                    data: {
                        openid: openid,
                        actUuid: me.puid,
                        attrUuid: attr_uuid
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'songVoteHandler',
                    complete: function() {
                        hideLoading();
                    },
                    success : function(data) {
                        if(data.code == 1){
                            return;
                        }else{
                            me.find('i').css('opacity',"1").addClass('zan');
                            setTimeout(function(){
                                $('section.vote').removeClass('none');
                                me.find('i').css('opacity',"0").removeClass('zan');
                            },1500);
                            /*H.vote.islottery = setTimeout(function(){
                                getResult('api/lottery/luck', {
                                    oi: openid,
                                    sau: H.vote.puid
                                }, 'callbackLotteryLuckHandler', true, null);
                            },1000);*/
                        }
                    }
                });
            });
            $('.lottery-btn').click(function(e){
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                $(this).addClass(me.request_cls);
                //clearInterval(H.vote.islottery);
                getResult('api/lottery/luck', {
                    oi: openid,
                    sau: H.vote.puid
                }, 'callbackLotteryLuckHandler', true);
            });
        },
        scrollPaper: function() {
            var mySwiper = new Swiper('.swiper-container',{
                slidesPerView : 4,
                centeredSlides : false
            })
        },
        tpl: function(data, index){
            var me = this, t = simpleTpl(),
                vt = data.vt[index] || [],
                vnSum = 0;
                items = vt.vtr;
            //vf 活动时间段投票表识  不能投票（false）
            //vu 活动时间段uuid
            for(var i = 0,len = items.length; i < len; i++){
                //au 选项uuid
                //ai 选手img的url
                //an 选手姓名
                //vn 选手获得总票数
                //uv 选项投票表识   不能投票（false）
                var vote = (vt.vf && items[i].uv) ? '' : 'btn-disabled',
                    after = (i == 1 || i ==4) ? 'after':'';
                t._('<div class="swiper-slide" data-au="'+ items[i].au +'" data-uv="'+ items[i].uv +'">')
                    ._('<label class="sup '+ vote +' '+ after +'">')
                        ._('<i>+1</i>')
                        ._('<img src="'+ items[i].ai +'" />')
                        ._('<div class="sup-div">')
                            ._('<div>'+ items[i].an +'</div>')
                            ._('<div>')
                                ._('<label class="label-vn">'+ items[i].vn +'<br/>票</label>')
                                ._('<span class="tj"></span>')
                            ._('</div>')
                        ._('</div>')
                    ._('</label>')
                ._('</div>')
                vnSum += items[i].vn;
            }
            me.$swiper.html(t.toString());

            setTimeout(function(){
                for(var i = 0,len = items.length; i < len; i++){
                $('.tj').eq(i).css({
                    "height": (parseFloat(items[i].vn/vnSum)*32 || 0 + 1) +"px"
                });
                }
            },1500);

            this.resize();
            this.scrollPaper();
        },
        count_down: function(count) {
            this.$count.each(function(index) {
                var curr = new Date().getTime(),
                    before = curr - 1 * 60 * 60 * 1000,
                    after = curr + count,
                    stime = '',
                    etime = '';
                switch (index) {
                    case 0:
                        stime = before;
                        etime = after;
                        break;
                    case 1:
                        stime = curr - 60 * 1000;
                        etime = curr;
                        break;
                    case 2:
                        stime = after;
                        etime = after + 60 * 1000;
                        break;
                }
                $(this).attr('data-stime', stime).attr('data-etime', etime);
            });

            this.$count.countdown({
                stpl: '0',
                etpl: '<span class="state2">%M% 分 %S%秒 即可为Ta再次加油！</span>',
                otpl: '',
                callback: function(state) {
                    if(state === 3){
                        if (H.vote.istrue) {
                            H.vote.istrue = false;
                            H.vote.get_port();
                        }
                    }
                }
            });
        },
        fill_count_down: function(data){
            var items = data.vt,
                len = items.length,
                nowTimeStr = data.tm,
                $label = $('.swiper-slide label');

            if(comptime(nowTimeStr,items[0].vb) > 0){
                this.tpl(data, 0);
                this.$count_down.find('i').text('本期活动未开始！');
                this.$count_down.removeClass('visibility');
                $label.addClass('btn-disabled');
                return;
            }
            if(comptime(items[len-1].ve,nowTimeStr) > 0){
                this.tpl(data, len-1);
                this.$count_down.find('i').text('本期活动已结束，请关注下期！');
                this.$count_down.removeClass('visibility');
                $label.addClass('btn-disabled');
                return;
            }

            for(var i = 0; i < len; i++){
                var endTimeStr = items[i].ve,
                    begTimeStr = items[i].vb;
                    vu = items[i].vu;//活动时间段uuid
                    this.tpl(data, i);
                if(items[i].vf){
                    this.$count_down.addClass('visibility');
                    return;
                }else{
                    if(comptime(nowTimeStr, begTimeStr) > 0){
                        $label.addClass('btn-disabled');
                        this.$count_down.removeClass('visibility');
                        this.$count_down.find('i').text('再过');
                        H.vote.istrue = true;
                        clearInterval(window.progressTimeInterval);
                        this.count_down(timestamp(begTimeStr) - timestamp(nowTimeStr));
                        return;
                    }else if(i == len-1){
                        this.$count_down.find('i').text('本期活动已结束，请关注下期！');
                        this.$count_down.removeClass('visibility');
                        $label.addClass('btn-disabled');
                        return;
                    }
                }
            }
        },
        resize: function(){
            var w = $(window).width();

            H.vote.$swiper.css({
                "-webkit-transform": "translateX(-"+ Math.ceil(w/4)+"px)"
            });
        }
    };
    W.callbackLotteryLuckHandler = function(data) {
        $('section.vote').addClass('none');
        H.dialog.lottery.open(data);
    };

    W.songIndexHandler =function(data){
        if(data.code == 0){
            H.vote.as = data.as;
            H.vote.puid = data.actUid;
            H.vote.fill_count_down(data);
        }
    };
    W.commonApiPromotionHandler = function(data){
        if(data.code == 0){
            if(data.url && data.desc){
                $('.outer').text(data.desc).attr('href', data.url).removeClass('none');
            }
        }
    }
})(Zepto);
$(function(){
    H.vote.init();
});