$(function() {

	(function($) {

		H.exchange = {

			page : 1,
			pageSize : 20,
			leftCount : 0,
			goodData : {},

			init : function() {
				$(".wrapper").css('min-height',$(window).height());
				$(".exchange-outer-wrapper").css('min-height', $(window).height() - 37);
				var search = window.location.search;
				var args = search.split('=');
				getResult('api/mall/item/detail/' + args[1], {}, 'callbackStationMallDetail');			
			},

			initGoods : function(data){
				this.goodData = data;
				this.leftCount = parseInt(data.ic, 10);
				$leftCount = parseInt(data.ic,10) >= 0 ? (data.ic) + '件' :  '无限量';

				$(".big-cover").html('<img src="'+data.is+'">');
				$(".mall-score .score").html("兑换积分：" + data.ip + "&nbsp;&nbsp;<s>￥" + data.mp / 1000 + "</s>");
				$(".mall-score .rest").html("剩余：" + $leftCount + "&nbsp;&nbsp;已兑换：" + data.so);
				$(".mall-score .title").html(data.n);
				$(".mall-num").html(data.param);
				$(".mall-desc").html(data.d);

				$(".exchange-wrapper .score").html("积分：" + data.ip);

				$(".detail-wrapper .submit").click(function(){
					$(".detail-wrapper").addClass('none');
					$(".exchange-wrapper").removeClass('none');
					H.exchange.updateTotal(H.exchange.goodData.ip);
				});

				this.initTabs(data);
				this.initForm(data);
			},

			initTabs : function(){
				$(".nav a").click(function(){
					$(".nav a").removeClass('active');
					$(this).addClass('active');
					$(".tab-content").addClass('none');
					$(".mall-" + $(this).attr('id')).removeClass('none');
				});

			},

			initForm : function(data){
				$(".icon-plus").click(function(){
					if(!$(this).hasClass('disabled')){
						var count = parseInt($(".count-select-input").val(),10) + 1;
						if(H.exchange.leftCount > 0 && count >= H.exchange.leftCount){
							count = H.exchange.leftCount;
							$(this).addClass('disabled');
						}
						$(".count-select-input").val(count);
						$(".icon-minus").removeClass('disabled');
						H.exchange.updateTotal(count * data.ip);
					}
					return false;
				});

				$(".icon-minus").click(function(){
					if(!$(this).hasClass('disabled')){
						var count = $(".count-select-input").val();
						$(".count-select-input").val(parseInt(count,10) - 1);
						if(parseInt(count,10) - 1 == 1){
							$(this).addClass('disabled');
						}
						$(".icon-plus").removeClass('disabled');
						H.exchange.updateTotal((parseInt(count,10) - 1) * data.ip);
					}
					return false;
				});

				$(".count-select-input").bind('input',function(){
					var num = $(this).val();
					if(/^\d+$/.test(num)){
						num = parseInt(num, 10);
						if(num > 1) {
							$(".icon-minus").removeClass('disabled');
						}else{
							num = 1;
							$(this).val('1');
							$(".icon-minus").addClass('disabled');
						}
					}else{
						num = 1;
						$(this).val('1');
						$(".icon-minus").addClass('disabled');
					}

					H.exchange.updateTotal(num * data.ip);
				});

				$(".exchange-form .submit").click(function(){
					$phone = $.trim($("#exchange_phone").val());
					$name = $.trim($("#exchange_name").val());
					$address = $.trim($("#exchange_address").val());
					$buyCount = $.trim($(".count-select-input").val());

					if(!/^\d{11}$/.test($phone)){
						alert('请填写电话');
						return false;
					}

					if($name.length == 0){
						alert("请输入姓名");
						return false;
					}

					if($address.length == 0){
						alert("请输入地址");
						return false;
					}

					getResult('api/mall/order/payTv/', {
						openid : openid,
						phone : $phone,
						buyCount : $buyCount,
						itemUuid : data.uid,
						name : encodeURIComponent($name),
						address : encodeURIComponent($address),
						wxname: encodeURIComponent(nickname),
						wxheadurl: headimgurl,
					}, 'callbackMallApiPayTv');

				});
			},

			updateTotal: function(num){
				num = parseInt(num, 10);
				if(H.userInfo.myScore >= 0){
					// 当前积分已拿到
					if(num > H.userInfo.myScore){
						$(".total-score").html(num + '<span class="yellow">（积分不足）</span>');
					}else{
						$(".total-score").html(num);
					}
				}else{
					// 没有拿到积分的情况
					$(".total-score").html(num);	
				}
			},

			paySuccess : function(){
				$(".exchange-success-wrapper").removeClass('none');
				$(".exchange-outer-wrapper").addClass('none');
			}

		};

		H.userInfo = {
			myScore : -1,

			init : function(){
				getResult('shaketv/userinfo/base', {
					yoi : openid
				}, 'callbackShaketvBaseUserinfoHandler');

				getResult('api/lottery/integral/rank/self', {
					oi : openid
				}, 'callbackIntegralRankSelfRoundHandler');
			},

			fillData : function(data){
				if(data.realname){
					$("#exchange_name").val(data.realname);	
				}
				if(data.phone){
					$("#exchange_phone").val(data.phone);	
				}
				if(data.address){
					$("#exchange_address").val(data.address);	
				}
			},

			initScore : function(data){
				if(data.in >= 0){
					this.myScore = data.in;
				}
			}
		};


		W.callbackStationMallDetail = function(data){
			if(data.code == 0){
				H.exchange.initGoods(data);
			}else{
				alert("网络错误，请刷新重试");
			}
		};

		W.callbackMallApiPayTv = function(data){
			if(data.code == 0){
				H.exchange.paySuccess();
			}else{
				alert(data.message);
			}
		};


		W.callbackShaketvBaseUserinfoHandler = function(data){
			H.userInfo.fillData(data);
		};

		W.callbackIntegralRankSelfRoundHandler = function(data){
			if(data.result == true){
				H.userInfo.initScore(data);
			}
		};

	})(Zepto);

	H.exchange.init();
	H.userInfo.init();

});
