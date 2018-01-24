(function($) {
   H.star = {
     	guid :'',
        dec: 0,
        index:0,
        istrue: true,
        $current : null,
        audio_url:null,
        starTimeList : [],
        nowTime : "",
        REQUEST_CLS: "requesting",
        playing:false,
        pra : null,
		init: function () {
            this.current_time();
            this.event();
            this.refreshDec();
		},
		refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time'+dev,
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            var nowTime = new Date().getTime();
                            H.star.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
       
		event: function() {
			var me = this; 
             $('#btn-cor').click(function(e) {
                e.preventDefault();
                if($(this).hasClass("request")){
                	return;
                	
                }
                $(this).addClass("request");
                toUrl("comment.html")
            })
             $('#btn-yao').click(function(e) {
                e.preventDefault();
                if($(this).hasClass("request")){
                	return;	
                }
                $(this).addClass("request");
                toUrl("yaoyiyao.html")
            })

		}, 
		 current_time: function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round'+dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                	hidenewLoading();
                    if(data.result == true){
                        H.star.nowTime = timeTransform(data.sctm);
                        var nowTime = Date.parse(new Date());
                        var serverTime = timestamp(H.star.nowTime);
                        // 计算服务器时间和本地时间的差值，并存储
                        H.star.dec = (nowTime - serverTime);
                        H.star.currentPrizeAct(data);
                    }else{
                        if(H.star.repeat_load){
                            H.star.repeat_load = false;
                            setTimeout(function(){
                                H.star.current_time();
                            },500);
                        }else{
                        	$(".text-tip").html("活动尚未开始");
                        	$(".downContTime").addClass("none");
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                	$(".text-tip").html("活动尚未开始");
                    $(".downContTime").addClass("none");
                }
            });
        },
        currentPrizeAct:function(data){
           //获取抽奖活动
            var prizeActList = data.la,
                prizeLength = prizeActList.length,
                nowTimeStr = H.star.nowTime
                me = this;
                H.star.pra = prizeActList;
      
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                   	H.star.change();
                    return;
                }
                //第一轮摇奖开始之前，显示倒计时
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){    
                    	toUrl("yaoyiyao.html")
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                    	H.star.index = i;
 						H.star.beforeShowCountdown(prizeActList[i]);
                        return;
                    }

                }
            }else{
               $(".time-text").html('敬请期待!')
                return;
            }
        },
              // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
        	if(H.star.index>0){
            	H.star.fill_star_info(H.star.index-1);
            }else{

            	toUrl("yaoyiyao.html");
            }
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
 			beginTimeLong += H.star.dec;
            $(".text-tip").html('距摇奖开启还有   ');
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.star.count_down();
            H.star.istrue = true;
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '<label>%H%</label>'+'时'+'<label>%M%</label>' + '分' + '<label>%S%</label>秒', // 还有...结束
                    stpl : '<label>%H%</label>'+'时'+'<label>%M%</label>' + '分' + '<label>%S%</label>秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.star.istrue){
                        	shownewLoading()
                        	$(".text-tip").html('请稍后 ');
                        	H.star.istrue = false; 
                            toUrl("yaoyiyao.html")
                        }      
                    },
                    sdCallback :function(){              
                    }
                });
            });
        },
        fill_star_info :function(index){
        	var me = this,$showBox = $(".showBox"),t = simpleTpl();
        	var star_item = H.star_info.aitems[index].items;
        	t._('<ul class="star_show">')
        		for (var i=0,len = star_item.length;i<len;i++) {
	        		t._('<li>')
						._('<img class="star_img" src="images/star_img/load.png" onload="$(this).attr(\'src\',\''+star_item[i].img+'\')"/>')
						if(star_item[i].audio!=null){
							t._('<div class="star-audio">')
								._('<section class="ui-audio" data-href="'+star_item[i].audio+'">')
 									._('<div class="coffee-flow">')
									._('<a href="#" class="audio-icon"  data-collect="true" data-collect-flag="tv-henantv-fans-audio-btn" data-collect-desc="投票页听语音按钮"><i><audio class="audio_media" src="'+star_item[i].audio+'"></audio> </i></a>')
									._('</div>')
							    ._('</section>')
						    ._('</div>')
						}
					t._('</li>')
        		}
			t._('</ul>')	
			$showBox.html(t.toString());
			
			var showW = $(".star_show").width();
			$(".star_show li").width(Math.round(showW/3));
			$(".star_show").find("li").click(function(e){
				e.preventDefault();
				//在播放
				var me = $(this);
				if(!$(this).hasClass("playing")){
					 $(this).addClass("request");
					if($(".star_show").find("li").hasClass("playing")){
						$(".audio_media").each(function(){
							$(this).get(0).pause();
							$(this).attr("src","")
						})
						$(".star_show").find("li").removeClass("playing");
						$(".star_show").find("li").removeClass("request");
						$(".star_show").find(".ui-audio").removeClass("animated")
					}
					$(this).find(".audio_media").attr("src",$(this).find(".ui-audio").attr("data-href"))
					$(this).find(".audio_media").get(0).play();
				    $(this).addClass("playing");
				     $(this).addClass("request");
				    $(this).find(".ui-audio").addClass("animated");
					$(this).find(".audio_media").get(0).addEventListener('ended', function(e){
						me.find(".ui-audio").removeClass("animated");
						me.removeClass("playing");
						me.removeClass("request");
					}, false);
				}else{
					$(this).find(".audio_media").get(0).pause();
					$(this).attr("src","");
					$(this).removeClass("request");
					$(this).removeClass("playing");
					$(this).find(".ui-audio").removeClass("animated")
				}
				
			});
			
        	$showBox.removeClass("hidden");
        },
        change: function(){
           toUrl("end.html")
        },
        showBoxChange :function(){
        	if($(".main").hasClass("ended")){
	        	$(".showBox").find(".join-btn").addClass("none");
	        	return;
	        }
    		if(H.star.$current.hasClass("voted")){
	        	$(".showBox").find(".join-btn").addClass("none");
	        
	        	return;
	        }else{
	        	$(".showBox").find(".join-btn").removeClass("none");
	        	return;
	        }	
        }
	};

})(Zepto);

$(function(){
	
    H.star.init();
});