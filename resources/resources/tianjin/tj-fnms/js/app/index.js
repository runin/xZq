$(function() {
	$('#lottery').click(function(){
        $(this).addClass("pulse");
        setTimeout(function(){
            toUrl("lottery.html");
        },1000);
	});
    $('#zan').click(function(){
        $(this).addClass("pulse");
        shownewLoading(null,"请稍候...");
        setTimeout(function(){
            location.href = "http://nccbank.yuanbao365.com/wap/active/lebao.html";
        },1000);
    });
	
	$("#rule").click(function(e){
		e.preventDefault();
        $(this).addClass("pulse");
        H.dialog.rule.open(index_rule);
	});
    var prereserve = function() {
        $.ajax({
            type : 'GET',
            async : true,
            url : domain_url + 'api/program/reserve/get' + dev,
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
    };
    prereserve();
    $("#btn-reserve").click(function(e) {
        e.preventDefault();
        var that = this;
        var reserveId = $(this).attr('data-reserveid');
        var date = $(this).attr('data-date');
        if (!reserveId || !date) {
            return;
        }
        window['shaketv'] && shaketv.reserve_v2({
                tvid:yao_tv_id,
                reserveid:reserveId,
                date:date},
            function(d){
                if(d.errorCode == 0){
                    $("#btn-reserve").addClass('none');
                }
            });
        if (!$(this).hasClass('flag')) {
            $(this).addClass('flag');
            setTimeout(function(){
                $(that).removeClass('flag');
            }, 1000);
        }
    });
	
	var share = getQueryString("from");
	if(share == "share"){
        H.dialog.guide.open();
	}

	var cbUrl = window.location.href;
	if(cbUrl.indexOf('cb41faa22e731e9b') < 0 ){
		$('#div_subscribe_area').css('height', '0');
	} else {
		$('#div_subscribe_area').css('height', '50px');
        $(".index-btn").css("margin-bottom","2%");
	}

});
