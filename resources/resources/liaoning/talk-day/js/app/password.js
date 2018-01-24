(function($) {
    H.pass = {
  		nowTime : null,
  		timedistance : "",
  		istrue : true,
  		type : 0,
  		prizeAct :null,
  		isLottery : false,
  		orderPass : null,
  		itemUuid :null,
  		item : null,
  		rightUuid:null,
  		wrongUuid : null,
        init : function(){
           var me = this;
           me.server_time();
           me. event();
           getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        event: function() {
      		$("#pass-crm").click(function(e){
				e.preventDefault();
				if($(this).hasClass("noInfo")){
					showTips("无活动信息")
					return ;
				}
				if($(this).hasClass("unstart")){
					showTips("尚未开始")
					return ;
				}
				if($(this).hasClass("answered")){
					showTips("已匹配过")
					return ;
				}
				if($(this).hasClass("not-crm")){
					return ;
				}
				if(!H.pass.orderPass){
					return ;
				}
				
				if($(".pass").val().length <=0){
					showTips("请输入口令")
					return ;
				}
				if($(".pass").val() == H.pass.orderPass){
					H.dialog.result.open(1);
					getResult('api/question/answer',{yoi:openid,suid:H.pass.itemUuid,auid : H.pass.rightUuid},'callbackQuestionAnswerHandler',true);
				}else{
					H.dialog.result.open(2);
					getResult('api/question/answer',{yoi:openid,suid:H.pass.itemUuid,auid : H.pass.wrongUuid},'callbackQuestionAnswerHandler',true);
				}
			});
			$(".view").click(function(e){
				e.preventDefault();
				H.dialog.rule.open();
			});
			$(".back-btn").click(function(e){
				e.preventDefault();
				toUrl("join.html");
			});
        },
        record :function(roundUuid){
        	getResult('api/question/allrecord',{yoi : openid,tid:roundUuid},'callbackQuestionAllRecordHandler',true);
        },
		server_time: function(){
			   getResult('api/common/time',{},'commonApiTimeHandler',true);
		},
	 	current_time: function(){
		     getResult('api/question/round',{} ,'callbackQuestionRoundHandler',true);
		},
        currentPrizeAct:function(item){
           //获取抽奖活动
            var  nowTimeStr = H.pass.nowTime
            me = this;
			//答题结束
			var beginTimeStr =item.qst;
			var endTimeStr = item.qet;
			if(comptime(endTimeStr,nowTimeStr) > 0){
				H.pass.change();
				$("#pass-crm").html("结束");
				return;
			}
			//答题时间段内
			if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
				H.pass.nowCountdown(item);
				return;
			}
			if(comptime(nowTimeStr,beginTimeStr) > 0){
				H.pass.beforeShowCountdown(item);
				H.pass.istrue = true;
				return;
			}
        },
              // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            var beginTimeStr = pra.qst;
            var beginTimeLong = timestamp(beginTimeStr);
 			beginTimeLong += H.pass.timedistance;;
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.pass.count_down();
            H.pass.isLottery = false;
           	H.pass.change();
			$("#pass-crm").removeClass("noInfo").addClass("unstart");
            H.pass.type = 1;
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            var endTimeStr = pra.qet;
            var beginTimeLong = timestamp(endTimeStr);
            H.pass.rightUuid = pra.aitems[0].auid;
            H.pass.wrongUuid = pra.aitems[1].auid;
			H.pass.orderPass =pra.aitems[0].at;
			H.pass.itemUuid = pra.quid;
      		beginTimeLong += H.pass.timedistance;
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.pass.istrue = true;
            H.pass.count_down();
            H.pass.type = 2;
            H.pass.isLottery = true;
            $(".pass-info .pass").removeAttr("disabled").removeClass("not-pass");
			$("#pass-crm").removeClass("not-crm").removeClass("unstart");
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%'+'时'+'%M%' + '分' + '%S%'+'秒', // 还有...结束
                    stpl : '%H%'+'时'+'%M%' + '分' + '%S%'+'秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.pass.istrue){
                        	H.pass.istrue = false;
                        	if (H.pass.type == 1) {              
                                H.pass.nowCountdown(H.pass.item);
                            }else if (H.pass.type == 2) {
								H.pass.change();
								$("#pass-crm").removeClass("answered").html("结束");
	                            return;
	                        }
                       	}     
                    },
                    sdCallback :function(){
                        
                    }
                })
            });
        },
        change :function(){
        	H.pass.isLottery = false;
        	$(".pass-info .pass").attr("disabled","disabled").addClass("not-pass");
			$("#pass-crm").addClass("not-crm");
        }
    }
    W.callbackQuestionRoundHandler = function(data){
    	if(data.code == 0){
    		var roundUuid  = data.tid;
    		H.pass.item = data.qitems[0]
    		H.pass.record(roundUuid);
	  		
    	}else{
    		H.pass.change();
    		$("#pass-crm").addClass("noInfo");
    	}
    	
    };
    W.commonApiTimeHandler = function(data){
		var me = this;
		var nowTime = Date.parse(new Date())/1000;
		var serverTime = data.t/1000;
		 H.pass.timedistance = nowTime - serverTime ;
		var date=new Date(parseInt(data.t));
        Date.prototype.format = function(format){
            var o = {
                "M+" : this.getMonth()+1, //month
                "d+" : this.getDate(), //day
                "h+" : this.getHours(), //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth()+3)/3), //quarter
                "S" : this.getMilliseconds() //millisecond
            }

            if(/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            }

            for(var k in o) {
                if(new RegExp("("+ k +")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
                }
            }
            return format;
        };
        H.pass.nowTime = date.format("yyyy-MM-dd hh:mm:ss");
		H.pass.current_time();
	};
	W.callbackQuestionAnswerHandler = function(data){
		
	}
	W.callbackQuestionAllRecordHandler = function(data){
		if(data.items.length==0){
			H.pass.currentPrizeAct(H.pass.item);
		}else{
			H.pass.currentPrizeAct(H.pass.item);
			H.pass.change();
			$("#pass-crm").addClass("answered");
		}
	};
	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			jumpUrl = data.url;
			$(".outer").attr("href",jumpUrl).html(data.desc).removeClass("none");
		}else{
			$(".outer").addClass("none");
		}
	};
})(Zepto);

$(function() {

    H.pass.init();
});
