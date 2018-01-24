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

// 上报用户操作日志
// 从data_collect.js转移过来的_S
// var recordUserLog = function(openid, operateDesc, operateDomId, loadingTime, flag) {
// 	$.ajax({
// 		type : "get",
// 		async : true,
// 		url : report_url + "api/log/report",
// 		dataType : "jsonp",
// 		jsonp : "callback",
// 		data : {
// 			source: "yaotv",
// 			siteId: "source_" + serviceNo,
// 			usrType: "openid",
// 			usrId : openid,
// 			operateDesc : encodeURIComponent(operateDesc),
// 			operateDomId : operateDomId
// 		}
// 	});
// };
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
};
/**
 * 记录用户操作日志
 * 
 * @param openid 操作用户的openid
 * @param operateDesc 中文描述做的事情
 * @param operateDomId 操作的元素的id
 */
var recordUserOperate = function(openid, operateDesc, operateDomId) {
    recordUserLog(openid, operateDesc, operateDomId, "", "false");
};
/**
 * 加载页面记录日志
 * 
 * @param openid 操作用户的openid
 * @param operateDesc 进入的某页面名称
 * @param loadingTime 页面加载耗时多少毫秒
 */
function recordUserPage(openid, operateDesc, loadingTime) {
	recordUserLog(openid, operateDesc, "", loadingTime, "true");
};
// 从data_collect.js转移过来的_E

var callbackUserSaveHandler = function(data) {};

var getQueryString = function( name, url ) {
    if (!url) url = location.href;
    var target = url.split('?');
    if (url.indexOf('?') >= 0) {
        var temp = '';
        for(var i = 1; i < target.length; i++) {
            if (i == 1) {
                temp = target[i];
            } else {
                temp = temp + '&' + target[i];
            }
        };
        var currentSearch = decodeURIComponent(temp);
        if (currentSearch != '') {
            var paras = currentSearch.split('&');
            for ( var i = 0, l = paras.length, items; i < l; i++ ) {
                var ori = paras[i];
                if (paras[i].indexOf('#') >= 0) {
                    paras[i] = paras[i].split('#')[0];
                }
                items = paras[i].split('=');
                if ( items[0] === name) return items[1];
            };
            return '';
        } else {
            return '';
        }
    } else {
        return '';
    }
};

var from = getQueryString("from");
var gefrom = from || getQueryString("gefrom");
var cb41faa22e731e9b = getQueryString("cb41faa22e731e9b");

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

var hidenewLoading = function($container) {
	if ($container) {
		$container.find('#qy_loading').remove();
	} else {
		$('body').children('#qy_loading').remove();
	};
};

var saveData = function(key, value) {
    // if (key) window.localStorage.setItem(key + '_' + openid + '_' + mpappid + '-' + _nextLotID, $.trim(value));
    if (key) window.localStorage.setItem(key + '_' + openid + '_' + mpappid, $.trim(value));
};
var getData = function(key) {
    // if (key) return window.localStorage.getItem(key + '_' + openid + '_' + mpappid + '-' + _nextLotID) || '';
    if (key) return window.localStorage.getItem(key + '_' + openid + '_' + mpappid) || '';
};
var delData = function(key) {
    // if (key) window.localStorage.removeItem(key + '_' + openid + '_' + mpappid + '-' + _nextLotID);
    if (key) window.localStorage.removeItem(key + '_' + openid + '_' + mpappid);
};

var toUrl = function(url) {
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
    setTimeout(function(){window.location.href = url}, 50);
};

