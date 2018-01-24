/**
 * 萌宝-抽奖
 */
(function($) {

    H.lottery = {

        request_cls: 'requesting',

        init : function(){
            var me = this;
            me.event_handler();
            $.get("data.ss", lotteryCallback, "json");
        },
        lottery: function(data) {
            var $lottery = $('#lottery-container'),
                $lottery_rlt = $('#lottery-result');

            var lottery = new Lottery($lottery.get(0), 'images/paint.jpg', 'image', $(window).width(), $(window).height(), function() {
                $lottery.addClass('none');
                $lottery_rlt.removeClass('none');
            });
            lottery.init(data.piu, 'image');
        },
        event_handler: function() {
            var me = this,
                $mobile = $('#s-mobile'),
                $name = $('#s-name'),
                $btn_sign = $('#btn-sign');

            $btn_sign.click(function(e) {
                e.preventDefault();

                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                var mobile = $.trim($mobile.val()),
                    name = $.trim($name.val());

                if (!name) {
                    alert('请先输入姓名');
                    $name.focus();
                    $(this).removeClass(me.request_cls);
                    return false;
                }
                if (!mobile || !/^\d{11}$/.test(mobile)) {
                    alert('请先输入正确的手机号');
                    $mobile.focus();
                    $(this).removeClass(me.request_cls);
                    return false;
                }

                $('.mobile').val(mobile);
                $(this).addClass(me.request_cls);

                $.get("data.ss", entityLotteryCallback, "json");
            });
        }
    }

    W.lotteryCallback = function(data){
        if(data.code == 0){
            var $entity_item = $('#entity-item'),
                $without_item = $('#without-item');

            H.lottery.lottery(data);

            if(data.pt == 1){//中奖
                $entity_item.removeClass('none').find('img').attr('src',data.entyImg);

            }else if(data.pt == 2){//未中奖
                $without_item.removeClass('none').find('img').attr('src',data.entyImg);
            }
        }
    }

    W.entityLotteryCallback = function(data){
        if(data.code == 0){

            $('.lottery-item').addClass('none');
            $('#award-item').removeClass('none').find('img').attr('src',data.entyImg);
            $('#award-info').html('<p>姓名：'+ data.pn +'</p><p> 电话：'+ data.ph);
        }
    }

})(Zepto);

H.lottery.init();