/*
 * 素材基本功能
 *
 * @version v1.2
 * @author bobchen
 */
//时间转换
var str2date = function(str) {
    str = str.replace(/-/g, '/');
    return new Date(str);
};
var timestamp = function(str) {
    return Date.parse(str2date(str));
};

/**
 *	初始化命名空间
 */
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

/**
 *	END OF 初始化命名空间
 */


/**
 *	上报点击日志以及PV统计
 */
var getQueryString = function (name) {
    var currentSearch = decodeURIComponent(location.search.slice(1));
    if (currentSearch != '') {
        var paras = currentSearch.split('&');
        for (var i = 0, l = paras.length, items; i < l; i++) {
            var sindex = paras[i].search("=");
            var tname = paras[i].substring(0, sindex);
            var tval = paras[i].substring(sindex + 1, paras[i].length);
            if (tname === name) {
                return tval;
            }
        }
        return '';
    }
    return '';
};

var from = getQueryString("from");

var recordUserLog = function (openid, operateDesc, operateDomId, loadingTime, flag) {
    $.ajax({
        type: "get",
        async: false,
        url: domain_url + "userlog",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "callbackDataHandler",
        data: {
            openId: openid,
            operateDesc: encodeURIComponent(operateDesc),
            operateDomId: operateDomId,
            loadingTime: loadingTime,
            from: from,
            flag: flag
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
var recordUserOperate = function (openid, operateDesc, operateDomId) {
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

var callbackUserSaveHandler = function (data) {};

$(function () {
    recordUserPage(openid, $('title').html(), "");
    $('body').delegate("*[data-collect='true']", "click", function (e) {
        e.preventDefault();

        if ($(this).attr('data-stoppropagation') == 'true') {
            e.stopPropagation();
        }
        recordUserOperate(openid, $(this).attr("data-collect-desc"), $(this).attr("data-collect-flag"));

        var href = $(this).attr('href');
        if (href && href !== '#') {
            if (from) {
                href = add_param(href, 'from', from, true);
            }
            setTimeout(function () {
                window.location.href = href;
            }, 5);
        }
    });
});

/**
 *	END OF 上报点击日志以及PV统计
 */


/**
 *  版本检查、分享、一键关注
 */
 var getUrl = function () {
    var href = window.location.href;
    if(share_page){
        href = href.replace(/[^\/]*\.html/i, share_page);
    }else{
        href = href.replace(/[^\/]*\.html/i, 'index.html');
    }

    href = add_param(href, 'resopenid', hex_md5(openid), true);
    href = add_param(href, 'from', 'share', true);

    href = add_param(href, 'openid', null, true);
    href = add_param(href, 'headimgurl', null, true);
    href = add_param(href, 'nickname', null, true);

    return add_yao_prefix(href);
};

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

var add_yao_prefix = function (url) {
    return 'http://yao.qq.com/tv/entry?redirect_uri=' + encodeURIComponent(url);
};

$(function () {
    $.ajax({
        type: "get",
        async: false,
        url: domain_url + "api/common/versioncheck",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "commonApiVersionHandler",
        success: function (data) {
            if (!data.result) {
                location.href = data.redirect;
            }
            share_img = data.si ? data.si : share_img;
            share_title = data.st ? data.st : share_title;
            share_desc = data.sd ? data.sd : share_desc;
            var urlArr = window.location.href.split("/");
            urlArr.length = urlArr.length - 1;
            share_url = urlArr.join('/') + "/index.html";
            window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, share_url);
        },
        error: function () { }
    });
});

/**
 *  END OF 版本检查
 */


/**
 *  jsonp请求
 */
var getResult = function (url, data, callback, showloading, $target, isAsync, error) {

    if (showloading) {
        showLoading($target);
    }

    var url = domain_url + url;
    if (typeof (isDev) != 'undefined' && isDev.length > 0) {
        url = add_param(url, 'dev', isDev, true);
    }

    $.ajax({
        type: 'GET',
        async: typeof isAsync === 'undefined' ? false : isAsync,
        url: url,
        data: data,
        dataType: "jsonp",
        jsonp: callback,
        complete: function () {
            if (showloading) {
                hideLoading($target);
            }
        },
        success: function (data) { },
        error: function () {
            if ($.isFunction(error)) {
                error();
            }
        }
    });
};

var loadData = function (param) {
    var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", showload: true }, param);
    if (p.showload) {
        showNewLoading();
    }
    var connt = 0;
    var cbName = "";
    var cbFn = null;
    for (var i in param) {
        connt++;
        if (connt == 2) {
            cbName = i;
            cbFn = param[i];
            break;
        }
    }
    if (/test/.test(domain_url)) {
        if (!param.data) {
            param.data = {};
        }
        param.data.dev = isDev;
    }
    $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonpCallback: cbName,
        success: function (data) {
            hideNewLoading();
            cbFn(data);
        },
        error: function () {
            if (param.error) { param.error() };
            W.hideNewLoading();
            // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
        }
    });
};


/**
 *  END OF jsonp请求
 */


/**
 *  loading
 */
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

var showLoading = function ($container) {
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
        $spinner = $(t.toString()).css({ 'left': (width - spinnerSize) / 2, 'top': (height - spinnerSize) / 2 });
        $container.append($spinner);
    }
};

var hideLoading = function ($container) {
    if ($container) {
        $container.find('.spinner').hide();
    } else {
        $('body').children('.spinner').hide();
    }
    $('.copyright').removeClass('hidden');
};

var showNewLoading = function($container, tips) {
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

var hideNewLoading = function($container) {
    if ($container) {
        $container.find('.spinner').remove();
    } else {
        $('body').children('.spinner').remove();
    };
};
/**
 *  END OF loading
 */


var showWin = function (obj) {
    var p = $.extend({
        html: "", //内部html
        beforeOpenFn: null, //打开之前
        afterOpenFn: null//打开之后执行的函数
    }, obj || {});
    this.winObj = $('<div class="win"><div class="win_model"></div><div class="win_contain"><div class="win_html"></div></div></div>');
    this.close = function (fn) {
        this.winObj.remove();
        if (fn) {
            fn()
        }
        if (this.closeFn) {
            this.closeFn();
        }
    }
    this.setWidth = function (w) {
        this.winObj.css("width", w);
    }
    this.setHeight = function (h) {
        this.winObj.css("height", h);
    }
    this.setHtml = function (html) {
        this.winObj.find(".win_html").append(html || p.html);
    }
    this.initEvent = function () {
        var that = this;
        this.winObj.find(".win_close").unbind("click").click(function () {
            that.close();
        });
    }
    this.init = function (fn) {
        this.setHtml();
        if (p.beforeOpenFn) {
            p.beforeOpenFn(this.winObj, this);
        }
        $("body").append(this.winObj);
        this.initEvent();
        this.winObj.find(".win_contain").addClass("show_slow");
        if (p.afterOpenFn) {
            p.afterOpenFn(this.winObj, this);
        }
        if (fn) {
            fn();
        }
    }
}