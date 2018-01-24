var callbackUserSaveHandler = function(data) {};

var resourceType = "1";

var COMMON_SYSTEM_ERROR_TIP = "系统繁忙，请稍候再试！";

var getQueryString = function( name ) {
    var currentSearch = decodeURIComponent( location.search.slice( 1 ) );
    if ( currentSearch != '' ) {
        var paras = currentSearch.split( '&' );
        for ( var i = 0, l = paras.length, items; i < l; i++ ) {
            items = paras[i].split( '=' );
            if ( items[0] === name) {
                return items[1];
            }
        }
        return '';
    }
    return '';
};

var from = getQueryString("from");
var gefrom = getQueryString("gefrom");
if (from != null && from != '') {
	gefrom = from;
}
// 在需要分享后，返回首页的页面运行此方法
var noRunShare = $("#noRunShare").val();
if (!noRunShare) {
	if (from != null && from != '' && window.location.pathname.indexOf("index.html") < 0) {
		//location.href = "index.html?from=" + from;
	}
}
function toUrl(url) {
	if (from != null && from != '') {
		if (url.indexOf(".html?") > 0) {
			url = url + "&gefrom=" + from;
		} else {
			url = url + "?gefrom=" + from;
		}
	}
	if (gefrom != null && gefrom != '') {
		if (url.indexOf("gefrom=") < 0) {
			if (url.indexOf(".html?") > 0) {
				url = url + "&gefrom=" + gefrom;
			} else {
				url = url + "?gefrom=" + gefrom;
			}
		}
	}
	setTimeout("window.location.href='" + url + "'", 5);
}

$(function() {
	$("script").each(function(i, item) {
		var scr = $(this).attr("src");
		$(this).attr("src", scr + "?v=" + version);
	});
	$("link").each(function(i, item) {
		var href = $(this).attr("href");
		$(this).attr("href", href + "?v=" + version);
	});
	
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "version/check",
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackVersionHandler",
		success : function(data) {
			if(!data.result){
				location.href = data.redirect;
			}
			/*
			share_img = data.si;
			share_title = data.st;
			share_desc = data.sd;
			share_group = data.sgt;
			*/
		},
		error : function() {}
	});
});

var getResult = function(url, data, callback, showloading, $target) {
	if (showloading) {
		showLoading($target);
	}
	$.ajax({
		type : 'GET',
		async : false,
		url : domain_url + url,
		data: data,
		dataType : "jsonp",
		jsonp : callback,
		complete: function() {
			if (showloading) {
				hideLoading($target);
			}
		},
		success : function(data) {}
	});
};

var simpleTpl = function( tpl ) {
    tpl = $.isArray( tpl ) ? tpl.join( '' ) : (tpl || '');

    return {
        store: tpl,
        _: function() {
            var me = this;
            $.each( arguments, function( index, value ) {
                me.store += value;
            } );
            return this;
        },
        toString: function() {
            return this.store;
        }
    };
};

var normalDate = function(stamp, format, zero) {
    var stamp = Number(stamp),
    date = new Date(stamp), formatDate,
    format = format ? format : "yyyy-mm-dd hh:ii:ss",
    zero = (zero === undefined) ? true : zero,
    dateNum = function(num) { return num < 10 ? '0' + num : num; },
    _d = zero ? dateNum : function(s){return s;};

	var year = _d(date.getFullYear()),
	    month = _d(date.getMonth() + 1),
	    day = _d(date.getDate()),
	    hour = _d(date.getHours()),
	    minute = _d(date.getMinutes()),
	    second = _d(date.getSeconds());
	
	formatDate = format.replace(/yyyy/i, year).replace(/mm/i, month).replace(/dd/i, day)
	            .replace(/hh/i, hour).replace(/ii/i, minute).replace(/ss/i, second);
	return formatDate;
};

var share = function(backUrl) {
	var t = simpleTpl(),
		$share_box = $('#share_box');
	
	if ($share_box.length == 0) {
		t._('<div class="share_box" id="share_box"></div>');
		$share_box = $(t.toString());
		$share_box.click(function(e) {
			$(this).hide();
		});
		$('body').append($share_box);
	} else {
		$share_box.show();
	}
};

