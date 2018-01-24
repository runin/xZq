(function($) {
	H.main = {
		init: function () {
			this.scroll();
			this.getAds();
			this.getRule();
			this.events();
		},
		events: function() {
			$('.btn-rule-close').tap(function(){
				$('.rule').hide();
			});
		},
		swiper: function() {
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				paginationClickable: '.swiper-pagination',
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev',
				spaceBetween: 30,
				effect: 'fade',
				loop: true,
			});
		},
		scroll: function() {
			var len = $('.lists p').length;
			var $ul = $('.lists');
			if(len > 1) {
				setInterval(function() {
					$ul.animate({'margin-top': '-40px'}, 1e3, function() {
						$ul.find('p:first').appendTo($ul)
						$ul.css({'margin-top': '0'});
					});
				}, 3000);
			};
		},
		getAds: function() {
			getResult('api/ad/get',{ areaNo: 'a001' }, 'callbackAdGetHandler');
			getResult('api/ad/get',{ areaNo: 'a002' }, 'callbackAdGetHandler');
			getResult('api/voteguess/inforoud',{}, 'callbackVoteguessInfoHandler');
		},
		getRule: function() {
			if (/index\.html/i.test(document.referrer)) {
				getResult('api/common/rule', {}, 'commonApiRuleHandler');
			}
		}
	};

	W.callbackAdGetHandler = function(data) {
		var _this = H.main;
		if (data.code == 0) {
			switch (data.an) {
				case "a001":
					if (data.ads) {
						$('.box1').show();
						var tpl = '';
						for (var i in data.ads) tpl += '<div class="swiper-slide" style="background-image:url(' + data.ads[i].p + ')"><a href="' + (data.ads[i].l || 'javascript:;') + '"></a></div>';
						$('.swiper-wrapper').html(tpl);
						_this.swiper();
					} else {
						$('.box1').hide();
					}
					break;
				case "a002":
					if (data.ads) {
						$('.box3').show();
						var tpl = '';
						for (var i in data.ads) tpl += '<a href="' + (data.ads[i].l || 'javascript:;') + '"><img src="' + data.ads[i].p + '"></a>';
						$('.gift').html(tpl);
					} else {
						$('.box3').hide();
					}
					break;
				default:
					break;
			}
		}
	};

	W.callbackVoteguessInfoHandler = function(data) {
		if (data.code == 0 && data.items) {
			var sTime = new Date(data.pst).getTime();
			var eTime = new Date(data.pet).getTime();
			if (data.cud <= sTime || data.cud >= eTime) return;
			var tpl = '';
			for (var a in data.items) {
				if (data.items[a].pitems) {
					for (var i in data.items[a].pitems) tpl += '<a href="vote.html?id=' + data.items[a].pitems[i].pid + '"><img src="' + data.items[a].pitems[i].im3 + '"></a>';
				}
			}
			$('.cp').html(tpl);
			$('.box2').show();
		}
	};

	W.commonApiRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			$('.rule .wrapper').html(data.rule);
			$('.rule').show();
		}
	};
})(Zepto);                             

$(function(){
	H.main.init();
	H.time.init();
});