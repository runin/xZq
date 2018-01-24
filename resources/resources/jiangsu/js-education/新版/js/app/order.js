$(function() {

	(function($) {

		H.order = {

			page : 1,
			pageSize : 20,
			$tmpl: $('#tmpl_list'),

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
					$listHtml += this.$tmpl.tmpl({
						link: './order-detail.html?id='+data.items[i].uid,
						time: data.items[i].at,
						img: data.items[i].ii,
						name: data.items[i].n,
						pay: data.items[i].is,
						score: data.items[i].ip,
						num: data.items[i].am
					});
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
				$(".more").tap(function(){
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
