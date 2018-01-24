//-------------//
//----排行榜----//

+(function($) {
	
	H.rank = {
		init: function() {
			this.rankingBtn();
		},
		rankingBtn: function() {
			$("#sign-ph-btn").click(function() {
				H.rank.rankingHtml();
			});
		},
		rankingHtml: function() {
			var t = simpleTpl();
			t._('<section class="pop-bg">')
			t._('<div class="ranking in-up">')
			t._('<a href="javascript:void(0)" class="ranking-close">X</a>')
			t._('<div class="ranking-top">')
			t._('<ul class="ranking-tab">')
			t._('<li id="t-one">每日福荔榜</li>')
			t._('<li class="none" id="t-two">大奖Top10</li>')
			t._('</ul>')
			t._('</div>')
			t._('<div class="ranking-list">')
			
			t._('<div class="ranking-box">')
			t._('<div class="every-day">')
			t._('<p>我的福荔币数量 <label id="my-flb">0</label>&nbsp;&nbsp;&nbsp;排名 <label id="my-pm">0</label></p>')
			t._('<ul class="ranking-list-head">')
			t._('<li>昵称</li>')
			t._('<li>福荔币</li>')
			t._('<li>名次</li>')
			t._('</ul>')
			t._('</div>')
			t._('<div class="ranking-list-con">')
			t._('<ul id="ranking-box-a">')
			
			t._('</ul>')
			t._('</div>')
			t._('</div>')
			
			t._('<div class="ranking-box none">')
			t._('<div class="ranking-ten">')
			t._('<ul id="advert-top">')
			
			t._('</ul>')
			t._('</div>')
			t._('</div>')
			
			t._('</div>')
			t._('</div>')
			t._('</section>')
			
			$("body").append(t.toString());
			window.self();
			$("#my-flb").text(window.jf);
			$("#my-pm").text(window.pm);
			this.tabFn();
			this.fulibangFn();
			//this.advertFn();
			H.index.closeFn(".ranking-close",".ranking");
		},
		tabFn: function() {
			$(".ranking-tab>li").click(function() {
				if($(this).attr("id") == "t-one") {
					$(".ranking-top").removeClass("on");
					$(".ranking-list>.ranking-box").eq(0).removeClass("none").siblings().addClass("none");
				}else {
					$(".ranking-top").addClass("on");
					$(".ranking-list>.ranking-box").eq(1).removeClass("none").siblings().addClass("none");
				}
			});
		},
		fulibangFn: function() {//查询总积分排行Top10
			getResult('api/tvintegral/rank/channeltop', {}, 'callbackTvChannelRank20TopsHandler');
		},
		advertFn: function() {//大奖Top10
			getResult('api/ad/get', {areaNo:ad_id}, 'callbackAdGetHandler');
		}
	};

	W.callbackTvChannelRank20TopsHandler = function(data) {
		var t = simpleTpl();
		if(data && data.result==true) {
			var tops = data.tops;
			for(var i=0, leg=tops.length; i<leg; i++) {
				var img,nn;
				if(tops[i].in) {
					img = tops[i].hi+"/64"
				}else {
					img = "images/avatar.jpg";
				}
				if(tops[i].nn) {
					nn = tops[i].nn
				}else {
					nn = "匿名";
				}
				t._('<li>')
				t._('<div><img src="'+img+'" /><span>'+nn+'</span></div>')
				t._('<div>'+tops[i].in+'</div>')
				t._('<div>第'+tops[i].rk+'名</div>')
				t._('</li>')
			}
			$("#ranking-box-a").append(t.toString());
		}
	};
	W.callbackAdGetHandler = function(data) {
		var t = simpleTpl();
		if(data && data.code==0) {
			var ads = data.ads;
			for(var i=0, leg=ads.length; i<leg; i++) {
				var m = i+1;
				t._('<li>')
				if(i==0) {
					t._('<div class="st-img" style="background-color:#5a8508">'+m+'</div>')
				}else {
					t._('<div class="st-img">'+m+'</div>')
				}
				t._('<div class="st-con">')
				t._('<h2>中奖者： <lable>'+ads[i].t+'</lable></h2>')
				t._('<p>'+ads[i].c+'</p>')
				t._('</div>')
				t._('</li>')
			}
			$("#advert-top").append(t.toString());
		}
	};

	H.rank.init();

})(Zepto);