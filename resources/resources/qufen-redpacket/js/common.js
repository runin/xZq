/*
 * 全局公共方法
 */
var W = window;

/**
 * 初始化命名空间
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
__ns('H');

var getQueryString = function(name) {
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
};

var showLoading = function($container, tips) {
    var t = simpleTpl(),
        $container = $container || $('body'),
        $spinner = $container ? $container.find('#spinner') : $('body').children('#spinner'),
        tips = tips || '努力加载中...';

    if ($spinner.length > 0) {
        $spinner.remove();
    }
    t._('<div class="custom-loading">')
        ._('<div class="loading">')
        ._('<div class="overlay"></div>')
        ._('<div class="inner">')
        ._('<p class="rotate">')
        ._('<p class="text">' + tips + '</p>')
        ._('</div>')
        ._('</div>')
        ._('</div>')
        ._('</div>');
    $container.append($(t.toString()));
};

var hideLoading = function($container) {
    if ($container) {
        $container.find('.custom-loading').remove();
    } else {
        $('body').children('.custom-loading').remove();
    };
};
var aniTrue = true;
W.showTips = function(word, pos, timer) {
    if (aniTrue) {
        aniTrue = false;
        var pos = pos || '2',
            timer = timer || 1500;
        $('body').append('<div class="alert none"></div>');
        $('.alert').css({
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
        $('.alert').html(word);
        var winW = $(window).width(),
            winH = $(window).height();
        $('.alert').removeClass('none').css('opacity', '0');
        var alertW = $('.alert').width(),
            alertH = $('.alert').height();
        $('.alert').css({ 'margin-left': -alertW / 2, 'top': (winH - alertH) / (pos - 0.2) }).removeClass('none');
        $('.alert').animate({
            'opacity': '1',
            'top': (winH - alertH) / pos
        }, 300, function() {
            setTimeout(function() {
                $('.alert').animate({ 'opacity': '0' }, 300, function() {
                    $('.alert').addClass('none').css('top', (winH - alertH) / (pos - 0.2));
                });
            }, timer);
            setTimeout(function() {
                $('.alert').remove();
                aniTrue = true;
            }, timer + 350);
        });
    };
};

var loadData = function(param) {
    var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", showload: true }, param);
    if (p.showload) {
        window.showLoading();
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
    $.ajax({
        type: p.type,
        data: param.data,
        async: p.async,
        url: p.url,
        dataType: p.dataType,
        jsonpCallback: cbName,
        success: function(data) {
            window.hideLoading();
            cbFn(data);
        },
        error: function() {
            if (param.error) { param.error() };
            window.hideLoading();
            // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
        }
    });
}

//表示全局唯一标识符 (GUID)。
function Guid(g) {
    var arr = new Array(); //存放32位数值的数组
    if (typeof(g) == "string") { //如果构造函数的参数为字符串
        InitByString(arr, g);
    } else {
        InitByOther(arr);
    }
    this.Equals = function(o) {
        if (o && o.IsGuid) {
            return this.ToString() == o.ToString();
        } else {
            return false;
        }
    }
    this.IsGuid = function() {}
        //返回 Guid 类的此实例值的 String 表示形式。
    this.ToString = function(format) {
        if (typeof(format) == "string") {
            if (format == "N" || format == "D" || format == "B" || format == "P") {
                return ToStringWithFormat(arr, format);
            } else {
                return ToStringWithFormat(arr, "D");
            }
        } else {
            return ToStringWithFormat(arr, "D");
        }
    }

    function InitByString(arr, g) {
        g = g.replace(/\{|\(|\)|\}|-/g, "");
        g = g.toLowerCase();
        if (g.length != 32 || g.search(/[^0-9,a-f]/i) != -1) {
            InitByOther(arr);
        } else {
            for (var i = 0; i < g.length; i++) {
                arr.push(g[i]);
            }
        }
    }

    function InitByOther(arr) {
        var i = 32;
        while (i--) {
            arr.push("0");
        }
    }

    function ToStringWithFormat(arr, format) {
        switch (format) {
            case "N":
                return arr.toString().replace(/,/g, "");
            case "D":
                var str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20, 32);
                str = str.replace(/,/g, "");
                return str;
            case "B":
                var str = ToStringWithFormat(arr, "D");
                str = "{" + str + "}";
                return str;
            case "P":
                var str = ToStringWithFormat(arr, "D");
                str = "(" + str + ")";
                return str;
            default:
                return new Guid();
        }

    }

}
Guid.Empty = new Guid();
Guid.NewGuid = function() {


    var g = "";
    var i = 32;
    while (i--) {
        g += Math.floor(Math.random() * 16.0).toString(16);
    }
    return new Guid(g);

}



//分享的时候用到
var hex_sha1 = function(b) {
    function k(a) {
        return g(h(f(a), a.length * 8))
    }

    function d(c) {
        var a = '',
            b;
        for (var d in c) b = c.charCodeAt(d), a += (b >> 4 & 15).toString(16) + (b & 15).toString(16);
        return a
    }

    function e(e) {
        var c = '',
            d = -1,
            a, f;
        while (++d < e.length) a = e.charCodeAt(d), f = d + 1 < e.length ? e.charCodeAt(d + 1) : 0, 55296 <= a && a <= 56319 && 56320 <= f && f <= 57343 && (a = 65536 + ((a & 1023) << 10) + (f & 1023), d++), a <= 127 ? c += b(a) : a <= 2047 ? c += b(192 | a >> 6 & 31, 128 | a & 63) : a <= 65535 ? c += b(224 | a >> 12 & 15, 128 | a >> 6 & 63, 128 | a & 63) : a <= 2097151 && (c += b(240 | a >> 18 & 7, 128 | a >> 12 & 63, 128 | a >> 6 & 63, 128 | a & 63));
        return c
    }

    function f(c) {
        var b = [];
        for (var a = 0; a < c.length * 8; a += 8) b[a >> 5] |= (c.charCodeAt(a / 8) & 255) << 24 - a % 32;
        return b
    }

    function g(d) {
        var c = '';
        for (var a = 0; a < d.length * 32; a += 8) c += b(d[a >> 5] >> 24 - a % 32 & 255);
        return c
    }

    function h(m, l) {
        m[l >> 5] |= 128 << 24 - l % 32, m[(l + 64 >> 9 << 4) + 15] = l;
        var d = [],
            e = 1732584193,
            f = -271733879,
            g = -1732584194,
            h = 271733878,
            k = -1009589776;
        for (var n = 0; n < m.length; n += 16) {
            var o = e,
                p = f,
                q = g,
                r = h,
                s = k;
            for (var b = 0; b < 80; b++) {
                b < 16 ? d[b] = m[n + b] : d[b] = c(d[b - 3] ^ d[b - 8] ^ d[b - 14] ^ d[b - 16], 1);
                var t = a(a(c(e, 5), i(b, f, g, h)), a(a(k, d[b]), j(b)));
                k = h, h = g, g = c(f, 30), f = e, e = t
            }
            e = a(e, o), f = a(f, p), g = a(g, q), h = a(h, r), k = a(k, s)
        }
        return [e, f, g, h, k]
    }

    function i(d, a, b, c) {
        return d < 20 ? a & b | ~a & c : d < 40 ? a ^ b ^ c : d < 60 ? a & b | a & c | b & c : a ^ b ^ c
    }

    function j(a) {
        return a < 20 ? 1518500249 : a < 40 ? 1859775393 : a < 60 ? -1894007588 : -899497514
    }

    function a(b, c) {
        var a = (b & 65535) + (c & 65535),
            d = (b >> 16) + (c >> 16) + (a >> 16);
        return d << 16 | a & 65535
    }

    function c(a, b) {
        return a << b | a >>> 32 - b
    }
    return b = String.fromCharCode,
        function(a) {
            return d(k(e(a)))
        }
}();



