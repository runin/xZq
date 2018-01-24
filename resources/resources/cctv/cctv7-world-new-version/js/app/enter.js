/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
        canLottery:2,
		init: function () {
			this.event_handler();
			this.prereserve();
            //this.current_time();
		},
		event_handler : function() {
			var me = this;
			$('.main').click(function(e) {
				e.preventDefault();
                toUrl("lottery.html");
			});
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
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
		current_time: function(){
			   getResult('api/lottery/round',{},'callbackLotteryRoundHandler',true);
		},
		// 检查该互动是否配置了预约功能
		prereserve: function() {
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
		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeLength = 0,
				nowTimeStr = timeTransform(data.sctm),
				prizeActList = data.la,
				me = this;
			prizeLength = prizeActList.length;
			if(prizeActList.length >0){
				//如果最后一轮结束
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.canLottery = 0;
					 return;
			    }
                //如果第一轮未开始
                if(comptime(prizeActList[0].pd+" "+prizeActList[0].st,nowTimeStr) <= 0){
                    me.canLottery = 1;
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        me.canLottery = 1;
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.canLottery = 0;
                        return;
                    }
                }
			}else{
                me.canLottery = 2;
            }
		}
	}
	
	W.callbackLotteryRoundHandler = function(data){
		if(data.result == true){
			H.index.currentPrizeAct(data);
		}else{
            H.index.canLottery = false;
		}
	}

	
})(Zepto);                             

$(function(){
	H.index.init();
});


