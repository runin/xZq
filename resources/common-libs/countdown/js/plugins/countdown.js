/**
 * 倒计时
 */

$.fn.countdown = function(options) {
	$.fn.countdown.defaultVal = { 
		eAttr : 'data-etime',
		sAttr : 'data-stime', // 存放开始时间
		sysTime : new Date().getTime(),	// 当前服务器时间，默认为客户端时间
		wTime : 500, 		  // 以500毫秒为单位递增
		stpl : '%H%:%M%:%S%', // 还有...开始
		etpl : '%H%:%M%:%S%', // 还有...结束
		otpl : '已结束', 		  // 结束显示的文本模版
		callback: function() {}
	};
	var opts = $.extend({}, $.fn.countdown.defaultVal, options),
		vthis = $(this),
		serverTime = opts.sysTime;
	
	var runTime = function(time) {
		serverTime += time ? time : 0;	// 服务器时间
		vthis.each(function() {
			var nthis = $(this),
				state = 1,
				sorgT = parseInt(nthis.attr(opts.sAttr)),
				eorgT = parseInt(nthis.attr(opts.eAttr)),
				sT = isNaN(sorgT) ? 0 : sorgT - serverTime,
				eT = isNaN(eorgT) ? 0 : eorgT - serverTime;
			
			var showTime = function(rT, showTpl) {
				var s_ = Math.round((rT % 60000) / opts.wTime);
				s_ = dateNum(Math.min(Math.floor(s_ / 1000 * opts.wTime), 59));
				var m_ = dateNum(Math.floor((rT % 3600000) / 60000));
				var h_ = dateNum(Math.floor((rT % 86400000) / 3600000));
				var d_ = dateNum(Math.floor(rT / 86400000));
				nthis.html(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
			};
			
			if (sT > 0) {
				// 还未开始
				state = 1;
				showTime(sT, opts.stpl);
			} else if (eT > 0) {
				// 即将结束
				state = 2;
				showTime(eT, opts.etpl);
			} else {
				// 已结束
				state = 3;
				nthis.html(opts.otpl);
			}
			opts.callback && opts.callback(state);
		});
	};
	
	runTime();
	setInterval(function() {
		runTime(opts.wTime);
	}, opts.wTime);
};