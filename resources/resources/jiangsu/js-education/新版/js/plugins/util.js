/*
* 工具方法以及素材全局方法
*/

//时间转换
var str2date = function(str) {
    str = str.replace(/-/g, '/');
    return new Date(str);
};
var timestamp = function(str) {
    return Date.parse(str2date(str));
};

;(function($){
	
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


var setTitle = function(title){
	if(title){
		document.title = title;
		var $body = $('body');
		var $iframe = $('<iframe style="display:none;" src="/images/avatar.jpg"></iframe>').on('load', function() {
			setTimeout(function() {
				$iframe.off('load').remove()
			}, 0)
		}).appendTo($body);
	}
	
};
