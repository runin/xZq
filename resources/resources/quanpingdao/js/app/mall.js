
(function($) {

		H.mall = {
			$tmpl : $('#tmpl_list'),
			page : 1,
			pageSize : 10,
			$scroll:true,
			init : function() {
				this.mallH();
				this.configFn();
				//this.getScore();
				this.getList();
				this.initMore();
			},
			
			mallH: function() {
				var wH = $(window).height();
				var logoH = $(".mall-logo").height()+15;
				var fH = $(".mall-foot").height();
				$(".mall-box").css("height",wH-logoH);
				$(".mall-con").css("height",wH-logoH-fH);
			},
			
			configFn: function() {//加载logo
				getResult('api/channelhome/config', {}, 'callbackChannelhomeConfigHandler');
			},
			
			//getScore : function(){
			//	getResult('api/lottery/integral/rank/self', {oi : openid}, 'callbackIntegralRankSelfRoundHandler');
			//},
			
			getList : function(){//数据列表
				H.mall.$scroll = false;
				getResult('api/mall/item/list', {page:H.mall.page, pageSize:H.mall.pageSize}, 'callbackStationCommMall');
			},


			initList : function(data){//数据列表html
				var t = simpleTpl();
				var items = data.items;
				
				for(var i=0,leg=items.length; i<leg; i++) {
					var mp = (items[i].mp)/100;
					t._('<li data-href="'+items[i].uid+'">')
					t._('<em class="host">HOT</em>')
					t._('<i style="background-image:url('+items[i].is+')"></i>')
					t._('<div class="mall-text">')
					t._('<h2>'+items[i].n+'</h2>')
					t._('<p>兑换积分：<label class="red">'+items[i].ip+'</label> <span>¥'+mp+'</span></p>')
					t._('</div>')
					t._('</li>')
				}
				$(".mall-ul").append(t.toString());
				this.hrefFn();
			},
			
			hrefFn: function() {
				$(".mall-ul li").click(function() {
					var uuid = $(this).attr("data-href");
					window.location.href='./exchange.html?uuid='+uuid;
				});
			},

			initMore : function(){//加载更多
				$(".mall-con").scroll(function() {
					if(H.mall.$scroll == false) {
						return;
					}
					
					setTimeout(function() {
						var u = $(".mall-ul").height();
						var h = $(".mall-con").height();
						var s = $(".mall-con").scrollTop();
						if(s>=(u-h)) {
							H.mall.page++;
							showLoading();
							H.mall.getList();
						}
					},2000);
				});
			}
		};

		W.callbackStationCommMall = function(data) {
			hideLoading();
			if (data.code == 0) {
				H.mall.initList(data);
				H.mall.$scroll = true;
			}else {
				alert("网络错误，请刷新重试");
			}
		};
		
		W.callbackChannelhomeConfigHandler = function(data) {//logo
			if(data && data.code==0) {
				var icon = data.icon;
				$(".mall-logo").css("background-image","url('"+icon+"')");
			}
		};

		H.mall.init();

})(Zepto);