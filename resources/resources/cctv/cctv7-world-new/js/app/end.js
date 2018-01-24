/**
 * 乡村大世界-结束页
 */
(function($) {
    H.end = {
        init: function () {
            this.event_handler();
            this.prereserve();
        },
        event_handler : function() {
            $("#btn-reserve").click(function(e) {
                e.preventDefault();
                var reserveId = $(this).attr('data-reserveid');
                var date = $(this).attr('data-date');
                if (!reserveId || !date) {
                    return;
                };
                window['shaketv'] && shaketv.reserve_v2({
                        tvid:yao_tv_id,
                        reserveid:reserveId,
                        date:date},
                    function(d){
                        if(d.errorCode == 0){
                            $("#btn-reserve").addClass('none');
                        }
                    });
            });

        },
        // 检查该互动是否配置了预约功能
        prereserve: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get',
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackProgramReserveHandler',
                success : function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                            tvid:yao_tv_id,
                            reserveid:data.reserveId,
                            date:data.date},
                        function(resp){
                            if (resp.errorCode == 0) {
                                $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
                }
            });
        }
    }


})(Zepto);

$(function(){
    H.end.init();
});


