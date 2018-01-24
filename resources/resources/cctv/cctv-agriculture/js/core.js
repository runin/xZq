/**
 *  初始化命名空间
 */
var __ns = function(fullNs) {
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
var __noop = function() {};
var W = W || window;
__ns('H');

/**
 *  END OF 初始化命名空间
 */



var from = getQueryString("from");
var gefrom = from || getQueryString("gefrom");
W.ReportlogCallback = function(){};

var recordUserLog = function(operateDomId, operateDesc) {
    $.ajax({
        type: "get",
        async: true,
        url: domain_url + "api/log/reportlog",
        dataType: "jsonp",
        jsonp: "callback",
        data: {
            guid: getQueryString("guid"),
            fuid: W.quanId,
            unid: W.unionId,
            opid: operateDomId ? operateDomId : '',
            opdesc: operateDesc ? operateDesc : ''
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
var recordUserOperate = function(operateDesc, operateDomId) {
    recordUserLog(operateDomId, operateDesc);
}
/**
 * 加载页面记录日志
 * 
 * @param openid 操作用户的openid
 * @param operateDesc 进入的某页面名称
 * @param loadingTime 页面加载耗时多少毫秒
 */
function recordUserPage() {
    recordUserLog();
}

var callbackUserSaveHandler = function(data) {};

$(function() {
    recordUserPage();
    $('body').delegate("*[data-collect='true']", "click", function(e) {
        e.preventDefault();

        if ($(this).attr('data-stoppropagation') == 'true') {
            e.stopPropagation();
        }
        recordUserOperate($(this).attr("data-collect-desc"), $(this).attr("data-collect-flag"));

        var href = $(this).attr('href');
        if (href && href !== '#') {
            if (gefrom) {
                href = add_param(href, 'gefrom', gefrom, true);
            }
            setTimeout(function() {
                window.location.href = href;
            }, 5);
        }
    });
});

/**
 *  END OF 上报点击日志以及PV统计
 */


/**
 *  初始化分享
 */
var getUrl = function() {
    var href = window.location.href;

    // FIX ME 分享
    // if (share_page) {
    //     href = href.replace(/[^\/]*\.html/i, share_page);
    // } else {
    //     href = href.replace(/[^\/]*\.html/i, 'index.html');
    // }

    href = add_param(href, 'friUid', W.unionId, true);
    href = add_param(href, 'from', 'share', true);

    href = add_param(href, 'unionid', null, true);
    href = add_param(href, 'codeUserUuid', null, true);
    href = add_param(href, 'userUuid', null, true);
    href = add_param(href, 'headimgurl', null, true);
    href = add_param(href, 'nickname', null, true);

    return href;
};

var add_param = function(sourceUrl, parameterName, parameterValue, replaceDuplicates) {
    if ((sourceUrl == null) || (sourceUrl.length == 0)) {
        sourceUrl = document.location.href;
    }
    var urlParts = sourceUrl.split("?");
    var newQueryString = "";
    if (urlParts.length > 1) {
        var parameters = urlParts[1].split("&");
        for (var i = 0;
            (i < parameters.length); i++) {
            var sindex = parameters[i].search("=");
            var tname = parameters[i].substring(0, sindex);
            var tval = parameters[i].substring(sindex + 1, parameters[i].length);

            if (!(replaceDuplicates && tname == parameterName)) {
                if (newQueryString == "") {
                    newQueryString = "?";
                } else {
                    newQueryString += "&";
                }
                newQueryString += tname + "=" + tval;
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


/**
 *  END OF 初始化分享 
 */


/**
 *  jsonp请求
 */
var getResult = function(url, data, callback, success, showloading, $target, isAsync, timeout, error) {

    if (showloading) {
        showLoading($target);
    }

    var url = domain_url + url;
    if (typeof(isDev) != 'undefined' && isDev.length > 0) {
        url = add_param(url, 'dev', isDev, true);
    }

    $.ajax({
        type: 'GET',
        async: typeof isAsync === 'undefined' ? false : isAsync,
        url: url,
        data: data,
        dataType: "jsonp",
        jsonpCallback: callback,
        timeout: timeout ? timeout : 0,
        complete: function() {
            if (showloading) {
                hideLoading($target);
            }
        },
        error: function() {
            if ($.isFunction(error)) {
                error();
            }
        },
        success: function(data) {
            if ($.isFunction(success)) {
                success(data);
            }
        }
    });

};
/**
 *  END OF jsonp请求
 */


/**
 *  loading
 */
var simpleTpl = function(tpl) {
    tpl = $.isArray(tpl) ? tpl.join('') : (tpl || '');

    return {
        store: tpl,
        _: function() {
            var me = this;
            $.each(arguments, function(index, value) {
                me.store += value;
            });
            return this;
        },
        toString: function() {
            return this.store;
        }
    };
};


var showLoading = function($container, tips) {
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
        ._('<section class="qy-loading-tips">' + tips + '</section>')
        ._('</section>')
    $container.append(t.toString());
};

var hideLoading = function($container) {
    if ($container) {
        $container.find('#qy_loading').remove();
    } else {
        $('body').children('#qy_loading').remove();
    };
}


/**
 *  END OF loading
 */



/**
 *  版权配置化
 */
$(function() {
    var $copyright = $('.copyright');
    if ($copyright && W.copyright) {
        $copyright.html(W.copyright).removeClass('none');
    };
});
/**
 *  END OF 版权配置化
 */


/**
 *  提示框
 */
var aniTrue = true;
var showTips = function(word, pos, timer) {
    if (aniTrue) {
        aniTrue = false;
        var pos = pos || '2',
            timer = timer || 1500;
        $('body').append('<div class="tips none"></div>');
        $('.tips').css({
            'position': 'fixed',
            'max-width': '80%',
            'top': '60%',
            'left': '50%',
            'z-index': '99999999',
            'color': 'rgb(255, 255, 255)',
            'padding': '20px 10px',
            'border-radius': '5px',
            'margin-left': '-120px',
            'background': 'rgba(0, 0, 0, 0.8)',
            'text-align': 'center'
        });
        $('.tips').html(word);
        var winW = $(window).width(),
            winH = $(window).height();
        $('.tips').removeClass('none').css('opacity', '0');
        var tipsW = $('.tips').width(),
            tipsH = $('.tips').height();
        $('.tips').css({ 'margin-left': -tipsW / 2, 'top': (winH - tipsH) / (pos - 0.2) }).removeClass('none');
        $('.tips').animate({
            'opacity': '1',
            'top': (winH - tipsH) / pos
        }, 300, function() {
            setTimeout(function() {
                $('.tips').animate({ 'opacity': '0' }, 300, function() {
                    $('.tips').addClass('none').css('top', (winH - tipsH) / (pos - 0.2));
                });
            }, timer);
            setTimeout(function() {
                $('.tips').remove();
                aniTrue = true;
            }, timer + 350);
        });
    };
};

/**
 *  END OF 提示框
 */
var loadData = function(param) {
    var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", showload: true }, param);
    if (p.showload) {
        showLoading();
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
        //param.data.dev = isDev;
    }
    $.ajax({
        type: p.type,
        data: param.data,
        async: p.async,
        url: p.url,
        dataType: p.dataType,
        jsonpCallback: cbName,
        success: function(data) {
            hideLoading();
            cbFn(data);
        },
        error: function() {
            alert("抱歉请稍后再试code=502");
            if (param.error) { param.error() };
            W.hideLoading();
            // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
        }
    });
};


$(function(){
    
    $("a").each(function(){
        var guid = getQueryString('guid');
        var that = $(this);
        var href = that.attr("href");
        if (href) {
            if (href.indexOf("javascript:") == -1) {
                if (href.split("?").length == 2) {
                    href += "&guid=" + guid;
                } else {
                    href += "?guid=" + guid;
                }
            }
            that.attr("href", href);
        }
    });


    W.GroupInfoCallback = function(data){
        if(data.code == 0){
            setTitle(data.name ? data.name : '首页');
            if(W.groupInited && $.isFunction(W.groupInited)){
                W.groupInited(data);
            }
        }else{
            noGroupExist();
        }
    };

    var guid = getQueryString('guid');
    if(guid && guid != ''){
        W.guid = guid;
        getResult('api/group/info', {
            guid : guid
        }, 'GroupInfoCallback', null, null, null, null, null, function(){
            netWorkError();
        });

    }else{
        noGroupExist();
    }

    
    
});

