(function($) {
	H.main = {
		from: getQueryString('from'),
		cb41faa22e731e9b: getQueryString('cb41faa22e731e9b'),
		init: function () {
            // if(this.from == 'share'){
            //     H.dialog.guide.open();
            // }
			this.event();
			this.prereserve();
			this.letScroll();
		},
		event: function() {
			var me = this;
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				var that = this;
				if (!$(this).hasClass('requesting')) {
					$(this).addClass('requesting');
					H.dialog.rule.open();
					setTimeout(function(){
						$(that).removeClass('requesting');
					}, 1000);
				}
			});
			$("#btn-reserve").click(function(e) {
				e.preventDefault();
				var that = this;
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
                        $("#btn-reserve").addClass('none');
                    }
                });
				if (!$(this).hasClass('requesting')) {
					$(this).addClass('requesting');
					setTimeout(function(){
						$(that).removeClass('requesting');
					}, 1000);
				};
			});
			
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
                            $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                        }
                    });
				}
			});
		},
		letScroll: function() {
			var el = document.querySelector('.icon-car');
			var elStep = $(window).width() * 0.13;
		    var startPosition, endPosition, deltaX, deltaY, moveLength;
		    var clientWidth = $(window).width();
		    el.addEventListener('touchstart', function (e) {
		    	e.preventDefault();
		        var touch = e.touches[0];
		        startPosition = {
		            x: touch.pageX,
		            y: touch.pageY
		        }
		    });
		    el.addEventListener('touchmove', function (e) {
		    	e.preventDefault();
		        var touch = e.touches[0];
		        endPosition = {
		            x: touch.pageX,
		            y: touch.pageY
		        }
		        deltaX = endPosition.x - startPosition.x;
		        deltaY = endPosition.y - startPosition.y;
		        if(deltaX < 0) {
		        	moveLength = 0 + elStep;
		        } else if (deltaX > 0) {
		        	moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2)) + elStep;
		        };
		        if (moveLength >= 0) {
		        	$('.icon-car').css('left', moveLength);
		        };
		    });
		    el.addEventListener('touchend', function (e) {
		    	e.preventDefault();
		    	var winW = $(window).width();
		        if (moveLength < clientWidth - Math.round(clientWidth*0.55)) {
		        	$('.icon-car').animate({'left' : '13%'}, 100);
		        } else {
		        	$('.icon-car').animate({'left' : winW + 100}, 1000, function(){
		        		toUrl('lottery.html');
		        		recordUserOperate(openid, "每日农经进入摇一摇页面", "cctv7-nongye-main");
						recordUserPage(openid, "每日农经进入摇一摇页面", 0);
		        	});
		        }
		    });
		}
	};
})(Zepto);                             

$(function(){
	H.main.init();
});