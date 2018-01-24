(function($) {
    H.vote = {
     	quid :'',
        dec: 0,
        index:0,
        istrue: true,
        voteWheel:"",
        voteTimeList : [],
        nextTime :"",
        endTime:"",
        detailArr:[],
		init: function () {
            this.getVoteinfo();
            this.event();
            this.refreshDec();
		},
		
		swiper: function(index) {
	         var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                slidesPerView: 1,
                paginationClickable: true,
                keyboardControl: true,
                spaceBetween: -110,
                speed: 600,
                effect: 'coverflow',
                coverflow: {
                    stretch: 0,
                    depth: 900,
                    modifier: 1,
                    rotate: 0,
                    slideShadows : false
                },
                iOSEdgeSwipeDetection : true,
                preloadImages: false,
                lazyLoading: true,
                lazyLoadingInPrevNext : true,
                loop: false,
                onInit: function(swiper){
                	
                },
                onSlideChangeEnd: function(swiper) {
                
                }
                
            });
            swiper.slideTo(index, 100, false);
            setTimeout(function(){
            	$(".swiper-control").animate({'opacity':'1'},1000);
            },200)
		},
		event: function() {
			var me = this;
            $("#red-pack").tap(function(e){
                e.preventDefault();
                window.location.href = "http://activity.zhenrongbao.com/atv/register?contact_from=996_13";
            });
			$(".swiper-slide").click(function(e){
				e.preventDefault();
				if(!$(this).hasClass('swiper-slide-active')){
					return;
				}
				var t = simpleTpl(),uuid = $(this).find('.vote-box').attr('data-uuid');
				var info = null;
				for(var i= 0; i < me.detailArr.length;i++){
					if(me.detailArr[i].pid == uuid){
						  info = me.detailArr[i];
					}	
				}
				if(!info){
					return;
				}
				t._('<div class="detail-info">')
	             	._('<div class="detail-head">')
	             			._('<div class="head-img"><img src='+info.im +' /></div>')
	             			._('<div class="name"><span>'+info.na+'</span><span>'+info.ni+'</span></div>')
					._('</div>')
					._('<div class="detail-content"><h1>项目介绍：</h1>'+info.in+'</div>')
				._('</div>')
				$(".detail").prepend(t.toString())
				$("#btn-view").attr("data-href",info.im2)
				$(".detail-box").removeClass("none").animate({'opacity':'1'},500);
				
			});
			$("#vote-back").click(function(e){
				e.preventDefault();
				toUrl('index.html');
			});
			$("#btn-back").click(function(e){
				e.preventDefault();
				$(".detail-box").animate({'opacity':'0'},500,function(){
					$(".detail-box").addClass("none");
					$(".detail-box").find('.detail-info').remove();
				})
			});
			$("#btn-godan").click(function(e){
				e.preventDefault();
				toUrl("comment.html");
			});
			$("#btn-view").click(function(e){
				e.preventDefault();
				toUrl($(this).attr("data-href"));
			});
		},
        refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time',
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            var nowTime = new Date().getTime();
                            H.vote.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },

        getVoteinfo: function() {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud'+dev,
                data: { yoi: openid},
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                       H.vote.voteWheel= data;
                        H.vote.countdownInfo(data);

                    }else {
                  		showTips("选手尚未揭晓，关注节目，耐心等待")
                    }
                },
                error : function(xmlHttpRequest, error) {
                   
                }
            });
        },
        fillVoteinfo: function(data,m) {
            var me = this, t = simpleTpl(), items = data.items;
            me.nextTime = data.nex;
            if(items&&items.length > 0){
            	t._('<div class="swiper-container">')
					._('<div class="swiper-wrapper">')
	                for(var i = 0, Len = m; i <= Len; i++) {
	                	me.detailArr.push(items[i].pitems[0]);
	                    t._('<div class="swiper-slide hide item-'+items[i].guid+'" id="index'+i+'" data-guid='+items[i].guid+'>')
		                   ._('<div class="vote-box"  data-uuid='+items[i].pitems[0].pid+'>')
		                   	  ._('<p></p>')
					          ._('<img src="images/reserve-default.jpg" data-src='+items[i].img+' onload="$(this).attr(\'src\',$(this).attr(\'data-src\'))"/>')
					        ._('</div>')
				        ._('</div>')
	                };
	                t._('</div>')
				._('</div>')
                $('.swiper-control').empty().html(t.toString());
                me.event();
//              me.countdownInfo(data);
            }else{
            	showTips("选手尚未揭晓，关注节目，耐心等待")
            }
        },
        countdownInfo: function(data) {
            var me = this, voteTimeListLength = 0, nowTimeStr = timeTransform(parseInt(data.cud));
            me.voteTimeList = data.items;
            H.vote.dec = new Date().getTime() - data.cud;
			voteTimeListLength =  me.voteTimeList.length;
			me.endTime =  me.voteTimeList[voteTimeListLength-1].get;
			//最后一轮投票结束	
        	if (comptime(me.voteTimeList[voteTimeListLength-1].get,nowTimeStr) >=0) { 
        		H.vote.index = voteTimeListLength-1;
        		H.vote.show(voteTimeListLength-1);
                return
        	};
        	for (var i = 0; i < voteTimeListLength; i++) {
                var beginTimeStr =  me.voteTimeList[i].gst, endTimeStr = me.voteTimeList[i].get;
                 //活动正在进行
                if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >= 0){   
                	H.vote.index = i;
                	H.vote.nowCountdown(me.voteTimeList[i]);
                    return;
                }
                if(comptime(nowTimeStr,beginTimeStr) > 0){    //活动还未开始
                 	H.vote.index = i;
                 	H.vote.show(H.vote.index-1);
                 	H.vote.beforeShowCountdown(me.voteTimeList[i]);
                    return;
                }
        	};
        },
        
        show : function(i){
        	var me = this;
        	if(i < 0){
        		showTips("选手尚未揭晓，关注节目，耐心等待")
        		$(".swiper-control").addClass("none");
        	}else{
        		H.vote.fillVoteinfo(H.vote.voteWheel,i);
        		for(var m = 0 ;m <= i ; m ++ ){
	             	$('#index'+m).addClass("show").removeClass('hide');
	            }
        		$(".swiper-control").removeClass("none");
	            me.swiper(i);
        	}
            
        },
        // 投票开启倒计时
        beforeShowCountdown: function(pra) {
            var beginTimeStr = pra.gst;
            var beginTimeLong = timestamp(beginTimeStr);
 			beginTimeLong += H.vote.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.vote.count_down();
            H.vote.istrue = true;
            H.vote.type = 1;
            hidenewLoading();
        },
        // 投票结束倒计时
        nowCountdown: function(pra){
            var endTimeStr = pra.get;
            var beginTimeLong = timestamp(endTimeStr);
      		beginTimeLong += H.vote.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.vote.count_down();
            H.vote.istrue = true;
            H.vote.type = 2;
            H.vote.show( H.vote.index);
            H.vote.index ++;
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
                        if(H.vote.istrue){
                        	H.vote.istrue = false;
                        	if (H.vote.type == 1) {   
                                H.vote.nowCountdown(H.vote.voteTimeList[H.vote.index]);
                            } else if (H.vote.type == 2) {
                                   //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
	                            if(H.vote.index >= H.vote.voteTimeList.length){
	                                // 如果已经是最后一轮摇奖倒计时结束 则显示 今日所有投票结束
	                                H.vote.type = 3;
	                                return;
	                            }
	                            H.vote.beforeShowCountdown(H.vote.voteTimeList[H.vote.index]);
	                           
                            } 
                        }
                            
                    },
                    sdCallback :function(){
                    }
                });
            });
        }
	};

})(Zepto);

$(function(){
	
    H.vote.init();
});