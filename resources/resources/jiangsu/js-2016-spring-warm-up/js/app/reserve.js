(function ($) {

    H.reserve = {
        yao_tv_id: 10050,
        reserveId: '213189',
        date: '20160208',
        $btn: $('#btn_reserve'),

        init: function(){
            
            window['shaketv'] && shaketv.preReserve_v2({
                tvid:H.reserve.yao_tv_id,
                reserveid:H.reserve.reserveId,
                date:H.reserve.date
            }, function(data) {
                // alert(JSON.stringify(data));
                if (data.errorCode == 0) {
                }else if(data.errorCode == -1007) {
                    $('#btn_reserve').addClass('disabled').text('您已成功预约');
                }
            });

            $('#btn_reserve').tap(function(){
                if($(this).hasClass('disabled')){
                    return false;
                }

                shaketv.reserve_v2({
                    tvid:H.reserve.yao_tv_id,
                    reserveid:H.reserve.reserveId,
                    date:H.reserve.date
                },function(data) {
                    if(data.errorCode == 0) {
                        $('#btn_reserve').addClass('disabled').text('您已成功预约');
                    }
                });
            });
        },

        
    };

    H.reserve.init();

})(Zepto);