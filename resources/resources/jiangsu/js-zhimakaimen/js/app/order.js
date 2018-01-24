$(function() {

	(function($) {

		H.order = {

			page : 1,
			pageSize : 20,

			init : function() {
				$(".wrapper").css('min-height',$(window).height());
				$(".order-wrapper").css('min-height', $(window).height() - 104 - 37 -46);

				if(headimgurl){
					$(".avatar img").attr('src', headimgurl + '/64');
				}
				if(nickname){
					$(".name").html(nickname);
				}

				this.getScore();
				this.getList();
				this.initMore();
			},

			getScore : function(){
				getResult('api/lottery/integral/rank/self', {
					oi : openid
				}, 'callbackIntegralRankSelfRoundHandler');
			},

			initHeader: function(data){
				if(data.in >= 0){
					$(".score").html("我的积分：" + data.in);	
				}
			},

			
			getList : function(){
				showLoading();
				getResult('api/mall/order/myrecord', {
					openid : openid,
					page : H.order.page,
					pageSize : H.order.pageSize
				}, 'callbackMallOrderMyRecord');
			},

			initList : function(data){
				$listHtml = "";
				for(var i in data.items){
					$listHtml += 
					'<li>' +
						'<a href="./order-detail.html?id='+data.items[i].uid+'">' +
							'<p class="order-time"><span class="order-time-blue">下单时间</span>：'+data.items[i].at+'</p>' +
							'<section class="cover">' +
								'<img src="'+data.items[i].ii+'">' +
							'</section>' +
							'<section class="detail">' +
								'<h2>'+data.items[i].n+'</h2>' +
								'<p>实付：'+data.items[i].is+'积分</p>' +
								'<p class="total">单价：'+data.items[i].ip+'积分&nbsp;&nbsp;数量：'+data.items[i].am +'</p>' +
							'</section>' +
						'</a>' +
					'</li>';
				}

				if(data.items.length >= this.pageSize){
					$(".more").removeClass('none');
				}else{
					$(".more").addClass('none');
				}
				$('.order-list').append($listHtml);
				$('.order-list').find('.empty').addClass('none');
			},

			initMore : function(){
				$(".more").click(function(){
					H.order.page ++;
					showLoading();
					getResult('api/mall/order/myrecord', {
						openid : openid,
						page : H.order.page,
						pageSize : H.order.pageSize
					}, 'callbackMallOrderMyRecord');
				});
			}

		};

		W.callbackMallOrderMyRecord = function(data) {
			hideLoading();
			if (data.code == 0) {
				H.order.initList(data);
			} else {
				// alert("网络错误，请刷新重试");
			}
		};

		W.callbackIntegralRankSelfRoundHandler = function(data){
			if(data.result == true){
				H.order.initHeader(data);
			}
		}

		

	})(Zepto);

	H.order.init();

});
