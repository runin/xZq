/**
 * Created by Administrator on 2014/7/27.
 */
var resourceType = "1";
var share_img, share_title, share_desc, share_group;
var COMMON_SYSTEM_ERROR_TIP = "系统繁忙，请稍候再试！";

/* 此处有bug
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}*/
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
		location.href = "index.html?from=" + from;
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
	
	var height = $(window).height();
	$('.main').css('minHeight', height - 40);
	
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
			share_img = data.si;
			share_title = data.st;
			share_desc = data.sd;
			share_group = data.sgt;
		},
		error : function() {
		}
	});
	
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "user/save",
		data : {
			openid : openid,
			type : resourceType,
			userProfile : userProfile
		},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackUserHandler",
		success : function(data) {
		},
		error : function() {
		}
	});
});

var getResult = function(url, data, callback, showloading) {
	if (showloading) {
		showLoading();
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
				hideLoading();
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
	var t = simpleTpl();
	t._('<div class="share_box ">')
	   	._('<a href="#" class="back_btn" data-collect="true" data-collect-flag="portal-share-dialog-back" data-collect-desc="分享弹层 返回"></a>')
	   	._('<a href="#" class="refresh_btn" data-collect="true" data-collect-flag="portal-share-dialog-refresh" data-collect-desc="分享弹层 刷新"></a>')
	._('</div>');
	
	$('body').append(t.toString()).delegate('.back_btn', 'click', function() {
		if (backUrl) {
			location.href = backUrl;
		} else {
			 window.history.go(-1);
		}
	}).delegate('.refresh_btn', 'click', function() {
		location.reload();
	});
	
	
};

var cidValid = function(cid) {
	var aCity = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新Unbsp;疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};

	function valid(sId) {
		var iSum = 0;
		var info = ""
			
		sId = sId.replace(/x$/i, "a");
			
		if (aCity[parseInt(sId.substr(0, 2))] == null) {
			return false;
		}
			
		sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
		var d = new Date(sBirthday.replace(/-/g, "/"));
		if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
			return false;
		}
			
		for ( var i = 17; i >= 0; i--) {
			iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
		}
			
		if (iSum % 11 != 1) {
			return false;
		}
		return true;
		//return aCity[parseInt(sId.substr(0, 2))] + "," + sBirthday + "," + (sId.substr(16, 1) % 2 ? " 男" : "女")
	}
	return valid(cid);
};

var timestamp = function(str) {
    str = str.replace(/-/g, '/');
	var timestamp = Date.parse(new Date(str));
	return timestamp / 1000;
};

var showLoading = function() {
	var t = simpleTpl(),
		$spinner = $('#spinner');
	
	$('.main, .copyright').addClass('hidden');
	if ($spinner.length > 0) {
		$spinner.show();
	} else {
		
		t._('<div class="spinner" id="spinner">')
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
		$('body').append($spinner);
	}
};

var hideLoading = function() {
	$('#spinner').hide();
	$('.main, .copyright').removeClass('hidden');
};

(function($) {
	$.fn.countDown = function(options) {
		var defaultVal = { 
			// 存放结束时间
			eAttr : 'etime',
			sAttr : 'stime', // 存放开始时间
			wTime : 100, // 以100毫秒为单位进行演算
			etpl : '%H%:%M%:%S%', // 还有...结束
			stpl : '%H%:%M%:%S%', // 还有...开始
			sdtpl : '已开始',
			otpl : '已结束', // 过期显示的文本模版
			stCallback: null,
			sdCallback: null,
			otCallback: null
		};
		var dateNum = function(num) {
			return num < 10 ? '0' + num : num;
		};
		var s = $.extend(defaultVal, options);
		var vthis = $(this);
		var runTime = function() {
			var nowTime = new Date().getTime();
			vthis.each(function() {
				var nthis = $(this);
				var sorgT = parseInt(nthis.attr(s.sAttr)) * 1000;
				var eorgT = parseInt(nthis.attr(s.eAttr)) * 1000;
				var sT = isNaN(sorgT) ? 0 : sorgT - nowTime;
				var eT = isNaN(eorgT) ? 0 : eorgT - nowTime;
				var showTime = function(rT, showTpl) {
					var s_ = Math.round((rT % 60000) / s.wTime);
					s_ = dateNum(Math.round(s_ / 1000 * s.wTime));
					var m_ = dateNum(Math.floor((rT % 3600000) / 60000));
					var h_ = dateNum(Math.floor((rT % 86400000) / 3600000));
					var d_ = dateNum(Math.floor(rT / 86400000));
					nthis.html(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
				};
				if (sT > 0) {
					showTime(sT, s.stpl);
					s.stCallback && s.stCallback();
				} else if (eT > 0) {
					showTime(eT, s.sdtpl);
					s.sdCallback && s.sdCallback();
				} else {
					nthis.html(s.otpl);
					s.otCallback && s.otCallback();
				}

			});
		};
		
		setInterval(function() {
			runTime();
		}, s.wTime);
	};
})(jQuery);


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
