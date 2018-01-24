(function($) {
    H.index = {
        from: getQueryString('from'),
        $from: $('.from'),
        $btnRule: $('#btn-rule'),
        $btnJoin: $('#btn-join'),
        $btnChat: $('#btn-chat'),
        $btnReserve: $('#btn-reserve'),
        init: function() {
            var me = this;
            if(me.from){
                me.$from.removeClass('none');
            }
            me.event();
            me.resize();
            me.prereserve();
        },
        resize: function(){
            var me = this;
            var win_h = $(window).height();
            $('body').css('height',win_h+'px');
            if(window.screen.height==480){
                $('.rule-section').css({
                    'padding-top': (win_h - 335)/2+'px'
                });
            }else{
                $('.rule-section').css({
                    'padding-top': (win_h - 389)/2+'px'
                });
            }

            me.$from.css({
                'padding-top': (win_h - 335)/2+'px'
            });

            var bg = 'images/index0.jpg';
            shownewLoading(null,'请稍等...');
            imgReady(bg, function() {
                hideLoading();
                $('body').css('background-image', 'url('+ bg +')');
                $('.item-animate').removeClass('none').addClass('animated');
                hidenewLoading();
            });
            $('.ctrls').removeClass('none').addClass('animated');
        },
        rule: function(){
            getResult('api/common/rule', {}, 'commonApiRuleHandler', true);
        },
        // 是否配置了预约节目
        prereserve: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'program/reserve/get',
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackProgramReserveHandler',
                success : function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function(resp){
                        if (resp.errorCode == 0) {
                            me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId);
                        }
                    });
                }
            });
        },

        event: function() {
            var me = this,
                $rule_section = $('.rule-section'),
                $btn_close = $(".btn-close");
            this.$btnRule.click(function(e) {
                e.preventDefault();
                me.rule();
            });
            $(".rule-close").click(function(e){
                e.preventDefault();
                $rule_section.addClass('none');
            });
            $("#btn-baby").click(function(e){
                e.preventDefault();
                toUrl('babyvote.html');
            });
            $btn_close.click(function(e){
                e.preventDefault();
                me.$from.addClass('none');
            });
            $(".btn-try").click(function(e){
                e.preventDefault();
                $btn_close.trigger('click');
            });

            this.$btnReserve.click(function(e) {
                e.preventDefault();

                var reserveId = $(this).attr('data-reserveid');
                if (!reserveId) {
                    return;
                }
                shaketv.reserve(yao_tv_id, reserveId, function(data){

                });
            });

            if (openid) {
                this.$btnJoin.attr('href', 'vote.html');
                this.$btnChat.attr('href', 'comments.html');
            }
        }

    };

    W.commonApiRuleHandler = function(data) {
        if (data.code == 0) {
            $('.con-htm').html(data.rule);
            $('.rule-section').removeClass('none');
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});