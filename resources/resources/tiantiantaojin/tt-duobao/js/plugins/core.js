
var __ns = function (fullNs) {
    var nsArray = fullNs.split('.');
    var evalStr = '';
    var ns = '';
    for (var i = 0, l = nsArray.length; i < l; i++) {
        i !== 0 && (ns += '.');
        ns += nsArray[i];
        evalStr += '( typeof ' + ns + ' === "undefined" && (' + ns + ' = {}) );';
    }
    evalStr !== '' && eval(evalStr);
}
var __noop = function () { };
var W = W || window;
__ns('H');

// 点击里
var senduserlog = function(btid,eventdes){
    $.ajax({
        type:"GET",
        dataType:"jsonp",
        jsonp: "callback",
        url: business_url + "user/log/add",
        data: {
            appId: busiAppId,
            openId: openid,
            eventDesc: encodeURIComponent(eventdes),
            eventId: btid,
            operateType:state,
            isPageLoad: false
        },
        showload: false
    })
}

var onpageload = function(){
    $.ajax({
        type:"GET",
        dataType:"jsonp",
        jsonp: "callback",
        url: business_url + "user/log/add",
        data: {
            appId: busiAppId,
            openId: openid,
            eventDesc: "",
            eventId: "",
            operateType:state,
            isPageLoad: true
        },
        showload: false
    })
}
var callbackUserSaveHandler = function (data) { };
var getQueryString = function (name) {
    var currentSearch = decodeURIComponent(location.search.slice(1));
    if (currentSearch != '') {
        var paras = currentSearch.split('&');
        for (var i = 0, l = paras.length, items; i < l; i++) {
            items = paras[i].split('=');
            if (items[0] === name) {
                return items[1];
            }
        }
        return '';
    }
    return '';
};

var from = getQueryString("from");
var gefrom = from || getQueryString("gefrom");
var S = {};

