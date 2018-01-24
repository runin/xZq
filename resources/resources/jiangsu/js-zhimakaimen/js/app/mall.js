$(function() {

	(function($) {

		H.mall = {

			page : 1,
			pageSize : 20,

			init : function() {
				$(".wrapper").css('min-height',$(window).height());
				$(".mall-wrapper").css('min-height', $(window).height() - 104 - 37 - 46);

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

			
			getList : function(){
				showLoading();
				getResult('api/mall/item/list', {
					page : H.mall.page,
					pageSize : H.mall.pageSize
				}, 'callbackStationCommMall');
			},

			initHeader: function(data){
				if(data.in >= 0){
					$(".score").html("我的积分：" + data.in);	
				}
			},


			initList : function(data){
				$listHtml = "";
				for(var i in data.items){
					$leftCount = parseInt(data.items[i].ic,10) >= 0 ? (data.items[i].ic) + '件' :  '无限量';
					$listHtml += 
					'<li>' +
						'<a data-collect="true" data-collect-flag="zhimakaimen-mall-itemview" data-collect-desc="芝麻开门-商城-点击商品" href="./exchange.html?uuid='+data.items[i].uid+'">' +
							'<section class="cover">' +
								'<img src="'+data.items[i].is+'">' +
							'</section>' +
							'<section class="detail">' +
								'<h2>'+data.items[i].n+'</h2>' +
								'<p>兑换积分：'+data.items[i].ip+'&nbsp;&nbsp;<s>￥'+data.items[i].mp / 1000+'</s></p>' +
								'<p>剩余：'+ $leftCount +'  已兑换：'+data.items[i].so+'件</p>' +
							'</section>' +
						'</a>' +
					'</li>';
				}
				if(data.items.length < this.pageSize){
					$(".more").addClass('none');
				}else{
					$(".more").removeClass('none');
				}
				$('.mall-list').append($listHtml);
			},

			initMore : function(){
				$(".more").click(function(){
					H.mall.page ++;
					showLoading();
					getResult('api/mall/item/list', {
						page : H.mall.page,
						pageSize : H.mall.pageSize
					}, 'callbackStationCommMall');
				});
			}

		};

		W.callbackStationCommMall = function(data) {
			hideLoading();
			if (data.code == 0) {
				H.mall.initList(data);
			} else {
				alert("网络错误，请刷新重试");
			}
		};

		W.callbackIntegralRankSelfRoundHandler = function(data){
			if(data.result == true){
				H.mall.initHeader(data);
			}
		}

		

	})(Zepto);

	H.mall.init();

});
