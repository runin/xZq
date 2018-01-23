
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

/**
 * 返回给定key值的Map 类型数据
 * @param list 数组类型的对象-JSON格式
 * @param t 键名
 * @param mark 分隔符
 * @returns {Number}
 */
var formatMap  =  function(list, t, mark){
    var rss = new Map();
    for(let x of list){
        var arr = [];
        var key = $.isArray(t) ? t.map( n => x[n] ).join(mark) : (x[t] || '');
        if (rss.has(key)) {
            arr = rss.get(key);
            arr.push(x);
            rss.set(key, arr);
        } else {
            arr.push(x);
            rss.set(key, arr);
        }
    }
    return rss;
};

window.setTitle = function(title) {document.title = title;var $body = $('body');var $iframe = $('<iframe style="display:none;"></iframe>').on('load', function() {setTimeout(function() {$iframe.off('load').remove();}, 0)}).appendTo($body);};

// 上报用户操作日志
var recordUserLog = function(openid, operateDesc, operateDomId, loadingTime, flag) {
	/*$.ajax({
		type : "get",
		async : true,
		url : domain_url + "api/common/reportlog",
		dataType : "jsonp",
		jsonp : "callback",
		data : {
			openid : openid,
			operateDesc : encodeURIComponent(operateDesc),
			operateDomId : operateDomId,
			loadingTime : loadingTime,
			flag : flag
		}
	});*/
};
/**
 * 记录用户操作日志
 * 点击流上报
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
	var t = simpleTpl(), spinnerSize = 146,
		width = $(window).width(),
		height = $(window).height(),
		$container = $container || $('body'),
		$spinner = $container ? $container.find('#spinner') : $('body').children('#spinner'),
		tips = tips || '努力加载中...';

	if ($spinner.length > 0) {
		$spinner.remove();
	};
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
    if(screen.width == $(window).width()){
        $('.new-spinner').addClass('scale')
    }
};

var hidenewLoading = function($container) {
	if ($container) {
		$container.find('.spinner').remove();
	} else {
		$('body').children('.spinner').remove();
	};
};

/**
 * 延迟地址跳转
 * @param url 链接地址
 */
