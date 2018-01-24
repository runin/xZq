/**
 */
(function($) {
	H.reaward = {
		ruid: getQueryString('ru'),
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
		init: function () {
			if(null == this.ruid){
				window.location.href = "index.html";
			}
			this.initData();
			this.event_handler();
		},
		event_handler : function() {
			var me = this;
			this.homeBtn.on("click",function(){
				window.location.href = "record.html";
			});
			this.previewBtn.on("click",function(){
				if(H.reaward.checkParam()) { //假如验证通过
	                  getResult('fjtv/award', {
	                    yoi:openid,
	                    ph:H.reaward.textPhone.val().trim(),
	                    rl:encodeURIComponent(H.reaward.textName.val().trim()),
	                    ad:encodeURIComponent(H.reaward.textAddress.val()),
	                    ruid:H.reaward.ruid,
	                    ic:$("#textidcard").val().trim(),
	                    st:3
	                  }, 'callbackFjtvAward', true);
	            }
			});
			$("#qrcode-btn").on("click",function(){
        		H.dialog.qrcode.open();
        		H.dialog.qrcode.update(H.reaward.qrcodeKey,H.reaward.qrcodeaw,0);
        	});
        	$(".use-rule").on("click",function(){
        		H.dialog.userule.open();
        		H.dialog.userule.update(me.useRule);
        	});
		},
		initData: function(){
			getResult('fjtv/reaward', {openid:openid,ruid:this.ruid}, 'callbackFjtvReaward', true);
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
	}
	
	W.callbackFjtvReaward = function(data){
		if(data.pt == 4){
			$("#btnBoxc").click(function(){
	       		 showLoading();
	       		 setTimeout(function(){
	            		location.href = data.redpack;
	       		 }, 500);
	       	 });
	       	 $(".gift-hongbao").click(function(){
	       		 showLoading();
	       		 setTimeout(function(){
	            		location.href = data.redpack;
	       		 }, 500);
	       	 });
	       	 $(".redhongbao").find("label").text(data.iv+"元");
	       	 $(".redhongbao").removeClass("none");
		}else if(data.pt == 1){
			var ptt = "恭喜您获得"+data.pn+"一"+data.pu;
			$(".itv").find("img").attr("src",data.pi);
			$(".itv").find(".gift-text").html(ptt);
			$(".itv").removeClass("none");
			$(".idcardli").addClass("none");
			$("#gift-form").removeClass("none");
		}else if(data.pt == 5){
			var ptt = "恭喜您获得"+data.pn+"一"+data.pu;
			$(".liuliang").find("img").attr("src",data.pi);
			$(".liuliang").find(".gift-text").html(ptt);
			$(".address").addClass("none");
			$(".idcardli").addClass("none");
			$(".liuliang").removeClass("none");
			$("#gift-form").removeClass("none");
		}else if(data.pt == 6){
			var ptt = "恭喜您获得"+data.pn+"一"+data.pu;
			$(".kaquan").find("img").attr("src",data.pi);
			$(".kaquan").find(".gift-text").html(ptt);
			$(".kaquan").find(".qr-text").html(data.ad);
			H.reaward.qrcodeKey = data.key;
			H.reaward.qrcodeaw = data.aw;
			$(".kaquan").removeClass("none");
		}else if(data.pt == 8){
			var ptt = "恭喜您获得"+data.pn+"一"+data.pu;
			$(".idcard").find("img").attr("src",data.pi);
			$(".idcard").find(".gift-text").html(ptt);
			H.reaward.useRule = data.ad;
			$("#qrAddress").addClass("none");
			$(".address").addClass("none");
			$(".idcard").removeClass("none");
			$("#gift-form").removeClass("none");
		}
		if(data.st != 1){
			$("#touchName").text(data.un);
	          $("#touchPhone").text(data.ph);
	          $("#touchAddress").text(data.as);
	          $("#touchIdcard").text(data.ic);
				$("#gift-form").addClass("none");
			$("#gift-qr").removeClass("none");
		}
		$("#yao-gift").removeClass("none");
	};
	
	W.callbackFjtvAward = function(data){
		if(data.code == 0){
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
	H.reaward.init();
});


