/*
 * 素材基本功能
 *
 * @version v1.0
 * @author bobchen
 * 请勿修改此文件，如果实在无法满足需求，请联系bobchen
 */


/**
 *  初始化命名空间
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
 *  END OF 初始化命名空间
 */



/**
 *  上报点击日志以及PV统计
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
var gefrom = from || getQueryString("gefrom");

var recordUserLog = function (openid, operateDesc, operateDomId, loadingTime, flag) {

    $.ajax({
        type: "get",
        async: true,
        url: domain_url + "api/common/reportlog",
        dataType: "jsonp",
        jsonp: "callback",
        data: {
            openid: openid,
            operateDesc: encodeURIComponent(operateDesc),
            operateDomId: operateDomId,
            loadingTime: loadingTime,
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
            if (gefrom) {
                href = add_param(href, 'gefrom', gefrom, true);
            }
            setTimeout(function () {
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


var add_yao_prefix = function (url) {
    return 'http://yao.qq.com/tv/entry?redirect_uri=' + encodeURIComponent(url);
};

$(function () {

    $.ajax({
        type : "get",
        async : false,
        url : domain_url + "api/common/versioncheck",
        dataType : "jsonp",
        jsonp : "callback",
        jsonpCallback : "commonApiVersionHandler",
        success : function(data) {
            if (!data.result){
                location.href = data.redirect;
            }
            share_img = share_img ? share_img : data.si;
            share_title = share_title ? share_title : data.st;
            share_desc = share_desc ? share_desc : data.sd;
            window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, getUrl());
			
			shaketv.subscribe({//一键关注
                appid: appid,
                selector: "#div_subscribe_area",
                type: 2
            }, function (returnData) {
                //alert(JSON.stringify(returnData));
            });
        },
        error : function() {}
    });
});

/**
 *  END OF 初始化分享 
 */


/**
 *  jsonp请求
 */
var getResult = function(url, data, callback, success,showloading, $target, isAsync, timeout, error) {
    
    if (showloading) {
        showLoading($target);
    }

    var url = domain_url + url;
    if(typeof(isDev) != 'undefined' && isDev.length > 0){
        url = add_param(url, 'dev', isDev, true);
    }

    $.ajax({
        type : 'GET',
        async : typeof isAsync === 'undefined' ? false : isAsync,
        url : url,
        data: data,
        dataType : "jsonp",
        jsonpCallback : callback,
        timeout : timeout ? timeout : 0,
        complete: function() {
            if (showloading) {
                hideLoading($target);
            }
        },
        error: function() {
            if($.isFunction(error)){
                error();
            }
        },
        success: function(data){
            if($.isFunction(success)){
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


var showLoading = function ($container, tips) {
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

var hideLoading = function ($container) {
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
    if($copyright && W.copyright){
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
    if(aniTrue) {
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

/**
 *  END OF 提示框
 */