$(function(){
     var W  = window;
     var prizeResultUuid = "";
    //页面的最小高度
     var winH = $(window).height();
     var yaoW = $(".yao").width();
     $(".container").height(winH);
     $(".yao").height(yaoW*810/510);
     var yaoH = $(".yao").height();
     $(".yaoyiyao").css({
    	'top' :yaoH*0.5,
    	'margin-top':-yaoW*0.3
     });
    H.yao = {
        commActUid:null,
        check:null,
        isTrue :true,
        init : function(){
          var me = this;
          me.current_time();
		  me.shake(); 
         },
        shake: function() {
            W.addEventListener('shake', H.yao.shake_listener, false);
        },
        unshake: function() {
                
        },
        shake_listener: function() {
        	if($(".modal").hasClass("none")||$(".modal").length == 0){
        		recordUserOperate(openid, "旅游卫视摇手机", "fj-group-shake");
                $("#audio-a").get(0).play();//摇声音
                $('.yaoyiyao').addClass('bbtimg');
                
                 setTimeout(function(){
                     H.dialog.lottery.open();
                  }, 1000);
                 setTimeout(function(){
                     $('.yaoyiyao').removeClass('bbtimg');
                 }, 1000);
        	}else{
        		return;
        	}   
         },
        //查询抽奖活动时间段
        current_time: function(){
             getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler',true);
            
        },
        currentPrizeAct:function(data){
          //获取抽奖活动
          var prizeActList = data.la,
              prizeLength = prizeActList.length,
              nowTimeStr = data.sctm/1000,
              me = this;
          //最后一轮时间结束
          if(timestamp(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et)<= nowTimeStr){
          	  showLoading();
        	  toUrl("lottery.html");
        	  return;
          }
          for ( var i = 0; i < prizeActList.length; i++) {
            var beginTimeStr =timestamp(prizeActList[i].pd+" "+prizeActList[i].st);
            var endTimeStr = timestamp(prizeActList[i].pd+" "+prizeActList[i].et);
            //在摇奖时间段
            if(beginTimeStr < nowTimeStr && endTimeStr > nowTimeStr){
            	H.yao.commActUid = prizeActList[i].au;
            	var endTimeLong = endTimeStr;
    			var nowTime = Date.parse(new Date())/1000;
            	var serverTime = nowTimeStr;
        			if(nowTime > serverTime){
        				endTimeLong += (nowTime - serverTime);
        			}else if(nowTime < serverTime){
        				endTimeLong -= (serverTime - nowTime);
        			}
                $('.downContTime').attr('etime',endTimeLong);
                H.yao.count_down();
                return;
            }
          }
          showLoading();
          toUrl("lottery.html");
  		  return;
        },
        // 倒计时
        count_down : function() {
          $('.downContTime').each(function() {
              var $me = $(this);
              $(this).countDown({
                  etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
                  stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
                  sdtpl : '',
                  otpl : '',
	              otCallback : function() { 
	               	if(H.yao.isTrue){
	               		 H.yao.isTrue = false;
	               		 setTimeout(function(){
	               		 	showLoading();
	               		 	toUrl("lottery.html");
	               		 },3000);
	               	} 
	              },
	              sdCallback :function(){
	              }
            });
          });
        }
     };
     W.callbackLotteryRoundHandler = function(data){
	    if(data.result){
 			H.yao.currentPrizeAct(data);
	    }
    }
});
$(function(){
	setTimeout(function(){
		H.yao.init();
    }, 1100);
//  $('#red').click(function(event) {
//     H.yao.shake_listener();
//  });
});
