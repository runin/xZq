$("body").css({
	"width": $(window).width() + "px",
	"height": $(window).height() + "px"
});
$(function() {
	(function($) {
		H.index = {
			init: function () {
				var me = this;
				me.event();
				me.prereserve();
			},
			event: function () {
				$("#btn-rule").click(function () {
					H.dialog.rule.open();
				});
				$(".bottom-btn a").click(function (e) {
					$(this).addClass("clicked");
				});
			},
			prereserve: function() {
				var me = this;
				$.ajax({
				 type : 'GET',
				 async : true,
				 url : domain_url + 'api/program/reserve/get' + dev,
				 data: {},
				 dataType : "jsonp",
				 jsonpCallback : 'callbackProgramReserveHandler',
				 success : function(data) {
					 if (!data.reserveId) {
						 return;
					 }
					 window['shaketv'] && shaketv.preReserve_v2({
						 tvid:yao_tv_id,
						 reserveid:data.reserveId,
						 date:data.date},
					 function(resp){
						 if (resp.errorCode == 0) {
							 $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
						 } else {
							 $("#btn-reserve").addClass('none');
						 }
					 });
				 }
				});
			},
		};
	})(Zepto);
	H.index.init();
});