/**
 * 加油好少年--首页.
 */
(function($){
    H.index = {
        $btnRule: $('#btn-rule'),
        $btnReserve: $('#btn-reserve'),
        request_cls: 'requesting',
        from: getQueryString('from'),
        isoperate: false,//首页没有任何操作
        init: function(){
            if(this.from){
                H.dialog.guide.open();
            }
            this.event();
            this.prereserve();
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
        event: function(){
            var me = this;
            setTimeout(function(){
                if(!me.isoperate){
                    new Authorize().init(function(){
                        toUrl('vote.html');
                    });
                }
            },3000);
            this.$btnRule.click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                H.index.isoperate = true;
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                H.dialog.rule.open();
            });
            $('body').click(function(e) {
                e.preventDefault();
                toUrl('vote.html');
            });
            if(!openid){
                $('.is-openid').addClass(this.request_cls);
            }
            $('.is-openid').click(function(e){
                e.preventDefault();
                e.stopPropagation();
                if($(this).hasClass(me.request_cls)){
                    alert('拼命加载中....');
                }
            });

            this.$btnReserve.click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                H.index.isoperate = true;
                var reserveId = $(this).attr('data-reserveid');
                if (!reserveId) {
                    return;
                }
                shaketv.reserve(yao_tv_id, reserveId, function(data){});
            });
        }
    };
})(Zepto);
$(function(){
    H.index.init();
});