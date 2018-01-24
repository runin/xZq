;(function($) {
	var classId = {
		$btnBox: $(".btn-box"),
		$popZezhao: $(".pop-zezhao")
	};
	
	H.index = {
		$pet: "",
		$type:"",
		$attra:"",
		$attrb:"",
		init: function() {
			this.petGet();
		},
		timeNow: function() {//系统当前时间
			getResult('api/common/time', {}, 'commonApiTimeHandler');
		},
		petAdopt: function() {//领养接口          
		    getResult('api/pet/adopt', {oi:openid, pet:H.index.$pet, nn:encodeURIComponent(nickname), hu: encodeURIComponent(headimgurl)}, 'callbackApiPetAdopt');
		},
		petGet: function() {//领养信息          
		    getResult('api/pet/get', {oi:openid, nn:encodeURIComponent(nickname), hu: encodeURIComponent(headimgurl)}, 'callbackApiPetGet');
		},
		colorBtn: function() {//选择宠物按钮
		    var that = this;
			classId.$btnBox.find("a").unbind("click").click(function() {
				var index = $(this).index();
				that.$attra = $(this).attr("class");
				that.$attrb = "btn-b-"+index;
				$(this).removeClass("btn-a-"+index).addClass("btn-b-"+index);
				$("#id"+index).click();
				window.srl = false;
				if(index == 0) {
					that.$pet = "pet_no1";
				}else if(index == 1) {
					that.$pet =  "pet_no2";
				}
				else if(index == 2) {
					that.$pet =  "pet_no3";
				}else {
					that.$pet =  "pet_no4";
				}
				H.index.$type = "pet"+index;
				H.index.petHtml();
			});
		},
		petHtml: function() {
			var t = simpleTpl();
			t._('<section class="pop-bg">')
			t._('<div class="pet-box">')
			t._('<div class="pet-bg inup '+H.index.$type+'"><span></span></div>')
			t._('<i class="pet-shade"></i>')
			t._('<i class="bolt"></i>')
			t._('</div>')
			t._('<div class="congrats-text"></div>')
			t._('<a href="javascript:void(0)" class="btn-a none" id="get-home" data-collect="true" data-collect-flag="get-home" data-collect-desc="领我回家">领我回家</a>')
			t._('<a href="javascript:void(0)" class="btn-a none" id="what-play" data-collect="true" data-collect-flag="what-play" data-collect-desc="怎么玩">怎么玩</a>')
			t._('<div class="collect none"><a href="javascript:void(0)" class="i-close"></a></div>')
			t._('</section>')
			$("body").append(t.toString());
			this.timeNow();
			this.whatPlay();
			this.getHome();
		},
		whatPlay: function() {
			$("#what-play").click(function() {
				$(".collect").removeClass("none").addClass("zoom-in");
			});
			$(".i-close").click(function() {
				$(".pop-bg").addClass("zoom-out");
				$("."+H.index.$attrb).addClass(H.index.$attra).removeClass(H.index.$attrb);
				setTimeout(function() {
					$(".pop-bg").remove();
				},500);
			});
		},
		getHome: function() {
			 $("body").delegate("#get-home", "click", function() {
				 H.index.petAdopt();
			 });
		}
	};

	W.callbackApiPetAdopt = function(data) {//领养接口
		if(data && data.code == 0) {
			window.location.href="main.html?"+new Date().getTime();
		}else {
			showTips("宠物自己跑出去溜达了~");
		}
	};
	W.commonApiTimeHandler = function(data) {//系统当前时间
	    var n = timestamp($time);
		var t = data.t;
		if(n>t) {
			$(".congrats-text").html("孵化中...<br />静等春晚结束<br />开启我们第一次亲密互动");
			$("#what-play").removeClass("none");
		}else {
			$(".congrats-text").html("恭喜你<br />获得一个宠物<br />并孵化成功");
			$("#get-home").removeClass("none");
		}
	};
	
	W.callbackApiPetGet = function(data) {//宠物信息
	    if(data && data.code==0){
			window.location.href="main.html?"+new Date().getTime();
		}else {
			classId.$popZezhao.remove();
			H.index.colorBtn();
		}
	};
	
	
	H.index.init();

})(Zepto);