var toUrl = function(url) {
	shownewLoading(null, '请稍后...');
	var delay = Math.ceil(500*Math.random() + 100);
	setTimeout(function(){
        hidenewLoading();
        window.location.href = url;
	}, delay);
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
    /*if (dev || (localStorage && localStorage.dev)) {
        localStorage && (localStorage.dev = true);
        typeof window[callback] == 'function' && window[callback](window[callback+'Data']);
        return;
    }*/

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
			hidenewLoading();
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
 * @param timer 停留时间
 */
var _tipsTimeout = null;
var showTips = function(word, timer) {
    if (_tipsTimeout) {
        clearTimeout(_tipsTimeout);
        _tipsTimeout = null;
        $('.tips').remove();
    }
    var paddingValue = 0,fontSizeValue = 0,borderRadiusValue = 0;
    if(screen.width == $(window).width()){
        paddingValue = '12px 15px';
        fontSizeValue = '14px';
        borderRadiusValue = '6px';
    }else{
        paddingValue = '24px 30px';
        fontSizeValue = '28px';
        borderRadiusValue = '12px';
    }
    $('body').append('<div class="tips none" style="position:fixed;max-width:80%;top:0;z-index:999;color:#FFF;padding:'+ paddingValue+';background:rgba(0,0,0,.7);font-size:'+fontSizeValue+';text-align:center;border-radius:'+borderRadiusValue+';z-index: 199999;"></div>');
    $('.tips').html(word).removeClass('none').css('opacity', '0');
    $('.tips').css({'left': ($(window).width()-$('.tips').width())/2, '-webkit-transform': "translateY(40vh)"});
    $('.tips').animate({'opacity': '1', '-webkit-transform': "translateY(45vh)"}, 300, function() {
        _tipsTimeout = setTimeout(function() {
            $('.tips').animate({'opacity':'0'}, 200, function() {
                _tipsTimeout = null;
                $('.tips').remove();
            });
        }, timer || 1200);
    });
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


var btn_animate =  function(str,calback){
    str.addClass('flipInY');
    setTimeout(function(){
        str.removeClass('flipInY');
    },150);
};

var fmoney = function(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    var rString = r.toString();
    for (j = rString.length - 1; j > -1; j--) {
        if(r[j] == 0){
            r = r.substring(0,r.length-1);
        }else{
            break;
        }

    }
    r = r ? "." + r : '';
    return t.split("").reverse().join("") + r;

};
// fmoney(79800, 3);

var saveData = function(key, value) {
    if (key) window.localStorage.setItem(key + '_' + openid + '_' + mpappid, $.trim(value));
};
var getData = function(key) {
    if (key) return window.localStorage.getItem(key + '_' + openid + '_' + mpappid) || '';
};
var delData = function(key) {
    if (key) window.localStorage.removeItem(key + '_' + openid + '_' + mpappid);
};

/**
 * 客户端是否andriod系统
 * @returns {boolean}
 */
var is_android = function() {
	var ua = navigator.userAgent.toLowerCase();
	return ua.indexOf("android") > -1;
};

var reload = function () {
    var href = window.location.href;
    var len = href.indexOf("?");
    len>0 ? location.href=href+"&_="+Math.random() : location.href=href+"?_="+Math.random();
};

/**
 * touchend 阻止Scroll
 */
var stopTouchendPropagationAfterScroll = function(dom){
    var locked = false, DOM = dom || window;
    DOM.addEventListener('touchmove', function(e){
        locked || (locked = true, DOM.addEventListener('touchend', stopTouchendPropagation, true));
    }, true);
    function stopTouchendPropagation(e){
        e.stopPropagation();
        DOM.removeEventListener('touchend', stopTouchendPropagation, true);
        locked = false;
    }
};

$.fn.scrollTo =function(options){

    var defaults = {
        toT : 0,    //滚动目标位置
        durTime : 500,  //过渡动画时间
        delay : 30,     //定时器时间
        callback:null   //回调函数
    };
    var opts = $.extend(defaults,options),
        timer = null,
        _this = this,
        curTop = _this.scrollTop(),//滚动条当前的位置
        subTop = opts.toT - curTop,    //滚动条目标位置和当前位置的差值
        index = 0,
        dur = Math.round(opts.durTime / opts.delay),
        smoothScroll = function(t){
            index++;
            var per = Math.round(subTop/dur);
            if(index >= dur){
                _this.scrollTop(t);
                window.clearInterval(timer);
                if(opts.callback && typeof opts.callback == 'function'){
                    opts.callback();
                }
                return;
            }else{
                _this.scrollTop(curTop + index*per);
            }
        };
    timer = window.setInterval(function(){
        smoothScroll(opts.toT);
    }, opts.delay);
    return _this;
};

var getUrl = function(openid) {
    var href = window.location.href;
    href = add_param(href.replace(/[^\/]*\.html/i, 'index.html'), 'friUid', hex_md5(openid), true);
    href = add_param(href, 'from', 'share', true);
    href = delQueStr(href, "openid");
    href = delQueStr(href, "headimgurl");
    href = delQueStr(href, "nickname");
    href = delQueStr(href, "matk");
    href = delQueStr(href, "sex");
    return add_yao_prefix(href);
};

/*去重*/
var unique1 = function (arr) {
    // var arr = [["aa","bb" ,"cc"],["aa","bb","cc"],["b","b","v"]];
    var hash = {};
    var result = [];
    arr.forEach((element, index, array) =>{
        if(!hash[array[index]]){
            result.push(array[index]);
            hash[array[index]] = true;
        }
    });
    return result;
};
var numChangeChar = function (num) {
    switch(num){
        case 1:
            return '一';
            break;
        case 2:
            return '二';
            break;
        case 3:
            return '三';
            break;
        case 4:
            return '四';
            break;
        case 5:
            return '五';
            break;
        case 6:
            return '六';
            break;
        case 7:
            return '七';
            break;
    }
};

var loadScript = function (src) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    document.head.appendChild(script);
};

$(function() {
    if (wTitle) setTitle(wTitle);
    setTimeout(function () {
        $('body, .wrap-page').css('height', $(window).height());
    }, 500);

    shareData = {"imgUrl": share_img,"link": getUrl(openid),"desc": share_desc,"title": share_title};

    $('a.button').bind('touchstart', function (e) {
        $(this).addClass('ahover')
    }).bind('touchend', function (e) {
        $(this).removeClass('ahover')
    });

});