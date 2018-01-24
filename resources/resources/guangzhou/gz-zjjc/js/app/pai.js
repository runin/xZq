/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		from: getQueryString('from'),
		is_ed_true : true,
		is_bg_true : true,
		$goodsList : $("#goodsList"),
		timeArr:[],
		$order : $("#order"),
		now_time:null,
		timedistance:null,
		uuid : null,
		restNum : 0,
		isCanShop:true,
		bCountDown:false,//是否在倒计时
        eCountDown :false,
		init: function () {
			this.event_handler();
			this.server_time();
			this.user_info();
		},
		event_handler : function() {
			var me = this;
			$(".btn-yao").click(function(e){
				e.preventDefault();
				toUrl("yaoyiyao.html")
			});
			$(".btn-dan").click(function(e){
				e.preventDefault();
				toUrl("answer.html")
			});
		},
		current_time: function(){
			   getResult('api/shop/item/roll',{},'callbackShopMallItemRoll',true);
		},
		server_time: function(){
			   getResult('api/common/time',{},'commonApiTimeHandler',true);
		},
		goods_info: function(itemUuid){
			   getResult('api/shop/item/ detail/'+itemUuid,{yo:openid},'callbackShopMallItemDetail',true);
		},
		user_info : function(){
			  getResult('api/user/info',{oi:openid},'callbackUserInfoHandler',true);
		},
		currentPrizeAct:function(data){
			
			//获取商品数组
			var items = data.items,
				itemsLength = 0,
				nowTimeStr = H.index.now_time,
				me = this;
			itemsLength = items.length;
			if(itemsLength >0){
				//如果最后一轮结束
				if(comptime(items[itemsLength-1].vet,nowTimeStr) >= 0){
					H.index.isCanShop = false;
					H.index.uuid = items[itemsLength-1].uid
					H.index.goods_info(H.index.uuid);
					$(".time-box").html("本期抢拍活动已结束").removeClass("hidden");
					return;
			    }
				for ( var i = 0; i < itemsLength; i++) {
					var beginTimeStr = items[i].vst;
					var endTimeStr = items[i].vet;
					//抢拍时间段内
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
						H.index.eCountDown = true;
						H.index.isCanShop =true;
						H.index.uuid = items[i].uid
						H.index.goods_info(H.index.uuid);
						$(".time-tips").html('距离本轮抢拍结束还有');
						var endTimeLong = timestamp(endTimeStr);
		    			endTimeLong = endTimeLong+H.index.timedistance;
						$('.detail-countdown').attr('etime',endTimeLong);
						$(".time-box").removeClass("hidden");
						 H.index.istrue = true;
						H.index.count_down();
						return;
					}
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						H.index.bCountDown = true;
						H.index.isCanShop = false;
						H.index.uuid = items[i].uid
						H.index.goods_info(H.index.uuid);
						$(".time-tips").html('距离下轮抢拍开始还有');
						var beginTimeLong = timestamp(beginTimeStr);
		    			beginTimeLong = beginTimeLong +H.index.timedistance ;
						$('.detail-countdown').attr('etime',beginTimeLong)
						$(".time-box").removeClass("hidden");
						 H.index.istrue = true;
						H.index.count_down();
						return;
					}
				}
			}else{
				 $(".ed-time-box").html("本期抢拍活动已结束").removeClass("hidden");
				return;
			}
		},
		// 倒计时
		count_down : function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">时</label>' + '%M%' + '<label class="dian">分</label>' + '%S%'+'<label class="dian">秒</label>', // 还有...结束
					stpl : '%H%' + '<label class="dian">时</label>' + '%M%' + '<label class="dian">分</label>' + '%S%'+'<label class="dian">秒</label>', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
		                if(H.index.istrue){
		                	H.index.istrue = false;
		                	//开始倒计时		
		                	if(H.index.bCountDown == true){
		                		H.index.bCountDown = false;
		                		$(".time-tips").html('本轮抢拍开启');
			                	setTimeout(function(){
			                		H.index.server_time();
			                	},2000);
		                	//结束倒计时
		                	}else if(H.index.eCountDown){
		                		H.index.eCountDown = false;	
		                		$(".time-tips").html('本轮抢拍结束');	
								$("#order").removeAttr("data-uuid").addClass("none");
								showTips('本轮抢拍结束');
			                	setTimeout(function(){
			                		H.index.server_time();
			                	},2000);
		                	}
		                	
		                }
					},
					sdCallback :function(){
					}
				});
			});
		},
		imgReady : function(items,fn){
		    var _srcList = items,
		    i = 0;　
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
		},
		fillContent: function(data) {
			var me = this, t = simpleTpl();
			var imgSrc = data.om.split(';');
			var infoStr = data.pinf;
			shownewLoading();
			if(infoStr.length > 50){
				infoStr = infoStr.substring(0,50)+"......";
				subInfoStr = infoStr;
			}
				t._('<li clsss="none" data-uuid="'+data.uid+'">')
				 	._('<header class="swiper-container goodImg-container">')
			        	._('<ul class="swiper-wrapper" id="goodImg">')
			        		for(var i = 0,len = imgSrc.length;i<len;i++ ){
			        			t._('<li class="swiper-slide"><img src="'+imgSrc[i]+'"/></li>')
			        		}
				        t._('</ul>')
				        ._('<div class="swiper-button-next"></div>')
			        	._('<div class="swiper-button-prev"></div>')
			   		._('</header>')
				    ._('<section class="content">')
				    	._('<h2>'+data.n+'</h2>')
				    	._('<p class="intro" data-subIntro="'+subInfoStr+'" data-intro="'+data.pinf+'"><span>'+infoStr+'</span><br /><a class="more">查看更多>></a><a class="less none">收起详情</a></p>')
				    	._('<div class="buy">')
				    		._('<label>￥<span>'+data.yp/100+'</span>元</label><del>￥'+data.mp/100+'元</del>')
				    		._('<a class="btn btn-buy" data-uuid="'+data.uid+'" data-collect="true" data-collect-flag="tv-guangzhou-zhujiang-buy-btn=" data-collect-desc="首页-立即购买按钮">立即购买</a>')
				    	._('</div>')
			   		 ._('</section>')
		  		._('</li>');
		  	    H.index.imgReady(imgSrc,function(){
		  		$("#goodsList").html(t.toString());
		  		hidenewLoading();
		  		H.page.init();
				H.index.show_all();
				//无库存
				if(data.kc <=0){
					$(".btn-buy").addClass("btn-notNum").html("已售罄");
				}else{
					//抢购过
					$(".btn-buy").removeClass("btn-notNum");
					if(!data.isb){
						$(".btn-buy").addClass("shoped").html("已抢购");
					}else{
						$(".btn-buy").removeClass("shoped");
						if(H.index.isCanShop){
							$(".btn-buy").removeClass("btn-notBuy");
						}else{
							$(".btn-buy").addClass("btn-notBuy").html("立即购买");
						}
					}
				}
				
				H.index.bindClick();
		  	})
			
		},
		show_all :function(){
			$(".more").click(function(e){
				e.preventDefault();
				$(this).parent(".intro").find("span").html($(this).parent(".intro").attr("data-intro"));
				$(this).addClass("none");
				$(".less").removeClass("none");
			});
			$(".less").click(function(e){
				e.preventDefault();
				$(this).parent(".intro").find("span").html($(this).parent(".intro").attr("data-subIntro"));
				$(this).addClass("none");
				$(".more").removeClass("none");
			});
		},
		bindClick :function(){
			 var me = this;
			$(".btn-buy").click(function(e){
				e.preventDefault();
				if($(this).hasClass("btn-notBuy")){
					showTips("该商品暂不能拍哦");
					return ;
				}
				if($(this).hasClass("btn-notNum")){
					showTips("该商品已经被抢光");
					return ;
				}
				if($(this).hasClass("shoped")){
					showTips("只能抢一次哦");
					return ;
				}
				$("#order").attr("data-uuid",$(this).attr("data-uuid")).removeClass("none");
				me.submit_order();
			});
		},
		submit_order : function(){
			var me = this;
			$("#btn-order-close").click(function(e){
				e.preventDefault();
				$("#order").addClass("none");
			});
			$("#btn-order").click(function(e){
				e.preventDefault();
				if (!me.check()) {
					return false;
				}
				if(!$(this).hasClass("requesting")){
					$(this).addClass("requesting")
				}else{
					return;
				}
				var $mobile = me.$order.find('.mobile'),
				$name = me.$order.find('.name'),
				$address = me.$order.find('.address'),
				mobile = $.trim($mobile.val()),
				name = $.trim($name.val());
				address = $.trim($address.val());
				getResult('api/shop/order/submit', {
						yo : openid,
						tid : $(this).parent("#order").attr("data-uuid"),
						qt :1,
						ph : mobile,
						co: encodeURIComponent(name),
						ad :encodeURIComponent(address),
						Pt : 2
				}, 'callbackShopMallOrderSubmitOrder');
			});
		},
		check: function() {
			var me = this;
			var $mobile = me.$order.find('.mobile'),
				$name = me.$order.find('.name'),
				$address = me.$order.find('.address'),
				mobile = $.trim($mobile.val()),
				name = $.trim($name.val());
				address = $.trim($address.val());
				if (!name) {
					showTips('请输入您的姓名',4);
					$name.focus();
					$(this).removeClass(me.REQUEST_CLS);
					return false;
				}
				if (!mobile || !/^\d{11}$/.test(mobile)) {
					showTips('这手机号，可打不通...',4);
					$mobile.focus();
					$(this).removeClass(me.REQUEST_CLS);
					return false;
				}
				if (!address) {
					showTips('请输入正确的地址',4);
					$address.focus();
					$(this).removeClass(me.REQUEST_CLS);
					return false;
				}
				return true;
		},
	}
	W.callbackShopMallItemRoll = function(data){
		if(data.code == 0){
			H.index.currentPrizeAct(data);
		}else{
			$(".time-box").html("敬请期待").removeClass("hidden");
		}
	}
	W.commonApiTimeHandler = function(data){
		var me = this;
		var nowTime = Date.parse(new Date())/1000;
		var serverTime = data.t/1000;
		
		if(nowTime > serverTime){
		    H.index.timedistance = (nowTime - serverTime);
		}else if(nowTime < serverTime){
		    H.index.timedistance = -(serverTime - nowTime);
		}
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
        H.index.now_time = date.format("yyyy-MM-dd hh:mm:ss");
		H.index.current_time();
	}
	W.callbackShopMallItemDetail = function(data){
		if(data.code == 0){
			H.index.fillContent(data);
		}
	}
	W.callbackShopMallOrderSubmitOrder = function(data){
		if(data.code == 0){
			toUrl(data.redirectUrl);
		}else{
			showTips("商品已抢光")
		}
	}
	W.callbackUserInfoHandler = function(data){
		if(data.result){
			$("#name").val(data.rn);
			$("#mobile").val(data.ph);
			$("#address").val(data.ad);
		}
	}
	H.page = {
		init: function() {
			 var swiper = new Swiper('.swiper-container', {
		        nextButton: '.swiper-button-next',
		        prevButton: '.swiper-button-prev',
		        spaceBetween: 0
		    });
		}
	};
	
})(Zepto);                             

$(function(){
	H.index.init();
});


