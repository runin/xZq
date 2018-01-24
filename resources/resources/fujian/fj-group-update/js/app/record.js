/**
 */
(function($) {
	H.record = {
		c:getQueryString("c"),
		recordList:[],
		textName: $("#textname"),
		textPhone: $("#textphone"),
		textAddress: $("#textaddress"),
		addressLi: $(".address"),
		idcardLi: $(".idcardli"),
		textIdcard: $("#textidcard"),
		previewBtn: $("#btnBoxa"),
		homeBtn: $("#btnBoxb"),
		redBtn: $("#btnBoxc"),
		qrcodeKey:"",
		qrcodeaw:"",
		useRule:"",
		ruid:'',
		init: function () {
			this.list();
			this.event_handler();
		},
		event_handler : function() {
			$("#back-btn").on("click",function(){
				if(H.record.c == "index"){
					window.location.href = "index.html";
				}else{
					window.location.href = "support.html";
				}
			});
			this.homeBtn.on("click",function(){

				$("#yao-gift").addClass("none");
				$(".bangtuan").addClass("none");
				$("#list").removeClass("none");
			});
			this.previewBtn.on("click",function(){
				if(H.record.checkParam()) { //假如验证通过
					var phone = H.record.textPhone.val().trim();
					var name = H.record.textName.val().trim();
					var address = H.record.textAddress.val();
					var idcard = $("#textidcard").val().trim();
					getResult('api/lottery/receive' + dev, {
						oi: openid,
						ru: H.record.ruid,
						rn: name ? encodeURIComponent(name) : "",
						ad: address ? encodeURIComponent(address) : "",
						ph: phone ? phone : "",
						ic: idcard ? idcard : ""
					}, 'callbackLotteryReceiveHandler', true);
				}
			});
			$("#qrcode-btn").on("click",function(){
				H.dialog.qrcode.open();
				H.dialog.qrcode.update(H.record.qrcodeKey,H.record.qrcodeaw,0);
			});
			$(".use-rule").on("click",function(){
				H.dialog.userule.open();
				H.dialog.userule.update(me.useRule);
			});
		},
		list: function(){
			var endDate = getBeforeDate(7), nowDay = timeTransform(new Date().getTime()).split(" ")[0];
			getResult('api/lottery/record' + dev, {
				oi: openid,
				bd: endDate,
				ed: nowDay
			}, 'callbackLotteryRecordHandler', true);
		},
		view : function(index){
			var me = this;
			var data = me.recordList[index];
			me.ruid = data.ru;
			if(data.pt == 4){
				$("#btnBoxc").click(function(){
					showLoading();
					setTimeout(function(){
						location.href = data.rp;
					}, 500);
				});
				$(".gift-hongbao").click(function(){
					showLoading();
					setTimeout(function(){
						location.href = data.rp;
					}, 500);
				});
				$(".red-img").attr("src",data.pi);
				$(".redhongbao").removeClass("none");
			}else if(data.pt == 1){
				var ptt = "恭喜您获得"+data.pn;
				$(".itv").find("img").attr("src",data.pi);
				$(".itv").find(".gift-text").html(ptt);
				$(".itv").removeClass("none");
				$(".idcardli").addClass("none");
				$("#gift-form").removeClass("none");
			}else if(data.pt == 6){
				var ptt = "恭喜您获得"+data.pn;
				$(".liuliang").find("img").attr("src",data.pi);
				$(".liuliang").find(".gift-text").html(ptt);
				$(".address").addClass("none");
				$(".idcardli").addClass("none");
				$(".liuliang").removeClass("none");
				$("#gift-form").removeClass("none");
			}else if(data.pt == 5){
				var ptt = "恭喜您获得"+data.pn;
				$(".kaquan").find("img").attr("src",data.pi);
				$(".kaquan").find(".gift-text").html(ptt);
				$(".kaquan").find(".qr-text").html(data.aa);
				H.record.qrcodeKey = data.cc;
				H.record.qrcodeaw = data.pd;
				$(".kaquan").removeClass("none");
			}else if(data.pt == 11){
				var ptt = "恭喜您获得"+data.pn;
				$(".idcard").find("img").attr("src",data.pi);
				$(".idcard").find(".gift-text").html(ptt);
				H.record.useRule = data.pd;
				$("#qrAddress").addClass("none");
				$(".address").addClass("none");
				$(".idcard").removeClass("none");
				$("#gift-form").removeClass("none");
			}
			if(data.su == 3 && data.pt != 5){
				$("#touchName").text(data.rn);
				$("#touchPhone").text(data.ph);
				$("#touchAddress").text(data.ad);
				$("#touchIdcard").text(data.ic);
				$("#gift-form").addClass("none");
				$("#gift-qr").removeClass("none");
			}
			$("#list").addClass("none");
			$("#yao-gift").removeClass("none");
			$(".bangtuan").removeClass("none");
		},
		checkParam: function() {//验证参数
			if (this.textName.val().trim() == "") {//姓名
				H.dialog.showWin.open("请填写姓名！");
				return false;
			}
			if (this.textPhone.val().trim() == "") {//手机号码
				H.dialog.showWin.open("请填写手机号码！");
				return false;
			}
			if (!/^\d{11}$/.test(this.textPhone.val())) {//手机号码格式
				H.dialog.showWin.open("这手机号，可打不通...");
				return false;
			}
			if(this.addressLi.css("display") != "none") {
				if (this.textAddress.val().length < 5 || this.textAddress.val().length > 60) {//地址
					H.dialog.showWin.open("地址长度应在5到60个字！");
					return false;
				}
			}
			if(!this.idcardLi.hasClass("none")) {
				if (this.textIdcard.val().length < 18 || this.textIdcard.val().length > 18) {//地址
					H.dialog.showWin.open("请输入正确的身份证号码！");
					//alert("请填写地址！");
					return false;
				}
			}
			return true;
		}
	};
	
	W.callbackLotteryRecordHandler = function(data){
		var t = simpleTpl();
		if(data.result){
			H.record.recordList = data.rl;
			var rcds = data.rl;
			for(var i = 0;i < rcds.length;i++){
				var rcd = rcds[i];
				var img = rcd.pt == 4?"./images/red.png":rcd.pi;
				var cls = rcd.su == 3?"noaccept":"accept";
				var licls = rcd.su == 3?"no":"yes";
				var txt = rcd.su == 3?"已领取":"未领取";
				var qrdata = "";
				var qrtxt = "";
				if(rcd.pt == 5){
					cls = "accept";
					licls = "yes";
					txt = "二维码";
					qrdata = rcd.cc;
				}
				if(rcd.pt == 1){
					cls = "accept";
					licls = "yes";
					txt = "查看";
				}
				t._('<li class="'+licls+'" id="'+rcd.ru+'" data-source="'+qrdata+'" data-index="'+i+'">')
					._('<img src="'+img+'">')
					._('<div class="con">')
					._('<p class="prname">'+rcd.pn+'</p>')
					._('<p class="prtime">中奖时间：'+rcd.lt+'</p>')
					._('</div>')
					._('<a class="'+cls+'">'+txt+'</a>')
					._("</li>");
			}
			$("#rcds").html(t.toString());
			$(".yes").on("click",function(){
				H.record.view($(this).attr("data-index"));
			});
		}else{
			t._('<li>')
				._('<span class="norecord">还没有中奖记录，继续加油哦~</span>')
				._("</li>");
			$("#rcds").html(t.toString());
		}
	};
	W.callbackLotteryReceiveHandler = function(data){
		if(data.result){
			$("#gift-form").addClass("none");
			$("#gift-qr").removeClass("none");
			if($(".address").css("display") == "none") {
				$("#qrAddress").addClass("none");
			}else {
				$("#qrAddress").removeClass("none");
			}
			if($(".idcardli").css("display") == "none") {
				$("#qrIdcard").addClass("none");
			}else {
				$("#qrIdcard").removeClass("none");
			}
			$("#touchName").text($("#textname").val().trim());
			$("#touchPhone").text($("#textphone").val().trim());
			$("#touchAddress").text($("#textaddress").val());
			$("#touchIdcard").text($("#textidcard").val());
		}
	};
})(Zepto);

$(function(){
	H.record.init();
});


