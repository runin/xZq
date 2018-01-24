var W = W || window;
var showTipsFlag = true;

var __ns = function( fullNs ) {
    var nsArray = fullNs.split('.');
    var evalStr = '';
    var ns = '';
    for ( var i = 0, l = nsArray.length; i < l; i++ ) {
        i !== 0 && ( ns += '.' );
        ns += nsArray[i];
        evalStr += '( typeof ' + ns + ' === "undefined" && (' + ns + ' = {}) );';
    }
    evalStr !== '' && eval( evalStr );
};
__ns('H');

// var recordUserLog = function(openid, operateDesc, operateDomId) {
//     $.ajax({
//         type : "get",
//         async : true,
//         url : report_url + "api/log/report" + dev,
//         dataType : "jsonp",
//         jsonp : "callback",
//         data : {
//             source: "yaotv",
//             siteId: "source_" + serviceNo,
//             usrType: "openid",
//             usrId : openid,
//             operateDesc : encodeURIComponent(operateDesc),
//             operateDomId : operateDomId
//         }
//     });
// };

// var recordUserOperate = function(openid, operateDesc, operateDomId) {
//     recordUserLog(openid, operateDesc, operateDomId);
// };

// var recordUserPage = function(openid, pageDesc) {
//     recordUserLog(openid, pageDesc, "");
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
}

var recordUserOperate = function(openid, operateDesc, operateDomId) {
    recordUserLog(openid, operateDesc, operateDomId, "", "false");
};

var recordUserPage = function(openid, operateDesc, loadingTime) {
    recordUserLog(openid, operateDesc, "", loadingTime, "true");
};

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
            for (var i = 0, l = paras.length, items; i < l; i++) {
                var ori = paras[i];
                if (paras[i].indexOf('#') >= 0) {
                    paras[i] = paras[i].split('#')[0];
                }
                items = paras[i].split('=');
                if (items[0] === name) return items[1];
            };
            return '';
        } else {
            return '';
        }
    } else {
        return '';
    }
};

var scrollToTopInProgress = false
$.fn.scrollToTop = function(position, onEndCallback) {
    var $this = this,
        targetY = position || 0,
        initialY = $this.scrollTop(),
        lastY = initialY,
        delta = targetY - initialY,
        speed = Math.min(750, Math.min(1500, Math.abs(initialY - targetY))),
        start, t, y,
        frame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                timeOutId = setTimeout(function() {
                    callback(currTime + timeToCall)
                }, timeToCall);
            lastTime = currTime + timeToCall
            return timeOutId
        },
        cancelScroll = function() {
            abort()
        }
    if (scrollToTopInProgress) return
    if (delta == 0) return

    function smooth(pos) {
        if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 5)
        return 0.5 * (Math.pow((pos - 2), 5) + 2)
    }

    function abort() {
        $this.off('touchstart', cancelScroll)
        scrollToTopInProgress = false
        if (typeof onEndCallback == 'function')
            onEndCallback.call(this, targetY)
    }
    $this.on('touchstart', cancelScroll)
    scrollToTopInProgress = true
    frame(function render(now) {
        if (!scrollToTopInProgress) return
        if (!start) start = now
        t = Math.min(1, Math.max((now - start) / speed, 0))
        y = Math.round(initialY + delta * smooth(t))
        if (delta > 0 && y > targetY) y = targetY
        if (delta < 0 && y < targetY) y = targetY
        if (lastY != y) $this.scrollTop(y)
        lastY = y
        if (y !== targetY) frame(render)
        else abort()
    })
};

var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
Math.sn = function (len, radix) {
    var chars = CHARS, sn = [], i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) sn[i] = chars[0 | Math.random()*radix];
    } else {
        var r;
        sn[8] = sn[13] = sn[18] = sn[23] = '-';
        sn[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!sn[i]) {
                r = 0 | Math.random()*16;
                sn[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    var re = new RegExp("-", "g");
    return sn.join('').toLocaleLowerCase().replace(re, "");
};

var from = getQueryString("from");
var gefrom = from || getQueryString("gefrom");

var showLoading = shownewLoading = function($container, tips) {
    var t = simpleTpl(),
        width = $(window).width(),
        height = $(window).height(),
        $container = $container || $('body'),
        $loading = $container ? $container.find('#qy_loading') : $('body').children('#qy_loading'),
        tips = tips || '努力加载中...';
    if ($loading.length > 0) $loading.remove();
    t._('<section id="qy_loading" class="qy-loading">')
        ._('<section class="qy-loading-logo">')
            ._('<section class="qy-logo-1"></section>')
            ._('<section class="qy-logo-2"></section>')
            ._('<section class="qy-logo-3"></section>')
        ._('</section>')
        ._('<section class="qy-loading-tips">' + tips+ '</section>')
    ._('</section>');
    $container.append(t.toString());
};

var hideLoading = hidenewLoading = function($container) {
    if ($container) {
        $container.find('#qy_loading').remove();
    } else {
        $('body').children('#qy_loading').remove();
    }
};

var toUrl = function(url) {
    // shownewLoading(null, '跳转中...');
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
    // $('.module-con').addClass('pageHide animated');
    $('body').removeClass().addClass('pageHide animated');
    setTimeout(function(){window.location.href = url}, 150);
};

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
            if (showloading) hidenewLoading();
        },
        success : function(data) {}
    });
};

