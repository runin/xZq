/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		from: getQueryString('from'),
		index_bg: "images/bg-body.jpg",
		init: function () {
			var cbUrl = window.location.href;
			if(cbUrl.indexOf('cb41faa22e731e9b') < 0 ){
				$('#div_subscribe_area').css('height', '0');
			} else {
				$('#div_subscribe_area').css('height', '50px');
				$(".logo").css("width","250px");
			};
			this.event_handler();
			this.load_bg();
			this.prereserve();
		},
		event_handler : function() {
			var me = this;
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$("#btn-reserve").click(function(e) {
				e.preventDefault();
				
				var reserveId = $(this).attr('data-reserveid');
				if (!reserveId) {
					return;
				}
				shaketv.reserve(yao_tv_id, reserveId, function(data){});
			});
		},
		load_bg: function(){
			imgReady(this.index_bg, function() {
				$('body').css('background-size', document.documentElement.clientWidth + 'px ' + document.documentElement.clientHeight + 'px');
				$('body').css('background-image', 'url('+ H.index.index_bg +')');
			});
		},
		// 检查该互动是否配置了预约功能
		prereserve: function() {
			var me = this;
			$.ajax({
				type : 'GET',
				async : true,
				url : domain_url + 'program/reserve/get',
				data: {},
				dataType : "jsonp",
				jsonpCallback : 'callbackProgramReserveHandler',
				success : function(data) {
					if (!data.reserveId) {
						return;
					}
					// yao_tv_id: 微信为电视台分配的id
					window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function(resp){
						if (resp.errorCode == 0) {
							$("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId);
						}
					});
				}
			});
		}
	}
})(Zepto);

$(function(){
	H.index.init();
});