var getResult = function(url, data, callback, showloading, $target, isAsync) { 
    if (showloading) {
        showLoading($target);
    }
    $.ajax({
        type : 'GET',
        async : typeof isAsync === 'undefined' ? false : isAsync,
        url : business_url + url,
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

var simpleTpl = function (tpl) {
    tpl = $.isArray(tpl) ? tpl.join('') : (tpl || '');

    return {
        store: tpl,
        _: function () {
            var me = this;
            $.each(arguments, function (index, value) {
                me.store += value;
            });
            return this;
        },
        toString: function () {
            return this.store;
        }
    };
};

var share = function (backUrl) {
    var t = simpleTpl(),
        $share_box = $('#share-box');

    if ($share_box.length == 0) {
        t._('<div class="share-box" id="share-box"></div>');
        $share_box = $(t.toString());
        $share_box.click(function (e) {
            $(this).hide();
        });
        $('body').append($share_box);
    } else {
        $share_box.show();
    }
};

var str2date = function (str) {

    str = str.replace(/-/g, '/');
    return new Date(str);
};

var timestamp = function (str) {
    return Date.parse(str2date(str));
};

// yyyy年MM月dd日 hh:mm:ss
var dateformat = function (date, format) {
    var z = {
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    };
    format = format.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
    });
    return format.replace(/(y+)/g, function (v) {
        return date.getFullYear().toString().slice(-v.length)
    });
}

var dateNum = function (num) {
    return num < 10 ? '0' + num : num;
};
//加载的loading
var showLoading = function($container, tips) {
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
};
//隐藏loading
var hideLoading = function ($container) {
    if ($container) {
        $container.find('.spinner').hide();
    } else {
        $('body').children('.spinner').hide();
    }
    $('.copyright').removeClass('hidden');
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

var add_param = function (sourceUrl, parameterName, parameterValue, replaceDuplicates) {
    if ((sourceUrl == null) || (sourceUrl.length == 0)) {
        sourceUrl = document.location.href;
    }
    var urlParts = sourceUrl.split("?");
    var newQueryString = "";
    if (urlParts.length > 1) {
        var parameters = urlParts[1].split("&");
        for (var i = 0; (i < parameters.length); i++) {
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
var delete_param = function(url, paramName) {
    var str = "";
    if (url.indexOf('?') != -1) {
        str = url.substr(url.indexOf('?') + 1);
    }
    else {
        return url;
    }
    var arr = "";
    var returnurl = "";
    var setparam = "";
    if (str.indexOf('&') != -1) {
        arr = str.split('&');
        for (var i in arr) {
            if (arr[i].split('=')[0] != paramName) {
                returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
            }
        }
        return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
    }
    else {
        arr = str.split('=');
        if (arr[0] == paramName) {
            return url.substr(0, url.indexOf('?'));
        }
        else {
            return url;
        }
    }
}

var callbackAddUserOperateLogHandler = function()
{

}
var add_yao_prefix = function (url) {
    //return encodeURIComponent(url);
    return 'http://yao.qq.com/tv/entry?redirect_uri=' + encodeURIComponent(url);
};

var is_android = function () {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("android") > -1;
};
//小弹出框
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

var toUrl = function(url) {
    // showLoading($("body"),"飞快跳转...");
    //urlLoding();
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
    setTimeout(function(){window.location.href = url}, 200);
};

var openInWeixin = function () {
        return /MicroMessenger/i.test(navigator.userAgent);
};
var urlLoding = function()
{
        var t = simpleTpl(), spinnerSize = 146,
        width = $(window).width(),
        height = $(window).height(),
        $container = $container || $('body'),
        $spinner = $container ? $container.find('#spinner') : $('body').children('#spinner'),
        $urljump = $container ? $container.find('#urljump') : $('body').children('#urljump');
        if ($spinner.length > 0) {
            $spinner.remove();
        };
        if ($urljump.length > 0) {
            $urljump.remove();
        };
        var srcurl="";
        if(share_url.indexOf('html/') != -1)
        {
            srcurl="../../svg/spinning-circles.svg";
        }
        else
        {
            srcurl="svg/spinning-circles.svg";
        }
        t._('<ul class="urljump"><li>')
        ._('<img src="'+srcurl+'" width="50" alt="">')
        ._('</li></ul>')
    $spinner = $(t.toString()).css({'top': (height - spinnerSize) / 2, 'left': (width - spinnerSize) / 2});
    $container.append($spinner);
};
// 倒计时
(function($) {
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
            return num = "<label>"+ numF + "</label><label>" + numS + '</label>';
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
                    if(ms_>=10 && ms_ <100)
                    {
                        ms_ = "0"+ms_;
                    }
                    if(ms_ < 10)
                    {
                        ms_ = "00"+ms_;
                    }
                    ms_ = ms_.toString().substr(0,2);
                    // num = num-1;
                    // if(num<=0)
                    // {
                    //     num=60;
                    // };
                    // num = dateNum(num);
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
(function ($) {
    $.fn.progress = function (options) {
        var defaultVal = {
            // 存放结束时间
            eAttr: 'data-etime',
            sAttr: 'data-stime', // 存放开始时间
            stpl: '%H%:%M%:%S%', // 还有...开始
            wTime: 500, // 以500毫秒为单位进行演算
            cTime: new Date().getTime(),
            callback: null
        };
        var s = $.extend(defaultVal, options);
        window.progressTimeInterval = 0;
        var vthis = $(this);
        var width = $(window).width();
        var runTime = function () {
            s.cTime += s.wTime;
            vthis.each(function () {
                var nthis = $(this);
                var sorgT = parseInt(nthis.attr(s.sAttr));
                var eorgT = parseInt(nthis.attr(s.eAttr));
                var porgT = parseInt(nthis.attr(s.pAttr));
                var sT = isNaN(sorgT) ? 0 : sorgT - s.cTime;
                var eT = isNaN(eorgT) ? 0 : eorgT - s.cTime;
                var showTime = function (rT, showTpl) {
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
        window.progressTimeInterval = setInterval(function () {
            runTime();
        }, s.wTime);
    };
})(Zepto);


var getUrl = function () {
    var href = window.location.href;
    href = add_param(href, 'resopenid', hex_md5(openid), true);
    href = add_param(href, 'from', 'share', true);
    return add_yao_prefix(href);
};



$(function () {
    onpageload();
    $("script").each(function (i, item) {
        var scr = $(this).attr("src");
        $(this).attr("src", scr + "?v=" + version);
    });
    $("link").each(function (i, item) {
        var href = $(this).attr("href");
    });
    var height = $(window).height(),
        margin = $('.main').attr('data-margin') || 50;
    $('.main').css('minHeight', height - margin);

    // var shareUrl = getUrl().replace(/comment|myscore/, "index");
    // shareUrl = delete_param(shareUrl, "openid");
    // shareUrl = delete_param(shareUrl, "headimgurl");
    // shareUrl = delete_param(shareUrl, "nickname");
    $('body').delegate("*[data-collect='true']", "click", function (e) {
        e.preventDefault();

        if ($(this).attr('data-stoppropagation') == 'true') {
            e.stopPropagation();
        }
        var href = $(this).attr('href'); 
        if (href && href !== '#') {
            setTimeout(function() {
                window.location.href = href;
            }, 5);
        }
        senduserlog($(this).attr("data-collect-flag"), $(this).attr("data-collect-desc"));
    });

    // 分享
    if(share_url.indexOf('html/') != -1)
    {
        shareUrl = share_url.substr(0,share_url.indexOf('html/'))+"index.html";
    }
    else
    {
        shareUrl = share_url.split("?")[0];
    }
    var href = add_param(shareUrl, 'resopenid', hex_md5(openid), true);
    // alert(href);
    // href = add_param(href, 'from', 'share', true);
    var wxData = {
     "appId": busiAppId,
     "imgUrl": share_img,
     "link": href,
     "desc": share_desc,
     "title": share_title
    };
    
    if(!($("body").attr("date-state")=="specicl-share"))
    {
        H.jssdk.init(wxData);
    }
});




