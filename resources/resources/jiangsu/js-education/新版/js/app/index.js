(function($) {
	var classId = {
		$nickname: $("#nickname"),
		$headimg: $(".head-url"),
		$myGold: $(".my-gold"),
		$orderBox: $(".order-box"),
		$swiperData: $("#swiper-data"),
		$bgBlur: $(".bg-blur"),
		$srcimg: $("#srcimg"),
		$canvas: $("#canvas"),
		$canvasShow: $("#canvas-show"),
		$headLogo: $(".head_logo"),
		$footBtn: $(".foot-btn"),
	    $fBtn: $(".f-btn"),
		$commentBtn: "comment-btn",
		$signglBtn: "signgl-btn",
		$programBtn: "program-btn",
		$mallBtn: "mall-btn",
	};
	
	H.index = {
		$hdtime: [],	//互动时间
		$nowtime: null,	//系统当前时间
		$tvid: [],		//预约vid
		$reserveid: [],
		$datetime: [],
		
		$other: "",

		listData: null,
		isBgChanging: false,
		curBgIndex: null,

		init: function() {
			this.canvasH();
			this.nicknameFn();
			this.jifenFn();
			this.nowtimtFn();
		},

		canvasH: function() {
			var w = $(window).width();
			var h = $(window).height();
			classId.$canvas.css({"width":w,"height":h});
			classId.$canvasShow.css({"width":w,"height":h});
		},

		nicknameFn: function() {//个人微信昵称及头像
			var headimgurl = window.headimgurl ? window.headimgurl+"/64" : "images/avatar.jpg";
			var nickname = window.nickname ? window.nickname : "匿名" ;
			classId.$headimg.css("background-image","url('"+headimgurl+"')");
			classId.$nickname.text(nickname);
		},

		jifenFn: function() {//温馨提示
		    var that = this;
			classId.$myGold.unbind("tap").tap(function() {
				var t = simpleTpl();
				t._('<section class="pop-bg">')
				t._('<div class="friends-tips in-top">')
				t._('<div class="friends-tips-text">成功参与互动即可获得不同数量的积分，累积积分，可在奖池兑换多种好礼！</div>')
				t._('<a href="javascript:void(0);" class="btn-b" id="iknow">我知道了</a>')
				t._('</div>')
				t._('</section>')
				$("body").append(t.toString());
				that.closeFn("#iknow",".friends-tips");
			})
		},

		nowtimtFn: function() {//查询当前系统时间
		    getResult('api/common/time', {}, 'commonApiTimeHandler');
		},
		getTimeImgFn: function() {//节目管理(首页滚动图片)
			getResult('api/recommendpro/programlist', {}, 'callbackApiRedProlistHandler');
		},
		
		changeBg: function(index) {//背景切换
			H.index.curBgIndex = index;

			if(!H.index.listData[index] || !H.index.listData[index].isg){
				// FIX ME 默认背景
				return;
			}

			var bg = H.index.listData[index].isg;
			$('#srcimg').attr('src', bg);
			document.getElementById('srcimg').onload = function(){
				classId.$canvasShow.addClass("outline");
				window.set = setTimeout(function() {
					$('#canvas').css({
						'background': 'url('+bg+')',
						'background-size': '100% 100%'
					});
					setTimeout(function(){
						classId.$canvasShow.removeClass("outline");
						if(H.index.$other != H.index.curBgIndex){
							H.index.changeBg(H.index.$other);
							return false;
						}else{
							H.index.isBgChanging = false;	
						}
					}, 100);
				},2000);
			}
			
		},
		closeFn: function(classid,conclass) {//关闭弹层
			$(classid).tap(function() {
				$(conclass).removeClass("in-top").addClass("bounce-out");
				setTimeout(function() {
					$(".pop-bg").remove();
				},400);
			});
		},
		
		//--------------------预约部分------------------------//
		changeSileFn: function(index){//获取滚动图片的第几个
		    var reserveid = H.index.$reserveid[index];
			if(reserveid == "not") {
				classId.$orderBox.find("p").addClass("none");
				return;
			}
            classId.$orderBox.find("p").eq(index).removeClass("none").siblings().addClass("none");
        },
		downTimeFn: function(index) {//倒计时
			function endFn(){
				$("#dowmtime"+index).addClass("none");
			    $("#interact"+index).removeClass("none").siblings().addClass("none");
            }
			function startFn(time){
				$("#dowmtime"+index).removeClass("none").html("距离互动开始还有 "+time);
				$(".bespeak"+index).removeClass("none");
            }
			
			H.index.changeSileFn(index);//获取滚动图片的第几个
			
			var timeArr=[];
			var sctm =  H.index.$nowtime;//系统时间

			var gety = sctm.getFullYear();
			var getm = (sctm.getMonth()+1)>10?(sctm.getMonth()+1):"0"+(sctm.getMonth()+1);
			var getd = (sctm.getDate())>10?(sctm.getDate()):"0"+(sctm.getDate());
			var hst,het;
			var sarray = H.index.$hdtime;
			for(var i=0; i<sarray.length; i++) {
				clearInterval(window["dowmtime"+i]);
			}
			if(sarray[index] == "not") {
				$("#dowmtime"+index).addClass("none");
				return;
			}
			
			var s = sarray[index];
			var sa = s.substr(0,8);
			var ea = s.substr(9,8);
			
			hst = gety+"-"+getm+"-"+getd+" "+sa;
			het = gety+"-"+getm+"-"+getd+" "+ea;
			
			var pdst = parseInt(timestamp(hst));//开始时间
			var pdet = parseInt(timestamp(het));//结束时间 

			var item = {};
			item.st =pdst;
			item.et =pdet;
			item.index = index;
			timeArr.push(item);
			
			$("<div></div>").countDown({
				id:"dowmtime"+index,
				timeArr: timeArr,
				countDownFn: function (t, time, index) {//每次倒数回调
				}, atTimeFn: function (dt, index, nextstartTime, obj, nowTime, endTime) {
					startFn(obj.showTime(endTime-nowTime));
				}, inQuantumFn: function (t, index) {//在时间断内的回调函数 index 是倒到哪个时间断
				}, endFn: function (dt, index, obj, noTime) {//整个倒计时结束的回调
					endFn();
				}
			});
		},
		bespeakFn: function() {//预约活动请求
		    var leg = this.$reserveid.length;
			
			for(var i=0; i<leg; i++) {
				var reserveid = H.index.$reserveid[i];
				if(reserveid=="not") {
					continue;
				}
				var date = H.index.$datetime[i];
				if(reserveid) {
					window['shaketv'] && shaketv.preReserve_v2({tvid:yao_tv_id, reserveid:reserveid, date:date}, function(resp) {
						if (resp.errorCode == 0) {
						    $(".bespeak"+i).removeClass("grey");
						}else if(resp.errorCode == -1007) {//已经预约过的
							$(".bespeak"+i).addClass("grey");//隐藏按钮
						}
					});
				}else {
					$(".bespeak"+i).addClass("grey");//隐藏按钮
				}
			}
			this.reserveFn();
		},
		
		reserveFn: function() {//点击预约
		    $("body").delegate(".order-box a.btn-order1","tap",function(e) {
				e.preventDefault();
				if($(this).hasClass("grey")) {
					return;
				}
				var id = $(this).attr("id");
				var reserveid = $(this).attr("data-reserve");
				var date = $(this).attr("data-date");
				if(!reserveid) {
					return;
				}
				
				//shaketv.reserve_v2({tvid:10048, reserveid:155370, date:20151120},function(data) {
				shaketv.reserve_v2({tvid:yao_tv_id, reserveid:reserveid, date:date},function(data) {
					if(data.errorCode == 0) {//预约成功回调
						$("#"+id).addClass("grey");//隐藏按钮
					}
				});
			});
		},
		hrefFn: function() {//广告跳转
		    $(".swiper-slide").click(function() {
				if($(this).attr("data-href")) {
					showLoading(null, '跳转中');
					window.location.href = $(this).attr("data-href");
				}
			});
		}
	};
	W.callbackApiRedProlistHandler = function(data) {//首页滚动图
		showLoading();
		if(data && data.code == 0){
			H.index.listData = data.items;

			var items = data.items;
			var t = simpleTpl();
			var p = simpleTpl();
			if(items.length > 1) {
				$(".pagination").removeClass("none");
		    }

			for(var k=0, leg=items.length; k<leg; k++) {
				
				if(items[k].pd) {
					t._('<div class="swiper-slide" id="uid'+k+'" style="background-image:url('+items[k].is+')">');
					H.index.$hdtime.push(items[k].pd);//每个互动时间
				}else {
					t._('<div class="swiper-slide" id="uid'+k+'" data-href="'+items[k].gourl+'" style="background-image:url('+items[k].is+')">');
					H.index.$hdtime.push("not");//广告没时间
				}
				
				t._('<div class="dowmtime-con" id="dowmtime'+k+'"></div>');
				t._('</div>');
				
				p._('<p class="btnbox'+k+' none">');
				p._('<a href="javascript:void(0)" class="btn-order1 bespeak'+k+' none">预约节目</a>');
				p._('<a href="'+items[k].gourl+'" id="interact'+k+'" class="btn-order1 none">进入互动</a>');
				p._('</p>');
				
				
				// H.index.$tvid.push(10048);//节目tvid
				// H.index.$reserveid.push(155370);//业务reserveid
				// H.index.$datetime.push(20151120);//预约时间

			    if(items[k].rds && items[k].reserveId && items[k].date) {//假如存在预约
					H.index.$tvid.push(items[k].rds);//节目tvid
					H.index.$reserveid.push(items[k].reserveId);//业务reserveid
					H.index.$datetime.push(items[k].date);//预约时间
				}else {
					H.index.$tvid.push("not");//节目tvid
					H.index.$reserveid.push("not");//业务reserveid
					H.index.$datetime.push("not");//预约时间
				}
			}

			classId.$swiperData.empty().append(t.toString());
			classId.$orderBox.empty().append(p.toString());

			H.index.downTimeFn(0);
			H.index.bespeakFn();//预约请求
			H.index.changeBg(0);//改变背景
			H.index.hrefFn();//广告跳转
			
			var mySwiper = new Swiper('.swiper-container',{
				pagination: '.pagination',
				grabCursor: true,
				paginationClickable: true,
				onInit:function(){//初始化后执行的事件
					
				},
				onSlideChangeEnd: function(swiper){
					H.index.$other = $(".swiper-slide-active").index();
					H.index.downTimeFn(H.index.$other);

					if(H.index.isBgChanging){
						return false;
					}
					H.index.isBgChanging = true;
					setTimeout(function() {
						clearTimeout(window.set);
						H.index.changeBg(H.index.$other);
					},1000);	
				}
		  	});
			hideLoading();
		}else {
			hideLoading();
		}
	};
	
	W.commonApiTimeHandler = function(data) {//获取系统当前时间串
		H.index.$nowtime = new Date(parseInt(data.t));
		H.index.getTimeImgFn();
	};
	

})(Zepto);