var getBeforeDate = function(n){
    var n = n, d = new Date();
    var year = d.getFullYear(), mon=d.getMonth() + 1, day=d.getDate();
    if(day <= n){
        if(mon > 1) {
            mon = mon - 1;
        } else {
            year = year - 1;
            mon = 12;
        }
    }
    d.setDate(d.getDate() - n);
    year = d.getFullYear();
    mon=d.getMonth() + 1;
    day=d.getDate();
    s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);
    return s;
};

var timeTransform = function(TimeMillis){
    var data = new Date(TimeMillis);
    var year = data.getFullYear();
    var month = data.getMonth()>=9?(data.getMonth()+1).toString():'0' + (data.getMonth()+1);
    var day = data.getDate()>9?data.getDate().toString():'0' + data.getDate();
    var hours = data.getHours()>9?data.getHours().toString():'0' + data.getHours();
    var minutes = data.getMinutes()>9?data.getMinutes().toString():'0' + data.getMinutes();
    var ss = data.getSeconds()>9?data.getSeconds().toString():'0' + data.getSeconds();
    var time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":"+ ss;
    return time;
};

var simpleTpl = function(tpl) {
    tpl = $.isArray(tpl) ? tpl.join('') : (tpl || '');
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
    var year = _d(date.getFullYear()), month = _d(date.getMonth() + 1), day = _d(date.getDate()), hour = _d(date.getHours()), minute = _d(date.getMinutes()), second = _d(date.getSeconds());
    formatDate = format.replace(/yyyy/i, year).replace(/mm/i, month).replace(/dd/i, day).replace(/hh/i, hour).replace(/ii/i, minute).replace(/ss/i, second);
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
        };
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

