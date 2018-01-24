(function($) {
	
	H.index = {
		
		init: function() {
			H.map.mapCreate();
		}	
			
	};
	
	H.map = {
		$map: $('#bdmaps'),
		mapValue: null,
		mapIndex: null,
		
		event: function(obj, eventType, fn, option) {
			var fnHandler = fn;
			if (!H.utils.isOwnEmpty(option)) {
				fnHandler = function(e) {
					fn.call(this, option);
				}
			}
			obj.each(function() {
				$(this).on(eventType, fnHandler);
			})
		},

		mapShow: function(option) {
			var str_data = $(this).attr('data-detal');
			option.detal = str_data != '' ? eval('(' + str_data + ')') : '';
			option.latitude = $(this).attr('data-latitude');
			option.longitude = $(this).attr('data-longitude');

			var detal = option.detal,
				latitude = option.latitude,
				longitude = option.longitude,
				fnOpen = option.fnOpen,
				fnClose = option.fnClose;

			H.utils.scrollStop();
			H.map.$map.addClass('show');
			$(document.body).css('scrollTop', 0);

			if ($(this).attr('data-mapindex') != H.map.mapIndex) {
				H.map.$map.html($('<div class="bk"><span class="s-bg-map-logo"></span></div>'));
				H.map.mapValue = false;
				H.map.mapIndex = $(this).attr('data-mapindex');

			} else {
				H.map.mapValue = true;
			}

			setTimeout(function() {
				if (H.map.$map.find('div').length >= 1) {
					H.map.$map.addClass("map-open");
					H.utils.scrollStop();

					setTimeout(function() {
						if (!H.map.mapValue) {
							H.map.addMap(detal, latitude, longitude, fnOpen, fnClose);
						}
					}, 500)
				} else return;
			}, 100);
		},

		mapSave: function() {
			$(window).on('webkitTransitionEnd transitionend', mapClose);
			H.utils.scrolStart();
			H.map.$map.removeClass("map-open");

			if (!H.map.mapValue) H.map.mapValue = true;

			function mapClose() {
				H.map.$map.removeClass('show');
				$(window).off('webkitTransitionEnd transitionend');
			}
		},

		//地图函数传值，创建地图
		addMap: function(detal, latitude, longitude, fnOpen, fnClose) {
			var detal = detal,
				latitude = Number(latitude),
				longitude = Number(longitude);

			var fnOpen = typeof(fnOpen) === 'function' ? fnOpen : '',
				fnClose = typeof(fnClose) === 'function' ? fnClose : '';

			//默认值设定
			var a = {
				sign_name: '',
				contact_tel: '',
				address: '天安门'
			};

			H.utils.isOwnEmpty(detal) ? detal = a : detal = detal;
			!latitude ? latitude = 39.915 : latitude = latitude;
			!longitude ? longitude = 116.404 : longitude = longitude;

			H.map.$map.bdmap({
				detal: detal, //地址值
				latitude: latitude, //纬度
				longitude: longitude, //经度
				fnOpen: fnOpen, //回调函数，地图开启前
				fnClose: fnClose //回调函数，地图关闭后
			});
		},

		mapCreate: function() {
			if ($('.bd-map').length <= 0) return;
			var node = $('.bd-map');

			var option = {
				fnOpen: H.utils.scrollStop,
				fnClose: H.map.mapSave
			};
			H.map.event(node, 'click', H.map.mapShow, option);
		}
	};
	
	H.utils = {
		isOwnEmpty: function(obj) {
			for (var name in obj) {
				if (obj.hasOwnProperty(name)) {
					return false;
				}
			}
			return true;
		},
		scrollStop: function() {
			$(window).on('touchmove.scroll', this.scrollControl);
			$(window).on('scroll.scroll', this.scrollControl);
		},
		scrolStart: function() {
			$(window).off('touchmove.scroll');
			$(window).off('scroll.scroll');
		},
		scrollControl: function(e) {
			e.preventDefault();
		},
	};
	
})(Zepto);

$(function() {
	H.index.init();
});