//-------------//
//----签到----//

(function($) {
	
	var signClss = {
		$signQdBtn: $("#sign-qd-btn"),
		$fBtn: $(".f-btn")
	};
	
	H.sign = {
		$cud:null,//现在系统时间
		$st:null,//当天签到开始时间
		$et:null,//当天签到结束
		$the:0,//当天签到是哪一个
		$nowt:null,//当天的签到日
		init: function() {
			//this.signqdbtnFn();
		},

		signqdbtnFn: function() {
			var that = this;
			signClss.$signQdBtn.tap(function() {
				setTimeout(function() {
					if($("body").find(".pop-sign").length > 0) {
						$(".pop-sign").removeClass("none");
						$(".sign-in").addClass("in-top");
					}else {
						that.signHtml();
					}
				},800)
			});
		},

		signHtml: function(data) {//签到html
			var t = simpleTpl();
			var ta = 9.5;
			var tb = 24.5;
			var tc = 39.5;
			var td = 54;
			var te = 69;
			var tf = 7.5;
			var tg = 22;
			var th = 51.8;
			
			var b = [];
			var d=e= 6;
			var c=f= 0;
			
			var lb = 0;
			var lc = 0;
			var ld = 0;
				
			t._('<section class="pop-sign">')
			t._('<div class="sign-in in-top">')
			t._('<div class="sign-in-box">')
			for(var i=0; i<31; i++) {
				
				if(i<7) {
					b.push(i*14.5);
					if(i==5) {
						t._('<span class="sign-in-gold gold-d" id="sign'+i+'" style="top:'+tf+'%;left:'+b[i]+'%"></span>')
					}else {
						t._('<span class="sign-in-gold gold-a" id="sign'+i+'" style="top:'+ta+'%;left:'+b[i]+'%"></span>')
					}
				}
				if(i>6 && i<14) {
					lb = b[d];
					d = d-1;
					if(i==11) {
						t._('<span class="sign-in-gold gold-d" id="sign'+i+'" style="top:'+tg+'%;left:'+lb+'%"></span>')
					}else {
						t._('<span class="sign-in-gold gold-a" id="sign'+i+'" style="top:'+tb+'%;left:'+lb+'%"></span>')
					}
				}
				if(i>13 && i<21) {
					lc = b[c];
					c = c+1;
					t._('<span class="sign-in-gold gold-a" id="sign'+i+'" style="top:'+tc+'%;left:'+lc+'%"></span>')
				}
				if(i>20 && i<28) {
					ld = b[e];
					e = e-1;
					if(i==27) {
						t._('<span class="sign-in-gold gold-d" id="sign'+i+'" style="top:'+th+'%;left:'+ld+'%"></span>')
					}else {
						t._('<span class="sign-in-gold gold-a" id="sign'+i+'" style="top:'+td+'%;left:'+ld+'%"></span>')
					}
				}
				if(i>27 && i<31) {
					le = b[f];
					f = f+1;
					t._('<span class="sign-in-gold gold-a" id="sign'+i+'" style="top:'+te+'%;left:'+le+'%"></span>')
				}
			}
			t._('</div>')
			t._('<div class="sign-time">已签到 <lable id="mycount">0</lable> 天</div>')
			t._('<div class="sign-btn-bg"><a href="javascript:void(0);" class="sign-btn" id="sign-btn" data-collect="true" data-collect-flag="education-sign-btn" data-collect-desc="点击签到"></a><a href="javascript:void(0);" class="sign-btn-return none" id="sign-btn-return"></a></div>')
			t._('</div>')
			t._('</section>')
			
			$("body").append(t.toString());
			this.closeFn();
			this.signFn();
	},

	signFn: function() {//获取签到活动
	    getResult('api/sign/round', {}, 'callbackSignRoundHandler');
	},
		
	issignFn: function() {//判断是否已经签到过某个活动
	    getResult('api/sign/myrecord', {yoi:openid}, 'callbackSignMyRecordHandler');
	},
	
	issignimgFn: function() {//当天签到的头像
		var span = $(".sign-in-box span");
		if(headimgurl) {
			span.eq(H.sign.$the).append('<i class="sign-myhead"><img src="'+headimgurl+'" /><em></em></div>');
		}else {
			span.eq(H.sign.$the).append('<i class="sign-myhead"><img src="images/avatar.jpg" /><em></em></div>');
		}
		$("#sign"+H.sign.$the).addClass("gold-on");
	},
	
	signBtn: function(auid) {//点击签到保存签到记录
		$("#sign-btn").unbind("tap").tap(function() {
			var span = $(".sign-in-box").find("span");
			if($(".sign-in-box span").eq(H.sign.$the).hasClass("gold-on")) {
				alert("已签到过！");
				return;
			}
			if(H.sign.$cud && H.sign.$st && H.sign.$et && H.sign.$cud>H.sign.$st && H.sign.$cud<H.sign.$et) {
				getResult('api/sign/signed', {yoi:openid, auid:auid}, 'callbackSignSignedHandler');
			}else {
				alert("暂时不能签到")
			}
		});
	},
	closeFn: function() {
		$("#sign-btn-return").tap(function() {
			//signClss.$fBtn.removeClass("f-an");
			$(".sign-in").removeClass("in-top").addClass("bounce-out");
			setTimeout(function() {
				$(".pop-sign").addClass("none");
				$(".sign-in").removeClass("bounce-out");
			},400);
		});
	}
};

	W.callbackSignRoundHandler = function(data) {
		if(data&&data.code == 0){
			var pst = timestamp(data.pst);//开始时间
			var pet = timestamp(data.pet);//结束时间
			var cud = data.cud;//当前时间
			var items = data.items.reverse();
			var leg = items.length;
			var st= null,
			    et= null;
			var m = 0;
			if(cud>pst && cud<pet) {
				for(var i=0; i<leg; i++) {
					st = timestamp(items[i].st);
					et = timestamp(items[i].et);
					//m = parseInt(items[i].st.substr(8,2))-1
					m = new Date(timestamp(items[i].st)).getDate()-1;
					$("#sign"+m).attr({"data-uid":items[i].uid});
					if(cud>st && cud<et) {
						H.sign.$the = m;
						H.sign.$st = st;
						H.sign.$et = et;
						H.sign.$cud = cud;
						H.sign.signBtn(items[i].uid);//点击签到
					}
				}
				H.sign.issignFn();//是否签到过
			}
		}else {
			$("#sign-btn").addClass("none");
			$("#sign-btn-return").removeClass("none");
		}
	};
	
	W.callbackSignMyRecordHandler = function(data) {//是否签到过
	    if(data&&data.code == 0){
			var items = data.items;
			$("#mycount").html(items.length);
			for(var i=0,leg=items.length; i<leg; i++) {
				var t = timestamp(items[i].t);
				var l = new Date(t).getDate()-1;
				$("#sign"+l).addClass("gold-on");
				if(H.sign.$the==l) {
					H.sign.issignimgFn();
					$("#sign-btn").addClass("none");
					$("#sign-btn-return").removeClass("none");
				}
			}
		}
	};
	
	W.callbackSignSignedHandler = function(data) {//保存签到记录
	    if(data&&data.code == 0){
			var text = parseInt($("#mycount").text())+1;
			$("#mycount").text(text);
			$("#sign-btn").addClass("none");
			$("#sign-btn-return").removeClass("none");
			var jf = parseInt($("#integration").text());
			$("#integration").text(jf+parseInt(data.signVal));
			H.sign.issignimgFn();
		    showTips("签到成功！");
			window.self();
		}else {
			showTips('签到失败');
			$(".sign-in").removeClass("in-top").addClass("bounce-out");
			setTimeout(function() {
				$(".pop-sign").addClass("none");
				$(".sign-in").removeClass("bounce-out");
			},400);
		}
	};

})(Zepto);