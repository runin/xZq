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
};
var W = W || window;
__ns('H');


// 从data_collect.js转移过来的_S
var recordUserLog = function(openid, operateDesc, operateDomId, loadingTime, flag) {
	$.ajax({
		type : "get",
		async : true,
		url : domain_url + "api/common/reportlog" + dev,
		dataType : "jsonp",
		jsonp : "callback",
		data : {
			openid : openid,
			operateDesc : encodeURIComponent(operateDesc),
			operateDomId : operateDomId,
			loadingTime : loadingTime,
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
// 从data_collect.js转移过来的_E

/**
 * 获取连接参数的值
 * @param name 参数名
 * @returns {*}
 */
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
/**
 * 给链接后增加参数
 * @param sourceUrl 链接地址
 * @param parameterName 参数名
 * @param parameterValue 参数值
 * @param replaceDuplicates 是否替换原值
 * @returns {string}
 */
var add_param = function(sourceUrl, parameterName, parameterValue, replaceDuplicates) {
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
};
/**
 * 删除链接参数
 * @param url 链接地址
 * @param ref 参数名
 * @returns {*}
 */
var delQueStr = function(url, ref){
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
};
/**
 * 替换链接参数的值
 * @param href 链接地址
 * @param paramName 参数名
 * @param replaceWith 替换后的参数值
 * @returns {XML|void|string}
 */
var replaceParamVal = function(href,paramName,replaceWith) {
	var re=eval('/('+ paramName+'=)([^&]*)/gi');
	var nUrl = href.replace(re,paramName+'='+replaceWith);
	return nUrl;
};

/**
 * showLoading
 * @param $container 父元素
 * @param tips 提示信息
 */
var shownewLoading = function($container, tips) {
	var t = simpleTpl(),
		width = $(window).width(),
		height = $(window).height(),
		$container = $container || $('body'),
		$loading = $container ? $container.find('#qy_loading') : $('body').children('#qy_loading'),
		tips = tips || '努力加载中...';

	if ($loading.length > 0) {
		$loading.remove();
	};
	t._('<section id="qy_loading" class="qy-loading">')
		._('<section class="qy-loading-logo">')
		._('<section class="qy-logo-1"></section>')
		._('<section class="qy-logo-2"></section>')
		._('</section>')
		._('<section class="qy-loading-tips">' + tips+ '</section>')
		._('</section>')
	$container.append(t.toString());
};
/**
 * 隐藏loadding
 * @param $container 父元素
 */
var hidenewLoading = function($container) {
	if ($container) {
		$container.find('#qy_loading').remove();
	} else {
		$('body').children('#qy_loading').remove();
	};
};

/**
 * 延迟地址跳转
 * @param url 链接地址
 */
var toUrl = function(url) {
	shownewLoading(null, '请稍后...');
	var delay = Math.ceil(1000*Math.random() + 1000);
	setTimeout(function(){window.location.href = url}, delay);
};

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

/**
 * 获取当天的多少天之前的日期字符串
 * @param n 天数
 * @returns {string|*} yyyy-mm-dd
 */
var getBeforeDate = function(n){
	var n = n;
	var d = new Date();
	var year = d.getFullYear();
	var mon=d.getMonth()+1;
	var day=d.getDate();
	if(day <= n){
		if(mon>1) {
			mon=mon-1;
		}
		else {
			year = year-1;
			mon = 12;
		}
	}
	d.setDate(d.getDate()-n);
	year = d.getFullYear();
	mon=d.getMonth()+1;
	day=d.getDate();
	s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);
	return s;
};
/**
 * 將毫秒轉化為yyyy-MM-dd HH:mm:ss格式的日期
 * @param TimeMillis 时间戳
 * @returns {string}
 */
var  timeTransform = function(TimeMillis){
	var data = new Date(TimeMillis);
	var year = data.getFullYear();  //获取年
	var month = data.getMonth()>=9?(data.getMonth()+1).toString():'0' + (data.getMonth()+1);//获取月
	var day = data.getDate()>9?data.getDate().toString():'0' + data.getDate(); //获取日
	var hours = data.getHours()>9?data.getHours().toString():'0' + data.getHours();
	var minutes = data.getMinutes()>9?data.getMinutes().toString():'0' + data.getMinutes();
	var ss = data.getSeconds()>9?data.getSeconds().toString():'0' + data.getSeconds();
	var time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":"+ ss;
	return time;
};
/**
 * 时间戳时间格式化
 * @param stamp 时间戳
 * @param format 格式
 * @param zero 是否用0补齐
 * @returns {string|*}
 */
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
/**
 * 把字符串转换成Date对象
 * @param str
 * @returns {Date}
 */
var str2date = function(str) {
	str = str.replace(/-/g, '/');
	return new Date(str);
};
/**
 * 获取字符串格式之间的时间戳
 * @param str
 * @returns {number}
 */
var timestamp = function(str) {
	var timestamp = Date.parse(str2date(str));
	return timestamp;
};

/**
 * 日期对象格式化
 * @param date
 * @param format
 * @returns {XML|string}
 */
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
};

var dateNum = function(num) {
	return num < 10 ? '0' + num : num;
};
/**
 * 时间比较
 * @param beginTime yy-mm-dd hh:mm:ss
 * @param endTime yy-mm-dd hh:mm:ss
 * @returns {number}return -1   beginTime > endTime
                    return 0    beginTime = endTime
                    return 1    beginTime < endTime
 */
var comptime = function(beginTime, endTime){
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
};

/**
 * 共用接口调用
 * @param url 接口路径 不包含 domain_url
 * @param data 传递参数
 * @param callback callback函数名
 * @param showloading 是否显示loadding
 * @param isAsync false同步 true异步
 */
var getResult = function(url, data, callback, showloading, isAsync) {

	if (showloading) {
		shownewLoading();
	}
	$.ajax({
		type : 'GET',
		async : typeof isAsync === 'undefined' ? false : isAsync,
		url : domain_url + url + dev,
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

/**
 * 字符串拼接
 * @param tpl
 * @returns {{store: *, _: _, toString: toString}}
 */
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

/**
 * showTips
 * @param word 提示信息
 * @param pos 位置
 * @param timer 停留时间
 */
var showTipsFlag = true;
var showTips = function(tips, timer) {
	if (tips == undefined) return;
	if (showTipsFlag) {
		showTipsFlag = false;
		$('body').append('<div class="showTips" style="position:fixed;max-width:80%;z-index:999999999999;color:#FFF;padding:15px 18px;font-size:17px;border-radius:3px;background:rgba(0,0,0,.7);text-align:center;opacity:0">' + tips + '</div>');
		var winW = $(window).width(), winH = $(window).height(), tipsW = $('.showTips').width(), tipsH = $('.showTips').height(), timer = timer || 1200;
		$('.showTips').css({'left':(winW - tipsW)/2, 'top':(winH - tipsH)/2}).animate({'opacity': '1'}, 300, function() {
			setTimeout(function() {
				$('.showTips').animate({'opacity':'0'}, 100, function() {
					$('.showTips').remove();
					showTipsFlag = true;
				});
			}, timer);
		});
	};
};
/**
 * 返回给定范围内的随机数
 * @param min 范围下限（包含）
 * @param max 范围上限（不包含）
 * @returns {Number}
 */
var getRandomArbitrary = function(min, max) {
	return parseInt(Math.random()*(max - min)+min);
};

var add_yao_prefix = function(url) {
	return 'http://yao.qq.com/tv/entry?redirect_uri=' + encodeURIComponent(url);
};
/**
 * 客户端是否andriod系统
 * @returns {boolean}
 */
var is_android = function() {
	var ua = navigator.userAgent.toLowerCase();
	return ua.indexOf("android") > -1;
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
			otpl : '活动已结束', // 过期显示的文本模版
			stCallback: null,
			sdCallback: null,
			otCallback: null
		};
		var dateNum = function(num) {
			return num < 10 ? '0' + num : num;
		};
		var subNum = function(num){
			numF = num.toString().substring(0,1);
			numS = num.toString().substring(1,num.length);
			return num = "<label>"+ numF + numS + "</label>";
		};
		var s = $.extend(defaultVal, options);
		var vthis = $(this);
		var runTime = function() {
			var nowTime = new Date().getTime();
			vthis.each(function() {
				var nthis = $(this);
				var sorgT = parseInt(nthis.attr(s.sAttr));
				var eorgT = parseInt(nthis.attr(s.eAttr));
				var sT = isNaN(sorgT) ? 0 : sorgT - nowTime;
				var eT = isNaN(eorgT) ? 0 : eorgT - nowTime;
				var showTime = function(rT, showTpl) {
					var s_ = Math.round((rT % 60000) / s.wTime);
					// s_ = subNum(dateNum(Math.round(s_ / 1000 * s.wTime)));
					s_ = subNum(dateNum(Math.min(Math.floor(s_ / 1000 * s.wTime), 59)));
					var m_ = subNum(dateNum(Math.floor((rT % 3600000) / 60000)));
					var h_ = subNum(dateNum(Math.floor((rT % 86400000) / 3600000)));
					var d_ = subNum(dateNum(Math.floor(rT / 86400000)));
                    if (h_ == "<label>00</label>") {
                        $('.countdown').addClass('hour');
                    } else {
                        $('.countdown').removeClass('hour');
                    }
					nthis.html(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
				};
				if (sT > 0) {
					showTime(sT, s.stpl);
					s.stCallback && s.stCallback();
				} else if (eT > 0) {
					showTime(eT, s.etpl);
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
	$.fn.marqueen = function(options){
		$.fn.marqueen.defalut = {
			mode: "top",
			speed: 50,
			container: ".marqueen ul",
			row: 1,
			defaultIndex: 0,
			fixWidth: 0
		};
		return this.each(function(){
			var opts = $.extend({}, $.fn.marqueen.defalut, options);
			var index = opts.defaultIndex;
			var oldIndex = index;
			var fixWidth = opts.fixWidth;
			var container = $(opts.container, $(this));
			var containerSize = container.children().size();
			var slideH = 0;
			var slideW = 0;
			var selfW = 0;
			var selfH = 0;
			var flag = null;

			if(containerSize < opts.row) return;
			container.children().each(function(){
				if($(this).width() > selfW){
					selfW = $(this).width();
					slideW = $(this).width() + fixWidth;
				}
				if($(this).height() > selfH){
					selfH = $(this).height();
					slideH = $(this).height();
				}
			});
			switch(opts.mode){
				case "left":
					container.children().clone().appendTo(container).clone().prependTo(container);
					container.wrap('<div class="mqWrapper" style="overflow:hidden;position:relative;"></div>').css( { "width":containerSize*slideW*3,"position":"relative","overflow":"hidden","padding":"0","margin":"0","left":-containerSize*slideW}).children().css({"float":"left","text-center":"center"});
					break;
				case "top":
					container.children().clone().appendTo(container).clone().prependTo(container);
					container.wrap('<div class="mqWrapper" style="overflow:hidden;position:relative;height:'+opts.row*slideH+'px"></div>').css( { "height":containerSize*slideH*3,"position":"relative","padding":"0","margin":"0","top":-containerSize*slideH}).children().css({"width":"100%","margin":"0","height":selfH});
					break;
			}
			var doPlay = function(){
				switch(opts.mode){
					case "left":
					case "top":
						if (index >= 2){
							index = 1;
						} else if(index < 0){
							index = 0;
						}
						break;
				}
				switch (opts.mode){
					case "left":
						var tempLeft = container.css("left").replace("px","");
						if(index == 0){
							container.animate({"left":++tempLeft},0,function(){
								if(container.css("left").replace("px","") >= 0){
									for(var i=0; i<containerSize; i++){
										container.children().last().prependTo(container);
									};
									container.css("left", -containerSize*slideW);
								}
							});
						} else {
							container.animate({"left":--tempLeft},0,function(){
								if(container.css("left").replace("px","") <= -containerSize*slideW*1.755){
									for(var i=0; i<containerSize; i++){
										container.children().first().appendTo(container);
									};
									container.css("left", -containerSize*slideW);}
							});
						}
						break;
					case "top":
						var tempTop = container.css("top").replace("px","");
						if(index == 0){
							container.animate({"top":++tempTop},0,function(){
								if(container.css("top").replace("px","") >= 0){
									for(var i=0; i<containerSize; i++){
										container.children().last().prependTo(container);
									};
									container.css("top",-containerSize*slideH);
								}
							});
						} else {
							container.animate({"top":--tempTop},0,function(){
								if(container.css("top").replace("px","") <= -containerSize*slideH*2){
									for(var i=0; i<containerSize; i++){
										container.children().first().appendTo(container);
									};
									container.css("top",-containerSize*slideH);
								}
							});
						}
						break;
				}
				oldIndex=index;
			};

			doPlay();
			index++;
			flag = setInterval(doPlay, opts.speed);
		});
	};

})(Zepto);

$(function() {
	var $copyright = $('.copyright');
	if($copyright){
			$copyright.html(copyright);
	}
	var cbUrl = window.location.href;
	if(cbUrl.indexOf('cb41faa22e731e9b') < 0 ){
		$('#div_subscribe_area').css('height', '0');
	} else {
		$('#div_subscribe_area').css('height', '50px');
	}

	window.getUrl = function(openid) {
		var href = window.location.href;
		href = href.replace(/[^\/]*\.html/i, 'index.html');

		href = add_param(href, 'friUid', openid, true);
		href = add_param(href, 'from', 'share', true);

		href = delQueStr(href, "openid");
		href = delQueStr(href, "headimgurl");
		href = delQueStr(href, "nickname");
		href = delQueStr(href, "matk");
		return add_yao_prefix(href);
	};
	
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "api/common/versioncheck" + dev,
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "commonApiVersionHandler",
		success : function(data) {
			if (!data.result){
				location.href = data.redirect;
			}
			share_img = data.si;
			share_title = data.st;
			share_desc = data.sd;
			share_group = data.sgt;

			if($("body").attr("data-type") != "shareGo"){
				// 一键分享
				window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, getUrl(openid));
			}
			var typeofAppid = typeof(follow_shaketv_appid);
			if (typeofAppid == 'undefined' || follow_shaketv_appid == '' || follow_shaketv_appid == null) {
			} else {
				if(openid){

					window['shaketv'] && shaketv.subscribe({
						appid: follow_shaketv_appid,
						selector: "#div_subscribe_area",
						type: 1
					}, function (returnData) {
						// console.log(JSON.stringify(returnData));
					});
				}
			}
			new Authorize({callBackPage:"index.html"}).init(check_weixin_login());

			// 从data_collect.js里转移过来的
			recordUserPage(openid, $('title').html(), "");
		},
		error : function() {
			new Authorize({callBackPage:"index.html"}).init(check_weixin_login());

			// 从data_collect.js里转移过来的
			recordUserPage(openid, $('title').html(), "");
		}
	});
	$('body').delegate("*[data-collect='true']", "click", function(e) {
		e.preventDefault();

		if ($(this).attr('data-stoppropagation') == 'true') {
			e.stopPropagation();
		}
		recordUserOperate(openid, $(this).attr("data-collect-desc"), $(this).attr("data-collect-flag"));
		var href = $(this).attr('href'); 
		if (href && href !== '#') {
			setTimeout(function() {
				window.location.href = href;
			}, 5);
		}
	});
});