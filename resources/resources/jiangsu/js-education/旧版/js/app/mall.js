
(function($) {

		H.mall = {
			$tmpl : $('#tmpl_list'),
			page : 1,
			pageSize : 10,

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
					leftCount = parseInt(data.items[i].ic,10) >= 0 ? (data.items[i].ic) + '件' :  '无限量';
					$listHtml += this.$tmpl.tmpl({
						link : './exchange.html?uuid='+data.items[i].uid,
						img : data.items[i].is,
						name : data.items[i].n,
						jifen : data.items[i].ip,
						price : data.items[i].mp / 1000,
						left : leftCount,
						sold : data.items[i].so,
					});
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

		H.mall.init();

})(Zepto);