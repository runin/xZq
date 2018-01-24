/**
 * 零距离-首页
 */
(function($) {
	H.index = {
		chkimgnumb:0,
		from: getQueryString('from'),
		init: function () {
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$('#btn-join').click(function(e) {
				e.preventDefault();
				$('#btn-join').css({"-webkit-animation":"ft 0.6s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("webkitAnimationEnd", function () {
					toUrl("yiyao.html");
				});
			});
			H.index.prereserve();
			$('#btn-reserve').click(function(e) {
				e.preventDefault();
				var reserveId = $(this).attr('data-reserveid');
				var date = $(this).attr('data-date');
				if (!reserveId || !date) {
					return;
				};
				window['shaketv'] && shaketv.reserve_v2({
						tvid:yao_tv_id,
						reserveid:reserveId,
						date:date},
					function(d){
						if(d.errorCode == 0){
							$('#btn-reserve').addClass('none');
						}
					});
			});
			$(".logo").attr("src","images/logo.png");
			H.index.chkimg();
		},
		chkimg: function(){
			document.getElementById('logo').onload = function () {
				$(".btn-rl").css("top",($("#logo").height()+25)+"px");
				$(".logo").css({"-webkit-animation":"likeMd 1s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("webkitAnimationEnd", function () {

				});
			};
		},
		prereserve: function() {
			var me = this;
			$.ajax({
				type : 'GET',
				async : true,
				url : domain_url + 'api/program/reserve/get',
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
								$('#btn-reserve').removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
							}
						});
				}
			});
		}
	}
})(Zepto);                             

$(function(){
	$("body").css("height",$(window).height());
	H.index.init();
});


