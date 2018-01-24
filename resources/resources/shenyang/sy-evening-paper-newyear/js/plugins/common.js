var __ns = function( fullNs ) {
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


// 从data_collect.js转移过来的
var recordUserLog = function(openid, operateDesc, operateDomId, loadingTime, flag) {
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "userlog",
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackDataHandler",
		data : {
			openId : openid,
			operateDesc : encodeURIComponent(operateDesc),
			operateDomId : operateDomId,
			loadingTime : loadingTime,
			from : gefrom,
			flag : flag
		}
	});
}
/**
 * 记录用户操作日志
 *
 * @param openid 操作用户的openid
 * @param operateDesc 中文描述做的事情
 * @param operateDomId 操作的元素的id
 */
var recordUserOperate = function(openid, operateDesc, operateDomId) {
	recordUserLog(openid, operateDesc, operateDomId, "", "false");
}
/**
 * 加载页面记录日志
 *
 * @param openid 操作用户的openid
 * @param operateDesc 进入的某页面名称
 * @param loadingTime 页面加载耗时多少毫秒
 */
function recordUserPage(openid, operateDesc, loadingTime) {
	recordUserLog(openid, operateDesc, "", loadingTime, "true");
}
// 从data_collect.js转移过来的 end

var callbackUserSaveHandler = function(data) {};


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
var gefrom = from || getQueryString("gefrom");

var toUrl = function(url) {
	shownewLoading();
	if (from != null && from != '') {
		if (url.indexOf(".html?") > 0) {
			url = url + "&gefrom=" + from;
		} else {
			url = url + "?gefrom=" + from;
		}
	};
	if (gefrom != null && gefrom != '') {
		if (url.indexOf("gefrom=") < 0) {
			if (url.indexOf(".html?") > 0) {
				url = url + "&gefrom=" + gefrom;
			} else {
				url = url + "?gefrom=" + gefrom;
			}
		}
	};
	var delay = Math.ceil(3000*Math.random() + 500);
	setTimeout(function(){window.location.href = url}, delay);
};

var getResult = function(url, data, callback, showloading, $target, isAsync) {

	if (showloading) {
		shownewLoading();
	}
	$.ajax({
		type : 'GET',
		async : typeof isAsync === 'undefined' ? false : isAsync,
		url : domain_url + url,
		data: data,
		dataType : "jsonp",
		jsonp : callback,
		complete: function() {
			if (showloading) {
				hidenewLoading();
			}
		},
		success : function(data) {}
	});
};
var getResultAsync = function(url, data, callback, showloading, $target) {
	if (showloading) {
		shownewLoading();
	}
	$.ajax({
		type : 'GET',
		async : true,
		url : domain_url + url,
		data: data,
		dataType : "jsonp",
		jsonp : callback,
		complete: function() {
			if (showloading) {
				hidenewLoading();
			}
		},
		success : function(data) {}
	});
};

function comptime(beginTime, endTime){
	var beginTimes=beginTime.substring(0,10).split('-');
	var endTimes=endTime.substring(0,10).split('-');
	beginTime=beginTimes[1]+'-'+beginTimes[2]+'-'+beginTimes[0]+' '+beginTime.substring(10,19);
	endTime=endTimes[1]+'-'+endTimes[2]+'-'+endTimes[0]+' '+endTime.substring(10,19);
	var a =(timestamp(endTime)-timestamp(beginTime))/3600/1000;
	if(a<0){
		return -1;
	}else if (a>0){
		return 1;
	}else if (a==0){
		return 0;
	}else{
		return -2
	}
}


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

var shownewLoading = function($container, tips) {
	var t = simpleTpl(), spinnerSize = 146,
		width = $(window).width(),
		height = $(window).height(),
		$container = $container || $('body'),
		$spinner = $container ? $container.find('#spinner') : $('body').children('#spinner'),
		tips = tips || '努力加载中...';

	if ($spinner.length > 0) {
		$spinner.empty();
	}
	t._('<div id="spinner" class="spinner">')
		._('<div class="new-spinner">')
		._('<div class="new-overlay"></div>')
		._('<div class="new-spinner-inner">')
		._('<p class="new-spinner-spinner"></p>')
		._('<p class="new-spinner-text">' + tips + '</p>')
		._('</div>')
		._('</div>')
		._('</div>')
		._('</div>');
	$spinner = $(t.toString()).css({'top': (height - spinnerSize) / 2, 'left': (width - spinnerSize) / 2});
	$container.append($spinner);
};

var hidenewLoading = function($container) {
	if ($container) {
		$container.find('.spinner').remove();
	} else {
		$('body').children('.spinner').remove();
	}
};