var getRandomArbitrary = function(min, max) {
    return parseInt(Math.random()*(max - min)+min);
};
$.fn.countDown = function(options) {
    var defaultVal = {
        // 存放结束时间
        eAttr : 'etime',
        sAttr : 'stime', // 存放开始时间
        wTime : 100, // 以100毫秒为单位进行演算
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
        return num = numF + "" + numS;
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
            	 var ss_ = Math.round(rT / s.wTime);
                ss_ = subNum(dateNum(Math.floor(ss_ *s.wTime/1000)));
                var s_ = Math.round((rT % 60000) / s.wTime);
                s_ = subNum(dateNum(Math.min(Math.floor(s_ / 1000 * s.wTime), 59)));
                var m_ = subNum(dateNum(Math.floor((rT % 3600000) / 60000)));
                var h_ = subNum(dateNum(Math.floor((rT % 86400000) / 3600000)));
                var d_ = subNum(dateNum(Math.floor(rT / 86400000)));
                nthis.html(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_).replace(/%SS%/, ss_));
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
				container.wrap('<div class="mqWrapper" style="overflow:hidden;position:relative;"></div>').css( { "width":containerSize*slideW*3,"position":"relative","overflow":"hidden","padding":"0","margin":"0","transform":"translate3d(" + (-containerSize*slideW) + "px, 0px, 0px)"});
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
					var tempLeft = container.css("transform").replace('translate3d(','').replace('px, 0px, 0px)',''); 
					if(index == 0){
						container.animate({"transform":"translate3d(" + (++tempLeft) + "px, 0px, 0px)"},0,function(){
							if(container.css("transform").replace('translate3d(','').replace('px, 0px, 0px)','')*1 >= 0){
								for(var i=0; i<containerSize; i++){
                                    container.prepend(container.children().last());
								};
								container.css("transform", "translate3d(" + (-containerSize*slideW) + "px, 0px, 0px)");
							}
						});
					} else {
                        if ((containerSize*slideW*3 + tempLeft*1) <= 0) tempLeft = 500;
						container.animate({"transform":"translate3d(" + (--tempLeft) + "px, 0px, 0px)"},0,function(){
							if(container.css("transform").replace('translate3d(','').replace('px, 0px, 0px)','')*1 <= -containerSize*slideW*1.755){
								for(var i=0; i<containerSize; i++){
                                    container.append(container.children().first());
								};
								container.css("transform", "translate3d(" + (-containerSize*slideW)) + "px, 0px, 0px)";
                            }
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
}
$.fn.progress = function(options) {
    var defaultVal = { 
        eAttr : 'data-etime',
        sAttr : 'data-stime',
        stpl : '%H%:%M%:%S%',
        wTime : 500,
        cTime : new Date().getTime(),
        callback: null
    };
    var s = $.extend(defaultVal, options);
    window.progressTimeInterval = 0;
    var vthis = $(this);
    var width = $(window).width();
    var runTime = function() {
        s.cTime += s.wTime;
        vthis.each(function() {
            var nthis = $(this);
            var sorgT = parseInt(nthis.attr(s.sAttr));
            var eorgT = parseInt(nthis.attr(s.eAttr));
            var porgT = parseInt(nthis.attr(s.pAttr));
            var sT = isNaN(sorgT) ? 0 : sorgT - s.cTime;
            var eT = isNaN(eorgT) ? 0 : eorgT - s.cTime;
            var showTime = function(rT, showTpl) {
                var s_ = Math.round((rT % 60000) / s.wTime);
                s_ = dateNum(Math.min(Math.floor(s_ / 1000 * s.wTime), 59));
                var m_ = dateNum(Math.floor((rT % 3600000) / 60000));
                var h_ = dateNum(Math.floor((rT % 86400000) / 3600000));
                var d_ = dateNum(Math.floor(rT / 86400000));
                nthis.attr('data-timestr', showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
            };
            
            var state = 0;
            if (sT > 0) {// 即将开始
                state = 1;
                showTime(sT, s.stpl);
            } else if (eT > 0) {//正在进行
                state = 2;
            } else {// 比赛结束
                state = 3;
            }
            s.callback && s.callback(state);
        });
    };
    runTime();
    window.progressTimeInterval = setInterval(function() {
        runTime();
    }, s.wTime);
};

var replaceParamVal = function(href,paramName,replaceWith) {
    var re=eval('/('+ paramName+'=)([^&]*)/gi');
    var nUrl = href.replace(re,paramName+'='+replaceWith);
    return nUrl;
};

var delQueStr = function(url, ref) {
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
    href = add_param(share_url.replace(/[^\/]*\.html/i, 'index.html'), 'resopenid', hex_md5(openid), true);
    href = add_param(href, 'from', 'share', true);
    href = add_param(href, 'friUid', openid, true);
    href = delQueStr(href, "openid");
    href = delQueStr(href, "matk");
    href = delQueStr(href, "headimgurl");
    href = delQueStr(href, "nickname");
    return add_yao_prefix(href);
};

$(function() {
    $('.module-con').each(function(index, el) {
        var mode = $(this).attr('data-size'),
            width = $(window).width(),
            height = $(window).height();

        switch(mode){
            case "window":
                $(this).css({'width': width, 'height': height});
                break;
            case "width":
                $(this).css({'width': width});
                break;
            case "height":
                $(this).css({'height': height});
                break;
        }
    });
    recordUserPage(openid, $('title').html(), "");
    setTimeout(function(){
        $('#J_background').each(function(index, el) {
            $(this).removeClass('bgscaleIn animated');
        });
    }, 5000);
    var $copyright = $('.copyright'), cbUrl = window.location.href;
    if($copyright) $copyright.html(copyright);
    if(cbUrl.indexOf('cb41faa22e731e9b') < 0 ){
        $('#div_subscribe_area').css('height', '0');
        $('body').removeClass('subscribe');
    } else {
        $('#div_subscribe_area').css('height', '50px');
        $('body').addClass('subscribe');
    }
    $("script").each(function(i, item) {
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
            }
            share_img = data.si;
            share_title = data.st;
            share_desc = data.sd;
            share_group = data.sgt;
            wxData = {"imgUrl": share_img,"link": share_url,"desc": share_desc,"title": share_title};
            wxshareData = {"imgUrl": share_img,"link": share_url,"desc": share_desc,"title": share_title};
            if (location.href.indexOf(sharePage) < 0) {
                window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, getUrl(openid));
            }
            var typeofAppid = typeof(follow_shaketv_appid);
            if (typeofAppid == 'undefined' || typeofAppid == '' || typeofAppid == null) {
                return;
            } else {
                if(openid){
                    window['shaketv'] && shaketv.subscribe({
                        appid: follow_shaketv_appid,
                        selector: "#div_subscribe_area",
                        type: 1
                    }, function (returnData) {
                        $('body').removeClass('subscribe');
                    });
                };
            };
            if (location.href.indexOf(sharePage) < 0) {
                new Authorize({callBackPage:"index.html"}).init(check_weixin_login());
            } else {
                if (location.href.indexOf(sharePageExpect) >= 0) {
                    new Authorize({callBackPage:"index.html"}).init(check_weixin_login());
                } else {
                    new Authorize({callBackPage:sharePage}).init(check_weixin_login());
                }
            }
        },
        error : function() {
            if (location.href.indexOf(sharePage) < 0) {
                new Authorize({callBackPage:"index.html"}).init(check_weixin_login());
            } else {
                if (location.href.indexOf(sharePageExpect) >= 0) {
                    new Authorize({callBackPage:"index.html"}).init(check_weixin_login());
                } else {
                    new Authorize({callBackPage:sharePage}).init(check_weixin_login());
                }
            }
        }
    });
    
    // 从data_collect.js里转移过来的
    
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
            }, 10);
        }
    });
    $('#J_background').css('height', $(window).height());
    $('body').addClass('pageShow animated');
});