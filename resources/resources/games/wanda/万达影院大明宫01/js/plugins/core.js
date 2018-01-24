/*
 * 素材基本功能
 *
 * @version v1.1
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
 *  END OF 上报点击日志以及PV统计
 */


/**
 *  版本检查
 */
 var getUrl = function () {
    var href = window.location.href;
	if(href.indexOf("http://yao.qq.com/tv/entry?redirect_uri=") != -1) {
		var i = href.indexOf("=");
		href = href.substr(i+1);
	}
	
    var uid = getQueryString('uid');
    var auid = getQueryString('auid');
    if(uid){
        // 足迹分享
        href = href;
        href = add_param(href, 'toShare', null, true);
    }else if(auid){
        // 新闻分享
        href = href;
        href = add_param(href, 'toShare', null, true);
    }else{
        if(share_page){
            href = href.replace(/[^\/]*\.html/i, share_page);
        }else{
            href = href.replace(/[^\/]*\.html/i, 'index.html');
        }
    }

    href = add_param(href, 'resopenid', hex_md5(openid), true);
    href = add_param(href, 'from', 'share', true);

    href = add_param(href, 'openid', null, true);
    href = add_param(href, 'headimgurl', null, true);
    href = add_param(href, 'nickname', null, true);
    return href;
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
                var href = data.redirect;
                if(href.indexOf("http://yao.qq.com/tv/entry?redirect_uri=") != -1) {
                    var i = href.indexOf("=");
                    href = href.substr(i + 1);
                }
                location.href = decodeURIComponent(href);
                return;
            }
            share_img = share_img ? share_img : data.si;
            share_title = share_title ? share_title : data.st;
            share_desc = share_desc ? share_desc : data.sd;
            window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, getUrl());
            window.callbackMpJsapiTicketHandler = function(data) {};
            $.ajax({
                type: 'GET',
                url: domain_url + 'api/mp/auth/jsapiticket',
                data: {
                    mpappid: mpappid
                },
                async: true,
                dataType: 'jsonp',
                jsonpCallback: 'callbackMpJsapiTicketHandler',
                success: function(data){
                    if (!data.result) {
                        return;
                    }
                    var nonceStr = 'da7d7ce1f499c4795d7181ff5d045760',
                        timestamp = Math.round(new Date().getTime()/1000),
                        url = window.location.href.split('#')[0],
                        signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);

                    wx.config({
                        appId: mpappid,   
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: [
                            'onMenuShareAppMessage',
                            'onMenuShareTimeline',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone'
                        ]
                    });

                    wx.ready(function(){

                        wx.onMenuShareTimeline({
                            title: share_title,
                            link: getUrl(),
                            imgUrl: share_img
                        });

                        wx.onMenuShareAppMessage({
                            title: share_title,
                            desc: share_desc,
                            link: getUrl(),
                            imgUrl: share_img
                        });

                        wx.onMenuShareQQ({
                            title: share_title,
                            desc: share_desc,
                            link: getUrl(),
                            imgUrl: share_img
                        });

                        wx.onMenuShareWeibo({
                            title: share_title,
                            desc: share_desc,
                            link: getUrl(),
                            imgUrl: share_img
                        });

                        wx.onMenuShareQZone({
                            title: share_title,
                            desc: share_desc,
                            link: getUrl(),
                            imgUrl: share_img
                        });

                    });
                },
                error: function(xhr, type){
                     // alert('获取微信授权失败');
                }
            });


        },
        error: function () {}
    });
});

/**
 *  END OF 版本检查
 */


/**
 *  jsonp请求
 */
var getResult = function(url, data, callback, showloading, $target, isAsync, error) {
    
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
        jsonp : callback,
        complete: function() {
            if (showloading) {
                hideLoading($target);
            }
        },
        success : function(data) {},
        error: function() {
            if($.isFunction(error)){
                error();
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

//时间转换
var str2date = function(str) {
    str = str.replace(/-/g, '/');
    return new Date(str);
};
var timestamp = function(str) {
    return Date.parse(str2date(str));
};
/**
 *  END OF loading
 */