var aniTrue = true;
var showTips = function(word, pos, timer) {
	if (aniTrue) {
		aniTrue = false;
		var pos = pos || '2',
			timer = timer || 1500;
		$('body').append('<div class="tips none"></div>');
		$('.tips').css({
			'position': 'fixed' ,
			'max-width': '80%' ,
			'top': '60%' ,
			'left': '50%' ,
			'z-index': '99999999' ,
			'color': 'rgb(255, 255, 255)' ,
			'padding': '20px 10px' ,
			'border-radius': '5px' ,
			'margin-left': '-120px' ,
			'background': 'rgba(0, 0, 0, 0.8)' ,
			'text-align': 'center'
		});
		$('.tips').html(word);
		var winW = $(window).width(),
			winH = $(window).height();
		$('.tips').removeClass('none').css('opacity', '0');
		var tipsW = $('.tips').width(),
			tipsH = $('.tips').height();
		$('.tips').css({'margin-left': -tipsW/2,'top':(winH - tipsH)/(pos - 0.2)}).removeClass('none');
		$('.tips').animate({
			'opacity': '1',
			'top': (winH - tipsH)/pos}, 300, function() {
			setTimeout(function() {
				$('.tips').animate({'opacity':'0'}, 300, function() {
					$('.tips').addClass('none').css('top', (winH - tipsH)/(pos - 0.2));
				});
			}, timer);
			setTimeout(function() {
				$('.tips').remove();
				aniTrue = true;
			}, timer + 350);
		});
	};
};

var delQueStr = function (url, ref) //删除参数值
{
	var str = "";

	if (url.indexOf('?') != -1)
		str = url.substr(url.indexOf('?') + 1);
	else
		return url;
	var arr = "";
	var returnurl = "";
	var setparam = "";
	if (str.indexOf('&') != -1) {
		arr = str.split('&');
		for (i in arr) {
			if (arr[i].split('=')[0] != ref) {
				returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
			}
		}
		return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
	}
	else {
		arr = str.split('=');
		if (arr[0] == ref)
			return url.substr(0, url.indexOf('?'));
		else
			return url;
	}
}
var getUrl=function(openid) {
	var href = window.location.href;
	href = href.replace(/[^\/]*\.html/i, 'index.html');
	href = add_param(href, 'resopenid', hex_md5(openid), true);
	href = add_param(href, 'from', 'share', true);
	href = delQueStr(href, "openid");
	href = delQueStr(href, "headimgurl");
	href = delQueStr(href, "nickname");
	return add_yao_prefix(href);
}

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

var add_param = function (sourceUrl, parameterName, parameterValue, replaceDuplicates) {
	if ((sourceUrl == null) || (sourceUrl.length == 0)) {
		sourceUrl = document.location.href;
	}
	var urlParts = sourceUrl.split("?");
	var newQueryString = "";
	if (urlParts.length > 1) {
		var parameters = urlParts[1].split("&");
		for ( var i = 0; (i < parameters.length); i++) {
			var parameterParts = parameters[i].split("=");
			if (!(replaceDuplicates && parameterParts[0] == parameterName)) {
				if (newQueryString == "") {
					newQueryString = "?";
				} else {
					newQueryString += "&";
				}
				newQueryString += parameterParts[0] + "=" + parameterParts[1];
			}
		}
	}

	if (parameterValue !== null) {
		if (newQueryString == "") {
			newQueryString = "?";
		} else {
			newQueryString += "&";
		}
		newQueryString += parameterName + "=" + parameterValue;
	}
	return urlParts[0] + newQueryString;
}

var add_yao_prefix = function (url) {
	return 'http://yao.qq.com/tv/entry?redirect_uri=' + encodeURIComponent(url);
}

var is_android = function() {
	var ua = navigator.userAgent.toLowerCase();
	return ua.indexOf("android") > -1;
};

$(function() {
	var $copyright = $('.copyright');
	if($copyright){
		$copyright.html(copyright);
	}
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
			share_img = data.si;
			share_title = data.st;
			share_desc = data.sd;
			share_group = data.sgt;
			// 一键分享
			window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, getUrl(openid));
		},
		error : function() {
		}
	});


	// 从data_collect.js里转移过来的
	recordUserPage(openid, $('title').html(), "");
	$('body').delegate("*[data-collect='true']", "click", function(e) {
		e.preventDefault();

		if ($(this).attr('data-stoppropagation') == 'true') {
			e.stopPropagation();
		}
		recordUserOperate(openid, $(this).attr("data-collect-desc"), $(this).attr("data-collect-flag"));

		var href = $(this).attr('href');
		if (href && href !== '#') {
			shownewLoading();
			setTimeout(function() {
				window.location.href = href;
			}, 5);
		}
	});
});

