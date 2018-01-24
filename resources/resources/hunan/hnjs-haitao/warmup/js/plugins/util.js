/*
* 工具方法以及素材全局方法
*/

//     Template
//     (c) 2011 Jason Byrne, MileSplit
//     May be freely distributed under the MIT license, with attribution.
//
// ** Usage **
//
// HTML:
// <script type="text/html" id="tmplArticle"><h1>${Title}</h1></script>
//
// JavaScript:
// $('#tmplArticle').tmpl(data).appendTo($item);
//
 
(function($){
	
	$.fn.tmpl = function(d) {
		var s = $(this[0]).html().trim();
		if (d) {
			for (k in d) {
				s = s.replace(new RegExp('\\${' + k + '}', 'g'), d[k]);
			}
		}
		return s;
	};
	
})(Zepto);

/*
* 工具方法以及素材全局方法
*/

/*
* 字符串 -> Date对象
*/
var str2date = function (str) {
    str = str.replace(/-/g, '/');
    return new Date(str);
};
 
/*
* 字符串 -> 毫秒数
*/
var timestamp = function (str) {
    return str2date(str).getTime();
};
 
/*
* Date对象 -> 字符串
* 
* @param format 例:yyyy年MM月dd日 hh:mm:ss
*/
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
};

var preloadimages = function(arr){ 
    var newimages=[], loadedimages=0
    var postaction=function(){}  //此处增加了一个postaction函数
    var arr=(typeof arr!="object")? [arr] : arr
    function imageloadpost(){
        loadedimages++
        if (loadedimages==arr.length){
            postaction(newimages) //加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
        }
    }
    for (var i=0; i<arr.length; i++){
        newimages[i]=new Image()
        newimages[i].src=arr[i]
        newimages[i].onload=function(){
            imageloadpost()
        }
        newimages[i].onerror=function(){
            imageloadpost()
        }
    }
    return { //此处返回一个空白对象的done方法
        done:function(f){
            postaction=f || postaction
        }
    }
};

var showTime = function(rT, showTpl){
    var s_ = Math.round((rT % 60000) / 100);
    s_ = subNum(dateNum(Math.round(s_ / 1000 * 100)));
    var m_ = subNum(dateNum(Math.floor((rT % 3600000) / 60000)));
    var h_ = subNum(dateNum(Math.floor((rT % 86400000) / 3600000)));
    var d_ = subNum(dateNum(Math.floor(rT / 86400000)));
    return showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_);
};

var subNum = function(num){
    numF = num.toString().substring(0,1);
    numS = num.toString().substring(1,num.length);
    return num = "<label>"+ numF + "</label><label>" + numS + '</label>';
};

var dateNum = function(num) {
    return num < 10 ? '0' + num : num;
};

(function($) {
     
    $.fn.countDown = function (options) {
        
        var defaultVal = {
            // 存放结束时间
            eAttr: 'etime',
            sAttr: 'stime', // 存放开始时间
            wTime: 300, // 以100毫秒为单位进行演算
            etpl: '%H%:%M%:%S%', // 还有...结束
            stpl: '%H%:%M%:%S%', // 还有...开始
            sdtpl: '已开始',
            otpl: '活动已结束', // 过期显示的文本模版
            stCallback: null,
            sdCallback: null,
            otCallback: null
        };

        var dateNum = function (num) {
            return num < 10 ? '0' + num : num; }; var subNum = function (num) { numF = num.toString().substring(0, 1); numS = num.toString().substring(1, num.length); return num = "" + numF + "" + numS + '';
        };
        var s = $.extend(defaultVal, options);
        var vthis = $(this);
        var runTime = function () {
            var nowTime = new Date().getTime();
            vthis.each(function () {
         
                var nthis = $(this);
                 
                var sorgT = parseInt(nthis.attr(s.sAttr));
                var eorgT = parseInt(nthis.attr(s.eAttr));
                var sT = isNaN(sorgT) ? 0 : sorgT - nowTime;
                var eT = isNaN(eorgT) ? 0 : eorgT - nowTime;
                var showTime = function (rT, showTpl) {
                    var s_ = Math.round((rT % 60000) / s.wTime);
                    s_ = subNum(dateNum(Math.min(Math.floor(s_ / 1000 * s.wTime), 59)));
                    var m_ = subNum(dateNum(Math.floor((rT % 3600000) / 60000)));
                    var h_n =Math.floor((rT % 86400000) / 3600000);
                    var h_ = subNum(dateNum(h_n));
                    var d_ = subNum(dateNum(Math.floor(rT / 86400000)));
                    nthis.html(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_)); 
                }

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
 
        setInterval(function () {
            runTime();
        }, s.wTime);
    };
     
})(Zepto);