var str2date = function(str) {
	str = str.replace(/-/g, '/');
	return new Date(str);
};

var timestamp = function(str) {
	return Date.parse(str2date(str));
};

// yyyy年MM月dd日 hh:mm:ss
var dateformat = function(date, format) {
	var z = {
		M : date.getMonth() + 1,
		d : date.getDate(),
		h : date.getHours(),
		m : date.getMinutes(),
		s : date.getSeconds()
	};
	format = format.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
		return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
	});
	return format.replace(/(y+)/g, function(v) {
		return date.getFullYear().toString().slice(-v.length)
	});
}

var showLoading = function($container) {
	var t = simpleTpl(),
		$container = $container || $('body'),
		$spinner = $container ? $container.find('.spinner') : $('body').children('.spinner');
	
	if ($spinner.length > 0) {
		$spinner.show();
	} else {
		t._('<div class="spinner">')
			._('<div class="spinner-wrapper">')
			  ._('<div class="spinner-container container1">')
			    ._('<div class="circle1"></div>')
			    ._('<div class="circle2"></div>')
			    ._('<div class="circle3"></div>')
			    ._('<div class="circle4"></div>')
			  ._('</div>')
			  ._('<div class="spinner-container container2">')
			    ._('<div class="circle1"></div>')
			    ._('<div class="circle2"></div>')
			    ._('<div class="circle3"></div>')
			    ._('<div class="circle4"></div>')
			  ._('</div>')
			  ._('<div class="spinner-container container3">')
			    ._('<div class="circle1"></div>')
			    ._('<div class="circle2"></div>')
			    ._('<div class="circle3"></div>')
			    ._('<div class="circle4"></div>')
			  ._('</div>')
		  ._('</div>')
		._('</div>');
		
		var width = $(window).width(),
			height = $(window).height(),
			spinnerSize = 50;
		$spinner = $(t.toString()).css({'left': (width - spinnerSize) / 2, 'top': (height - spinnerSize) / 2});
		$container.append($spinner);
	}
};

var hideLoading = function($container) {
	if ($container) {
		$container.find('.spinner').hide();
	} else {
		$('body').children('.spinner').hide();
	}
	$('.copyright').removeClass('hidden');
};

(function($) {
	$.fn.progress = function(options) {
		var defaultVal = { 
			// 存放结束时间
			eAttr : 'data-etime',
			sAttr : 'data-stime', // 存放开始时间
			pAttr : 'data-ptime', // 结果公布时间
			wTime : 3000, // 以3000毫秒为单位进行演算
			index: 0,
			callback: null,
			stCallback: null,
			sdCallback: null,
			otCallback: null,
			ptCallback: null
		};
		var dateNum = function(num) {
			return num < 10 ? '0' + num : num;
		};
		var s = $.extend(defaultVal, options);
		var timeInterval = 0;
		var vthis = $(this);
		var width = $(window).width();
		var runTime = function() {
			vthis.each(function() {
				var serverTime = window['server_time'];
				var nthis = $(this);
				var sorgT = parseInt(nthis.attr(s.sAttr));
				var eorgT = parseInt(nthis.attr(s.eAttr));
				var porgT = parseInt(nthis.attr(s.pAttr));
				var sT = isNaN(sorgT) ? 0 : sorgT - serverTime;
				var eT = isNaN(eorgT) ? 0 : eorgT - serverTime;
				var pT = isNaN(porgT) ? 0 : porgT - serverTime;
				var dT = (isNaN(sorgT) || isNaN(eorgT)) ? 0 : eorgT - sorgT;
				var state = 0;
				if (sT > 0) {// 即将开始
					state = 1;
					W['pages_info'][s.index]['state'] = state;
					s.stCallback && s.stCallback(state);
					
				} else if (eT > 0) {//即将结束
					state = 2;
					W['pages_info'][s.index]['state'] = state;
					s.sdCallback && s.sdCallback(state);
					
				} else if (pT <= 0) {// 结果公布
					state = 4;
					// clearInterval(timeInterval);
					W['pages_info'][s.index]['state'] = state;
					s.ptCallback && s.ptCallback(state);
					
				} else {// 比赛结束
					state = 3;
					W['pages_info'][s.index]['state'] = state;
					s.otCallback && s.otCallback(state);
				}
				
				nthis.closest('.page').attr('data-state', state);
				s.callback && s.callback(state);
			});
		};
		
		runTime();
		timeInterval = setInterval(function() {
			runTime();
		}, s.wTime);
	};
})(Zepto);


