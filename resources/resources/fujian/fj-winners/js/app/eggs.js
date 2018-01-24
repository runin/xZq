

var tips = [{
	id:1,
	text:"您砸的力度不够吔，换个姿势再砸！"
},{
	id:2,
	text:"哎呀！差点就中大奖了~~"
},{
	id:3,
	text:"加油，只要努力敲总会成功的！"
},{
	id:4,
	text:"预测后面还有很多大奖，就看你的咯~"
},{
	id:5,
	text:"左手敲敲，右手敲敲，总会找到敲中大奖的姿势的~"
}];

(function($) {
	H.index = {
		uuid:getQueryString("uuid"),
		href:"",
		init: function() {
			this.getqueryFn();
			this.eggsFn();
		},
		html: function() {
			var t = simpleTpl();
			t._('<section class="lottery-bg">')
			t._('<div class="lottery-box">')
			t._('<div class="lottery-con">')
			t._('<a href="###" class="pop-close" data-collect="true" data-collect-flag="winners-close" data-collect-desc="关闭中奖弹层"></a>')
			t._('<div class="lottery-border">')
			t._('<h2 class="prize-tips none">恭喜您获得<label id="pn"></label></h2>')
			t._('<p class="prize-img none" data-ci="" data-ts="" data-si=""></p>')
			//谢谢参与
			t._('<div class="prize-partake none">')
			t._('<p>您敲的力度不够吔，换个姿势再敲！</p>')
			t._('<a href="###" class="btn-a" id="btn-none" data-collect="true" data-collect-flag="winners-thanks" data-collect-desc="谢谢参与">确 定</a>')
			t._('</div>')
			//实物奖
			t._('<div class="personal-info none">')
			t._('<h3>正确填写信息，以便工作人员联系到您</h3>')
			t._('<input name="" type="text" class="ipt-text" id="rn" placeholder="姓名" />')
			t._('<input name="" type="text" class="ipt-text" id="ph" placeholder="手机号码" />')
			t._('<a href="###" class="btn-a" id="btn-sw" data-collect="true" data-collect-flag="winners-queding" data-collect-desc="中奖确定">确 定</a>')
			t._('</div>')
			//领取成功
			t._('<div class="prize-success none">')
			t._('<p>领取成功！</p>')
			t._('<a href="###" class="btn-a" id="btn-success" data-collect="true" data-collect-flag="winners-success" data-collect-desc="领取成功">确 定</a>')
			t._('</div>')
			
			t._('<a href="###" class="btn-a none" id="btn-card" data-collect="true" data-collect-flag="winners-lq-card" data-collect-desc="领取卡劵">领 取</a>')//领取卡劵
			t._('<a href="###" class="btn-a none" id="btn-hongbao" data-collect="true" data-collect-flag="winners-lq-redbao" data-collect-desc="领取红包">领 取</a>')//领取红包
			t._('<a href="###" class="btn-a none" id="btn-outside" data-collect="true" data-collect-flag="winners-lq-outside" data-collect-desc="领取外链奖品">领 取</a>')//领取外链奖品
			
			t._('</div>')
			t._('</div>')
			t._('</div>')
			t._('</section>')
			$("body").append(t.toString());
			this.lotteryFn();
		},
		lotteryFn: function() {//弹层高度
			var h = $(window).height();
			$("body,.lottery-box").css("height",h);
		},
		eggsFn: function() {
			this.eggs = $(".eggs,.hammer");
			this.eggs.click(function() {
				$(this).parent().addClass("e-open");
				setTimeout(function() {
					H.index.html();
				    $(".lottery-box").addClass("out");
					H.index.closeFn();
					getResult('api/lottery/exec/luck', {matk:matk}, 'callbackLotteryLuckHandler',true, this.$dialog);
				},800)
			});
		},
		
		awardFn: function(rn,ph) {//领奖接口
			if(!rn) rn = "";
			if(!ph) ph = "";
			getResult('api/lottery/award', {oi:openid, rn:rn, ph:ph}, 'callbackLotteryAwardHandler',true, this.$dialog);
		},
		
		receiveFn: function() {
			var that = this;
			this.btnsw = $("#btn-sw");
			this.btnsw.click(function(e) {
				e.preventDefault();
				var $rn = $("#rn");
				var rn = $.trim($rn.val());
				var $ph = $("#ph");
				var ph = $.trim($ph.val());

				if (!rn) {//姓名
					alert("请填写姓名！");
					$rn.focus();
					return false;
				}
				if (!ph) {//手机号码
					alert("请填写手机号码！");
					$ph.focus();
					return false;
				}
				if (!/^\d{11}$/.test(ph)) {//手机号码格式
					alert("这手机号，可打不通...！");
					$ph.focus();
					return false;
				}
				that.awardFn(rn,ph);
			});
		},
		
		outlinFn: function() {
			var that = this;
			$("#btn-outside").click(function() {
				that.awardFn();
			});
		},

		closeFn: function() {
			$(".pop-close,#btn-none,#btn-success").click(function(e) {
				e.preventDefault();
				$(".lottery-box").removeClass("out").addClass("go");
				setTimeout(function() {
					$(".lottery-bg").remove();
					$(".golden-egg").removeClass("e-open");
					window.location.href="competition.html?comperition='true'";
				},650);
			});
		}
	};
	
	H.index.getqueryFn = function() {
		var that = this;
		var outside = $.fn.cookie("outside");//获取cookie;
		if(getQueryString("rp") == 1) {
			that.html();
			$(".prize-success").removeClass("none"); 
			H.index.closeFn();
		}else if(!getQueryString("uuid") || outside == 1) {
			$.fn.cookie("outside",null);
			window.location.href="competition.html?comperition='true'";
		}
	};
	
	//抽奖
	W.callbackLotteryLuckHandler = function(data) {
		if(data.result == true) {
			var t = Math.floor((Math.random()*tips.length));
			$("#pn").text(data.pn+"一"+data.pu);
			$(".prize-img").css("background-image","url('"+data.pi+"')").removeClass("none");
			switch(data.pt) {
				case 0://谢谢参与
				    $(".prize-partake").removeClass("none").find("p").text(tips[t].text);
				    break;
				case 4://红包
					$(".prize-tips").removeClass("none");
					$("#btn-hongbao").attr("href",data.rp).removeClass("none");
					break;
				case 7://微信卡劵
					$(".prize-tips").removeClass("none");
					$("#btn-card").removeClass("none");
					$(".prize-img").attr({"data-ci":data.ci,"data-ts":data.ts,"data-si":data.si});
					break;
				case 9://外链奖品
					$(".prize-tips").removeClass("none");
					$("#btn-outside").removeClass("none");
					$.fn.cookie("outside",1);
					H.index.href = data.ru;
					H.index.outlinFn();
					break;
				default:
					$(".prize-tips").removeClass("none");
				    $(".personal-info").removeClass("none");
					if(data.ph){
						$("#ph").val(data.ph);
					}
					if(data.rn){
						$("#rn").val(data.rn);
					}
					H.index.receiveFn();
			}
			
		}else {
			$(".prize-partake").removeClass("none").find("p").text("亲~不中奖哦，要不换个姿势试试！");
			$(".prize-img").css("background-image","url('images/thank.png')").removeClass("none");
		}
	};
	
	W.callbackLotteryAwardHandler = function(data) {
		if(data.result == true) {
			if(H.index.href != "") {
				window.location.href = H.index.href;
				return;
			}
			$(".prize-tips,.prize-img,.personal-info").addClass("none");
			$(".prize-success").removeClass("none");
		}
	};
	

	H.index.init();

})(Zepto);