var showTipsFlag = true;
var showTips = function(tips, timer) {
    if (tips == undefined) return;
    if (showTipsFlag) {
        showTipsFlag = false;
        $('body').append('<div class="showTips" style="position:fixed;max-width:80%;z-index:999999999999;color:#FFF;padding:18px 30px;font-size:28px;border-radius:3px;background:rgba(0,0,0,.6);text-align:center;opacity:0">' + tips + '</div>');
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

var getResult = function(url, data, callback, showloading, $target, isAsync) {
	if (showloading) shownewLoading();
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
//將毫秒轉化為yyyy-MM-dd HH:mm:ss格式的日期
var timeTransform = function(TimeMillis){
	  
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

var str2date = function(str) {
	str = str.replace(/-/g, '/');
	return new Date(str);
};

var timestamp = function(str) {
	var timestamp = Date.parse(str2date(str));
	return timestamp;
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

var dateNum = function(num) {
	return num < 10 ? '0' + num : num;
};

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

//beginTime,endTime  yy-mm-dd hh:mm:ss
//return -1   beginTime > endTime
//return 0    beginTime = endTime
//return 1    beginTime < endTime
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
};

//返回给定范围内的随机数
function getRandomArbitrary(min, max) {
  return parseInt(Math.random()*(max - min)+min);
};

var _nextLotID = timeTransform(+new Date()).split(' ')[0].replace(/-/g, '');

(function($) {
	// $.fn.countDown = function(options) {
	// 	var defaultVal = {
	// 		// 存放结束时间
	// 		eAttr : 'etime',
	// 		sAttr : 'stime', // 存放开始时间
	// 		wTime : 300, // 以100毫秒为单位进行演算
	// 		etpl : '%H%:%M%:%S%', // 还有...结束
	// 		stpl : '%H%:%M%:%S%', // 还有...开始
	// 		sdtpl : '已开始',
	// 		otpl : '活动已结束', // 过期显示的文本模版
	// 		stCallback: null,
	// 		sdCallback: null,
	// 		otCallback: null
	// 	};
	// 	var dateNum = function(num) {
	// 		return num < 10 ? '0' + num : num;
	// 	};
	// 	var subNum = function(num){
	// 		numF = num.toString().substring(0,1);
	// 		numS = num.toString().substring(1,num.length);
	// 		return num = "<label><i>"+ numF +"</i><i>"+ numS + "</i></label>";
	// 	};
	// 	var s = $.extend(defaultVal, options);
	// 	var vthis = $(this);
	// 	var runTime = function() {
	// 		var nowTime = new Date().getTime();
	// 		vthis.each(function() {
	// 			var nthis = $(this);
	// 			var sorgT = parseInt(nthis.attr(s.sAttr));
	// 			var eorgT = parseInt(nthis.attr(s.eAttr));
	// 			var sT = isNaN(sorgT) ? 0 : sorgT - nowTime;
	// 			var eT = isNaN(eorgT) ? 0 : eorgT - nowTime;
	// 			var showTime = function(rT, showTpl) {
	// 				var s_ = Math.round((rT % 60000) / s.wTime);
	// 				// s_ = subNum(dateNum(Math.round(s_ / 1000 * s.wTime)));
	// 				s_ = subNum(dateNum(Math.min(Math.floor(s_ / 1000 * s.wTime), 59)));
	// 				var m_ = subNum(dateNum(Math.floor((rT % 3600000) / 60000)));
	// 				var h_ = subNum(dateNum(Math.floor((rT % 86400000) / 3600000)));
	// 				var d_ = subNum(dateNum(Math.floor(rT / 86400000)));
 //                    if (h_ == "<label>00</label>") {
 //                        $('.countdown').addClass('hour');
 //                    } else {
 //                        $('.countdown').removeClass('hour');
 //                    }
	// 				nthis.html(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
	// 			};
	// 			if (sT > 0) {
	// 				showTime(sT, s.stpl);
	// 				s.stCallback && s.stCallback();
	// 			} else if (eT > 0) {
	// 				showTime(eT, s.etpl);
	// 				s.sdCallback && s.sdCallback();
	// 			} else {
	// 				nthis.html(s.otpl);
	// 				s.otCallback && s.otCallback();
	// 			}

	// 		});
	// 	};

	// 	setInterval(function() {
	// 		runTime();
	// 	}, s.wTime);
	// };

    $.fn.countDown = function(options) {
        var defaultVal = {
            // 存放结束时间
            eAttr : 'etime',
            sAttr : 'stime', // 存放开始时间
            wTime : 29, // 以100毫秒为单位进行演算
            etpl : '%H%:%M%:%S%.%ms%', // 还有...结束
            stpl : '%H%:%M%:%S%.%ms%', // 还有...开始
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
            return num = "<label><i>"+ numF +"</i><i>"+ numS + "</i></label>";
        };
        var s = $.extend(defaultVal, options);
        var vthis = $(this);
        var num = 60;
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
                    s_ = subNum(dateNum(Math.min(Math.floor(s_ / 1000 * s.wTime), 59)));
                    var m_ = subNum(dateNum(Math.floor((rT % 3600000) / 60000)));
                    var h_ = subNum(dateNum(Math.floor((rT % 86400000) / 3600000)));
                    var d_ = subNum(dateNum(Math.floor(rT / 86400000)));
                    var ms_ = Math.floor(rT % 1000);
                    if(ms_>=10 && ms_ <100) ms_ = "0"+ms_;
                    if(ms_ < 10) ms_ = "00"+ms_;
                    ms_ = ms_.toString().substr(0,2);
                    ms_ = subNum(ms_);
                    nthis.html(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_).replace(/%ms%/,ms_));
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
})(Zepto);

//删除参数值
function replaceParamVal(href,paramName,replaceWith) {
    var re=eval('/('+ paramName+'=)([^&]*)/gi');
    var nUrl = href.replace(re,paramName+'='+replaceWith);
    return nUrl;
};

//删除参数值
function delQueStr(url, ref) {
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

var add_yao_prefix = function(url) {
	return 'http://yao.qq.com/tv/entry?redirect_uri=' + encodeURIComponent(url);
};

var is_android = function() {
	var ua = navigator.userAgent.toLowerCase();
	return ua.indexOf("android") > -1;
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

$(function() {
	if($('title')) $('title').html(wTitle);
	if($('.copyright')) $('.copyright').html(copyright);

	$("script").each(function() {
		var scr = $(this).attr("src");
		$(this).attr("src", scr + "?v=" + version);
	});
	
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
				return;
			}
			share_img = data.si;
			share_title = data.st;
			share_desc = data.sd;
			// 一键分享
			window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, getUrl(openid));
			new Authorize({callBackPage:"index.html"}).init(check_weixin_login());
		},
		error : function() {
			new Authorize({callBackPage:"index.html"}).init(check_weixin_login());
		}
	});

	var cbUrl = window.location.href;
	if(cbUrl.indexOf('cb41faa22e731e9b') < 0 ){
		$('#div_subscribe_area').css('height', '0');
	} else {
		$('#div_subscribe_area').css('height', '50px');
	};
	var typeofAppid = typeof(follow_shaketv_appid);
	if (typeofAppid == 'undefined' || follow_shaketv_appid == '' || follow_shaketv_appid == null) {
		return;
	} else {
		window['shaketv'] && shaketv.subscribe({
			appid: follow_shaketv_appid,
			selector: "#div_subscribe_area",
			type: 1
		}, function(returnData) {
			if (returnData.errorCode == 0) {
				recordUserOperate(openid, "一键关注_成功", "super_subscribe_OK");
			} else if (returnData.errorCode == -1002) {
				recordUserOperate(openid, "一键关注_用户取消", "super_subscribe_cancel");
			} else if (returnData.errorCode == 9528) {
				recordUserOperate(openid, "一键关注_用户已经关注", "super_subscribe_already");
			}
		});
	}
	// 从data_collect.js里转移过来的
	recordUserPage(openid, $('title').html(), "");
	$('body').delegate("*[data-collect='true']", "click", function(e) {
		e.preventDefault();

		if ($(this).attr('data-stoppropagation') == 'true') {
			e.stopPropagation();
		}
		 recordUserOperate(openid, $(this).attr("data-collect-desc"), $(this).attr("data-collect-flag"));
		var href = $(this).attr('href'); 
		if (href && href !== '#' && href !== 'javascript:void(0);') {
			setTimeout(function() {
				window.location.href = href;
			}, 5);
		}
	});

});

/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 *
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

    'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

    function classReg( className ) {
        return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    }

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
    var hasClass, addClass, removeClass;

    if ( 'classList' in document.documentElement ) {
        hasClass = function( elem, c ) {
            return elem.classList.contains( c );
        };
        addClass = function( elem, c ) {
            elem.classList.add( c );
        };
        removeClass = function( elem, c ) {
            elem.classList.remove( c );
        };
    }
    else {
        hasClass = function( elem, c ) {
            return classReg( c ).test( elem.className );
        };
        addClass = function( elem, c ) {
            if ( !hasClass( elem, c ) ) {
                elem.className = elem.className + ' ' + c;
            }
        };
        removeClass = function( elem, c ) {
            elem.className = elem.className.replace( classReg( c ), ' ' );
        };
    }

    function toggleClass( elem, c ) {
        var fn = hasClass( elem, c ) ? removeClass : addClass;
        fn( elem, c );
    }

    var classie = {
        // full names
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        // short names
        has: hasClass,
        add: addClass,
        remove: removeClass,
        toggle: toggleClass
    };

// transport
    if ( typeof define === 'function' && define.amd ) {
        // AMD
        define( classie );
    } else if ( typeof exports === 'object' ) {
        // CommonJS
        module.exports = classie;
    } else {
        // browser global
        window.classie = classie;
    }

})( window );
(function(){var t,e,n,r,i,o,s,a,l,u,f,h,c,p,m,d,g,y,v,b,w,x,M,k,S,T,C,F,H,R,q,X,Y,j,z,I,A,G,V,Z,E,O,L,D,P,W,N,$,B,U,K,J,Q,_,te,ee,ne=function(t,e){return function(){return t.apply(e,arguments)}};H=function(){return"visible"===document.visibilityState||null!=T.tests},j=function(){var t;return t=[],"undefined"!=typeof document&&null!==document&&document.addEventListener("visibilitychange",function(){var e,n,r,i;for(i=[],n=0,r=t.length;r>n;n++)e=t[n],i.push(e(H()));return i}),function(e){return t.push(e)}}(),x=function(t){var e,n,r;n={};for(e in t)r=t[e],n[e]=r;return n},b=function(t){var e;return e={},function(){var n,r,i,o,s;for(r="",o=0,s=arguments.length;s>o;o++)n=arguments[o],r+=n.toString()+",";return i=e[r],i||(e[r]=i=t.apply(this,arguments)),i}},Y=function(t){return function(e){var n,r,i;return e instanceof Array||e instanceof NodeList||e instanceof HTMLCollection?i=function(){var i,o,s;for(s=[],r=i=0,o=e.length;o>=0?o>i:i>o;r=o>=0?++i:--i)n=Array.prototype.slice.call(arguments,1),n.splice(0,0,e[r]),s.push(t.apply(this,n));return s}.apply(this,arguments):t.apply(this,arguments)}},d=function(t,e){var n,r,i;i=[];for(n in e)r=e[n],i.push(null!=t[n]?t[n]:t[n]=r);return i},g=function(t,e){var n,r,i;if(null!=t.style)return y(t,e);i=[];for(n in e)r=e[n],i.push(t[n]=r.format());return i},y=function(t,e){var n,r,i,o,s;e=z(e),o=[],n=R(t);for(r in e)s=e[r],_.contains(r)?o.push([r,s]):(s=null!=s.format?s.format():""+s+ee(r,s),n&&B.contains(r)?t.setAttribute(r,s):t.style[A(r)]=s);return o.length>0?n?(i=new l,i.applyProperties(o),t.setAttribute("transform",i.decompose().format())):(s=o.map(function(t){return te(t[0],t[1])}).join(" "),t.style[A("transform")]=s):void 0},R=function(t){var e,n;return"undefined"!=typeof SVGElement&&null!==SVGElement&&"undefined"!=typeof SVGSVGElement&&null!==SVGSVGElement?t instanceof SVGElement&&!(t instanceof SVGSVGElement):null!=(e=null!=(n=T.tests)&&"function"==typeof n.isSVG?n.isSVG(t):void 0)?e:!1},Z=function(t,e){var n;return n=Math.pow(10,e),Math.round(t*n)/n},u=function(){function t(t){var e,n,r;for(this.obj={},n=0,r=t.length;r>n;n++)e=t[n],this.obj[e]=1}return t.prototype.contains=function(t){return 1===this.obj[t]},t}(),Q=function(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})},G=new u("marginTop,marginLeft,marginBottom,marginRight,paddingTop,paddingLeft,paddingBottom,paddingRight,top,left,bottom,right,translateX,translateY,translateZ,perspectiveX,perspectiveY,perspectiveZ,width,height,maxWidth,maxHeight,minWidth,minHeight,borderRadius".split(",")),S=new u("rotate,rotateX,rotateY,rotateZ,skew,skewX,skewY,skewZ".split(",")),_=new u("translate,translateX,translateY,translateZ,scale,scaleX,scaleY,scaleZ,rotate,rotateX,rotateY,rotateZ,rotateC,rotateCX,rotateCY,skew,skewX,skewY,skewZ,perspective".split(",")),B=new u("accent-height,ascent,azimuth,baseFrequency,baseline-shift,bias,cx,cy,d,diffuseConstant,divisor,dx,dy,elevation,filterRes,fx,fy,gradientTransform,height,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,letter-spacing,limitingConeAngle,markerHeight,markerWidth,numOctaves,order,overline-position,overline-thickness,pathLength,points,pointsAtX,pointsAtY,pointsAtZ,r,radius,rx,ry,seed,specularConstant,specularExponent,stdDeviation,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,surfaceScale,target,targetX,targetY,transform,underline-position,underline-thickness,viewBox,width,x,x1,x2,y,y1,y2,z".split(",")),ee=function(t,e){return"number"!=typeof e?"":G.contains(t)?"px":S.contains(t)?"deg":""},te=function(t,e){var n,r;return n=(""+e).match(/^([0-9.-]*)([^0-9]*)$/),null!=n?(e=n[1],r=n[2]):e=parseFloat(e),e=Z(parseFloat(e),10),(null==r||""===r)&&(r=ee(t,e)),""+t+"("+e+r+")"},z=function(t){var e,n,r,i,o,s,a,l;r={};for(i in t)if(o=t[i],_.contains(i))if(n=i.match(/(translate|rotateC|rotate|skew|scale|perspective)(X|Y|Z|)/),n&&n[2].length>0)r[i]=o;else for(l=["X","Y","Z"],s=0,a=l.length;a>s;s++)e=l[s],r[n[1]+e]=o;else r[i]=o;return r},k=function(t){var e;return e="opacity"===t?1:0,""+e+ee(t,e)},C=function(t,e){var n,r,i,o,s,u,f,h,c,p,m;if(o={},n=R(t),null!=t.style)for(s=window.getComputedStyle(t,null),f=0,c=e.length;c>f;f++)r=e[f],_.contains(r)?null==o.transform&&(i=n?new l(null!=(m=t.transform.baseVal.consolidate())?m.matrix:void 0):a.fromTransform(s[A("transform")]),o.transform=i.decompose()):(u=s[r],null==u&&B.contains(r)&&(u=t.getAttribute(r)),(""===u||null==u)&&(u=k(r)),o[r]=M(u));else for(h=0,p=e.length;p>h;h++)r=e[h],o[r]=M(t[r]);return o},M=function(t){var e,n,a,l,u;for(a=[i,r,o,s],l=0,u=a.length;u>l;l++)if(n=a[l],e=n.create(t),null!=e)return e;return null},o=function(){function t(t){this.format=ne(this.format,this),this.interpolate=ne(this.interpolate,this),this.obj=t}return t.prototype.interpolate=function(e,n){var r,i,o,s,a;s=this.obj,r=e.obj,o={};for(i in s)a=s[i],o[i]=null!=a.interpolate?a.interpolate(r[i],n):a;return new t(o)},t.prototype.format=function(){return this.obj},t.create=function(e){var n,r,i;if(e instanceof Object){r={};for(n in e)i=e[n],r[n]=M(i);return new t(r)}return null},t}(),s=function(){function t(t,e,n){this.prefix=e,this.suffix=n,this.format=ne(this.format,this),this.interpolate=ne(this.interpolate,this),this.value=parseFloat(t)}return t.prototype.interpolate=function(e,n){var r,i;return i=this.value,r=e.value,new t((r-i)*n+i,e.prefix||this.prefix,e.suffix||this.suffix)},t.prototype.format=function(){return null==this.prefix&&null==this.suffix?Z(this.value,5):this.prefix+Z(this.value,5)+this.suffix},t.create=function(e){var n;return"string"!=typeof e?new t(e):(n=(""+e).match("([^0-9.+-]*)([0-9.+-]+)([^0-9.+-]*)"),null!=n?new t(n[2],n[1],n[3]):null)},t}(),r=function(){function t(t,e){this.values=t,this.sep=e,this.format=ne(this.format,this),this.interpolate=ne(this.interpolate,this)}return t.prototype.interpolate=function(e,n){var r,i,o,s,a,l;for(s=this.values,r=e.values,o=[],i=a=0,l=Math.min(s.length,r.length);l>=0?l>a:a>l;i=l>=0?++a:--a)o.push(null!=s[i].interpolate?s[i].interpolate(r[i],n):s[i]);return new t(o,this.sep)},t.prototype.format=function(){var t;return t=this.values.map(function(t){return null!=t.format?t.format():t}),null!=this.sep?t.join(this.sep):t},t.createFromArray=function(e,n){var r;return r=e.map(function(t){return M(t)||t}),r=r.filter(function(t){return null!=t}),new t(r,n)},t.create=function(e){var n,r,i,o,s;if(e instanceof Array)return t.createFromArray(e,null);if("string"==typeof e){for(i=[" ",",","|",";","/",":"],o=0,s=i.length;s>o;o++)if(r=i[o],n=e.split(r),n.length>1)return t.createFromArray(n,r);return null}},t}(),t=function(){function t(t,e){this.rgb=null!=t?t:{},this.format=e,this.toRgba=ne(this.toRgba,this),this.toRgb=ne(this.toRgb,this),this.toHex=ne(this.toHex,this)}return t.fromHex=function(e){var n,r;return n=e.match(/^#([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i),null!=n&&(e="#"+n[1]+n[1]+n[2]+n[2]+n[3]+n[3]),r=e.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i),null!=r?new t({r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16),a:1},"hex"):null},t.fromRgb=function(e){var n,r;return n=e.match(/^rgba?\(([0-9.]*), ?([0-9.]*), ?([0-9.]*)(?:, ?([0-9.]*))?\)$/),null!=n?new t({r:parseFloat(n[1]),g:parseFloat(n[2]),b:parseFloat(n[3]),a:parseFloat(null!=(r=n[4])?r:1)},null!=n[4]?"rgba":"rgb"):null},t.componentToHex=function(t){var e;return e=t.toString(16),1===e.length?"0"+e:e},t.prototype.toHex=function(){return"#"+t.componentToHex(this.rgb.r)+t.componentToHex(this.rgb.g)+t.componentToHex(this.rgb.b)},t.prototype.toRgb=function(){return"rgb("+this.rgb.r+", "+this.rgb.g+", "+this.rgb.b+")"},t.prototype.toRgba=function(){return"rgba("+this.rgb.r+", "+this.rgb.g+", "+this.rgb.b+", "+this.rgb.a+")"},t}(),i=function(){function e(t){this.color=t,this.format=ne(this.format,this),this.interpolate=ne(this.interpolate,this)}return e.prototype.interpolate=function(n,r){var i,o,s,a,l,u,f,h;for(a=this.color,i=n.color,s={},h=["r","g","b"],u=0,f=h.length;f>u;u++)o=h[u],l=Math.round((i.rgb[o]-a.rgb[o])*r+a.rgb[o]),s[o]=Math.min(255,Math.max(0,l));return o="a",l=Z((i.rgb[o]-a.rgb[o])*r+a.rgb[o],5),s[o]=Math.min(1,Math.max(0,l)),new e(new t(s,i.format))},e.prototype.format=function(){return"hex"===this.color.format?this.color.toHex():"rgb"===this.color.format?this.color.toRgb():"rgba"===this.color.format?this.color.toRgba():void 0},e.create=function(n){var r;if("string"==typeof n)return r=t.fromHex(n)||t.fromRgb(n),null!=r?new e(r):null},e}(),n=function(){function t(t){this.props=t,this.applyRotateCenter=ne(this.applyRotateCenter,this),this.format=ne(this.format,this),this.interpolate=ne(this.interpolate,this)}return t.prototype.interpolate=function(e,n){var r,i,o,s,a,l,u,f,h,c,p,m;for(o={},c=["translate","scale","rotate"],s=0,f=c.length;f>s;s++)for(i=c[s],o[i]=[],r=a=0,p=this.props[i].length;p>=0?p>a:a>p;r=p>=0?++a:--a)o[i][r]=(e.props[i][r]-this.props[i][r])*n+this.props[i][r];for(r=l=1;2>=l;r=++l)o.rotate[r]=e.props.rotate[r];for(m=["skew"],u=0,h=m.length;h>u;u++)i=m[u],o[i]=(e.props[i]-this.props[i])*n+this.props[i];return new t(o)},t.prototype.format=function(){return"translate("+this.props.translate.join(",")+") rotate("+this.props.rotate.join(",")+") skewX("+this.props.skew+") scale("+this.props.scale.join(",")+")"},t.prototype.applyRotateCenter=function(t){var e,n,r,i,o,s;for(n=v.createSVGMatrix(),n=n.translate(t[0],t[1]),n=n.rotate(this.props.rotate[0]),n=n.translate(-t[0],-t[1]),r=new l(n),i=r.decompose().props.translate,s=[],e=o=0;1>=o;e=++o)s.push(this.props.translate[e]-=i[e]);return s},t}(),v="undefined"!=typeof document&&null!==document?document.createElementNS("http://www.w3.org/2000/svg","svg"):void 0,l=function(){function t(t){this.m=t,this.applyProperties=ne(this.applyProperties,this),this.decompose=ne(this.decompose,this),this.m||(this.m=v.createSVGMatrix())}return t.prototype.decompose=function(){var t,e,r,i,o;return i=new f([this.m.a,this.m.b]),o=new f([this.m.c,this.m.d]),t=i.length(),r=i.dot(o),i=i.normalize(),e=o.combine(i,1,-r).length(),new n({translate:[this.m.e,this.m.f],rotate:[180*Math.atan2(this.m.b,this.m.a)/Math.PI,this.rotateCX,this.rotateCY],scale:[t,e],skew:r/e*180/Math.PI})},t.prototype.applyProperties=function(t){var e,n,r,i,o,s,a,l;for(e={},o=0,s=t.length;s>o;o++)r=t[o],e[r[0]]=r[1];for(n in e)i=e[n],"translateX"===n?this.m=this.m.translate(i,0):"translateY"===n?this.m=this.m.translate(0,i):"scaleX"===n?this.m=this.m.scale(i,1):"scaleY"===n?this.m=this.m.scale(1,i):"rotateZ"===n?this.m=this.m.rotate(i):"skewX"===n?this.m=this.m.skewX(i):"skewY"===n&&(this.m=this.m.skewY(i));return this.rotateCX=null!=(a=e.rotateCX)?a:0,this.rotateCY=null!=(l=e.rotateCY)?l:0},t}(),f=function(){function t(t){this.els=t,this.combine=ne(this.combine,this),this.normalize=ne(this.normalize,this),this.length=ne(this.length,this),this.cross=ne(this.cross,this),this.dot=ne(this.dot,this),this.e=ne(this.e,this)}return t.prototype.e=function(t){return 1>t||t>this.els.length?null:this.els[t-1]},t.prototype.dot=function(t){var e,n,r;if(e=t.els||t,r=0,n=this.els.length,n!==e.length)return null;for(n+=1;--n;)r+=this.els[n-1]*e[n-1];return r},t.prototype.cross=function(e){var n,r;return r=e.els||e,3!==this.els.length||3!==r.length?null:(n=this.els,new t([n[1]*r[2]-n[2]*r[1],n[2]*r[0]-n[0]*r[2],n[0]*r[1]-n[1]*r[0]]))},t.prototype.length=function(){var t,e,n,r,i;for(t=0,i=this.els,n=0,r=i.length;r>n;n++)e=i[n],t+=Math.pow(e,2);return Math.sqrt(t)},t.prototype.normalize=function(){var e,n,r,i,o;r=this.length(),i=[],o=this.els;for(n in o)e=o[n],i[n]=e/r;return new t(i)},t.prototype.combine=function(e,n,r){var i,o,s,a;for(o=[],i=s=0,a=this.els.length;a>=0?a>s:s>a;i=a>=0?++s:--s)o[i]=n*this.els[i]+r*e.els[i];return new t(o)},t}(),e=function(){function t(){this.toMatrix=ne(this.toMatrix,this),this.format=ne(this.format,this),this.interpolate=ne(this.interpolate,this)}return t.prototype.interpolate=function(e,n,r){var i,o,s,a,l,u,f,h,c,p,m,d,g,y,v,b,w,x;for(null==r&&(r=null),s=this,o=new t,w=["translate","scale","skew","perspective"],d=0,b=w.length;b>d;d++)for(f=w[d],o[f]=[],a=g=0,x=s[f].length-1;x>=0?x>=g:g>=x;a=x>=0?++g:--g)o[f][a]=null==r||r.indexOf(f)>-1||r.indexOf(""+f+["x","y","z"][a])>-1?(e[f][a]-s[f][a])*n+s[f][a]:s[f][a];if(null==r||-1!==r.indexOf("rotate")){if(h=s.quaternion,c=e.quaternion,i=h[0]*c[0]+h[1]*c[1]+h[2]*c[2]+h[3]*c[3],0>i){for(a=y=0;3>=y;a=++y)h[a]=-h[a];i=-i}for(i+1>.05?1-i>=.05?(m=Math.acos(i),u=1/Math.sin(m),p=Math.sin(m*(1-n))*u,l=Math.sin(m*n)*u):(p=1-n,l=n):(c[0]=-h[1],c[1]=h[0],c[2]=-h[3],c[3]=h[2],p=Math.sin(piDouble*(.5-n)),l=Math.sin(piDouble*n)),o.quaternion=[],a=v=0;3>=v;a=++v)o.quaternion[a]=h[a]*p+c[a]*l}else o.quaternion=s.quaternion;return o},t.prototype.format=function(){return this.toMatrix().toString()},t.prototype.toMatrix=function(){var t,e,n,r,i,o,s,l,u,f,h,c,p,m,d,g;for(t=this,i=a.I(4),e=p=0;3>=p;e=++p)i.els[e][3]=t.perspective[e];for(o=t.quaternion,f=o[0],h=o[1],c=o[2],u=o[3],s=t.skew,r=[[1,0],[2,0],[2,1]],e=m=2;m>=0;e=--m)s[e]&&(l=a.I(4),l.els[r[e][0]][r[e][1]]=s[e],i=i.multiply(l));for(i=i.multiply(new a([[1-2*(h*h+c*c),2*(f*h-c*u),2*(f*c+h*u),0],[2*(f*h+c*u),1-2*(f*f+c*c),2*(h*c-f*u),0],[2*(f*c-h*u),2*(h*c+f*u),1-2*(f*f+h*h),0],[0,0,0,1]])),e=d=0;2>=d;e=++d){for(n=g=0;2>=g;n=++g)i.els[e][n]*=t.scale[e];i.els[3][e]=t.translate[e]}return i},t}(),a=function(){function t(t){this.els=t,this.toString=ne(this.toString,this),this.decompose=ne(this.decompose,this),this.inverse=ne(this.inverse,this),this.augment=ne(this.augment,this),this.toRightTriangular=ne(this.toRightTriangular,this),this.transpose=ne(this.transpose,this),this.multiply=ne(this.multiply,this),this.dup=ne(this.dup,this),this.e=ne(this.e,this)}return t.prototype.e=function(t,e){return 1>t||t>this.els.length||1>e||e>this.els[0].length?null:this.els[t-1][e-1]},t.prototype.dup=function(){return new t(this.els)},t.prototype.multiply=function(e){var n,r,i,o,s,a,l,u,f,h,c,p,m;for(p=e.modulus?!0:!1,n=e.els||e,"undefined"==typeof n[0][0]&&(n=new t(n).els),h=this.els.length,l=h,u=n[0].length,i=this.els[0].length,o=[],h+=1;--h;)for(s=l-h,o[s]=[],c=u,c+=1;--c;){for(a=u-c,m=0,f=i,f+=1;--f;)r=i-f,m+=this.els[s][r]*n[r][a];o[s][a]=m}return n=new t(o),p?n.col(1):n},t.prototype.transpose=function(){var e,n,r,i,o,s,a;for(a=this.els.length,e=this.els[0].length,n=[],o=e,o+=1;--o;)for(r=e-o,n[r]=[],s=a,s+=1;--s;)i=a-s,n[r][i]=this.els[i][r];return new t(n)},t.prototype.toRightTriangular=function(){var t,e,n,r,i,o,s,a,l,u,f,h,c,p;for(t=this.dup(),a=this.els.length,i=a,o=this.els[0].length;--a;){if(n=i-a,0===t.els[n][n])for(r=f=c=n+1;i>=c?i>f:f>i;r=i>=c?++f:--f)if(0!==t.els[r][n]){for(e=[],l=o,l+=1;--l;)u=o-l,e.push(t.els[n][u]+t.els[r][u]);t.els[n]=e;break}if(0!==t.els[n][n])for(r=h=p=n+1;i>=p?i>h:h>i;r=i>=p?++h:--h){for(s=t.els[r][n]/t.els[n][n],e=[],l=o,l+=1;--l;)u=o-l,e.push(n>=u?0:t.els[r][u]-t.els[n][u]*s);t.els[r]=e}}return t},t.prototype.augment=function(e){var n,r,i,o,s,a,l,u,f;if(n=e.els||e,"undefined"==typeof n[0][0]&&(n=new t(n).els),r=this.dup(),i=r.els[0].length,u=r.els.length,a=u,l=n[0].length,u!==n.length)return null;for(u+=1;--u;)for(o=a-u,f=l,f+=1;--f;)s=l-f,r.els[o][i+s]=n[o][s];return r},t.prototype.inverse=function(){var e,n,r,i,o,s,a,l,u,f,h,c,p;for(f=this.els.length,a=f,e=this.augment(t.I(f)).toRightTriangular(),l=e.els[0].length,o=[],f+=1;--f;){for(i=f-1,r=[],h=l,o[i]=[],n=e.els[i][i],h+=1;--h;)c=l-h,u=e.els[i][c]/n,r.push(u),c>=a&&o[i].push(u);for(e.els[i]=r,s=p=0;i>=0?i>p:p>i;s=i>=0?++p:--p){for(r=[],h=l,h+=1;--h;)c=l-h,r.push(e.els[s][c]-e.els[i][c]*e.els[s][i]);e.els[s]=r}}return new t(o)},t.I=function(e){var n,r,i,o,s;for(n=[],o=e,e+=1;--e;)for(r=o-e,n[r]=[],s=o,s+=1;--s;)i=o-s,n[r][i]=r===i?1:0;return new t(n)},t.prototype.decompose=function(){var t,n,r,i,o,s,a,l,u,h,c,p,m,d,g,y,v,b,w,x,M,k,S,T,C,F,H,R,q,X,Y,j,z,I,A,G,V,Z;for(s=this,x=[],v=[],b=[],h=[],l=[],t=[],n=q=0;3>=q;n=++q)for(t[n]=[],i=X=0;3>=X;i=++X)t[n][i]=s.els[n][i];if(0===t[3][3])return!1;for(n=Y=0;3>=Y;n=++Y)for(i=j=0;3>=j;i=++j)t[n][i]/=t[3][3];for(u=s.dup(),n=z=0;2>=z;n=++z)u.els[n][3]=0;if(u.els[3][3]=1,0!==t[0][3]||0!==t[1][3]||0!==t[2][3]){for(p=new f(t.slice(0,4)[3]),r=u.inverse(),M=r.transpose(),l=M.multiply(p).els,n=I=0;2>=I;n=++I)t[n][3]=0;t[3][3]=1}else l=[0,0,0,1];for(n=A=0;2>=A;n=++A)x[n]=t[3][n],t[3][n]=0;for(d=[],n=G=0;2>=G;n=++G)d[n]=new f(t[n].slice(0,3));if(v[0]=d[0].length(),d[0]=d[0].normalize(),b[0]=d[0].dot(d[1]),d[1]=d[1].combine(d[0],1,-b[0]),v[1]=d[1].length(),d[1]=d[1].normalize(),b[0]/=v[1],b[1]=d[0].dot(d[2]),d[2]=d[2].combine(d[0],1,-b[1]),b[2]=d[1].dot(d[2]),d[2]=d[2].combine(d[1],1,-b[2]),v[2]=d[2].length(),d[2]=d[2].normalize(),b[1]/=v[2],b[2]/=v[2],a=d[1].cross(d[2]),d[0].dot(a)<0)for(n=V=0;2>=V;n=++V)for(v[n]*=-1,i=Z=0;2>=Z;i=++Z)d[n].els[i]*=-1;g=function(t,e){return d[t].els[e]},m=[],m[1]=Math.asin(-g(0,2)),0!==Math.cos(m[1])?(m[0]=Math.atan2(g(1,2),g(2,2)),m[2]=Math.atan2(g(0,1),g(0,0))):(m[0]=Math.atan2(-g(2,0),g(1,1)),m[1]=0),w=g(0,0)+g(1,1)+g(2,2)+1,w>1e-4?(y=.5/Math.sqrt(w),C=.25/y,F=(g(2,1)-g(1,2))*y,H=(g(0,2)-g(2,0))*y,R=(g(1,0)-g(0,1))*y):g(0,0)>g(1,1)&&g(0,0)>g(2,2)?(y=2*Math.sqrt(1+g(0,0)-g(1,1)-g(2,2)),F=.25*y,H=(g(0,1)+g(1,0))/y,R=(g(0,2)+g(2,0))/y,C=(g(2,1)-g(1,2))/y):g(1,1)>g(2,2)?(y=2*Math.sqrt(1+g(1,1)-g(0,0)-g(2,2)),F=(g(0,1)+g(1,0))/y,H=.25*y,R=(g(1,2)+g(2,1))/y,C=(g(0,2)-g(2,0))/y):(y=2*Math.sqrt(1+g(2,2)-g(0,0)-g(1,1)),F=(g(0,2)+g(2,0))/y,H=(g(1,2)+g(2,1))/y,R=.25*y,C=(g(1,0)-g(0,1))/y),h=[F,H,R,C],c=new e,c.translate=x,c.scale=v,c.skew=b,c.quaternion=h,c.perspective=l,c.rotate=m;for(S in c){k=c[S];for(o in k)T=k[o],isNaN(T)&&(k[o]=0)}return c},t.prototype.toString=function(){var t,e,n,r,i;for(n="matrix3d(",t=r=0;3>=r;t=++r)for(e=i=0;3>=i;e=++i)n+=Z(this.els[t][e],10),(3!==t||3!==e)&&(n+=",");return n+=")"},t.matrixForTransform=b(function(t){var e,n,r,i,o,s;return e=document.createElement("div"),e.style.position="absolute",e.style.visibility="hidden",e.style[A("transform")]=t,document.body.appendChild(e),r=window.getComputedStyle(e,null),n=null!=(i=null!=(o=r.transform)?o:r[A("transform")])?i:null!=(s=T.tests)?s.matrixForTransform(t):void 0,document.body.removeChild(e),n}),t.fromTransform=function(e){var n,r,i,o,s,a;for(o=null!=e?e.match(/matrix3?d?\(([-0-9,e \.]*)\)/):void 0,o?(n=o[1].split(","),n=n.map(parseFloat),r=6===n.length?[n[0],n[1],0,0,n[2],n[3],0,0,0,0,1,0,n[4],n[5],0,1]:n):r=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],s=[],i=a=0;3>=a;i=++a)s.push(r.slice(4*i,4*i+4));return new t(s)},t}(),I=b(function(t){var e,n,r,i,o,s,a,l,u,f;if(void 0!==document.body.style[t])return"";for(i=t.split("-"),o="",s=0,l=i.length;l>s;s++)r=i[s],o+=r.substring(0,1).toUpperCase()+r.substring(1);for(f=["Webkit","Moz","ms"],a=0,u=f.length;u>a;a++)if(n=f[a],e=n+o,void 0!==document.body.style[e])return n;return""}),A=b(function(t){var e;return e=I(t),"Moz"===e?""+e+(t.substring(0,1).toUpperCase()+t.substring(1)):""!==e?"-"+e.toLowerCase()+"-"+Q(t):Q(t)}),V="undefined"!=typeof window&&null!==window?window.requestAnimationFrame:void 0,p=[],m=[],P=!1,W=1,"undefined"!=typeof window&&null!==window&&window.addEventListener("keyup",function(t){return 68===t.keyCode&&t.shiftKey&&t.ctrlKey?T.toggleSlow():void 0}),null==V&&(q=0,V=function(t){var e,n,r;return e=Date.now(),r=Math.max(0,16-(e-q)),n=window.setTimeout(function(){return t(e+r)},r),q=e+r,n}),O=!1,E=!1,$=function(){return O?void 0:(O=!0,V(L))},L=function(t){var e,n,r,i;if(E)return void V(L);for(n=[],r=0,i=p.length;i>r;r++)e=p[r],c(t,e)||n.push(e);return p=p.filter(function(t){return-1===n.indexOf(t)}),0===p.length?O=!1:V(L)},c=function(t,e){var n,r,i,o,s,a,l,u;if(null==e.tStart&&(e.tStart=t),o=(t-e.tStart)/e.options.duration,s=e.curve(o),r={},o>=1)r=e.curve.initialForce?e.properties.start:e.properties.end;else{u=e.properties.start;for(n in u)i=u[n],r[n]=F(i,e.properties.end[n],s)}return g(e.el,r),"function"==typeof(a=e.options).change&&a.change(e.el),o>=1&&"function"==typeof(l=e.options).complete&&l.complete(e.el),1>o},F=function(t,e,n){return null!=t&&null!=t.interpolate?t.interpolate(e,n):null},N=function(t,e,n,r){var i,o,u,f,h,c,d,g;if(null!=r&&(m=m.filter(function(t){return t.id!==r})),T.stop(t,{timeout:!1}),!n.animated)return T.css(t,e),void("function"==typeof n.complete&&n.complete(this));e=z(e),h=C(t,Object.keys(e)),i={},c=[];for(u in e)d=e[u],_.contains(u)?c.push([u,d]):(i[u]=M(d),i[u]instanceof s&&null!=t.style&&(i[u].prefix="",null==(g=i[u]).suffix&&(g.suffix=ee(u,0))));return c.length>0&&(o=R(t),o?(f=new l,f.applyProperties(c)):(d=c.map(function(t){return te(t[0],t[1])}).join(" "),f=a.fromTransform(a.matrixForTransform(d))),i.transform=f.decompose(),o&&h.transform.applyRotateCenter([i.transform.props.rotate[1],i.transform.props.rotate[2]])),p.push({el:t,properties:{start:h,end:i},options:n,curve:n.type.call(n.type,n)}),$()},J=[],K=0,D=function(t){return H()?t.realTimeoutId=setTimeout(function(){return t.fn(),w(t.id)},t.delay):void 0},h=function(t,e){var n;return K+=1,n={id:K,tStart:Date.now(),fn:t,delay:e,originalDelay:e},D(n),J.push(n),K},w=function(t){return J=J.filter(function(e){return e.id===t&&clearTimeout(e.realTimeoutId),e.id!==t})},X=function(t,e){var n;return null!=t?(n=t-e.tStart,e.originalDelay-n):e.originalDelay},"undefined"!=typeof window&&null!==window&&window.addEventListener("unload",function(){}),U=null,j(function(t){var e,n,r,i,o,s,a,l,u,f;if(E=!t,t){if(O)for(n=Date.now()-U,o=0,l=p.length;l>o;o++)e=p[o],null!=e.tStart&&(e.tStart+=n);for(s=0,u=J.length;u>s;s++)r=J[s],r.delay=X(U,r),D(r);return U=null}for(U=Date.now(),f=[],i=0,a=J.length;a>i;i++)r=J[i],f.push(clearTimeout(r.realTimeoutId));return f}),T={},T.linear=function(){return function(t){return t}},T.spring=function(t){var e,n,r,i,o,s;return null==t&&(t={}),d(t,arguments.callee.defaults),i=Math.max(1,t.frequency/20),o=Math.pow(20,t.friction/100),s=t.anticipationSize/1e3,r=Math.max(0,s),e=function(e){var n,r,i,o,a;return n=.8,o=s/(1-s),a=0,i=(o-n*a)/(o-a),r=(n-i)/o,r*e*t.anticipationStrength/100+i},n=function(t){return Math.pow(o/10,-t)*(1-t)},function(t){var r,o,a,l,u,f,h,c;return f=t/(1-s)-s/(1-s),s>t?(c=s/(1-s)-s/(1-s),h=0/(1-s)-s/(1-s),u=Math.acos(1/e(c)),a=(Math.acos(1/e(h))-u)/(i*-s),r=e):(r=n,u=0,a=1),o=r(f),l=i*(t-s)*a+u,1-o*Math.cos(l)}},T.bounce=function(t){var e,n,r,i;return null==t&&(t={}),d(t,arguments.callee.defaults),r=Math.max(1,t.frequency/20),i=Math.pow(20,t.friction/100),e=function(t){return Math.pow(i/10,-t)*(1-t)},n=function(t){var n,i,o,s;return s=-1.57,i=1,n=e(t),o=r*t*i+s,n*Math.cos(o)},n.initialForce=!0,n},T.gravity=function(t){var e,n,r,i,o,s,a;return null==t&&(t={}),d(t,arguments.callee.defaults),n=Math.min(t.bounciness/1250,.8),i=t.elasticity/1e3,a=100,r=[],e=function(){var r,i;for(r=Math.sqrt(2/a),i={a:-r,b:r,H:1},t.initialForce&&(i.a=0,i.b=2*i.b);i.H>.001;)e=i.b-i.a,i={a:i.b,b:i.b+e*n,H:i.H*n*n};return i.b}(),s=function(n,r,i,o){var s,a;return e=r-n,a=2/e*o-1-2*n/e,s=a*a*i-i+1,t.initialForce&&(s=1-s),s},function(){var o,s,l,u;for(s=Math.sqrt(2/(a*e*e)),l={a:-s,b:s,H:1},t.initialForce&&(l.a=0,l.b=2*l.b),r.push(l),o=e,u=[];l.b<1&&l.H>.001;)o=l.b-l.a,l={a:l.b,b:l.b+o*n,H:l.H*i},u.push(r.push(l));return u}(),o=function(e){var n,i,o;for(i=0,n=r[i];!(e>=n.a&&e<=n.b)&&(i+=1,n=r[i]););return o=n?s(n.a,n.b,n.H,e):t.initialForce?0:1},o.initialForce=t.initialForce,o},T.forceWithGravity=function(t){return null==t&&(t={}),d(t,arguments.callee.defaults),t.initialForce=!0,T.gravity(t)},T.bezier=function(){var t,e,n;return e=function(t,e,n,r,i){return Math.pow(1-t,3)*e+3*Math.pow(1-t,2)*t*n+3*(1-t)*Math.pow(t,2)*r+Math.pow(t,3)*i},t=function(t,n,r,i,o){return{x:e(t,n.x,r.x,i.x,o.x),y:e(t,n.y,r.y,i.y,o.y)}},n=function(t,e,n){var r,i,o,s,a,l,u,f,h,c;for(r=null,h=0,c=e.length;c>h&&(i=e[h],t>=i(0).x&&t<=i(1).x&&(r=i),null===r);h++);if(!r)return n?0:1;for(f=1e-4,s=0,l=1,a=(l+s)/2,u=r(a).x,o=0;Math.abs(t-u)>f&&100>o;)t>u?s=a:l=a,a=(l+s)/2,u=r(a).x,o+=1;return r(a).y},function(e){var r,i,o;return null==e&&(e={}),i=e.points,o=!1,r=function(){var e,n,o;r=[],o=function(e,n){var i;return i=function(r){return t(r,e,e.cp[e.cp.length-1],n.cp[0],n)},r.push(i)};for(e in i){if(n=parseInt(e),n>=i.length-1)break;o(i[n],i[n+1])}return r}(),function(t){return 0===t?0:1===t?1:n(t,r,o)}}}(),T.easeInOut=function(t){var e,n;return null==t&&(t={}),e=null!=(n=t.friction)?n:arguments.callee.defaults.friction,T.bezier({points:[{x:0,y:0,cp:[{x:.92-e/1e3,y:0}]},{x:1,y:1,cp:[{x:.08+e/1e3,y:1}]}]})},T.easeIn=function(t){var e,n;return null==t&&(t={}),e=null!=(n=t.friction)?n:arguments.callee.defaults.friction,T.bezier({points:[{x:0,y:0,cp:[{x:.92-e/1e3,y:0}]},{x:1,y:1,cp:[{x:1,y:1}]}]})},T.easeOut=function(t){var e,n;return null==t&&(t={}),e=null!=(n=t.friction)?n:arguments.callee.defaults.friction,T.bezier({points:[{x:0,y:0,cp:[{x:0,y:0}]},{x:1,y:1,cp:[{x:.08+e/1e3,y:1}]}]})},T.spring.defaults={frequency:300,friction:200,anticipationSize:0,anticipationStrength:0},T.bounce.defaults={frequency:300,friction:200},T.forceWithGravity.defaults=T.gravity.defaults={bounciness:400,elasticity:200},T.easeInOut.defaults=T.easeIn.defaults=T.easeOut.defaults={friction:500},T.css=Y(function(t,e){return y(t,e,!0)}),T.animate=Y(function(t,e,n){var r;return null==n&&(n={}),n=x(n),d(n,{type:T.easeInOut,duration:1e3,delay:0,animated:!0}),n.duration=Math.max(0,n.duration*W),n.delay=Math.max(0,n.delay),0===n.delay?N(t,e,n):(r=T.setTimeout(function(){return N(t,e,n,r)},n.delay),m.push({id:r,el:t}))}),T.stop=Y(function(t,e){return null==e&&(e={}),null==e.timeout&&(e.timeout=!0),e.timeout&&(m=m.filter(function(n){return n.el!==t||null!=e.filter&&!e.filter(n)?!1:(T.clearTimeout(n.id),!0)})),p=p.filter(function(e){return e.el!==t})}),T.setTimeout=function(t,e){return h(t,e*W)},T.clearTimeout=function(t){return w(t)},T.toggleSlow=function(){return P=!P,W=P?3:1,"undefined"!=typeof console&&null!==console&&"function"==typeof console.log?console.log("dynamics.js: slow animations "+(P?"enabled":"disabled")):void 0},"object"==typeof module&&"object"==typeof module.exports?module.exports=T:"function"==typeof define?define("dynamics",function(){return T}):window.dynamics=T}).call(this);

/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */
;(function(window) {

    'use strict';

    var support = { animations : Modernizr.cssanimations },
        animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
        animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
        onEndAnimation = function( el, callback ) {
            var onEndCallbackFn = function( ev ) {
                if( support.animations ) {
                    if( ev.target != this ) return;
                    this.removeEventListener( animEndEventName, onEndCallbackFn );
                }
                if( callback && typeof callback === 'function' ) { callback.call(); }
            };
            if( support.animations ) {
                el.addEventListener( animEndEventName, onEndCallbackFn );
            }
            else {
                onEndCallbackFn();
            }
        };

    function extend( a, b ) {
        for( var key in b ) { 
            if( b.hasOwnProperty( key ) ) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function Stack(el, options) {
        this.el = el;
        this.options = extend( {}, this.options );
        extend( this.options, options );
        this.items = [].slice.call(this.el.children);
        this.itemsTotal = this.items.length;
        if( this.options.infinite && this.options.visible >= this.itemsTotal || !this.options.infinite && this.options.visible > this.itemsTotal || this.options.visible <=0 ) {
            this.options.visible = 1;
        }
        this.current = 0;
        this._init();
    }

    Stack.prototype.options = {
        // stack's perspective value
        perspective: 1000,
        // stack's perspective origin
        perspectiveOrigin : '50% -50%',
        // number of visible items in the stack
        visible : 3,
        // infinite navigation
        infinite : true,
        // callback: when reaching the end of the stack
        onEndStack : function() {return false;},
        // animation settings for the items' movements in the stack when the items rearrange
        // object that is passed to the dynamicsjs animate function (see more at http://dynamicsjs.com/)
        // example:
        // {type: dynamics.spring,duration: 1641,frequency: 557,friction: 459,anticipationSize: 206,anticipationStrength: 392}
        stackItemsAnimation : {
            duration : 500,
            type : dynamics.bezier,
            points : [{'x':0,'y':0,'cp':[{'x':0.25,'y':0.1}]},{'x':1,'y':1,'cp':[{'x':0.25,'y':1}]}]
        },
        // delay for the items' rearrangement / delay before stackItemsAnimation is applied
        stackItemsAnimationDelay : 0,
        // animation settings for the items' movements in the stack before the rearrangement
        // we can set up different settings depending on whether we are approving or rejecting an item
        /*
        stackItemsPreAnimation : {
            reject : {
                // if true, then the settings.properties parameter will be distributed through the items in a non equal fashion
                // for instance, if we set settings.properties = {translateX:100} and we have options.visible = 4, 
                // then the second item in the stack will translate 100px, the second one 75px and the third 70px
                elastic : true,
                // object that is passed into the dynamicsjs animate function - second parameter -  (see more at http://dynamicsjs.com/)
                animationProperties : {},
                // object that is passed into the dynamicsjs animate function - third parameter - (see more at http://dynamicsjs.com/)
                animationSettings : {} 
            },
            accept : {
                // if true, then the settings.properties parameter will be distributed through the items in a non equal fashion
                // for instance, if we set settings.properties = {translateX:100} and we have options.visible = 4, 
                // then the second item on the stack will translate 100px, the second one 75px and the third 70px
                elastic : true,
                // object that is passed into the dynamicsjs animate function - second parameter -  (see more at http://dynamicsjs.com/)
                animationProperties : {},
                // object that is passed into the dynamicsjs animate function (see more at http://dynamicsjs.com/)
                animationSettings : {}
            }
        }
        */
    };

    // set the initial styles for the visible items
    Stack.prototype._init = function() {
        // set default styles
        // first, the stack
        this.el.style.WebkitPerspective = this.el.style.perspective = this.options.perspective + 'px';
        this.el.style.WebkitPerspectiveOrigin = this.el.style.perspectiveOrigin = this.options.perspectiveOrigin;

        var self = this;

        // the items
        for(var i = 0; i < this.itemsTotal; ++i) {
            var item = this.items[i];
            if( i < this.options.visible ) {
                item.style.opacity = 1;
                item.style.pointerEvents = 'auto';
                item.style.zIndex = i === 0 ? parseInt(this.options.visible + 1) : parseInt(this.options.visible - i);
                item.style.WebkitTransform = item.style.transform = 'translate3d(0px, 0px, ' + parseInt(-1 * 70 * i) + 'px)';
            }
            else {
                item.style.WebkitTransform = item.style.transform = 'translate3d(0,0,-' + parseInt(this.options.visible * 70) + 'px)';
            }
        }

        classie.add(this.items[this.current], 'stack__item--current');
    };

    Stack.prototype.reject = function(callback) {
        this._next('reject', callback);
    };

    Stack.prototype.accept = function(callback) {
        this._next('accept', callback);
    };

    Stack.prototype.restart = function() {
        this.hasEnded = false;
        this._init();
    };

    Stack.prototype._next = function(action, callback) {
        if( this.isAnimating || ( !this.options.infinite && this.hasEnded ) ) return;
        this.isAnimating = true;

        // current item
        var currentItem = this.items[this.current];
        classie.remove(currentItem, 'stack__item--current');

        // add animation class
        classie.add(currentItem, action === 'accept' ? 'stack__item--accept' : 'stack__item--reject');

        var self = this;
        onEndAnimation(currentItem, function() {
            // reset current item
            currentItem.style.opacity = 0;
            currentItem.style.pointerEvents = 'none';
            currentItem.style.zIndex = -1;
            currentItem.style.WebkitTransform = currentItem.style.transform = 'translate3d(0px, 0px, -' + parseInt(self.options.visible * 70) + 'px)';

            classie.remove(currentItem, action === 'accept' ? 'stack__item--accept' : 'stack__item--reject');

            self.items[self.current].style.zIndex = self.options.visible + 1;
            self.isAnimating = false;

            if( callback ) callback();
            
            if( !self.options.infinite && self.current === 0 ) {
                self.hasEnded = true;
                // callback
                self.options.onEndStack(self);
            }
        });

        // set style for the other items
        for(var i = 0; i < this.itemsTotal; ++i) {
            if( i >= this.options.visible ) break;

            if( !this.options.infinite ) {
                if( this.current + i >= this.itemsTotal - 1 ) break;
                var pos = this.current + i + 1;
            }
            else {
                var pos = this.current + i < this.itemsTotal - 1 ? this.current + i + 1 : i - (this.itemsTotal - this.current - 1);
            }

            var item = this.items[pos],
                // stack items animation
                animateStackItems = function(item, i) {
                    item.style.pointerEvents = 'auto';
                    item.style.opacity = 1;
                    item.style.zIndex = parseInt(self.options.visible - i);
                    
                    dynamics.animate(item, {
                        translateZ : parseInt(-1 * 70 * i)
                    }, self.options.stackItemsAnimation);
                };

            setTimeout(function(item,i) {
                return function() {
                    var preAnimation;

                    if( self.options.stackItemsPreAnimation ) {
                        preAnimation = action === 'accept' ? self.options.stackItemsPreAnimation.accept : self.options.stackItemsPreAnimation.reject;
                    }
                    
                    if( preAnimation ) {
                        // items "pre animation" properties
                        var animProps = {};
                        
                        for (var key in preAnimation.animationProperties) {
                            var interval = preAnimation.elastic ? preAnimation.animationProperties[key]/self.options.visible : 0;
                            animProps[key] = preAnimation.animationProperties[key] - Number(i*interval);
                        }

                        // this one remains the same..
                        animProps.translateZ = parseInt(-1 * 70 * (i+1));

                        preAnimation.animationSettings.complete = function() {
                            animateStackItems(item, i);
                        };
                        
                        dynamics.animate(item, animProps, preAnimation.animationSettings);
                    }
                    else {
                        animateStackItems(item, i);
                    }
                };
            }(item,i), this.options.stackItemsAnimationDelay);
        }

        // update current
        this.current = this.current < this.itemsTotal - 1 ? this.current + 1 : 0;
        classie.add(this.items[this.current], 'stack__item--current');
    }

    window.Stack = Stack;

})(window);