// 倒计时
(function($) {
	$.fn.countDown = function(options) {
		var defaultVal = { 
			// 存放结束时间
			eAttr : 'data-etime',
			sAttr : 'data-stime', // 存放开始时间
			wTime : 500, // 以500毫秒为单位进行演算
			stpl : '%H%:%M%:%S%', // 还有...开始
			etpl : '%H%:%M%:%S%', // 还有...结束
			otpl : '已结束', // 过期显示的文本模版
			callback: function() {}
		};
		var dateNum = function(num) {
			return num < 10 ? '0' + num : num;
		};
		var s = $.extend(defaultVal, options);
		var vthis = $(this);
		var runTime = function() {
			var serverTime = window['server_time'];
			vthis.each(function() {
				var nthis = $(this);
				var sorgT = parseInt(nthis.attr(s.sAttr));
				var eorgT = parseInt(nthis.attr(s.eAttr));
				var sT = isNaN(sorgT) ? 0 : sorgT - serverTime;
				var eT = isNaN(eorgT) ? 0 : eorgT - serverTime;
				var showTime = function(rT, showTpl) {
					var s_ = Math.round((rT % 60000) / s.wTime);
					s_ = dateNum(Math.min(Math.floor(s_ / 1000 * s.wTime), 59));
					var m_ = dateNum(Math.floor((rT % 3600000) / 60000));
					var h_ = dateNum(Math.floor((rT % 86400000) / 3600000));
					var d_ = dateNum(Math.floor(rT / 86400000));
					nthis.html(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
				};
				var state = 1;
				if (sT > 0) {	// 还未开始
					showTime(sT, s.stpl);
				} else if (eT > 0) {	// 即将结束
					state = 2;
					showTime(eT, s.etpl);
				} else {			// 已结束
					state = 3;
					nthis.html(s.otpl);
				}
				s.callback && s.callback(state);
			});
		};
		
		setInterval(function() {
			runTime();
		}, s.wTime);
	};
})(Zepto);


var imgReady = (function () {
    var list = [], intervalId = null,

    // 用来执行队列
    tick = function () {
        var i = 0;
        for (; i < list.length; i++) {
            list[i].end ? list.splice(i--, 1) : list[i]();
        }
        ;
        !list.length && stop();
    },

    // 停止所有定时器队列
    stop = function () {
        clearInterval(intervalId);
        intervalId = null;
    };

    return function (url, ready, load, error) {
        var onready, width, height, newWidth, newHeight,
            img = new Image();

        img.src = url;

        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            ready.call(img);
            load && load.call(img);
            return;
        }
        ;

        width = img.width;
        height = img.height;

        // 加载错误后的事件
        img.onerror = function () {
            error && error.call(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };

        // 图片尺寸就绪
        onready = function () {
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height ||
                // 如果图片已经在其他地方加载可使用面积检测
                newWidth * newHeight > 1024
                ) {
                ready.call(img);
                onready.end = true;
            }
            ;
        };
        onready();

        // 完全加载完毕的事件
        img.onload = function () {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();

            load && load.call(img);

            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };

        // 加入队列中定期执行
        if (!onready.end) {
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (intervalId === null) intervalId = setInterval(tick, 40);
        };
    };
})();

var add_yao_prefix = function(url) {
	return 'http://yao.qq.com/tv/entry?redirect_uri=' + encodeURIComponent(url);
};

var is_android = function() {
	var ua = navigator.userAgent.toLowerCase();
	return ua.indexOf("android") > -1;
};

function __ns( fullNs ) {
    var nsArray = fullNs.split( '.' );
    var evalStr = '';
    var ns = '';
    for ( var i = 0, l = nsArray.length; i < l; i++ ) {
        i !== 0 && ( ns += '.' );
        ns += nsArray[i];
        evalStr += '( typeof ' + ns + ' === "undefined" && (' + ns + ' = {}) );';
    }
    evalStr !== '' && eval( evalStr );
}

var __noop = function() {};
var W = W || window;

__ns('H');

