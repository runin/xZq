/**
 * @author  : jackyqin@holdfun.cn
 * @date    : 2015.01.08
 */

(function($) {
	
	H.index = {
		init: function() {
			// **************** 构造时间测试用 ****************
			$('.countdown').each(function(index) {
				var $tg = $(this),
					$parent = $tg.parent(),
					curr = new Date().getTime(),
					before = curr - 30 * 60 * 60 * 1000,
					after = curr + 30 * 60 * 60 * 1000,
					stime = '',
					etime = '';
					
				switch (index) {
					case 0:
						stime = before;
						etime = after;
						break;
					case 1:
						stime = curr - 60 * 1000;
						etime = curr;
						break;
					case 2:
						stime = after;
						etime = after + 60 * 1000;
						break;
				}
				$(this).attr('data-stime', stime).attr('data-etime', etime);
				$parent.prepend('<label>' + dateformat(new Date(stime), 'yyyy-MM-dd hh:mm:ss') + ' ~ ' + dateformat(new Date(etime), 'yyyy-MM-dd hh:mm:ss') + '</label>');
			});
			// **************** 构造时间测试用 end ****************
			
			$('.countdown').countdown({
				stpl: '<span class="state1">还未开始</span>',
				etpl: '<span class="state2">正在进行：%D%天%H%:%M%:%S%</span>', 
				otpl: '<span class="state3">已结束</span>',
				callback: function(state) {
					console.log('state: ', state);
				}
			});
		}
	
	};
	
})(Zepto);

$(function() {
	H.index.init();
});