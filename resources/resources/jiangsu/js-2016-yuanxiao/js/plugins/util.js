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

var xssEscape = function(str){
    str = str.replace('&', '&amp;');
    str = str.replace('<', '&lt;');
    str = str.replace('>', '&gt;');
    str = str.replace('\"', '&quot;');
    
    return str;
};