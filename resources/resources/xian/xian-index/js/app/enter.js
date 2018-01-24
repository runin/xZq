/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		from: getQueryString('from'),
		now_time : null,
		istrue : true,
		init: function () {
			this.tv_banner();
			this.ad_banner();
			this.column_banner();
			this.event_handler();
			this.current_time();
			this.prereserve();
		},
		event_handler : function() {
			var me = this;
			$('#btn-begin').click(function(e) {
				e.preventDefault();
				return;
			});
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$("#btn-reserve").click(function(e) {
				e.preventDefault();
				
				var reserveId = $(this).attr('data-reserveid');
				if (!reserveId) {
					return;
				}
				shaketv.reserve(yao_tv_id, reserveId, function(data){});
			});
			
		},
		current_time: function(){
			   getResult('api/lottery/round',{},'callbackLotteryRoundHandler',true);
		},
		
		tv_banner: function(){
			   getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler',true);
		},
		ad_banner: function(){
			   getResult('index/cards/'+channelUuid,{},'callbackEnterActHandler',true);
		},
		column_banner: function(){
			   getResult('index/recommend',{cuid:channelUuid},'callbackRcommendHander',true);
		},
		// 检查该互动是否配置了预约功能
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
					// yao_tv_id: 微信为电视台分配的id
					window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function(resp){
						if (resp.errorCode == 0) {
							$("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId);
						}
					});
				}
			});
		},
		currentPrizeAct:function(data){
			
			//获取抽奖活动
			var prizeActListAll = data.la,
				prizeLength = 0,
				nowTimeStr = H.index.now_time,
				$tips = $(".time-tips"),
				prizeActList = [],
				me = this;
			var day = nowTimeStr.split(" ")[0];
			if(prizeActListAll&&prizeActListAll.length>0){
				for ( var i = 0; i < prizeActListAll.length; i++) {
					if(prizeActListAll[i].pd == day){
						prizeActList.push(prizeActListAll[i]);
					}
			    }
			}
			prizeLength = prizeActList.length;
			if(prizeActList.length >0){
				//如果最后一轮结束
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
					 $(".time-box").html("本期抽奖活动已结束");
					 return;
			    }
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
					var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
					//在活动时间段内且可以抽奖
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
						 showLoading();
						 $(".detail-countdown").html('抽奖开启');
						 setTimeout(function(){
		        	        toUrl("lottery.html");
		        	    },getRandomArbitrary(1, 4)*1000);
						return;
					}
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						$tips.html('距离抽奖开启还有');
						var beginTimeLong = timestamp(beginTimeStr);
		    			var nowTime = Date.parse(new Date())/1000;
		            	var serverTime = timestamp(nowTimeStr);
		    			if(nowTime > serverTime){
		    				beginTimeLong += (nowTime - serverTime);
		    			}else if(nowTime < serverTime){
		    				beginTimeLong -= (serverTime - nowTime);
		    			}
						$('.detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
						H.index.count_down();
						return;
					}
					
				}
			}else{
				H.index.change();
				return;
			}
		},
		// 倒计时
		count_down : function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">小时</label>' + '%M%' + '<label class="dian">分</label>' + '%S%'+'<label class="dian">秒</label>', // 还有...结束
					stpl : '%H%' + '<label class="dian">小时</label>' + '%M%' + '<label class="dian">分</label>' + '%S%'+'<label class="dian">秒</label>', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.index.istrue){
							H.index.istrue = false;
							$(".detail-countdown").addClass("none");
							$(".time-tips").html('抽奖开启')
						    setTimeout(function(){
						    	toUrl("lottery.html");
						    },1000);
						}	
					},
					sdCallback :function(){
					}
				});
			});
		},
		imgReady : function(items,type,fn){
		    var _srcList = [],
		    i = 0;　
		    $.each(items,function(index,value){
		    	if(type == 1){
		    		 _srcList.push(value.ib);
		    	}else if(type == 2){
		    		 _srcList.push(value.img);
		    	}
		    })
		    imgLoadComplate(_srcList[i]);
		    function imgLoadComplate(imgSrc){
		        var _img = new Image();
		        _img.src = imgSrc;
		        _img.onload = function(){　　　　　　　　　　　　　　　　　　 //判断是否加载到最后一个图片
		            if (i < _srcList.length-1) {
		                i++;
		                imgLoadComplate(_srcList[i]);
		            }else{
		               if(fn){
		               	fn();
		               }
		            }
		        }
		    }
		}
	}
	W.callbackLinesDiyInfoHandler = function(data){
		
		if(data.code == 0){
			var tv_ban_items = data.gitems, t = simpleTpl();
			for(i = 0,len = tv_ban_items.length;i < len;i++){
				t._	('<li class="swiper-slide">')
					._('<img src="'+tv_ban_items[i].ib+'" />')
//					._('<a href="#" class="reserve" id="btn-reserve" data-collect="true" data-collect-flag="cctv7-food-index-appointment" data-collect-desc="首页-节目预约按钮">预约节目</a>')
				._('</li>')
			}
			
			H.index.imgReady(tv_ban_items,1,function(){
				$("#tv_banner").html(t.toString());
				H.tv_page.init();
			});
		}
	} 
	W.callbackEnterActHandler = function(data){
		if(data.acts.code == 0){
			var ad_ban_items = data.acts.items, t = simpleTpl();
			for(i = 0,len = ad_ban_items.length;i < len;i++){
				t._	('<li class="swiper-slide">')
					._('<a href="'+ad_ban_items[i].ul+'" data-collect="true" data-collect-flag="tv-xian1-portal-ad-jump" data-collect-desc="首页-广告"><img src="'+ad_ban_items[i].img+'" /></a>')
				._('</li>')
			}
			H.index.imgReady(ad_ban_items,2,function(){
				$("#ad_banner").html(t.toString());
				H.ad_page.init();
			});
		}
	}
	W.callbackRcommendHander = function(data){
		if(data.code == 0){
			var ban_items = data.items, t = simpleTpl();
			for(i = 0,len = ban_items.length;i < len;i++){
				t._	('<li data-uuid="'+ban_items[i].uid+'">')
					._('<img src="'+ban_items[i].is+'" />')
					._('<span>'+ban_items[i].n+'</span>')
				._('</li>')
			}
			$("#column_banner").append(t.toString());
			$("#column_banner li").css("width",$(window).width()*0.94/2-8);
			$("#column_banner li").click(function(e){
				e.preventDefault();
				var uuid = $(this).attr("data-uuid");
				toUrl("detail.html?uuid="+uuid);
			})
			$(".column_box").removeClass("none");

		}
	}
	W.callbackLotteryRoundHandler = function(data){
		if(data.result == true){
			$(".time-box").removeClass("hidden");
			H.index.now_time = timeTransform(data.sctm);
			H.index.currentPrizeAct(data);
		}else{
			$(".time-box").html("敬请期待").removeClass("hidden");
		}
	}
	H.tv_page = {
		init: function() {
			 var swiper = new Swiper('.tv-container', {
		        pagination: '.tv-pagination',
		        slidesPerView: 1,
		        paginationClickable: true,
		        spaceBetween: 0,
		        loop: true,
		        preloadImages: false,
        		lazyLoading: true

		    });
		}
	};
	H.ad_page = {
		init: function() {
			 var swiper = new Swiper('.ad-container', {
		        pagination: '.ad-pagination',
		        slidesPerView: 1,
		        paginationClickable: true,
		        spaceBetween: 0,
		        loop: true,
		        autoplay: 4000,
        		autoplayDisableOnInteraction: false,
        		preloadImages: false,
        		lazyLoading: true
		    });
		}
	};
	
})(Zepto);                             

$(function(){
	H.index.init();
});


