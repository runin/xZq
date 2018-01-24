(function(){
    H.record = {
        type: getQueryString('type'),
        page: 1,
        pageSize: 5,
        time: 0,
        loadmore:  true,
        init: function(){
            this.event();
            this.getSleftList();
        },
        event: function(){
            var me = H.record;
            $('.go').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                if(me.type == "yao"){
                    toUrl('yao.html');
                }else{
                    toUrl('ad.html');
                }

            });

            var range = 180, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;

            $(window).scroll(function(){
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if (($(document).height() - range) <= totalheight  && me.page < maxpage && me.loadmore) {
                    me.getSleftList();
                }
            });
        },
        //查询个人中奖记录
        getSleftList: function(){
            var me = H.record;
            getResult('api/lottery/record', {
                oi: openid,
                pn: me.page,
                ps : me.pageSize
            }, 'callbackLotteryRecordHandler', true);
            me.page ++;
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };
    W.callbackLotteryRecordHandler = function(data){
        var me = H.record;
        if(data.result){
            var $ul = $('ul'),
                t = simpleTpl(),
                len = data.rl.length,
                lt = '',
                isShow = '';
            if (len < me.pageSize) {
                me.loadmore = false;
            }
            $.each(data.rl, function(i,item){
                lt = item.lt.split(" ")[0];
                lt = lt.slice(5).replace('-','月') + "日";
                console.log(lt);
                //isShow = item.cc ? '': 'none';
                isShow = 'none';
                t._('<li>')
                    ._('<div class="left">')
                        ._('<h2>'+ lt +'</h2>')
                        ._('<img src="images/icon-gift.png">')
                    ._('</div>')
                    ._('<div class="right">')
                        ._('<h2>奖品名：'+ item.pn || '' +'</h2>')
                        ._('<h2 class="'+ isShow +'">兑换码：'+ item.cc || '</h2>')
                    ._('</div>')
                    ._('</li>');
            });
            $ul.append(t.toString());
        }else{
            me.loadmore = false;
            if(me.time == 0){
                $('.tips').removeClass('none');
            }
        }
        me.time ++;
    }
})(Zepto);
$(function(){
    H.record.init();
});
