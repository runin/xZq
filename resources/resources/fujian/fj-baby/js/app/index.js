(function($) {
	H.index = {
		$yj: $('.yj'),
		ready:"",
		time:"",
		ist:"",
		iet:"",
		day:null,
		$btnReserve: $('#btn-reserve'),
		init: function() {
			this.event();
			this.loadResize();
			this.prereserve();
			this.rule();
			this.ani();
		},
		rule: function(){
			getResult('api/common/rule', {}, 'commonApiRuleHandler', true);
		},
		ani: function () {
			var pic = "";
			pic +='<img class="pc1" id="pc1" src="images/main-pc3.png" />';
			pic +='<img class="pc2" id="pc2" src="images/main-pc3.png" />';
			pic +='<img class="pc3" id="pc3" src="images/main-pc3.png" />';
			pic +='<img class="pc4" id="pc4" src="images/main-pc3.png" />';
			pic +='<img class="pc5" id="pc5" src="images/main-pc3.png" />';
			pic +='<img class="pc6" id="pc6" src="images/main-pc3.png" />';
			$("body").append(pic);
			document.getElementById("pc6").onload = function () {
				$(".pc1").css("opacity","1");
				$(".pc2").css("opacity","1");
				$(".pc3").css("opacity","1");
				$(".pc4").css("opacity","1");
				$(".pc5").css("opacity","1");
				$(".pc6").css("opacity","1");
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
                                me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
				}
			});
		},
		chk: function () {
			getResult('api/common/time', {}, 'commonApiTimeHandler', true);
		},
		event: function() {
			var me = H.index;
			$(".btn-rule").click(function(e) {
				e.preventDefault();
				me.btn_animate($(this));
				$('.rule-div').removeClass('bounceOutUp').addClass('bounceInDown');
				$('.rule-section').removeClass("none");
				$(".pc1").css("display","none");
				$(".pc2").css("display","none");
				$(".pc3").css("display","none");
				$(".pc4").css("display","none");
				$(".pc5").css("display","none");
				$(".pc6").css("display","none");
			});
			$(".rule-close").click(function(e){
				e.preventDefault();
				me.btn_animate($(this));
				$('.rule-div').removeClass('bounceInDown').addClass('bounceOutUp');
				setTimeout(function(){
					$('.rule-section').addClass('none');
				},800);
				$(".pc1").css("display","block");
				$(".pc2").css("display","block");
				$(".pc3").css("display","block");
				$(".pc4").css("display","block");
				$(".pc5").css("display","block");
				$(".pc6").css("display","block");
			});
			this.$yj.one("click",function(e) {
				e.preventDefault();
				$(this).removeClass('fadeInLeft');
				me.btn_animate($(this));
				//toUrl('vote.html');
				H.index.chk();
			});
			this.$btnReserve.click(function(e) {
				e.preventDefault();
				me.btn_animate($(this));
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
                            H.index.$btnReserve.addClass('none');
                        }
                    });
			});
		},
		loadResize: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			$('html, body, .main').css({
				'height': winH,
				'width': winW
			});
			$('.logo').removeClass('none').addClass('zoomIn');
			$('footer a.yj').removeClass('none').addClass('fadeInLeft');
			//$('footer a.card').removeClass('none').addClass('fadeInRight');
		},
		btn_animate: function(str){
			str.addClass('flipInY');
			setTimeout(function(){
				str.removeClass('flipInY');
			},200);
		}
	};

	W.commonApiRuleHandler = function(data) {
		if (data.code == 0) {
			$('.con-htm').html(data.rule);
		}
	};
	W.commonApiTimeHandler = function(data) {
		if (data.t) {
			H.index.time = data.t;
			var allday = timeTransform(parseInt(data.t));
			H.index.day = new Date(str2date(allday)).getDay().toString();
			if (H.index.day == '0') { H.index.day = '7'; }
			getResult('api/common/servicetime', {}, 'commonApiServicetimeHandler');
		}
	};
	W.commonApiServicetimeHandler = function(data) {
		shownewLoading();
		var me = H.index;
		if (data.code == 0) {
			if(data.fq.match(H.index.day)){
				var d = new Date();
				var today = d.getFullYear()+"-"+(parseInt(d.getMonth())+1)+"-"+d.getDate()+" ";
				me.ist = today + data.pbt;
				me.iet = today + data.pet;
				if((H.index.time>timestamp(me.ist))&&(H.index.time<timestamp(me.iet))){
					toUrl('vote.html');
				}else{
					toUrl('daliy.html');
				}
			}else{
				toUrl('daliy.html');
			}
		}
	};
})(Zepto);



$(function() {
	H.index.init();
});